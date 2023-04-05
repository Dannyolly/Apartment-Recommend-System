enum ServiceType {
    HOUSECLEANING = 1,
    REPAIR,
    MOVING
}

const ServiceTypeMap = {
  [ServiceType.HOUSECLEANING]:'居家清洁',
  [ServiceType.REPAIR]:'清洗维修',
  [ServiceType.MOVING]:'搬家项目'
}

interface Service {
  id: number;
  title: string;
  subtitle: string;
  specification: string;
  price: string;
  tags: string;
  type: ServiceType;
  sales: number;
  imgs:string,
  detailImg:string,
  correctImgs:string[],
  // 提交訂單時用到 -- curSer curPri 臨時變量
  curSer?:string,
  curPri?:number
}

interface ServiceComment {
  id: number;
  userId: number;
  serviceId: number;
  title: string;
  desc: string;
  date: string;
  pic: string;
  like: number;
  toUserId: number;
}

enum ServiceOrderState{
    PAYING = 1,
    WAITSERVE,
    DONE
}

const ServiceOrderStateMap = {
  [ServiceOrderState.PAYING]:{
    title:'待付款',
    subtitle:'待付款'
  },
  [ServiceOrderState.WAITSERVE]:{
    title:'待服務',
    subtitle:'待服務'
  },
  [ServiceOrderState.DONE]:{
    title:'已完成',
    subtitle:'已完成'
  },
}

interface ServiceOrder {
  id: number;
  userId: number;
  serviceId: number;
  createTime: string;
  payTime: string;
  bookingTime: string;
  serviceTime: string;
  requirementDesc: string;
  state: ServiceOrderState;
  history: string;
  service:Service;
  curSer:string,
  curPri:number
}

export {
    ServiceType,
    Service,
    ServiceComment,
    ServiceOrder,
    ServiceOrderState,
    ServiceOrderStateMap,
    ServiceTypeMap
}