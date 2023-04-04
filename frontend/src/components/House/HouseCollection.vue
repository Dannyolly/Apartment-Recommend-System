<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import House from '../FilterBar/House.vue';
import Tags from '../public/Tags.vue';
import { Room } from '@/types/serviceEntity/Room';
import { LocalStorageManager } from '@/utils/localStorage';
interface HouseCollectionProps {
  room:Room,
  index:number
  cancelItem:(index:number)=>void
}
const { room, index , cancelItem} = defineProps<HouseCollectionProps>()
const { option, show} = useState({
    option:[
        {
            name:'找相似',
            click:()=>{
                uni.navigateTo({
                    url:'/pages/similarRoom?room='+encodeURIComponent(JSON.stringify(room))
                })
            }
        },
        {
            name:'取消收藏',
            click:()=>{
                cancelItem(index)
            }
        }
    ],
    show: false
})
onMounted(()=>{

})
</script>
<template>
  <div  class="house-container">
        <House :post="room"/>
        <div @click="show = !show" class="more">
            <image 
                class="img"
                src="/static/community/more.png"
            />
            <Tags :option="option" :show="show"/>
        </div>
    </div>
</template>

<style lang='less' scoped>

.house-container{
    position: relative;
    .more{
        position: absolute;
        bottom: 10px;
        right: 20px;
        background-color: #f4f4f4;
        width: 30px;
        height: 20px;
        border-radius: 5px;
        justify-content: center;
        display: flex;
        .img{
            width: 20px;
            height: 20px;
        }
    }
}

</style>