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
import { toast } from "sonner";

export default function AdminSessions() {
    const { filter } = useParams();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    const globalFuzzyFilter = (row, columnId, filterValue) => {
        const search = filterValue.toLowerCase();
        return (
            rankItem(row.original.title ?? "", search).passed ||
            rankItem(row.original.category ?? "", search).passed ||
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
                accessorKey: "title",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("title")}</div>
                ),
            },
            {
                accessorKey: "category",
                header: "Category",
                cell: ({ row }) => <div>{row.getValue("category")}</div>,
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Created At
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const isoString = row.getValue("createdAt");
                    const formatted =
                        isoString.split("T")[0] +
                        " " +
                        isoString.split("T")[1].slice(0, 5);
                    return <div className="lowercase">{formatted}</div>;
                },
            },
            {
                id: "actions",
                header: "Action",
                cell: ({ row }) => {
                    const rowInfo = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <Ellipsis className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => console.log("View", rowInfo)}
                                >
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-700"
                                    onClick={() =>
                                        console.log("Delete", rowInfo)
                                    }
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        []
    );

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/admin/sessions", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                let filteredSessions = response.data;
                if (filter === "recurring") {
                    filteredSessions = filteredSessions
                        .map((session) => {
                            const recurringSlots = session.slots?.filter(
                                (slot) => slot.isRecurring === true
                            );
                            if (recurringSlots.length > 0) {
                                return { ...session, slots: recurringSlots };
                            }
                            return null;
                        })
                        .filter(Boolean); // remove nulls
                } else if (filter === "non-recurring") {
                    filteredSessions = filteredSessions
                        .map((session) => {
                            const nonRecurringSlots = session.slots?.filter(
                                (slot) => slot.isRecurring === false
                            );
                            if (nonRecurringSlots.length > 0) {
                                return { ...session, slots: nonRecurringSlots };
                            }
                            return null;
                        })
                        .filter(Boolean);
                }
                setSessions(filteredSessions);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to fetch users", { theme: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, [filter]);

    const table = useReactTable({
        data: sessions,
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
                {filter == "recurring"
                    ? "Recurring Sessions"
                    : filter == "non-recurring"
                    ? "Non - Recurring Sessions"
                    : "All Sessions"}
            </div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search by name, email, or ID..."
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
