import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import SessionsList from "./pages/SessionsList";
import SessionShow from "./pages/SessionShow";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import InstructorDashboard from "./pages/Instructor/InstructorDashboard";
import TestPage from "./pages/TestPage";
import { motion } from "framer-motion";
import Footer from "./components/Footer";
import Teachers from "./pages/Teachers";
import TeachersShow from "./pages/TeachersShow";
import SearchPage from "./pages/SearchPage";
import StudentListAssignments from "./pages/Assignment/StudentListAssignments";
import StudentViewAssignments from "./pages/Assignment/StudentViewAssignments";

function App() {
    const { user, isLoggedIn } = useContext(UserContext);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3 }}
        >
            <div className="px-4 md:px-6 lg:px-8">
                <Navbar />
                <Routes>
                    <Route
                        path="/admin/*"
                        element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/instructor/*"
                        element={
                            <PrivateRoute>
                                <InstructorDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/home"
                        element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/teachers"
                        element={
                            <PrivateRoute>
                                <Teachers />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/teacher/:id"
                        element={
                            <PrivateRoute>
                                <TeachersShow />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/session/:id"
                        element={
                            <PrivateRoute>
                                <SessionShow />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <PrivateRoute>
                                <SearchPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/assignments"
                        element={
                            <PrivateRoute>
                                <StudentListAssignments />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/assignments/:id"
                        element={
                            <PrivateRoute>
                                <StudentViewAssignments />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/sessions" element={<SessionsList />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/test" element={<TestPage />} />
                </Routes>
                <Footer />
            </div>
        </motion.div>
    );
}

export default App;
