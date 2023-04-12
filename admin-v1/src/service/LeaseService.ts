import { get } from "@/api/request";
import { LeaseOrder ,LeaseOrderOption } from "@/types/serviceEntity/lease"
import { Page } from "@/types/serviceEntity/page";

function select(params:Page & LeaseOrderOption){
    return get<LeaseOrder[]>('/leaseOrder/get',params)
}

function count(params:Page & LeaseOrderOption){
    return get<number>('/leaseOrder/count',params)
}

function deleteById(id:number){
    return get<number>('/leaseOrder/delete',{id})
}

const LeaseOrderService = {
    select,
    count,
    deleteById
}

export {
    LeaseOrderService
}