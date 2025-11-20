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
import AdminUsers from "./AdminUsers";
import AdminBookings from "./AdminBookings";
import AdminSessions from "./AdminSessions";
import AdminProfile from "./AdminProfile";
import ChangePassword from "../ChangePassword";
import AdminMain from "./AdminMain";

export default function AdminDashboard() {
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
                                                to="/admin"
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
                            path="/users"
                            element={
                                <PrivateRoute allowedRoles={["admin"]}>
                                    <AdminUsers />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/users/:filter"
                            element={
                                <PrivateRoute allowedRoles={["admin"]}>
                                    <AdminUsers />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/bookings"
                            element={
                                <PrivateRoute allowedRoles={["admin"]}>
                                    <AdminBookings />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/bookings/:filter"
                            element={
                                <PrivateRoute allowedRoles={["admin"]}>
                                    <AdminBookings />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/sessions"
                            element={
                                <PrivateRoute allowedRoles={["admin"]}>
                                    <AdminSessions />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/sessions/:filter"
                            element={
                                <PrivateRoute allowedRoles={["admin"]}>
                                    <AdminSessions />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute allowedRoles={["admin"]}>
                                    <AdminProfile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/password"
                            element={
                                <PrivateRoute allowedRoles={["admin"]}>
                                    <ChangePassword />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute allowedRoles={["admin"]}>
                                    <AdminMain />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
