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

const RoomBookingService = {
    create,
    visit,
    getByUserId
}

export{
    RoomBookingService
}