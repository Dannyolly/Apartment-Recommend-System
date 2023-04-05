import { ClientService } from '@/service/ClientService'
import { PostSerivce } from '@/service/PostService'
import { RentInfoService } from '@/service/RentInfoService'
import { RoomBookingService } from '@/service/RoomBookingService'
import { RoomService } from '@/service/RoomService'
import { UserService } from '@/service/UserSerivce'
import { LeaseOrderService } from '@/service/LeaseService' 
class ServiceManager{
    static ClientService = ClientService
    static PostService = PostSerivce
    static RentInfoSerivce = RentInfoService
    static RoomBookingService = RoomBookingService
    static RoomService = RoomService
    static UserService = UserService
    static LeaseOrderService = LeaseOrderService
}
export {
    ServiceManager
}
