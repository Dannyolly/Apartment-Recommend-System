<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import NavigationBar from '@/components/Navigation/NavigationBar.vue'
interface HomeProps {
    city: string,
    measuringCb:(height:number)=>void,
    opacity:number
}
const { city } = defineProps<HomeProps>()
const { text } = useState({
    text: ''
})
function goSearch() {
    uni.navigateTo({
        url: '/pages/search'
    })
}
function chooseCity() {
    uni.navigateTo({
        url: `/pages/location?city=${city}`,
    })
}
</script>
<template>
    <NavigationBar :opacity="opacity"  :measuringCb="measuringCb">
        <div @click="chooseCity" class="location-container">
            武汉
            <image :showLoading="true" :src="'/static/home/location.png'" class="pic" mode="aspectFill" />
        </div>
        <div class="input-container">
            <u-icon class="icon" name="search" color="#CDCDCD" size="40" />
            <input placeholder="请输入内容" v-model="text" @click="goSearch" />
        </div>
    </NavigationBar>
</template>

<style lang='less' scoped>
.location-container {
    display: flex;
    align-items: center;
    font-size: 13px;
    height: 20px;
    padding-bottom: 5px;

    .pic {
        padding-top: 1px;
        width: 17px;
        height: 17px;
    }
}

.input-container {
    padding-left: 20px;
    height: 33px;
    width: 55%;
    position: relative;
    line-height: 33px;

    .icon {
        padding-left: 5px;
        position: absolute;
        font-size: 14px;
        line-height: 30px;
        top: 50%;
        transform: translateY(-50%);
    }

    input {
        height: 33px;
        background-color: #FFFFFF;
        border-radius: 5px;
        font-size: 13px;
        padding-left: 30px;
        box-shadow: 0px 0px 10px #CDCDCD;
    }
}
</style>