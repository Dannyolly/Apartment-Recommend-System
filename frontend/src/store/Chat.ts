import { useState } from "@/hooks/useState"
import { ChatMsg, FormatChatMsg } from "@/types/chat"
import { UserInfo } from "@/types/serviceEntity/user"
import { defineStore } from "pinia"
import { ref , getCurrentInstance  ,useAttrs, Ref } from "vue"
interface ChatStore {
 
}


export const useChatStore = defineStore('chat', ()=>{
    const { chatList, unreadMsg ,ids,isLoad } = useState({
        ids:[] as string[],
        chatList:[] as FormatChatMsg[] ,
        unreadMsg:[] as FormatChatMsg[][] ,
        isLoad:false
    })

    function setIds(idsT:string[]){
        ids.value = idsT
    }

    function setChatList(chatListT:FormatChatMsg[]){
        chatList.value = chatListT
    }
    function setUnreadMsg(unnreadMsgT:FormatChatMsg[][]){
        unreadMsg.value = unnreadMsgT
    }
    function setIsLoad(state){
        isLoad.value = state;
    }

    return {
        chatList,
        unreadMsg,
        ids,
        isLoad,
        setIds,
        setChatList,
        setUnreadMsg,
        setIsLoad
    } 
})

