import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchInitialActivities } from "@/lib/store/activitySlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchUser } from "@/lib/store/userSlice";
import { convertDate, convertDistance, convertElevation, convertTime } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MainContent() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch((fetchUser()))
        dispatch((fetchInitialActivities()))
    }, [dispatch])
    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)
    const {data: activities, loading: activitiesLoading, error: activitiesError} = useSelector((state: RootState) => state.activities)
    

    if (userLoading || activitiesLoading){
        return <p>Loading...</p>
    } 
    
    if (!user || !activities){
        return null
    }

  
    return (
        <div>
            <h1 className="text-2xl font-bold mb-1">Profile</h1>
            <Card className="w-xl mb-3">
                <CardContent>
                    <p className="font-bold">{user?.firstname} {user?.lastname}</p>
                    <p className="text-accent-foreground">{user?.username}</p>
                    <Link href={`https://www.strava.com/athletes/${user?.athleteID}`} target="_blank" className="underline hover:text-[#fc5200]">View on Strava</Link>
                </CardContent>
            </Card>
            <h1 className="text-2xl font-bold mb-1">Activities</h1>
            {activities.data.map((activity) => {
                let distance
                if (user.units === "mi"){
                    distance = (activity.distance! * 0.000621371).toFixed(2).toString() + " mi"
                } else {
                    distance = (activity.distance! * 0.001).toFixed(2).toString() + " km"
                }
                return (
                <Card key={activity.activityID} className="w-xl mb-3">
                    <CardHeader>
                        <CardTitle>{activity.name}</CardTitle>
                        <CardDescription>{convertDate(activity.date)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{activity.sport}</p>
                        <p>{activity.distance ? convertDistance(user.units, activity.distance) : null}</p>
                        <p>{activity.moving_time ? "Moving Time: " + convertTime(activity.moving_time) : null}</p>
                        <p>{activity.elapsed_time ? "Elapsed Time: " + convertTime(activity.elapsed_time) : null}</p>
                        <p>{activity.elevation ? "Elevation Gain: " + convertElevation(user.units, activity.elevation) : null}</p>
                    </CardContent>
                </Card>
                )
            })}

        </div>
    );
}
