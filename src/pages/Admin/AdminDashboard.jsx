import { Button } from "@/components/ui/button";
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
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "@/components/PrivateRoute";
import AdminUsers from "./AdminUsers";

export default function AdminDashboard() {
    const { user } = useContext(UserContext);

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
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/admin">
                                            Dashbaord
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            Data Fetching
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <Routes>
                        <Route
                            path="/users"
                            element={
                                <PrivateRoute>
                                    <AdminUsers />
                                </PrivateRoute>
                            }
                        ></Route>
                        <Route
                            path="/users/:filter"
                            element={
                                <PrivateRoute>
                                    <AdminUsers />
                                </PrivateRoute>
                            }
                        ></Route>
                        {/* <Route path="" element={<PrivateRoute></PrivateRoute>} ></Route>
                        <Route path="" element={<PrivateRoute></PrivateRoute>} ></Route> */}
                    </Routes>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
