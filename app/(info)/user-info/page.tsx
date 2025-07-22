import {auth} from "@/auth";
import Image from "next/image";

export default async function UserInfo() {
    const session = await auth();
    return (
    <div>
        {" "}
        <h1> NextAuthv5 + Next 15</h1>
        <p> User signedin with name: {session?.user?.name}</p>
        <p>User signedwith email: {session?.user?.email}</p>

        {session?.user?. image && (
            <Image src={session.user. image} width={48} height={48} style={ {borderRadius:"50%" }} alt="image of user"/>
            )
        }

        </div>
)}