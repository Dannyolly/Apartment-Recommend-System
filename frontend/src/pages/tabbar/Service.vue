<script setup lang='ts'>
import {defineProps, toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { IconBtn , ImageBtn ,Swiper } from '@/types/Icon'
import SwiperList from '@/components/public/SwiperList.vue';
import HousingService from '@/components/HouseService/HousingService.vue';
import { DataList } from '@/types/Entity/DataList';
import { logicalExpression } from '@babel/types';
import { ServiceManager } from '@/service';
import { Service } from '@/types/serviceEntity/Service';
import Tabbar from '@/components/Tabbar.vue';
interface HousingServiceProps {}
const {} = defineProps<HousingServiceProps>()
const { isLoad,bottomList } = useState({
  isLoad:false,
  bottomList:[
    {
      title:'居家保潔',
      data:[]
    },
    {
      title:'清洗維修',
      data:[]
    },
    {
      title:'省心搬家',
      data:[]
    }
  ] as Array<DataList<Service>> 
})
const serviceList:IconBtn = [
  {
    pic:'/static/home/6.png',
    title:'省心搬家',
    onClick:()=>{}
  },
  {
    pic:'/static/home/6.png',
    title:'日常保潔',
    onClick:()=>{}
  },
  {
    pic:'/static/home/6.png',
    title:'維修安裝',
    onClick:()=>{}
  },
  {
    pic:'/static/home/6.png',
    title:'家電清洗',
    onClick:()=>{}
  },
  {
    pic:'/static/home/6.png',
    title:'新居開荒',
    onClick:()=>{}
  },
  {
    pic:'/static/home/6.png',
    title:'開鎖換鎖',
    onClick:()=>{}
  },
  {
    pic:'/static/home/6.png',
    title:'管道疏通',
    onClick:()=>{}
  },
  {
    pic:'/static/home/6.png',
    title:'省心搬家',
    onClick:()=>{}
  },
  {
    pic:'/static/home/6.png',
    title:'省心搬家',
    onClick:()=>{}
  },
  {
    pic:'/static/home/6.png',
    title:'全部服務',
    onClick:()=>{}
  },
]
const mainServiceList:ImageBtn = [
  {
    pic:'/static/service/1.png',
  },
  {
    pic:'/static/service/2.png',
  },
  {
    pic:'/static/service/3.png',
  },
]

const swiperArr:Swiper = [
  {
    url:'https://webimg.ziroom.com/a876a6f5-7cce-44d9-b96c-97e8065e5ae4.jpg',
    onClick:()=>{}
  },
  {
    url:'https://webimg.ziroom.com/ca74e2fb-5313-4574-a6a0-9a37d7dc303e.jpg',
    onClick:()=>{}
  },
  {
    url:'https://webimg.ziroom.com/3d2b17f5-b59b-4495-a1b0-71b4a109e12c.jpg',
    onClick:()=>{}
  },
]



onMounted(async()=>{
  const res =(await ServiceManager.ClientService.getList()).result;
  res.forEach(v=>{
    v.correctImgs = v.imgs.split(',')
    bottomList.value[Number(v.type)-1].data.push(v)
    
  })
  isLoad.value = true;
  console.log(bottomList.value);
  
})
</script>
<template>
  <div class="housing-service-container">
    <div class="u-swiper-container">
      <u-swiper
            height="250"
            :list="swiperArr"
            imgMode="'aspectFit'"
            :circular="true"
            previousMargin="50"
            nextMargin="50"
            :radius="20"
        ></u-swiper>
    </div>

    <div class="list-topic">
      <div class="title">生活服務</div>
      <div class="line"></div>
      <div class="desc">专业质量有保障</div>
    </div>
    
    <!-- <div class="service-icon-list-container">
      <div @click="$event=>item.onClick" v-for="(item,index) in serviceList" class="service-item">
          <image
                class="service-item-icon"
                :showLoading="true" 
                :src="item.pic" 
                mode="widthFill"
          />
          <div class="service-item-title">{{ item.title }}</div>
      </div>
    </div> -->
    <div class="main-service-list">
      <image
          v-for="(item,index) in mainServiceList"
          class="main-service-icon"
          :showLoading="true" 
          :src="item.pic" 
          mode="widthFill"
        />
    </div>

    <div class="list-topic">
      <div class="title">当季精选</div>
      <div class="desc">家服自营</div>
      <div class="line"></div>
      <div class="desc">品质保障</div>
      <div class="line"></div>
      <div class="desc">快速上门</div>
      
    </div>

    <SwiperList v-if="isLoad" :offsetTop="0" :flex="true" :dataList="bottomList" v-slot="{ data }" >
      <HousingService v-for="ser in data" :data="ser"/>
    </SwiperList>
  </div>
  <Tabbar/>
</template>

<style lang='less' scoped>
.housing-service-container{
  padding: 20px;
  padding-bottom: 40px;
  .u-swiper-container{
    margin-bottom: 20px;
    position: relative;
  }
  .list-topic{
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    .title{
      margin-right: 10px;
    }
    .line{
      width: 1px;
      height: 12px;
      margin-right: 6px;
      background-color: black;
      transform: translateY( 1px );
    }
    .desc{
      font-size: 12px;
      color: @text-color;
      line-height: 20px;
      margin-right: 6px;
    }
  }
  .main-service-list{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .main-service-icon{
      width: 115px;
      height: 70px;
    }
  }
  .service-icon-list-container{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
    .service-item{
      display: flex;
      width: 65px;
      height: 65px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .service-item-icon{
        width: 35px;
        height: 35px;
      }
      .service-item-title{
        padding-top: 5px;
        font-size: 12px;
      }
    }
  }
  
}

</style>