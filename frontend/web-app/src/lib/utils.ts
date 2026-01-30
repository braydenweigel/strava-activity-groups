import { clsx, type ClassValue } from "clsx"
import { useSelector } from "react-redux"
import { twMerge } from "tailwind-merge"
import { RootState } from "./store/store"
import { fetchToken } from "./store/tokenSlice"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

async function Logout(){
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
