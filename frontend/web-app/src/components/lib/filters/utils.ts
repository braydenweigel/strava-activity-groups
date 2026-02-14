import { Activity } from "@/lib/store/activitySlice"

export interface ActivityFilters {
    name: string
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
    name: "",
    sport: new Set<string>(),
    date: {after: undefined, before: undefined},
    time: {type: "moving", lessThan: undefined, greaterThan: undefined},
    pace: {type: "moving", lessThan: undefined, greaterThan: undefined},
    distance: {lessThan: undefined, greaterThan: undefined},
    elevation: {lessThan: undefined, greaterThan: undefined},
    averageHR: {lessThan: undefined, greaterThan: undefined}
}

export const Sports: string[] = [
    "AlpineSki", "BackcountrySki", "Badminton", "Canoeing", "Crossfit", "EBikeRide", "Elliptical", "EMountainBikeRide", "Golf", "GravelRide", 
    "Handcycle", "HighIntensityIntervalTraining", "Hike", "IceSkate", "InlineSkate", "Kayaking", "Kitesurf", "MountainBikeRide", "NordicSki", 
    "Pickleball", "Pilates", "Racquetball", "Ride", "RockClimbing", "RollerSki", "Rowing", "Run", "Sail", "Skateboard", "Snowboard", "Snowshoe", 
    "Soccer", "Squash", "StairStepper", "StandUpPaddling", "Surfing", "Swim", "TableTennis", "Tennis", "TrailRun", "Velomobile", "VirtualRide", 
    "VirtualRow", "VirtualRun", "Walk", "WeightTraining", "Wheelchair", "Windsurf", "Workout", "Yoga"
]

export function filterActivities(activities: Activity[], filters: ActivityFilters, units: "mi" | "km"){
    return activities.filter(activity => {
        //filter by activity name
        if (filters.name && filters.name.length > 0){//only filter if there is something in input
            const filterString = filters.name.trim().toLowerCase()
            const activityName = activity.name.toLowerCase()
            if (!activityName.includes(filterString)) return false
        }


        //filter by sport
        if (filters.sport.size > 0){//only filter if at least one box is checked
            if (!filters.sport.has(activity.sport)) return false
        }

        //filter by date
        const activityDate = new Date(activity.date)
        if (filters.date.after && activityDate <= filters.date.after) return false
        if (filters.date.before && activityDate >= filters.date.before) return false


        //filter by distance
        if ((filters.distance.greaterThan || filters.distance.lessThan) && !activity.distance) return false //if user uses a distance filter, any activities without a distance attribute should be filtered out
        if (activity.distance){
            if (filters.distance.greaterThan && filters.distance.greaterThan > (units == "mi" ? activity.distance * 0.000621371 : activity.distance * 0.001)) return false
            if (filters.distance.lessThan && filters.distance.lessThan < (units == "mi" ? activity.distance * 0.000621371 : activity.distance * 0.001)) return false
        }

        //filter by elevation
        if ((filters.elevation.greaterThan || filters.elevation.lessThan) && !activity.elevation) return false
        if (activity.elevation){
            if (filters.elevation.greaterThan && filters.elevation.greaterThan > (units == "mi" ? activity.elevation * 3.28084 : activity.elevation)) return false
            if (filters.elevation.lessThan && filters.elevation.lessThan < (units == "mi" ? activity.elevation * 3.28084 : activity.elevation)) return false
        } 

        //filter by average HR
        if ((filters.averageHR.greaterThan || filters.averageHR.lessThan) && !activity.average_heartrate) return false
        if (activity.average_heartrate){
            if (filters.averageHR.greaterThan && filters.averageHR.greaterThan > activity.average_heartrate) return false
            if (filters.averageHR.lessThan && filters.averageHR.lessThan < activity.average_heartrate) return false
        }

        return true
    })

}