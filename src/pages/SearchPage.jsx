import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "@/config/axios";
import { Search, Info } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function SearchPage() {
    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (searchValue) {
            try {
                const response = await axios.post(
                    "/search",
                    { keyword: searchValue },
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                setSearchResult({
                    filteredTeachers: response.data.users,
                    filteredSessions: response.data.sessions,
                });
            } catch (err) {
                toast.error("something went wrong!");
            }
        }
    };

    const TeacherCard = ({ teacher }) => (
        <div className="p-6 rounded-lg border border-border hover:border-foreground transition space-y-4 group cursor-pointer">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-foreground flex items-center justify-center text-background font-bold text-xl">
                {teacher.avatar ? (
                    <img
                        src={teacher.avatar}
                        alt="Teacher Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    "T"
                )}
            </div>
            <div className="space-y-2">
                <h3 className="font-bold text-lg group-hover:text-foreground transition">
                    {teacher.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {teacher.skills?.join(", ") || "No skills listed"}
                </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <span>Since {teacher.createdAt?.slice(0, 10)}</span>
                </div>
            </div>
            <Link to={`/teacher/${teacher._id}`}>
                <Button size="sm" className="w-full">
                    View Profile
                </Button>
            </Link>
        </div>
    );

    const TeachersSection = ({ teachers }) => (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        Tutors
                    </h2>
                    <p className="text-muted-foreground">
                        {teachers.length} tutors found
                    </p>
                </div>
                {teachers.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {teachers.map((teacher) => (
                            <TeacherCard key={teacher._id} teacher={teacher} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 rounded-lg border border-border bg-card">
                        <p className="text-muted-foreground">
                            No tutors found. Try a different search.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );

    const SessionCard = ({ session }) => (
        <div className="p-6 rounded-lg border border-border hover:border-foreground transition space-y-4 group cursor-pointer bg-gray-50">
            <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <h3 className="font-bold text-lg group-hover:text-foreground transition">
                        {session.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        by {session.teachersId.name}
                    </p>
                </div>
                <span className="text-xs px-3 py-1 bg-card border border-border rounded-full">
                    {session.category}
                </span>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Info size={16} className="mt-[2px]" />
                    {session.description}
                </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="font-bold">₹{session.amount}</p>

                <Link to={`/session/${session._id}`}>
                    <Button size="sm" variant="outline">
                        View Details
                    </Button>
                </Link>
            </div>
        </div>
    );

    const SessionsSection = ({ sessions }) => (
        <section className="border-t border-border px-4 sm:px-6 lg:px-8 py-12 bg-card">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        Sessions
                    </h2>
                    <p className="text-muted-foreground">
                        {sessions.length} sessions found
                    </p>
                </div>

                {sessions.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {sessions.map((session) => (
                            <SessionCard key={session._id} session={session} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 rounded-lg border border-border bg-background">
                        <p className="text-muted-foreground">
                            No sessions found. Try a different search.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 flex-grow min-h-screen">
            <div className="grid justify-center text-center gap-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Find Your Perfect Tutor or Session
                </h1>
                <p className="text-muted-foreground">
                    Search for tutors, subjects, or specific sessions
                </p>
            </div>
            <div className="mt-3">
                <form
                    className="flex justify-center gap-3"
                    onSubmit={handleSubmit}
                >
                    <div className="w-sm">
                        <InputGroup>
                            <InputGroupInput
                                placeholder="Search..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                            <InputGroupAddon align="inline-end">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <InputGroupButton
                                            className="rounded-full"
                                            size="icon-xs"
                                        >
                                            <Info />
                                        </InputGroupButton>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Search for tutors or sessions
                                    </TooltipContent>
                                </Tooltip>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div>
                        <Button type="submit">Search</Button>
                    </div>
                </form>
            </div>
            <div>
                {searchResult ? (
                    <>
                        <TeachersSection
                            teachers={searchResult.filteredTeachers}
                        />
                        <SessionsSection
                            sessions={searchResult.filteredSessions}
                        />
                    </>
                ) : (
                    <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center space-y-4">
                            <svg
                                className="w-16 h-16 mx-auto text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <h2 className="text-2xl font-bold">
                                Start Your Search
                            </h2>
                            <p className="text-muted-foreground max-w-md">
                                Search for tutors by name, subject, or skills.
                                Or find specific sessions that match your
                                learning goals.
                            </p>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
