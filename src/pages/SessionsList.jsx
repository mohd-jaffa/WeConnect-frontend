import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemMedia,
    ItemTitle,
    ItemGroup,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LazyLoadImage } from "react-lazy-load-image-component";
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

    const [sessionsList, setSessionsList] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get("/sessions", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setSessionsList(response.data);
                console.log(response.data);
            } catch (err) {
                toast.error("something went wrong, please login again");
                handleLogout();
                navigate("/login");
            }
        };
        fetchTeachers();
    }, []);

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
        <div className="container mx-auto px-4 py-8">
            <div className="mt-5">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Recent Posts</h2>
                    <Button variant="outline" asChild>
                        <Link href="#">All Posts</Link>
                    </Button>
                </div>
                <div className="grid grid-cols-4 gap-6">
                    {sessionsList.map((ele) => {
                        return (
                            <Link to={`/session/${ele._id}`}>
                                <div
                                    className="bg-card text-card-foreground overflow-hidden rounded-lg border transition-shadow duration-300 hover:shadow-lg"
                                    key={ele._id}
                                >
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
                                    <div className="grid gap-2 p-4">
                                        <h3 className="text-lg leading-tight font-semibold">
                                            {ele.title}
                                        </h3>
                                        <p className="text-muted-foreground line-clamp-3 text-sm">
                                            {ele.description}
                                        </p>
                                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage
                                                    src={
                                                        ele?.teachersId?.avatar
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {"authorName"
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{ele.teachersId.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
