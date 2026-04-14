import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AppDispatch, store } from "./store/store"
import { fetchToken } from "./store/tokenSlice"
import { ActivityTag, createTag, createTagActivity, deleteTag, deleteTagActivity, Tag, updateTag } from "./store/tagSlice"

const URL = process.env.NEXT_PUBLIC_API_URL ?? ""

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDate(dateString: Date){
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const date = new Date(dateString)

  let day = months[date.getMonth()] + " " + date.getDate().toString()
  if (date.getFullYear() < 2026){
    day = day + ", " + date.getFullYear().toString()
  } else {
    day = days[date.getDay()] + ", " + day
  }

  let time = ""
  if (date.getHours() > 12){//1PM - 11PM, need to subtract
    time += (date.getHours() - 12).toString() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString()) + " PM"
  } else if (date.getHours() == 12){//12 AM
    time += "12:" + (date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString()) + " PM"
  } else if (date.getHours() == 0){//12 AM
    time += "12:" + (date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString()) + " AM"
  } else {//1AM - 11AM
    time += date.getHours().toString() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString()) + " AM"
  }

  return day + " - " + time
}

export function convertTime(time: number){
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time -  (hours * 3600)) / 60)
  const seconds = time  - (hours * 3600) - (minutes * 60)

  let  fmtHours, fmtMinutes, fmtSeconds

  if (hours > 0 ){
    fmtHours = hours.toString() + ":"
  } else {
    fmtHours = ""
  }

  if (minutes < 10){
    fmtMinutes = "0" + minutes.toString() + ":"
  } else {
    fmtMinutes = minutes.toString() + ":"
  }

  if (seconds < 10){
    fmtSeconds = "0" + seconds.toString()
  } else {
    fmtSeconds = seconds.toString()
  }

  return fmtHours + fmtMinutes + fmtSeconds
}

export function convertDistance(units: "mi" | "km", distance: number){
  if (units === "mi"){
      return (distance * 0.000621371)
  } else {
      return (distance * 0.001)
  }
}

export function convertElevation(units: "mi" | "km", elev: number){
  if (units === "mi"){
      return (elev * 3.28084).toFixed(0).toString() + " ft"
  } else {
      return elev.toFixed(0).toString() + " m"
  }
}

export function calcPace(distance: number, time: number, units: "mi" | "km"){
  const pace = convertTime(Math.floor(time / convertDistance(units, distance)))

  return pace + "/" + units
}

export function timeToSeconds(time: string) {
  const parts = time.split(":").map(Number)

  if (parts.length === 2) {
    const [m, s] = parts
    return m * 60 + s
  }

  const [h, m, s] = parts
  return h * 3600 + m * 60 + s
}


export async function Logout(){
    await fetch(URL + "/api/auth/logout", {//clears cookie
          method: "POST",
          credentials: "include",
    })
    window.location.reload()
}

export async function DeleteProfile(){
    const state = store.getState()
    const token = state.token.data

    await fetch(URL + "/api/user/delete", {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token.access_token}` : ""
      },
      credentials: "include",
    })
    window.location.reload()
}

export async function fetchGET(endpoint: string, token: string){

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
          Authorization: token ? `Bearer ${token}` : ""
      },
      credentials: "include"
    })

    if (res.status !== 401) return res //no auth error

    fetchToken()//get a new token
    const state = store.getState()
    const newToken = state.token.data
    
    //error with refresh_token
    if (!newToken) Logout() 

    return await fetch(endpoint, {
      method: "GET",
      headers: {
          Authorization: newToken ? `Bearer ${token}` : ""
      },
      credentials: "include"
    })
}

export async function fetchPOST(endpoint: string, body: object){
    const state = store.getState()
    const token = state.token.data

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
          Authorization: token ? `Bearer ${token.access_token}` : ""
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    if (res.status !== 401) return res //no errors

    fetchToken()//get a new token
    const newToken = state.token.data

    //error with refresh_token
    if (!newToken) Logout() 

    return await fetch(endpoint, {
      method: "POST",
      headers: {
          Authorization: newToken ? `Bearer ${newToken.access_token}` : ""
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
}

export async function fetchPATCH(endpoint: string, body: object){
    const state = store.getState()
    const token = state.token.data

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: {
          Authorization: token ? `Bearer ${token.access_token}` : ""
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    if (res.status !== 401) return res //no errors

    fetchToken()//get a new token
    const newToken = state.token.data

    //error with refresh_token
    if (!newToken) Logout() 

    return await fetch(endpoint, {
      method: "PATCH",
      headers: {
          Authorization: newToken ? `Bearer ${newToken.access_token}` : ""
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
}

export async function fetchDELETE(endpoint: string){
    const state = store.getState()
    const token = state.token.data

    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: {
          Authorization: token ? `Bearer ${token.access_token}` : ""
      },
      credentials: "include"
    })

    if (res.status !== 401) return res //no errors

    fetchToken()//get a new token
    const newToken = state.token.data

    //error with refresh_token
    if (!newToken) Logout() 

    return await fetch(endpoint, {
      method: "DELETE",
      headers: {
          Authorization: newToken ? `Bearer ${newToken.access_token}` : ""
      },
      credentials: "include"
    })
}

export async function createNewTag(user_id: string, tagname: string, parent_id: string | null, dispatch: AppDispatch){
    const body = {
      user_id: user_id,
      tagname: tagname,
      parent_id: parent_id
    }

    const res = await fetchPOST(URL + "/api/tag", body)
    
    if (res.status == 200){
        const tag = await res.json()

        const newTag: Tag = {
            id: tag.id,
            user_id: tag.user_id,
            tagname: tag.tagname,
            parent_id: tag.parent_id,
            activities: [],
            children: []
        }

        dispatch(createTag(newTag))
    } else {
        window.alert("Error Creating Tag!")
    }
}

export async function deleteTagWithID(id: string, dispatch: AppDispatch){
    const res = await fetchDELETE(URL + "/api/tag/" + id)

    if (res.status == 200){
        dispatch(deleteTag({id: id}))
    } else {
        window.alert("Error Deleting Tag!")
    }
}

export async function updateTagWithID(tag: Tag, tagname: string, parent_id: string | null, dispatch: AppDispatch){
    const body = {
      tagname: tagname,
      parent_id: parent_id
    }

    const res = await fetchPATCH(URL + "/api/tag/" + tag.id, body)

    if (res.status == 200){
        const t = await res.json()

        const newTag: Tag = {
            id: t.id,
            user_id: t.user_id,
            tagname: t.tagname,
            parent_id: t.parent_id,
            activities: tag.activities,
            children: tag.children
        }

        dispatch(updateTag(newTag))
    } else {
        window.alert("Error Updating Tag!")
    }
}

export async function createNewTagActivity(user_id: string, tag_id: string, activity_id: string, dispatch: AppDispatch){
    const body = {
      user_id: user_id,
      tag_id: tag_id,
      activity_id: activity_id
    }

    const res = await fetchPOST(URL + "/api/tag/activity", body)

    if (res.status == 200){
        const ta = await res.json()

        const newTagActivity: ActivityTag = {
          id: ta.id,
          tag_id: ta.tag_id,
          user_id: ta.user_id,
          activity_id: ta.activity_id
        }

        dispatch(createTagActivity(newTagActivity))
    } else {
        window.alert("Error Adding Tag to Activity!")
    }

}

export async function deleteTagActivityWithID(id: string, tag_id: string, dispatch: AppDispatch){
  const res = await fetchDELETE(URL + "/api/tag/activity/" + id)

    if (res.status == 200){
        dispatch(deleteTagActivity({id: id, tag_id: tag_id}))
    } else {
        window.alert("Error Deleting Tag!")
    }
}