import { useNotificationStore } from "@/store/Notification";
import { InformType, Message } from "@/types/Notification";
import { UserInfo } from "@/types/serviceEntity/user";
import { LocalStorageManager } from "@/utils/localStorage";

const base =  'ws://127.0.0.1:2346'
const url =  'ws://dws.free.svipss.top'

uni.onSocketOpen((res)=>{
    console.log('WebSocket连接已打开！');
    
})
uni.onSocketError((res)=>{
    console.log('WebSocket连接打开失败，请检查！');
})
uni.onSocketMessage(({data})=>{
    console.log(`收到新的message:${data}`);
})


class MyWebsocket{
    static sendMessageToServer(data:Message<any>){
        let jsonStr = JSON.stringify(data)
        console.log(jsonStr);
        return new Promise((res,rej)=>{
            uni.sendSocketMessage({
                data:jsonStr,
                success:({errMsg})=>{
                    console.log(`send! : ${errMsg}`);
                    res(errMsg)
                },
                fail:({errMsg})=>{
                    console.log(errMsg);
                    rej(errMsg)
                }
            })
        })
        
    }
    static connect():Promise<string>{
        return new Promise((res,rej)=>{
            uni.connectSocket({
                url,
                success:()=>{
                    res('sucessfully connected')
                },
                fail:()=>{
                    res('failed to connect')
                }
            })
        })
    }
    static close():Promise<string>{
        return new Promise((res,rej)=>{
            uni.closeSocket({
                success:()=>{
                    res('sucessfully closed')
                },
                fail:()=>{
                    res('failed to close')
                }
            })
        })
        
    }
}


export {
    MyWebsocket
}

