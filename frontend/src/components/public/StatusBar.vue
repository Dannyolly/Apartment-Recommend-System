<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';


</script>
<template>
    <u-status-bar></u-status-bar>
</template>

<style lang='less' scoped>
.container{

}
</style>