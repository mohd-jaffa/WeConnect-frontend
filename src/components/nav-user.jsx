import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
    Pen,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function NavUser() {
    const { isMobile } = useSidebar();
    const { user, handleLogout } = useContext(UserContext);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-lg">
                                    AD
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        AD
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                {user?.role == "teacher" && (
                                    <Link
                                        to="/instructor/profile"
                                        className="flex gap-2"
                                    >
                                        <BadgeCheck className="mt-[3px]" />
                                        Account
                                    </Link>
                                )}
                                {user?.role == "admin" && (
                                    <Link
                                        to="/admin/profile"
                                        className="flex gap-2"
                                    >
                                        <BadgeCheck className="mt-[3px]" />
                                        Account
                                    </Link>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                {user.role == "teacher" ? (
                                    <Link
                                        to="/instructor/password"
                                        className="flex gap-2"
                                    >
                                        <Pen className="mt-[3px]" />
                                        Reset Password
                                    </Link>
                                ) : (
                                    <Link
                                        to="/admin/password"
                                        className="flex gap-2"
                                    >
                                        <Pen className="mt-[3px]" />
                                        Reset Password
                                    </Link>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link onClick={handleLogout} to="/login">
                                <LogOut />
                                Logout
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
