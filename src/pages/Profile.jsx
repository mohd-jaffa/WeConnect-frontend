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
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import { useContext, useState } from "react";
import Bookings from "./Bookings";
import EditProfile from "./EditProfile";

export default function Profile() {
    const { user } = useContext(UserContext);
    const [activeMenu, setActiveMenu] = useState("profile");

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
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
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
                    <button
                        onClick={() => setActiveMenu("logout")}
                        className={`flex gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out
              ${
                  activeMenu === "logout"
                      ? "bg-gray-100 font-medium text-gray-900 border-l-4 border-gray-400"
                      : "hover:bg-gray-50 text-gray-600"
              }`}
                    >
                        <LogOut size={16} strokeWidth={1.5} className="mt-1" />
                        Logout
                    </button>
                </div>
            </div>

            <Separator
                orientation="vertical"
                className="h-auto bg-gray-200 mx-4"
            />

            <div className="flex-1 pl-6">
                {activeMenu === "profile" && <EditProfile />}

                {activeMenu === "bookings" && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-semibold mb-4">
                            My Bookings
                        </h2>
                        <Bookings />
                    </div>
                )}

                {activeMenu === "transactions" && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-semibold mb-4">
                            Transactions
                        </h2>
                        <p className="text-gray-600">
                            Your transaction history appears here.
                        </p>
                    </div>
                )}

                {activeMenu === "logout" && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-semibold mb-4">Logout</h2>
                        <p className="text-gray-600">
                            You have been logged out successfully.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
