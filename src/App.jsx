import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import SessionsList from "./pages/SessionsList";
import SessionShow from "./pages/SessionShow";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import UserContext from "./context/UserContext";

function App() {
    const { user } = useContext(UserContext);
    return (
        <div className="px-4 md:px-6 lg:px-8">
            {user.role != "admin" ? (
                <>
                    <h1 className="m-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                        WeConnect!
                    </h1>

                    <Navbar />
                </>
            ) : <Routes><Route><PrivateRoute>
                            <Home />
                        </PrivateRoute></Route></Routes>}

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
                <Route path="/sessions" element={<SessionsList />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
