import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginCard() {
  return (
    <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Activity Groups</CardTitle>
            <CardDescription>Powered by Strava</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
            <Link href="https://www.strava.com/oauth/authorize?client_id=196961&redirect_uri=http://localhost:8080/api/auth/strava/callback&response_type=code&approval_prompt=force&scope=read,activity:read_all&state=web" className="w-full">
              <Button className="w-full bg-[#fc5200] hover:bg-[#e64c00]">Connect with Strava</Button>
            </Link>
        </CardFooter>
    </Card>
  );
}
