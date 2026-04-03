import { configureStore } from "@reduxjs/toolkit"
import tokenReducer from './tokenSlice'
import userReducer from './userSlice'
import activitiesReducer from './activitySlice'
import tagsReducer from './tagSlice'

export const store = configureStore({
    reducer: {
        token: tokenReducer,
        user: userReducer,
        activities: activitiesReducer,
        tags: tagsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch