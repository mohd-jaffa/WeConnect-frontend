import { configureStore } from "@reduxjs/toolkit";
import teachersReducer from "../slices/teacherSlice";
import sessionsReducer from "../slices/sessionSlice";
import bookingsReducer from "../slices/bookingSlice";

const store = configureStore({
    reducer: {
        teacher: teachersReducer,
        session: sessionsReducer,
        booking: bookingsReducer,
    },
});

export default store;
