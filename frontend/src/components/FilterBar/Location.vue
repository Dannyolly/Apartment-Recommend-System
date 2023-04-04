<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, nextTick } from 'vue';
import { useState } from '@/hooks/useState';
import { computed } from '@vue/reactivity';
import List from './List.vue'
import ListItem from './ListItem.vue'
import { Area } from '@/types/Entity/Area';
import SubmitBar from './SubmitBar.vue'
import { useFilterStore } from '@/store/Filter';
import HousePost from '../House/HousePost.vue';
interface AreaProps {
  data: Array<Area>,
  listIndex:number
}
const { reset ,submit ,getCache } = useFilterStore()
const { data ,listIndex } = defineProps<AreaProps>()
type State = {
  currentIndex:number[],
  orginalDataList:any[],
  dataList:string[][],
  listDeep:number[],
  choice:any
}
const { currentIndex, orginalDataList ,dataList,listDeep ,choice} = useState<State>({
  currentIndex: [-1, -1, -1],
  orginalDataList:[] ,
  dataList:[
    ['附近', '商圈', '地铁'],
    [],
    []
  ] ,
  listDeep:[] ,
  choice:[] 
})


const getDataListDeep = ()=>{
  const deepArr = [0,0,0]
  orginalDataList.value.forEach((val,ind)=>{
    val.forEach((v,i)=>{
      if(typeof v === 'string'){
        deepArr[i]++;
      }
      if(typeof v === 'object' && v.length!==0){
        deepArr[i]++;
      }
    })
  })
  listDeep.value = deepArr
}
const getDataByCurrentIndex = ()=>{
  let temp = []
  if(currentIndex.value[1]!==-1){
    temp = orginalDataList.value[2][currentIndex.value[0]][currentIndex.value[1]]
  }
  else if(currentIndex.value[0]!==-1  ){
    temp = orginalDataList.value[1][currentIndex.value[0]]
  }
  return temp
}
const onClick = (col: number, row: number) => {

  // 假设点击的是1列..
  if(col===0){
    currentIndex.value = [row,-1,-1]
  }
  
  // 获取列
  if (col < currentIndex.value.length - 1) {
    currentIndex.value[col] = row
    dataList.value[col +1 ] = getDataByCurrentIndex()
   
  } else {
    currentIndex.value[col] = row
  }

  // 到底了
  let index = currentIndex.value[0]
  if(col+1 === listDeep.value[index]){
    let order:any
    let item = orginalDataList.value[col];
    currentIndex.value.forEach(v=>{
      if(v!==-1 && item){
        item = item.at(v)
      }
      if(v!==-1 && !item){
        item = orginalDataList.value.at(v)
      } 
    })
    //order = [ orginalDataList.value[0][currentIndex.value[0]] , item ]
    order =  item 
    choice.value = {
      type:dataList.value[0][currentIndex.value[0]],
      val:order
    }
  }

}
const resetAll = ()=>{
  currentIndex.value = [-1,-1,-1]
  dataList.value = [
    ['附近', '小区', '地铁'],
    [],
    []
  ]
}
const treeToList = () =>{
  let temp = [
    ['附近', '小区', '地铁'],
    [
      [
        '1000米以内','2000米以内', '3000米以内', 
      ],
      [

      ],
      [
        '1号线','2号线','3号线',
        '4号线','5号线','6号线',
        '7号线','8号线','9号线'
      ]
    ],
    [
      [],
      [],
      [
      ]
    ]
  ]
  temp[1][1] =  data.map((v)=>{
    return v.title
  })
  temp[2][1] = data.map(v=>{
      return v.community
  })
  orginalDataList.value = temp
  getDataListDeep()
}

onMounted(() => {
  const state:State|undefined = getCache(listIndex)

  if(state){
    currentIndex.value = state.currentIndex
    orginalDataList.value = state.orginalDataList
    dataList.value = state.dataList
    listDeep.value = state.listDeep
    choice.value = choice.value
  }else{
    // first time ---- 
    treeToList()
  }
  
})

</script>
<template>
  <view class='container'>
    <div :style="{
      width: col === 0 ? '100%' :
        currentIndex[col-1] === -1  ? 0 : '100%'
      }"  
      v-for="(item, col) in dataList" 
      class='item-outer-container'>
      <div class="item-container" style="display: flex;flex: 1;flex-direction: column;align-items: center;">
        <div :class="{ clicked: currentIndex[col] === row }" @click="onClick(col,row)"
          v-for="(item1, row) in item" class="item-second-container">
          {{ item1 }}
          <div class="underline"></div>
        </div>
      </div>
    </div>
    <SubmitBar :reset-callback="()=>{
      resetAll()
      reset(listIndex)
    }" :submit-callback="()=>submit(listIndex,choice,{currentIndex,orginalDataList,dataList,listDeep,choice})"  
    />
  </view>
</template>

<style lang='less' scoped>
.container {
  width: calc(100% - 20px);
  height: 300px;
  padding: 10px;
  display: flex;
  position: relative;
  .item-outer-container {
    display: flex;
    transition: all 0.2s;

    .item-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      overflow-y: scroll;

      .item-second-container {
        position: relative;
        width: fit-content;
        height: 37px;
        line-height: 37px;
        justify-content: center;
        text-align: center;
        font-size: 14px;
        color: @text-color;

        .underline {
          width: 130%;
          height: 1px;
          position: absolute;
          left: -15%;
          bottom: 0;
        }
      }

      .clicked {
        color: @major-color;

        .underline {
          background-color: @major-color;
        }
      }
    }
  }
}
</style>