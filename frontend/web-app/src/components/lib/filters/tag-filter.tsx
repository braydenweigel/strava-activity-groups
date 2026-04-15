import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ActivityFilters } from "./utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tag } from "@/lib/store/tagSlice"
import { Field, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { RootState } from "@/lib/store/store"
import { useSelector } from "react-redux"

interface FilterSheetProps {
  filter: ActivityFilters
  setFilter: React.Dispatch<React.SetStateAction<ActivityFilters>>
}

export default function TagFilter({filter, setFilter}: FilterSheetProps){
    const {tree} = useSelector((state: RootState) => state.tags)


    const handleReset = () => {
        setFilter(filter => ({
            ...filter,
            tags: []
        }))
    }
    
    return (
        <AccordionItem value="tag">
            <AccordionTrigger>Tags</AccordionTrigger>
            <AccordionContent className="h-auto grid grid-cols-1">
                <ScrollArea className="h-48">
                    {tree.map((tag) => (<div key={tag.id} className="mb-1"><TagCheckbox tag={tag} offset={0} filter={filter} setFilter={setFilter}/></div>))}
                </ScrollArea>
                <Button variant="destructive" size="xs" className="justify-self-end my-2" onClick={handleReset}>Reset</Button>
            </AccordionContent>
        </AccordionItem>
    )
}

type TagCheckboxProps = FilterSheetProps & {
    tag: Tag
    offset: number
}

function TagCheckbox({ tag, offset, filter, setFilter }: TagCheckboxProps){

    return (
        <div style={{paddingLeft: offset, marginBottom: 1}}>
            <Field orientation="horizontal">
                <Checkbox id={tag.id} name={tag.tagname} checked={filter.tags.find((t) => t.id === tag.id) ? true : false}
                    onCheckedChange={(e) => {
                        const checked = e === true

                        if (checked){
                            setFilter(filter => ({
                                ...filter,
                                tags: [...filter.tags, tag]
                            }))
                        } else {
                            const i = filter.tags.findIndex((t) => t.id === tag.id)

                            if (i < 0) return 
                            const tags = filter.tags
                            tags.splice(i, 1)
                            setFilter(filter => ({
                                ...filter,
                                tags: tags
                            }))
                        }
                    }}
                />
                <FieldLabel htmlFor={tag.id} className="-ml-1">{tag.tagname}</FieldLabel>
            </Field>
            {tag.children.map((tag) => (<TagCheckbox key={tag.id} tag={tag} offset={offset + 20} filter={filter} setFilter={setFilter}/>))}
        </div>
    )
}