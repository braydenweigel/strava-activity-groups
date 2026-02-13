import { Activity } from "@/lib/store/activitySlice"

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

export function filterActivities(activities: Activity[], filters: ActivityFilters, units: "mi" | "km"){
    return activities.filter(activity => {

        //filter by date
        const activityDate = new Date(activity.date)
        if (filters.date.after && activityDate <= filters.date.after) return false
        if (filters.date.before && activityDate >= filters.date.before) return false


        //filter by distance
        if (activity.distance){
            if (filters.distance.greaterThan && filters.distance.greaterThan > (units == "mi" ? activity.distance * 0.000621371 : activity.distance * 0.001)) return false
            if (filters.distance.lessThan && filters.distance.lessThan < (units == "mi" ? activity.distance * 0.000621371 : activity.distance * 0.001)) return false
        }

        return true
    })

}