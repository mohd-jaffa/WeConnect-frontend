import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import axios from "@/config/axios";
import UserContext from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

export default function SessionsList() {
    const navigate = useNavigate();
    const { handleLogout } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const sessionsPerPage = 4;
    const [sessionsList, setSessionsList] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get("/sessions", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setSessionsList(response.data);
            } catch (err) {
                toast.error("Something went wrong, please login again", {
                    theme: "error",
                });
                handleLogout();
                navigate("/login");
            }
        };
        fetchTeachers();
    }, []);

    const totalPages = Math.ceil(sessionsList?.length / sessionsPerPage);
    const startIndex = (currentPage - 1) * sessionsPerPage;
    const currentSessions = sessionsList?.slice(
        startIndex,
        startIndex + sessionsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (sessionsList == null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 flex-grow min-h-screen">
            <div className="mt-5">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold capitalize">
                        All sessions
                    </h2>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentSessions.map((ele) => {
                        return (
                            <Link to={`/session/${ele._id}`} key={ele._id}>
                                <div className="bg-card text-card-foreground overflow-hidden rounded-lg border transition-shadow duration-300 hover:shadow-lg flex flex-col h-full">
                                    <div className="relative">
                                        <img
                                            src={ele.thumbnail}
                                            alt={ele.title}
                                            width={400}
                                            height={225}
                                            className="h-48 w-full object-cover"
                                        />
                                        <Badge className="absolute top-2 right-2">
                                            {ele.category}
                                        </Badge>
                                    </div>

                                    {/* Content section */}
                                    <div className="flex flex-col justify-between flex-grow p-4">
                                        <div>
                                            <h3 className="text-lg leading-tight font-semibold mb-2 line-clamp-1">
                                                {ele.title}
                                            </h3>
                                            <p className="text-muted-foreground line-clamp-3 text-sm line-clamp-2">
                                                {ele.description}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage
                                                        src={
                                                            ele?.teachersId
                                                                ?.avatar
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {ele?.teachersId?.name
                                                            ?.split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>
                                                    {ele.teachersId.name}
                                                </span>
                                            </div>
                                            <div>
                                                <small className="text-sm leading-none font-medium">
                                                    {ele?.amount}₹/hr
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            {/* Prev Button */}
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    className={
                                        currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>

                            {/* Page Numbers */}
                            {[...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === index + 1}
                                        onClick={() =>
                                            handlePageChange(index + 1)
                                        }
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {/* Ellipsis (optional) */}
                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            {/* Next Button */}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    className={
                                        currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    );
}
