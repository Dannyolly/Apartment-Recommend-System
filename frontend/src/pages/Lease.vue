<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import Notis from '@/components/public/Notis.vue';
import { useNoti } from '@/hooks/useNoti'
import { ServiceManager } from '@/service';
import { LocalStorageManager } from '@/utils/localStorage';
import { getFullTime } from '@/utils/Date';

const itemList = ['一居室','二居室','三居室','四居室','五居以上'] 
const { noti ,form , community ,realDateVal,showDatePicker,dateVal} = useState({
    ...useNoti(),
    community:'',
    form:[
        {
            left:'房屋户型',
            right:itemList[0]
        },
        {
            left:'联系电话',
            right:''
        },
        {
            left:'上门时间',
            right:''
        }
    ],
    realDateVal:'',
    showDatePicker:false,
    dateVal:new Date()
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
function sentVerifyCode(){

}
async function submit(){
    const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    const { result } = await ServiceManager.LeaseOrderService.create({
        location:community.value,
        userId,
        appointmentTime:new Date(dateVal.value).getTime(),
        houseType:form.value[0].right
    })
    
    noti.value?.open("预约成功")
    setTimeout(()=>{
        uni.navigateTo({
            url:'/pages/ownerpages/orderDetail?orderInfo='+encodeURIComponent(JSON.stringify(result))
        })
    },1000)
}   
function showOption() {
    uni.showActionSheet({
        itemList,
        success: function (res) {
            form.value[0].right = itemList[res.tapIndex]
            //console.log(itemList[res.tapIndex]);    
        }
    });
}
function onConfirm({value,mode}:{value:number,mode:string}){
    showDatePicker.value = false
    realDateVal.value = getFullTime(new Date(value))
}
onMounted(()=>{

})
onLoad((query)=>{

})
onPageScroll(()=>{})
</script>
<template>
<div   class='container'>
    <div class="top-container">
        <div class="title">请您完善出租信息</div>
        <div class="sub-title">我们将尽快联系您,请您保持电话畅通</div>
    </div>
    <div class="info-form">
        <div class="community">
            <input v-model="community" type="text" placeholder="请输入所在小区">
        </div>
        <div class="info">
            <div class="left">{{ form[0].left }}</div>
            <div @click="showOption" class="right">
                <div>{{ form[0].right }}</div>
                <div>></div>
            </div>
        </div>
        <div class="info">
            <div class="left">{{ form[1].left }}</div>
            <div class="right">
                <input style="height: 50px;" v-model="form[1].right" type="text" placeholder="请输入电话">
                <!-- <div @click="sentVerifyCode">发送</div> -->
            </div>
        </div>
        <div class="info">
            <div class="left">{{ form[2].left }}</div>
            <div @click=" showDatePicker = true " class="right">
                <div>{{ realDateVal===''? "请选择上门时间":realDateVal }}</div>
                <div>></div>
            </div>
        </div>
        <div @click="submit" class="submit-button">
            提交
        </div>
    </div>
    <div class="option">
        <div class="option-btn">
            在线咨询
        </div>
        <div class="option-btn">
            电话沟通
        </div>
    </div>
    <div class="desc">
        <image mode="aspectFit" src="https://webimg.ziroom.com/a4d6feae-522d-48f5-b61c-eda201f0e688.png" />
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
<Notis ref='noti'  :duration='2000' />
</template>

<style lang='less' scoped>
.container{
    padding: 20px;
    padding-top: 40px;
    .top-container{
        margin-bottom: 20px;
        .title{
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .sub-title{
            font-size: 14px;
            color: @desc-color;
        }
    }
    .info-form{
        width: calc( 100% - 40px );
        border-radius: 5px;
        padding: 20px 20px;
        box-shadow: 0 0 10px #CDCDCD;
        .community{
            input{
                width: calc( 100% - 40px );
                height: 50px;
            }
        }
        .info{
            display: flex;
            height: 50px;
            border-bottom-width: 1px;
            border-bottom-color: rgba(0,0,0,.12);
            border-bottom-style: solid;
            line-height: 50px;
            .left{
                display: flex;
                flex: 0.35;
            }
            .right{
                display: flex;
                flex: 0.65;
                font-size: 14px;
                justify-content: space-between;
                color: @desc-color;
            }
        }
        .submit-button{
            width: 100%;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background-color: @major-color;
            border-radius: 5px;
            color: #FFF;
        }
    }
    .option{
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
        .option-btn{
            width: 47%;
            height: 40px;
            border-radius: 10px;
            text-align: center;
            line-height: 40px;
            color: #FFF;
            background-color: @major-color;
        }
    }
    .desc{
        width: 100%;
        image{
            width: 100%;
        }
    }
}
</style>