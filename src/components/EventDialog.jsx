import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export default function EventDialog({ open, onClose, event }) {
    if (!event) return null;

    const formatTime = (t) => new Date(t).toLocaleString();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{event.title}</DialogTitle>
                    <DialogDescription>
                        {event.description || "No description provided"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 text-sm">
                    <p>
                        <strong>Teacher:</strong> {event.teacher}
                    </p>
                    <p>
                        <strong>Student:</strong> {event.student}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span className="capitalize">{event.status}</span>
                    </p>
                    <p>
                        <strong>From:</strong> {formatTime(event.start)}
                    </p>
                    <p>
                        <strong>To:</strong> {formatTime(event.end)}
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="secondary" asChild>
                        <a
                            href={event.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <CalendarDays className="h-4 w-4 mr-2" /> Join
                            Meeting
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
