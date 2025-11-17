import { useSelector } from "react-redux";
import {
    Loader2,
    Users,
    ClipboardList,
    Briefcase,
    Landmark,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const StatCard = ({ title, value, description, icon }) => (
    <Card className="hover:border-foreground transition">
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

export default function AdminMain() {
    const { data, loading, errors } = useSelector((state) => state.admin);

    const userDistribution = [
        { name: "Students", value: data?.studentCount, fill: "#065e29ff" },
        { name: "Tutors", value: data?.TutorCount, fill: "#ebc475ff" },
    ];

    const sessionStats = [
        {
            category: "Completed",
            count: data?.completedBookings,
            fill: "#3B82F6",
        },
        { category: "Ongoing", count: data?.ongoingBookings, fill: "#22C55E" },
        {
            category: "Upcoming",
            count: data?.upcomingBookings,
            fill: "#F97316",
        },
        {
            category: "Cancelled",
            count: data?.cancelledBookings,
            fill: "#EF4444",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-gray-600" />
                <p className="ml-2 text-gray-600">Loading</p>
            </div>
        );
    }

    if (errors) {
        return (
            <div className="flex items-center justify-center h-screen text-red-600 font-medium">
                Error: {errors}
            </div>
        );
    }

    return (
        <div className="p-5 mb-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's your platform overview.
                </p>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Users"
                    value={data?.totalUsers}
                    description="Active users on platform"
                    icon={<Users />}
                />
                <StatCard
                    title="Total Sessions"
                    value={data?.totalSessions}
                    description="Total sessions created"
                    icon={<ClipboardList />}
                />
                <StatCard
                    title="Total Bookings"
                    value={data?.totalBookings}
                    description="Total Bookings created"
                    icon={<Briefcase />}
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${data?.totalRevenue}`}
                    description="Total Revenue generated"
                    icon={<Landmark />}
                />
            </div>
            <div className="flex gap-5">
                <div className="flex-1 min-w-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Statistics</CardTitle>
                            <CardDescription>
                                Current booking status breakdown
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={sessionStats}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(var(--border))"
                                    />
                                    <XAxis
                                        dataKey="category"
                                        stroke="hsl(var(--muted-foreground))"
                                    />
                                    <YAxis stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                        {sessionStats.map((color, i) => (
                                            <Cell key={i} fill={color.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex-1 min-w-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Distribution</CardTitle>
                            <CardDescription>
                                Students vs Teachers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={userDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) =>
                                            `${name}: ${value}`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {userDistribution.map((ele, i) => (
                                            <Cell
                                                key={`cell-${i}`}
                                                fill={ele.fill}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
