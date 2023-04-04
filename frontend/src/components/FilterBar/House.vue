<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import Tag from '../public/Tag.vue';
import { Room } from '@/types/serviceEntity/Room';
interface HouseProps {
  post:Room,
  paddingRight?:number,
  padding?:number
}
const { paddingRight,post } = withDefaults(
  defineProps<HouseProps>(),
  {
    paddingRight:20,
    padding:20
  
  }
)
const { picArr } = useState({
  picArr:[] as string[]
})
const goDetail = ()=>{
  uni.navigateTo({
    url:'/pages/HouseDetail?room='+encodeURIComponent(JSON.stringify(post))
  })
}
onMounted(()=>{
  let pic = post.pic
  picArr.value = pic.substring(0,pic.length-1).split(',').map(v=>v.substring(2,v.length-2))
  post.correctPic = picArr.value
})
</script>
<template>
  <div :style="{padding:padding+'px',paddingRight:paddingRight+'px',paddingLeft:'150px'}" @click="goDetail" class='container'>
    <image
      :src="picArr[0]"
      class="image"
      mode="aspectFill"
    />
    <div class="detail-info-container">
       <div class="title">{{ post.title }}</div>
       <div class="detail">{{ post.areasize }}m² | {{ post.floorinfo }} | 朝{{ post.ori }}</div>
       <div class="location">
        <image class="detail-image" src="/static/location-fill.png" />
          {{ post.community }}
        </div>
        <div class="tag-container">
          <Tag font-size="10" title="新小区"/>
          <Tag font-size="10" title="新!"/>
          <Tag font-size="10" title="新!!"/>
        </div>
       <div class="price">￥{{ post.price }}/月</div>
    </div>
  </div>
  <div style="padding: 10px;padding-left: 0px;padding-bottom: 0px;">
    <u-line color="#f4f4f4"></u-line>
  </div>
</template>

<style lang='less' scoped>
.container{
  padding: 20px;
  position: relative;
  .image{
    position:absolute;
    left: 0px;
    width: 140px;
    height: 100px;
    border-radius: 10px;
  }
  .detail-info-container{
    padding-top: 5px;
    .title{
      font-size: 14px;
      margin-bottom: 5px;
      font-weight: 600;
    }
    .detail{
      font-size: 12px;
      margin-bottom: 5px;
      color: @text-color;
      
    }
    .location{
      font-size: 12px;
      color: #2c2c2c;
      margin-bottom: 5px;
      .detail-image{
        width: 13px;
        height: 13px;
        transform: translateY( 2px );
      }
    }
    .tag-container{
      width:fit-content;
      display: flex;
      margin-bottom: 5px;
      transform: translateX( -5px );
    }
    .price{
      color: @major-color;
      font-size: 14px;
      transform: translateX( -1px );
      position: absolute;
      bottom: 0px;
    }
    
  }
}
</style>