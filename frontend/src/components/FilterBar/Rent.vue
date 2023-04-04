<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import SubmitBar from './SubmitBar.vue';
import { useFilterStore } from '@/store/Filter';
interface RentProps {
    any?: any,
    listIndex:number
}
const { reset ,submit,getCache} = useFilterStore()
const { listIndex } = defineProps<RentProps>()
const { currentIndex } = useState({
    currentIndex:-1
})
const rents = [
    '800元以下',
    '800-1000元',
    '1000-1300元',
    '1300-1500元',
    '1500-2500元',
    '2500-3000元',
    '3000元以上'
]
const rentsMap = {
    '800元以下':'0,800',
    '800-1000元':'800,1000',
    '1000-1300元':'1000,1300',
    '1300-1500元':'1300,1500',
    '1500-2500元':'1500,2500',
    '2500-3000元':'2500,3000',
    '3000元以上':'3000,100000'
}
onMounted(() => {
    const cache = getCache(listIndex)
    if(cache){
        currentIndex.value = cache
    }
})
</script>
<template>
    <div style="position: relative;">
        <view  class='container'>
            <div @click="currentIndex = index" :class="{click:index===currentIndex}" v-for="(item,index) in rents" class="item-container">
                {{ item }}
            </div>
        </view>
    <SubmitBar :reset-callback="()=>{
        currentIndex=-1
        reset(listIndex)
    }" :submit-callback="()=>submit(listIndex,{
        type:'租金',
        // @ts-ignore
        val:rentsMap[rents[currentIndex]]
    },currentIndex)"/>
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