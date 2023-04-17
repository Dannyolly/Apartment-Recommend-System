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
import { Room, RoomBooking,RoomBookingOrder } from '@/types/serviceEntity/Room';
import { LocalStorageManager } from '@/utils/localStorage';
import { getFullTime } from '@/utils/Date';
import { useHouseAppointmentStore } from '@/store/HouseAppointment';
import { storeToRefs } from 'pinia';
const height = getDimension().height +'px' 
const visitMethod = [
    {
        name:'实时看房',
    },
    {
        name:'视频看房'
    }
]
const { 
    realDateVal,
    noti ,
    show ,
    showDatePicker,
    dateVal , 
    visiterInfo,
    radioVal ,
    roomInfoArr ,
    requirement 
} = useState({
    ...useNoti(),
    show:false,
    showDatePicker:false,
    dateVal:new Date(),
    realDateVal:'',
    visiterInfo :{
        name:'李家宏',
        phone:'18672779201'
    },
    radioVal:'实时看房',
    roomInfoArr:[] as Room[],
    requirement:''
})
const { ids,dataList } = storeToRefs(useHouseAppointmentStore())
const { setState } = useHouseAppointmentStore()
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
async function bookAction(){
    const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    const roomId = roomInfoArr.value[0].id
    const { result } = await ServiceManager.RoomBookingService.create({
        userId,
        // @ts-ignore
        houseId: roomInfoArr.value[0].id,
        requirementDesc: requirement.value,
        time: new Date(dateVal.value).getTime()
    })
    let roomBookingOrder:RoomBookingOrder = {
        ...result,
        room: (await ServiceManager.RoomService.getRoomsByIds(`${result.houseId}`)).result[0]
    }
    
    // 從看房表去掉
    const roomVisitIds = LocalStorageManager.getLocalStorageInfo('roomVisitIds',userId) ?? []
    if(roomVisitIds.length){
        const index = roomVisitIds.findIndex( v=>v === roomId)
        let res = roomVisitIds.splice(index,1)
        LocalStorageManager.setLocalStorageInfo('roomVisitIds',{
            roomVisitIds:res,
        },userId)
    }

    noti.value?.open("预约成功")
    setTimeout(()=>{
        uni.redirectTo({
            url:'/pages/appointment/appointmentDetail?orderInfo='+encodeURIComponent(JSON.stringify(roomBookingOrder))
        })
    },1000)
}
function onConfirm({value,mode}:{value:number,mode:string}){
    showDatePicker.value = false
    realDateVal.value = getFullTime(new Date(value))
}

onLoad(async (query)=>{
    if(!query) return;
    let choseArr:number[] = JSON.parse(query.choseArr)
    choseArr.forEach((v,index)=>{
        if(choseArr[index]){
            roomInfoArr.value.push(dataList.value[index])
        }
    })
    
})
onPageScroll(()=>{})
</script>
<template>
<div  :style='{height:height}' class='container'>
    <div class="watcher-container">
        <div>看房人</div>
        <div @click="show =  true" class="client-info" >{{ `${visiterInfo.name} ${visiterInfo.phone}` }} ></div>
    </div>
    <div class="booking-info">
        <div class="top-container">
            <div class="left">
                <image src="/static/booking/schedule.png" style="width: 15px;height: 15px;" />
                行程
            </div>
            <div class="count">共2间公寓</div>
        </div>
        <div class="method">
            <div class="left">看房方式</div>
            <div class="right">
                <u-radio-group v-model="radioVal">
                    <u-radio  
                    v-for="item in visitMethod" 
                    :customStyle="{marginRight: '8px'}"
                    :iconSize="30" 
                    :labelSize="25"
                    :size="30" 
                    shape="circle" 
                    :label="item.name"
                    :name="item.name"
                    />
                </u-radio-group>
            </div>
        </div>
        <u-line color="#F2F2F2" />
        <div class="method">
            <div class="left">看房时间</div>
            <div v-if="realDateVal" @click="showDatePicker = true" class="right">
                {{ realDateVal }}
            </div>
            <div v-else @click="showDatePicker = true" class="right">
                请选择看房时间 >
            </div>
        </div>
        <u-line color="#F2F2F2" />
        <div v-if="roomInfoArr.length!==0" class="booking-house-container">
            <House 
                v-for="roomInfo in roomInfoArr"
                :post="roomInfo" 
                :paddingRight="0" 
            />
        
        </div>
    </div>
    <div class="booking-requirement">
        <div class="title">看房需求</div>
        <u-textarea :height="200" v-model="requirement" count placeholder="请输入内容" />
    </div>
    <div class="bottom-container">
        <div @click="bookAction" class="book-btn">
            确定预约
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
    ></u-datetime-picker>
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
        padding: 15px;
        .title{
            font-weight: 600;
        }
        :deep(.u-textarea){
            border: 0px;
            padding-top: 20px;
        }
    }
    .bottom-container{
        z-index: @bottom-bar-z-index;
        width: calc( 100% - 20px );
        height: 67px;
        padding: 10px;
        position: fixed;
        bottom: 0;
        background-color: #FFF;
        left: 0;
        box-shadow: 0 0 10px #CDCDCD;
        .book-btn{
            width: 100%;
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