<script setup lang='ts'>
import {defineProps, toRefs, ref, watchEffect, onMounted, watch, onUnmounted} from 'vue';
import {useState} from '@/hooks/useState';
import HousePost from '@/components/House/HousePost.vue'
import NavigationBar from '@/components/Navigation/NavigationBar.vue';
import cases from '@/data/cases.json'
import { onInit, onLoad, onPageScroll, onReachBottom } from '@dcloudio/uni-app';
import HomeNavigation from '@/components/Navigation/OwnerHome.vue';
import Tabbar from '@/components/Tabbar.vue'
import { useNavigationScroll } from '@/hooks/useScroll';
import Case from '@/components/case/Case.vue'
//@ts-ignore
import { Case as CaseEntity } from '@/types/Case'
interface HomeProps {
  any?:any
}
const {} = defineProps<HomeProps>()
const swiper = [
  'https://webimg.ziroom.com/b06e59c5-4733-4249-a20f-16a6100f05af.jpg',
  'https://webimg.ziroom.com/809b145b-b2e7-4264-9aa9-5ee9da725981.jpg',
  'https://webimg.ziroom.com/f2f0b54a-595e-4cf9-a3f4-ad53005cce4e.png',
  'https://webimg.ziroom.com/01ea30a9-8885-4600-9b7b-261a03bff214.png',
  'https://webimg.ziroom.com/ed901457-e9e5-4fda-8e58-03d0f2f20499.jpg'
]
type Option ={
  title:string,
  pic:string,
  onClick:()=>void
}
const scrollTopMax = 120
const { 
  navigationBarHeight,
  isLoading,
  status,
  opacity,
  casesArr
} = useState({
  ...useNavigationScroll(),
  navigationBarHeight:0,
  isLoading:false,
  status:'loading',
  casesArr:cases as CaseEntity[]
})

const go = () => uni.navigateTo({
        url:'/pages/lease'
})
onReachBottom(()=>{
  
})
onMounted(async ()=>{
 
})

</script>
<template>
    <view class="home-container">
      <HomeNavigation  :measuring-cb="(height: number)=>navigationBarHeight = height" :opacity="opacity"/>
      <div style="width: 100%;">
        <u-swiper
            height="400"
            :list="swiper"
            imgMode="'aspectFit'"
            :circular="true"
        ></u-swiper>
      </div>

        <div class="list-container">
          <div class="title">热门案例</div>
          <div style="padding: 5px;">
            <Case v-for="caseT in casesArr" :case-entity="caseT"   />
          </div>
        </div>
        
        <div v-show="isLoading" class="loading-container">
          <u-loadmore  lineColor="#CDCDCD" :status="status" loading-text="加载更多" :fontSize="34" :iconSize="40" />
        </div>
    </view>
    <div @click="go" class="lease">
      <image src="/static/release.png" />
    </div>
    <Tabbar />
</template>

<style lang='less' scoped>
.home-container{
  width: 100%;
  padding-bottom: 20px;
  .list-container{
    padding: 20px;
    .title{
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }
  }
  .loading-container{
    transform: translateY(-15px);
  }
}
.lease{
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: @major-color;
  display: flex;
  justify-content: center;
  align-items: center;
  image{
    width: 30px;
    height: 30px;
    transform: translateX( -2px );
  }
}

</style>