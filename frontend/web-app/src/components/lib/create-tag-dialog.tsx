import { Tag } from "@/lib/store/tagSlice";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { createTag } from '../../lib/store/tagSlice'
import { createNewTag, fetchPOST } from "@/lib/utils";

type CreateTagDialogProps = {
    tags: Tag[]
}

type SelectParent = {
    value: string
    name: string 
}

export function CreateTagDialog({tags}: CreateTagDialogProps){
    const dispatch = useDispatch<AppDispatch>()
    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)
    const [name, setName] = useState("")
    const [parent, setParent] = useState("No Parent")

    const selectItems: SelectParent[] = []
    selectItems.push({value: "No Parent", name: "No Parent"})

    for (const tag of tags){
        selectItems.push({value: tag.id, name: tag.tagname})
    }

    const handleCreate = () => {
        let parentID
        if (parent === "No Parent"){
            parentID = null
        } else {
            parentID = parent
        }

        createNewTag(user?.id ?? "", name, parentID, dispatch)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-fit" size="sm" variant="outline"><Plus/> New Tag</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Create Tag</DialogTitle></DialogHeader>
                <div className="flex gap-2">
                    <Field >
                        <FieldLabel>Tag Name</FieldLabel>
                        <Input 
                            placeholder="Tag Name"
                            value={name}
                            onChange={(s) => {setName(s.target.value)}}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Parent</FieldLabel>
                        <Select defaultValue={"No Parent"} onValueChange={(value) => setParent(value)}>
                            <SelectTrigger><SelectValue placeholder="Select Parent Tag"/></SelectTrigger>
                            <SelectContent>
                                {selectItems.map((item) => (<SelectItem key={item.value} value={item.value}>{item.name}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </Field>

                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <DialogClose asChild><Button variant="default" onClick={handleCreate}>Create Tag</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}