import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers } from "@/slices/teacherSlice";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Link } from "react-router-dom";

export default function Teachers() {
    const [currentPage, setCurrentPage] = useState(1);
    const teachersPerPage = 4;

    const dispatch = useDispatch();
    const { allTeachersData, allTeachersLoading, allTeachersError } =
        useSelector((state) => state.teacher);

    useEffect(() => {
        dispatch(fetchTeachers());
    }, [dispatch]);

    // Pagination logic
    const totalPages = Math.ceil(allTeachersData.length / teachersPerPage);
    const startIndex = (currentPage - 1) * teachersPerPage;
    const currentTeachers = allTeachersData.slice(
        startIndex,
        startIndex + teachersPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const TeacherCard = ({ _id, name, skills, avatar, createdAt }) => (
        <div className="p-6 rounded-lg border border-border hover:border-foreground transition space-y-4 group cursor-pointer">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-foreground flex items-center justify-center text-background font-bold text-xl">
                {avatar ? (
                    <img
                        src={avatar}
                        alt="Teacher Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    "T"
                )}
            </div>
            <div className="space-y-2">
                <h3 className="font-bold text-lg group-hover:text-foreground transition">
                    {name}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {skills?.join(", ") || "No skills listed"}
                </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <span>Since {createdAt?.slice(0, 10)}</span>
                </div>
            </div>
            <Link to={`/teacher/${_id}`}>
                <Button size="sm" className="w-full">
                    View Profile
                </Button>
            </Link>
        </div>
    );

    if (allTeachersLoading)
        return <p className="text-center py-10">Loading teachers...</p>;

    if (allTeachersError)
        return (
            <p className="text-center text-red-500 py-10">
                Error: {allTeachersError}
            </p>
        );

    return (
        <div className="border-t border-border px-4 sm:px-6 lg:px-8 py-12 flex-grow min-h-screen">
            <h2 className="text-2xl font-bold capitalize mb-5">
                All Instructors
            </h2>

            {/* Teacher Grid */}
            <div className="grid md:grid-cols-4 gap-6">
                {currentTeachers.map((ele) => (
                    <TeacherCard key={ele._id || ele.name} {...ele} />
                ))}
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
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {/* Ellipsis (optional for large page sets) */}
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
    );
}
