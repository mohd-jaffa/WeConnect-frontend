import { Button } from "@/components/ui/button";
import axios from "@/config/axios";
import UserContext from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function StudentListAssignments() {
    const { user } = useContext(UserContext);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get("/assignment", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setAssignments(response.data);
            } catch (err) {
                toast.error(err.message, { theme: "error" });
            }
        };
        fetchAssignments();
    }, []);

    if (assignments.length == 0) {
        return (
            <div className="flex flex-grow min-h-screen flex-col items-center justify-center">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight capitalize">
                    no assignments
                </h4>
            </div>
        );
    }
    return (
        <div className="p-6 flex-grow min-h-screen">
            <div className="text-3xl font-semibold">Assigned Tasks</div>
            <div className="my-6 w-full overflow-y-auto">
                <table className="w-full">
                    <thead>
                        <tr className="even:bg-muted m-0 border-t p-0">
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                Assignments
                            </th>
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                Date
                            </th>
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                Status
                            </th>
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments?.map((ele) => {
                            return (
                                <tr
                                    className="even:bg-muted m-0 border-t p-0"
                                    key={ele._id}
                                >
                                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                        {ele?.topic}
                                    </td>
                                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                        {ele?.createdAt?.slice(0, 10)}
                                    </td>
                                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                        {ele.isCompleted == true
                                            ? "completed"
                                            : "incomplete"}
                                    </td>
                                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                        <Link to={`/assignments/${ele._id}`}>
                                            <Button>view</Button>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
