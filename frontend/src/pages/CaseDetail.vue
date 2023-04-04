<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, watch} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import Notis from '@/components/public/Notis.vue';
import { useNoti } from '@/hooks/useNoti'
import { Case } from '@/types/case';
import cases from '@/data/cases.json'
import { baseUrl } from '@/api/config';
interface CaseDetailProps {
  props?:any
}
const {} = defineProps<CaseDetailProps>()
const height = getDimension().height +'px' 
const { noti ,caseDetail , swiper , beforeImgStartIndex , curState ,currentSwiperIndex } = useState({
 ...useNoti(),
 caseDetail:{} as Case,
 swiper:[] as string[],
 beforeImgStartIndex:0,
 curState:0,
 currentSwiperIndex:0
})
function change(index: { current: number }){
    currentSwiperIndex.value = index.current
}
function click(index:number){
    curState.value = index
    index ? currentSwiperIndex.value = beforeImgStartIndex.value  : currentSwiperIndex.value =  0
}
function go(){
    uni.navigateTo({
        url:'/pages/lease'
    })
}
watch(currentSwiperIndex,()=>{
    if(currentSwiperIndex.value >= beforeImgStartIndex.value){
        curState.value = 1
    }else{
        curState.value = 0
    }
})

onLoad((query)=>{
    if(!query) return
    caseDetail.value = JSON.parse(decodeURIComponent(query.case))
    swiper.value = [...caseDetail.value.afterImgs,...caseDetail.value.beforeImgs]
    beforeImgStartIndex.value = caseDetail.value.afterImgs.length
    //console.log(caseDetail.value);
})

onPageScroll(()=>{})
</script>
<template>
<div v-if="caseDetail" :style='{height:height}' class='container'>
    <div style="position: relative;">
        <u-swiper
            :current="currentSwiperIndex"
            :list="swiper"
            :autoplay="false"
            height="550"
            @change="change"
        />
        <div class="indicator">
            <div @click="()=>click(0)" class="state">装修后</div>
            <div @click="()=>click(1)" class="state">装修前</div>
            <div :style="{left: curState? '61px' : '5px' }" class="cur"></div>
        </div>
    </div>
    <div  class="info">
        <div class="title">{{ caseDetail.houseTitle }}</div>
        <div class="tips">{{ caseDetail.houseTips }}</div>
        <div class="price">{{ caseDetail.predictPrice }}元/月</div>
        <image v-if="caseDetail.case" mode="aspectFill" class="case-detail" :src="baseUrl + caseDetail.case" />
    </div>
    <div class="bottom-tabbar">
        <div  class="btn-2">
            电话咨询
        </div>
        <div @click="go" class="btn-2">
            我要出租
        </div>
    </div>
</div>
<Notis ref='noti'  :duration='2000' />
</template>

<style lang='less' scoped>
.container{
    padding-bottom: 300px;
    .indicator{
        position: absolute;
        display: flex;
        font-size: 12px;
        padding: 4px 10px;
        color: #FFF;
        border-radius: 20px;
        bottom: 20px;
        left: 50%;
        transform: translateX( -50% );
        background-color: rgba(0,0,0,.48);
        .state{
            padding: 0 10px;
            z-index: 1;
        }
        .cur{
            z-index: 0;
            position: absolute;
            width: calc( 50% );
            left: 5px;
            height: calc( 100% - 8px);
            border-radius: 10px;
            background-color: @major-color;
            transition: all 0.3s;
        }
    }
    .info{
        width: calc( 100% - 30px );
        padding: 20px 15px;
        transform: translateY(-10px);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #FFF;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .title{
            font-size: 16px;
            font-weight: 600;
        }
        .tips{
            font-size: 12px;
            color: @desc-color;
        }
        .price{
            font-size: 14px;
            font-weight: 600;
        }
        .case-detail{
            width: 100%;
            height: 1100px;
        }
    }
    .bottom-tabbar{
        z-index: @bottom-bar-z-index;
        box-shadow: 0px 0px 20px #CDCDCD;
        position: fixed;
        width: calc( 100% - 40px );
        max-height: 74px;
        height: 45px;
        padding: 5px 20px;
        padding-bottom: 34px;
        background-color: #FFF;
        bottom: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 15px;
        .btn-2{
            flex: 0.4;
            height: 35px;
            background-color: @major2-color;
            text-align: center;
            line-height: 35px;
            color: #FFF;
            font-size: 13px;
            border-radius: 5px;
        }
    }
}
</style>