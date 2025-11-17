import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import axios from "@/config/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InstructorsViewStudent() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/teachers/students/${id}`, {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                console.log(response.data);
                setStudent(res.data.student);
                setBookings(res.data.bookings);
                setAssignments(res.data.assignments);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    No Student Found
                </Button>
            </div>
        );
    }

    return (
        <div className="p-5 grid gap-8">
            <div className="sticky top-0 space-y-6 lg:col-span-1">
                <Card className="border border-border bg-card shadow-sm p-4">
                    <CardHeader className="flex items-center gap-4 p-0">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={student.avatar}
                                alt={student.name}
                            />
                            <AvatarFallback>
                                {student.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-2xl font-bold">
                                {student.name}
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">
                                {student.email}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                                <span className="font-semibold text-yellow-500">
                                    {student?.rating || 4.8}★
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    Very engaged student
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <Separator className="my-4" />
                    <CardContent className="space-y-3 p-0">
                        <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">Joined</p>
                            <p className="font-semibold">
                                {student?.joinedDate || "Sep 2025"}
                            </p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">
                                Total Sessions
                            </p>
                            <p className="font-semibold">
                                {student?.totalSessions || 10}
                            </p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">Total Hours</p>
                            <p className="font-semibold">
                                {student?.totalHours || 25}h
                            </p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">
                                Last Session
                            </p>
                            <p className="font-semibold">
                                {student?.lastSession || "2 days ago"}
                            </p>
                        </div>
                        <Separator className="my-4" />
                        <div>
                            <h3 className="font-semibold mb-2">Progress</h3>
                            <div className="flex items-center justify-between mb-2 text-sm">
                                <p className="text-muted-foreground">
                                    Learning Progress
                                </p>
                                <p className="font-semibold">
                                    {student?.progress || 70}%
                                </p>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <Button className="w-full gap-2">
                            <CalendarPlus className="w-4 h-4" />
                            Schedule New Session
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2 space-y-12">
                <div className="p-4 rounded-lg border border-border space-y-3 hover:border-foreground transition">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{session?.title}</h3>
                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                                session?.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                        >
                            {session?.status}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="font-medium">{session?.date}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">
                                {session?.duration}min
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {session?.topic}
                    </p>
                </div>

                <div className="p-4 rounded-lg border border-border space-y-3 hover:border-foreground transition">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{assignment?.title}</h3>
                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                                assignment?.status === "submitted"
                                    ? "bg-green-100 text-green-700"
                                    : assignment?.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                        >
                            {assignment?.status}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <p className="text-muted-foreground">Assigned</p>
                            <p className="font-medium">
                                {assignment?.assignedDate}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Due</p>
                            <p className="font-medium">{assignment?.dueDate}</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {assignment?.description}
                    </p>
                    {assignment?.score && (
                        <div className="pt-2 border-t border-border">
                            <p className="text-sm">
                                <span className="text-muted-foreground">
                                    Score:
                                </span>{" "}
                                <span className="font-semibold">
                                    {assignment?.score}/100
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
