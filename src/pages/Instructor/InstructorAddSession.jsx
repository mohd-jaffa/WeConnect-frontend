import {
    ChevronDownIcon,
    Check,
    ChevronsUpDown,
    ImageIcon,
    Image,
    PlusCircle,
    Plus,
    Trash2,
    CalendarIcon,
    Clock,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CategoryCombobox } from "@/utils/CategoryCombobox";
import SessionSlotManager from "@/utils/SessionSlotManager";
import { useFormik } from "formik";
import axios from "@/config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function InstructorAddSession() {
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: "",
            category: "",
            thumbnail: "",
            description: "",
            slots: [],
        },
        validate: (values) => {
            const errors = {};

            if (!values.title) {
                errors.title = "Title is required";
            } else if (!/^.{5,128}$/.test(values.title)) {
                errors.title = "Title must be 5-128 characters";
            }
            if (!values.description) {
                errors.description = "Description is required";
            } else if (!/^.{5,1024}$/.test(values.description)) {
                errors.description = "Description must be 5-1024 characters";
            }
            if (!values.category) {
                errors.category = "Category is required";
            }
            if (!values.thumbnail) {
                errors.thumbnail = "Thumbnail is required";
            }
            if (!values.slots || values.slots.length === 0) {
                errors.slots = "At least one session slot is required";
            }
            return errors;
        },
        onSubmit: (values) => {
            handleSessionSubmit(values);
        },
    });

    const transformSlotsForBackend = (slots) => {
        const dayMap = {
            Monday: "mon",
            Tuesday: "tue",
            Wednesday: "wed",
            Thursday: "thu",
            Friday: "fri",
            Saturday: "sat",
            Sunday: "sun",
        };

        return slots.map((slot) => {
            const transformedSlot = {};

            if (slot.isRecurring) {
                // For recurring slots
                transformedSlot.isRecurring = true;
                transformedSlot.startTime = slot.startTime; // Already in HH:MM format
                transformedSlot.endTime = slot.endTime; // Already in HH:MM format
                
                // Convert day names to backend format
                if (slot.days && slot.days.length > 0) {
                    transformedSlot.daysOfWeek = slot.days
                        .map((day) => dayMap[day])
                        .filter(Boolean);
                }
            } else {
                // For non-recurring slots
                transformedSlot.isRecurring = false;
                
                // Convert datetime-local format to ISO 8601 with seconds
                if (slot.startDate) {
                    transformedSlot.startDate = slot.startDate.replace(
                        /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/,
                        "$1:00"
                    );
                }
                if (slot.endDate) {
                    transformedSlot.endDate = slot.endDate.replace(
                        /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/,
                        "$1:00"
                    );
                }
            }

            return transformedSlot;
        });
    };

    const handleSessionSubmit = async (values) => {
        try {
            setLoading(true);
            
            // Transform slots to match backend schema
            const transformedValues = {
                ...values,
                slots: transformSlotsForBackend(values.slots),
            };

            const response = await axios.post("/teachers/sessions", transformedValues, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            toast.success("Session Added Successfully");
            navigate("/instructor/sessions");
        } catch (err) {
            console.error(err);
            alert("Failed to add session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        formik.setFieldValue("category", category);
    };

    const handleFileChange = async (e) => {
        setUploading(true);
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("thumbnail", file);
        try {
            const response = await axios.post("/thumbnail", formData, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "multipart/form-data",
                },
            });
            const newThumbnailUrl = response.data?.thumbnailUrl;
            formik.setFieldValue("thumbnail", newThumbnailUrl);
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        } catch (err) {
            console.error(err);
            alert("Failed to upload thumbnail. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full p-4">
            <div className="w-full max-w-4xl">
                <form onSubmit={formik.handleSubmit}>
                    <FieldSet>
                        <FieldLegend>Add Session</FieldLegend>
                        <FieldDescription>
                            Fill in your session details.
                        </FieldDescription>
                        <FieldSeparator />
                        <FieldGroup>
                            <Field orientation="responsive">
                                <FieldContent>
                                    <FieldLabel htmlFor="title">
                                        Title
                                    </FieldLabel>
                                    <FieldDescription>
                                        Give a Title for your Session
                                    </FieldDescription>
                                </FieldContent>
                                <Textarea
                                    id="title"
                                    label="Title"
                                    placeholder="Enter the Title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    className="min-h-[100px] resize-none sm:min-w-[300px]"
                                />
                            </Field>

                            <FieldSeparator />

                            <Field orientation="responsive">
                                <FieldContent className="gap-3">
                                    <FieldLabel htmlFor="category">
                                        Category
                                    </FieldLabel>
                                    <FieldDescription>
                                        Select Category for your Session
                                    </FieldDescription>
                                    <CategoryCombobox
                                        onChange={handleCategoryChange}
                                    />
                                </FieldContent>
                            </Field>

                            <FieldSeparator />

                            <Field orientation="responsive">
                                <FieldContent>
                                    <FieldLabel htmlFor="thumbnail">
                                        Thumbnail
                                    </FieldLabel>
                                    <FieldDescription>
                                        Upload a thumbnail / cover photo for
                                        your session. Max 5MB!
                                    </FieldDescription>
                                    <div className="grid max-w-sm items-center gap-5 mt-3">
                                        {preview ? (
                                            <Card>
                                                <CardContent>
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <Card>
                                                <CardContent>
                                                    <div className="rounded-lg border-2 border-dashed p-8 text-center">
                                                        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center text-xl">
                                                            <Image
                                                                size={20}
                                                                strokeWidth={
                                                                    0.75
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-muted-foreground mt-2 text-xs">
                                                        Set the session
                                                        thumbnail image. Only
                                                        *.png, *.jpg, *.jpeg
                                                        files allowed.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                        />
                                    </div>
                                </FieldContent>
                            </Field>

                            <FieldSeparator />

                            <Field orientation="responsive">
                                <FieldContent>
                                    <FieldLabel htmlFor="description">
                                        Description
                                    </FieldLabel>
                                    <FieldDescription>
                                        You can write your description here.
                                        Keep it detailed.
                                    </FieldDescription>
                                </FieldContent>
                                <Textarea
                                    id="description"
                                    label="Description"
                                    placeholder="Enter the Description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    className="min-h-[100px] sm:min-w-[300px]"
                                />
                            </Field>

                            <FieldSeparator />

                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldLabel htmlFor="slots">
                                        Session Slots
                                    </FieldLabel>
                                    <SessionSlotManager
                                        slots={formik.values.slots}
                                        onChange={(slots) =>
                                            formik.setFieldValue("slots", slots)
                                        }
                                    />
                                </FieldContent>
                            </Field>

                            <FieldSeparator />
                            <div className="text-red-600 space-y-1">
                                {formik.errors.title && (
                                    <p>{formik.errors.title}</p>
                                )}
                                {formik.errors.category && (
                                    <p>{formik.errors.category}</p>
                                )}
                                {formik.errors.thumbnail && (
                                    <p>{formik.errors.thumbnail}</p>
                                )}
                                {formik.errors.description && (
                                    <p>{formik.errors.description}</p>
                                )}
                                {formik.errors.slots && (
                                    <p>{formik.errors.slots}</p>
                                )}
                            </div>
                            <Field orientation="responsive">
                                <Button
                                    type="submit"
                                    onClick={formik.handleSubmit}
                                >
                                    Submit
                                </Button>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </form>
            </div>
        </div>
    );
}
