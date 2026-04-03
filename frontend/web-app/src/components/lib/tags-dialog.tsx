import { Tags } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function TagsDialog(){

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Tags <Tags/></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Tags</DialogTitle></DialogHeader>
            </DialogContent>
        </Dialog>
    )
}