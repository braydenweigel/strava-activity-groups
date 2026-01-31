import { configureStore } from "@reduxjs/toolkit"
import tokenReducer from './tokenSlice'
import userReducer from './userSlice'
import activitiesReducer from './activitySlice'

export const store = configureStore({
    reducer: {
        token: tokenReducer,
        user: userReducer,
        activities: activitiesReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch