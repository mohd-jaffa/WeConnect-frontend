import {
    SquareUserRound,
    ListChecks,
    Landmark,
    ClipboardClock,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDashboardBookings } from "@/slices/sessionSlice";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchDashboardDetails } from "@/slices/bookingSlice";

export default function InstructorMain() {
    const dispatch = useDispatch();

    const {
        dashboardBookingData,
        dashboardBookingLoading,
        dashboardBookingError,
    } = useSelector((state) => state.session);

    const {
        dashboardDetailsData,
        dashboardDetailsLoading,
        dashboardDetailsError,
    } = useSelector((state) => state.booking);

    useEffect(() => {
        dispatch(fetchDashboardBookings());
        dispatch(fetchDashboardDetails());
    }, [dispatch]);

    const StatCard = ({ title, value, description, icon }) => (
        <Card className="hover:bg-gray-50 transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );

    if (dashboardBookingLoading || dashboardDetailsLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
                <p className="ml-2 text-gray-600">Loading dashboard...</p>
            </div>
        );
    }

    if (dashboardBookingError || dashboardDetailsError) {
        return (
            <div className="flex items-center justify-center h-screen text-red-600 font-medium">
                Error: {dashboardBookingError || dashboardDetailsError}
            </div>
        );
    }

    const ongoing = dashboardBookingData?.ongoing;
    const upcoming = dashboardBookingData?.upcoming || [];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, Tutor!
                    </h1>
                    <p className="text-muted-foreground">
                        Here’s your teaching dashboard and performance overview.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total Bookings"
                        value={dashboardDetailsData?.totalBookings}
                        description="The Number of Total Booking You Got"
                        icon={<SquareUserRound />}
                    />
                    <StatCard
                        title="Completed Sessions"
                        value={dashboardDetailsData?.completedBookings}
                        description="Total sessions conducted"
                        icon={<ListChecks />}
                    />
                    <StatCard
                        title="Upcoming Sesssions"
                        value={dashboardDetailsData?.upcomingBookings}
                        description="The Number of Upcoming Sessions"
                        icon={<ClipboardClock />}
                    />
                    <StatCard
                        title="Total Earnings"
                        value={`₹ ${dashboardDetailsData?.totalEarnings}`}
                        description="The Total Amount You Earned"
                        icon={<Landmark />}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ongoing Session</CardTitle>
                            <CardDescription>
                                Currently active class
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea>
                                {ongoing ? (
                                    <div className="p-4 border border-border rounded-lg bg-muted">
                                        <p className="font-semibold">
                                            {ongoing.studentsId?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {ongoing.details?.category ?? "N/A"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {ongoing.time?.start.slice(0, 10)} :{" "}
                                            {ongoing.time?.start.slice(11, 16)}
                                        </p>
                                        <a
                                            href={ongoing.meetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 px-3 py-1 text-sm border rounded bg-foreground text-background hover:opacity-80"
                                        >
                                            Join Meet
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No ongoing sessions right now
                                    </p>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Sessions</CardTitle>
                            <CardDescription>
                                Your next scheduled classes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcoming.length > 0 ? (
                                    upcoming.map((ele) => (
                                        <div
                                            key={ele._id}
                                            className="flex items-start justify-between p-4 border border-border rounded-lg hover:border-foreground transition"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-semibold">
                                                    {ele.studentsId?.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {ele.details?.category ??
                                                        "N/A"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {ele.time?.start.slice(
                                                        0,
                                                        10
                                                    )}{" "}
                                                    :{" "}
                                                    {ele.time?.start.slice(
                                                        11,
                                                        16
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <a
                                                    href={ele.meetLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs bg-card px-2 py-1 rounded border border-border hover:bg-muted"
                                                >
                                                    Join Meet
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No upcoming sessions
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
