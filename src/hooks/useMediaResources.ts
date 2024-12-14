import { getMediaResources } from "@/lib/utils"
import {  useReducer } from "react"

export type SourceDeviceProps = {
    displays? : {
        appIcon? : null 
        display_id : string
        id: string
        name: string
        thumbnail : unknown
    }[],
    audioInputs? : {
        deviceId: string
        kind:string
        label : string
        groupId: string
    }[],
    error? : string | null
    isPending : boolean
}

export type DisplayDeviceActionProps = {
    type : "GET_DEVICES",
     payload : SourceDeviceProps
}
export const useMediaResources = () => {
    const [state, action] = useReducer((state : SourceDeviceProps , action : DisplayDeviceActionProps) => {
        switch (action.type) {
            case 'GET_DEVICES':
            return {...state, ...action.payload}
             
            default:
               return state
        }
    },{
        displays: [],
        audioInputs: [],
        error : null ,
        isPending : false
    })
    const fetchMediaResource = () => {
        action({type : "GET_DEVICES", payload : {isPending : true}})
        getMediaResources().then((sources) => 
        action({
            type : "GET_DEVICES",
            payload : {
                displays : sources.displays,
                audioInputs : sources.audio,
                isPending : false
            }
        })
    )
    }
    return {state, fetchMediaResource}
}