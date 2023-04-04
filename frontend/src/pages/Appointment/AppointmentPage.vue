<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import AppointmentNavigation from '@/components/Navigation/AppointmentPage.vue'
import { useNavigationScroll} from '@/hooks/useScroll'
import AppointmentBill from '@/components/Appointment/AppointmentBill.vue';
import { getDimension } from '@/utils/Equipment';
import { onPageScroll } from '@dcloudio/uni-app';
import { computed } from '@vue/reactivity';
import { offError } from '@dcloudio/types/uni-app/uni/base/Error';
import { useMapState } from '@/hooks/component/useMapState'
import { getLocation, loadCity } from '@/utils/location';
import { Room } from '@/types/serviceEntity/Room';
import { useHouseAppointmentStore } from '@/store/HouseAppointment';
import { storeToRefs } from 'pinia';
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
const arrLength = computed(()=>dataList.value.length)
const { dataList } = storeToRefs(useHouseAppointmentStore())
const { opacity } = useNavigationScroll()
const clickCb = (index:number)=>{
  if(choseArr.value[index]){
    choseArr.value[index] = 0
    choseCount.value--
  }else{
    choseArr.value[index] = 1
    choseCount.value++
  }
    

}
const chooseAll = ()=>{
  if(choseCount.value!==arrLength.value){
    choseArr.value.fill(1)
    choseCount.value = arrLength.value
  }else{
    choseArr.value.fill(0)
    choseCount.value = 0
  }
  console.log(choseArr.value);
  
}
onMounted(()=>{
  onPageScroll(()=>{})
  choseArr.value = new Array(arrLength.value)  
})



</script>
<template>
  <div  :style="{height:height+'px'}" class='container'>
    <AppointmentNavigation :measuring-cb="h=>navigationHeight= h" :opacity="1" />
    <div :style="{paddingTop:navigationHeight+10+'px'}" class="bill-container">
      <AppointmentBill  
        v-for="(item,index) in dataList" 
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
      <div class="right">
        预约看房
      </div>
      <div @click="chooseAll" class="right-1">
        {{ choseCount!==arrLength?'全选':'取消' }}
      </div>
    </div>
  </div>
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
    padding-bottom: 80px;
  }
  .bottom-container{
    padding: 10px 20px;
    position: fixed;
    bottom: 0px;
    padding-bottom: 40px;
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
  }
}
</style>