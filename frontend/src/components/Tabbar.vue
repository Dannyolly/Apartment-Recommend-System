<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import { tenant  , owner } from '@/tabbar'
import { useTabbarStore } from '@/store/Tabbar';
import { storeToRefs } from 'pinia';
import { usePubSub } from '@/hooks/usePubSub';
interface TabbarProps {
  props?:any
}
const {} = defineProps<TabbarProps>()
const height = getDimension().height +'px' 
const pubsub = usePubSub()
const {currentTabBar} = useState({
    currentTabBar:{} as typeof tenant
})
const { currentTabIndex , isTenant } = storeToRefs(useTabbarStore())
watchEffect(()=>{
    isTenant.value? currentTabBar.value = tenant : currentTabBar.value = owner
})
function tabbarOnChange(e:number){
    currentTabIndex.value = e
    uni.switchTab({
        url: currentTabBar.value[e].pagePath,
    });
}
</script>
<template>
<div class="container">
    <u-tabbar
        :value="currentTabIndex"
        @change="tabbarOnChange"
        :placeholder="false"
        :fixed="true"
        :zIndex="10000"
    >
    <u-tabbar-item v-for="page in currentTabBar" :text="page.text">
            <template #active-icon>
                <image
                    class="u-page__item__slot-icon"
                    :src="page.selectedIconPath"
                ></image>
            </template>
            <template #inactive-icon>
                <image
                    class="u-page__item__slot-icon"
                    :src="page.iconPath"
                ></image>
            </template>
    </u-tabbar-item>
    </u-tabbar>
</div>
</template>

<style lang='less' scoped>
.container{
    .u-tabbar-item{
        :deep(.u-tabbar-item__text){
            font-size: 10px;
        }
    }
    .u-page__item__slot-icon{
        width: 27px;
        height: 27px;
    }
}
</style>