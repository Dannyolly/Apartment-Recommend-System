interface LeaseOrder {
  id: number;
  userId: number;
  location: string;
  houseType: string;
  createTime: string;
  appointmentTime: string;
  checkTime: string;
  history: string;
  state: 1 | 2
}

interface LeaseOrderOption{
  id?:number,
  userId?:number
}

export {
    LeaseOrder,
    LeaseOrderOption
}