import { configureStore } from "@reduxjs/toolkit";
import teachersReducer from "../slices/teacherSlice";

const store = configureStore({
    reducer: {
        teacher: teachersReducer,
    },
});

export default store;
