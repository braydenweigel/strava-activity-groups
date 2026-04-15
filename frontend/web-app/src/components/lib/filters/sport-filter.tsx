import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import React from "react";
import { ActivityFilters, formatSport, Sports } from "./utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";


interface FilterSheetProps {
  filter: ActivityFilters
  setFilter: React.Dispatch<React.SetStateAction<ActivityFilters>>
}

export default function SportFilter({filter, setFilter}: FilterSheetProps){

    const handleReset = () => {
        setFilter(filter => ({
            ...filter,
            sport: new Set<string>()
        }))
    }

    return (
        <AccordionItem value="sport">
            <AccordionTrigger>Sport</AccordionTrigger>
            <AccordionContent className="h-auto grid grid-cols-1">
                <ScrollArea className="h-48">
                    {Sports.map((sport) => {
                        return (
                            <Field orientation="horizontal" key={sport}>
                                <Checkbox id={sport} name={sport} checked={filter.sport.has(sport)} 
                                    onCheckedChange={(e) => {
                                        const checked = e === true

                                        if (checked){
                                            setFilter(filter => ({
                                                ...filter,
                                                sport: new Set(filter.sport).add(sport)
                                            }))
                                        } else {
                                            const newSet = new Set(filter.sport)
                                            newSet.delete(sport)

                                            setFilter(filter => ({
                                                ...filter,
                                                sport: newSet
                                            }))
                                        }
                                    }}
                                />
                                <FieldLabel htmlFor={sport} className="">{formatSport(sport)}</FieldLabel>
                            </Field>
                        )
                    })}

                </ScrollArea>
                <Button variant="destructive" size="xs" className="justify-self-end my-2" onClick={handleReset}>Reset</Button>
            </AccordionContent>
        </AccordionItem>
    )
}