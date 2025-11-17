import { configureStore } from "@reduxjs/toolkit";
import teachersReducer from "../slices/teacherSlice";
import sessionsReducer from "../slices/sessionSlice";
import bookingsReducer from "../slices/bookingSlice";
import adminsReducer from "../slices/adminSlice";

const store = configureStore({
    reducer: {
        teacher: teachersReducer,
        session: sessionsReducer,
        booking: bookingsReducer,
        admin: adminsReducer,
    },
});

export default store;
