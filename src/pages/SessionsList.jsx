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
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemMedia,
    ItemTitle,
    ItemGroup,
} from "@/components/ui/item";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import axios from "@/config/axios";
import UserContext from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

export default function SessionsList() {
    const navigate = useNavigate();
    const { handleLogout } = useContext(UserContext);

    const [sessionsList, setSessionsList] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get("/sessions", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setSessionsList(response.data);
            } catch (err) {
                toast.error("something went wrong, please login again");
                handleLogout();
                navigate("/login");
            }
        };
        fetchTeachers();
    }, []);

    if (sessionsList == null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Button variant="outline" disabled size="sm">
                    <Spinner /> Please wait
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-3">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                SessionsList component
            </h2>

            <div className="felx justify-center mt-3">
                {/* <Card className="flex flex-col justify-between h-full rounded-lg border transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                            <div className="flex flex-col flex-grow">
                                <CardHeader>
                                    <CardTitle>{ele.title}</CardTitle>
                                    <CardDescription>
                                        {ele.category}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow mt-2">
                                    <p>{ele.description}</p>
                                </CardContent>
                            </div>
                            <CardFooter>
                                <button onClick={() => alert("booked")}>
                                    book slot
                                </button>
                            </CardFooter>
                        </Card> */}

                <div className="flex w-full flex-col gap-6">
                    <ItemGroup className="grid grid-cols-3 gap-4">
                        {sessionsList.map((ele) => {
                            return (
                                <Link key={ele._id} to={`/session/${ele._id}`}>
                                    <Item
                                        key={ele._id}
                                        variant="outline"
                                        className="transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                                    >
                                        <ItemHeader>
                                            <LazyLoadImage
                                                src="https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop"
                                                alt={ele.title}
                                                width={128}
                                                height={128}
                                                className="aspect-rectangle w-full rounded-sm object-cover"
                                            />
                                        </ItemHeader>
                                        <ItemContent>
                                            <ItemTitle>{ele.title}</ItemTitle>
                                            <ItemDescription>
                                                {ele.description}
                                            </ItemDescription>
                                        </ItemContent>
                                        <ItemFooter>Item Footer</ItemFooter>
                                    </Item>
                                </Link>
                            );
                        })}
                    </ItemGroup>
                </div>
            </div>
        </div>
    );
}
