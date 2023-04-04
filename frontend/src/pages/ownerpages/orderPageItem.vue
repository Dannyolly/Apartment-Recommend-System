<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import { LeaseOrder } from '@/types/serviceEntity/lease';
import { getFullTime } from '@/utils/Date';
import { orderBy } from 'lodash';
interface orderPageItemProps {
  order:LeaseOrder
}
const {order } = defineProps<orderPageItemProps>()
const height = getDimension().height +'px' 
const {} = useState({

})
const goDetail = ()=>{
    uni.navigateTo({
        url:'/pages/ownerpages/orderDetail?orderInfo='+encodeURIComponent(JSON.stringify(order))
   
    })
}
onMounted(()=>{

})
onLoad((query)=>{

})
onPageScroll(()=>{})
</script>
<template>
<div @click="goDetail" class='container'>
    <div class="top-container">
      <div class="community-container">
        <image src="/static/booking/building.png" class="img" />
        <div class="community">{{ order.location }}</div>
      </div>
      <div class="state">
        {{ order.state === 1 ? '待上门' : '已完成' }}
      </div>
    </div>
     <div  class="detail-info-container">
        <div class="house-type">
            <div class="left">房屋户型:</div>
            <div class="right">{{ order.houseType }}</div>
        </div>
         <div class="appointment-time">
            <div class="left">预计上门时间:</div>
            <div class="right">{{ getFullTime(new Date(order.appointmentTime)) }}</div>
           
         </div>
    </div>
</div>
</template>

<style lang='less' scoped>
.container {
  width: calc( 100% - 40px);
  background-color: #FFF;
  margin-bottom: 10px;
  padding-top: 5px;
  padding-bottom: 0px;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  .top-container{
    padding: 0px 15px;
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
  .detail-info-container{
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 14px;
    .left{
        display:flex;
        flex: 0.5;
        justify-content: flex-start;
    }
    .right{
        display:flex;
        flex: 0.5;
        justify-content: flex-end;
    }
    .appointment-time{
        display: flex;
        justify-content: space-around;
        
    }
    .house-type{
        display: flex;
        justify-content: space-around
    }
  }
}
</style>