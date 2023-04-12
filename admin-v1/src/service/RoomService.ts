import { baseUrl ,algrithomUrl} from "@/api/config";
import { get,Response } from "@/api/request";
import { Room , FilterOption } from "@/types/serviceEntity/Room";
import { cloneDeep } from 'lodash'

function select(params:FilterOption & {
    page:number,
    pageSize:number
}){
    return get<Room[]>('/room/get',params)
}

function selectCount(params:FilterOption){
    return new Promise((resolve,rej)=>{
        select({
            ...params,
            page: 0,
            pageSize: 100000
        }).then(res=>{
            resolve(res.data.length)
        })
    })
}

function count(){
    return get<number>('/room/count')
}
type RoomPartial = Partial<Room>
function add(room:RoomPartial){
    return get<Room>('/room/add',room)
}

function deleteById(id:number){
    return get<number>('/room/delete',{id})
}

function update(room:RoomPartial){
    return get<number>('/room/update',room)
}

const RoomService = {
    select,
    selectCount,
    count,
    add,
    deleteById,
    update
}

export {
    RoomService
}