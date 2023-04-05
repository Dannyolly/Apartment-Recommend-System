import { get } from "@/api/request";
import { LeaseOrder } from "@/types/serviceEntity/lease"

function list(userId:number){
    return get<LeaseOrder[]>('/lease/list',{
        userId
    })
}

function create(params:{
    location:string,
    userId:number,
    appointmentTime:number,
    houseType:string
}){
    return get<LeaseOrder>('/lease/create',{
        ...params
    })
}


const LeaseOrderService = {
    list,
    create
}

export {
    LeaseOrderService
}