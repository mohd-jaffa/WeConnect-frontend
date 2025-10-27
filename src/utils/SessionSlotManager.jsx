"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Clock } from "lucide-react";

export default function SessionSlotManager({ slots = [], onChange }) {
    const dayMap = {
        Monday: "mon",
        Tuesday: "tue",
        Wednesday: "wed",
        Thursday: "thu",
        Friday: "fri",
        Saturday: "sat",
        Sunday: "sun",
    };

    const weekdays = Object.keys(dayMap);

    // Utility to remove `id` before sending to parent
    const sanitizeSlots = (slotsArray) =>
        slotsArray.map(({ id, ...rest }) => rest);

    // Ensure slots have IDs for internal tracking
    const slotsWithIds = slots.map((slot, index) => ({
        ...slot,
        id: slot.id || `slot-${index}-${Date.now()}`,
    }));

    // Add new slot
    const addSlot = () => {
        const newSlot = {
            id: Date.now(),
            isRecurring: false,
            startDate: "",
            endDate: "",
            days: [],
            startTime: "",
            endTime: "",
        };
        const updatedSlots = [...slotsWithIds, newSlot];
        onChange(sanitizeSlots(updatedSlots));
    };

    // Delete slot
    const deleteSlot = (id) => {
        const updatedSlots = slotsWithIds.filter((s) => s.id !== id);
        onChange(sanitizeSlots(updatedSlots));
    };

    // Update slot
    const updateSlot = (id, updates) => {
        const updatedSlots = slotsWithIds.map((s) => 
            s.id === id ? { ...s, ...updates } : s
        );
        onChange(sanitizeSlots(updatedSlots));
    };

    return (
        <div className="space-y-6">
            <Button
                type="button"
                variant="outline"
                onClick={addSlot}
                className="flex items-center gap-2"
            >
                <Plus size={16} /> Add Slot
            </Button>

            {slotsWithIds.map((slot, index) => (
                <div
                    key={slot.id}
                    className="border rounded-lg p-4 space-y-4 bg-gray-50"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">Slot {index + 1}</h3>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteSlot(slot.id)}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Switch
                            id={`slot-${slot.id}-recurring`}
                            checked={slot.isRecurring}
                            onCheckedChange={(checked) =>
                                updateSlot(slot.id, {
                                    isRecurring: checked,
                                    ...(checked
                                        ? { startDate: "", endDate: "" }
                                        : {
                                              days: [],
                                              startTime: "",
                                              endTime: "",
                                          }),
                                })
                            }
                        />
                        <Label htmlFor={`slot-${slot.id}-recurring`}>
                            {slot.isRecurring
                                ? "Recurring Slot"
                                : "Non-Recurring Slot"}
                        </Label>
                    </div>

                    {slot.isRecurring ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                {weekdays.map((day) => (
                                    <div
                                        key={day}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`${slot.id}-${day}`}
                                            checked={slot.days?.includes(day) || false}
                                            onCheckedChange={(checked) => {
                                                const currentDays = slot.days || [];
                                                const newDays = checked
                                                    ? [...currentDays, day]
                                                    : currentDays.filter(
                                                          (d) => d !== day
                                                      );
                                                updateSlot(slot.id, {
                                                    days: newDays,
                                                });
                                            }}
                                        />
                                        <Label htmlFor={`${slot.id}-${day}`}>
                                            {day}
                                        </Label>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mt-4">
                                <div className="flex flex-col gap-1">
                                    <Label>Start Time</Label>
                                    <div className="flex items-center gap-2">
                                        <Clock
                                            size={14}
                                            className="text-gray-500"
                                        />
                                        <Input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={(e) =>
                                                updateSlot(slot.id, {
                                                    startTime: e.target.value,
                                                })
                                            }
                                            className="w-36"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>End Time</Label>
                                    <div className="flex items-center gap-2">
                                        <Clock
                                            size={14}
                                            className="text-gray-500"
                                        />
                                        <Input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) =>
                                                updateSlot(slot.id, {
                                                    endTime: e.target.value,
                                                })
                                            }
                                            className="w-36"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-1">
                                <Label>Start Date & Time</Label>
                                <Input
                                    type="datetime-local"
                                    value={slot.startDate}
                                    onChange={(e) =>
                                        updateSlot(slot.id, {
                                            startDate: e.target.value,
                                        })
                                    }
                                    className="w-60"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>End Date & Time</Label>
                                <Input
                                    type="datetime-local"
                                    value={slot.endDate}
                                    onChange={(e) =>
                                        updateSlot(slot.id, {
                                            endDate: e.target.value,
                                        })
                                    }
                                    className="w-60"
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
