import axios from "@/config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHomeBookings = createAsyncThunk(
    "/bookings/fetchHomeBookings",
    async (undefined, { rejectWithValue }) => {
        try {
            const response = await axios.get("/bookings", {
                headers: { Authorization: localStorage.getItem("token") },
            });
            const successfullBookings = response.data.filter(
                (ele) => ele.status === "completed"
            ).length;
            const upcomingBookings = response.data.filter(
                (ele) => ele.status === "upcoming"
            ).length;
            const ongoingBookings = response.data.filter(
                (ele) => ele.status === "ongoing"
            ).length;
            return {
                successfullBookings,
                upcomingBookings,
                ongoingBookings,
            };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchDashboardDetails = createAsyncThunk(
    "/bookings/fetchDashboardDetails",
    async (undefined, { rejectWithValue }) => {
        try {
            const response = await axios.get("/bookings", {
                headers: { Authorization: localStorage.getItem("token") },
            });
            const totalBookings = response.data.length;
            const completedBookings = response.data.filter(
                (ele) => ele.status == "completed"
            ).length;
            const totalEarnings = response.data.reduce(
                (acc, ele) =>
                    ele?.status === "completed"
                        ? acc + (ele?.details?.amount || 0)
                        : acc,
                0
            );
            const upcomingBookings = response.data.filter(
                (ele) => ele.status == "upcoming"
            ).length;
            return {
                totalBookings,
                completedBookings,
                totalEarnings,
                upcomingBookings,
            };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const bookingSlice = createSlice({
    name: "bookings",
    initialState: {
        homeBookingData: null,
        homeBookingLoading: false,
        homeBookingError: null,
        dashboardDetailsData: null,
        dashboardDetailsLoading: false,
        dashboardDetailsError: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeBookings.pending, (state) => {
                state.homeBookingLoading = true;
            })
            .addCase(fetchHomeBookings.fulfilled, (state, action) => {
                state.homeBookingLoading = false;
                state.homeBookingError = null;
                state.homeBookingData = action.payload;
            })
            .addCase(fetchHomeBookings.rejected, (state, action) => {
                state.homeBookingLoading = false;
                state.homeBookingError = action.payload;
                state.homeBookingData = [];
            })
            .addCase(fetchDashboardDetails.pending, (state) => {
                state.dashboardDetailsLoading = true;
            })
            .addCase(fetchDashboardDetails.fulfilled, (state, action) => {
                state.dashboardDetailsLoading = false;
                state.dashboardDetailsError = null;
                state.dashboardDetailsData = action.payload;
            })
            .addCase(fetchDashboardDetails.rejected, (state, action) => {
                state.dashboardDetailsLoading = false;
                state.dashboardDetailsError = action.payload;
                state.dashboardDetailsData = [];
            });
    },
});

export default bookingSlice.reducer;
