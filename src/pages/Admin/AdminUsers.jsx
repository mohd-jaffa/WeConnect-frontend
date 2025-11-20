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
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Ellipsis, Check } from "lucide-react";
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

export default function AdminUsers() {
    const { filter } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    const globalFuzzyFilter = (row, columnId, filterValue) => {
        const search = filterValue.toLowerCase();
        return (
            rankItem(row.original.name, search).passed ||
            rankItem(row.original.email, search).passed ||
            rankItem(row.original._id, search).passed
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
                accessorKey: "name",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("name")}</div>
                ),
            },
            {
                accessorKey: "email",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="lowercase">{row.getValue("email")}</div>
                ),
            },
            {
                accessorKey: "role",
                header: "Role",
                cell: ({ row }) => (
                    <div className="lowercase">{row.getValue("role")}</div>
                ),
            },
            {
                id: "actions",
                header: "Action",
                cell: ({ row }) => {
                    const rowInfo = row.original;
                    if (filter != "requests") {
                        return (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <Ellipsis className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() =>
                                            console.log("View", rowInfo)
                                        }
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
                    } else {
                        return (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={() => alert("clicked")}>
                                        <Check />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>approve</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    }
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: users,
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
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/admin/users", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                let filteredUsers = response.data;
                if (filter === "instructors") {
                    filteredUsers = filteredUsers.filter(
                        (user) => user.role === "teacher"
                    );
                } else if (filter === "students") {
                    filteredUsers = filteredUsers.filter(
                        (user) => user.role === "student"
                    );
                } else if (filter === "requests") {
                    filteredUsers = filteredUsers.filter(
                        (user) => user.isApproved === false
                    );
                }
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
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
                {filter == "instructors"
                    ? "All Instructors"
                    : filter == "students"
                    ? "All Students"
                    : filter == "requests"
                    ? "Approval Requests"
                    : "All Users"}
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
