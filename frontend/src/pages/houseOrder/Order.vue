<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, nextTick, onUpdated} from 'vue';
import {useState} from '@/hooks/useState';
import SwiperList from '@/components/public/SwiperList.vue';
import House from '@/components/Appointment/AppointmentHistory.vue';
import OrderService from '@/components/Appointment/AppointmentHistory.vue'
import { getDimension } from '@/utils/Equipment';
import { ServiceManager } from '@/service';
import { LocalStorageManager } from '@/utils/localStorage';
import { RentInfo, RentOrderInfo, RentState, RentStateMap, Room } from '@/types/serviceEntity/Room';
import { DataList } from '@/types/Entity/DataList';
import NoMore from '@/components/public/NoMore.vue'
interface OrderProps {
  props?:any
}
const swiperList = ref<InstanceType<typeof SwiperList>>()
const {} = defineProps<OrderProps>()
const { dataList ,isLoad } = useState({
    dataList:[
        {
            title:'全部',
            data:[]
        },
        {
            title:'待付款',
            data:[]
        },
        {
            title:'待入住',
            data:[]
        },
        {
            title:'已完成',
            data:[]
        }
    ] as Array<DataList<RentOrderInfo>>,
    isLoad:false
})
const height = getDimension().height
const goDetail = (col,row)=>uni.navigateTo({
    url:'/pages/houseOrder/orderDetail?orderInfo='+encodeURIComponent(JSON.stringify(dataList.value[col].data[row]))
})
function classify(result:RentOrderInfo[]){
    dataList.value[0].data = result
    result.forEach(v=>{
        switch(v.state){
            case RentState.PAYING : 
                dataList.value[1].data.push(v)
                break;
            case RentState.PAID :
                dataList.value[2].data.push(v)
                break;
            case RentState.CHECKIN :
                dataList.value[3].data.push(v)
        }
    })
    //swiperList.value?.setSwiperHeight()
    setTimeout(()=>{
        isLoad.value = true   
    },0)
}
onUpdated(()=>{
    swiperList.value?.setSwiperHeight()
})
onMounted(async ()=>{
    const id = LocalStorageManager.getLocalStorageInfo('userInfo').id
    const { result } = await ServiceManager.RentInfoSerivce.getRentInfo({
        id,
        page:0,
        pageSize:1000
    })
    for (let i = 0; i < result.length; i++) {
        const element = result[i];
        const houseId = element.houseId
        element.room =  (await ServiceManager.RoomService.getRoomsByIds(`${houseId}`)).result[0]
        element.room.correctPic = element.room.pic.split(',').map(v=>v.slice(2,v.length-2))
    }
    classify(result)
})
</script>
<template>
  <div :style="{ height : height + 'px'}" class='container'>
    <SwiperList ref="swiperList" :offsetTop="0" :flex="true" bgColor="rgb(247,247,247)" :dataList="dataList" v-slot="{ data , title,index }" >
        <div v-if="!isLoad" >loading</div>
        <div v-if="isLoad && data.length!==0">
            <div v-for="( item ,row) in data" :key="item.id"  class="outer-container">
                <OrderService  :clickCb="()=>goDetail(index,row)" :state="RentStateMap[item.state].title" :info="item.room" />
            </div>
        </div>
        <div :style="{height:height+'px'}" v-if="isLoad && data.length ===0">
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
        padding: 5px 5px;
        padding-right: 15px;
     
    }
    
}
</style>