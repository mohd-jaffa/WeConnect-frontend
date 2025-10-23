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
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LogOut, User, House } from "lucide-react";
import { Link } from "react-router-dom";
import UserContext from "@/context/UserContext";
import { useContext, useState } from "react";

export default function Navbar() {
    const { isLoggedIn, handleLogout, user } = useContext(UserContext);
    const [showAlert, setShowAlert] = useState(false);

    if (
        isLoggedIn &&
        user &&
        (user.role === "admin" || user.role === "teacher")
    ) {
        return null;
    }
    return (
        <div>
            {isLoggedIn && user?.role === "student" ? (
                <>
                    <h1 className="m-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                        WeConnect!
                    </h1>
                    <div className="w-full flex justify-center py-4 border-b">
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList className="relative">
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link to="/home">Home</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link to="/dashboard">Dashboard</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link to="/sessions">Sessions</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="hidden md:block">
                                    <NavigationMenuTrigger>
                                        Account
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[200px] gap-4">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        to="/profile"
                                                        className="flex-row items-center gap-2 leading-none"
                                                    >
                                                        <User className="w-4 h-4" />
                                                        profile
                                                    </Link>
                                                </NavigationMenuLink>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        onClick={() =>
                                                            setShowAlert(true)
                                                        }
                                                        className="flex-row items-center gap-2 leading-none"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Logout
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="m-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                        WeConnect!
                    </h1>
                    <div className="w-full flex justify-center py-4 border-b">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link to="/login">Login</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link to="/register">Register</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </>
            )}
            <>
                {showAlert && (
                    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
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
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Link to="/login" onClick={handleLogout}>
                                        Continue
                                    </Link>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </>
        </div>
    );
}
