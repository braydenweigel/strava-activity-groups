import { RootState } from "@/lib/store/store";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Logout } from "@/lib/utils";


export default function ProfileDialog(){
    const {data: user, loading: userLoading, error: userError} = useSelector((state: RootState) => state.user)

    const handleLogout = () => {
        Logout()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" >Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Profile</DialogTitle>
              </DialogHeader>
              <p className="font-bold">{user?.firstname} {user?.lastname}</p>
              <p className="text-accent-foreground">{user?.username}</p>
              <Link href={`https://www.strava.com/athletes/${user?.athleteID}`} target="_blank" className="underline hover:text-[#fc5200]">View on Strava</Link>
              <DialogFooter>
                <Button size="sm" onClick={handleLogout}>Logout</Button>
                <Button variant="destructive" size="sm" onClick={handleLogout}>Delete Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    )
}