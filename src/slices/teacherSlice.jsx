import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const fetchHomeTeachers = createAsyncThunk(
    "/teachers/fetchHomeTeachers",
    async (undefined, { rejectWithValue }) => {
        try {
            const response = await axios.get("/teachers");
            const homeTeacher = response.data
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            return homeTeacher;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchTeachers = createAsyncThunk(
    "/teachers/fetchTeachers",
    async (undefined, { rejectWithValue }) => {
        try {
            const response = await axios.get("/teachers");
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchSingleTeacher = createAsyncThunk(
    "/teachers/fetchSingleTeacher",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/teachers/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const teachersSlice = createSlice({
    name: "teachers",
    initialState: {
        homeTeachersData: [],
        homeTeachersLoading: false,
        homeTeachersError: null,
        allTeachersData: [],
        allTeachersLoading: false,
        allTeachersError: null,
        singleTeachersData: [],
        singleTeachersLoading: false,
        singleTeachersError: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeTeachers.pending, (state) => {
                state.homeTeachersLoading = true;
            })
            .addCase(fetchHomeTeachers.fulfilled, (state, action) => {
                state.homeTeachersLoading = false;
                state.homeTeachersError = null;
                state.homeTeachersData = action.payload;
            })
            .addCase(fetchHomeTeachers.rejected, (state, action) => {
                state.homeTeachersLoading = false;
                state.homeTeachersError = action.payload;
                state.homeTeachersData = [];
            })
            .addCase(fetchTeachers.pending, (state) => {
                state.allTeachersLoading = true;
            })
            .addCase(fetchTeachers.fulfilled, (state, action) => {
                state.allTeachersLoading = false;
                state.allTeachersError = null;
                state.allTeachersData = action.payload;
            })
            .addCase(fetchTeachers.rejected, (state, action) => {
                state.allTeachersLoading = false;
                state.allTeachersError = action.payload;
                state.allTeachersData = [];
            })
            .addCase(fetchSingleTeacher.pending, (state) => {
                state.singleTeachersLoading = true;
            })
            .addCase(fetchSingleTeacher.fulfilled, (state, action) => {
                state.singleTeachersLoading = false;
                state.singleTeachersError = null;
                state.singleTeachersData = action.payload;
            })
            .addCase(fetchSingleTeacher.rejected, (state, action) => {
                state.singleTeachersLoading = false;
                state.singleTeachersError = action.payload;
                state.singleTeachersData = [];
            });
    },
});

export default teachersSlice.reducer;
