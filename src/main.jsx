import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <Toaster />
            <App />
        </AuthProvider>
    </BrowserRouter>
);
