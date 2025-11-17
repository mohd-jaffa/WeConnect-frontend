import { useEffect, useState } from "react";
import axios from "@/config/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function InstructorMyStudents() {
    const [loading, setLoading] = useState(true);
    const [myStudents, setMyStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ search state

    // ✅ Fetch all students for this teacher
    useEffect(() => {
        const fetchMyStudents = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/teachers/students", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setMyStudents(response.data);
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong while loading students.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyStudents();
    }, []);

    // 🌀 Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    const filteredStudents = searchTerm.trim()
        ? myStudents.filter((student) => {
              const term = searchTerm.toLowerCase();
              return (
                  student.name?.toLowerCase().includes(term) ||
                  student.email?.toLowerCase().includes(term) ||
                  student.bio?.toLowerCase().includes(term)
              );
          })
        : myStudents;

    // ❌ No students at all
    if (myStudents.length == 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    No Students Found
                </Button>
            </div>
        );
    }

    return (
        <div className="p-5 space-y-6">
            {/* Page Title */}
            <h2 className="text-2xl font-semibold">My Students</h2>

            {/* 🔍 Search Bar */}
            <div className="relative w-[375px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    type="text"
                    placeholder="Search for students..."
                    className="pl-9 pr-4 py-2 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Student Cards */}
            {filteredStudents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((ele) => (
                        <Link
                            key={ele._id}
                            to={`/instructor/student/${ele._id}`}
                        >
                            <Card className="hover:shadow-lg transition-all cursor-pointer">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    {/* Avatar */}
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage
                                            src={ele.avatar}
                                            alt={ele.name}
                                        />
                                        <AvatarFallback>
                                            {ele.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "S"}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Student Info */}
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-semibold text-lg">
                                            {ele.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {ele.bio || "No bio available"}
                                        </p>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                // ❌ No matches found
                <div className="flex justify-center items-center h-64">
                    <Button variant="outline" disabled size="sm">
                        No matching students found
                    </Button>
                </div>
            )}
        </div>
    );
}
