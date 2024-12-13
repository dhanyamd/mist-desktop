import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react"
import { Spinner } from "../Spinner"
import { useEffect, useState } from "react"
import { fetchUsersProfile } from "@/lib/utils"

const Widget = () => {
    const [profile, setProfile] = useState<{
        status : number 
        user : 
            | ({
                subscription : {
                    plan : "PRO" | "FREE"
                } | null
                studio : {
                    id : string 
                    screen : string | null 
                    mic : string | null 
                    preset : 'HD' | 'SD'
                    camera : string | null 
                    userId : string | null
                } | null
            } & {
                id : string 
                email : string
                firstname : string | null
                lastname : string | null 
                 createdAt : Date 
                 clerkid : string
            }) 
          |null
    } | null>(null)
    const {user} = useUser() 
    const {state, fetchMediaResources} = useMediaResources()
    useEffect(() => {
        if(user && user.id){
            fetchUsersProfile(user.id).then((p) => setProfile(p))
        }
    },[user])
  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Spinner/>
        </div>
        </ClerkLoading> 
        <SignedIn>
            {profile ? (
               <MediaConfiguration/>
            ) : (
            <div className="w-full h-ful items-center justify-center flex">
           <Spinner color="#fff" />
            </div>
            )}
        </SignedIn>
    </div>
  )
}

export default Widget
