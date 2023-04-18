<script setup lang='ts'>
import {defineProps, toRefs, ref, watchEffect, onMounted, watch, onUnmounted} from 'vue';
import {useState} from '@/hooks/useState';
import HousePost from '@/components/House/HousePost.vue'
import NavigationBar from '@/components/Navigation/NavigationBar.vue';

import { onInit, onLoad, onPageScroll, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import SwiperList from '@/components/public/SwiperList.vue'
import { DataList } from '@/types/Entity/DataList';
import { pxToRpx } from '@/utils/Equipment'
import HomeNavigation from '@/components/Navigation/Home.vue';
import { ServiceManager } from '@/service';
import { LocalStorageManager } from '@/utils/localStorage';
import { usePage } from '@/hooks/usePage';
import { Room, RoomVisitHistory } from '@/types/serviceEntity/Room';
import { computed } from '@vue/reactivity';
import { RecommendRecordHandler } from '@/utils/RecommendRecordHandler'
import Tabbar from '@/components/Tabbar.vue'
import { shuffleArray } from '@/utils/array';
import { tSExpressionWithTypeArguments } from '@babel/types';
import Notis from '@/components/public/Notis.vue';
import { useNoti } from '@/hooks/useNoti';
import { useTabbarStore } from '@/store/Tabbar';
import { storeToRefs } from 'pinia';
import { del } from 'vue-demi';

interface HomeProps {
  any?:any
}
const {} = defineProps<HomeProps>()
const swiper = [
  'https://webimg.ziroom.com/a876a6f5-7cce-44d9-b96c-97e8065e5ae4.jpg',
  'https://webimg.ziroom.com/ca74e2fb-5313-4574-a6a0-9a37d7dc303e.jpg',
  'https://webimg.ziroom.com/3d2b17f5-b59b-4495-a1b0-71b4a109e12c.jpg'
]
type Option ={
  title:string,
  pic:string,
  onClick:()=>void
}
const options:Array<Option> = [
  {
    title:'合租',
    pic:'/static/home/3.png',
    onClick:()=>{}
  },
  {
    title:'整租',
    pic:'/static/home/4.png',
    onClick:()=>{}
  },
  {
    title:'预订公寓',
    pic:'/static/home/5.png',
    onClick:()=>{}
  },
  {
    title:'中短租',
    pic:'/static/home/6.png',
    onClick:()=>{}
  },
]
const scrollTopMax = 120

let rRecord = new RecommendRecordHandler(true)
const {isTenant} = storeToRefs( useTabbarStore())
const { 
  status,
  navigationBarHeight,
  dataList ,
  housePostArr,
  opacity,
  isLoading,
  pageSize,
  currentPage,
  history,
  currentPageIndex,
  swiperListRef,
  isSetup,
  tabbarVal,
  noti,
  isNewUser
} = useState({
  housePostArr:[1,2,3],
  opacity:0,
  navigationBarHeight:0,
  dataList:[] as Array<DataList>,
  status:'loading',
  isLoading:false,
  history:[] as RoomVisitHistory[],
  swiperListRef:null as unknown as InstanceType<typeof SwiperList>,
  currentPage:[1,1],
  currentPageIndex:0,
  pageSize:5,
  isSetup:false,
  tabbarVal:'',
  ...useNoti(),
  isNewUser:false
})

const onClickSwiper = ()=>{}

const getPerferenceOptions = ()=>{
  const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
  const perference = LocalStorageManager.getLocalStorageInfo('perference',userId)
  if(!perference) return
  let temp = {
    community:perference.community,
    floorInfo:perference.floor,
    lowestPrice:Number(perference.lowestPrice),
    highestPrice:Number(perference.highestPrice)
  }
  if(!perference.community){
      delete temp.community
    }
    if(!perference.floor){
      delete temp.floorInfo
  }
  return temp
} 

onReachBottom(async ()=>{
  if(status.value === 'nomore'){
    return
  }
  if(isNewUser.value){
    currentPage.value[0] ++;
    const temp = getPerferenceOptions()
    const res = await ServiceManager.RoomService.getHotRoomsByOptions(
      temp,
      currentPage.value[0],
      pageSize.value
    )
    if(res.result.length===0) {
      status.value = 'nomore'
      return
    }
    dataList.value[0].data.push(...res.result)
    return
  }


  if(!isTenant.value) return
  if(swiperListRef.value.currentIndex){
    
    // 热门
    isLoading.value = true
    currentPage.value[1] ++;
    let res = await ServiceManager.RoomService.getHotRooms(currentPage.value[1],pageSize.value)
    if(res.result.length===0) {
      status.value = 'nomore'
      return
    }
    setTimeout(()=>{
      dataList.value[1].data= [...dataList.value[1].data,...res.result]
      isLoading.value = false
    },1000)
  }else{
    isLoading.value = true
    currentPage.value[0] ++;
    const res = await rRecord.recommend()
    if(res.length===0){
      status.value = 'nomore'
      return
    }
    setTimeout(async ()=>{
      dataList.value[0].data.push(...res)
      isLoading.value = false
    },1000)
    
  }
 
})

onPageScroll(({scrollTop})=>{
  if(scrollTop>scrollTopMax+100){
    return 
  }
  opacity.value = scrollTop / scrollTopMax
})

watchEffect(async()=>{
  // 当转换列表时做的操作
  if(!swiperListRef.value) return
  currentPageIndex.value = swiperListRef.value.currentIndex
})

watch(currentPageIndex,async()=>{
  // 初始化...
  
  if(dataList.value[currentPageIndex.value]?.data.length!==0)  return 
  if(currentPageIndex.value){
    const res = await ServiceManager.RoomService.getHotRooms(currentPage.value[0],pageSize.value)
    dataList.value[1].data.push(...res.result)
    
  }else{
    
    
  }
},{immediate:true})




onMounted(async ()=>{
  console.log("App init",dataList.value);
  // uni.clearStorageSync()
  const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
  const history = LocalStorageManager.getLocalStorageInfo('history',userId) ?? []
  if(history.length === 0 ){
    isNewUser.value = true
    const temp = getPerferenceOptions()
    const res = await ServiceManager.RoomService.getHotRoomsByOptions(
      {},
      currentPage.value[0],
      pageSize.value
    )
    dataList.value = [
      {
          title:'热门',
          data:[...res.result]
      }
    ]
    return

  }else{

    dataList.value= [
      {
          title:'推荐',
          data:[]
      },
      {
          title:'热门',
          data:[]
      }
    ]
    rRecord.resetRecommendRecord()
    dataList.value[0].data.push(...await rRecord.recommend())
  }
  
})

onPullDownRefresh(async()=>{
  let result:Room[] = []
  if(isNewUser.value) {
    uni.stopPullDownRefresh()
    console.log('ok');
    
    return
  }
  if(currentPageIndex.value){

  }else{
    result = await rRecord.recommend()
    
  }
  
  setTimeout(()=>{
    dataList.value[0].data = [ ...result,...dataList.value[0].data]
    uni.stopPullDownRefresh()
    noti.value?.open('加载了新的8条数据')
  },1000)
})

</script>
<template>
    <view class="home-container">
      <HomeNavigation city="武汉" :measuring-cb="(height: number)=>navigationBarHeight = height" :opacity="opacity"/>
      <div style="width: 100%;">
        <u-swiper
            height="400"
            :list="swiper"
            imgMode="'aspectFit'"
            @click="onClickSwiper"
            :circular="true"
        ></u-swiper>
      </div>
      
      <div style="padding: 0px;padding-top: 20px;padding-bottom: 20px;display: flex;justify-content: space-around;" >
          <div :key="index" v-for="({pic,onClick,title},index) in options">
            <u-image
              :showLoading="true" 
              :src="pic" 
              width="50px" 
              height="50px"
              radius="20px"
              mode="widthFill"
              @click="onClick"
            />
            <div style="text-align: center;font-size: 12px;padding-top: 3px;">{{ title }}</div>
          </div>

      </div>

      <view style="padding: 0px;padding-top: 20px;padding-bottom: 20px;line-height: 20px;padding-top: 10px;display:flex;justify-content: space-around;">
        <view style="display: flex;flex-direction: column;align-items: center;">
          <u-image 
            :showLoading="true" 
            :src="'/static/home/2.png'" 
            width="160px" 
            height="70px"
            radius="12px"
            mode="widthFill"
          />
          <div style="padding-top: 7px;display: flex;align-items: center;">
            <div style="font-size: 14px;font-weight:bold;margin-right: 10px;">Dan家服</div>
            <div style="color: #CDCDCD;font-size: 10px;">搬家 清洗 维修</div>
          </div>
        </view>

        <view style="display: flex;flex-direction: column;">
          <u-image 
            :showLoading="true" 
            :src="'/static/home/1.png'" 
            width="160px" 
            height="70px"
            radius="12px"
            mode="widthFill"
          />
          <div style="padding-top: 7px;display: flex;justify-content: center;align-items: center;">
            <div style="font-size: 14px;font-weight:bold;margin-right: 10px;">Dan智家</div>
            <div style="color: #CDCDCD;font-size: 10px;">自住全屋智能家装</div>
          </div>
        </view>
      </view>
      
      <div class="be-owner-container">
        <div class="be-owner-content">
          <u-image
                :showLoading="true" 
                :src="'/static/home/7.png'" 
                width="50px" 
                height="50px"
                mode="widthFill"
          />
          <div style="padding-left: 20px">
            <div style="font-size: 13px;padding-bottom: 2px;">我要成为业主</div>
            <div style="font-size: 12px;color: #8A8A8A" >10万+小区免费估价</div>
          </div>
          <div style="position:absolute;right:30px;width: 90px;height: 40px;
                background-color:rgb(36,172,242)
                ;line-height: 40px;text-align: center;
                color: #FFFFFF;border-radius: 5px;font-size: 13px;
            ">
            立即成为!
          </div>
        </div>
      </div>
      
        <div v-if="navigationBarHeight!=0" class="recommend-list">
          <SwiperList ref="swiperListRef" :offsetTop="navigationBarHeight" :flex="false" :dataList="dataList" v-slot="{ data }" >
            <HousePost  :key="post.id" v-for="post in data"  :post="post" />
          </SwiperList>
        </div>
        
        <div v-show="isLoading" class="loading-container">
          <u-loadmore  lineColor="#CDCDCD" :status="status" loading-text="加载更多" :fontSize="34" :iconSize="40" />
        </div>
    </view>
    <Notis ref="noti"/>
    <Tabbar />
</template>

<style lang='less' scoped>
.home-container{
  width: 100%;
  padding-bottom: 100px;
  .be-owner-container{
    padding: 20px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 10px;
  }
  .be-owner-content{
    box-shadow: 0px 0px 10px #CDCDCD ;
    padding: 10px;
    display: flex;
    position: relative;
    align-items: center;
    border-radius: 5px;
  }
  .recommend-list{
    padding: 15px;
    padding-top: 0px;
    padding-bottom: 0px;
    .House-post-container{
      padding-left: 10px;
      padding-right: 10px;
      width:calc( 100% - 20px );
    }
  }
  .loading-container{
    transform: translateY(-30px);
  }
}


</style>