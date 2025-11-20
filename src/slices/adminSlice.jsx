import axios from "@/config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAdminDashboard = createAsyncThunk(
    "admins/fetchAdminDashboard",
    async (undefined, { rejectWithValue }) => {
        try {
            const [usersRes, bookingsRes, sessionsRes] = await Promise.all([
                axios.get("/admin/users", {
                    headers: { Authorization: localStorage.getItem("token") },
                }),
                axios.get("/admin/bookings", {
                    headers: { Authorization: localStorage.getItem("token") },
                }),
                axios.get("/admin/sessions", {
                    headers: { Authorization: localStorage.getItem("token") },
                }),
            ]);
            const completedBookings = bookingsRes.data.filter(
                (ele) => ele.status == "completed"
            ).length;
            const totalRevenue = bookingsRes.data.reduce(
                (acc, ele) =>
                    ele?.status === "completed"
                        ? acc + (ele?.details?.amount || 0)
                        : acc,
                0
            );
            const upcomingBookings = bookingsRes.data.filter(
                (ele) => ele.status == "upcoming"
            ).length;
            const ongoingBookings = bookingsRes.data.filter(
                (ele) => ele.status == "ongoing"
            ).length;
            const cancelledBookings = bookingsRes.data.filter(
                (ele) => ele.status == "cancelled"
            ).length;
            const studentCount = usersRes.data.filter(
                (ele) => ele.role == "student"
            ).length;
            const TutorCount = usersRes.data.filter(
                (ele) => ele.role == "teacher"
            ).length;
            return {
                totalUsers: usersRes.data.length,
                totalBookings: bookingsRes.data.length,
                totalSessions: sessionsRes.data.length,
                completedBookings,
                totalRevenue,
                upcomingBookings,
                ongoingBookings,
                cancelledBookings,
                studentCount,
                TutorCount,
            };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const adminSlice = createSlice({
    name: "admins",
    initialState: {
        data: null,
        errors: null,
        loading: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDashboard.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload;
            });
    },
});

export default adminSlice.reducer;
