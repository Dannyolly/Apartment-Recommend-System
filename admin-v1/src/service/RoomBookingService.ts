import { get } from "@/api/request";
import { RoomBooking, RoomBookingOrder } from "@/types/serviceEntity/Room";

function create(params:{
    userId:number,
    houseId:number,
    requirementDesc:string,
    time:number
}){
    return get<RoomBookingOrder>('/roomBooking/create',params)
}

function visit(id:number){
    return get<RoomBookingOrder>('/roomBooking/visit',{id})
}

function getByUserId(params:{
    id:number,
    page:number,
    pageSize:number
}){
    return get<RoomBookingOrder[]>('/roomBooking/get',params)
}

function getOrder(params:{
    page:number,
    pageSize:number
}){
    return get<RoomBooking[]>('/roomBooking/select',params)
}

function count(){
    return get<number>('/roomBooking/count')
}

function getOrderById(id:number){
    return get<RoomBooking>('/roomBooking/getById',{id})
}

function update(roomBooking:RoomBooking){
    return get<number>('/roomBooking/update',roomBooking)
}

function deleteById(id:number){
    return get<number>('/roomBooking/delete',{id})
}

const RoomBookingService = {
    create,
    visit,
    getByUserId,
    getOrder,
    getOrderById,
    update,
    deleteById,
    count
}

export{
    RoomBookingService
}