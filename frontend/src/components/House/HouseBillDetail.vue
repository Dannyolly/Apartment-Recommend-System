<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
interface HouseBillDetailProps {
  props?:any
}
const {} = defineProps<HouseBillDetailProps>()
const height = getDimension().height +'px' 
const {} = useState({

})
onMounted(()=>{

})
</script>
<template>
<div  :style='{height:height}' class='container'>
  </div>
</template>

<style lang='less' scoped>
.container{

}
</style>