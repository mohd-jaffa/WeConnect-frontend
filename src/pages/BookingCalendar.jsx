import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "../config/axios";
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export default function BookingCalendar() {
    const [events, setEvents] = useState([]);
    const calendarRef = useRef(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get("/bookings", {
                    headers: { Authorization: localStorage.getItem("token") },
                });

                // Transform API data to FullCalendar event format
                const formattedEvents = res.data.map((b) => ({
                    id: b._id,
                    title: b.details?.title || "Booked Class",
                    start: b.time?.start,
                    end: b.time?.end,
                    status: b.status,
                    teacher: b.teachersId?.name || "Teacher",
                    student: b.studentsId?.name || "Student",
                    meetLink: b.details?.meetLink || "#",
                    description:
                        b.details?.description || "No description available",
                }));

                setEvents(formattedEvents);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };
        fetchBookings();
    }, []);

    // Render each event using ShadCN HoverCard
    const renderEventContent = (eventInfo) => {
        const { event } = eventInfo;
        const { status, meetLink, teacher, student, description } =
            event.extendedProps;

        return (
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div className="p-1 rounded-md cursor-pointer hover:bg-primary/10">
                        <span className="font-medium text-sm">
                            {event.title}
                        </span>
                    </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 space-y-2">
                    <p className="font-semibold text-base">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                        <strong>Teacher:</strong> {teacher}
                        <br />
                        <strong>Student:</strong> {student}
                    </p>
                    <p className="text-xs">{description}</p>
                    <p className="text-xs text-muted-foreground">
                        {new Date(event.start).toLocaleString()} -{" "}
                        {new Date(event.end).toLocaleTimeString()}
                    </p>

                    <div className="flex justify-between items-center">
                        <Button variant="secondary" size="sm" asChild>
                            <a
                                href={meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <CalendarDays className="mr-2 h-4 w-4" /> Join
                                Meet
                            </a>
                        </Button>

                        <span
                            className={`text-xs px-2 py-1 rounded-md ${
                                status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                        >
                            {status}
                        </span>
                    </div>
                </HoverCardContent>
            </HoverCard>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold">My Bookings</h2>
                <div className="space-x-2">
                    <Button
                        onClick={() => calendarRef.current?.getApi().today()}
                    >
                        Today
                    </Button>
                    <Button
                        onClick={() => calendarRef.current?.getApi().prev()}
                    >
                        Prev
                    </Button>
                    <Button
                        onClick={() => calendarRef.current?.getApi().next()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <FullCalendar
                ref={calendarRef}
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin,
                ]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                events={events}
                eventContent={renderEventContent}
                height="auto"
            />
        </div>
    );
}
