import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchGET } from "../utils"
import { RootState } from "./store"

export interface Activity {
    id: string
    activityID: string
    athleteID: string
    name: string
    distance: number | null
    moving_time: number | null
    elapsed_time: number | null
    elevation: number | null
    sport: string
    date: Date
    date_local: Date
    city: string | null
    state: string | null
    country: string | null
}

export interface NextCursor {
    cursor_date: string
    cursor_id: string
}

export interface ActivitiesResponse {
    data: Activity[]
    next_cursor: NextCursor
}

interface ActivitiesState {
    data: ActivitiesResponse | null
    loading: boolean
    error: string | null
}

const initialState: ActivitiesState = {
    data: null,
    loading: false,
    error: null
}

export const fetchInitialActivities = createAsyncThunk<ActivitiesResponse | null, void, {state: RootState}>('user/fetchInitialActivities', async (_, { getState }) => {
    const state = getState()
    const token = state.token.data

    const res = await fetchGET("http://localhost:8080/api/user/activities", token?.access_token ?? "")

    if (!res.ok){
        return null
    }

    const data = await res.json()
    return data as ActivitiesResponse
})

const activitiesSlice = createSlice({
    name: 'activities',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInitialActivities.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchInitialActivities.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchInitialActivities.rejected, (state, action) => {
                state.loading = true
                state.error = action.error.message || 'Failed to fetch activities!'
            })
    }
})

export default activitiesSlice.reducer