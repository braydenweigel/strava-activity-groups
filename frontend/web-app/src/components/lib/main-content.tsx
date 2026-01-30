import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchUser } from "@/lib/store/userSlice";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function GetData(){
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch((fetchUser()))
  }, [dispatch])

  return null
}

export default function MainContent() {
    const {data: user, loading: playerLoading, error: playerError} = useSelector((state: RootState) => state.user)
    
    return (
        <div>
            <GetData/>
            <p>{user?.firstname} {user?.lastname}</p>
            <p>{user?.username}</p>

        </div>
    );
}
