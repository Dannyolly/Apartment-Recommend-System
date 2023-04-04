<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import {useState} from '@/hooks/useState';
import { DataList } from '@/types/Entity/DataList';
import { Service } from '@/types/serviceEntity/Service';
import { baseUrl } from '@/api/config';
// 公寓服務組件
interface HousingServiceProps {
    data:Service
}
const tagStyle = ['primary','warning','success']
const { data } = defineProps<HousingServiceProps>()
const {} = useState({

})
const goDetail= (e:any)=>uni.navigateTo({
  url:'/pages/serviceDetail/serviceDetail?info='+encodeURIComponent(JSON.stringify(data))
})
onMounted(()=>{
  //console.log( data ,'hello?');
  
})
</script>
<template>
  <div @click="e=>goDetail(e)" class="housing-service-container">
    <image
      :showLoading="true" 
      :src="baseUrl +  data.correctImgs[0]" 
      mode="aspectFill"
      class="pic"
    />
    <div class="housing-service-bottom">
      <div class="title">
        <div class="service-time">
          {{ data.title }}
        </div>
      </div>
      <div class="content">
        {{ data.subtitle }}
      </div>
      <div class="tag-container">
          <u-tag 
            v-for="(item,index) in (data.tags.split(','))" 
            :text="item"
            :type="tagStyle[index]" 
            size="mini"
          />
      </div>
      <div class="price-container">
        <div class="unit">$</div>
        <div class="price">{{ data.price.split(',')[0] }}</div>
      </div>
      <div class="buybtn-container">
        <div class="btn">
          GO BUY
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.housing-service-container{
    width: calc( 100% - 30px - 10px );
    height: 310px;
    box-shadow: 0px 0px 10px #CDCDCD;
    border-radius: 10px;
    padding: 15px;
    position: relative;
    margin-bottom: 30px;
    .pic{
      width: 100%;
      height: 180px;
      border-radius: 5px;
      margin-bottom: 5px;
    }
    .housing-service-bottom{
      .title{
        display: flex;
        font-size: 16px;
        font-weight: bold;
        line-height: 30px;
        .service-time{
          margin-right: 10px;
        }
      }
      .content{
        color: @desc-color;
        font-size: 13px;
        margin-bottom: 10px;
      }
      .tag-container{
        width: 100%;
        display: flex;
        gap: 10px;
        font-size: 10px;
        margin-bottom: 8px;
      }
      .price-container{
        color: @major-color;
        display: flex;
        align-items: center;
        line-height: 30px;
        .unit{
          font-size: 12px;
        }
        .price{
          font-size: 20px;

        }
      }
      .buybtn-container{
        width: max-content;
        height: fit-content;
        position: absolute;
        bottom: 20px;
        right: 20px;
        .btn{
          background-color:@major-color;
          padding: 15px;
          padding-top: 5px;
          padding-bottom: 5px;
          border-radius: 10px;
          color: #FFF;
        }
      }
    }
}
</style>