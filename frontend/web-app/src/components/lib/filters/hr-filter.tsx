import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import React from "react";
import { ActivityFilters } from "./utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";


interface FilterSheetProps {
  filter: ActivityFilters
  setFilter: React.Dispatch<React.SetStateAction<ActivityFilters>>
}

export default function HeartRateFilter({filter, setFilter}: FilterSheetProps){

    const handleReset = () => {
        setFilter(filter => ({
            ...filter,
            averageHR: {
                lessThan: undefined,
                greaterThan: undefined
            }
        }))
    }

    return (
        <AccordionItem value="average_hr">
            <AccordionTrigger>Average Heart Rate</AccordionTrigger>
            <AccordionContent className="h-auto grid grid-cols-1">
                <div className="flex justify-between gap-4">
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="hr" className="-mb-2">
                            Min
                            <Badge variant="secondary" className="ml-auto">bpm</Badge>
                        </FieldLabel>
                        <Input id="hr_min" type="number" placeholder="Min. HR" value={filter.averageHR.greaterThan ?? ""}
                            onChange={(e) => {
                                const hr = Number(e.target.value)

                                setFilter(filter => ({
                                    ...filter,
                                    averageHR: {
                                        ...filter.averageHR,
                                        greaterThan: hr
                                    }
                                }))
                            }}
                        />
                    </Field>
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="hr" className="-mb-2">
                            Max
                            <Badge variant="secondary" className="ml-auto">bpm</Badge>
                        </FieldLabel>
                        <Input id="hr_max" type="number" placeholder="Max. HR" value={filter.averageHR.lessThan ?? ""}
                            onChange={(e) => {
                                const hr = Number(e.target.value)

                                setFilter(filter => ({
                                    ...filter,
                                    averageHR: {
                                        ...filter.averageHR,
                                        lessThan: hr
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