import { getAllRequest } from "@/service/AddRequest";
import { getAllNotification } from "@/service/Notification";
import { getUserById } from "@/service/user";
import { PostNotification } from "@/types/Notification";
import { LocalStorageManager } from "./localStorage";

class NotificationReceiver{

    map:Map<string,PostNotification[]>;

    length:number;

    constructor(){
        this.map = new Map();
        this.length = 0;
    }

    async collectNotification(lastId: any){
        const { data } = await getAllNotification(LocalStorageManager.getLocalStorageInfo('userInfo')?.id,lastId);
        const notis = data.data as unknown as any[];
        this.length += notis.length
        this.map.set('notification',notis);
        
    }

    async collectFollow(){
        const { data } = await getAllRequest(LocalStorageManager.getLocalStorageInfo('userInfo')?.id);
        const requests:any[]  = data.data as unknown as any[];
        this.length += requests.length;
        this.map.set('follow',requests);
    }

    getFollows():PostNotification[] {
        let tmp= this.map.get('follow');
        return tmp?tmp:[]
    }

    getNotification():PostNotification[]{
        let tmp= this.map.get('notification');
        return tmp?tmp:[]
    }
}

export {
    NotificationReceiver
}