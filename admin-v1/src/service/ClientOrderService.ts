import { get} from "@/api/request";
import { SerivceOrderOption, Service, ServiceOrder } from "@/types/serviceEntity/Service";

function select(params:SerivceOrderOption &{
    page:number,
    pageSize:number
}){
    return get<ServiceOrder[]>('/serviceOrder/get',params)
}

function count(params?:SerivceOrderOption){
  return get<number>('/serviceOrder/count',params)
}

function update(params:Partial<ServiceOrder>){
  return get<number>('/serviceOrder/update',params)
}

function deleteById(id:number){
  return get<number>('/serviceOrder/delete',{id})
}

function add(params:ServiceOrder){
  return get<ServiceOrder>('/serviceOrder/add',params)
}

const ClientOrderService = {
    select,
    count,
    update,
    deleteById,
    add
}

export {
    ClientOrderService
}