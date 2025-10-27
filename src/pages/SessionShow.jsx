import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/UserContext";
import axios from "@/config/axios";

export default function SessionShow() {
    const { id } = useParams();
    const { handleLogout } = useContext(UserContext);

    const [sessionDetails, setSessionDetails] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`/sessions/${id}`);
                setSessionDetails(response.data);
                console.table(response.data);
            } catch (err) {
                toast.error("something went wrong, please login again");
                handleLogout();
                navigate("/login");
            }
        };
        fetchTeachers();
    }, []);

    if (sessionDetails == null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-12 ">
            <div className="space-y-6">
                <Badge variant="outline">{sessionDetails.category}</Badge>
                <h1 className="capitalize text-foreground text-5xl leading-15 font-bold tracking-tight">
                    {sessionDetails.title}
                </h1>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={sessionDetails?.avatar}
                                alt="instructor name"
                                className="object-cover"
                            />
                            <AvatarFallback>
                                {"instructor name".charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">
                                by {sessionDetails?.teachersId.name}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {sessionDetails.createdAt.slice(0, 10)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
                            Share this
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-blog-hover h-9 w-9 rounded-full"
                        >
                            <Twitter />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-blog-hover h-9 w-9 rounded-full"
                        >
                            <Facebook />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-blog-hover h-9 w-9 rounded-full"
                        >
                            <Linkedin />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-16">
                <article className="space-y-8">
                    <div className="bg-muted aspect-video w-full overflow-hidden rounded-xl">
                        <img
                            src={sessionDetails?.thumbnail}
                            alt="session image"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="prose prose-lg max-w-none">
                        <p className="text-blog-content mb-6 leading-relaxed">
                            {sessionDetails.description}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}
