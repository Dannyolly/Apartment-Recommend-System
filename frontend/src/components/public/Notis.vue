<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
interface NotisProps {
  offset?:number,
  duration?: number,
  //isTabbar?:boolean
}
const {duration} = withDefaults(
    defineProps<NotisProps>(),
    {
        duration: 2000
        //isTabbar:false
    }
)
const { isMove , info } = useState({
    isMove:false,
    info:''
})

/**
 * 關閉通知
 */
const close = ()=>isMove.value = false
/**
 * 打開通知
 */
const open = (str:string)=>{
    info.value = str
    isMove.value = true
    setTimeout(()=>{
        isMove.value = false
    },duration)
}

defineExpose({
    close,
    open
})

onMounted(()=>{
    //console.log(isTabbar ,  isMove.value);
    
})

</script>
<template>
<div :class="{ move:isMove}" class="notification-container">
    <div  class="notification">
        <u-icon name="info-circle" :size="35"/>
        <div class="info">{{ info }}</div>
    </div>
</div>
</template>

<style lang='less' scoped>
.notification-container{
    position: fixed;
    bottom: -60px;
    padding: 0px 20px;
    z-index: 100;
    width: calc( 100% - 40px );
    transition: all 0.3s;
    
    .notification{
        box-shadow: 0 0 20px #CDCDCD;
        background-color: #FFF;
        border-radius: 10px;
        width: calc( 100% - 40px);
        padding: 10px 20px;
        height: 20px;
        display: flex;
        gap: 15px;
        align-items: center;
        .info{
            font-size: 14px;
            color: @text-color;
            transform: translateY( 1px );
        }
    }
}
.move{
    bottom: 100px;
}
.move1{
    bottom: 20px;
}

</style>