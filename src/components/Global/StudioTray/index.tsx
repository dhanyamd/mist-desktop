import { StartRecording } from "@/lib/recorder"
import { cn } from "@/lib/utils"
import { Pause } from "lucide-react"
import { useRef, useState } from "react"

const StudioTray = () => {
    let initialTime = new Date()
    const[preview, setPreview] = useState(true)
    const[recording, setRecording] = useState(true)
    const[onSources, setOnSources] = useState<
   | {
    screen : string,
    id : string,
    audio: string,
    preset : 'HD' | 'SD',
    plan : 'FREE' | 'PRO'
   }
   | undefined  
   >(true) 
   
   window.ipcRenderer.on('profile-received', (event, payload) => {
    console.log(event) 
    console.log("is running")
    setOnSources(payload)
   })
    const videoElement = useRef<HTMLVideoElement | null>(null)
    return !onSources ? (
        <>
        sdgahdjhdsdsa
        </>
    ) : (
        <div className="flex flex-col justify-end gap-y-5 h-screen draggable">
        <video 
        autoPlay 
       ref={videoElement}
       className={cn("w-6/12 border-2 self-end", preview ? "hidden" : '')}
        />
        <div className="rounded-full flex justify-around items-center h-20 w-full border-2 bg-[#171717] draggable border-white/40"
        >
            <div {...(onSources && {
                onClick : () => {
                    setRecording(true)
                    StartRecording(onSources)
                }
            })} 
            className={cn('non-draggable rounded-full cursor-pointer relative hover:opacity-80',
                recording ? "bg-red-500 w-6 h-6" : "bg-red-400 h-8 w-8"
            )
            }
            > 
                {!recording && (
                    <Pause className="non-draggable opacity-50"
                    size={32}
                    fill="white"
                    stroke="none"
                    />
                )}
            </div>
        </div>
    </div>
    )

}

export default StudioTray
