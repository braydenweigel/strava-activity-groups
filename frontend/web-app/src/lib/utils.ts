import { clsx, type ClassValue } from "clsx"
import { useSelector } from "react-redux"
import { twMerge } from "tailwind-merge"
import { RootState } from "./store/store"
import { fetchToken } from "./store/tokenSlice"

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
  const days = Math.floor(time / 86400)
  const hours = Math.floor((time - (days * 86400)) / 3600)
  const minutes = Math.floor((time - (days * 86400) - (hours * 3600)) / 60)
  const seconds = time - (days * 86400) - (hours * 3600) - (minutes * 60)

  let fmtDays, fmtHours, fmtMinutes, fmtSeconds
  if (days > 0){
    fmtDays = days.toString() + ":"
  } else {
    fmtDays = ""
  }

  if (hours > 0 && hours < 10){
    fmtHours = "0" + hours.toString() + ":"
  } else if (hours > 10){
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

  return fmtDays + fmtHours + fmtMinutes + fmtSeconds
}

export function convertDistance(units: "mi" | "km", distance: number){
  if (units === "mi"){
      return (distance * 0.000621371).toFixed(2).toString() + " mi"
  } else {
      return (distance * 0.001).toFixed(2).toString() + " km"
  }
}

export function convertElevation(units: "mi" | "km", elev: number){
  if (units === "mi"){
      return (elev * 3.28084).toFixed(0).toString() + " ft"
  } else {
      return elev.toFixed(0).toString() + " m"
  }
}

export async function Logout(){
    await fetch("http://localhost:8080/api/auth/logout", {//clears cookie
          method: "POST",
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

    if (res.status !== 401) return res //no errors

    fetchToken()//get a new token
    const { data: newToken } = useSelector((state: RootState) => state.token)

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

export async function fetchPOST(endpoint: string, body: JSON, headers: JSON,){
    const { data: token } = useSelector((state: RootState) => state.token)

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
          Authorization: token ? `Bearer ${token}` : ""
      },
      credentials: "include"
    })

    if (res.status !== 401) return res //no errors

    fetchToken()//get a new token
    const { data: newToken } = useSelector((state: RootState) => state.token)

    //error with refresh_token
    if (!newToken) Logout() 

    return await fetch(endpoint, {
      method: "POST",
      headers: {
          Authorization: newToken ? `Bearer ${token}` : ""
      },
      credentials: "include"
    })
}

export async function fetchPUT(endpoint: string, body: JSON, headers: JSON,){
    const { data: token } = useSelector((state: RootState) => state.token)

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
          Authorization: token ? `Bearer ${token}` : ""
      },
      credentials: "include"
    })

    if (res.status !== 401) return res //no errors

    fetchToken()//get a new token
    const { data: newToken } = useSelector((state: RootState) => state.token)

    //error with refresh_token
    if (!newToken) Logout() 

    return await fetch(endpoint, {
      method: "PUT",
      headers: {
          Authorization: newToken ? `Bearer ${token}` : ""
      },
      credentials: "include"
    })
}

export async function fetchDELETE(endpoint: string, headers: JSON,){
    const { data: token } = useSelector((state: RootState) => state.token)

    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: {
          Authorization: token ? `Bearer ${token}` : ""
      },
      credentials: "include"
    })

    if (res.status !== 401) return res //no errors

    fetchToken()//get a new token
    const { data: newToken } = useSelector((state: RootState) => state.token)

    //error with refresh_token
    if (!newToken) Logout() 

    return await fetch(endpoint, {
      method: "DELETE",
      headers: {
          Authorization: newToken ? `Bearer ${token}` : ""
      },
      credentials: "include"
    })
}
