import { get } from '@/api/request'
import { RentInfo , RentOrderInfo, RentState } from '@/types/serviceEntity/Room'

function rentCreate(params:{
    userId:number,
    houseId:number,
    state:RentState,
    tenancy:number,
    payment:number,
    serviceIds:string,
    time:number
}){
    return get<RentInfo>('/rent/create',params)
}

function rentPay(id:number){
    return get<RentInfo>('/rent/pay',{id})
}

function rentCheckIn(id:number){
    return get<RentInfo>('/rent/pay',{id})
}

function getRentInfoById(id:number){
    return get<RentInfo>('/rentInfo/getById',{id})
}

function getRentInfo(params:{
    page:number,
    pageSize:number
}){
    return get<RentInfo[]>('/rentInfo/get',params)
}

function getRentInfoByUserId(params:{
    id:number,
    page:number,
    pageSize:number
}){
    return get<RentInfo[]>('/rent/get',params)
}

function count(){
    return get<number>('/rentInfo/count')
}

function update(params:{
    id:number,
    state:string
}){
    return get<number>('/rentInfo/update',params)
}

function deleteById(id:number){
    return get<number>('/rentInfo/delete',{id})
}

const RentInfoService = {
    rentCreate,
    rentPay,
    rentCheckIn,
    getRentInfo,
    getRentInfoById,
    count,
    getRentInfoByUserId,
    update,
    deleteById
}

export {
    RentInfoService
}



