import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import React from "react";
import { ActivityFilters, Sports } from "./utils";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";


interface FilterSheetProps {
  filter: ActivityFilters
  setFilter: React.Dispatch<React.SetStateAction<ActivityFilters>>
}

export default function SportFilter({filter, setFilter}: FilterSheetProps){
    const [error, setError] = React.useState<String | undefined>(undefined)

    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)


    const handleReset = () => {
        setFilter(filter => ({
            ...filter,
            sport: new Set<string>()
        }))
    }

    return (
        <AccordionItem value="sport">
            <AccordionTrigger>Sport</AccordionTrigger>
            <AccordionContent className=" grid grid-cols-1">
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
                                <FieldLabel htmlFor={sport} className="">{sport}</FieldLabel>
                            </Field>
                        )
                    })}

                </ScrollArea>
                <Button variant="outline" size="xs" className="justify-self-end mt-2 -mb-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white" onClick={handleReset}>Reset</Button>
            </AccordionContent>
        </AccordionItem>
    )
}