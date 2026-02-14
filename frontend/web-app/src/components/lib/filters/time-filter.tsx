import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import React from "react";
import { ActivityFilters } from "./utils";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Input } from "@/components/ui/input";
import { convertDistance, convertTime, timeToSeconds } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";


interface FilterSheetProps {
  filter: ActivityFilters
  setFilter: React.Dispatch<React.SetStateAction<ActivityFilters>>
}

export default function TimeFilter({filter, setFilter}: FilterSheetProps){
    const [minInput, setMinInput] = React.useState("")
    const [maxInput, setMaxInput] = React.useState("")
    const [minError, setMinError] = React.useState<String | undefined>(undefined)
    const [maxError, setMaxError] = React.useState<String | undefined>(undefined)

    React.useEffect(() => {
        setMinInput(filter.time.greaterThan ? convertTime(filter.time.greaterThan): "")
        setMaxInput(filter.time.lessThan ? convertTime(filter.time.lessThan): "")
    }, [filter.time.greaterThan, filter.time.lessThan])


    const timeRegex = /^(?:[0-9]+:[0-5][0-9]:[0-5][0-9]|[0-5]?[0-9]:[0-5][0-9])$/

    const handleReset = () => {
        setFilter(filter => ({
            ...filter,
            time: {
                type: "moving",
                lessThan: undefined,
                greaterThan: undefined
            }
        }))
        setMinError(undefined)
        setMaxError(undefined)
        setMinInput("")
        setMaxInput("")
    }

    return (
        <AccordionItem value="time">
            <AccordionTrigger>Activity Time</AccordionTrigger>
            <AccordionContent className=" grid grid-cols-1">
                <RadioGroup value={filter.time.type} className="flex mb-3 gap-4"
                    onValueChange={(value => {
                        setFilter((filter) => ({
                            ...filter,
                            time: {
                                ...filter.time,
                                type: value as "moving" | "elapsed"
                            }
                        }))
                    })}
                >
                    <div className="flex gap-1">
                        <RadioGroupItem value="moving" id="at1"/>
                        <Label htmlFor="at1">Moving</Label>
                    </div>
                    <div className="flex gap-1">
                        <RadioGroupItem value="elapsed" id="at2"/>
                        <Label htmlFor="at2">Elapsed</Label>
                    </div>
                </RadioGroup>
                <div className="flex justify-between gap-4">
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="time" className="-mb-2">Min</FieldLabel>
                        <Input id="time_min" type="text" placeholder="HH:MM:SS" value={minInput}
                            onChange={(e) => {
                                setMinInput(e.target.value)
                                setMinError(undefined)
                            }}
                            onBlur={() => {
                                if (minInput === "") {
                                    setMinError(undefined)

                                    setFilter((filter) => ({
                                        ...filter,
                                        time: {
                                        ...filter.time,
                                        greaterThan: undefined,
                                        }
                                    }))

                                    return
                                }

                                if (!timeRegex.test(minInput)) {
                                    setMinError("HH:MM:SS")
                                    return
                                }

                                const seconds = timeToSeconds(minInput)

                                setFilter((filter) => ({
                                    ...filter,
                                    time: {
                                        ...filter.time,
                                        greaterThan: seconds,
                                    }
                                }))

                                setMinError(undefined)
                            }}
                        />
                        {minError && (<p className="text-sm text-red-500 mt-1">{minError}</p>)}
                    </Field>
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="time" className="-mb-2">Max</FieldLabel>
                        <Input id="time_max" type="text" placeholder="HH:MM:SS" value={maxInput}
                            onChange={(e) => {
                                setMaxInput(e.target.value)
                                setMaxError(undefined)                               
                            }}
                            onBlur={() => {
                                if (maxInput === "") {
                                    setMaxError(undefined)

                                    setFilter((filter) => ({
                                        ...filter,
                                        time: {
                                        ...filter.time,
                                        lessThan: undefined,
                                        }
                                    }))

                                    return
                                }

                                if (!timeRegex.test(maxInput)) {
                                    setMaxError("HH:MM:SS")
                                    return
                                }

                                const seconds = timeToSeconds(maxInput)

                                setFilter((filter) => ({
                                    ...filter,
                                    time: {
                                        ...filter.time,
                                        lessThan: seconds,
                                    }
                                }))

                                setMaxError(undefined)
                            }}
                        />
                        {maxError && (<p className="text-sm text-red-500 mt-1">{maxError}</p>)}
                    </Field>
                </div>
                <Button variant="outline" size="xs" className="justify-self-end mt-2 -mb-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white" onClick={handleReset}>Reset</Button>
            </AccordionContent>
        </AccordionItem>
    )
}