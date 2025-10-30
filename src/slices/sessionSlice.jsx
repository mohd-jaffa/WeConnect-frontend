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

const sessionsSlice = createSlice({
    name: "sessions",
    initialState: {
        homeSessionsData: [],
        homeSessionsLoading: false,
        homeSessionsError: null,
        singleSessionsData: [],
        singleSessionsLoading: false,
        singleSessionsError: null,
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
            });
    },
});

export default sessionsSlice.reducer;
