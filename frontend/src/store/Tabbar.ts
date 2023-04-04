import { useState } from "@/hooks/useState"
import { UserInfo } from "@/types/serviceEntity/user"
import { defineStore } from "pinia"
import { ref , getCurrentInstance  ,useAttrs, Ref } from "vue"

export const useTabbarStore = defineStore('home', ()=>{
    const state = useState({
        currentTabIndex:0,
        isTenant:true
    })
    return {
        ...state
    }
})

