import { algrithomUrl } from "@/api/config";
import { get, Response } from "@/api/request";
import { UserInfo } from "@/types/serviceEntity/user";
import { LocalStorageManager } from "@/utils/localStorage";

function follow(userId:number,followId:number){
    return get<string>('/user/follow',{
        userId,
        followId
    })
}

function unFollow(userId:number,followId:number){
    return get<string>('/user/unfollow',{
        userId,
        followId
    })
}

function followList(userId:number){
    return get<UserInfo[]>('/user/followList',{userId})
}

function checkFollow(userId:number,followId:number){
    return get<1 | 0>('/user/checkFollow',{userId,followId})
}

function getUserById(userId:number){
    return get<UserInfo>('/user/getById',{userId})
}

function getUsersByIds(ids:string){
    return get<UserInfo[]>('/user/getAll',{ids})
}


function getRecommendUser(userId:number){
    // return new Promise((resolve,rej)=>{
    //     uni.request({
    //         url:`http://${algrithomUrl}/expect/user/1`,
    //         method:'GET',
    //         success:async ({data,statusCode,header,cookies})=>{
    //             // @ts-ignore
    //             let ids = data.userIds as unknown as number[]
    //             let userIds = ids.join(',')
    //             const { result } = await getUsersByIds(userIds);
    //             resolve(result)
    //         },
    //         fail:({errMsg})=>{
    //             rej(errMsg)
    //         }
    //     })
    // })
    return get<UserInfo[]>('/getSimilarUser',{
        userId
    })
}

function login(openId:string){
    return get<UserInfo>('/user/login',{openId})
}
function register(openId:string){
    return get<UserInfo>('/user/register',{openId})
}
const UserService = {
    follow,
    unFollow,
    followList,
    checkFollow,
    getUserById,
    getRecommendUser,
    getUsersByIds,
    login,
    register
}

export {
    UserService
}