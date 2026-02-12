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

export function filterActivities(activities: Activity[], filters: ActivityFilters){
    return activities.filter(activity => {
        const activityDate = new Date(activity.date)
        //filter by date
        if (filters.date.after && activityDate <= filters.date.after) return false
        if (filters.date.before && activityDate >= filters.date.before) return false

        return true
    })

}