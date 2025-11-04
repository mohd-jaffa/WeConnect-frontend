import { useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import axios from "@/config/axios";
import UserContext from "@/context/UserContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function AssignTaskPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState("");
    const [studentId, setStudentId] = useState("");
    const [bookingId, setBookingId] = useState("");
    const [allBookings, setAllBookings] = useState([]);
    const [allAssignments, setAllAssignments] = useState([]);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("/bookings", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 3);
                const recentBookings = response.data.filter(
                    (ele) => new Date(ele?.createdAt) >= oneWeekAgo
                );
                setAllBookings(recentBookings);
            } catch (err) {
                toast.error(err.message);
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchAssignments = async () => {
            try {
                const response = await axios.get("/assignment", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setAllAssignments(response.data);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (user?._id) {
            fetchAssignments();
        }
    }, [user]);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setMessage("Please enter a topic.");
            return;
        }
        if (!bookingId) {
            setMessage("Please select a booking.");
            return;
        }
        if (!studentId) {
            setMessage("No student found for this booking.");
            return;
        }
        try {
            setIsSubmitting(true);
            const res = await axios.post(
                "/assignment/generate",
                {
                    topic,
                    studentId,
                    instructorId: user?._id,
                    bookingId,
                },
                { headers: { Authorization: localStorage.getItem("token") } }
            );

            if (res.data.success) {
                toast.success("Assignment generated successfully!");
                setAllAssignments((prev) => [res.data.assignment, ...prev]);
                setTopic("");
                setBookingId("");
                setStudentId("");
                // navigate(0);
            } else {
                toast.error(
                    res.data.message || "Failed to generate assignment."
                );
            }
        } catch (err) {
            const serverMsg =
                err?.response?.data?.message ||
                err?.response?.data ||
                err.message;
            toast.error(serverMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div>
                <p>loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">Assign Task</h2>

            <Card className="p-6 mb-8">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="topic"
                            className="block text-sm font-medium text-muted-foreground"
                        >
                            Topic
                        </label>
                        <textarea
                            id="topic"
                            className="mt-1 block w-full rounded-md border border-border bg-background p-2 focus:ring-2 focus:ring-foreground"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter topic (e.g. Algebra, Trigonometry)"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="booking"
                            className="block text-sm font-medium text-muted-foreground"
                        >
                            Select Booking
                        </label>
                        <Select
                            value={bookingId}
                            onValueChange={(value) => {
                                setBookingId(value);
                                const selectedBooking = allBookings.find(
                                    (b) => b._id === value
                                );

                                if (selectedBooking) {
                                    const student =
                                        selectedBooking.studentsId?._id;
                                    setStudentId(student);
                                } else {
                                    setStudentId("");
                                }
                            }}
                        >
                            <SelectTrigger id="booking" className="w-full">
                                <SelectValue placeholder="Select a booking" />
                            </SelectTrigger>
                            <SelectContent>
                                {allBookings.map((booking) => (
                                    <SelectItem
                                        key={booking._id}
                                        value={booking._id}
                                    >
                                        {booking._id} —{" "}
                                        {booking.studentsId?.name} •{" "}
                                        {booking.details?.category || "N/A"} •{" "}
                                        {booking.time?.start || "N/A"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={handleGenerate}
                        disabled={isSubmitting}
                        className="w-full mt-4"
                    >
                        {isSubmitting ? "Generating…" : "Generate & Assign"}
                    </Button>

                    {message && (
                        <p className="text-sm text-muted-foreground mt-2">
                            {message}
                        </p>
                    )}
                </div>
            </Card>
            <h3 className="text-xl font-semibold mb-4">
                Assignments You Have Generated
            </h3>
            <div className="space-y-4">
                {allAssignments.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No assignments yet.
                    </p>
                )}
                {allAssignments.map((ele) => (
                    <Card
                        key={ele._id}
                        className="p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-semibold">
                                    {ele.topic}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Booking ID:{" "}
                                    <span className="font-medium text-foreground">
                                        {ele.bookingId}
                                    </span>{" "}
                                    <br />
                                    Student: {ele?.studentId?.name}
                                </p>
                                {ele.isCompleted && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Marks:{" "}
                                        <span className="font-medium text-foreground">
                                            {ele?.marks}/
                                            {ele?.questions?.length}
                                        </span>{" "}
                                    </p>
                                )}
                            </div>
                            <Badge
                                variant={
                                    ele.isCompleted ? "success" : "secondary"
                                }
                                className={`${
                                    ele.isCompleted
                                        ? "bg-green-600 text-white"
                                        : "bg-yellow-500 text-white"
                                }`}
                            >
                                {ele.isCompleted ? "Completed" : "Pending"}
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
