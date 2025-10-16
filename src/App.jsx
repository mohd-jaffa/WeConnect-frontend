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
import { Button } from "./components/ui/button";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import TeachersList from "./pages/TeachersList";

function App() {
    const { isLoggedIn, handleLogout } = useContext(UserContext);

    return (
        <>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                WeConnect!
            </h1>

            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                {isLoggedIn ? (
                    <>
                        <li>
                            <Link to="/home">Home</Link>
                        </li>
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/teachers">Teachers</Link>
                        </li>
                        <li>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <a href="#">Logout</a>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            You have to login again to access
                                            your account
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Link
                                                to="/login"
                                                onClick={handleLogout}
                                            >
                                                Continue
                                            </Link>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul>

            <Routes>
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/teachers"
                    element={
                        <PrivateRoute>
                            <TeachersList />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
