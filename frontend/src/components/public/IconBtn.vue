<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
type Size = {
        width:number,
        height:number
}
interface IconBtnProps {
    icon:string,
    title:string,
    iconSize?:Size,
    fontSize?:number
}
const { icon  ,title , iconSize , fontSize} = withDefaults(
    defineProps<IconBtnProps>(),
    {   
        iconSize:()=>({width:30,height:30}),
        fontSize:12
    }
)
const {} = useState({})
</script>
<template>
  <div class="container">
    <image
        :src="icon"
        class="image"
        :style="{width:iconSize.width+'px',height:iconSize.height+'px'}"
    />
    <div :style="{ fontSize:fontSize +'px' }" class="title">{{ title }}</div>
  </div>
</template>

<style lang='less' scoped>
.container{
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .image{
        
    }
    .title{
        padding-top: 5px;
        text-align: center;
    }
}

</style>
