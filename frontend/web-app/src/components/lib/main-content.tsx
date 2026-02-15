import { Button } from "@/components/ui/button";
import { fetchInitialActivities, fetchMoreActivities } from "@/lib/store/activitySlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchUser } from "@/lib/store/userSlice";
import { act, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityCard from "./activity-card";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";
import FilterSheet from "./filter-sheet";
import React from "react";
import { ActivityFilters, filterActivities, initialFilter } from "./filters/utils";
import { DANGEROUSLY_runPendingImmediatesAfterCurrentTask } from "next/dist/server/node-environment-extensions/fast-set-immediate.external";


export default function MainContent() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch((fetchUser()))
        dispatch((fetchInitialActivities()))
    }, [dispatch])
    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)
    const {data: activities, loading: activitiesLoading, loadingMore: activitiesLoadingMore, error: activitiesError} = useSelector((state: RootState) => state.activities)
    const [filter, setFilter] = React.useState<ActivityFilters>(structuredClone(initialFilter))
    const units = user?.units ?? "mi"

    const handleFetch = () => {
        dispatch(fetchMoreActivities())
    }

    const displayActivities = useMemo(() => {
        if (!user || !activities) return []
        return filterActivities(activities.data, filter, units)
    }, [activities.data, filter, units])  
    

    if (userLoading || activitiesLoading){
        return <p>Loading...</p>
    } 
    
    if (!user || !activities){
        return null
    }

  
    return (
        <div>
            <div className="flex justify-between items-center w-xl"> 
                <h1 className="text-2xl font-bold mb-1">Activities</h1>
                <div className="flex gap-2">
                    <Input placeholder="Search..." value={filter.name}
                        onChange={(e) => {
                            const s = e.target.value
                            setFilter(filter => ({
                                ...filter,
                                name: s
                            }))
                        }}
                    />
                    <FilterSheet setFilter={setFilter} filter={filter}/>
                </div>
                
            </div>
            {displayActivities.map((activity) => {
                return <ActivityCard key={activity.activityID} activity={activity} units={user.units}/>
            })}
            <div className="flex justify-center items-center mb-4">
                {(activities.allFetched || user.allActivities) ? <p className="text-lg">All Activities Fetched!</p> : <Button className="my-4 " onClick={handleFetch}>Fetch More Activities {activitiesLoadingMore ? <Spinner/> : null}</Button>}
            </div>

        </div>
    );
}
