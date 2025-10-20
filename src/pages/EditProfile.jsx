import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import UserContext from "@/context/UserContext";
import { useContext } from "react";

export default function EditProfile() {
    const { user } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            name: user.name,
            bio: user.bio,
        },
        // validate: (values) =>
        //     Object.assign(
        //         {},
        //         !values.email
        //             ? { email: "Email is required" }
        //             : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        //                   values.email
        //               )
        //             ? { email: "Invalid email address" }
        //             : null,
        //         !values.password
        //             ? { password: "Password is required" }
        //             : values.password.length < 8
        //             ? { password: "Password must be at least 8 characters" }
        //             : null
        //     ),
        onSubmit: (values, { resetForm }) => {
            // handleLogin(values, resetForm);
            alert("subbmitted");
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} id="edit-profile-form">
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="grid gap-3">
                    <Label htmlFor="sheet-name">Name</Label>
                    <Input id="name" defaultValue={user.name} />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="sheet-username">Bio</Label>
                    <Input id="bio" defaultValue={user.bio} />
                </div>
            </div>
        </form>
    );
}
