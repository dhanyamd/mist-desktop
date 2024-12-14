import { SourceDeviceProps } from '@/hooks/useMediaResources'
import { useStudioSettings } from '@/hooks/useStudioSettings'

type Props = {
    state : SourceDeviceProps
    user : 
| ({
    subscription : {
        plan : 'FREE' | 'PRO'
    } | null
    studio : {
        id : string 
        screen : string | null 
        mic : string | null 
        camera : string | null 
        preset : 'HD' | 'SD'
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
| null 
}

const MediaConfiguration = ({state, user} : Props) => {
    const {register, isPending, onPreset} = useStudioSettings(
      user?.id!,
      user?.studio?.screen || state.displays?.[0].id,
      user?.studio?.mic || state.audioInputs?.[0].deviceId,
      user?.studio?.preset ,
      user?.subscription?.plan
    )
  return (
   <form className='flex h-full relative w-full flex-col gap-y-5'>
   {}
   </form>
  )
}

export default MediaConfiguration
