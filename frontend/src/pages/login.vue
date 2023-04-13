<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useTabbarStore } from '@/store/Tabbar';
import { usePubSub } from '@/hooks/usePubSub';
interface SwitchProps {
  login:()=>void
}
const { login } = defineProps<SwitchProps>()
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
        <div class="sub-title">请先登入</div>
        <div >
            <div @click="login" class="login-btn">
                使用微信一键登入
            </div>
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
        .login-btn{
            background-color: rgb(66,185,131);
            padding: 8px 20px;
            border-radius: 20px;
            text-align: center;
            color: #FFF;

        }
    }
}
</style>