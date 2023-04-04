<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import NavigationBar from './NavigationBar.vue';
interface AppointmentDetailProps {
    measuringCb:(height:number)=>void,
    title:string
}
const { measuringCb, title } = defineProps<AppointmentDetailProps>()
const {} = useState({})
const goBack =()=> uni.navigateBack()
</script>
<template>
  <NavigationBar backgroundColor="rgb(242,242,242)" :measuringCb="measuringCb" :opacity="1" >
    <div  class="container">
        <image @click="goBack" class="img" src="/static/booking/arrow-left.png" />
        <div class="title">
            {{ title }}
        </div>
    </div>
  </NavigationBar>
</template>

<style lang='less' scoped>
.container{
    height: 33px;
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    .img{
        width: 25px;
        height: 25px;
        margin-right: 10px;
    }
    .title{
        text-align: center;
        font-size: 18px;
        font-weight: bolder;
    }
}
</style>