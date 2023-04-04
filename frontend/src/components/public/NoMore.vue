<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
interface NoMoreProps {
  title?:string
}
const {} = withDefaults(
    defineProps<NoMoreProps>(),
    {
        title:'沒有更多了'
    }
)
const height = getDimension().height +'px' 
const {} = useState({

})
onMounted(()=>{

})
onLoad((query)=>{

})
onPageScroll(()=>{})
</script>
<template>
<div class="no-more">
    <image class="img" src="/static/state/nomoreRoom.png"/>
    {{ title }}
</div>
</template>

<style lang='less' scoped>
.no-more{
    padding-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: rgb(247,247,247);
    .img{
        width: 80%;
        height: 300px;
    }
}
</style>