import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "react-router-dom";

export default function AdminManageUpdates() {
    const location = useLocation();
    const [, currentPage] = location.pathname.split("/").filter(Boolean);

    return (
        <div>
            <form>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input
                            id="name-1"
                            name="name"
                            defaultValue="Pedro Duarte"
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="username-1">Username</Label>
                        <Input
                            id="username-1"
                            name="username"
                            defaultValue="@peduarte"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
