import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert, Eye } from "lucide-react";
import axios from "@/config/axios";
import UserContext from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Bookings() {
    const { user } = useContext(UserContext);
    const [bookings, setBookings] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("/bookings", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                console.log(response.data);
                setBookings(response.data);
            } catch (err) {
                toast.error("something went wrong, please login again");
                handleLogout();
                navigate("/login");
            }
        };
        fetchBookings();
    }, []);

    if (bookings == null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    return (
        <div className="items-center justify-center">
            {bookings.length == 0 ? (
                <div className="m-20">
                    <Alert variant="default">
                        <CircleAlert />
                        <AlertTitle>Nothing Scheduled Yet</AlertTitle>
                        <AlertDescription>
                            We couldn't find any past or upcoming bookings
                        </AlertDescription>
                    </Alert>
                </div>
            ) : (
                <div>
                    <Table>
                        <TableCaption>Your recent bookings</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Instructor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((ele) => {
                                return (
                                    <TableRow key={ele._id}>
                                        <TableCell>
                                            {ele.details.title}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {ele?.teachersId.name}
                                        </TableCell>
                                        <TableCell>
                                            {ele?.time.start.slice(0, 10)}
                                        </TableCell>
                                        <TableCell>
                                            {ele?.time.start
                                                .split("T")[1]
                                                .slice(0, 5)}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`${
                                                    ele.status === "completed"
                                                        ? "text-green-600"
                                                        : ele.status ===
                                                          "Cancelled"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                }`}
                                            >
                                                {ele?.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Eye
                                                        size={16}
                                                        strokeWidth={1.5}
                                                        color="grey"
                                                    />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            <code className="relative px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                                                Booking Id:{" "}
                                                                {ele._id}
                                                            </code>
                                                        </DialogTitle>
                                                        <DialogDescription className="bg-muted rounded relative px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ">
                                                            <code>
                                                                Title:{" "}
                                                                {
                                                                    ele.details
                                                                        .title
                                                                }
                                                                <br />
                                                                Description:{" "}
                                                                {
                                                                    ele.details
                                                                        .description
                                                                }
                                                                <br />
                                                                Category:{" "}
                                                                {
                                                                    ele.details
                                                                        .category
                                                                }
                                                            </code>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
