import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import UserContext from "@/context/UserContext";

export default function AdminProfile() {
    const { user } = useContext(UserContext);

    return (
        <div className="mx-auto w-xl p-6">
            <Card>
                <CardHeader className="flex flex-col items-center">
                    <Avatar>
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>
                            {user?.name.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle>{user?.name}</CardTitle>
                    <CardDescription>{user?.role}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center mx-auto gap-2">
                        <Mail size={20} strokeWidth={0.75} />
                        <span>{user?.email}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4"></CardFooter>
            </Card>
        </div>
    );
}
