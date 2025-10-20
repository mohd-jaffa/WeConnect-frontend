import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Phone, UserPen } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import { useContext } from "react";
import Bookings from "./Bookings";
import EditProfile from "./EditProfile";

export default function Profile() {
    const { user } = useContext(UserContext);

    if (user == null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-3 mb-20">
            <div className="flex justify-between">
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Profile
                </h2>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button>
                            <UserPen size={20} strokeWidth={1.5} />
                            Edit Profile
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save
                                when you&apos;re done.
                            </SheetDescription>
                        </SheetHeader>
                        <EditProfile />
                        <SheetFooter>
                            <Button type="submit" form="edit-profile-form">
                                Save changes
                            </Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="grid grid-cols-6 grid-rows-3 gap-4 h-[480px] w-full">
                <Card className="col-span-2 row-span-2">
                    <CardHeader className="flex items-center space-x-2 mb-2">
                        <div>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.role}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="bg-muted relative px-[0.3rem] py-[0.2rem] font-mono text-sm font-light mb-5">
                            &quot;After all,&quot; he said, &quot;everyone
                            enjoys a good joke, so it&apos;s only fair that they
                            should pay for the privilege.&quot;
                        </p>
                        <div className="flex items-center space-x-2 mb-2 text-gray-500 text-[14px]">
                            <Mail
                                size={18}
                                className="mr-3 mt-0.5"
                                color="grey"
                                strokeWidth={1.5}
                            />
                            {user.email}
                        </div>
                        <div className="flex items-center space-x-2 mb-2 text-gray-500 text-[14px]">
                            <Phone
                                size={16}
                                className="mr-3 mt-0.5"
                                color="grey"
                                strokeWidth={1.5}
                            />
                            {user.phone}
                        </div>
                        <div className="flex items-center space-x-2 mb-2 text-gray-500 text-[14px]">
                            <MapPin
                                size={18}
                                className="mr-3 mt-0.5"
                                color="grey"
                                strokeWidth={1.5}
                            />
                            {user.location}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-4 row-span-3 col-start-3">
                    <CardHeader>
                        <CardTitle>
                            <div>
                                <Tabs defaultValue="bookings">
                                    <TabsList className="w-full h-full">
                                        <TabsTrigger value="bookings">
                                            Bookings
                                        </TabsTrigger>
                                        <TabsTrigger value="transactions">
                                            Transactions
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="bookings">
                                        <Bookings />
                                    </TabsContent>
                                    <TabsContent value="transactions">
                                        my transactions here.
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
                <Card className="col-span-2 row-start-3">
                    <CardHeader>
                        <CardTitle>
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-[-20px]">
                                Skills
                            </h4>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Badge</Badge>
                            <Badge variant="outline">Badge</Badge>
                            <Badge variant="outline">Badge</Badge>
                            <Badge variant="outline">Badge</Badge>
                            <Badge variant="outline">Badge</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
