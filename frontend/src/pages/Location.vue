<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
interface LocationProps {
    any: any
}
const { } = defineProps<LocationProps>()
const { currentCity } = useState({
    currentCity:'武汉'
})
const cityList = [
    '北京',
    '上海',
    '深圳',
    '杭州',
    '南京',
    '成都',
    '武汉',
    '广州',
    '天津',
    '苏州',
]

const reLocate = ()=>{

}
</script>
<template>
    <div class="location-container">
        <div class="title-1">定位城市</div>
        <div class="user-city">
            <image :showLoading="true" :src="'/static/home/location1.png'" class="pic" mode="aspectFill" />
            <div class="city">{{ currentCity  }}</div>
            <div @click="reLocate" class="re-locate">
                <image :showLoading="true" :src="'/static/home/loading.png'" class="loading-icon" mode="aspectFill" />
                重新定位
            </div>
        </div>
        <div class="title-1" style="padding-top: 30px;margin-bottom: 10px;">選擇城市</div>
        <div class="city-list">
            <div @click="currentCity = item" v-for="(item,index) in cityList" class="city-container">
                <div style="margin-bottom: 0px" >{{ item }}</div>
                <u-icon color="#BCDBEA" size="40" class="icon" v-if="item === currentCity" name="checkmark"></u-icon>
                <u-line length="85%" margin="30rpx"></u-line>
            </div>
        </div>
    </div>
</template>

<style lang='less' scoped>
.location-container {
    width: 100%;
    height: 100%;
    padding: 20px;

    .title-1 {
        color: rgb(164, 164, 164);
        margin-bottom: 10px;
    }

    .user-city {
        width: 100%;
        display: flex;
        position: relative;

        .city {
            width: 100px;
            padding-left: 10px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            border-radius: 5px;
            background-color: rgb(239, 239, 239);
        }

        .pic {
            width: 20px;
            height: 20px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            padding-left: 20px;
        }

        .re-locate {
            display: flex;
            padding-left: 20px;
            align-items: center;
            font-size: 14px;
            color: @text-color;

            .loading-icon {
                width: 20px;
                height: 20px;
                margin-right: 5px;
            }
        }

    }
    .city-list{
        padding-top: 10px;
        position: relative;
        .city-container{
            position: relative;
        }
        .icon{
            position: absolute;
            right: 40px;
            top: 0px;
            color: rgb(188,219,234);
        }
    }
}
</style>