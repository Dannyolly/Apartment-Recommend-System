<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import House from '../FilterBar/House.vue';
import { getDimension } from '@/utils/Equipment';
import { RentInfo, RentOrderInfo, RentStateMap, Room } from '@/types/serviceEntity/Room';
interface AppointmentHistoryProps {
  info:Room,
  clicked?: boolean,
  clickCb?: () => void,
  state?:string
}
const { info,clicked, clickCb } = defineProps<AppointmentHistoryProps>()
const { } = useState({

})
const height = getDimension().height
onMounted(() => {
 
})
</script>
<template>
  <div  v-if="info" @click="clickCb" class="outer-container">
    <div  class="top-container">
      <div class="community-container">
        <image src="/static/booking/building.png" class="img" />
        <div class="community">{{ info.community }}</div>
      </div>
      <div class="state">
        {{ state }}
      </div>
    </div>
    <div class='container'>
      <image v-if="info.correctPic" :src="info.correctPic[0]" class="image" mode="aspectFill" />
      <div class="detail-info-container">
        <div  class="title">{{ info.title }}</div>
        <div class="detail">{{`${info.areasize}m2 | ${info.floorinfo} | ${info.ori}`}}</div>
        <div class="location">
          <image class="detail-image" src="/static/location-fill.png" />
          {{ info.community }}
        </div>
        <div class="tag-container">
          <Tag font-size="10" title="新小区" />
          <Tag font-size="10" title="新!" />
          <Tag font-size="10" title="新!!" />
        </div>
        <div class="price">￥{{ info.price }}/月</div>
      </div>
    </div>
    <div class="bottom-container">
      <div class="btn">查看进度</div>
    </div>
    <div style="padding: 10px;padding-left: 0px;padding-bottom: 0px;">
      <u-line color="#f4f4f4"></u-line>
    </div>
  </div>
</template>

<style lang='less' scoped>
.outer-container {
  width: calc( 100% - 0px);
  background-color: #FFF;
  margin-bottom: 10px;
  padding-top: 5px;
  padding-bottom: 0px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  .top-container{
    padding: 0px 15px;
    transform: translateY( 10px );
    display: flex;
    align-items: center;
    .community-container{
      display: flex;
      flex: 0.4;
      align-items: center;
      .img{
        width: 20px;
        height: 20px;
      }
      .community{
        font-size: 13px;
        font-weight: 600;
      }
    }
    .state{
      display: flex;
      flex: 0.6;
      font-size: 13px;
      color: @major-color;
      font-weight: 600;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .bottom-container{
      padding: 0px 15px;
      display: flex;
      justify-content: flex-end;
      .btn{
        width: max-content;
        border-radius: 20px;
        font-size: 14px;
        display: flex;
        align-items: center;
        color: #FFF;
        padding: 5px 10px;
        background-color: @major-color;
    }
  }
  .container {
    
    border-radius: 5px;
    padding-bottom: 5px;
    margin-bottom: 15px;
    position: relative;
    height: max-content;
    padding: 20px;
    padding-left: 165px;
    padding-right: 30px;
    .image {
      position: absolute;
      left: 15px;
      width: 140px;
      height: 100px;
      border-radius: 10px;
    }

    .detail-info-container {
      padding-top: 5px;

      .title {
        font-size: 14px;
        margin-bottom: 5px;
        font-weight: 600;
      }

      .detail {
        font-size: 12px;
        margin-bottom: 5px;
        color: @text-color;

      }

      .location {
        font-size: 12px;
        color: #2c2c2c;
        margin-bottom: 5px;

        .detail-image {
          width: 13px;
          height: 13px;
          transform: translateY(2px);
        }
      }

      .tag-container {
        width: fit-content;
        display: flex;
        margin-bottom: 5px;
        transform: translateX(-5px);
      }

      .price {
        color: @major-color;
        font-size: 14px;
        transform: translateX(-1px);
        position: absolute;
        bottom: 0px;
      }
    }
  }
}
</style>