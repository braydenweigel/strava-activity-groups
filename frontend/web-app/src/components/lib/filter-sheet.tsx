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
import HeartRateFilter from "./filters/hr-filter";
import SportFilter from "./filters/sport-filter";
import { ScrollArea } from "../ui/scroll-area";
import TimeFilter from "./filters/time-filter";
import PaceFilter from "./filters/pace-filter";


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
            <SheetContent side="left" className="flex flex-col h-full">
              <SheetHeader className="-mb-6">
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>

              <ScrollArea className="flex-1 overflow-hidden">
                <Accordion type="multiple" defaultValue={undefined} className="px-2">
                  <SportFilter setFilter={setFilter} filter={filter}/>
                  <DateFilter setFilter={setFilter} filter={filter}/>
                  <TimeFilter setFilter={setFilter} filter={filter}/>
                  <DistanceFilter setFilter={setFilter} filter={filter}/>
                  <PaceFilter setFilter={setFilter} filter={filter}/>
                  <ElevationFilter setFilter={setFilter} filter={filter}/>
                  <HeartRateFilter setFilter={setFilter} filter={filter}/>
                </Accordion>               
              </ScrollArea>
              <SheetFooter>
                <Button variant="destructive" size="sm" onClick={clearFilter}>Clear Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
    )
}