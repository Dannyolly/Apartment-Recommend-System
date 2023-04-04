<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import Navigation from '@/components/Navigation/AppointmentDetail.vue'
import { getDimension } from '@/utils/Equipment';
import Detail from '@/components/Appointment/AppointmentDetail.vue';
import HousePost from '@/components/House/HousePost.vue';
import House from '@/components/FilterBar/House.vue';
import { onLoad } from '@dcloudio/uni-app';
import { Room, RoomBooking, RoomBookingOrder,RoomBookingState,RoomBookingStateMap } from '@/types/serviceEntity/Room';
import { ServiceManager } from '@/service';
import { getCurrentTime, getFullTime } from '@/utils/Date'
import { LeaseOrder } from '@/types/serviceEntity/lease';
const height = getDimension().height + 'px'
const { navigationHeight ,state , recommendList ,infoList ,order} = useState({
  navigationHeight:0,
  state:'',
  order:{} as LeaseOrder,
  recommendList:[] as Room[],
  infoList: [{
      left:"订单编号",
      right:"3123874912398710"
    },{
      left:"创建时间",
      right:"2023-02-11 15:44:03"
    },{
      left:"预约时间",
      right:""
    },{
      left:"看房时间",
      right:""
    },{
      left:"管家",
      right:"李家宏"
    },
  ] as Array<{left:string,right:string}>
})
function goCheckProcess(){
  uni.navigateTo({
    url:'/pages/process?process='+order.value?.history
  })
}
onLoad(async (query)=>{
  if(!query) return
  //console.log(query);
  order.value =  JSON.parse(decodeURIComponent(query.orderInfo))
  state.value = order.value.state === 1 ? '待上门' : '已完成'
  //console.log(order.value.state);
  infoList.value[1].right = getFullTime(new Date(order.value.createTime))
  infoList.value[2].right = getFullTime(new Date(order.value.appointmentTime))
  infoList.value[3].right = order.value.checkTime ?? ''
  
  
})



</script>
<template>
  <Navigation :measuring-cb="h=>navigationHeight = h" :title="state"/>
  <div  :style="{height:height}" class='container'>
    <div :style="{height:navigationHeight+20+'px'}" />
    <div  class="state-bar">
      <div class="left">
        <image class="img" src="/static/booking/booking.png" />
        <div class="desc">
          <div class="title">{{ state }}</div>
          <div class="subtitle">{{ state }}</div>
        </div>
      </div>
      <div class="right">
        <div @click="goCheckProcess" class="btn">查看进度</div>
      </div>
    </div>
    <div class="admin-container">
      <div class="admin">
        <image class="img" src="/static/icon.png" />
        <div class="info">
          <div class="name">李家宏</div>
          <div class="experience">带看52次,评分为5.0分</div>
          <div class="desc">"我是本小区的服务管家"</div>
        </div>
        <div class="phone">
          <div class="phone-container">
            <image class="phone-img" src="/static/booking/phone.png" />
          </div>
        </div>
      </div>
    </div>
    <div class="detail-container">
      <div class="info-list-container">
        <div v-for="({left , right },index) in infoList" class="info-list">
          <div class="left">{{left}}</div>
          <div class="right">{{ right }}</div>
        </div>
      </div>
    </div>
    <div class="bottom-container">
      <div class="btn-1">联络客服</div>
      <!-- <div class="btn">取消订单</div> -->
    </div>
  </div>
</template>

<style lang='less' scoped>
.btn-1{
    width: max-content;
    border-radius: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #FFF;
    padding: 5px 10px;
    background-color: #CDCDCD;
}

.container{
  background-color: rgb(242,242,242);
  padding: 0 10px;
  padding-bottom: 100px;
  position: relative;
  .state-bar{
    width: calc( 100% - 20px );
    padding: 5px 10px;
    background-color: #FFF;
    
    border-radius: 10px;
    margin-bottom: 15px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    .left{
      display: flex;
      align-items: center;
      height: 100%;
      .img{
        width: 25px;
        height: 25px;
        margin-right: 10px;
        transform: translateY( -10px );
      }
      .desc{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        .title{
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .subtitle{
          font-size: 13px;
          color: @desc-color;
        }
      }
    }
    .right{
      display: flex;
      height: 100%;
      align-items: center;
    }
  }
  .admin-container{
    width: calc( 100% - 30px );
    padding: 15px 15px;
    background-color: #FFF;
    border-radius: 10px;
    margin-bottom: 15px;
    .admin{
      height: 60px;
      display: flex;
      .img{
        width: 60px;
        border-radius: 5px;
        height: 100%;
        margin-right: 10px;
      }
      .info{
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 3px;
        .name{
          font-size: 14px;
          font-weight: 600;
        }
        .experience{
          font-size: 10px;
          color:@text-color;
        }
        .desc{
          color: @desc-color;
          font-size: 12px;
        }
      }
      .phone{
        height: 100%;
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
        .phone-container{
          width: 35px;
          height: 35px;
          background-color: #F4f4f4;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          .phone-img{
            width: 25px;
            height: 25px;
          }
        }
      }
    }
  }
  .detail-container{
    width: calc( 100% - 0px );
    padding: 5px 0px;
    background-color: #FFF;
    border-radius: 10px;
    margin-bottom: 15px;
    .info-list-container{
      display: flex;
      flex-direction: column;
      transform: translateY( 0px );
      .info-list{
        display: flex;
        justify-content: space-between;
        padding: 8px 15px;
        font-size: 15px;
        align-items: center;
        .right{
          color: @desc-color;
        }
      }
    }
  }
  .bottom-container{
    box-shadow: 0 0 2px #CDCDCD;
    width: calc( 100% - 30px );
    padding: 10px 15px;
    padding-top: 20px;
    padding-bottom: 34px;
    position: fixed;
    bottom: 0;
    background-color: #FFF;
    transform: translateX( -10px );
    display: flex;
    justify-content: flex-end;
    gap:10px;
  }
  .recommend-container{
    padding: 20px 15px;
    border-radius: 10px;
    background-color: #FFF;
    .title{
      font-size: 17px;
      font-weight: 600;
    }
  }
}
</style>