import { get, Response} from "@/api/request";
import { Service } from "@/types/serviceEntity/Service";
function select(params:{
    page:number,
    pageSize:number
}){
    return get<Service[]>('/service/get',params)
}

function selectById(id:number){
    return get<Service>('/service/getServiceById',{id})
}

function update(params:Partial<Service>){
    return get<number>('/service/update',params)
}

function deleteById(id:number){
    return get<number>('/service/delete',{id})
}

function add(service:Partial<Service>){
    return get<Service>('/service/add',service)
}

const ClientService = {
    select,
    selectById,
    add,
    deleteById,
    update
}

export {
    ClientService
}