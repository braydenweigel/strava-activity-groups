import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchGET } from "../utils"
import { RootState } from "./store"

export interface User {
    id: string
    athleteID: string
    firstname: string 
    lastname: string 
    username: string
    units: "mi" | "km"
    allActivities: boolean
}

interface UserState {
    data: User | null
    loading: boolean
    error: string | null
}

const initialState: UserState = {
    data: null,
    loading: false,
    error: null
}

export const fetchUser = createAsyncThunk<User | null, void, {state: RootState}>('user/fetchUser', async (_, { getState }) => {
    const state = getState()
    const token = state.token.data

    const res = await fetchGET("http://localhost:8080/api/user/athlete", token?.access_token ?? "")

    if (!res.ok){
        return null
    }

    const data = await res.json()
    return data as User
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = true
                state.error = action.error.message || 'Failed to fetch user!'
            })
    }
})

export default userSlice.reducer

