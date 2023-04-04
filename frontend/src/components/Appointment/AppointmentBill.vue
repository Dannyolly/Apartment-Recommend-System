<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import House from '../FilterBar/House.vue';
import { Room } from '@/types/serviceEntity/Room';
interface AppointmentBillProps {
  room:Room,
  clicked:boolean,
  clickCb:()=>void
}
const { clicked,clickCb } = defineProps<AppointmentBillProps>()
const { } = useState({
 
})
onMounted(()=>{

})
</script>
<template>
  <div class='container'>
    <div class="choice-container">
        <div @click="clickCb" v-show="!clicked" class="option"  />
        <image  @click="clickCb" v-show="clicked" class="option-choose" src="/static/booking/choose.png" />
    </div>
    <House :padding-right="10" :post="room" />
  </div>
</template>

<style lang='less' scoped>
.container{
    width: 100%;
    display: flex;
    border-radius: 5px;
    padding-bottom: 5px;
    background-color: #FFF;
    margin-bottom: 0px;
    .choice-container{
        display: flex;
        width: 35px;
        justify-content: center;
        align-items: center;
        .option{
            width: 15px;
            height: 15px;
            border-radius: 50%;
            border: 1px solid #CDCDCD;
        }
        .option-choose{
            width: 15px;
            height: 15px;
        }
    }
}
</style>