<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import IconBtn from '../public/IconBtn.vue';
interface SubmitBarProps {
  resetCallback:()=>void,
  submitCallback:()=>void
}
const {} = defineProps<SubmitBarProps>()
const {} = useState({

})
onMounted(()=>{

})
</script>
<template>
  <div class='container'>
    <div @click="resetCallback" class="icon-button-container">
        <image src="/static/reset.png" class="image" />
        <div class="name">重置</div>
    </div>
    <div @click="submitCallback" class="submit-container">
        查看公寓
    </div>
  </div>
</template>

<style lang='less' scoped>
.container{
    width: calc( 100% - 40px);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    height: 60px;
    position: absolute;
    bottom: -55px;
    background-color: #FFF;
    left: 0;
    padding: 0px 20px;
    display: flex;
    align-items: center;
    .icon-button-container{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        width: 70px;
        height: 30px;
        margin-right: 20px;
        .image{
            width: 15px;
            height: 15px;
            margin-right: 5px;
        }
    }
    .submit-container{
        display: flex;
        flex: 1;
        height: 30px;
        background-color: @major-color;
        border-radius: 10px;
        color: #FFF;
        justify-content: center;
        line-height: 30px;
        font-size: 13px;
    }
}
</style>