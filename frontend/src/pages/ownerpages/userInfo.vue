<script setup lang='ts'>
import {defineProps, toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getLocation , loadCity } from '@/utils/location';
import Friend from '@/components/user/Friend.vue';
import IconBtn from '@/components/public/IconBtn.vue';
import { getDimension } from '@/utils/Equipment';
import { getUserInfo }  from '@/api/login'
import { LocalStorageManager } from '@/utils/localStorage';
import { UserInfo } from '@/types/serviceEntity/user'
import { uploadImage } from '@/api/request';
import { isArray } from '@vue/shared';
import Tabbar from '@/components/Tabbar.vue';

const height = getDimension().height 
const { user ,isLogin } = useState({
  user:{
    id:1,
    icon:'',
    title:'',
    subTitle:'hello!'
  } ,
  isLogin:false
})
const func = [
  {
    title:'预约订单',
    icon:'/static/user/order.png',
    click:()=>uni.navigateTo({
      url:'/pages/ownerpages/orderPage'
    })
  },
  
]
const services=[
  {
    title:'家服',
    icon:'/static/user/house.png',
    click:()=>{

    }
  },
  {
    title:'搬家',
    icon:'/static/user/truck.png',
    click:()=>{

    }
  },
  {
    title:'指南',
    icon:'/static/user/compass.png',
    click:()=>{

    }
  },
  
]
const others =[
  {
    title:'设定',
    icon:'/static/user/setting.png',
    click:()=>{

    }
  },
  {
    title:'消息',
    icon:'/static/user/message.png',
    click:()=>{

    }
  },
  {
    title:'切换',
    icon:'/static/user/change.png',
    click:()=>{
      uni.navigateTo({
        url:'/pages/switch'
      })
    }
  },
]

onMounted(()=>{
  

  
})

</script>
<template>
  <div class="container" :style="{height:height+'px',overflow:'hidden'}">
    <div class="top-container">
      <div  class="user-container">
        <Friend
          v-if="user.id" 
          :onlyShow="isLogin"
          :title-color="'#FFFFFF'" 
          :title-font-size="16"
          :sub-title-font-size="12"
          :sub-title-color="'#f4f4f4'" 
          :data="user" 
          :image-size="50"
        />
      </div>
      
    </div>
    <div class="bottom-container">
        <div class="user-option-container">
            <div @click="item.click" v-for="(item,index) in func" class="func">
              <IconBtn 
                :font-size="12" 
                :icon-size="{width:25,height:25}" 
                :icon="item.icon" 
                :title="item.title"
              />
            </div>
        </div>
        <div class="user-service-container">
            <div class="title">Dan服务 </div>
            <div style="display: flex;justify-content: start;">
              <div v-for="(item,index) in services"  :style="{display:'flex',flex:0.22}">
                <IconBtn 
                  :font-size="12" 
                  :icon-size="{width:30,height:30}" 
                  :icon="item.icon" 
                  :title="item.title"
                />
              </div>
            </div>
        </div>
        <div class="user-service-container">
            <div class="title">其它功能</div>
            <div style="display: flex;justify-content: start;">
              <div  @click="item.click" v-for="(item,index) in others"  :style="{display:'flex',flex:0.22}">
                <IconBtn 
                  :font-size="12" 
                  :icon-size="{width:30,height:30}" 
                  :icon="item.icon" 
                  :title="item.title"
                />
              </div>
            </div>
        </div>
    </div>
  </div>
  <Tabbar/>
</template>

<style lang='less' scoped>
.container{
  width: 100%;
  background-color: @bkColor-userinfo;
  .top-container{
    background-image: linear-gradient(to bottom,rgb(69,150,254),rgb(69,150,254),rgb(38,197,253),rgb(247,247,247));
    width: calc( 100% - 40px );
    height: 200px;
    padding: 20px;
    padding-top: 0px;
    .user-container{
      padding-top: 95px;

    }
  }
  .bottom-container{
    padding: 20px;
    transform: translateY( -50px );
    .user-option-container{
      background-color: #FFF;
      width: 100%;
      border-radius: 10px;
      display: flex;
      margin-bottom: 10px;
      justify-content: flex-start;
      .func{
        display: flex;
        justify-content: center;
      }
    }
    .user-service-container{
      display: flex;
      flex-direction: column;
      background-color: #FFF;
      width: calc( 100% - 20px );
      padding: 20px;  
      padding-left: 0px;
      border-radius: 10px;
      margin-bottom: 10px;
      .title{
        padding-left: 20px;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
      }    
    }
    .switch-container{
      background-color: #FFF;
      border-radius: 10px;
      padding: 20px;
      padding-left: 0px;
      width: calc( 100% - 20px );
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .title{
        padding-left: 20px;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
