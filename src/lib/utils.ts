import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const onCloseApp = () => window.ipcRenderer.send('closeApp')

const httpClient = await axios.create({
  baseURL : import.meta.env.VITE_HOST_URL
})
export const fetchUsersProfile = async(clerkId : string) => {
  const response = await httpClient.get(`/auth/${clerkId}`, {
    headers : {
      'Content-Type' : 'application/json'
    }
  })
  return response.data
}