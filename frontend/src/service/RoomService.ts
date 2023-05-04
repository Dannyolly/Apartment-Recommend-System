import { baseUrl ,algrithomUrl} from "@/api/config";
import { get,Response } from "@/api/request";
import { Room , FilterOption } from "@/types/serviceEntity/Room";
import { LocalStorageManager } from "@/utils/localStorage";
import { shuffleArray } from '@/utils/array'
import { cloneDeep } from 'lodash'
function getRecommendRoomsByContentBased(houseId:number,page:number = 1):Promise<Response<Room[]>>{
    // let pageSize = 5
    // let maxCount = 30
    // let startNum = (page -1) * pageSize
    // maxCount  = Math.max(maxCount, startNum + pageSize )
    // return new Promise((resolve,rej)=>{
    //     uni.request({
    //         url:`http://${algrithomUrl}/expect/武汉/${houseId}/${maxCount}`,
    //         method:'GET',
    //         success:async ({data,statusCode,header,cookies})=>{
    //             // @ts-ignore
    //             let ids = data.houseIds as unknown as number[]
    //             let start = startNum  
    //             let end = start + pageSize
    //             ids  = ids.slice( start , end )
    //             let idsArr = ids.map(v=>String(v)).join(',')
    //             const rooms = await get<Room[]>('/getRecommendRooms',{ids:idsArr,page:1,pageSize})
    //             resolve(rooms)
    //         },
    //         fail:({errMsg})=>{
    //             rej(errMsg)
    //         }
    //     })
    // })
    return get<Room[]>('/getSimilarRooms',{
        houseId,
        page
    })
}

function getRecommendRoomsByUserBasedCf(page:number = 1):Promise<Response<Room[]>>{
    const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    return new Promise((resolve,rej)=>{
        uni.request({
            url:`http://${algrithomUrl}/expect/room/1/${page}`,
            method:'GET',
            success:async ({data,statusCode,header,cookies})=>{
                // @ts-ignore
                let ids = data.houseIds as unknown as number[]
                let idsArr = ids.map(v=>String(v)).join(',')
                const rooms = await get<Room[]>('/getRecommendRooms',{ids:idsArr,page:1,pageSize:5})
                resolve(rooms)
            },
            fail:({errMsg})=>{
                rej(errMsg)
            }
        })
    })
}


async function getRecommendRooms(houseId:number,contentBasedPage:number,userBasedPage:number ):Promise<Room[]>{
    
    return new Promise(async(resolve,rej)=>{
        
        // // count = 5
        // const CbRoomsP  =  getRecommendRoomsByContentBased(houseId,contentBasedPage)
        // // count = 3
        // const CfRoomsP  =  getRecommendRoomsByUserBasedCf(userBasedPage)
        // 比例 5:3 
        const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
        const hotPage = 1
        const rooms = await get<Room[]>('/getRecommendRooms',{
            userId,
            houseId,
            contentBasedPage,
            userBasedPage,
            hotPage
        })
        const roomsRes = rooms.result
  
        shuffleArray(roomsRes)
        // 打亂順序
        resolve(roomsRes)
       
    })
}

function getRoomsByOption(options:FilterOption,page:number,pageSize:number){

    return get<Room[]>('/getRoomsByOptions',{
        ...options,
        page,
        pageSize
    })
}

function getHotRooms(page:number,pageSize:number){
    return get<Room[]>('/getHotRooms',{page,pageSize})
}

function getRoomsByIds(ids:string){
    return get<Room[]>('/getRoomsByIds',{ids})
}

function getCommunityByKeyWord(community:string){
    return get<string[]>('/getCommunity',{community})
}

function getHotRoomsByOptions(options:FilterOption,page:number,pageSize:number){
    return get<Room[]>('/getHotRoomsByOptions',{
        ...options,
        page,
        pageSize
    })
}

const RoomService = {
    getRoomsByOption:getRoomsByOption,
    getRecommendRooms:getRecommendRooms,
    getHotRooms:getHotRooms,
    getRoomsByIds:getRoomsByIds,
    getRecommendRoomsByUserBasedCf,
    getRecommendRoomsByContentBased,
    getCommunityByKeyWord,
    getHotRoomsByOptions
}

export {
    RoomService
}