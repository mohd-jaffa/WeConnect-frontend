import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UserContext from "@/context/UserContext";
import { useFormik } from "formik";
import { useContext } from "react";

export default function ChangePassword() {
    const { user, handlePasswordChange } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validate: (values) => {
            const errors = {};
            if (!values.oldPassword) {
                errors.oldPassword = "Old password is required";
            } else if (values.oldPassword.length < 8) {
                errors.oldPassword = "Password must be at least 8 characters";
            }

            if (!values.newPassword) {
                errors.newPassword = "New password is required";
            } else if (values.newPassword.length < 8) {
                errors.newPassword = "Password must be at least 8 characters";
            }

            if (!values.confirmNewPassword) {
                errors.confirmNewPassword = "Please confirm your password";
            } else if (values.confirmNewPassword !== values.newPassword) {
                errors.confirmNewPassword = "Passwords do not match";
            }

            return errors;
        },
        onSubmit: (values, { resetForm }) => {
            handlePasswordChange(values, resetForm);
        },
    });

    return (
        <div className="p-6">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 capitalize mb-5">
                Change Your Password
            </h2>

            <div className="w-full max-w-md">
                <form onSubmit={formik.handleSubmit}>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="oldPassword">
                                    Old Password
                                </FieldLabel>
                                <Input
                                    id="oldPassword"
                                    name="oldPassword"
                                    type="password"
                                    value={formik.values.oldPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="enter old password"
                                />
                                <FieldDescription>
                                    {formik.touched.oldPassword &&
                                        formik.errors.oldPassword && (
                                            <p className="text-red-500 text-sm">
                                                {formik.errors.oldPassword}
                                            </p>
                                        )}
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="newPassword">
                                    New Password
                                </FieldLabel>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="enter new password"
                                />
                                <FieldDescription>
                                    {formik.touched.newPassword &&
                                        formik.errors.newPassword && (
                                            <p className="text-red-500 text-sm">
                                                {formik.errors.newPassword}
                                            </p>
                                        )}
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirmNewPassword">
                                    Confirm New Password
                                </FieldLabel>
                                <Input
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    type="password"
                                    value={formik.values.confirmNewPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="confirm new password"
                                />
                                <FieldDescription>
                                    {formik.touched.confirmNewPassword &&
                                        formik.errors.confirmNewPassword && (
                                            <p className="text-red-500 text-sm">
                                                {
                                                    formik.errors
                                                        .confirmNewPassword
                                                }
                                            </p>
                                        )}
                                </FieldDescription>
                            </Field>
                            <Button type="submit" className="w-[80px]">
                                Submit
                            </Button>
                        </FieldGroup>
                    </FieldSet>
                </form>
            </div>
        </div>
    );
}
