<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import SubmitBar from './SubmitBar.vue';
import { useFilterStore } from '@/store/Filter';
interface RentProps {
    any?: any,
    listIndex:number
}
const { reset ,submit,getCache } = useFilterStore()
const {listIndex} = defineProps<RentProps>()
type Res = [ optionsArr:number[], choice:any[] ] | undefined
const { optionsArr,choice } = useState({
    optionsArr:[-1,-1,-1],
    choice:[] as any[]
})
const options =[
    {
        title:'租期时长',
        content:[
            '长租1年',
            '长租1年以上',
            '可短签',
        ]
    },
    {
        title:'面积',
        content:[
            '0-60',
            '60-80',
            '80-90',
            '90-100',
            '100-120',
            '120-130',
            '130-150',
            '150-10000'
        ]
    },
    {
        title:'楼层',
        content:[
            '低层','中层','高层'
        ]
    },
]
const onClick=(row:number,col:number)=>{
    if(choice.value[row]){
        choice.value[row].title = options[row].title
        choice.value[row].val = options[row].content[col]
    }else{
       choice.value[row] = {
            title:options[row].title,
            val:options[row].content[col]
        } 
    }
    
    optionsArr.value[row] = col
}
const resetAll = ()=>{
    optionsArr.value = [-1,-1,-1]
    choice.value = []
}
onMounted(() => {
    const cache:Res = getCache(listIndex)
    if(cache ){
        const [ optionsArrT ,choiceT ] = cache
        optionsArr.value =optionsArrT
        choice.value = choiceT
    }
})
</script>
<template>
    <div class="container">
        <div v-for="(item,row) in options" class="option-container">
            <div class="title">
                {{ item.title }}
            </div>
            <div class="option-list">
                <div :class="{clicked:optionsArr[row] === col}" @click="e=>onClick(row,col)" v-for="(option,col) in item.content" class="option">
                    {{ item.title === '面积' ? option +'m²': option }}
                </div>
            </div>
            <SubmitBar :reset-callback="()=>{
                resetAll()
                reset(listIndex)
            }" :submit-callback="()=>submit(listIndex,{
                type:'更多',
                val:choice
            },[optionsArr,choice])"/>
        </div>
    </div>
    
</template>

<style lang='less' scoped>

.container {
    position: relative;
    height: 500px;
    width: calc( 100% - 40px);
    padding: 20px;
    .option-container{
        .title{
            font-size: 15px;
            margin-bottom: 20px;
            color: #444444;
        }
        .option-list{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
            .option{ 
                display: flex;
                background-color: rgb(239,239,239);
                padding: 5px 10px;
                border-radius: 5px;
                color: #999999;
                font-size: 13px;
            }
            .clicked{
                color: #FFF;
                background-color: @major-color;
            }
        }
        
    }
}
</style>