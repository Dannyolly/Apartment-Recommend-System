import { useState } from "@/hooks/useState";
import { ServiceManager } from "@/service";
import { Room } from "@/types/serviceEntity/Room";
import { LocalStorageManager } from "@/utils/localStorage";
import { toCorrectForm } from "@/utils/room";
import { isDate } from "@vue/shared";
import { defineStore } from "pinia";
import { onMounted } from "vue";

// 看房單
export const useHouseAppointmentStore = defineStore('houseAppointment', ()=>{
    const state = useState({
        ids:[] as number[],
        dataList:[] as Room[]
    })
    function setState(key:'ids' | 'dataList',val:number[] | Room[]){
        state[key].value = val
    }
    /**
     * 
     * @param choseArr 0 是沒選 1是選 選則移除
     */
    function remove(choseArr:number[]){
        const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
        state.ids.value =  state.ids.value.filter((v,i)=>choseArr[i] !== 1)
        state.dataList.value =  state.dataList.value.filter((v,i)=> choseArr[i] !== 1)    
        LocalStorageManager.setLocalStorageInfo('roomVisitIds',{
            roomVisitIds:state.ids.value
        },userId)
    }
    function add(room:Room,sucCb:()=>void,errCb:()=>void){
        const { ids, dataList } = state
        const id = LocalStorageManager.getLocalStorageInfo('userInfo').id;
        const curRoomId = room.id
        const roomVisitIds = ids.value
        if( roomVisitIds.findIndex(v=>v===curRoomId) !== -1 ){
            errCb()
            return
        }
        dataList.value.unshift(room)
        ids.value.unshift(room.id)
        LocalStorageManager.setLocalStorageInfo('roomVisitIds',{
            roomVisitIds:ids.value
        },id)
        sucCb()
        
    }
    function isExist(roomId:number){
        //console.log(state.ids.value,roomId,state.ids.value.findIndex(v=>v === roomId) !== -1);
        
        return state.ids.value.findIndex(v=>v === roomId) !== -1
    }
    async function setup(){
        const id = LocalStorageManager.getLocalStorageInfo('userInfo').id
        const roomVisitIds = LocalStorageManager.getLocalStorageInfo('roomVisitIds',id) ?? []
        if(roomVisitIds.length === 0){
            console.log('no ids'); 
            return;
        }
        state.ids.value = roomVisitIds;
        let data = (await ServiceManager.RoomService.getRoomsByIds(roomVisitIds.join(','))).result
        state.dataList.value =  data.map(v=>{
            toCorrectForm(v)
            return v
        })
        console.log('loaded appointment room',state.dataList.value);
    }

    return {
        setState,
        setup,
        remove,
        add,
        isExist,
        ...state,
        
    } 
})
