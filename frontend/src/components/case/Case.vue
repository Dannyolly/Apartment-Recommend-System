<script setup lang='ts'>
import { onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
// @ts-ignore
import { Case } from '@/types/case';
interface caseEntityProps {
  caseEntity:Case
}
const { caseEntity } = defineProps<caseEntityProps>()
const goDetail = ()=>{
  uni.navigateTo({
    url:'/pages/CaseDetail?case='+encodeURIComponent(JSON.stringify(caseEntity))
  })
}
</script>
<template>
<div @click="goDetail"  class='container'>
  <image :src="caseEntity.afterImgs[0]"/>
  <div style="padding: 0 10px;">
    <div class="title">{{ caseEntity.houseTitle }}</div>
    <div class="tips">{{  caseEntity.houseTips }}</div>
    <div class="price">${{ caseEntity.predictPrice }}/月</div>
  </div>
</div>
</template>

<style lang='less' scoped>
.container{
  padding: 5px;
  margin-bottom: 10px;
  image{
    width: 100%;
    height: 200px;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  .title{
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  .tips{
    font-size: 11px;
    color: @desc-color;
    margin-bottom: 10px;
  }
  .price{
    font-size: 16px;
    font-weight: 500;
  }
}
</style>