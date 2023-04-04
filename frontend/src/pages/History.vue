<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import House from '@/components/FilterBar/House.vue';
import Tags from '@/components/public/Tags.vue'
import HouseHistory from '@/components/House/HouseHistory.vue'
import { LocalStorageManager } from '@/utils/localStorage';
import { Room } from '@/types/serviceEntity/Room';
import { getFormatDate, getFullTime } from '@/utils/Date';
import { ServiceManager } from '@/service';
import { onPullDownRefresh } from '@dcloudio/uni-app';
interface HistoryProps {
  props?:any
}
const {} = defineProps<HistoryProps>()
type History = {
    [key:string]:Array<Room>
}
const { option, title, arr,show , keyOrder } = useState({
    arr:{} as History,
    keyOrder:[] as string[],
    title:'标题',
    option:[
        '找相似',
        '取消收藏'
    ],
    show: false
})
async function setUp(){
    const id = LocalStorageManager.getLocalStorageInfo('userInfo').id
    const history = LocalStorageManager.getLocalStorageInfo('history',id)
    if(!history) return
    console.log(history);
    // classify
    let temp = {} as History
    for (let i = 0; i < history.length; i++) {
        const v= history[i]
        let time = getFormatDate(new Date(v.date))
        if(!temp[time]){
            temp[time] = []
        }
        temp[time].push(  (await ServiceManager.RoomService.getRoomsByIds(`${v.roomId}`)).result[0] )
    }
    let keys = Object.keys(temp)
    arr.value = temp
    console.log(arr.value);
    keyOrder.value = keys.sort().reverse()
}

onPullDownRefresh(async ()=>{
    await setUp()
    uni.stopPullDownRefresh()
})

onMounted(async ()=>{
    setUp()
})
</script>
<template>
  <div class='container'>
    <div class="title">Dan公寓</div>
    <div v-for="(date,key) in keyOrder" class="item">
        <div class="date">{{ date }}</div>
        <HouseHistory v-for="item in arr[date]" :post="item" />
    </div>
  </div>
</template>

<style lang='less' scoped>
.container{
    padding: 10px 20px;
    position: relative;
    .title{
        font-size: 16px;
        font-weight: bolder;
        margin-bottom: 20px;
    }
    .item{
        .date{
            font-size: 15px;
            color: @text-color;
        }
    }
}
</style>