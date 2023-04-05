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

function getRentInfo(params:{
    id:number,
    page:number,
    pageSize:number
}){
    return get<RentOrderInfo[]>('/rent/get',params)
}
const RentInfoService = {
    rentCreate,
    rentPay,
    rentCheckIn,
    getRentInfo
}

export {
    RentInfoService
}



