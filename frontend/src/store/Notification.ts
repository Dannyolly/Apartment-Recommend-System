import { NotificationReceiver } from "@/utils/Notification";
import { defineStore } from "pinia"
import { ref , getCurrentInstance  ,useAttrs, Ref, computed } from "vue"
interface NotificationStore {
    
     
}
export const useNotificationStore =  defineStore('notification',()=>{

    const notifications = ref<any[]>([])
    const follows =ref<any[]>([]);
    const msgLength=ref<number>(0);
    const isRead = ref(false);
    const unReadNoti = ref<number>(0);
    const unReadFols = ref<number>(0);
    const current = ref(0);

    const setNotifcations = (notis:any[])=>{
        notifications.value = notis;
    }

    const setFollows=(fols:any[])=>{
        follows.value = fols;
    }

    const setIsRead=(state)=>{
        isRead.value = state;
    }
    return {
        follows,
        notifications,
        msgLength,
        isRead,
        unReadFols,
        unReadNoti,
        current,
        setIsRead,
        setNotifcations,
        setFollows
    } 
})



