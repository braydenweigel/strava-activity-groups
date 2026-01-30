import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchUser } from "./userSlice"

export interface Token {
    access_token: string
}

interface TokenState {
    data: Token | null
    loading: boolean
    error: string | null
}

const initialState: TokenState = {
    data: null,
    loading: false,
    error: null
}

export const fetchToken = createAsyncThunk('token/fetchToken', async () => {
    const res = await fetch("http://localhost:8080/api/auth/refresh", {
        method: "POST",
        credentials: "include"
    })

    if (!res.ok){
        return null
    }

    const data = await res.json()
    return data as Token
})

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchToken.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchToken.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchToken.rejected, (state, action) => {
                state.loading = true
                state.error = action.error.message || 'Failed to fetch token!'
            })
    }
})

export default tokenSlice.reducer