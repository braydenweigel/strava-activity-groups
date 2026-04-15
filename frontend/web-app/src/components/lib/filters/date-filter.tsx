import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";
import { ActivityFilters } from "./utils";


interface FilterSheetProps {
  filter: ActivityFilters
  setFilter: React.Dispatch<React.SetStateAction<ActivityFilters>>
}

export default function DateFilter({filter, setFilter}: FilterSheetProps){
    const [afterOpen, setAfterOpen] = React.useState(false)
    const [beforeOpen, setBeforeOpen] = React.useState(false)

    const handleReset = () => {
        setFilter(filter => ({
            ...filter,
            date: {
                before: undefined,
                after: undefined
            }
        }))
    }

    return (
        <AccordionItem value="date">
            <AccordionTrigger>Date</AccordionTrigger>
            <AccordionContent className="h-auto grid grid-cols-1">
                <div className="flex justify-between">
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="date" className="-mb-2">After</FieldLabel>
                        <Popover open={afterOpen} onOpenChange={setAfterOpen}>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="justify-start font-normal"
                            >
                                {filter.date.after ? filter.date.after.toLocaleDateString() : "Select date"}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={filter.date.after}
                                defaultMonth={filter.date.after}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    setFilter(filter => ({
                                        ...filter,
                                        date: {
                                            ...filter.date,
                                            after: date
                                        }
                                    }))
                                    setAfterOpen(false)
                                }}
                            />
                            </PopoverContent>
                        </Popover>
                    </Field>
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="date" className="-mb-2">Before</FieldLabel>
                        <Popover open={beforeOpen} onOpenChange={setBeforeOpen}>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="justify-start font-normal"
                            >
                                {filter.date.before ? filter.date.before.toLocaleDateString() : "Select date"}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={filter.date.before}
                                defaultMonth={filter.date.before}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    setFilter(filter => ({
                                        ...filter,
                                        date: {
                                            ...filter.date,
                                            before: date
                                        }
                                    }))
                                    setBeforeOpen(false)
                                }}
                            />
                            </PopoverContent>
                        </Popover>
                    </Field>
                </div>
                <Button variant="destructive" size="xs" className="justify-self-end my-2" onClick={handleReset}>Reset</Button>
            </AccordionContent>
        </AccordionItem>
    )
}