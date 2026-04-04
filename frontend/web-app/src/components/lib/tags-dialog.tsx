import { EllipsisVertical, Plus, Tags } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Tag } from "@/lib/store/tagSlice";
import { CreateTagDialog } from "./create-tag-dialog";

export default function TagsDialog(){
    const [open, setOpen] = useState(false)
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
    return (
        <>
            <div key={tag.id} className="flex w-full items-center justify-between" style={{paddingLeft: offset}}>
                <p >{tag.tagname}</p>
            </div>
            {tag.children.length > 0 ?
                tag.children.map((child) => (<TagItem key={child.id} tag={child} offset={offset + 12}/>))
                : null
            }
        </>
    )
}