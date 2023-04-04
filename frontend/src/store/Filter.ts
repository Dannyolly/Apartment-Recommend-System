import { useState } from "@/hooks/useState"
import { ChatMsg, FormatChatMsg } from "@/types/chat"
import { UserInfo } from "@/types/serviceEntity/user"
import { filter } from "lodash"
import { defineStore } from "pinia"
import { ref , getCurrentInstance  ,useAttrs, Ref, unref } from "vue"

export const useFilterStore = defineStore('filter', ()=>{
    const { filterSetting , cache } = useState({
        filterSetting:[] as any[],
        cache:[] as any[]
    })
    let submitCallback:any,resetCallback:any
    const submit = (index:number,choice:any,cacheT:any) =>{
        if(cacheT !== -1){
            const res = choice
            filterSetting.value[index] = res
            cache.value[index] = cacheT
        }
        if(submitCallback){
            submitCallback()
        }
    }
    
    const reset = (index:number)=>{
        delete filterSetting.value[index]
        delete cache.value[index] 
        console.log('reset',filterSetting.value);
        
    }

    const getCache = (index:number)=>{
        if(cache.value[index] !==undefined ){
            return cache.value[index]
        }
        return undefined
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

