import { Button } from "@/components/ui/button";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import PrivateRoute from "@/components/PrivateRoute";
import InstructorBookings from "./InstructorBookings";
import InstructorSessions from "./InstructorSessions";
import InstructorAddSession from "./InstructorAddSession";
import InstructorProfile from "./InstructorProfile";
import ChangePassword from "../ChangePassword";
import InstructorMain from "./InstructorMain";
import AssignTaskPage from "../Assignment/AssignTaskPage";
import InstructorMyStudents from "./InstructorsMyStudents";
import InstructorsViewStudent from "./InstructorsViewStudent";

export default function InstructorDashboard() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    if (user == null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link
                                                to="/instructor"
                                                className="capitalize"
                                            >
                                                Dashboard
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {pathnames
                                        .slice(1)
                                        .map((segment, index) => {
                                            const isLast =
                                                index === pathnames.length - 2;
                                            const to =
                                                "/" +
                                                pathnames
                                                    .slice(0, index + 2)
                                                    .join("/");

                                            return (
                                                <React.Fragment key={to}>
                                                    <BreadcrumbSeparator className="relative top-[1px]" />
                                                    <BreadcrumbItem>
                                                        {isLast ? (
                                                            <BreadcrumbPage className="capitalize">
                                                                {decodeURIComponent(
                                                                    segment
                                                                )}
                                                            </BreadcrumbPage>
                                                        ) : (
                                                            <BreadcrumbLink
                                                                asChild
                                                            >
                                                                <Link
                                                                    to={to}
                                                                    className="capitalize"
                                                                >
                                                                    {decodeURIComponent(
                                                                        segment
                                                                    )}
                                                                </Link>
                                                            </BreadcrumbLink>
                                                        )}
                                                    </BreadcrumbItem>
                                                </React.Fragment>
                                            );
                                        })}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <InstructorMain />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/bookings"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <InstructorBookings />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/bookings/:filter"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <InstructorBookings />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/sessions"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <InstructorSessions />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/sessions/add"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <InstructorAddSession />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/sessions/:id"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <InstructorAddSession />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <InstructorProfile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/password"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <ChangePassword />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/assignment"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <AssignTaskPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/students"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <InstructorMyStudents />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/student/:id"
                            element={
                                <PrivateRoute allowedRoles={["teacher"]}>
                                    <InstructorsViewStudent />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
