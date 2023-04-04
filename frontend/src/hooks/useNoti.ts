import { useState } from "./useState"
import { NotificationType } from '@/types/PublicCompType'
export const useNoti = (info = '')=>{
    const state = useState({
        info,
        noti:null as NotificationType | null
    })
    return {
        ...state
    }
}