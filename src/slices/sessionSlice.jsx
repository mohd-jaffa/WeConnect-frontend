import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/config/axios";

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

export const fetchDashboardBookings = createAsyncThunk(
    "/sessions/fetchDashboardBookings",
    async (undefined, { rejectWithValue }) => {
        try {
            const response = await axios.get("/bookings", {
                headers: { Authorization: localStorage.getItem("token") },
            });
            const allBookings = response.data;
            const ongoing = allBookings.find(
                (booking) => booking.status === "ongoing"
            );
            const upcoming = allBookings
                .filter((booking) => booking.status === "upcoming")
                .slice(0, 3);
            return { ongoing, upcoming };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

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
