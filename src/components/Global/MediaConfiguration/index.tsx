import { SourceDeviceProps } from '@/hooks/useMediaSources'
import { useStudioSettings } from '@/hooks/useStudioSettings'
import { Spinner } from '../Spinner'
import { Headphones, Monitor, Settings2 } from 'lucide-react'
import { useEffect } from 'react'

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
    const activeScreen = state?.displays?.find((screen) => screen.id == user?.studio?.screen)
    const activeAudio = state?.audioInputs?.find((device) => device.deviceId == user?.studio?.mic)
    const { register, isPending, onPreset, responseData } = useStudioSettings(
      user?.id!,
      user?.studio?.screen || state.displays?.[0]?.id, 
      user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
      user?.studio?.preset ,
      user?.subscription?.plan
    )
    console.log("STATE", state)
    console.log("RESPONSE DATA", responseData)
    useEffect(() => {
        const requestMediaAccess =  async() => {
            try {
                // Request microphone access
               await  navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                
                // Request screen capture access
               await  navigator.mediaDevices.getDisplayMedia({ 
                    video: {
                        displaySurface: "monitor" as const
                    } as DisplayMediaStreamOptions["video"],
                    audio: true 
                });
                console.log("MEDIA ACCESS GRANTED")
                console.log("ACTIVE SCREEN", activeScreen)
                console.log("ACTIVE AUDIO", activeAudio)
                console.log(state)
            } catch (error : unknown) {
                if (error instanceof Error && error.name === 'NotReadableError') {
                    console.error('Media device is already in use. Please close other applications using the device.');
                } else {
                    console.error('Error accessing media devices:', error);
                }
            }
        };
        
        requestMediaAccess();
    }, [activeScreen, activeAudio])
    console.log(state)
      return ( 
  <form className='flex h-full relative w-full flex-col gap-y-5'>
     {isPending  && (
        <div className='fixed z-50 w-full top-0 left-0 right-0 bottom-0 rounded-3xl h-full bg-black/80 flex justify-center items-center'>
            <Spinner/>
        </div>
     )}
     <div className='flex gap-x-5 justify-center items-center'>
        <Monitor color='#575655' fill='#575655' size={36}/>
        <select 
        {...register('screen')}
        className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full'
        >
            {state?.displays?.map((display, key) => (
                <option
                value={display.id}
                className='bg-[#171717] cursor-pointer'
                key={key}
                >
                 {display?.name } 
                </option>
            ))}
    <option value="">
        Default screen
    </option>
   </select>
     </div>
     <div className='flex gap-x-5 justify-center items-center'>
    <Headphones color='#575655' size={36} />
    <select 
        {...register('audio')}
        className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full'
        >
        
            {state?.audioInputs?.map((device, key) => (
                <option
                value={device.deviceId}
                className='bg-[#171717] cursor-pointer'
                key={key}
                >
                {device.label }
                </option>
                
            ))}
           <option value="">
            Default microphone
         </option>
   </select>
     </div>
     <div className='flex gap-x-5 justify-center items-center'>
      <Settings2 color='#575655' size={36}/>
      <select 
        {...register('preset')}
        className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full'
        >
           <option
           disabled={true}
           value={'HD'}
           className='bg-[#171717] cursor-pointer'
           >
             1080p{' '}
             {user?.subscription?.plan === "FREE" && '(Upgrade to PRO plan)'}
           </option>
           <option
           selected={onPreset === "SD" || user?.studio?.preset === "SD"}
           value={'SD'}
           className='bg-[#171717] cursor-pointer'
           >
           720p
           </option>
   </select>
     </div>
   </form>
   ) 
  
}

export default MediaConfiguration
