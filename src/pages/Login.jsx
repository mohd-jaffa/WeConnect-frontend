import { GalleryVerticalEnd } from "lucide-react";
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
import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import UserContext from "@/context/UserContext";
import { toast } from "sonner";

export default function Login({ className }) {
    const { handleLogin } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validate: (values) =>
            Object.assign(
                {},
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
                    : null
            ),
        onSubmit: (values, { resetForm }) => {
            handleLogin(values, resetForm);
        },
    });

    useEffect(() => {
        toast.info("Please wait a few seconds until the server starts", {
            description:
                "This is happening because my server is deployed using render",
            action: {
                label: "Close",
            },
            theme: "info",
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
                <div className={cn("flex flex-col gap-6", className)}>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">
                                Welcome back
                            </CardTitle>
                            <CardDescription>
                                Login with your Email and Password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={formik.handleSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="m@example.com"
                                            required
                                        />
                                        {formik.touched.email &&
                                            formik.errors.email && (
                                                <FieldDescription>
                                                    {formik.errors.email}
                                                </FieldDescription>
                                            )}
                                    </Field>
                                    <Field>
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password">
                                                Password
                                            </FieldLabel>
                                            <a
                                                href="#"
                                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formik.values.password}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            required
                                        />
                                        {formik.touched.password &&
                                            formik.errors.password && (
                                                <FieldDescription>
                                                    {formik.errors.password}
                                                </FieldDescription>
                                            )}
                                    </Field>
                                    <Field>
                                        <Button type="submit">Login</Button>
                                        <FieldDescription className="text-center">
                                            Don&apos;t have an account?{" "}
                                            <a href="/register">Sign up</a>
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
            </div>
        </div>
    );
}
