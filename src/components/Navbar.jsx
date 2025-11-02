import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
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
import {
    LogOut,
    User,
    BookOpen,
    SquareChartGantt,
    Wallet,
    Home,
} from "lucide-react";
import { Button } from "./ui/button";
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
        <div className="border-b border-border bg-background">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative z-50">
                {/* Logo */}
                <Link to="/">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                            <BookOpen color="#ffffff" size={18} />
                        </div>
                        <span className="text-xl font-bold">WeConnect</span>
                    </div>
                </Link>

                {/* Logged-in Navbar for Students */}
                {isLoggedIn && user?.role === "student" ? (
                    <div className="flex-1 flex justify-center">
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList className="flex items-center gap-4">
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
                                        <Link to="/teachers">Instructors</Link>
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

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link to="/assignments">
                                            Assignments
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link to="/search">Search</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {/* Account Dropdown */}
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
                                                        className="flex flex-row items-center gap-2 whitespace-nowrap hover:text-foreground transition"
                                                    >
                                                        <User className="w-4 h-4" />
                                                        Profile
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        to="/profile"
                                                        state={{
                                                            menu: "bookings",
                                                        }}
                                                        className="flex flex-row items-center gap-2 whitespace-nowrap hover:text-foreground transition"
                                                    >
                                                        <SquareChartGantt className="w-4 h-4" />
                                                        My Bookings
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        to="/profile"
                                                        state={{
                                                            menu: "transactions",
                                                        }}
                                                        className="flex flex-row items-center gap-2 whitespace-nowrap hover:text-foreground transition"
                                                    >
                                                        <Wallet className="w-4 h-4" />
                                                        My Transactions
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <button
                                                        onClick={() =>
                                                            setShowAlert(true)
                                                        }
                                                        className="flex flex-row items-center gap-2 whitespace-nowrap w-full text-left hover:text-foreground transition justify-start"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Logout
                                                    </button>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                ) : (
                    // Logged-out Navbar
                    <div className="flex items-center gap-3">
                        <NavigationMenu>
                            <NavigationMenuList className="flex items-center gap-3">
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="hover:bg-transparent focus:bg-transparent"
                                    >
                                        <Link to="/login">
                                            <Button variant="ghost" size="sm">
                                                Sign In
                                            </Button>
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="hover:bg-transparent focus:bg-transparent"
                                    >
                                        <Link to="/register">
                                            <Button size="sm">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                )}

                {/* Logout Confirmation Alert */}
                {showAlert && (
                    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    You will need to log in again to access your
                                    account.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Link to="/" onClick={handleLogout}>
                                        Continue
                                    </Link>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </nav>
        </div>
    );
}
