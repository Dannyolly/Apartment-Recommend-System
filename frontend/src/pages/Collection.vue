<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import HouseCollection from '@/components/House/HouseCollection.vue'
import { LocalStorageManager } from '@/utils/localStorage';
import { Room } from '@/types/serviceEntity/Room';
import { ServiceManager } from '@/service';
import { getDimension, getPlatform } from '@/utils/Equipment';
import { useNoti } from '@/hooks/useNoti';
import Notis from '@/components/public/Notis.vue';
import { onPullDownRefresh } from '@dcloudio/uni-app';

const height = getDimension().height + 'px'
const { arr ,noti } = useState({
    arr:[] as Room[],
    ...useNoti()
})

const cancelItem = (index:number)=>{
  const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
  const ids = LocalStorageManager.getLocalStorageInfo('roomCollectionIds',userId);
  if(!ids) return
  ids.splice(index,1)
  arr.value.splice(index,1)
  LocalStorageManager.setLocalStorageInfo('roomCollectionIds',{
    roomCollectionIds:ids
  },userId)
  noti.value?.open('deleted successfully')
}
async function setup(){
  const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
  let ids = LocalStorageManager.getLocalStorageInfo('roomCollectionIds',userId);
  if(ids && ids.length!==0){
    const { result } = await ServiceManager.RoomService.getRoomsByIds(ids.join(','))
    arr.value = result
  }
}

onPullDownRefresh(async ()=>{
  await setup()
  uni.stopPullDownRefresh()
})

onMounted(async ()=>{
  await setup()
  
})
</script>
<template>
  <div :style="{height}" class='container'>
    <div class="house-container">
        <HouseCollection :key="item.id" v-for="(item,index) in arr" :room="item"  :index="index" :cancelItem="cancelItem"  />
    </div>
  </div>
  <Notis ref="noti" :duration="2000" />
</template>

<style lang='less' scoped>
.container{
    padding: 10px 20px;
    position: relative;
    background-color: rgb(247,247,247);
    .house-container{
        width: calc( 100% - 20px );
        padding: 10px;
        background-color: #FFF;
        border-radius: 10px;
    }
}
</style>