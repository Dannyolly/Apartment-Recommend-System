<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import SwiperList from '@/components/public/SwiperList.vue';
import House from '@/components/Appointment/AppointmentHistory.vue';
import OrderService from '@/components/HouseService/orderService.vue'
import { getDimension } from '@/utils/Equipment';
import { ServiceManager } from '@/service';
import { LocalStorageManager } from '@/utils/localStorage';
import { ServiceOrder, ServiceOrderState } from '@/types/serviceEntity/Service';
import { DataList } from '@/types/Entity/DataList';
import NoMore from '@/components/public/NoMore.vue';
interface OrderProps {
  props?:any
}
// 订单 --- 服务订单
const {} = defineProps<OrderProps>()
const { dataList,isLoad } = useState({
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
            title:'待服务',
            data:[]
        },
        {
            title:'已完成',
            data:[]
        }
    ] as Array<DataList<ServiceOrder>>,
    isLoad:false
})
const height = getDimension().height
function classify(res:ServiceOrder[]){
    dataList.value[0].data = res
    res.forEach(v=>{
        switch(Number(v.state)){
            case ServiceOrderState.PAYING:
                dataList.value[1].data.push(v)
                break;
            case ServiceOrderState.PAYING:
                dataList.value[2].data.push(v)
                break;
            case ServiceOrderState.DONE:
                dataList.value[3].data.push(v)
        }
    })
    isLoad.value = true
}
onMounted(async ()=>{
    const id = LocalStorageManager.getLocalStorageInfo('userInfo').id
    let { result: res } = await ServiceManager.ClientService.getOrders(id)
    for (let i = 0; i < res.length; i++) {
        const el = res[i];
        const serviceId = el.serviceId
        el.service = (await ServiceManager.ClientService.getById(serviceId)).result
        el.service.curPri = el.curPri
        el.service.curSer = el.curSer
        el.service.correctImgs = el.service.imgs.split(',')
    }
    classify(res)
})
</script>
<template>
  <div :style="{ height : height + 'px'}" class='container'>
    <SwiperList :offsetTop="0" :flex="true" bgColor="rgb(247,247,247)" :dataList="dataList" v-slot="{ data , title,index }" >
        <div>
            <div v-for="service in data" class="outer-container">
                <OrderService  :title="''" :info="service"  />
            </div>
        </div>
        <div v-if="isLoad && data.length===0">
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
        padding: 10px 5px;
        padding-left: 15px;
    }
}
</style>