import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import UserContext from "@/context/UserContext";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { fetchAdminDashboard } from "@/slices/adminSlice";

const userReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN": {
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload,
            };
        }
        case "LOGOUT": {
            return { ...state, isLoggedIn: false, user: null };
        }
        default: {
            return { ...state };
        }
    }
};

export default function AuthProvider(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userState, userDispatch] = useReducer(userReducer, {
        user: null,
        isLoggedIn: false,
    });

    useEffect(() => {
        if (localStorage.getItem("token")) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get("users/profile", {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    });
                    userDispatch({ type: "LOGIN", payload: response.data });
                    if (response.data.role == "admin") {
                        dispatch(fetchAdminDashboard());
                    }
                } catch (err) {
                    toast.error("something went wrong, please login again", {
                        theme: "error",
                    });
                    localStorage.removeItem("token");
                    userDispatch({ type: "LOGOUT" });
                    navigate("/login");
                }
            };
            fetchUser();
        }
    }, []);

    const handleRegister = async (formData, resetForm) => {
        try {
            const toastId = toast.loading("Registering...");
            const response = await axios.post("/register", formData);
            console.table(response.data);
            await setTimeout(() => {
                toast.dismiss(toastId);
                toast.success("Registered successfully!", { theme: "success" });
                resetForm();
                navigate("/login");
            }, 2000);
        } catch (err) {
            toast.dismiss();
            console.error(
                "Backend validation errors:",
                err?.response?.data?.error
            );
            const errorMessage = Array.isArray(err?.response?.data?.error)
                ? err.response.data.error.map((e) => e.message).join(", ")
                : err?.response?.data?.error || "Registration failed";
            toast.error(errorMessage, { theme: "error" });
        }
    };

    const handleLogin = async (formData, resetForm) => {
        try {
            const toastId = toast.loading("Logging in...", {
                theme: "loading",
            });
            const response = await axios.post("/login", formData);
            localStorage.setItem("token", response.data.token);
            const userResponse = await axios.get("/users/profile", {
                headers: { Authorization: localStorage.getItem("token") },
            });
            userDispatch({ type: "LOGIN", payload: userResponse.data });
            console.table(userResponse.data);
            await setTimeout(() => {
                toast.dismiss(toastId);
                toast.success("Logged in successfully!", { theme: "success" });
                resetForm();
                if (userResponse.data.role === "student") {
                    navigate("/home");
                } else if (userResponse.data.role === "teacher") {
                    navigate("/instructor");
                } else if (userResponse.data.role === "admin") {
                    dispatch(fetchAdminDashboard());
                    navigate("/admin");
                }
            }, 2000);
        } catch (err) {
            toast.dismiss();
            const errorMessage = err?.response?.data?.error || "Login failed";
            toast.error(errorMessage, { theme: "error" });
        }
    };

    const handleProfileUpdate = async (formData) => {
        try {
            const response = await axios.put("/users/profile", formData, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            userDispatch({ type: "LOGIN", payload: response.data });
            toast.success("profile updated!", { theme: "success" });
        } catch (err) {
            const errorMessage =
                err?.response?.data?.error || "Profile Update failed";
            toast.error(errorMessage, { theme: "error" });
        }
    };

    const handlePasswordChange = async (formData, resetForm) => {
        try {
            const response = await axios.put("/users/password", formData, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            if (response?.status === 200) {
                toast.success("Password updated!", { theme: "success" });
                resetForm();
            } else {
                toast.error("Password update failed!", { theme: "error" });
            }
        } catch (err) {
            console.log(err);
            console.log("Error:", err?.response?.data);
            const errorMessage =
                err?.response?.data?.error || "Password update failed!";
            toast.error(errorMessage);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        userDispatch({ type: "LOGOUT" });
        toast.info("Logout success!", { theme: "info" });
    };

    return (
        <UserContext.Provider
            value={{
                ...userState,
                handleLogin,
                handleRegister,
                handleLogout,
                handleProfileUpdate,
                handlePasswordChange,
                userDispatch,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}
