import { EllipsisVertical, Tags } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { Tag } from "@/lib/store/tagSlice";
import { CreateTagDialog, SelectParent } from "./create-tag-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { deleteTagWithID, updateTagWithID } from "@/lib/utils";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function TagsDialog(){
    const {data, tree } = useSelector((state: RootState) => state.tags)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Tags <Tags/></Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader className="flex flex-row w-full items-center justify-between">
                    <DialogTitle>Tags</DialogTitle>
                    <CreateTagDialog tags={data}/>
                </DialogHeader>
                {tree.map((tag) => (<TagItem key={tag.id} tag={tag} offset={0}/>))}

            </DialogContent>
        </Dialog>
    )
}

type TagItemProps = {
    tag: Tag
    offset: number
}

function TagItem({tag, offset}: TagItemProps){
    const dispatch = useDispatch<AppDispatch>()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [updateOpen, setUpdateOpen] = useState(false)
    const [name, setName] = useState(tag.tagname)
    const [parent, setParent] = useState(tag.parent_id ?? "No Parent")

    const {data } = useSelector((state: RootState) => state.tags)
    const tagChildren = getTagChildren(tag)

    const handleDelete = () => {
        deleteTagWithID(tag.id, dispatch)
        setDeleteOpen(false)
    }

    const handleUpdate = () => {
        let parentID
        if (parent === "No Parent"){
            parentID = null
        } else {
            parentID = parent
        }

        updateTagWithID(tag, name, parentID, dispatch)
        setUpdateOpen(false)
    }

    const selectItems: SelectParent[] = []
    selectItems.push({value: "No Parent", name: "No Parent"})

    for (const t of data){
        if (!tagChildren.includes(t.id)) selectItems.push({value: t.id, name: t.tagname})
    }

    return (
        <>
            <div key={tag.id} className="flex w-full items-center justify-between" style={{paddingLeft: offset}}>
                <p >{tag.tagname}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><EllipsisVertical/></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setUpdateOpen(true)}>Update</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            {tag.children.length > 0 ?
                tag.children.map((child) => (<TagItem key={child.id} tag={child} offset={offset + 12}/>))
                : null
            }
            <AlertDialog open={deleteOpen}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader><AlertDialogTitle>Delete Tag?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogDescription>
                        Do you want to delete this tag? This cannot be undone. Deleting this tag will also delete all child tags.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleDelete}>Delete Tag</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={updateOpen}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader><DialogTitle>Update Tag</DialogTitle></DialogHeader>
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
                            <Select defaultValue={tag.parent_id ?? "No Parent"} onValueChange={(value) => setParent(value)}>
                                <SelectTrigger><SelectValue placeholder="Select Parent Tag"/></SelectTrigger>
                                <SelectContent>
                                    {selectItems.map((item) => (<SelectItem key={item.value} value={item.value}>{item.name}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </Field>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline" onClick={() => setUpdateOpen(false)}>Cancel</Button></DialogClose>
                        <DialogClose asChild><Button variant="default" onClick={handleUpdate}>Update Tag</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

function getTagChildren(tag: Tag){
    const children: string[] = []
    children.push(tag.id)
    for (const child of tag.children){
        getChildren(child, children)
    }

    return children
}

function getChildren(tag: Tag, children: string[]){
    children.push(tag.id)
    for (const child of tag.children){
        getChildren(child, children)
    }
}