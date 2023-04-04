<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import { Room } from '@/types/serviceEntity/Room';
import House from '@/components/FilterBar/House.vue';
import { ServiceManager } from '@/service';

const height = getDimension().height +'px' 
const { originRoom , similarRooms  } = useState({
    originRoom:{} as Room,
    similarRooms:[] as Room[]
})
onMounted(()=>{

})
onLoad(async (query)=>{
    if(!query) return
    originRoom.value = JSON.parse(decodeURIComponent(query.room))
    let houseId = originRoom.value.id
    similarRooms.value =   (await ServiceManager.RoomService.getRecommendRooms(houseId,0,20)).result
})
onPageScroll(()=>{})
</script>
<template>
<div  :style='{height:height}' class='container'>
    <div class="origin-container">
        <House v-if="originRoom.id" :post="originRoom" />
    </div>
    <div style="padding: 10px 0px;font-size: 23px;font-weight: bolder;">相似公寓</div>
    <div class="similar-room">
        <House :post="room" :key="room.id" v-for="room in similarRooms" />
    </div>
</div>
</template>

<style lang='less' scoped>
.container{
    padding: 20px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    .origin-container{

    }

    .similar-room{

    }
}
</style>