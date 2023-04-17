<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, unref, nextTick } from 'vue';
import { useState } from '@/hooks/useState';
import Area from '@/data/wuhan.json'
import FilterSearch from '@/components/Navigation/FilterSearch.vue'
import MyInput from '@/components/public/Input.vue'
import FilterBar from '@/components/FilterBar/FilterBar.vue';
import Location from '@/components/FilterBar/Location.vue';
import Direction from '@/components/FilterBar/Direction.vue'
import Rent from '@/components/FilterBar/Rent.vue'
import More from '@/components/FilterBar/More.vue';
import Sort from '@/components/FilterBar/Sort.vue'
import { useFilterStore } from '@/store/Filter';
import { storeToRefs } from 'pinia';
import HousePost from '@/components/House/HousePost.vue';
import House from '@/components/FilterBar/House.vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { FilterOption, Room } from '@/types/serviceEntity/Room';
import { usePicker } from '@/hooks/usePicker';
import { ServiceManager } from '@/service';
import { usePage } from '@/hooks/usePage'
interface SearchProps { }
const { } = defineProps<SearchProps>()
const areaList = Area as Array<any>
const filterOption = [
  '位置',
  '朝向',
  '租金',
  '更多'
]

const { text  , pageSize, currentPage ,dataList,isLoading,status } = useState({
  ...usePage(1,5),
  text:'',
  isLoading:false,
  dataList:[] as Room[],
  status:'loading',
})
const { show, columns ,cur } = usePicker(['小区'])

const { filterSetting ,cache  } = storeToRefs(useFilterStore())
const { setSubmitCb , setResetCb , submit  } = useFilterStore()
const confirmPicker = (e:any)=>{
  show.value = false
  cur.value = e.value[0]
}
const input = ref<InstanceType<typeof MyInput>>()
const filterBar =ref<InstanceType<typeof FilterBar>>()

// 小区
const commitText = (keyword:string)=>{
  const obj = {
     type:cur.value,
     val:keyword
  }
  submit(5,obj,obj)
}

const handleLocation = (v:any,opt:FilterOption)=>{
  if(v.type === '商圈'){
    opt.road = v.val
  }
  if(v.type === '地铁'){
    opt.traffic = v.val[0]
  }
}

const handleSort = (v:any,opt:FilterOption)=>{
  if(v.val === '默认排序'){
    return
  }
  const sortRuleMap = {
    '价格从低到高': ()=>{
      opt.orderBy = 'price' 
      opt.sort = 'asc'
    } ,
    '价格从高到低':()=>{
      opt.orderBy = 'price' 
      opt.sort = 'desc'
    } ,
    '面积从小到大':()=>{
      opt.orderBy ='areaSize' 
      opt.sort = 'asc'
    } ,
    '面积从大到小':()=>{
      opt.orderBy ='areaSize' 
      opt.sort = 'desc'
    } ,
  }
  // @ts-ignore
  sortRuleMap[v.val]()
}
const handleMore = (v:any,opt:FilterOption)=>{
    let choice:{title:string,val:string}[] =  v.val
    choice.forEach(val => {
        if(val.title === '面积'){
          [ opt.lowestAreaSize , opt.highestAreaSize ] = val.val.split('-').map(Number.parseFloat)
        }else{
          opt.floorInfo =  val.val
        }
    });
}
const collectOpt = ()=>{
  let opt = {  } as FilterOption
  console.log(filterSetting.value);
  
  filterSetting.value.forEach((v,i)=>{
    switch(i){
      case 0:
        handleLocation(v,opt);
        break;
      case 1:
        opt.ori = v.val
        break;
      case 2:
        [opt.lowestPrice,opt.highestPrice]  = v.val.split(',').map(Number.parseFloat)
        break;
      case 3:
        handleMore(v,opt)
        break;
      case 4:
        handleSort(v,opt);
        break;
      case 5:
        opt.community = v.val
        break;
    }
  })
  return opt
}

const onFocus = ()=>{
  uni.navigateBack()
}
const commitAllOptions = async ()=>{
  filterBar.value?.setCurrentIndex(-1)
  let opt = collectOpt()
  dataList.value = []
  currentPage.value = 1
  const res = await ServiceManager.RoomService.getRoomsByOption(opt,currentPage.value++,pageSize.value);
  if(res.result.length === 0){
    status.value = 'nomore'
    return;
  }
  dataList.value = [...res.result]
  isLoading.value = false
  //console.log(dataList.value);
  
}

onReachBottom(async ()=>{
  //console.log('reach bottom!');
  if(status.value === 'nomore') return
  isLoading.value = true
  setTimeout(async ()=>{
    let opt = collectOpt()
    let res = (await ServiceManager.RoomService.getRoomsByOption(opt, currentPage.value++, pageSize.value)).result
    
    if(res.length===0){
      status.value = 'nomore'
      //isLoading.value = false
    }else{
      dataList.value.push(...res)
    }
  },1000)
  //commitAllOptions()
})

// @ts-ignore
onLoad(async ({keyword,option})=>{
  setSubmitCb(commitAllOptions)  
  if(keyword!=='' && keyword!==undefined){
    text.value = keyword
    let obj = {
      type:'小区',
      val:keyword
    }
    submit(5,obj,obj)
    nextTick(()=>{
      input.value?.setText(keyword)
    })
  }else{
    commitAllOptions()
    //dataList.value = (await ServiceManager.RoomService.getRoomsByOption({},currentPage.value++,pageSize.value)).result
  }
})


</script>
<template>
  <div class="container">
    <u-picker @confirm="confirmPicker" @cancel="show = false" closeOnClickOverlay :show="show" :columns="columns"></u-picker>
    <u-sticky>
      <div class="fixed-container">
        <div  class="input-container">
          <div @click="show = true" class="option">
                {{ cur }}
                <image class="img" src="/static/down.png" />
          </div>
          <MyInput 
              ref="input"
              :commmit="commitText"
              :onFocus="onFocus"
              :show-icon="false" 
              border-radius="20" 
              width="100%" 
              box-shadow="''" 
              bk-color="#fafafa" 
              :padding-left="60"
          />
          <div style="margin-bottom: 10px;" />
        </div>
        <FilterBar ref="filterBar"  :filter-options="filterOption" v-slot="{ currentIndex }">
          <Location   v-if="currentIndex === 0" :data="areaList"  :list-index="0"  />
          <Direction  v-if="currentIndex === 1"  :list-index="1"  />
          <Rent       v-if="currentIndex === 2" :list-index="2"  />
          <More       v-if="currentIndex === 3"  :list-index="3"  />
          <Sort       v-if="currentIndex === 4"  :list-index="4" />
        </FilterBar>
      </div>
    </u-sticky>
    <div v-if="dataList.length" class="post-container">
        <House :padding="15" v-for="item in dataList" :post="item"/>
    </div>
    <div v-else class="nomore">
        <image class="img" src="/static/state/nomoreRoom.png" />
        <div class="title">暂无匹配房源</div>
        <div class="sub-title">未找到合适的房源，来看看推荐的吧~</div>
    </div>
    <div v-show="isLoading" class="loading-container">
        <u-loadmore  lineColor="#CDCDCD" :status="status" loadingText="加载更多" :fontSize="34" :iconSize="40" />
      </div>
  </div>
</template>

<style lang='less' scoped>
.container {
  margin-bottom: 0px;
  padding-bottom: 40px;
  .fixed-container{
    z-index: 1;
    transform: translateY( -1px );
    background-color: #FFF;
    padding-bottom: 45px;
    .input-container {
      padding: 0 20px;
      width: calc(100%-40px);
      position: relative;
      .option{
            z-index: 1;
            position: absolute;
            left: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 13px;
            width: 60px;
            top: 50%;
            transform: translateY( -55% );
            .img{
                width: 12px;
                height: 12px;
                padding-left: 2px;
                transform: translateY(2px);
            }
        }
    }
  }
  .post-container{
    z-index: 0;
    padding: 20px;
    padding-left: 25px;
    padding-bottom: 20px;
    width: calc( 100% - 40px );
    padding-top: 0px;
    
  }
  .nomore{
    padding-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .img{
      width: 250px;
      height: 250px;
    }
    .title{
      font-weight: 600;
      font-size: 18px ;
      padding: 5px 0px;
    }
    .sub-title{
      color: @desc-color;
    }
  }
}

</style>