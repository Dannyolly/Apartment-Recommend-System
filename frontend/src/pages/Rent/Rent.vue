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
import { Room ,RentState, RentOrderInfo} from '@/types/serviceEntity/Room';
import { LocalStorageManager } from '@/utils/localStorage';
import { getFullTime } from '@/utils/Date';
import AdditionalService from '@/components/HouseService/AdditionalOrder.vue'
import { Service, ServiceType  } from '@/types/serviceEntity/Service';
import { baseUrl } from '@/api/config';
const height = getDimension().height +'px' 
const { 
  tenancy,
  showTenancyPicker,
  columns,
  realDateVal,
  noti ,
  show ,
  showDatePicker,
  dateVal , 
  visiterInfo,
  roomInfo,
  serviceList,
  serviceChoice,
  totalPrice
} = useState({
  ...useNoti(),
  show:false,
  showDatePicker:false,
  showTenancyPicker:false,
  columns:[[...(new Array(32).fill(0).map((v,i)=>(i+1)))]],
  dateVal:new Date(),
  realDateVal:'',
  visiterInfo :{name:'李家宏',phone:'18672779201'},
  roomInfo:null as Room | null,
  tenancy:'',
  serviceList:[] as Service[],
  serviceChoice:[] as number[],
  totalPrice:0
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
    console.log(dateVal.value.getTime());
    
}
function tenancyConfirm(t: { value: string[]; }){
  showTenancyPicker.value = false
  tenancy.value  = t.value[0]
  totalPrice.value = Number(tenancy.value) * Number(roomInfo.value?.price)
  //console.log(tenancy.value);
  
}
function addService(isClick:boolean,index:number){
  serviceChoice.value[index] = isClick? 1 : 0
  isClick?
    totalPrice.value += Number(serviceList.value[index].price)
    :
    totalPrice.value -= Number(serviceList.value[index].price)
}
async function submitOrder(){
    const id  = LocalStorageManager.getLocalStorageInfo('userInfo').id
    let ids:number[] = []
    serviceChoice.value.forEach((v,i)=>{
        if(v){
            ids.push(serviceList.value[i].id)
        }
    })
    if(!roomInfo.value) return
    try{
        const { result } = await ServiceManager.RentInfoSerivce.rentCreate({
            userId: id,
            houseId: roomInfo.value?.id,
            state: RentState.PAID,
            tenancy: Number(tenancy.value),
            payment: totalPrice.value,
            serviceIds: ids.join(','),
            time:new Date(dateVal.value).getTime(),
        })
        noti.value?.open('已预订')
        let res:RentOrderInfo = {
            ...result,
            room: (await ServiceManager.RoomService.getRoomsByIds(`${result.houseId}`)).result[0]
        }
        res.room.correctPic = res.room.pic.split(',').map(v=>v.slice(2,v.length-2))
        setTimeout(()=>{
            uni.navigateTo({
                url:'/pages/houseOrder/orderDetail?orderInfo='+encodeURIComponent(JSON.stringify(res))
            })
        },1000)
    }catch(err){
        console.log(err);
        return;
    }
    
    
    
}
onMounted( async ()=>{
   
    
})
onLoad(async (query)=>{
    let { result : res} = await ServiceManager.ClientService.getList()
    const services = res.filter(v=>v.type == ServiceType.MOVING)
    services.forEach(v=>v.correctImgs = v.imgs.split(',').map(v=>baseUrl + v))
    // @ts-ignore
    roomInfo.value = JSON.parse(decodeURIComponent(query.roomInfo))
    serviceChoice.value  = new Array(services.length).fill(0)
    serviceList.value = services
})
onPageScroll(()=>{})
</script>
<template>
<div   class='container'>
    <div class="watcher-container">
        <div>入住人</div>
        <div @click="show =  true" class="client-info" >{{ `${visiterInfo.name} ${visiterInfo.phone}` }} ></div>
    </div>
    <div class="booking-info">
        <div class="top-container">
            <div class="left">
                <image src="/static/booking/schedule.png" style="width: 15px;height: 15px;" />
                公寓
            </div>
        </div>
        <div class="booking-house-container">
            <House 
                v-if="roomInfo"
                :post="roomInfo" 
                :paddingRight="0" 
            />
        </div>
        <u-line color="#F2F2F2" />
        <div class="method">
            <div class="left">入住时间</div>
            <div v-if="realDateVal" @click="showDatePicker = true" class="right">
                {{ realDateVal }}
            </div>
            <div v-else @click="showDatePicker = true" class="right">
                请选择入住时间 >
            </div>
        </div>
        <div class="method">
            <div class="left">租期</div>
            <div v-if="tenancy " @click="showTenancyPicker = true" class="right">
                {{ tenancy }}
            </div>
            <div v-else @click="showTenancyPicker  = true" class="right">
                请选择租期 >
            </div>
        </div>
        <div class="method">
            <div class="left">合计</div>
            <div v-if="tenancy" @click="showDatePicker = true" class="right">
                {{ '$ ' + Number(tenancy) * Number(roomInfo?.price)  }}
            </div>
            <div v-else @click="showDatePicker = true" class="right">
                请选择租期
            </div>
        </div>
    </div>
    <div class="booking-requirement">
        <div class="title">服务</div>
        <div class="service-outer">
          <AdditionalService 
            v-for="(service,index) in serviceList" 
            :data="service" 
            :index="index"
            :click-btn-cb="addService"
          />
        </div>
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

    <u-picker 
      closeOnClickOverlay
      :visibleItemCount="10"
      @confirm="tenancyConfirm"
      @cancel="showTenancyPicker = false" 
      :show="showTenancyPicker" 
      :columns="columns"
    />
</div>
<u-popup :round="20" :show="show" @close="show = false" >
    <view class="info-container">
        <div class="title">请输入看房人信息</div>
        <input class="name" v-model="visiterInfo.name" />
        <input class="phone" v-model="visiterInfo.phone" />
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
            width: calc( 100% -40px);
            flex-direction: column;
            padding: 0px 20px ;
        }
    }
    .booking-requirement{
        background-color: #FFF;
        border-radius: 10px;
        padding: 10px 0px;
        .title{
            padding: 0px 15px;
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