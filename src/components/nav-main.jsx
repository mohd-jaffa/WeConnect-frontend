import { ChevronRight, Users, LaptopMinimal, Calendar } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import axios from "@/config/axios";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export function NavMain() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Main menu</SidebarGroupLabel>
            <SidebarMenu>
                <Collapsible
                    asChild
                    className="group/collapsible"
                    defaultOpen={pathname.startsWith("/admin/users")}
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip="users">
                                <Users />
                                <span>Manage Users</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/users">All Users</Link>
                                    </SidebarMenuSubButton>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/users/instructors">
                                            Instructors
                                        </Link>
                                    </SidebarMenuSubButton>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/users/students">
                                            Students
                                        </Link>
                                    </SidebarMenuSubButton>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/users/requests">
                                            New Requests
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
                <Collapsible
                    asChild
                    className="group/collapsible"
                    defaultOpen={pathname.startsWith("/admin/bookings")}
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip="bookings">
                                <LaptopMinimal />
                                <span>Bookings</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/bookings">
                                            All Bookings
                                        </Link>
                                    </SidebarMenuSubButton>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/bookings/ongoing">
                                            Ongoing
                                        </Link>
                                    </SidebarMenuSubButton>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/bookings/upcoming">
                                            Upcoming
                                        </Link>
                                    </SidebarMenuSubButton>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/bookings/completed">
                                            Completed
                                        </Link>
                                    </SidebarMenuSubButton>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/bookings/cancelled">
                                            Cancelled
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
                <Collapsible
                    asChild
                    className="group/collapsible"
                    defaultOpen={pathname.startsWith("/admin/sessions")}
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip="sessions">
                                <Calendar />
                                <span>Sessions</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/sessions">
                                            All Sessions
                                        </Link>
                                    </SidebarMenuSubButton>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/sessions/recurring">
                                            Recurring
                                        </Link>
                                    </SidebarMenuSubButton>
                                    <SidebarMenuSubButton asChild>
                                        <Link to="/admin/sessions/non-recurring">
                                            Non - Recurring
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    );
}
