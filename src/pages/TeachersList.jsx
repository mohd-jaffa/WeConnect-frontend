import axios from "@/config/axios";
import UserContext from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function TeachersList() {
    const navigate = useNavigate();

    const { handleLogout } = useContext(UserContext);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get("/teachers", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                console.table(response.data);
            } catch (err) {
                toast.error("something went wrong, please login again");
                handleLogout();
                navigate("/login");
            }
        };
        fetchTeachers();
    }, []);

    return (
        <div>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                TeachersList component
            </h2>
        </div>
    );
}
