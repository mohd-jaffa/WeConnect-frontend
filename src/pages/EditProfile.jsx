import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    User,
    NotebookPen,
    CircleDollarSign,
    LogOut,
    InfoIcon,
    SearchIcon,
    MailIcon,
    CircleUser,
    PersonStanding,
    ScrollText,
    Calendar1,
} from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFormik } from "formik";
import UserContext from "@/context/UserContext";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import axios from "@/config/axios";
import { toast } from "sonner";

const LabeledInput = function LabeledInput({
    id,
    label,
    placeholder,
    tooltip,
    value,
    onChange,
    type = "text",
    as = "input",
    disabled = false,
    Icon = null,
    onBlur,
}) {
    return (
        <div className="grid w-full max-w-lg gap-4">
            <InputGroup className="w-full">
                {as === "textarea" ? (
                    <InputGroupTextarea
                        id={id}
                        name={id}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        onBlur={onBlur}
                    />
                ) : (
                    <InputGroupInput
                        id={id}
                        name={id}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        onBlur={onBlur}
                    />
                )}
                <InputGroupAddon align="block-start">
                    {Icon}
                    <Label htmlFor={id} className="text-foreground">
                        {label}
                    </Label>

                    {tooltip && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <InputGroupButton
                                    variant="ghost"
                                    aria-label="Help"
                                    className="ml-auto rounded-full"
                                    size="icon-xs"
                                >
                                    <InfoIcon size={14} />
                                </InputGroupButton>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};

export default function EditProfile() {
    const { user, handleProfileUpdate } = useContext(UserContext);
    const [uploading, setUploading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            bio: user?.bio || "",
            skills: user?.skills?.join(", ") || "",
            avatar: user?.avatar || "",
        },
        validate: (values) => {
            const errors = {};
            if (!values.name) {
                errors.name = "Name is required";
            }
            return errors;
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            const formattedValues = {
                ...values,
                skills: values.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
            };
            handleProfileUpdate(formattedValues);
        },
    });

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("avatar", file);
        try {
            setUploading(true);
            const response = await axios.post("/avatar", formData, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "multipart/form-data",
                },
            });
            const newAvatarUrl = response.data?.avatarUrl;
            formik.setFieldValue("avatar", newAvatarUrl);
            handleProfileUpdate({ ...user, avatar: newAvatarUrl });
        } catch (err) {
            console.error(
                "Error uploading avatar:",
                err?.response?.data?.error
            );
            toast.error("Failed to upload avatar. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    console.log("User from context:", user);
console.log("Formik initial values:", formik.initialValues);
console.log("Formik current values:", formik.values);


    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-5 animate-fade-in">
                <div className="text-2xl font-semibold">
                    Profile <br />
                    <span className="text-xs font-mono font-light">
                        view and edit your profile
                    </span>
                </div>
                <div className="flex gap-5">
                    <div>
                        <Avatar className="w-16 h-16">
                            <AvatarImage
                                src={formik.values.avatar || user.avatar}
                            />
                            <AvatarFallback>
                                {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="picture">Avatar</Label>
                        <Input
                            id="picture"
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>
                <div>
                    <LabeledInput
                        id="name"
                        label="Name"
                        placeholder="Enter your name"
                        tooltip="Your full name as it appears on your profile"
                        value={formik.values.name}
                        Icon={<CircleUser className="mt-[1px]" />}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div>
                    <LabeledInput
                        id="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={user.email}
                        type="email"
                        disabled={true}
                        Icon={<MailIcon className="mt-[1px]" />}
                    />
                </div>
                <div>
                    <LabeledInput
                        id="bio"
                        label="Bio"
                        placeholder="Write About Yourself..."
                        tooltip="Let others know about you"
                        value={formik.values.bio}
                        as="textarea"
                        Icon={<PersonStanding />}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div>
                    <LabeledInput
                        id="skills"
                        label="Skills"
                        placeholder="Comma-separated skills..."
                        tooltip="e.g. React, Tailwind, Node.js"
                        value={formik.values.skills}
                        Icon={<ScrollText />}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div>
                    <LabeledInput
                        id="joined"
                        label="Joined"
                        value={user?.createdAt.slice(0, 10)}
                        disabled={true}
                        Icon={<Calendar1 />}
                    />
                </div>
            </div>
            <Button
                type="submit"
                disabled={!formik.isValid || (!formik.dirty && !formik.touched)}
                className="mt-4"
            >
                Submit
            </Button>
        </form>
    );
}
