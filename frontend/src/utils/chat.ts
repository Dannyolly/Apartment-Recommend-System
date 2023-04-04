import { FormatChatMsg } from "@/types/chat";
import { LocalStorageManager } from "./localStorage";

export class ChatHelper{

    // for chatlist ,not friendlist
    static setChatIds(friendIds:string[]) {
        LocalStorageManager.setLocalStorageInfo('friendIds',{
            friendIds
        })
    }

    static setMsgsToLocal(ids:string[],msgs:FormatChatMsg[][]){
        for(let i=0;i<ids.length;i++){
            LocalStorageManager.setLocalStorageInfo('chatMsg',{
                chatMsg:msgs[i]
            },ids[i])
        }
    }

    static getChatIds(){
        const userid = LocalStorageManager.getLocalStorageInfo('userInfo').id
        return LocalStorageManager.getLocalStorageInfo('friendIds',userid.toString());
    }

    static getChatById(id:string){
        const userid = LocalStorageManager.getLocalStorageInfo('userInfo').id
        return LocalStorageManager.getLocalStorageInfo('chatMsg',id,userid)
    }

    static getAllFirstMsgFromLocal(){
        const ids = this.getChatIds();
        const userid = LocalStorageManager.getLocalStorageInfo('userInfo').id
        if(ids){
            let msgMap = [] as FormatChatMsg[]
            for (const id of ids) {
                let tmp = LocalStorageManager.getLocalStorageInfo('chatMsg',id,userid)
                tmp && msgMap.push(tmp[0]);
            }
            return {
                msgMap,
                ids
            }
        }
        return null
    }


    static removeChatById(id:number){
        const chatIds = this.getChatIds()
        const idS = id.toString()
        const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
        if(chatIds){
            this.setChatIds( chatIds.filter(v=>v===idS) )
            LocalStorageManager.removeLocalStorageInfo('chatMsg',id,userId)
        }
    }

    static removeChatListItemById(id:number){
        const idS = id.toString();
        const chatIds = this.getChatIds() ?? []
        this.setChatIds( chatIds.filter(v=>v===idS) )
    }

    
    
}


