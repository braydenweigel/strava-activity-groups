import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchGET } from "../utils"
import { RootState } from "./store"

export interface Tag {
    id: string
    user_id: string
    tagname: string
    parent_id: string | null
    activities: ActivityTag[]
    children: Tag[]
}

export interface ActivityTag {
    id: string
    tag_id: string,
    user_id: string,
    activity_id: string
}

interface TagsState {
    data: Tag[]
    tree: Tag[]
    loading: boolean
    error: string | null
}

const initialState: TagsState = {
    data: [],
    tree: [],
    loading: false,
    error: null
}

export const fetchTags = createAsyncThunk<Tag[] | null, void, {state: RootState}>('tags/fetchTags', async (_, { getState }) => {
    const state = getState()
    const token = state.token.data

    const res = await fetchGET("http://localhost:8080/api/tag", token?.access_token ?? "")

    if (!res.ok){
        return null
    }

    const data = await res.json() as Tag[]
    return data
})

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        createTag: (state, action) => {
            if (!state.data) return 

            

            state.data.push(action.payload)
            state.tree = buildTagTree(state.data)
        },
        updateTag: (state, action) => {
            if (!state.data) return

            const index = state.data.findIndex(tag => tag.id === action.payload.id)
            if (!index) return

            state.data[index] = action.payload
            state.tree = buildTagTree(state.data)

        },
        deleteTag: (state, action) => {
            if (!state.data) return

            const index = state.data.findIndex(tag => tag.id === action.payload.id)
            if (!index) return

            state.data.splice(index, 1)
            state.tree = buildTagTree(state.data)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTags.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload ?? []
                state.tree = buildTagTree(state.data)
                console.log(state.tree)
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.loading = true
                state.error = action.error.message || 'Failed to fetch tags!'
            })
    }
})

export default tagsSlice.reducer
export const { createTag, updateTag, deleteTag } = tagsSlice.actions

function buildTagTree(tags: Tag[]){
    const parents = tags.filter(tag => !tag.parent_id)
    const data: Tag[] = parents
    for (const parent of data) build(parent, tags)
    return data
}

function build(parent: Tag, tags: Tag[]){
    const children = tags.filter(tag => tag.parent_id === parent.id)
    parent.children = children
    for (const child of parent.children) build(child, tags)
}