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
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Bookings from "./Bookings";
import EditProfile from "./EditProfile";
import Transactions from "./Transactions";

export default function Profile() {
    const location = useLocation();
    const { user, handleLogout } = useContext(UserContext);
    const [activeMenu, setActiveMenu] = useState("profile");

    useEffect(() => {
        if (location.state?.menu) {
            setActiveMenu(location.state.menu);
        }
    }, [location.state]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen mx-30 mr-30 px-10 py-8">
            <div className="w-1/4 pr-6">
                <div className="flex items-center gap-3 mb-8">
                    <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                            {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.role}</CardDescription>
                    </div>
                </div>
                <div className="grid gap-1">
                    <button
                        onClick={() => setActiveMenu("profile")}
                        className={`flex gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out
              ${
                  activeMenu === "profile"
                      ? "bg-gray-100 font-medium text-gray-900 border-l-4 border-gray-400"
                      : "hover:bg-gray-50 text-gray-600"
              }`}
                    >
                        <User size={16} strokeWidth={1.5} className="mt-1" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveMenu("bookings")}
                        className={`flex gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out
              ${
                  activeMenu === "bookings"
                      ? "bg-gray-100 font-medium text-gray-900 border-l-4 border-gray-400"
                      : "hover:bg-gray-50 text-gray-600"
              }`}
                    >
                        <NotebookPen
                            size={16}
                            strokeWidth={1.5}
                            className="mt-1"
                        />
                        Bookings
                    </button>
                    <button
                        onClick={() => setActiveMenu("transactions")}
                        className={`flex gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out
              ${
                  activeMenu === "transactions"
                      ? "bg-gray-100 font-medium text-gray-900 border-l-4 border-gray-400"
                      : "hover:bg-gray-50 text-gray-600"
              }`}
                    >
                        <CircleDollarSign
                            size={16}
                            strokeWidth={1.5}
                            className="mt-1"
                        />
                        Transactions
                    </button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                onClick={() => setActiveMenu("logout")}
                                className={`flex gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out
              ${
                  activeMenu === "logout"
                      ? "bg-gray-100 font-medium text-gray-900 border-l-4 border-gray-400"
                      : "hover:bg-gray-50 text-gray-600"
              }`}
                            >
                                <LogOut
                                    size={16}
                                    strokeWidth={1.5}
                                    className="mt-1"
                                />
                                Logout
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    You have to login again to access your
                                    account
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() => setActiveMenu("profile")}
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Link to="/" onClick={handleLogout}>
                                        Continue
                                    </Link>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Separator
                orientation="vertical"
                className="h-auto bg-gray-200 mx-4"
            />

            <div className="flex-1 pl-6">
                {activeMenu === "profile" && <EditProfile />}

                {activeMenu === "bookings" && <Bookings />}

                {activeMenu === "transactions" && <Transactions />}
            </div>
        </div>
    );
}
