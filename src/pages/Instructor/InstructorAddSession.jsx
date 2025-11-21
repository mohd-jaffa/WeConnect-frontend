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
import { useState, useEffect } from "react";
import { CategoryCombobox } from "@/utils/CategoryCombobox";
import SessionSlotManager from "@/utils/SessionSlotManager";
import { useFormik } from "formik";
import axios from "@/config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function InstructorAddSession() {
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const formik = useFormik({
        initialValues: {
            title: "",
            category: "",
            thumbnail: "",
            description: "",
            slots: [],
            amount: 1,
        },
        validate: (values) => {
            const errors = {};

            if (!values.title) errors.title = "Title is required";
            else if (!/^.{5,128}$/.test(values.title))
                errors.title = "Title must be 5-128 characters";

            if (!values.description)
                errors.description = "Description is required";
            else if (!/^.{5,1024}$/.test(values.description))
                errors.description = "Description must be 5-1024 characters";

            if (!values.category) errors.category = "Category is required";
            if (!values.thumbnail) errors.thumbnail = "Thumbnail is required";
            if (!values.slots || values.slots.length === 0)
                errors.slots = "At least one session slot is required";
            if (!values.amount || values.amount < 1)
                errors.amount = "Amount cannot be Zero or less";

            return errors;
        },
        onSubmit: (values) => handleSessionSubmit(values),
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
                transformedSlot.isRecurring = true;
                transformedSlot.startTime = slot.startTime;
                transformedSlot.endTime = slot.endTime;
                if (slot.days && slot.days.length > 0) {
                    transformedSlot.daysOfWeek = slot.days
                        .map((day) => dayMap[day])
                        .filter(Boolean);
                }
            } else {
                transformedSlot.isRecurring = false;
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
            const transformedValues = {
                ...values,
                slots: transformSlotsForBackend(values.slots),
            };
            console.log(transformedValues);
            if (isEditMode) {
                await axios.put(`/teachers/sessions/${id}`, transformedValues, {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                toast.success("Session updated successfully!", {
                    theme: "success",
                });
            } else {
                await axios.post("/teachers/sessions", transformedValues, {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                toast.success("Session added successfully!", {
                    theme: "success",
                });
            }
            navigate("/instructor/sessions");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save session. Please try again.", {
                theme: "error",
            });
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
            toast.error("Failed to upload thumbnail. Please try again.", {
                theme: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (isEditMode) {
            const fetchSession = async () => {
                try {
                    const response = await axios.get(
                        `/teachers/sessions/${id}`,
                        {
                            headers: {
                                Authorization: localStorage.getItem("token"),
                            },
                        }
                    );
                    const data = response.data;
                    console.log(response.data);
                    formik.setValues({
                        title: data.title,
                        category: data.category,
                        thumbnail: data.thumbnail,
                        description: data.description,
                        slots: data.slots,
                        amount: data.amount,
                    });
                    if (data.thumbnail) setPreview(data.thumbnail);
                } catch (err) {
                    console.error("Error fetching session:", err);
                    toast.error("Failed to load session details", {
                        theme: "error",
                    });
                }
            };
            fetchSession();
        }
    }, [isEditMode, id]);

    return (
        <div className="w-full p-4">
            <div className="w-full max-w-4xl">
                <form onSubmit={formik.handleSubmit}>
                    <FieldSet>
                        <FieldLegend>
                            {isEditMode ? "Edit Session" : "Add Session"}
                        </FieldLegend>
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
                                    placeholder="Enter the Title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    className="min-h-[100px] resize-none sm:min-w-[300px]"
                                />
                            </Field>

                            <FieldSeparator />

                            <div className="flex justify-between">
                                <div>
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
                                                value={formik.values.category}
                                            />
                                        </FieldContent>
                                    </Field>
                                </div>
                                <div>
                                    <Field orientation="responsive">
                                        <FieldContent className="gap-3">
                                            <FieldLabel htmlFor="amount">
                                                Amount
                                            </FieldLabel>
                                            <FieldDescription>
                                                Amount you charge per hour
                                            </FieldDescription>
                                            <Input
                                                id="amount"
                                                type="number"
                                                placeholder="₹ per hour"
                                                value={formik.values.amount}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                required
                                                min={1}
                                            />
                                        </FieldContent>
                                    </Field>
                                </div>
                            </div>

                            <FieldSeparator />

                            <Field orientation="responsive">
                                <FieldContent>
                                    <FieldLabel htmlFor="thumbnail">
                                        Thumbnail
                                    </FieldLabel>
                                    <FieldDescription>
                                        Upload a thumbnail for your session.
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
                                                        <Image
                                                            size={20}
                                                            strokeWidth={0.75}
                                                        />
                                                    </div>
                                                    <p className="text-muted-foreground mt-2 text-xs">
                                                        *.png, *.jpg, *.jpeg
                                                        only
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
                                        Write detailed description.
                                    </FieldDescription>
                                </FieldContent>
                                <Textarea
                                    id="description"
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
                                {Object.values(formik.errors).map((err, i) => (
                                    <p key={i}>{err}</p>
                                ))}
                            </div>
                            <Field orientation="responsive">
                                <Button type="submit" disabled={loading}>
                                    {isEditMode
                                        ? "Update Session"
                                        : "Add Session"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        navigate("/instructor/sessions")
                                    }
                                >
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
