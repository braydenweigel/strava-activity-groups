import { Button } from "@/components/ui/button";
import { fetchInitialActivities, fetchMoreActivities } from "@/lib/store/activitySlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchUser } from "@/lib/store/userSlice";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityCard from "./activity-card";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";
import FilterSheet from "./filter-sheet";
import React from "react";
import { ActivityFilters, filterActivities, initialFilter } from "./filters/utils";
import TagsDialog from "./tags-dialog";
import { fetchTags } from "@/lib/store/tagSlice";


export default function MainContent() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch((fetchUser()))
        dispatch((fetchInitialActivities()))
        dispatch((fetchTags()))
    }, [dispatch])
    const {data: user, loading: userLoading} = useSelector((state: RootState) => state.user)
    const {data: activities, loading: activitiesLoading, loadingMore: activitiesLoadingMore} = useSelector((state: RootState) => state.activities)
    const [filter, setFilter] = React.useState<ActivityFilters>(structuredClone(initialFilter))
    const units = user?.units ?? "mi"


    const displayActivities = useMemo(() => {
        if (!user || !activities) return []
        return filterActivities(activities.data, filter, units)
    }, [filter, units, activities, user])  
    

    if (userLoading || activitiesLoading){
        return <p>Loading...</p>
    } 
    
    if (!user || !activities){
        return null
    }

    const handleFetch = () => {
        dispatch(fetchMoreActivities())
    }

  
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-start md:justify-between md:items-center w-screen md:w-xl px-4 md:px-0"> 
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
                    <TagsDialog/>
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
