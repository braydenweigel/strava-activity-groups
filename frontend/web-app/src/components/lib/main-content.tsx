import { Button } from "@/components/ui/button";
import { fetchInitialActivities, fetchMoreActivities } from "@/lib/store/activitySlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchUser } from "@/lib/store/userSlice";
import { act, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityCard from "./activity-card";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";
import FilterSheet from "./filter-sheet";
import React from "react";

export interface ActivityFilters {
    name: string | undefined
    sport: Set<string>
    date: {
        after: Date | undefined
        before: Date | undefined
    }
    time: {
        type: "moving" | "elapsed"
        lessThan: number | undefined
        greaterThan: number | undefined
    } 
    pace: {
        type: "moving" | "elapsed"
        lessThan: number | undefined
        greaterThan: number | undefined
    }
    distance: {
        lessThan: number | undefined
        greaterThan: number | undefined
    }
    elevation: {
        lessThan: number | undefined
        greaterThan: number | undefined
    }
    averageHR: {
        lessThan: number | undefined
        greaterThan: number | undefined
    }
    
}

export const initialFilter: ActivityFilters = {
    name: undefined,
    sport: new Set(),
    date: {after: undefined, before: undefined},
    time: {type: "moving", lessThan: undefined, greaterThan: undefined},
    pace: {type: "moving", lessThan: undefined, greaterThan: undefined},
    distance: {lessThan: undefined, greaterThan: undefined},
    elevation: {lessThan: undefined, greaterThan: undefined},
    averageHR: {lessThan: undefined, greaterThan: undefined}
}

export default function MainContent() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch((fetchUser()))
        dispatch((fetchInitialActivities()))
    }, [dispatch])
    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)
    const {data: activities, loading: activitiesLoading, error: activitiesError} = useSelector((state: RootState) => state.activities)
    const [filter, setFilter] = React.useState<ActivityFilters>(structuredClone(initialFilter))

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
                <div className="flex gap-2">
                    <Input placeholder="Search..."/>
                    <FilterSheet setFilter={setFilter} filter={filter}/>
                </div>
                
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
