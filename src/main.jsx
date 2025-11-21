import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import store from "../src/utils/create-store";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Toaster richColors />
        <Provider store={store}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Provider>
    </BrowserRouter>
);
