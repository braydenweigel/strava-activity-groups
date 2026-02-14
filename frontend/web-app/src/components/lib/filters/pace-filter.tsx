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

export default function PaceFilter({filter, setFilter}: FilterSheetProps){
    const [minInput, setMinInput] = React.useState("")
    const [maxInput, setMaxInput] = React.useState("")
    const [minError, setMinError] = React.useState<String | undefined>(undefined)
    const [maxError, setMaxError] = React.useState<String | undefined>(undefined)

    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)
    

    React.useEffect(() => {
        setMinInput(filter.pace.greaterThan ? convertTime(filter.pace.greaterThan): "")
        setMaxInput(filter.pace.lessThan ? convertTime(filter.pace.lessThan): "")
    }, [filter.pace.greaterThan, filter.pace.lessThan])


    const paceRegex = /^[0-5]?[0-9]:[0-5][0-9]$/

    const handleReset = () => {
        setFilter(filter => ({
            ...filter,
            pace: {
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
        <AccordionItem value="pace">
            <AccordionTrigger>Pace</AccordionTrigger>
            <AccordionContent className=" grid grid-cols-1">
                <RadioGroup value={filter.pace.type} className="flex mb-3 gap-4"
                    onValueChange={(value => {
                        setFilter((filter) => ({
                            ...filter,
                            pace: {
                                ...filter.pace,
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
                        <FieldLabel htmlFor="pace" className="-mb-2">
                            Min
                            <Badge variant="secondary" className="ml-auto">min/{user?.units}</Badge>
                        </FieldLabel>
                        <Input id="pace_min" type="text" placeholder="MM:SS" value={minInput}
                            onChange={(e) => {
                                setMinInput(e.target.value)
                                setMinError(undefined)
                            }}
                            onBlur={() => {
                                if (minInput === "") {
                                    setMinError(undefined)

                                    setFilter((filter) => ({
                                        ...filter,
                                        pace: {
                                        ...filter.pace,
                                        greaterThan: undefined,
                                        }
                                    }))

                                    return
                                }

                                if (!paceRegex.test(minInput)) {
                                    setMinError("MM:SS")
                                    return
                                }

                                const seconds = timeToSeconds(minInput)

                                setFilter((filter) => ({
                                    ...filter,
                                    pace: {
                                        ...filter.pace,
                                        greaterThan: seconds,
                                    }
                                }))

                                setMinError(undefined)
                            }}
                        />
                        {minError && (<p className="text-sm text-red-500 mt-1">{minError}</p>)}
                    </Field>
                    <Field className="mx-auto w-44">
                        <FieldLabel htmlFor="pace" className="-mb-2">
                            Max
                            <Badge variant="secondary" className="ml-auto">min/{user?.units}</Badge>
                        </FieldLabel>
                        <Input id="pace_max" type="text" placeholder="MM:SS" value={maxInput}
                            onChange={(e) => {
                                setMaxInput(e.target.value)
                                setMaxError(undefined)                               
                            }}
                            onBlur={() => {
                                if (maxInput === "") {
                                    setMaxError(undefined)

                                    setFilter((filter) => ({
                                        ...filter,
                                        pace: {
                                        ...filter.pace,
                                        lessThan: undefined,
                                        }
                                    }))

                                    return
                                }

                                if (!paceRegex.test(maxInput)) {
                                    setMaxError("MM:SS")
                                    return
                                }

                                const seconds = timeToSeconds(maxInput)

                                setFilter((filter) => ({
                                    ...filter,
                                    pace: {
                                        ...filter.pace,
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