import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "@/config/axios";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminBookings() {
    const { filter } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    const globalFuzzyFilter = (row, columnId, filterValue) => {
        const search = filterValue.toLowerCase();
        return (
            rankItem(row.original.teachersId?.name ?? "", search).passed ||
            rankItem(row.original.studentsId?.name ?? "", search).passed ||
            rankItem(row.original._id ?? "", search).passed
        );
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "_id",
                header: "ID",
                cell: ({ row }) => (
                    <div className="font-mono text-xs">
                        {row.getValue("_id")}
                    </div>
                ),
            },
            {
                accessorFn: (row) => row.studentsId?.name ?? "N/A",
                accessorKey: "studentName",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Student
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="capitalize">
                        {row.getValue("studentName")}
                    </div>
                ),
            },
            {
                accessorFn: (row) => row.teachersId?.name ?? "N/A",
                accessorKey: "TeacherName",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Instructor
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="capitalize">
                        {row.getValue("TeacherName")}
                    </div>
                ),
            },
            {
                accessorFn: (row) => row.details?.category ?? "N/A",
                accessorKey: "SessionCategory",
                header: "Category",
                cell: ({ row }) => <div>{row.getValue("SessionCategory")}</div>,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.getValue("status");
                    const statusColor = {
                        completed: "text-green-600",
                        cancelled: "text-red-600",
                        upcoming: "text-yellow-600",
                        ongoing: "text-yellow-600",
                    };
                    return (
                        <span
                            className={`font-medium capitalize ${
                                statusColor[status] || "text-gray-600"
                            }`}
                        >
                            {status}
                        </span>
                    );
                },
            },
            {
                id: "actions",
                header: "Action",
                cell: ({ row }) => {
                    const rowInfo = row.original;
                    return (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <Ellipsis className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>this is edit page</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click
                                        save when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: bookings,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: globalFuzzyFilter,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/admin/bookings", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                let filteredBookings = response.data;
                if (filter === "upcoming") {
                    filteredBookings = filteredBookings.filter(
                        (booking) => booking.status === "upcoming"
                    );
                } else if (filter === "ongoing") {
                    filteredBookings = filteredBookings.filter(
                        (booking) => booking.status === "ongoing"
                    );
                } else if (filter === "completed") {
                    filteredBookings = filteredBookings.filter(
                        (booking) => booking.status === "completed"
                    );
                } else if (filter === "cancelled") {
                    filteredBookings = filteredBookings.filter(
                        (booking) => booking.status === "cancelled"
                    );
                }
                setBookings(filteredBookings);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [filter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Loading...</p>
            </div>
        );
    }
    return (
        <div className="w-full p-4">
            <div className="text-lg font-semibold">
                {filter == "upcoming"
                    ? "Upcoming Bookings"
                    : filter == "ongoing"
                    ? "Ongoing Bookings"
                    : filter == "completed"
                    ? "Completed Bookings"
                    : filter == "cancelled"
                    ? "Cancelled Bookings"
                    : "All Bookings"}
            </div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search by Students/Instructors name or ID..."
                    value={globalFilter}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} user(s) found.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
