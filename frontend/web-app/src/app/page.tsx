"use client"

import LoginCard from "@/components/lib/login-card";
import { RootState } from "@/lib/store/store";
import React from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { data } = useSelector((state: RootState) => state.token)
  const loggedIn = Boolean(data)
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {loggedIn ? <div/> : <LoginCard/>}
    </div>
  );
}
