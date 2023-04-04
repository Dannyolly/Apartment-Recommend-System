<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import Navigation from '@/components/Navigation/OrderDetail.vue'
import Record from '@/components/HouseService/OrderServiceDetail.vue'
import RecommendService from '@/components/HouseService/HousingService.vue'
import Detail from '@/components/Appointment/AppointmentDetail.vue';
import House from '@/components/FilterBar/House.vue';
import { onLoad } from '@dcloudio/uni-app';
import { RentInfo, RentState ,RentStateMap ,RentOrderInfo, Room } from '@/types/serviceEntity/Room';
import { ServiceManager } from '@/service';
import { getFullTime } from '@/utils/Date';

const height = getDimension().height + 'px'
const { navigationHeight ,state ,orderInfo ,rentInfoState, recommendRoom } = useState({
  navigationHeight: 0,
  state:'',
  orderInfo:null as RentOrderInfo | null ,
  rentInfoState:{
    title:'',
    subtitle:''
  },
  recommendRoom:[] as Room[]
})
const infoList: Array<{ left: string, right: string }> = [
  {
    left: "实付款",
    right: "$1030"
  }, {
    left: "订单编号",
    right: "3123874912398710"
  }, {
    left: "创建时间",
    right: "2023-02-11 15:44:03"
  }, {
    left: "付款时间",
    right: "2023-02-11 15:46:03"
  }, {
    left: "签约时间",
    right: ""
  }, {
    left: "入住时间",
    right: ""
  },
  {
    left: "管家",
    right: "李家宏"
  },
]

function goCheckProcess(){
  uni.navigateTo({
    url:'/pages/process?process='+orderInfo.value?.history
  })
}

onLoad(async (query)=>{
  if(!query ) return
  //state.value =  query.state
  orderInfo.value = JSON.parse( decodeURIComponent(query.orderInfo) )
  if(!orderInfo.value) return
  // @ts-ignore
  const { title, subtitle } = RentStateMap[orderInfo.value.state]
  rentInfoState.value = {
    title,
    subtitle
  }
  infoList[0].right = orderInfo.value.payment+''
  infoList[2].right = getFullTime(new Date(orderInfo.value.createTime))
  infoList[3].right = orderInfo.value.payTime? getFullTime(new Date(orderInfo.value.payTime ?? '')) :''
  infoList[4].right = orderInfo.value.signTime? getFullTime(new Date(orderInfo.value.signTime ?? '')) :''
  infoList[5].right = orderInfo.value.checkinTime? getFullTime(new Date(orderInfo.value.checkinTime ?? '')) :''
  
  recommendRoom.value = (await ServiceManager.RoomService.getRecommendRooms(orderInfo.value.room.id,5,1)).result
})
onMounted(() => {

})
</script>
<template>
  <Navigation :measuring-cb="h => navigationHeight = h" :title="'订单'" />
  <div class='container'>
    <div :style="{ height: navigationHeight + 20 + 'px' }" />
    <div class="state-bar">
      <div class="left">
        <image class="img" src="/static/booking/booking.png" />
        <div class="desc">
          <div class="title">{{ rentInfoState.title }}</div>
          <div class="subtitle">{{ rentInfoState.subtitle }}</div>
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
      <Detail v-if="orderInfo" :state="rentInfoState.title" :room="orderInfo.room" />
      <div class="info-list-container">
        <div v-for="({ left, right }, index) in infoList" class="info-list">
          <div class="left">{{ left }}</div>
          <div class="right">{{ right }}</div>
        </div>
      </div>
    </div>
    <div class="recommend-container">
        <div class="title">更多相同公寓</div>
        <House v-for="room in recommendRoom" :post="room" :paddingRight="10"/>

    </div>
    <div class="bottom-container">
      <div class="btn-1">联络客服</div>
      <div v-if="orderInfo?.state === RentState.PAYING" class="btn">取消订单</div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.btn-1 {
  width: max-content;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #FFF;
  padding: 5px 10px;
  background-color: #CDCDCD;
}

.container {
  background-color: rgb(242, 242, 242);
  padding: 0 10px;
  padding-bottom: 100px;
  position: relative;

  .state-bar {
    width: calc(100% - 20px);
    padding: 5px 10px;
    background-color: #FFF;

    border-radius: 10px;
    margin-bottom: 15px;
    height: 60px;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      height: 100%;

      .img {
        width: 25px;
        height: 25px;
        margin-right: 10px;
        transform: translateY(-10px);
      }

      .desc {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .subtitle {
          font-size: 13px;
          color: @desc-color;
        }
      }
    }

    .right {
      display: flex;
      height: 100%;
      align-items: center;
    }
  }

  .admin-container {
    width: calc(100% - 30px);
    padding: 15px 15px;
    background-color: #FFF;
    border-radius: 10px;
    margin-bottom: 15px;

    .admin {
      height: 60px;
      display: flex;

      .img {
        width: 60px;
        border-radius: 5px;
        height: 100%;
        margin-right: 10px;
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 3px;

        .name {
          font-size: 14px;
          font-weight: 600;
        }

        .experience {
          font-size: 10px;
          color: @text-color;
        }

        .desc {
          color: @desc-color;
          font-size: 12px;
        }
      }

      .phone {
        height: 100%;
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: flex-end;

        .phone-container {
          width: 35px;
          height: 35px;
          background-color: #F4f4f4;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;

          .phone-img {
            width: 25px;
            height: 25px;
          }
        }
      }
    }
  }

  .detail-container {
    width: calc(100% - 0px);
    padding: 5px 0px;
    background-color: #FFF;
    border-radius: 10px;
    margin-bottom: 15px;

    .info-list-container {
      display: flex;
      flex-direction: column;
      transform: translateY(-10px);

      .info-list {
        display: flex;
        justify-content: space-between;
        padding: 8px 15px;
        font-size: 15px;
        align-items: center;

        .right {
          color: @desc-color;
        }
      }
    }
  }

  .bottom-container {
    box-shadow: 0 0 2px #CDCDCD;
    width: calc(100% - 30px);
    padding: 10px 15px;
    padding-top: 20px;
    padding-bottom: 34px;
    position: fixed;
    bottom: 0;
    background-color: #FFF;
    transform: translateX(-10px);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .recommend-container {
    padding: 20px 15px;
    border-radius: 10px;
    background-color: #FFF;

    .title {
      font-size: 17px;
      font-weight: 600;
      margin-bottom: 30px;
    }
  }
}
</style>