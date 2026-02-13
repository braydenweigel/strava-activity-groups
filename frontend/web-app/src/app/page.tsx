"use client"

import LoginCard from "@/components/lib/login-card";
import MainContent from "@/components/lib/main-content";
import ProfileDialog from "@/components/lib/profile-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RootState } from "@/lib/store/store";
import { Logout } from "@/lib/utils";
import React from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { data } = useSelector((state: RootState) => state.token)
  const loggedIn = Boolean(data)

  return (
    <div>
      {loggedIn ? 
        <div className="flex justify-end m-2 gap-2">
          <ProfileDialog/>
        </div>
        : 
        null 
      }
      <div className="flex min-h-screen justify-center font-sans">
        {loggedIn ? <MainContent/> : <LoginCard/>}
      </div>
    </div>

  );
}
