<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, onUnmounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { Area } from '@/types/Entity/Area'
import { useFilterStore } from '@/store/Filter';
import { storeToRefs } from 'pinia';
interface FilterBarProps {
  filterOptions:string[],
}
const height = getDimension().height - 43
const {filterOptions} = defineProps<FilterBarProps>()
const {setSubmitCb,setResetCb} = useFilterStore()
const { filterSetting  } = storeToRefs(useFilterStore())
const { currentIndex ,curFilterOptions } = useState({
  currentIndex:-1,
  curFilterOptions:[] as string[]
})
const onClick= (index:number)=>{
  currentIndex.value===index?currentIndex.value=-1:currentIndex.value  = index
}
const setCurrentIndex = (index:number)=>currentIndex.value=index
defineExpose({
  setCurrentIndex
})

onMounted(()=>{
  curFilterOptions.value = [...filterOptions]
})

onUnmounted(()=>{
  useFilterStore().$reset()
})
</script>
<template>
  <div :style="{height:currentIndex!==-1?height+'px':0}" class='container'>
    <div class="top-container">
      <div @click="()=>onClick(index)" v-for="(item,index ) in filterOptions" class="item-container">
          <div :style="{color:(currentIndex===index || filterSetting[index]) ?'rgb(36,172,242)':''}" class="title">
            {{ item }}
          </div>
          <div class="icon-container">
            <image
              :class="{clicked:currentIndex===index  }"
              class="icon"
              :src="currentIndex ===index?'/static/down-clicked.png' :'/static/down.png'"
            />
          </div>
      </div>  
      <image @click="()=>onClick(filterOptions.length)"
        class="options"
        src="/static/options.png"
      />
    </div>
    <div class="slot-container">
      <slot :currentIndex="currentIndex"  ></slot>
    </div>
    <div @click="currentIndex=-1" v-if="currentIndex!==-1" class="overlay">

    </div>
  </div>
</template>

<style lang='less' scoped>
.clicked{
  transform: rotateZ( 180deg );
}
.container{
  z-index: 1000;
  display: flex;
  position: absolute;
  top: 43px;
  width: calc( 100% - 0px);
  transform: all 0.3s;
  flex-direction: column;
  .slot-container{
    width: 100%;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: #FFF;
  }
  .top-container{
    display: flex;
    width: calc( 100% - 30px);
    height: max-content;
    padding: 10px 15px;
    padding-bottom: 15px;
    border-bottom-width: 1px;
    border-bottom-color: #CDCDCD;
    .item-container{
        margin-right: 20px;
        flex: 1;
        display: flex;
        justify-content: center;
        .title{
          font-size: 14px;
          margin-right: 2px;
        }
        .icon-container{
          display: flex;
          justify-content: center;
          align-items: center;
          .icon{
            transition: all 0.3s;
            width: 12px;
            height: 12px;
          }
        }
    }
    .options{
    width: 20px;
    height: 20px;
    
  }
  }
  .overlay{
    display: flex;
    flex:1;
    width: 100%;
    background-color: rgba(0,0,0,.5)
  }
}
</style>