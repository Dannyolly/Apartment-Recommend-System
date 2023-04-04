<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import NavigationBar from './NavigationBar.vue';
import { useNavigationScroll } from '@/hooks/useScroll';
interface ServiceProps {
    measuringCb:(height:number)=>void,
    title:string,
    opacity:number
}
const { measuringCb, title } = defineProps<ServiceProps>()
const {} = useState({})
const goBack =()=> uni.navigateBack()
</script>
<template>
  <NavigationBar  :measuringCb="measuringCb" :opacity="opacity" >
    <div  class="container">
        <image @click="goBack" class="img" src="/static/booking/arrow-left.png" />
        <div :style="{color:`rgb(0,0,0,${opacity})`}" class="title">
            {{ title }}
        </div>
    </div>
  </NavigationBar>
</template>

<style lang='less' scoped>
.container{
    height: 33px;
    width: calc( 100% - 30px );
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
    .img{
        width: 25px;
        height: 25px;
        margin-right: 10px;
        position: absolute;
        left: 0px;
    }
    .title{
        text-align: center;
        font-size: 18px;
        font-weight: bolder;
    }
}
</style>