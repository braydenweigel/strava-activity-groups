"use client"

import LoginCard from "@/components/lib/login-card";
import MainContent from "@/components/lib/main-content";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";
import { Logout } from "@/lib/utils";
import React from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { data } = useSelector((state: RootState) => state.token)
  const loggedIn = Boolean(data)
  
  const handleLogout = () => {
    Logout()
  }

  return (
    <div>
      {loggedIn ? 
        <div className="flex justify-end m-2">
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>
        : 
        null 
      }
      <div className="flex min-h-screen items-center justify-center font-sans">
        {loggedIn ? <MainContent/> : <LoginCard/>}
      </div>
    </div>

  );
}
