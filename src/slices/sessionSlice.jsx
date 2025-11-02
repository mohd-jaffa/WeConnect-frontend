import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/config/axios";

// ============================
// 1️⃣ Fetch Home Sessions
// ============================
export const fetchHomeSessions = createAsyncThunk(
    "/sessions/fetchHomeSessions",
    async (undefined, { rejectWithValue }) => {
        try {
            const response = await axios.get("/sessions");
            const homeSessions = response.data
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            return homeSessions;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// ============================
// 2️⃣ Fetch Single Session
// ============================
export const fetchSingleSession = createAsyncThunk(
    "/sessions/fetchSingleSession",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/teachers/${id}/sessions/`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// ============================
// 3️⃣ Fetch Dashboard Bookings (Using status field)
// ============================
export const fetchDashboardBookings = createAsyncThunk(
    "/bookings/fetchDashboardBookings",
    async (undefined, { rejectWithValue }) => {
        try {
            const response = await axios.get("/bookings", {
                headers: { Authorization: localStorage.getItem("token") },
            });

            const allBookings = response.data;

            // ✅ Separate ongoing and upcoming by status
            const ongoing = allBookings.find(
                (booking) => booking.status === "ongoing"
            );

            const upcoming = allBookings
                .filter((booking) => booking.status === "upcoming")
                .slice(0, 3); // keep only nearest 3

            return { ongoing, upcoming };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// ============================
// Slice
// ============================
const sessionsSlice = createSlice({
    name: "sessions",
    initialState: {
        homeSessionsData: [],
        homeSessionsLoading: false,
        homeSessionsError: null,

        singleSessionsData: [],
        singleSessionsLoading: false,
        singleSessionsError: null,

        dashboardBookingData: { ongoing: null, upcoming: [] },
        dashboardBookingLoading: false,
        dashboardBookingError: null,
    },
    extraReducers: (builder) => {
        builder
            // ----- Home Sessions -----
            .addCase(fetchHomeSessions.pending, (state) => {
                state.homeSessionsLoading = true;
            })
            .addCase(fetchHomeSessions.fulfilled, (state, action) => {
                state.homeSessionsLoading = false;
                state.homeSessionsError = null;
                state.homeSessionsData = action.payload;
            })
            .addCase(fetchHomeSessions.rejected, (state, action) => {
                state.homeSessionsLoading = false;
                state.homeSessionsError = action.payload;
                state.homeSessionsData = [];
            })

            // ----- Single Session -----
            .addCase(fetchSingleSession.pending, (state) => {
                state.singleSessionsLoading = true;
            })
            .addCase(fetchSingleSession.fulfilled, (state, action) => {
                state.singleSessionsLoading = false;
                state.singleSessionsError = null;
                state.singleSessionsData = action.payload;
            })
            .addCase(fetchSingleSession.rejected, (state, action) => {
                state.singleSessionsLoading = false;
                state.singleSessionsError = action.payload;
                state.singleSessionsData = [];
            })

            // ----- Dashboard Bookings -----
            .addCase(fetchDashboardBookings.pending, (state) => {
                state.dashboardBookingLoading = true;
            })
            .addCase(fetchDashboardBookings.fulfilled, (state, action) => {
                state.dashboardBookingLoading = false;
                state.dashboardBookingError = null;
                state.dashboardBookingData = action.payload;
            })
            .addCase(fetchDashboardBookings.rejected, (state, action) => {
                state.dashboardBookingLoading = false;
                state.dashboardBookingError = action.payload;
                state.dashboardBookingData = { ongoing: null, upcoming: [] };
            });
    },
});

export default sessionsSlice.reducer;
