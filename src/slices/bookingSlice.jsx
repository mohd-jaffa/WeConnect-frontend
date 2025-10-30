import axios from "@/config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHomeBookings = createAsyncThunk(
    "/sessions/fetchHomeBookings",
    async (undefined, { rejectWithValue }) => {
        try {
            const response = await axios.get("/bookings", {
                headers: { Authorization: localStorage.getItem("token") },
            });
            const successfullBookings = response.data.filter(
                (ele) => ele.status === "success"
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

const bookingSlice = createSlice({
    name: "bookings",
    initialState: {
        homeBookingData: null,
        homeBookingLoading: false,
        homeBookingError: null,
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
            });
    },
});

export default bookingSlice.reducer;
