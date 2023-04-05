interface Room {
  id: number;
  url: string;
  title: string;
  city: string;
  district: string;
  road: string;
  community: string;
  uptime: string;
  savetime: string;
  price: string;
  rentalmethod: string;
  housetype: string;
  roomtype: string;
  areasize: string;
  decoratetype: string;
  ori: string;
  renttimeinfo: string;
  floorinfo: string;
  hasrefrigerator: number;
  haswashingmachine: number;
  hasbalcony: number;
  hascook: number;
  hasairconditioner: number;
  haswaterheater: number;
  hasbed: number;
  haswardrobe: number;
  hassofa: number;
  haswifi: number;
  bedroomnum: string;
  bathroomnum: string;
  hallsnum: string;
  pic: string;
  traffic: string;
  description: string;
  pageViews: number;
  correctPic?:string[]
}

enum RoomBookingState{
  BOOKED = 1,
  FINISH 
}
const RoomBookingStateMap = {
  [RoomBookingState.BOOKED]:'已预约',
  [RoomBookingState.FINISH]:'已完成'
}

interface RoomBooking {
  id: number;
  userId: number;
  houseId: number;
  appointmentTime:string,
  createTime: string;
  visitTime: string;
  requirementDesc: string;
  history: string;
  state:RoomBookingState
}
interface RoomBookingOrder extends RoomBooking {
  room:Room
}
enum RentState {
    PAYING =1,
    PAID,
    CHECKIN,
    DONE
}
const RentStateMap = {
  [RentState.PAID]:{
    title:'待入住',
    subtitle:'待入住'
  },
  [RentState.CHECKIN]:{
    title:'已入住',
    subtitle:'已入款'
  },
  [RentState.DONE]:{
    title:'已完成',
    subtitle:'已完成'
  },
}
interface RentInfo {
  id: number;
  userId: number;
  houseId: number;
  state: RentState;
  createTime: string;
  payTime?: string;
  signTime?: string;
  checkinTime?: string;
  admin: string;
  payment: number;
  // 租期(月为单位)
  tenancy: number;
  history: string;
  serviceIds:string
}

interface RentOrderInfo extends RentInfo{
  room:Room
}

interface FilterOption {
  district?: string;
  traffic?: string;
  community?: string;
  road?:string,
  ori?: string;
  lowestPrice?:number,
  highestPrice?:number,
  lowestAreaSize?: number;
  highestAreaSize?: number;
  floorInfo?: string;
  orderBy?:  'price' | 'areaSize';
  sort?:'desc' | 'asc'
}

interface RoomVisitHistory{
  date:Date,
  roomId:number
}
export {
    Room,
    RoomBooking,
    RentInfo,
    RentState,
    FilterOption,
    RentStateMap,
    RentOrderInfo,
    RoomBookingOrder,
    RoomBookingState,
    RoomBookingStateMap,
    RoomVisitHistory
}
