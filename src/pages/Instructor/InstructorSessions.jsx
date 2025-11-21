import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
    ItemActions,
    ItemSeparator,
} from "@/components/ui/item";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Settings,
    Plus,
    Hourglass,
    BookA,
    CirclePlus,
    CalendarDays,
    Clock,
    Trash,
    Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import axios from "@/config/axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

export default function InstructorSessions() {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get("/teachers/sessions", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setSessions(response.data);
            } catch (err) {
                console.error("Error fetching sessions:", err);
                toast.error("Failed to fetch sessions", { theme: "error" });
            }
        };
        fetchSessions();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/teachers/sessions/${id}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            setSessions((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            console.error("Error deleting session:", err);
            toast.error("Failed to delete session", { theme: "error" });
        }
    };

    return (
        <div>
            <div className="flex justify-between">
                <div className="text-3xl font-semibold pl-5">All Sessions</div>
                <Button className="mr-5 rounded">
                    <Link to="/instructor/sessions/add" className="flex gap-2">
                        <CirclePlus
                            size={24}
                            strokeWidth={2}
                            className="mt-[2px]"
                        />{" "}
                        Add Session
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-6 p-5">
                {sessions.map((ele) => (
                    <Card
                        key={ele._id}
                        className="relative overflow-hidden border-0 p-6 h-full flex flex-col justify-between"
                    >
                        <CardHeader>
                            <CardTitle className="flex mb-1 text-lg leading-tight font-semibold">
                                {ele.title}
                            </CardTitle>
                            <CardDescription className="text-xs font-mono flex">
                                {ele.createdAt.slice(0, 10)}
                                <Badge
                                    variant="secondary"
                                    className="ml-3 mt-[-4px]"
                                >
                                    {ele.category}
                                </Badge>
                            </CardDescription>
                            <CardAction className="flex">
                                <Link to={`/instructor/sessions/${ele._id}`}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-4 right-12 h-auto p-1"
                                    >
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-4 right-4 h-auto p-1 text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure you want to delete
                                                this session?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. It
                                                will permanently remove this
                                                session and its data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={() =>
                                                    handleDelete(ele._id)
                                                }
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardAction>
                        </CardHeader>

                        <CardContent>
                            <p className="text-muted-foreground text-l">
                                {ele.description}
                            </p>
                            <small className="text-sm leading-none font-medium">
                                {ele?.amount}₹ per hour
                            </small>
                        </CardContent>

                        <CardFooter className="grid">
                            <p></p>
                            {(() => {
                                if (!ele?.slots || ele.slots.length === 0) {
                                    return (
                                        <p className="text-muted-foreground">
                                            No slots available
                                        </p>
                                    );
                                }

                                const recurringSlots = ele.slots.filter(
                                    (slot) => slot.isRecurring
                                );
                                const nonRecurringSlots = ele.slots.filter(
                                    (slot) => !slot.isRecurring
                                );

                                // Determine slot type label
                                const slotTypeLabel =
                                    recurringSlots.length > 0 &&
                                    nonRecurringSlots.length > 0
                                        ? "Both"
                                        : recurringSlots.length > 0
                                        ? "Repeating"
                                        : "Non-Repeating";

                                return (
                                    <code className="relative rounded py-[0.2rem] font-mono text-sm font-semibold">
                                        Slot Type: {slotTypeLabel}
                                        <div className="mt-2 space-y-4">
                                            {recurringSlots.length > 0 && (
                                                <div className="border-l-2 border-blue-500 pl-3">
                                                    {recurringSlots.length >
                                                        0 &&
                                                        nonRecurringSlots.length >
                                                            0 && (
                                                            <p className="font-semibold text-blue-600 mb-2">
                                                                Recurring Slots:
                                                            </p>
                                                        )}
                                                    {recurringSlots.map(
                                                        (slot, index) => (
                                                            <div
                                                                key={index}
                                                                className="mb-2"
                                                            >
                                                                <p className="flex">
                                                                    <CalendarDays
                                                                        size={
                                                                            18
                                                                        }
                                                                        color="gray"
                                                                        className="mr-1"
                                                                    />
                                                                    {Array.isArray(
                                                                        slot.daysOfWeek
                                                                    )
                                                                        ? slot.daysOfWeek.join(
                                                                              ", "
                                                                          )
                                                                        : "N/A"}
                                                                </p>
                                                                <p className="flex">
                                                                    <Clock
                                                                        size={
                                                                            18
                                                                        }
                                                                        color="gray"
                                                                        className="mr-1"
                                                                    />
                                                                    {slot.startTime ||
                                                                        "N/A"}{" "}
                                                                    -{" "}
                                                                    {slot.endTime ||
                                                                        "N/A"}
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            {nonRecurringSlots.length > 0 && (
                                                <div
                                                    className={
                                                        recurringSlots.length >
                                                        0
                                                            ? "border-l-2 border-green-500 pl-3"
                                                            : ""
                                                    }
                                                >
                                                    {recurringSlots.length >
                                                        0 &&
                                                        nonRecurringSlots.length >
                                                            0 && (
                                                            <p className="font-semibold text-green-600 mb-2">
                                                                Non-Recurring
                                                                Slots:
                                                            </p>
                                                        )}
                                                    {nonRecurringSlots.map(
                                                        (slot, index) => (
                                                            <div
                                                                key={index}
                                                                className="mb-2"
                                                            >
                                                                <p className="flex">
                                                                    <CalendarDays
                                                                        size={
                                                                            18
                                                                        }
                                                                        color="gray"
                                                                        className="mr-1"
                                                                    />
                                                                    {slot.startDate?.slice(
                                                                        0,
                                                                        10
                                                                    ) ||
                                                                        "N/A"}{" "}
                                                                    -{" "}
                                                                    {slot.endDate?.slice(
                                                                        0,
                                                                        10
                                                                    ) || "N/A"}
                                                                </p>
                                                                <p className="flex">
                                                                    <Clock
                                                                        size={
                                                                            18
                                                                        }
                                                                        color="gray"
                                                                        className="mr-1"
                                                                    />
                                                                    {slot.startDate?.slice(
                                                                        11,
                                                                        16
                                                                    ) ||
                                                                        "N/A"}{" "}
                                                                    -{" "}
                                                                    {slot.endDate?.slice(
                                                                        11,
                                                                        16
                                                                    ) || "N/A"}
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </code>
                                );
                            })()}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
