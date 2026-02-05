import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/lib/store/activitySlice";
import { calcPace, convertDate, convertDistance, convertElevation, convertTime } from "@/lib/utils";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

type ActivityCardProps = {
  activity: Activity
  units: "mi" | "km"
}

export default function ActivityCard({ activity, units }: ActivityCardProps){
    const [expanded, setExpanded] = useState(false)

    const handleClick = () => {
        if (expanded){
            setExpanded(false)
        } else {
            setExpanded(true)
        }
    }


    return (
        <Card className="w-xl mb-3">
            <CardContent className="">
                <div className="flex justify-between mb-0">
                    <div className="flex items-center">
                        <p className="mr-2 font-bold text-lg">{activity.name}</p>
                        <p className="text-muted-foreground font-medium">{activity.sport}</p>
                    </div>
                    <div className="flex items-center">
                        <Link target="_blank" href={`https://www.strava.com/activities/${activity.activityID}`} className="underline hover:text-[#fc5200] text-sm mr-2">View on Strava</Link>
                        <button className="-mt-6 -mr-2" onClick={handleClick}>{expanded ? <ChevronUp/> : <ChevronDown/>}</button>
                    </div>
                </div>
                <p className="text-muted-foreground mb-2">{convertDate(activity.date)}</p>
                <div className="flex justify-between mr-28">
                    <p className="text-2xl">{activity.distance ? convertDistance(units, activity.distance).toFixed(2) + " " + units : null}</p>
                    <p className="text-2xl">{activity.moving_time ? convertTime(activity.moving_time) : null}</p>
                    <p className="text-2xl">{activity.moving_time && activity.distance ? calcPace(activity.distance, activity.moving_time, units) : null}</p>
                </div>
                {expanded ? 
                    <div className="grid grid-cols-2 mr-0 mt-2">
                        <p className="text-sm">{activity.elapsed_time ? "Elapsed Time: " + convertTime(activity.elapsed_time) : null}</p>
                        <p className="text-sm">{activity.elapsed_time && activity.distance ? "Elapsed Pace: " + calcPace(activity.distance, activity.elapsed_time, units) : null}</p>
                        <p className="text-sm">{activity.elevation ? "Elevation Gain: " + convertElevation(units, activity.elevation) : null}</p>
                        <p className="text-sm">{activity.average_heartrate ? "Average HR: " + activity.average_heartrate.toFixed(0) + " bpm" : null}</p>
                    </div>
                    :
                    null
                }


            </CardContent>
        </Card>
    )
}