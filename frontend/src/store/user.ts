import { UserInfo } from "@/types/serviceEntity/user"
import { defineStore } from "pinia"
import { ref , getCurrentInstance  ,useAttrs, Ref } from "vue"

export const useUserStore = defineStore('home', ()=>{
    /**
     * @description userInfo!!!!
     */
    const userInfo = ref<UserInfo>()

    const messager = ref<UserInfo[]>()

    const isOpenDrawer = ref(false);
    /**
     * @des setUserInfo
     * @param info 
     */
    function setUserInfo(info:UserInfo){
        userInfo.value = info
    }

    function setMessager(arr:UserInfo[]){
        messager.value = arr;
    }

    return {
        userInfo,
        messager,
        isOpenDrawer,


        setUserInfo,
        setMessager
    } 
})

