<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useTabbarStore } from '@/store/Tabbar';
import Home from '../Tenantpages/UserInfo.vue';
import OwnerHome from '../ownerpages/userInfo.vue'
const height = getDimension().height +'px' 
const {} = useState({

})
const { isTenant } = storeToRefs(useTabbarStore())
onMounted(()=>{

})
onLoad((query)=>{

})
onPageScroll(()=>{})
</script>
<template>
    <Home v-if="isTenant" />
    <OwnerHome v-else />
</template>

<style lang='less' scoped>
.container{

}
</style>