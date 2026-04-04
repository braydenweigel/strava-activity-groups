import { EllipsisVertical, Plus, Tags } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { Tag } from "@/lib/store/tagSlice";
import { CreateTagDialog } from "./create-tag-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { deleteTagWithID } from "@/lib/utils";

export default function TagsDialog(){
    const {data, tree, loading, error} = useSelector((state: RootState) => state.tags)

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


    const handleDelete = () => {
        deleteTagWithID(tag.id, dispatch)
        setDeleteOpen(false)
    }
    return (
        <>
            <div key={tag.id} className="flex w-full items-center justify-between" style={{paddingLeft: offset}}>
                <p >{tag.tagname}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><EllipsisVertical/></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>Update</DropdownMenuItem>
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
        </>
    )
}