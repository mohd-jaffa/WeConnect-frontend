import React from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export default function EventHoverCard({ children, event }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardContent className="w-64">
                <div className="space-y-2">
                    <h4 className="font-semibold text-lg">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                        <strong>Teacher:</strong> {event.teacher || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Status:</strong> {event.status}
                    </p>
                    {event.meetLink && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() =>
                                window.open(event.meetLink, "_blank")
                            }
                        >
                            Join Meet
                        </Button>
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
