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

export default function ElevationFilter({filter, setFilter}: FilterSheetProps){
    const {data: user} = useSelector((state: RootState) => state.user)


    const handleReset = () => {
        setFilter(filter => ({
            ...filter,
            elevation: {
                lessThan: undefined,
                greaterThan: undefined
            }
        }))
    }

    return (
        <AccordionItem value="elevation">
            <AccordionTrigger>Elevation</AccordionTrigger>
            <AccordionContent className="h-auto grid grid-cols-1">
                <div className="flex justify-between gap-4">
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="elevation" className="-mb-2">
                            Min
                            <Badge variant="secondary" className="ml-auto">{user?.units == "mi" ? "ft" : "m"}</Badge>
                        </FieldLabel>
                        <Input id="elevation_min" type="number" placeholder="Min. Elevation" value={filter.elevation.greaterThan ?? ""}
                            onChange={(e) => {
                                const elevation = Number(e.target.value)

                                setFilter(filter => ({
                                    ...filter,
                                    elevation: {
                                        ...filter.elevation,
                                        greaterThan: elevation
                                    }
                                }))
                            }}
                        />
                    </Field>
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="elevation" className="-mb-2">
                            Max
                            <Badge variant="secondary" className="ml-auto">{user?.units == "mi" ? "ft" : "m"}</Badge>
                        </FieldLabel>
                        <Input id="elevation_max" type="number" placeholder="Max. elevation" value={filter.elevation.lessThan ?? ""}
                            onChange={(e) => {
                                const elevation = Number(e.target.value)

                                setFilter(filter => ({
                                    ...filter,
                                    elevation: {
                                        ...filter.elevation,
                                        lessThan: elevation
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