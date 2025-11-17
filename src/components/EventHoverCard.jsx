import React from "react";
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card";

export default function EventHoverCard({ children, event }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardContent className="w-72 space-y-1">
                <p className="font-semibold text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground capitalize">
                    {event.status}
                </p>
                <p className="text-xs text-muted-foreground">
                    {new Date(event.start).toLocaleString()} -{" "}
                    {new Date(event.end).toLocaleTimeString()}
                </p>
            </HoverCardContent>
        </HoverCard>
    );
}
