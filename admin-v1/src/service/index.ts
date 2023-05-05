import { ClientService } from '@/service/ClientService'
import { PostSerivce } from '@/service/PostService'
import { RentInfoService } from '@/service/RentInfoService'
import { RoomBookingService } from '@/service/RoomBookingService'
import { RoomService } from '@/service/RoomService'
import { UserService } from '@/service/UserSerivce'
import { LeaseOrderService } from '@/service/LeaseService' 
import { ClientOrderService } from '@/service/ClientOrderService'
import { AdminService } from '@/service/AdminService'

class ServiceManager{
    static ClientService = ClientService
    static ClientOrderSerivce = ClientOrderService
    static PostService = PostSerivce
    static RentInfoSerivce = RentInfoService
    static RoomBookingService = RoomBookingService
    static RoomService = RoomService
    static UserService = UserService
    static LeaseOrderService = LeaseOrderService
    static AdminService = AdminService
}
export {
    ServiceManager
}
