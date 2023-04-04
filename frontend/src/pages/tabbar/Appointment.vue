<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import AppointmentNavigation from '@/components/Navigation/Appointment.vue'
import { useNavigationScroll} from '@/hooks/useScroll'
import AppointmentBill from '@/components/Appointment/AppointmentBill.vue';
import { getDimension } from '@/utils/Equipment';
import { onLoad, onPageScroll, onShow } from '@dcloudio/uni-app';
import { computed } from '@vue/reactivity';
import { offError } from '@dcloudio/types/uni-app/uni/base/Error';
import { useMapState } from '@/hooks/component/useMapState'
import { getLocation, loadCity } from '@/utils/location';
import { Room } from '@/types/serviceEntity/Room';
import { useHouseAppointmentStore } from '@/store/HouseAppointment';
import { storeToRefs } from 'pinia';
import Tabbar from '@/components/Tabbar.vue';
interface AppointmentProps {
  props:any
}
const height = getDimension().height
const {} = defineProps<AppointmentProps>()
const { navigationHeight, choseArr,choseCount } = useState({
  navigationHeight:0,
  choseCount:0,
  choseArr:[] as number[],
})
const { dataList , ids } = storeToRefs(useHouseAppointmentStore())
const { remove } = useHouseAppointmentStore()
const { opacity } = useNavigationScroll()
const clickCb = (index:number)=>{
  console.log(index);
  
  if(choseArr.value[index]){
    choseArr.value[index] = 0
    choseCount.value--
  }else{
    choseArr.value[index] = 1
    choseCount.value++
  }
    

}
const chooseAll = ()=>{
  if(choseCount.value!==dataList.value.length){
    choseArr.value.fill(1)
    choseCount.value = dataList.value.length
  }else{
    choseArr.value.fill(0)
    choseCount.value = 0
  }
  //console.log(choseArr.value);
  
}

function removeRoom(){
  let removeIds:any[] = []
  choseArr.value.forEach((v,i)=>{
    if(v){
      removeIds.push(i)
    }
  })
  let temp = [...choseArr.value]
  temp = temp.filter((v,i)=>{
    return removeIds.lastIndexOf(i)===-1
  })
  remove(choseArr.value)
  choseArr.value = [...temp]
  choseCount.value = 0
}

function bookingAction(){
  uni.navigateTo({
    url:'/pages/booking/HouseBooking?choseArr='+JSON.stringify(choseArr.value)
  })
}

onShow(()=>{
  if(dataList.value.length !== choseArr.value.length){
    let temp = new Array(dataList.value.length).fill(0)
    choseArr.value.forEach((v,i)=>{
      temp[i] = v
    })
    choseArr.value = [...temp]
  }
})

onMounted(()=>{
  onPageScroll(()=>{})
  choseArr.value = new Array(dataList.value.length).fill(0) 
})



</script>
<template>
  <div :style="{height:height+'px'}" class='container'>
    <AppointmentNavigation :measuring-cb="h=>navigationHeight= h" :opacity="opacity" />
    <div class="top-container">
      <div class="title">看房单</div>
      <div class="sub-title">50万用户都在使用</div>
    </div>
    <div class="bill-container">
      <AppointmentBill  
        v-for="(item,index) in dataList" 
        :key="item.id"
        :click-cb="()=>clickCb(index)" 
        :clicked="choseArr[index] === 1" 
        :room="item" 
      />
      
    </div>
    <div class="bottom-container">
      <div class="left">
        <div class="count">
          已选
          <div :style="{color:choseCount? 'rgb(36,172,242)':'rgb(137,137,137)'}" style="padding: 0 7px;">{{ choseCount }}</div>
          间
        </div>
        <div class="desc">预继后管家带您去看房</div>
      </div>
      <div @click="bookingAction" class="right">
        预约看房
      </div>
      <div @click="chooseAll" class="right-1">
        {{ choseCount!==dataList.length?'全选':'取消' }}
      </div>
      <div @click="removeRoom" v-if="choseCount!==0" class="right-2">
        移除
      </div>
    </div>
  </div>
  <Tabbar/>
</template>

<style lang='less' scoped>
.container{
  background-color: rgb(247,247,247);
  
  .top-container{
    z-index: 5;
    padding: 20px;
    width: calc( 100% - 40px );
    background-image: linear-gradient(to bottom,rgb(38,197,253), rgb(38,197,253),rgb(247,247,247));
    padding-top: 50px;
    color:black;
    position:absolute;
    top: 0;
    
    .title{
      font-size: 20px;
      font-weight: bolder;
    }
    .sub-title{
      font-size: 12px;
      color: @text-color;
    }
  }
  .bill-container{
    padding: 10px 15px;
    padding-top: 122px;
    padding-bottom: 80px;
  }
  .bottom-container{
    padding: 10px 20px;
    position: fixed;
    bottom: 85px;
    background-color: #FFF;
    width: calc( 100% - 40px );
    height: 40px;
    box-shadow: 0 0 5px #CDCDCD;
    display: flex;
    align-items: center;
    .left{
      .count{
        font-size: 14px;
        margin-bottom: 3px;
        display: flex;
      }
      .desc{
        color: @desc-color;
        font-size: 12px;
      }
    }
    .right{
      width: 100px;
      height: 35px;
      background-color: @major2-color;
      position: absolute;
      right: 20px;
      border-radius: 5px;
      line-height: 35px;
      text-align: center;
      color: #FFF;
      font-size: 13px;
    }
    .right-1{
      width: 50px;
      height: 35px;
      background-color: @major2-color;
      position: absolute;
      right: 130px;
      border-radius: 5px;
      line-height: 35px;
      text-align: center;
      color: #FFF;
      font-size: 13px;
    }
    .right-2{
      width: 50px;
      height: 35px;
      background-color: @major2-color;
      position: absolute;
      right: 190px;
      border-radius: 5px;
      line-height: 35px;
      text-align: center;
      color: #FFF;
      font-size: 13px;
    }
  }
}
</style>