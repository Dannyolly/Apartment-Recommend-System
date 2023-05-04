import { ServiceManager } from "@/service";
import { RoomService } from "@/service/RoomService";
import { Room, RoomVisitHistory } from "@/types/serviceEntity/Room";
import { LocalStorageManager } from "./localStorage";
type RecommendRecord = {
    [key:number]:{
      showed:number,
      max:30
    }
}
const getHistory =  (userId:number) => LocalStorageManager.getLocalStorageInfo('history',userId);
const getUserId = ()=> LocalStorageManager.getLocalStorageInfo('userInfo').id
const getRecommendRecord = (userId:number) => LocalStorageManager.getLocalStorageInfo('recommendRecord',userId);
const getUserBasedPage = (userId:number) => LocalStorageManager.getLocalStorageInfo('userBasedCfPage',userId);
class RecommendRecordHandler{
    
    private recommendRecord:RecommendRecord = {}
    private history:RoomVisitHistory[] = []
    private userId = -1
    private userBasedCfPage = 0
    private debugMode = true
    private isNewUser = false
    constructor(  debugMode = true){
        this.debugMode = debugMode
    }

    printInfo(){
        if(!this.debugMode) return
            console.log(
                this.history,
                this.recommendRecord,
                this.userBasedCfPage
            )
        
    }

    setupRecord(){
        const userId = getUserId()
        const historyT = getHistory(userId) ?? []
        const userBasedCfPage = getUserBasedPage(userId) ?? 1
        let recommendRecord = getRecommendRecord(userId) ?? {} as RecommendRecord
        // 新用戶
        if(historyT.length === 0){
            this.isNewUser = true
            return;
        }

        // 處理一下歷史記錄
        if(!historyT) return
        historyT.forEach(v=>{
            if(!recommendRecord[v.roomId]){
                recommendRecord[v.roomId] = {
                    showed:0,
                    max:30
                }
            }
        })
        // 賦值
        this.userId = userId
        this.history  = historyT 
        this.recommendRecord = recommendRecord
        this.userBasedCfPage = userBasedCfPage
        this.printInfo()
    }

    async recommend(){
        let houseId = 0
        let start = 0
        let end  = 30
        let pageSize = 5
        const userId = this.userId
        // 是否新用戶 
        if(this.isNewUser){
            //RoomService.getRoomsByOption()
            return []
        }

        //  獲取houseId
        for (let i = 0; i < this.history.length; i++) {
            const el = this.history[i];
            let roomId = el.roomId
            if( this.recommendRecord[roomId].showed + pageSize <= end ){
                houseId = roomId;
                start = this.recommendRecord[roomId].showed
                console.log(start);
                
                break
            }else{
                continue
            }
        }
        // contentbased 的當前頁數..
        let contentBasedPage = start === 0 ? 1 : start/5 + 1
        let userBasedCfPage = this.userBasedCfPage 
        // content-based
        const result = ServiceManager.RoomService.getRecommendRooms(houseId,contentBasedPage,userBasedCfPage)
        // 下一頁
        this.userBasedCfPage++
        this.recommendRecord[houseId].showed +=5
        LocalStorageManager.setLocalStorageInfo('recommendRecord',{recommendRecord:this.recommendRecord},userId)
        LocalStorageManager.setLocalStorageInfo('userBasedCfPage',{userBasedCfPage},userId)
        return result
    }


    resetRecommendRecord(){
        const userId = getUserId()
        const historyT = getHistory(userId)
        let userBasedCfPage = 1
        let recommendRecord = getRecommendRecord(userId) ?? {} as RecommendRecord
        if(!historyT) return

        historyT.forEach(v=>{
            recommendRecord[v.roomId] = {
                showed:0,
                max:30
            }
        })
        LocalStorageManager.setLocalStorageInfo('recommendRecord',{recommendRecord},userId)
        LocalStorageManager.setLocalStorageInfo('userBasedCfPage',{userBasedCfPage},userId)
        this.setupRecord()
    }
}
export {
    RecommendRecord,
    RecommendRecordHandler
}