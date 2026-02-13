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
    const [error, setError] = React.useState<String | undefined>(undefined)

    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)


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
            <AccordionContent className=" grid grid-cols-1">
                <div className="flex justify-between gap-4">
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="elevation" className="-mb-2">
                            Min
                            <Badge variant="secondary" className="ml-auto">{user?.units == "mi" ? "ft" : "m"}</Badge>
                        </FieldLabel>
                        <Input id="elevation_min" type="number" placeholder="Min. Elevation" value={filter.elevation.greaterThan ?? ""}
                            onChange={(e) => {
                                let elevation 
                                elevation = Number(e.target.value)

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
                                let elevation 
                                elevation = Number(e.target.value)

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
                <Button variant="outline" size="xs" className="justify-self-end mt-2 -mb-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white" onClick={handleReset}>Reset</Button>
            </AccordionContent>
        </AccordionItem>
    )
}