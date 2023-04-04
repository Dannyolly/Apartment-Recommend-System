
import { Perference, UserInfo} from "@/types/serviceEntity/user";
import { PostNotification } from '@/types/Notification';
import { CollectPost} from '@/types/serviceEntity/post';

import { ChatMsg, FormatChatMsg } from '@/types/chat';
import { isArray } from "@vue/shared";
import { Room, RoomVisitHistory } from "@/types/serviceEntity/Room";
import { RecommendRecord } from '@/utils/RecommendRecordHandler'
type Key =  'userInfo' | 'history' | 'like' |
            'roomCollectionIds' | 'roomVisitIds' |
            'postCollectionIds' | 'recommendRecord' |
            'userBasedCfPage'   | 'perference'
type Like = {
    [key:string]:1 | 0
}

type KeyOptions={
    userInfo?:UserInfo,
    history?:RoomVisitHistory[],
    /** postLike */
    likeIds?:Like,
    roomCollectionIds?:number[]
    /** 看房單*/
    roomVisitIds?:number[]
    /** 推薦記錄 */
    recommendRecord?:RecommendRecord,
    /** userbasedcf page */
    userBasedCfPage?:number,
    /** 偏好 */
    perference?:Perference
}
// ---------------------------------------get------------------------------------
//function getLocalStorageInfo<T extends 'account'>(key:T):UserInfo[] | null
// function getLocalStorageInfo<T extends 'notis-maxId'>(key:T,userid:string):string
// function getLocalStorageInfo<T extends 'friendIds'>(key:T,userid:string):string[] | null;
// function getLocalStorageInfo<T extends 'notis' | 'follows'>(key:T,userid:string):PostNotification[] | null;
// function getLocalStorageInfo<T extends 'collect'>(key:T,userid:string):CollectPost[] | null;
// function getLocalStorageInfo<T extends 'friendList'>(key:T,userid:number):UserInfo[] | null

// function getLocalStorageInfo<T extends 'chatMsg'>(key:T,id:string,userid:number):FormatChatMsg[] | null;
function getLocalStorageInfo<T extends 'perference'>(key:T,userId:number):Perference 
function getLocalStorageInfo<T extends 'userInfo'>(key:T):UserInfo
function getLocalStorageInfo<T extends 'history'>(key:T,userId:number):RoomVisitHistory[] | null
function getLocalStorageInfo<T extends 'Like'>(key:T,userId:number):Like | null
function getLocalStorageInfo<T extends 'roomCollectionIds'>(key:T,userId:number):number[] | null
function getLocalStorageInfo<T extends 'roomVisitIds'>(key:T,userId:number):number[] | null
function getLocalStorageInfo<T extends 'recommendRecord'>(key:T,userId:number):RecommendRecord | null
function getLocalStorageInfo<T extends 'userBasedCfPage'>(key:T,userId:number):number | null
function getLocalStorageInfo(key:Key,userId?:number){
    let itemKey = userId? key+':'+userId:key;
    const item = uni.getStorageSync(itemKey)
    if(item){
        return item
    }else {
        // error ...
        return null
    }
}
// ------------------------------------handle------------------------------------
type DicKey = 'notis-maxId' | 'notis' | ' follows' | 'collect' 
/**
 * 
 * @param key 
 * @param value 
 * @param id 
 * @param userId 
 * @param order true -- will sort your data By Desc
 */
// function handleDicById(key:Key , value:Array<any>,id:number,userId:number,order?:boolean){
//     // 貼子 --- 
//     // 不唯一值 .... 
//     let priKey = `${key}:${id}:${userId}`
//     // @ts-ignore
//     let res = getLocalStorageInfo(key,value,id)
//     if(res){
        
//         order? res = [ ...res , ... value] : res = [...value, ...res]
//         uni.setStorageSync(priKey,JSON.stringify(res))
//     }else{
//         uni.setStorageSync(priKey,JSON.stringify( value))
//     }
// }
/**
 * 
 * @param key 
 * @param value 
 * @param userId 
 * @param order  true -- will sort your data By Desc  
 */
function handleUnique(key:Key, value:object | Array<any>,userId:number,order?:boolean){
    let priKey = `${key}:${userId}`
    uni.setStorageSync(priKey,value)
}

function baseHandle(key:Key,value:any){
    // 唯一值...
    uni.setStorageSync(key,value);
    console.log('OK');
    
}

// ---------------------------------------set------------------------------------
function setLocalStorageInfo<T extends 'perference'>(key:T,keyOptions:KeyOptions,userId?:number):void
function setLocalStorageInfo<T extends 'roomVisitIds'>(key:T,keyOptions:KeyOptions,userId?:number):void
function setLocalStorageInfo<T extends 'roomCollectionIds'>(key:T,keyOptions:KeyOptions,userId?:number):void
function setLocalStorageInfo<T extends 'Like'>(key:T,keyOptions:KeyOptions,userId?:number):void
function setLocalStorageInfo<T extends 'history'>(key:T,keyOptions:KeyOptions,userId?:number):void
function setLocalStorageInfo<T extends 'userInfo'>(key:T,keyOptions:KeyOptions,userId?:number):void
function setLocalStorageInfo<T extends 'recommendRecord'>(key:T,keyOptions:KeyOptions,userId?:number):void
function setLocalStorageInfo<T extends 'userBasedCfPage'>(key:T,keyOptions:KeyOptions,userId?:number):void
function setLocalStorageInfo(key:Key,keyOptions:KeyOptions,userId?:number,id?:number){
    const {
        userInfo,
        history,
        likeIds,
        roomCollectionIds,
        roomVisitIds,
        recommendRecord,
        userBasedCfPage,
        perference
    } = keyOptions
    const uniqueVal = [
        history,likeIds,roomCollectionIds,
        roomVisitIds,recommendRecord,userBasedCfPage,
        perference
    ].find(v=>v!==undefined)
    
    if(userInfo){
        baseHandle(key,userInfo)
        return
    }
    if(uniqueVal ){
       // @ts-ignore
       handleUnique(key,uniqueVal ,userId) 
       return
    }
    
}

function removeLocalStorageInfo(key:Key,userId?:number){
    
    uni.removeStorageSync(`${key}:${userId}`) 
    
    
}

// type PrimaryKey = 'noti' | 'like' | 'collect' | 'fol'
// function setPrimaryKey(key:PrimaryKey  ,id:number,value?:any){
//     const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
//     uni.setStorageSync(`${key}:${id}:${userId}`,value || ' ');
// }

// function getPrimaryKey(key:PrimaryKey,id:number):string | any{
//     const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
//     return uni.getStorageSync(`${key}:${id}:${userId}`);
// }

// function removePrimaryKey(key:PrimaryKey,id:number){
//     const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
//     localStorage.removeItem(`${key}:${id}:${userId}`)
// }


class LocalStorageManager{
    static getLocalStorageInfo = getLocalStorageInfo
    static setLocalStorageInfo = setLocalStorageInfo
    static removeLocalStorageInfo = removeLocalStorageInfo
    
}

export{
    LocalStorageManager
}


