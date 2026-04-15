"use client"

import LoginCard from "@/components/lib/login-card";
import MainContent from "@/components/lib/main-content";
import { ModeToggle } from "@/components/lib/mode-toggle";
import ProfileDialog from "@/components/lib/profile-dialog";
import { Spinner } from "@/components/ui/spinner";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";

export default function Home() {
  const { data, loading } = useSelector((state: RootState) => state.token)
  const loggedIn = Boolean(data)

  return (
    <div>
      {loggedIn ? 
        <div className="flex justify-end m-2 gap-2">
          <ProfileDialog/>
          <ModeToggle/>
        </div>
        : 
        null 
      }
      <div className="flex min-h-screen justify-center font-sans">
        {loading ? <Spinner/> : (loggedIn ? <MainContent/> : <LoginCard/>)}
      </div>
    </div>

  );
}
