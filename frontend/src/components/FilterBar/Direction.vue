<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import SubmitBar from './SubmitBar.vue';
import { useFilterStore } from '@/store/Filter';
interface DirectionProps {
    any?: any,
    listIndex:number
}
const {listIndex } = defineProps<DirectionProps>()
const { currentIndex } = useState({
    currentIndex:-1
})
const { reset ,submit , getCache} = useFilterStore()
const directions = [
    '东','南','西','北',
    '东南', 
    '西南', 
    '东北',
    '西北'
]
onMounted(() => {
    const cache = getCache(listIndex)
    if(cache !== undefined ){
        currentIndex.value = cache
    }
})
</script>
<template>
    <div class='container'>
        <div @click="currentIndex = index" :class="{click:index===currentIndex}" v-for="(item,index) in directions" class="item-container">
            {{ item }}
        </div>
        <SubmitBar :reset-callback="()=>{
            currentIndex = -1
            reset(listIndex)
        }" :submit-callback="()=>submit(listIndex,{
            type:'朝向',
            val:directions[currentIndex]
        },currentIndex)"/>
    </div>
</template>

<style lang='less' scoped>
.container {
    position: relative;
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