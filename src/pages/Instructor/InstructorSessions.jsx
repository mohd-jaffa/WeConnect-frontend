import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
    ItemActions,
    ItemSeparator,
} from "@/components/ui/item";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Settings,
    Plus,
    Hourglass,
    BookA,
    CirclePlus,
    CalendarDays,
    Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import axios from "@/config/axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function InstructorSessions() {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get("/teachers/sessions", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setSessions(response.data);
                console.log(response.data);
            } catch (err) {
                console.error("Error fetching users:", error);
                alert("Failed to fetch users");
            }
        };
        fetchSessions();
    }, []);

    return (
        <div>
            <div className="flex justify-between">
                <div className="text-3xl font-semibold pl-5">All Sessions</div>
                <Button className="mr-5 rounded">
                    <CirclePlus
                        size={24}
                        strokeWidth={2}
                        className="mt-[2px]"
                    />{" "}
                    Add Session
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-6 p-5">
                {sessions.map((ele) => (
                    <Card
                        key={ele._id}
                        className="relative overflow-hidden border-0 p-6 h-full flex flex-col justify-between"
                    >
                        <CardHeader>
                            <CardTitle className="flex mb-1 text-lg leading-tight font-semibold">
                                {/* <BookA size={16} strokeWidth={1.25} color="gray" className="mt-[5.3px] mr-2 " /> */}
                                {ele.title}
                            </CardTitle>
                            <CardDescription className="text-xs font-mono flex">
                                {ele.createdAt.slice(0, 10)}
                                <Badge
                                    variant="secondary"
                                    className="ml-3 mt-[-4px]"
                                >
                                    {ele.category}
                                </Badge>
                            </CardDescription>
                            <CardAction className="flex">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-4 right-4 h-auto p-1"
                                >
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </CardAction>
                        </CardHeader>

                        <CardContent>
                            <p className="text-muted-foreground text-l">
                                {ele.description}
                            </p>
                        </CardContent>

                        <CardFooter className="grid">
                            <p></p>
                            <code className="relative rounded  py-[0.2rem] font-mono text-sm font-semibold">
                                Slot Type:{" "}
                                {ele?.slots[0]?.isRecurring
                                    ? "Repeating"
                                    : "Non-Repeating"}
                                {ele.slots[0]?.isRecurring
                                    ? ele.slots.map((slot, index) => (
                                          <div key={index}>
                                              <p className="flex">
                                                  <CalendarDays
                                                      size={18}
                                                      color="gray"
                                                      className="mr-1"
                                                  />
                                                  {Array.isArray(
                                                      slot.daysOfWeek
                                                  )
                                                      ? slot.daysOfWeek.join(
                                                            ", "
                                                        )
                                                      : "N/A"}
                                              </p>
                                              <p className="flex">
                                                  <Clock
                                                      size={18}
                                                      color="gray"
                                                      className="mr-1"
                                                  />
                                                  {slot.startTime} -{" "}
                                                  {slot.endTime}
                                              </p>
                                          </div>
                                      ))
                                    : ele.slots.map((slot, index) => (
                                          <div key={index}>
                                              <p className="flex">
                                                  <CalendarDays
                                                      size={18}
                                                      color="gray"
                                                      className="mr-1"
                                                  />
                                                  {slot.startDate?.slice(0, 10)}{" "}
                                                  - {slot.endDate?.slice(0, 10)}
                                              </p>
                                              <p className="flex">
                                                  <Clock
                                                      size={18}
                                                      color="gray"
                                                      className="mr-1"
                                                  />
                                                  {slot.startDate.slice(11, 16)}{" "}
                                                  - {slot.endDate.slice(11, 16)}
                                              </p>
                                          </div>
                                      ))}
                            </code>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
