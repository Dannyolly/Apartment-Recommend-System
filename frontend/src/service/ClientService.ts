import { get, uploadImage } from "@/api/request";
import { Service as CService , ServiceComment,ServiceOrder,ServiceType ,ServiceOrderState} from '@/types/serviceEntity/Service'

function getList(){
    return get<CService[]>('/service/getList')
}

function getById(id:number){
    return get<CService>('/service/getById',{
        id
    })
}

function getComment(params:{
    id:number,
    page:number,
    pageSize:number
}){
    return get<ServiceComment[]>('/service/getComment',params)
}

function commentAction(params:{
    userId: number;
    serviceId: number;
    title: string;
    desc: string;
    pic: string;
    toUserId?:number 
}){
    return get<String>('/service/comment',params)
}
//  order
function getOrders(userId:number){
    return get<ServiceOrder[]>('/service/getOrder',{userId})
}

function serviceCreate(params:{
    userId: number;
    serviceId: number;
    time: number;
    requirementDesc: string;
    state: ServiceOrderState;
    curSer:string,
    curPri:number
}){
    return get<ServiceOrder>('/service/create',params)
}

function servicePay(id:number){
    return get<ServiceOrder>('/service/pay',{id})
}

function serviceFinish(id:number){
    return get<ServiceOrder>('/service/finish',{id})
}



const ClientService = {
    getList,
    getComment,
    commentAction,
    serviceCreate,
    servicePay,
    serviceFinish,
    getById,
    getOrders
}

export {
    ClientService
}