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
    average_heartrate: number | null
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
    next_cursor: NextCursor | null
    allFetched: boolean
}

interface ActivitiesState {
    data: ActivitiesResponse
    loading: boolean
    loadingMore: boolean
    error: string | null
}

const initialState: ActivitiesState = {
    data: {data: [], next_cursor: null, allFetched: false},
    loading: false,
    loadingMore: false,
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

export const fetchMoreActivities = createAsyncThunk<ActivitiesResponse | null, void, {state: RootState}>('user/fetchMoreActivities', async (_, { getState }) => {
    const state = getState()
    const token = state.token.data
    const cursorDate = state.activities.data?.next_cursor ? state.activities.data.next_cursor.cursor_date : ""
    const cursorID = state.activities.data?.next_cursor ? state.activities.data.next_cursor.cursor_id : ""

    const res = await fetchGET(`http://localhost:8080/api/user/activities?cursor_date=${cursorDate}&cursor_id=${cursorID}`, token?.access_token ?? "")

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
                state.data = action.payload ?? {data: [], next_cursor: null, allFetched: false}
            })
            .addCase(fetchInitialActivities.rejected, (state, action) => {
                state.loading = true
                state.error = action.error.message || 'Failed to fetch activities!'
            })
            .addCase(fetchMoreActivities.pending, (state) => {
                state.loadingMore = true
                state.error = null
            })
            .addCase(fetchMoreActivities.fulfilled, (state, action) => {
                state.loadingMore = false
                state.data.next_cursor = action.payload ? action.payload.next_cursor : null
                if (action.payload && action.payload.data.length > 0){ 
                    state.data.data.push(...action.payload.data)
                } else {
                    state.data.allFetched = true
                }
            })
            .addCase(fetchMoreActivities.rejected, (state, action) => {
                state.loadingMore = true
                state.error = action.error.message || 'Failed to fetch more activities!'
            })
    }
})

export default activitiesSlice.reducer