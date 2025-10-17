import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/UserContext";
import axios from "@/config/axios";

export default function SessionShow() {
    const { id } = useParams();
    const { handleLogout } = useContext(UserContext);

    const [sessionDetails, setSessionDetails] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`/sessions/${id}`);
                setSessionDetails(response.data);
                console.table(response.data);
            } catch (err) {
                toast.error("something went wrong, please login again");
                handleLogout();
                navigate("/login");
            }
        };
        fetchTeachers();
    }, []);

    if (sessionDetails == null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-3">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                {sessionDetails.title}
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                {sessionDetails.description}
            </p>
            <blockquote className="mt-6 border-l-2 pl-6 italic">
                category -{" "}
                <Badge variant="secondary">{sessionDetails.category}</Badge>
            </blockquote>
        </div>
    );
}
