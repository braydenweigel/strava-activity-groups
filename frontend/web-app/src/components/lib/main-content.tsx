import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchInitialActivities, fetchMoreActivities } from "@/lib/store/activitySlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchUser } from "@/lib/store/userSlice";
import { convertDate, convertDistance, convertElevation, convertTime } from "@/lib/utils";
import Link from "next/link";
import { act, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityCard from "./activity-card";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";

export default function MainContent() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch((fetchUser()))
        dispatch((fetchInitialActivities()))
    }, [dispatch])
    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)
    const {data: activities, loading: activitiesLoading, error: activitiesError} = useSelector((state: RootState) => state.activities)

    const handleFetch = () => {
        dispatch(fetchMoreActivities())
    }
    

    if (userLoading || activitiesLoading){
        return <p>Loading...</p>
    } 
    
    if (!user || !activities){
        return null
    }

  
    return (
        <div>
            <div className="flex justify-between items-center"> 
                <h1 className="text-2xl font-bold mb-1">Activities</h1>
                <Button size="sm">Filter</Button>
            </div>
            {activities.data.map((activity) => {
                return <ActivityCard key={activity.activityID} activity={activity} units={user.units}/>
            })}
            <div className="flex justify-center items-center mb-4">
                {(activities.allFetched || user.allActivities) ? <p className="text-lg">All Activities Fetched!</p> : <Button className="my-4 " onClick={handleFetch}>Fetch More Activities {activitiesLoading ? <Spinner/> : null}</Button>}
            </div>

        </div>
    );
}
