import { SquareUserRound, ListChecks, Landmark } from "lucide-react";
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

export default function InstructorMain() {
    const dispatch = useDispatch();

    const {
        dashboardBookingData,
        dashboardBookingLoading,
        dashboardBookingError,
    } = useSelector((state) => state.session);

    // Fetch dashboard bookings on mount
    useEffect(() => {
        dispatch(fetchDashboardBookings());
    }, [dispatch]);

    // Card for top stats
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

    // Loader UI
    if (dashboardBookingLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
                <p className="ml-2 text-gray-600">Loading dashboard...</p>
            </div>
        );
    }

    // Error UI
    if (dashboardBookingError) {
        return (
            <div className="flex items-center justify-center h-screen text-red-600 font-medium">
                Error: {dashboardBookingError}
            </div>
        );
    }

    const ongoing = dashboardBookingData?.ongoing;
    const upcoming = dashboardBookingData?.upcoming || [];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, Tutor!
                    </h1>
                    <p className="text-muted-foreground">
                        Here’s your teaching dashboard and performance overview.
                    </p>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total Bookings"
                        value="156"
                        description="Active students learning from you"
                        icon={<SquareUserRound />}
                    />
                    <StatCard
                        title="Completed Sessions"
                        value="28"
                        description="Total sessions conducted"
                        icon={<ListChecks />}
                    />
                    <StatCard
                        title="Total Earnings"
                        value="$2,800"
                        description="Earnings this month"
                        icon={<Landmark />}
                    />
                </div>

                {/* Ongoing and Upcoming Sessions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Ongoing Session */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ongoing Session</CardTitle>
                            <CardDescription>
                                Currently active class
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ongoing ? (
                                <div className="p-4 border border-border rounded-lg bg-muted">
                                    <p className="font-semibold">
                                        {ongoing.studentId?.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {ongoing.details?.category ?? "N/A"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {ongoing.time?.start}
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
                        </CardContent>
                    </Card>

                    {/* Upcoming Sessions */}
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
                                                    {ele.studentId?.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {ele.details?.category ??
                                                        "N/A"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {ele.time?.start}
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
