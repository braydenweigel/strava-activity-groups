import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";
import { Field, FieldLabel } from "../ui/field";
import { Popover, PopoverTrigger } from "../ui/popover";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import DateFilter from "./filters/date-filter";
import { ActivityFilters, initialFilter } from "./filters/utils";
import DistanceFilter from "./filters/distance-filter";
import ElevationFilter from "./filters/elevation-filter";


interface FilterSheetProps {
  filter: ActivityFilters
  setFilter: React.Dispatch<React.SetStateAction<ActivityFilters>>
}


export default function FilterSheet({filter, setFilter}: FilterSheetProps){


    const clearFilter = () => {
      setFilter(structuredClone(initialFilter))
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="default" >Filter <SlidersHorizontal/></Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="-mb-6">
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>

              <Accordion type="multiple" defaultValue={undefined} className="px-2">

                <AccordionItem value="sport">
                  <AccordionTrigger>Sport</AccordionTrigger>
                  <AccordionContent>

                  </AccordionContent>
                </AccordionItem>

                <DateFilter setFilter={setFilter} filter={filter}/>

                <AccordionItem value="time">
                  <AccordionTrigger>Activity Time</AccordionTrigger>
                  <AccordionContent>

                  </AccordionContent>
                </AccordionItem>

                <DistanceFilter setFilter={setFilter} filter={filter}/>

                <AccordionItem value="pace">
                  <AccordionTrigger>Pace</AccordionTrigger>
                  <AccordionContent>

                  </AccordionContent>
                </AccordionItem>

                <ElevationFilter setFilter={setFilter} filter={filter}/>

                <AccordionItem value="hr">
                  <AccordionTrigger>Average Heart Rate</AccordionTrigger>
                  <AccordionContent>

                  </AccordionContent>
                </AccordionItem>

              </Accordion>

              <SheetFooter>
                <Button variant="destructive" size="sm" onClick={clearFilter}>Clear Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
    )
}