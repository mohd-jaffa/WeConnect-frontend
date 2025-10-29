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

const teachersSlice = createSlice({
    name: "teachers",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeTeachers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHomeTeachers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload;
            })
            .addCase(fetchHomeTeachers.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.payload;
            });
    },
});

export default teachersSlice.reducer;
