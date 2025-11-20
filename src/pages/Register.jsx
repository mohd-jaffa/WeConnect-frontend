import { GalleryVerticalEnd } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/UserContext";
import { toast } from "sonner";

export default function Register({ className }) {
    const { handleRegister } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "student",
        },
        validate: (values) =>
            Object.assign(
                {},
                !values.name
                    ? { name: "Name is required" }
                    : !/^[A-Za-z\s]{5,30}$/.test(values.name)
                    ? { name: "Name must be 5-30 letters and spaces only" }
                    : null,
                !values.email
                    ? { email: "Email is required" }
                    : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          values.email
                      )
                    ? { email: "Invalid email address" }
                    : null,
                !values.password
                    ? { password: "Password is required" }
                    : values.password.length < 8
                    ? { password: "Password must be at least 8 characters" }
                    : null,
                !values.confirmPassword
                    ? { confirmPassword: "Please confirm your password" }
                    : values.confirmPassword !== values.password
                    ? { confirmPassword: "Passwords do not match" }
                    : null,
                !values.role
                    ? { role: "Role is required" }
                    : !["student", "teacher"].includes(values.role)
                    ? { role: "Role must be 'student' or 'teacher'" }
                    : null
            ),
        onSubmit: (values, { resetForm }) => {
            const { confirmPassword, ...formData } = values;
            handleRegister(formData, resetForm);
        },
    });

    const handleTabChange = (e) => {
        formik.setFieldValue("role", e);
    };

    useEffect(() => {
        toast.info("Please wait a few seconds until the server starts", {
            style: {
                background: "#77a5f1ff",
                color: "white",
                border: "1px solid #93c5fd",
            },
            description:
                "This is happening because my server is deployed using render",
            action: {
                label: "Close",
            },
        });
    }, []);

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a
                    href="#"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    WeConnect
                </a>
                <Tabs
                    defaultValue="student"
                    className="w-[400px]"
                    onValueChange={handleTabChange}
                >
                    <TabsList className="self-center">
                        <TabsTrigger value="student">Student</TabsTrigger>
                        <TabsTrigger value="teacher">Teacher</TabsTrigger>
                    </TabsList>
                    <TabsContent value="student">
                        <div className={cn("flex flex-col gap-6", className)}>
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl">
                                        Create your account
                                    </CardTitle>
                                    <CardDescription>
                                        and Join our community of learners!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={formik.handleSubmit}>
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="name">
                                                    Full Name
                                                </FieldLabel>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={formik.values.name}
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                                {formik.touched.name &&
                                                    formik.errors.name && (
                                                        <FieldDescription>
                                                            {formik.errors.name}
                                                        </FieldDescription>
                                                    )}
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="email">
                                                    Email
                                                </FieldLabel>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formik.values.email}
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    placeholder="m@example.com"
                                                    required
                                                />
                                                {formik.touched.email &&
                                                    formik.errors.email && (
                                                        <FieldDescription>
                                                            {
                                                                formik.errors
                                                                    .email
                                                            }
                                                        </FieldDescription>
                                                    )}
                                            </Field>
                                            <Field>
                                                <Field className="grid grid-cols-2 gap-4">
                                                    <Field>
                                                        <FieldLabel htmlFor="password">
                                                            Password
                                                        </FieldLabel>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            value={
                                                                formik.values
                                                                    .password
                                                            }
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                            required
                                                        />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel htmlFor="confirmPassword">
                                                            Confirm Password
                                                        </FieldLabel>
                                                        <Input
                                                            id="confirmPassword"
                                                            type="password"
                                                            value={
                                                                formik.values
                                                                    .confirmPassword
                                                            }
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                            required
                                                        />
                                                    </Field>
                                                </Field>
                                                {formik.touched.password &&
                                                    formik.errors.password && (
                                                        <FieldDescription>
                                                            {
                                                                formik.errors
                                                                    .password
                                                            }
                                                        </FieldDescription>
                                                    )}{" "}
                                                {formik.touched
                                                    .confirmPassword &&
                                                    formik.errors
                                                        .confirmPassword && (
                                                        <FieldDescription>
                                                            {
                                                                formik.errors
                                                                    .confirmPassword
                                                            }
                                                        </FieldDescription>
                                                    )}
                                            </Field>
                                            <Field>
                                                <Button type="submit">
                                                    Create Account
                                                </Button>
                                                <FieldDescription className="text-center">
                                                    Already have an account?{" "}
                                                    <a href="/login">Sign in</a>
                                                </FieldDescription>
                                            </Field>
                                        </FieldGroup>
                                    </form>
                                </CardContent>
                            </Card>
                            <FieldDescription className="px-6 text-center">
                                By clicking continue, you agree to our{" "}
                                <a href="#">Terms of Service</a> and{" "}
                                <a href="#">Privacy Policy</a>.
                            </FieldDescription>
                        </div>
                    </TabsContent>
                    <TabsContent value="teacher">
                        <div className={cn("flex flex-col gap-6", className)}>
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl">
                                        Create your account
                                    </CardTitle>
                                    <CardDescription>
                                        Share your expertise with next
                                        generation!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={formik.handleSubmit}>
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="name">
                                                    Full Name
                                                </FieldLabel>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formik.values.name}
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    required
                                                />
                                                {formik.touched.name &&
                                                    formik.errors.name && (
                                                        <FieldDescription>
                                                            {formik.errors.name}
                                                        </FieldDescription>
                                                    )}
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="email">
                                                    Email
                                                </FieldLabel>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    value={formik.values.email}
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    required
                                                />
                                                {formik.touched.email &&
                                                    formik.errors.email && (
                                                        <FieldDescription>
                                                            {
                                                                formik.errors
                                                                    .email
                                                            }
                                                        </FieldDescription>
                                                    )}
                                            </Field>
                                            <Field>
                                                <Field className="grid grid-cols-2 gap-4">
                                                    <Field>
                                                        <FieldLabel htmlFor="password">
                                                            Password
                                                        </FieldLabel>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            value={
                                                                formik.values
                                                                    .password
                                                            }
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                            required
                                                        />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel htmlFor="confirmPassword">
                                                            Confirm Password
                                                        </FieldLabel>
                                                        <Input
                                                            id="confirmPassword"
                                                            type="password"
                                                            value={
                                                                formik.values
                                                                    .confirmPassword
                                                            }
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                            required
                                                        />
                                                    </Field>
                                                </Field>
                                                {formik.touched.password &&
                                                    formik.errors.password && (
                                                        <FieldDescription>
                                                            {
                                                                formik.errors
                                                                    .password
                                                            }
                                                        </FieldDescription>
                                                    )}
                                                {formik.touched
                                                    .confirmPassword &&
                                                    formik.errors
                                                        .confirmPassword && (
                                                        <FieldDescription>
                                                            {
                                                                formik.errors
                                                                    .confirmPassword
                                                            }
                                                        </FieldDescription>
                                                    )}
                                            </Field>
                                            <Field>
                                                <Button type="submit">
                                                    Create Account
                                                </Button>
                                                <FieldDescription className="text-center">
                                                    Already have an account?{" "}
                                                    <a href="#">Sign in</a>
                                                </FieldDescription>
                                            </Field>
                                        </FieldGroup>
                                    </form>
                                </CardContent>
                            </Card>
                            <FieldDescription className="px-6 text-center">
                                By clicking continue, you agree to our{" "}
                                <a href="#">Terms of Service</a> and{" "}
                                <a href="#">Privacy Policy</a>.
                            </FieldDescription>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
