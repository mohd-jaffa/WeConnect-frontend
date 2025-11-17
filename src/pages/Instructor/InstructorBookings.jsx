// import { useEffect, useState, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "@/config/axios";
// import { rankItem } from "@tanstack/match-sorter-utils";
// import {
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ArrowUpDown, Ellipsis } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import {
//     Dialog,
//     DialogClose,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";

// export default function InstructorBookings() {
//     const { filter } = useParams();
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [globalFilter, setGlobalFilter] = useState("");
//     const [sorting, setSorting] = useState([]);
//     const [columnFilters, setColumnFilters] = useState([]);
//     const navigate = useNavigate();

//     const globalFuzzyFilter = (row, columnId, filterValue) => {
//         const search = filterValue.toLowerCase();
//         return (
//             rankItem(row.original.time?.start ?? "", search).passed ||
//             rankItem(row.original.studentsId?.name ?? "", search).passed ||
//             rankItem(row.original._id ?? "", search).passed
//         );
//     };

//     const columns = useMemo(
//         () => [
//             {
//                 accessorKey: "_id",
//                 header: "ID",
//                 cell: ({ row }) => (
//                     <div className="font-mono text-xs">
//                         {row.getValue("_id")}
//                     </div>
//                 ),
//             },
//             {
//                 accessorFn: (row) => row.studentsId?.name ?? "N/A",
//                 accessorKey: "studentName",
//                 header: ({ column }) => (
//                     <Button
//                         variant="ghost"
//                         onClick={() =>
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }
//                     >
//                         Student
//                         <ArrowUpDown className="ml-2 h-4 w-4" />
//                     </Button>
//                 ),
//                 cell: ({ row }) => (
//                     <div className="capitalize">
//                         {row.getValue("studentName")}
//                     </div>
//                 ),
//             },
//             {
//                 accessorFn: (row) => row.details?.category ?? "N/A",
//                 accessorKey: "SessionCategory",
//                 header: "Category",
//                 cell: ({ row }) => <div>{row.getValue("SessionCategory")}</div>,
//             },
//             {
//                 accessorFn: (row) => row.time?.start ?? "N/A",
//                 accessorKey: "startTime",
//                 header: ({ column }) => (
//                     <Button
//                         variant="ghost"
//                         onClick={() =>
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }
//                     >
//                         Time
//                         <ArrowUpDown className="ml-2 h-4 w-4" />
//                     </Button>
//                 ),
//                 cell: ({ row }) => {
//                     const isoString = row.getValue("startTime");
//                     const formatted =
//                         isoString.split("T")[0] +
//                         " " +
//                         isoString.split("T")[1].slice(0, 5);
//                     return <div className="lowercase">{formatted}</div>;
//                 },
//             },
//             {
//                 accessorKey: "status",
//                 header: "Status",
//                 cell: ({ row }) => {
//                     const status = row.getValue("status");
//                     const statusColor = {
//                         completed: "text-green-600",
//                         cancelled: "text-red-600",
//                         upcoming: "text-yellow-600",
//                         ongoing: "text-yellow-600",
//                     };
//                     return (
//                         <span
//                             className={`font-medium capitalize ${
//                                 statusColor[status] || "text-gray-600"
//                             }`}
//                         >
//                             {status}
//                         </span>
//                     );
//                 },
//             },
//             {
//                 id: "actions",
//                 header: "Action",
//                 cell: ({ row }) => {
//                     const rowInfo = row.original;
//                     const status = rowInfo.status;
//                     const meetLink = rowInfo.meetLink;
//                     const id = rowInfo._id;
//                     return (
//                         <>
//                             {status == "upcoming" && (
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <Button
//                                             variant="ghost"
//                                             className="h-8 w-8 p-0"
//                                         >
//                                             <span className="sr-only">
//                                                 Open menu
//                                             </span>
//                                             <Ellipsis className="h-4 w-4" />
//                                         </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent align="end">
//                                         <DropdownMenuItem>
//                                             <a
//                                                 href={meetLink}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                             >
//                                                 Meet Link
//                                             </a>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem
//                                             className="text-red-600 focus:text-red-700"
//                                             onClick={() =>
//                                                 handleCancelSession(id)
//                                             }
//                                         >
//                                             cancel
//                                         </DropdownMenuItem>
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             )}

//                             {status == "ongoing" && (
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <Button
//                                             variant="ghost"
//                                             className="h-8 w-8 p-0"
//                                         >
//                                             <span className="sr-only">
//                                                 Open menu
//                                             </span>
//                                             <Ellipsis className="h-4 w-4" />
//                                         </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent align="end">
//                                         <DropdownMenuItem>
//                                             <a
//                                                 href={meetLink}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                             >
//                                                 Meet Link
//                                             </a>
//                                         </DropdownMenuItem>
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             )}
//                         </>
//                     );
//                 },
//             },
//         ],
//         []
//     );

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get("bookings", {
//                     headers: { Authorization: localStorage.getItem("token") },
//                 });
//                 let filteredBookings = response.data;
//                 if (filter === "upcoming") {
//                     filteredBookings = filteredBookings.filter(
//                         (booking) => booking.status === "upcoming"
//                     );
//                 } else if (filter === "ongoing") {
//                     filteredBookings = filteredBookings.filter(
//                         (booking) => booking.status === "ongoing"
//                     );
//                 } else if (filter === "completed") {
//                     filteredBookings = filteredBookings.filter(
//                         (booking) => booking.status === "completed"
//                     );
//                 } else if (filter === "cancelled") {
//                     filteredBookings = filteredBookings.filter(
//                         (booking) => booking.status === "cancelled"
//                     );
//                 }
//                 setBookings(filteredBookings);
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//                 alert("Failed to fetch users");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchBookings();
//     }, [filter]);

//     const handleCancelSession = async (id) => {
//         if (!id) {
//             toast.error("Invalid session ID");
//             return;
//         }
//         if (window.confirm("Are you sure you want to cancel this session?")) {
//             try {
//                 const response = await axios.put(`bookings/${id}`, null, {
//                     headers: {
//                         Authorization: localStorage.getItem("token"),
//                     },
//                 });
//                 if (response.status === 200) {
//                     toast.info("Session has been cancelled successfully!");
//                     navigate("/instructor/bookings/cancelled");
//                 } else {
//                     toast.warn("Something went wrong. Please try again.");
//                 }
//             } catch (err) {
//                 console.error("Error cancelling session:", err);
//                 toast.error(
//                     err.response?.data?.message ||
//                         "Failed to cancel the session"
//                 );
//             }
//         } else {
//             toast.info("Session cancellation aborted");
//             return;
//         }
//     };

//     const table = useReactTable({
//         data: bookings,
//         columns,
//         onSortingChange: setSorting,
//         onColumnFiltersChange: setColumnFilters,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         globalFilterFn: globalFuzzyFilter,
//         onGlobalFilterChange: setGlobalFilter,
//         state: {
//             sorting,
//             columnFilters,
//             globalFilter,
//         },
//     });

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <p>Loading...</p>
//             </div>
//         );
//     }
//     return (
//         <div className="w-full p-4">
//             <div className="text-lg font-semibold">
//                 {filter == "upcoming"
//                     ? "Upcoming Bookings"
//                     : filter == "ongoing"
//                     ? "Ongoing Bookings"
//                     : filter == "completed"
//                     ? "Completed Bookings"
//                     : filter == "cancelled"
//                     ? "Cancelled Bookings"
//                     : "All Bookings"}
//             </div>
//             <div className="flex items-center py-4">
//                 <Input
//                     placeholder="Search by Students/Instructors name or ID..."
//                     value={globalFilter}
//                     onChange={(e) => table.setGlobalFilter(e.target.value)}
//                     className="max-w-sm"
//                 />
//             </div>
//             <div className="rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <TableRow key={headerGroup.id}>
//                                 {headerGroup.headers.map((header) => {
//                                     return (
//                                         <TableHead key={header.id}>
//                                             {header.isPlaceholder
//                                                 ? null
//                                                 : flexRender(
//                                                       header.column.columnDef
//                                                           .header,
//                                                       header.getContext()
//                                                   )}
//                                         </TableHead>
//                                     );
//                                 })}
//                             </TableRow>
//                         ))}
//                     </TableHeader>
//                     <TableBody>
//                         {table.getRowModel().rows?.length ? (
//                             table.getRowModel().rows.map((row) => (
//                                 <TableRow
//                                     key={row.id}
//                                     data-state={
//                                         row.getIsSelected() && "selected"
//                                     }
//                                 >
//                                     {row.getVisibleCells().map((cell) => (
//                                         <TableCell key={cell.id}>
//                                             {flexRender(
//                                                 cell.column.columnDef.cell,
//                                                 cell.getContext()
//                                             )}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell
//                                     colSpan={columns.length}
//                                     className="h-24 text-center"
//                                 >
//                                     No results.
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>
//             <div className="flex items-center justify-end space-x-2 py-4">
//                 <div className="flex-1 text-sm text-muted-foreground">
//                     {table.getFilteredRowModel().rows.length} user(s) found.
//                 </div>
//                 <div className="space-x-2">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => table.previousPage()}
//                         disabled={!table.getCanPreviousPage()}
//                     >
//                         Previous
//                     </Button>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => table.nextPage()}
//                         disabled={!table.getCanNextPage()}
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import EventHoverCard from "@/components/EventHoverCard";
import EventDialog from "@/components/EventDialog";
import { Spinner } from "@/components/ui/spinner";
import axios from "@/config/axios";

export default function InstructorBookings() {
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
        <div className="container mx-auto p-4 grid gap-5 mb-10">
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
                <h3 className="text-lg font-medium">{currentTitle}</h3>

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
