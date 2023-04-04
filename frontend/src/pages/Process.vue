<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import Notis from '@/components/public/Notis.vue';
import { useNoti } from '@/hooks/useNoti'
const height = getDimension().height + 'px'
const { noti, process } = useState({
    ...useNoti(),
    process: ['订单已创建: 2023-03-21 15:48:54.542', '待管家带客户看房: 2023-03-21 15:48:54.542','订单已创建: 2023-03-21 15:48:54.542','订单已创建: 2023-03-21 15:48:54.542','订单已创建: 2023-03-21 15:48:54.542']
})
onMounted(() => {

})
onLoad((query) => {
    if (!query) return;
    process.value = query.process.split(',')

})
onPageScroll(() => { })
</script>
<template>
    <div :style='{ height: height }' class='container'>
        <div class="title">当前进度</div>
        <div class="process-container">
            <div v-for="(msg,index) in process" class="process">
                <div class="img-container">
                    <image class="img" src="/static/order.png" />
                </div>
                <div class="desc">
                    {{ msg }}
                </div>
                <div v-if="index !== process.length -1" class="connect-line"></div>
            </div>
        </div>
    </div>
    <Notis ref='noti' :duration='2000' />
</template>

<style lang='less' scoped>
.container {
    padding: 20px;
    background-color: rgb(242, 242, 242);

    .title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
    }

    .process-container {
        display: flex;
        background-color: #FFF;
        padding: 10px;
        border-radius: 10px;
        flex-direction: column;
        .process {
            height: 50px;
            position: relative;
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-bottom: 10px;
            .img-container {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #CDCDCD;
                z-index: 1;
                .img {
                    width: 25px;
                    height: 25px;

                }
            }
            .desc{
                width: 80%;
            }
            .connect-line{
                width: 1px;
                height: 100%;
                background-color: #CDCDCD;
                position: absolute;
                z-index: 0;
                bottom: -30px;
                left: 25px;
            }
        }
    }

}</style>