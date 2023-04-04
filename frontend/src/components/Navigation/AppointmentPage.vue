<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import NavigationBar from './NavigationBar.vue';
interface AppointmentProps {
    measuringCb:(height:number)=>void,
    opacity:number
}
const { measuringCb } = defineProps<AppointmentProps>()
const {} = useState({})
const goBack =()=> uni.navigateBack()
</script>
<template>
  <NavigationBar :measuringCb="measuringCb" :opacity="opacity">
    <div :style="{ opacity:opacity }" class="container">
        <image @click="goBack" class="img" src="/static/booking/arrow-left.png" />
        <div class="title">
            看房单
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
        font-size: 16px;
        font-weight: bolder;
    }
}
</style>