import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import UserContext from "@/context/UserContext";
import { toast } from "sonner";

const userReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN": {
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload,
                serverErrors: "",
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

    const [userState, userDispatch] = useReducer(userReducer, {
        user: null,
        isLoggedIn: false,
        serverErrors: "",
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
                } catch (err) {
                    toast.error("something went wrong, please login again");
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
                toast.success("Registered successfully!");
                resetForm();
                navigate("/login");
            }, 2000);
        } catch (err) {
            toast.dismiss();
            const errorMessage =
                err?.response?.data?.error || "Registration failed";
            toast.error(errorMessage);
        }
    };

    const handleLogin = async (formData, resetForm) => {
        try {
            const toastId = toast.loading("Logging in...");
            const response = await axios.post("/login", formData);
            localStorage.setItem("token", response.data.token);
            const userResponse = await axios.get("/users/profile", {
                headers: { Authorization: localStorage.getItem("token") },
            });
            userDispatch({ type: "LOGIN", payload: userResponse.data });
            console.table(userResponse.data);
            await setTimeout(() => {
                toast.dismiss(toastId);
                toast.success("Logged in successfully!");
                resetForm();
                if (userResponse.data.role === "student") {
                    navigate("/home");
                } else if (userResponse.data.role === "teacher") {
                    navigate("/dashboard");
                }
            }, 2000);
        } catch (err) {
            toast.dismiss();
            const errorMessage = err?.response?.data?.error || "Login failed";
            toast.error(errorMessage);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        userDispatch({ type: "LOGOUT" });
    };

    return (
        <UserContext.Provider
            value={{
                ...userState,
                handleLogin,
                handleRegister,
                handleLogout,
                userDispatch,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}
