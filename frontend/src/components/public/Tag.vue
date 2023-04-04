<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, CSSProperties} from 'vue';
import {useState} from '@/hooks/useState';
interface TagProps {
    title:string
    color?:string
    bkColor?:string,
    width?:string,
    fontSize?:string,
    contentStyle?:CSSProperties
    click?:()=>void
}
const { contentStyle } = defineProps<TagProps>()
const {} = useState({})

</script>
<template>
  <div @click="()=>{
    click && click()
  }" :style="{ ...contentStyle  ,fontSize:fontSize?fontSize+'px':'12px',width: width?width+'px':'max-content' , backgroundColor:bkColor , color }" class="tag">
    {{ title }}
  </div>
</template>

<style lang='less' scoped>
.tag{
    border-radius: 5px;
    width: min-content;
    background-color: rgb(247, 247, 247);
    color: @text-color;
    font-size: 12px;
    padding: 3px;
    padding-left: 5px;
    padding-right: 5px;
    text-align: center;
}
</style>