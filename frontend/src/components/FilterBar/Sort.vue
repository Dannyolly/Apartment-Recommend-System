<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import SubmitBar from './SubmitBar.vue';
import { useFilterStore } from '@/store/Filter';
interface SortProps {
    any?: any,
    listIndex:number
}
const { listIndex } = defineProps<SortProps>()
const { reset ,submit, getCache} = useFilterStore()
const { curSortIndex } = useState({
    curSortIndex:-1
})
const sortRule = [
    '默认排序',
    '价格从低到高',
    '价格从高到低',
    '面积从小到大',
    '面积从大到小',
    '接距离排序',
]
onMounted(() => {
    const cache = getCache(listIndex)
    if(cache){
        curSortIndex.value = cache
    }
})
</script>
<template>
    <div style="position: relative;">
        <view  class='container'>
            <div @click="curSortIndex = index" :class="{click:index===curSortIndex}" v-for="(item,index) in sortRule" class="item-container">
                {{ item }}
            </div>
        </view>
    <SubmitBar :reset-callback="()=>{
        curSortIndex=-1
        reset(listIndex)
    }" :submit-callback="()=>submit(listIndex,{
        type:'排序',
        val:sortRule[curSortIndex]
    },curSortIndex)"/>
    </div>
</template>

<style lang='less' scoped>

.container {
    position: relative;
    height: 250px;
    .item-container{
        position: relative;
        width: 100%;
        height: 37px;
        line-height: 37px;
        justify-content: center;
        text-align: center;
        font-size: 14px;
        color: @text-color;
    }
    .click{
        color: @major-color;
    }
}
</style>