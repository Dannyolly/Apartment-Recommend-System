import { Ref } from "vue"
import { useState } from "./useState"


type PlusRes = [
    count:Ref<number>,
    setCount:()=>void,
    isClick:Ref<boolean>
]
/**
 * @target like comment collect.....
 * @param count 
 * @returns 
 */
export const usePlus = (count:number,actionCb?:()=>void):PlusRes=>{
    const { likeCount ,isLike } = useState({
        likeCount:count,
        isLike:false
    })    
    const likeAction = ()=>{
        if(isLike.value){
            likeCount.value--
        }else{
            likeCount.value++
        }
        isLike.value = !isLike.value
        actionCb ? actionCb() : ''
    } 
    return [
        likeCount,
        likeAction,
        isLike
    ]
}



export const useCollect = (state?:boolean,cb?:()=>void)=>{
    const { isCollect } = useState({
        isCollect:state ?? false
    })
    const setIsCollect = (state?:boolean,onlySet?:boolean)=>{
        
        if(state !== undefined){
            isCollect.value = state
        }
        if(state === undefined){
            isCollect.value = !isCollect.value
        }
        if(!onlySet){
            cb && cb()
        }
    }
    
    return {
        isCollect,
        setIsCollect
    }
}