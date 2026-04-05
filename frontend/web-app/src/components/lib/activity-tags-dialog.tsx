import { CircleX, EllipsisVertical, Plus, Tags } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Activity } from "@/lib/store/activitySlice";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";
import { Tag } from "@/lib/store/tagSlice";
import { ButtonGroup } from "../ui/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Field, FieldLabel } from "../ui/field";
import { useState } from "react";

type ActivityTagsDialogProps = {
    activity: Activity
}

export default function ActivityTagsDialog({ activity }: ActivityTagsDialogProps){
    const {data, tree, loading, error} = useSelector((state: RootState) => state.tags)
    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)
    const [newTag, setNewTag] = useState<string | undefined>(undefined)

    const activityTags: Tag[] = [] //get this activity's tags
    const unusedTags: Tag[] = [] //tags that haven't been used for this activity
    for (const tag of data){
        if (tag.activities.find(a => a.activity_id === activity.id)){//activity has this tag
            activityTags.push(tag)
        } else {
            unusedTags.push(tag)
        }
    }

    const handleTagAdd = () => {

    }

    return (
        <Dialog>
            <DialogTrigger asChild><Button variant="ghost" size="icon-sm"><Tags/></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Manage Tags for {activity.name}</DialogTitle></DialogHeader>
                <Field>
                    <FieldLabel>Add a Tag</FieldLabel>
                    <ButtonGroup>
                        <Select defaultValue={undefined} onValueChange={(value) => setNewTag(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a tag"/>
                            </SelectTrigger>
                            <SelectContent>
                                {unusedTags.map((t) => (<SelectItem key={t.id} value={t.id}>{t.tagname}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline"><Plus/></Button>
                    </ButtonGroup>
                </Field>
                {activityTags.length > 0 && <Field>
                    <FieldLabel>Activity Tags</FieldLabel>
                    {activityTags.map((t) => (<ActivityTagItem key={t.id} tag={t}/>))}
                </Field>}
            </DialogContent>
        </Dialog>
    )
}

type ActivityTagItemProps = {
    tag: Tag
}

function ActivityTagItem({tag}: ActivityTagItemProps){

    const handleDelete = () => {

    }

    return (
        <div className="w-full items-center justify-between">
            <p>{tag.tagname}</p>
            <Button variant="destructive" size="icon-sm" onClick={handleDelete}><CircleX/></Button>
        </div>
    )
}