<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import House from '../FilterBar/House.vue';
import Tags from '../public/Tags.vue';
import { Room } from '@/types/serviceEntity/Room';
interface HouseHistoryProps {
  post:Room
}
const {} = defineProps<HouseHistoryProps>()
const { option, show} = useState({
    option:[
        {
            name:'找相似',
            click:()=>{

            }
        },
    ],
    show: false
})
onMounted(()=>{

})
</script>
<template>
  <div  class="house-container">
        <House :post="post"/>
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