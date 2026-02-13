import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import React from "react";
import { ActivityFilters } from "./utils";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Input } from "@/components/ui/input";
import { convertDistance } from "@/lib/utils";


interface FilterSheetProps {
  filter: ActivityFilters
  setFilter: React.Dispatch<React.SetStateAction<ActivityFilters>>
}

export default function DistanceFilter({filter, setFilter}: FilterSheetProps){
    const [error, setError] = React.useState<String | undefined>(undefined)

    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)


    const handleReset = () => {
        setFilter(filter => ({
            ...filter,
            distance: {
                lessThan: undefined,
                greaterThan: undefined
            }
        }))
    }

    return (
        <AccordionItem value="distance">
            <AccordionTrigger>Distance</AccordionTrigger>
            <AccordionContent className=" grid grid-cols-1">
                <div className="flex justify-between gap-4">
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="distance" className="-mb-2">
                            Min
                            <Badge variant="secondary" className="ml-auto">{user?.units}</Badge>
                        </FieldLabel>
                        <Input id="distance_min" type="number" placeholder="Min. Distance" value={filter.distance.greaterThan ?? ""}
                            onChange={(e) => {
                                let distance 
                                distance = Number(e.target.value)

                                setFilter(filter => ({
                                    ...filter,
                                    distance: {
                                        ...filter.distance,
                                        greaterThan: distance
                                    }
                                }))
                            }}
                        />
                    </Field>
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="distance" className="-mb-2">
                            Max
                            <Badge variant="secondary" className="ml-auto">{user?.units}</Badge>
                        </FieldLabel>
                        <Input id="distance_max" type="number" placeholder="Max. Distance" value={filter.distance.lessThan ?? ""}
                            onChange={(e) => {
                                let distance 
                                distance = Number(e.target.value)

                                setFilter(filter => ({
                                    ...filter,
                                    distance: {
                                        ...filter.distance,
                                        lessThan: distance
                                    }
                                }))
                            }}
                        />
                    </Field>
                </div>
                <Button variant="outline" size="xs" className="justify-self-end mt-2 -mb-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white" onClick={handleReset}>Reset</Button>
            </AccordionContent>
        </AccordionItem>
    )
}