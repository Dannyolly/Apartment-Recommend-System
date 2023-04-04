<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import { useState } from '@/hooks/useState';
import SwiperList from '@/components/public/SwiperList.vue';
import House from '@/components/FilterBar/House.vue';
import HousePost from '@/components/House/HousePost.vue';
import HousingService from '@/components/HouseService/HousingService.vue';
import { getDimension } from '@/utils/Equipment';
import AppointmentHistory from '@/components/Appointment/AppointmentHistory.vue';
import { ServiceManager } from '@/service';
import { LocalStorageManager } from '@/utils/localStorage';
import { RoomBookingOrder, RoomBookingState } from '@/types/serviceEntity/Room';
import { DataList } from '@/types/Entity/DataList';
import NoMore from '@/components/public/NoMore.vue';
const { dataList, isLoad } = useState({
    dataList:[
        {
            title:'预约看房',
            data:[]
        },
        {
            title:'已看过房',
            data:[]
        }
    ] as Array<DataList<RoomBookingOrder>>,
    isLoad:false
})
const height = getDimension().height
const goDetail = (order:RoomBookingOrder)=>uni.navigateTo({
    url:'/pages/appointment/appointmentDetail?orderInfo='+encodeURIComponent(JSON.stringify(order))
})
function classify(orders:RoomBookingOrder[]){
    orders.forEach((v,i)=>{
        if(Number(v.state) === RoomBookingState.BOOKED){
            dataList.value[0].data.push(v)
        }else{
            dataList.value[1].data.push(v)
        }
    })
    //console.log(dataList.value);
    isLoad.value = true
}
onMounted(async ()=>{
    const id = LocalStorageManager.getLocalStorageInfo('userInfo').id
    const { result } = await ServiceManager.RoomBookingService.getByUserId({id,page:0,pageSize:1000})
    for (let i = 0; i < result.length; i++) {
        const el = result[i]
        el.room = (await ServiceManager.RoomService.getRoomsByIds(`${el.houseId}`)).result[0]
        el.room.correctPic = el.room.pic.split(',').map(v=>v.slice(2,v.length-1))
        //console.log(el.room.correctPic);
        
    }   
    classify(result)
    
    
})
</script>
<template>
  <div :style="{ height : height + 'px'}" class='container'>
    <SwiperList :offsetTop="0" :flex="true" bgColor="#FFF" :dataList="dataList" v-slot="{ data , title }" >
        <div v-if="isLoad && data.length!==0" >
            <div v-for="order in data"  class="outer-container">
                <AppointmentHistory :info="order.room" :clickCb="()=>goDetail(order)" />
            </div>
        </div>
        <div v-else>
            <NoMore/>
        </div>
    </SwiperList>
  </div>
</template>

<style lang='less' scoped>
.container{
    width: 100%;
    background-color: rgb(247,247,247);
    .outer-container{
        padding-right: 10px;
    }
}
</style>