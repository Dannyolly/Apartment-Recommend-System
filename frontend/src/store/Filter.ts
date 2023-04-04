import { useState } from "@/hooks/useState"
import { ChatMsg, FormatChatMsg } from "@/types/chat"
import { UserInfo } from "@/types/serviceEntity/user"
import { defineStore } from "pinia"
import { ref , getCurrentInstance  ,useAttrs, Ref, unref } from "vue"

export const useFilterStore = defineStore('filter', ()=>{
    const { filterSetting , cache } = useState({
        filterSetting:[] as any[],
        cache:[] as any[]
    })
    let submitCallback:any,resetCallback:any
    const submit = (index:number,choice:any,cacheT:any) =>{
        const res = choice
        filterSetting.value[index] = res
        cache.value[index] = cacheT
        if(submitCallback){
            submitCallback()
        }
    }
    
    const reset = (index:number)=>{
        filterSetting.value[index] = undefined
        cache.value[index] = undefined
    }

    const getCache = (index:number)=>{
        if(cache.value[index] ){
            return cache.value[index]
        }
    }
    const setSubmitCb=(method:()=>void)=>{
        submitCallback = method
    }
    const setResetCb=(method:()=>void)=>{
        resetCallback = method
    }

    return {
        filterSetting,
        cache,
        submit,
        reset,
        getCache,
        setSubmitCb,
        setResetCb
    }
})

