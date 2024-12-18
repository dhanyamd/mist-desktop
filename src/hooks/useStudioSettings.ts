import { useZodForm } from "./useZodForm"
import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateStudioSettings } from "@/lib/utils"
import { toast } from "sonner"
import { updateStudioSettingsSchema } from "@/schemas/studio-settings"

export const useStudioSettings = (
    id : string ,
    screen? : string | null,
    audio? : string | null ,
    preset? : 'HD' |'SD',
    plan? : 'PRO' | 'FREE'
) => {
 const [onPreset, setPreset] = useState<'HD' | 'SD' | undefined>()
 const[responseData, setResponseData] = useState<any>(null)
  const {register, watch} = useZodForm(updateStudioSettingsSchema, {
    screen : screen!,
    audio : audio!,
    //@ts-ignore
    preset : preset!, 
  })
  const {mutate, isPending} = useMutation({
    mutationKey : ['update-studio'],
    mutationFn : (data : {
        screen : string 
        id : string 
        audio : string 
        preset : 'HD' | 'SD'
    }) => updateStudioSettings(data.id, data.screen, data.audio, data.preset),
    onSuccess: (data) => {
        return toast(data.status == 200 ? "Success" : "Error", {
            description : data?.message
        })
    }
  })
  useEffect(() => {
    if(screen && audio){
        // Request media permissions
        const requestMediaAccess = async () => {
            try {
                // Get audio stream
                const audioStream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        deviceId: audio ? { exact: audio } : undefined
                    },
                    video: false 
                });

                // Get screen stream
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
                    video: {
                        //@ts-ignore
                        cursor: "always" ,
                        displaySurface: "monitor",
                        deviceId: screen ? { exact: screen } : undefined
                    },
                    audio: false 
                });

                // Store streams in state or handle them as needed
                setResponseData({ audioStream, screenStream });
                
            } catch (error) {
                console.error('Error accessing media devices:', error);
                toast.error("Failed to access media devices");
            }
        };
        
        requestMediaAccess();
        
        // Listen for responses from main process
        const handleResponse = (_: any, data: any) => {
            setResponseData((prev: any) => ({...prev, ...data}));
        }
        
        window.ipcRenderer.on('profile-received', handleResponse);
        
        // Existing IPC call
        window.ipcRenderer.send('media-sources', {
            screen,
            id,
            audio,
            preset,
            plan
        });

        return () => {
            window.ipcRenderer.removeListener('profile-received', handleResponse);
        }
    }
  }, [screen, audio, id, preset, plan]);

  useEffect(() => {
   const subscribe = watch((values) => {
    //@ts-ignore
      setPreset(values.preset)
      mutate({
        screen : values.screen!,
        id,
        audio : values.audio!,
        //@ts-ignore
        preset : values.preset,
      })
      window.ipcRenderer.send('media-sources', {
        screen : values.screen!,
        id,
        audio : values.audio!,
        preset : values.preset!,
        plan
   })
  
}) 

   return () => subscribe.unsubscribe()
  },[watch])

  return {register, isPending, onPreset, responseData}
}