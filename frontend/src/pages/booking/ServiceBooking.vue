<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import Notis from '@/components/public/Notis.vue';
import { useNoti } from '@/hooks/useNoti'
import MyInput from '@/components/public/Input.vue'
import House from '@/components/FilterBar/House.vue';
import { ServiceManager } from '@/service';
import { Room } from '@/types/serviceEntity/Room';
import { LocalStorageManager } from '@/utils/localStorage';
import { getFullTime } from '@/utils/Date';
import CurService from '@/components/HouseService/OrderServiceDetail.vue'
import { Service, ServiceOrderState, ServiceType } from '@/types/serviceEntity/Service';
import { baseUrl } from '@/api/config';
const height = getDimension().height +'px' 
const { 
  tenancy,
  noti ,
  show ,
  showDatePicker,
  dateVal , 
  totalPrice,
  location,
  serviceInfo,
  realDateVal,
  requirement
} = useState({
  ...useNoti(),
  show:false,
  noti:null as unknown as InstanceType<typeof Notis>,
  showDatePicker:false,
  dateVal:new Date(),
  realDateVal:'',
  serviceInfo:null as Service | null,
  tenancy:'',
  totalPrice:0,
  location:'华中科技大学',
  requirement:''
  
})
//@ts-ignore
function formatter(type, value) {
    if (type === 'year') {
        return `${value}年`
    }
    if (type === 'month') {
        return `${value}月`
    }
    if (type === 'day') {
        return `${value}日`
    }
    return value
}

function onConfirm({value,mode}:{value:number,mode:string}){
    showDatePicker.value = false
    realDateVal.value = getFullTime(new Date(value))
    
}
async function submitOrder(){
    if(!serviceInfo.value) return;
    const id = LocalStorageManager.getLocalStorageInfo('userInfo').id
    const { result } = await ServiceManager.ClientService.serviceCreate({
        userId: id,
        serviceId: serviceInfo.value.id,
        time: new Date(dateVal.value).getTime(),
        requirementDesc: requirement.value,
        state: ServiceOrderState.PAYING,
        // @ts-ignore
        curSer: serviceInfo.value.curSer ,
        // @ts-ignore
        curPri: serviceInfo.value.curPri 
    })
    const { result: serviceT} = await ServiceManager.ClientService.getById(result.serviceId)
    //console.log(serviceT,result.id);
    
    result.service = serviceT
    result.service.curPri = result.curPri
    result.service.curSer = result.curSer
    noti.value.open('已预订')
    setTimeout(()=>{
        uni.redirectTo({
            url:'/pages/serviceOrder/orderDetail?orderInfo='+encodeURIComponent(JSON.stringify(result))
        })
    },1000)
}

onLoad(async (query)=>{
    // @ts-ignore
    serviceInfo.value = JSON.parse(decodeURIComponent(query.serviceInfo))
    //console.log(serviceInfo.value);
    totalPrice.value += Number( serviceInfo.value?.curPri )
   // console.log(serviceInfo.value);
    
})
onPageScroll(()=>{})
</script>
<template>
<div  :style="{height:height}" class='container'>
    <div class="watcher-container">
        <div>地址</div>
        <div @click="show =  true" class="client-info" >{{ `${location}` }} ></div>
    </div>
    <div class="booking-info">
        <div class="top-container">
            <div class="left">
                <image src="/static/booking/schedule.png" style="width: 15px;height: 15px;" />
                服务
            </div>
        </div>
        <div class="booking-house-container">
            <CurService 
                v-if="serviceInfo" 
                :title="''" 
                :service="serviceInfo"
            />
        </div>
        <u-line color="#F2F2F2" />
        <div class="method">
            <div class="left">服务时间</div>
            <div v-if="realDateVal" @click="showDatePicker = true" class="right">
                {{ realDateVal }}
            </div>
            <div v-else @click="showDatePicker = true" class="right">
                请选择服务时间 >
            </div>
        </div>
        
    </div>
    <div class="booking-requirement">
        <div class="title">服务需求</div>
        <u-textarea :height="200" v-model="requirement" count placeholder="请输入内容" />
    </div>
    <div class="bottom-container">
        <div class="total-price">{{ '$'+totalPrice }}</div>
        <div @click="submitOrder" class="book-btn">
            提交订单
        </div>
    </div>


    <u-datetime-picker
        closeOnClickOverlay
        @confirm="onConfirm"
        @cancel=" showDatePicker = false"
        :visibleItemCount="10"
        ref="datetimePicker"
        :show="showDatePicker"
        v-model="dateVal"
        mode="datetime"
        :formatter="formatter"
    />

</div>
<u-popup :round="20" :show="show" @close="show = false" >
    <view class="info-container">
        <div class="title">请输入地址</div>
        <input class="name" v-model="location" />
        <div @click="show = false" class="submit-btn">确认</div>
    </view>
</u-popup>

<Notis ref='noti'  :duration='2000' />
</template>

<style lang='less' scoped>

.info-container{
    width: calc( 100% - 40px );
    padding: 20px;
    padding-bottom: 0px;
    padding-top: 30px;
    .title{
        font-size: 18px;
        margin-bottom: 30px;
    }
    .name{
        padding: 8px 15px;
        background-color: rgb(242,242,242);
        margin-bottom: 15px;
        border-radius: 5px;
        font-size: 14px;
    }
    .phone{
        padding: 8px 15px;
        border-radius: 5px;
        background-color: rgb(242,242,242);
        margin-bottom: 15px;
        font-size: 14px;
    }
    .submit-btn{
        width: 100%;
        height: 35px;
        border-radius: 10px;
        background-color: @major-color;
        color: #FFF;
        text-align: center;
        line-height: 35px;
    }
}
.container{
    background-color: rgb(242,242,242);
    padding: 20px;
    display: flex;
    flex-direction: column;
    padding-bottom: 100px;
    gap: 10px;
    .watcher-container{
        width: calc( 100% - 30px);
        padding: 12px 15px;
        background-color: #FFF;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        
        .client-info{
            color: @desc-color;
        }
    }
    .booking-info{
        background-color: #FFF;
        border-radius: 10px ;
        width: 100%;
        .top-container{
            display: flex;
            align-items: center;
            .left{
                margin-right: 10px;
                padding: 0 15px;
                height: 30px;
                background-color: @major-color;
                display: flex;
                align-items: center;
                font-size: 12px;
                gap: 5px;
                color: #FFF;
                border-top-left-radius: 10px;
                border-bottom-right-radius: 15px;
            }
            .count{
                font-size: 13px;
                color: @desc-color;
            }
        }
        .method{
            display: flex;
            padding: 10px 15px;
            justify-content: space-between;
            align-items: center;
            .left{
                font-size: 14px;
            }
            .right{
                font-size: 14px;
                color: @desc-color;
            }
        }
        .booking-house-container{
            display: flex;
            width: calc( 100% -0px);
            flex-direction: column;
            padding: 10px 0px ;
        }
    }
    .booking-requirement{
        background-color: #FFF;
        border-radius: 10px;
        padding: 10px 15px;
        .title{
            padding: 0px 0px;
            font-weight: 600;
        }
        :deep(.u-textarea){
            border: 0px;
            padding-top: 20px;
        }
    }
    .bottom-container{
        z-index: @bottom-bar-z-index;
        width: calc( 100% - 30px );
        height: 67px;
        padding: 10px 15px;
        position: fixed;
        bottom: 0;
        background-color: #FFF;
        left: 0;
        box-shadow: 0 0 10px #CDCDCD;
        display: flex;
        justify-content: space-between;
        .total-price{
          height: 35px;
          line-height: 35px;
          font-size: 18px;
          color: @major-color;
          font-weight: 600;
          
        }
        .book-btn{
            width: 30%;
            height: 35px;
            background-color: @major-color;
            border-radius: 5px;
            color: #FFF;
            text-align: center;
            line-height: 35px;
        }
    }
    :deep(.u-popup__content){
        height: 200px;
    }
}
</style>