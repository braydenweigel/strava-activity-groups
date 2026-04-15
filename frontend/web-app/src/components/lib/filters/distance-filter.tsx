import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import React from "react";
import { ActivityFilters } from "./utils";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Input } from "@/components/ui/input";


interface FilterSheetProps {
  filter: ActivityFilters
  setFilter: React.Dispatch<React.SetStateAction<ActivityFilters>>
}

export default function DistanceFilter({filter, setFilter}: FilterSheetProps){
    const {data: user} = useSelector((state: RootState) => state.user)


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
            <AccordionContent className="h-auto grid grid-cols-1">
                <div className="flex justify-between gap-4">
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="distance" className="-mb-2">
                            Min
                            <Badge variant="secondary" className="ml-auto">{user?.units}</Badge>
                        </FieldLabel>
                        <Input id="distance_min" type="number" placeholder="Min. Distance" value={filter.distance.greaterThan ?? ""}
                            onChange={(e) => {
                                const distance = Number(e.target.value)

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
                                const distance = Number(e.target.value)

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
                <Button variant="destructive" size="xs" className="justify-self-end my-2" onClick={handleReset}>Reset</Button>
            </AccordionContent>
        </AccordionItem>
    )
}