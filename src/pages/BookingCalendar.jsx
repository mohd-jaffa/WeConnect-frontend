import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "../config/axios";
import { Button } from "@/components/ui/button";
import EventHoverCard from "../components/EventHoverCard";
import EventDialog from "../components/EventDialog";
import { Spinner } from "@/components/ui/spinner";

export default function BookingsCalendar() {
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentView, setCurrentView] = useState("dayGridMonth");
    const calendarRef = useRef(null);

    // ✅ Fetch all bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/bookings", {
                    headers: { Authorization: localStorage.getItem("token") },
                });

                const formatted = res.data.map((ele) => {
                    const status = ele.status?.toLowerCase();
                    const colorMap = {
                        completed: "#22c55e",
                        cancelled: "#ef4444",
                        ongoing: "#eab308",
                        upcoming: "#3b82f6",
                    };

                    return {
                        id: ele._id,
                        title: ele.details?.title || "Session",
                        start: ele.time?.start,
                        end: ele.time?.end,
                        backgroundColor: colorMap[status] || "#3b82f6",
                        borderColor: colorMap[status] || "#3b82f6",
                        extendedProps: {
                            teacher: ele.teachersId?.name,
                            student: ele.studentsId?.name,
                            description: ele.details?.description,
                            meetLink: ele?.meetLink,
                            status,
                            start: ele.time?.start,
                            end: ele.time?.end,
                        },
                    };
                });
                setEvents(formatted);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // ✅ Event HoverCard content
    const renderEventContent = (eventInfo) => {
        const event = eventInfo.event.extendedProps;
        const title = eventInfo.event.title;
        return (
            <EventHoverCard event={event}>
                <div className="p-1 rounded-md cursor-pointer hover:bg-primary/10">
                    <span className="font-semibold">{title}</span>
                </div>
            </EventHoverCard>
        );
    };

    // ✅ On event click, open Dialog
    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event.extendedProps;
        setSelectedEvent({
            title: clickInfo.event.title,
            ...event,
        });
        setDialogOpen(true);
    };

    // ✅ Calendar view & navigation controls
    const handleViewChange = (view) => {
        const api = calendarRef.current?.getApi();
        api.changeView(view);
        setCurrentView(view);
    };

    const handleDatesSet = (arg) => {
        setCurrentTitle(arg.view.title);
    };

    const handlePrev = () => calendarRef.current?.getApi().prev();
    const handleNext = () => calendarRef.current?.getApi().next();
    const handleToday = () => calendarRef.current?.getApi().today();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 grid gap-5">
            {/* Row 1: My Bookings + Legend */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">My Bookings</h2>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>{" "}
                        Upcoming
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>{" "}
                        Ongoing
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>{" "}
                        Completed
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>{" "}
                        Cancelled
                    </div>
                </div>
            </div>

            {/* Row 2: Filters + Title + Navigation */}
            <div className="flex justify-between items-center mb-3">
                {/* Left: View Filters */}
                <div className="flex gap-2">
                    <Button
                        variant={
                            currentView === "dayGridMonth"
                                ? "default"
                                : "outline"
                        }
                        onClick={() => handleViewChange("dayGridMonth")}
                    >
                        Month
                    </Button>
                    <Button
                        variant={
                            currentView === "timeGridWeek"
                                ? "default"
                                : "outline"
                        }
                        onClick={() => handleViewChange("timeGridWeek")}
                    >
                        Week
                    </Button>
                    <Button
                        variant={
                            currentView === "timeGridDay"
                                ? "default"
                                : "outline"
                        }
                        onClick={() => handleViewChange("timeGridDay")}
                    >
                        Day
                    </Button>
                    <Button
                        variant={
                            currentView === "listWeek" ? "default" : "outline"
                        }
                        onClick={() => handleViewChange("listWeek")}
                    >
                        List
                    </Button>
                </div>

                {/* Center: Calendar Title */}
                <h3 className="text-2xl font-medium">{currentTitle}</h3>

                {/* Right: Navigation */}
                <div className="space-x-2">
                    <Button variant="outline" onClick={handlePrev}>
                        Prev
                    </Button>
                    <Button variant="outline" onClick={handleToday}>
                        Today
                    </Button>
                    <Button variant="outline" onClick={handleNext}>
                        Next
                    </Button>
                </div>
            </div>

            {/* FullCalendar */}
            <FullCalendar
                ref={calendarRef}
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin,
                ]}
                initialView="dayGridMonth"
                height="80vh"
                headerToolbar={false}
                events={events}
                eventContent={renderEventContent}
                eventClick={handleEventClick}
                eventDisplay="block"
                datesSet={handleDatesSet}
            />

            {/* Dialog for event details */}
            <EventDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                event={selectedEvent}
            />
        </div>
    );
}
