import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/UserContext";
import axios from "@/config/axios";

export default function SessionShow() {
    const { id } = useParams();
    const { handleLogout } = useContext(UserContext);
    const [date, setDate] = useState("");
    const [sessionDetails, setSessionDetails] = useState(null);
    const [slots, setSlots] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState("");

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`/sessions/${id}`);
                setSessionDetails(response.data);
            } catch (err) {
                toast.error("something went wrong, please login again");
                handleLogout();
                navigate("/login");
            }
        };
        fetchTeachers();
    }, []);

    const handleFetchSlots = async (date) => {
        try {
            if (!date) {
                console.log("No date selected");
                return;
            }
            const formattedDate = format(date, "yyyy-MM-dd");
            const response = await axios.post(
                `/slots/${id}`,
                { date: formattedDate },
                {
                    headers: { Authorization: localStorage.getItem("token") },
                }
            );
            setSlots(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault;
        const selectedTimeObj = slots.find(
            (ele) => ele.time.start === selectedSlot
        );
        const payload = {
            details: id,
            time: selectedTimeObj.time,
        };
        try {
            const response = await axios.post("/bookings", payload, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            console.log(response.data);
            toast.success("slot booking successfull");
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

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
            <div className="flex gap-5 mb-8">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            data-empty={!date}
                            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                        >
                            <CalendarIcon />
                            {date ? (
                                format(date, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(day) =>
                                day.setHours(0, 0, 0, 0) <
                                new Date().setHours(0, 0, 0, 0)
                            }
                        />
                    </PopoverContent>
                    <Button onClick={() => handleFetchSlots(date)}>
                        Check Availibility
                    </Button>
                </Popover>
            </div>
            <div>
                {slots == null ? null : slots.length == 0 ? (
                    <p>No slots available</p>
                ) : (
                    <RadioGroup
                        value={selectedSlot}
                        onValueChange={setSelectedSlot}
                        className="space-y-2"
                        defaultValue=""
                    >
                        {slots.map((ele) => (
                            <div
                                key={ele.time.start}
                                className="flex items-center space-x-2"
                            >
                                <RadioGroupItem
                                    value={ele.time.start}
                                    id={`slot-${ele.time.start}`}
                                />
                                <Label htmlFor={`slot-${ele.time.start}`}>
                                    {ele.time.start.slice(11, 16)} –{" "}
                                    {ele.time.end.slice(11, 16)}
                                </Label>
                            </div>
                        ))}
                        <Button
                            onClick={handleSubmit}
                            className="w-xs"
                            size="sm"
                            disabled={selectedSlot == ""}
                        >
                            Book Slot
                        </Button>
                    </RadioGroup>
                )}
            </div>
        </div>
    );
}
