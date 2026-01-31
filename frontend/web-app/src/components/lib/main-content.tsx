import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchInitialActivities } from "@/lib/store/activitySlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchUser } from "@/lib/store/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function GetData(){
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch((fetchUser()))
    dispatch((fetchInitialActivities()))
  }, [dispatch])

  return null
}

export default function MainContent() {
    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)
    const {data: activities, loading: activitiesLoading, error: activitiesError} = useSelector((state: RootState) => state.activities)

    console.log(user)
    
    return (
        <div>
            <GetData/>
            <p>{user?.firstname} {user?.lastname}</p>
            <p>{user?.username}</p>
            {activities?.data.map((activity, index) => {
                let distance
                if (user?.units === "mi"){
                    distance = (activity.distance! * 0.000621371).toFixed(2).toString() + " mi"
                } else {
                    distance = (activity.distance! * 0.001).toFixed(2).toString() + " km"
                }
                return (
                <Card key={activity.activityID} className="w-xl my-3">
                    <CardHeader>
                        <CardTitle>{activity.name}</CardTitle>
                        <CardDescription>{activity.date_local.toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{activity.sport}</p>
                        <p>{distance}</p>
                        <p>Moving Time: {activity.moving_time}</p>
                        <p>Elapsed Time: {activity.elapsed_time}</p>
                        <p>Elevation Gain: {activity.elevation}</p>
                    </CardContent>
                </Card>
                )
            })}

        </div>
    );
}
