<script setup lang='tsx'>
import { toRefs, ref, watchEffect, onMounted, withCtx} from 'vue';
import {useState} from '@/hooks/useState';
import Tag from '../public/Tag.vue';
import { HouseEntity } from '@/types/Entity/HouseInfo'
import { Room } from '@/types/serviceEntity/Room';
import { baseUrl } from '@/api/config';
interface HousePostProps {
    post:Room
}
const { post } = defineProps<HousePostProps>()
const { cover } = useState({
    cover:''
})
const goDetail = ()=>{
    //console.log(post);
    
   uni.navigateTo({
    url:"/pages/HouseDetail?room="+encodeURIComponent(JSON.stringify(post)),
   })
}

onMounted(()=>{
    const pics = post.pic
    let res = pics.substring(0,pics.length-1).split(',').map(v=>v.substring(2,v.length-2))
    cover.value = res[0]
    post.correctPic = res
    //console.log(cover.value);
    
})

</script>
<template>
  <div @click="goDetail"  class="post-container">
    <div class="icon-container">
        <image
         class="icon"
        src="/static/home/vr.png"
        />
    </div>
    <div class="icon-container" style="left: 50px">
        <image
         class="icon"
        src="/static/home/play.png"
        />
    </div>
    <image
        :showLoading="true" 
        :src="cover"
        class="pic"
        mode="aspectFill"
    />
    <div class="bottom">
        <div class="bottom-top">
            <div class="title-container">
                <div class="title">{{ post.title }}</div>
                <div class="detail">{{ post.bathroomnum }} bds | {{ post.areasize }}m² | {{ post.floorinfo }}</div>
            </div>
            <div class="price">$ {{ post.price }}/月</div>
        </div>
        <div class="bottom-bottom">
            <Tag :title="post.decoratetype" />
            <Tag :title="post.housetype" />
        </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.post-container{
    width: 100%;
    height: 350px;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    box-shadow: 0px 0px 10px #CDCDCD;
    position: relative;
    margin-bottom: 20px;
    .icon-container{
        position: absolute;
        top: 20px;
        left: 10px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.3);
        border-radius: 20px;
        .icon{
            width: 20px;
            height: 20px;
        }
    }
    .pic{
        width: 100%;
        height: 250px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;     
    }
    .bottom{
        padding-bottom: 15px;
        .bottom-top{
            padding: 15px;
            padding-bottom: 5px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: start;
            .title-container{
                display: flex;
                flex: 0.8;
                padding-right: 10px;
                flex-direction: column;
                .title{
                    font-size: 16px;
                    margin-bottom: 5px;
                }
                .detail{
                    font-size: 12px;
                    color: #CDCDCD;
                }
            }
            .price{
                display:flex;
                flex:0.2;
                font-size: 14px;
                color: @text-color;
                transform: translateY( 2px );
            }
        }
        .bottom-bottom{
            padding-left: 15px;
            padding-right: 15px;
            display: flex;
            align-items: center;
        }
    }
}
</style>