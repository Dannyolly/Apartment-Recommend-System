<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { useMapState } from '@/hooks/component/useMapState';
import { getDimension } from '@/utils/Equipment';
import { onLoad } from '@dcloudio/uni-app';
interface communityProps {
  props?:any
}
const {} = defineProps<communityProps>()
const { longitude , latitude ,covers,community } = useState({
    ...useMapState(0,0),
    community:''
})
const height = getDimension().height
const goback = ()=>uni.navigateBack()
onLoad((query)=>{
    // @ts-ignore
    const res = JSON.parse( decodeURIComponent(query.mapInfo))
    longitude.value = res.longitude 
    latitude.value = res.latitude
    covers.value = res.covers
    community.value = res.community
})

</script>
<template>
  <div  class='container'>
    <div @click="goback" class="back-container" >
        <image class="img" src="/static/map/back.png" />
    </div>
    <div class="map-container" :style="{height:(height-130)+'px'}">
        <map 
            style="width: 100%;height: 100%;" 
            :latitude="latitude" 
            :longitude="longitude" 
            :markers="covers"
        >
		</map>
    </div>
    <div class="interact-container">
        <div class="title">{{ community }}</div>
        <div class="sec-title">{{ community }}</div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.container{
    position: relative;
    .back-container{
        z-index: 100;
        position: absolute;
        top: 52px;
        left: 20px;
        width: 25px;
        height: 25px;
        background-color: #fff;
        border-radius: 50%;
        .img{
            width: 25px;
            height: 25px;
        }
    }
    .map-container{
        display: flex;
        flex: 1;
    }
    .interact-container{
        width: 100%;
        height: 130px;
        padding: 20px;
        padding-bottom: 40px;
        .title{
            font-size: 20px;
            font-weight: bolder;
            margin-bottom: 15px;
        }
        .sec-title{
            font-size: 14px;
        }
    }
}
</style>