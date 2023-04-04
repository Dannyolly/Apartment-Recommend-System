<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
type Option = {
  name:string,
  click:(index:number)=>void
}
interface TagsProps {
  props?:any,
  show:boolean,
  option:Option[]
}
const { show ,option} = defineProps<TagsProps>()
const {} = useState({

})
onMounted(()=>{

})
</script>
<template>
  <div v-if="show" class='container'>
    <div v-for="(item,index) in option">
        <div @click="()=>item.click(index)" class="option">{{ item.name }}</div>
        <u-line v-if="index!==option.length-1" color="#CDCDCD"/>
    </div>
  </div>
</template>

<style lang='less' scoped>
.container{
    position: absolute;
    width: 80px;
    background-color: #FFF;
    box-shadow:  0 0 10px #CDCDCD;
    right: 0px;
    top: 30px;
    z-index: 100;
    .option{
        text-align: center;
        font-size: 13px;
        line-height: 30px;
    }
}
</style>