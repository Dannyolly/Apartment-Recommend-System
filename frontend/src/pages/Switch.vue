<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useTabbarStore } from '@/store/Tabbar';
import { usePubSub } from '@/hooks/usePubSub';
interface SwitchProps {
  props?:any
}
const {} = defineProps<SwitchProps>()
const height = getDimension().height - 40 +'px' 
const {  isTenant  ,currentTabIndex }  = storeToRefs(useTabbarStore())
const imgs = ['/static/switch/1.png','/static/switch/2.png']
const change = (index: number) =>{
    isTenant.value  = index === 0
    currentTabIndex.value = 0
    uni.switchTab({
        url:'/pages/tabbar/HomeContainer'
    })

}

</script>
<template>
<div  :style='{height:height}' class='container'>
    <div class="content">
        <div class="title">欢迎来Dan</div>
        <div class="sub-title">以下两种身份可随时切换</div>
        <div  @click="()=>change(index)" v-for="(img,index) in imgs" class="img-container">
            <image mode="aspectFill" :src="img"/>
        </div>
    </div>
</div>
</template>

<style lang='less' scoped>
.container{
    display: flex;
    align-items: center;
    padding: 20px;
    width: calc( 100% - 40px );
    .content{
        width: 100%;
        .title{
            font-size: 26px;
            font-weight: 600;
            display: flex;
            width: 100%;
        }
        .sub-title{
            width: 100%;
            font-size: 14px;
            display: flex;
            color: @desc-color;
            margin-bottom: 20px;
        }
        .img-container{
            box-shadow: 0px 2px 23px 0px #E4E4E4;
            border-radius: 10px;
            margin-bottom: 20px;
            image{
                width: 100%;
                height: 100px;
            }
        }
    }
}
</style>