<script  lang='ts'>
import { toRefs, ref, watchEffect, onMounted, nextTick, getCurrentInstance, VueElement} from 'vue';
import {useState} from '@/hooks/useState';
import { onLoad, onReady } from '@dcloudio/uni-app';
import { DataList } from '@/types/Entity/DataList';
import { pxToRpx } from '@/utils/Equipment';
import { measureElHeight } from '@/utils/Measure';

export default {
    data(){
        return{
            currentIndex:0,
            swiperHeight:0,
            titleList:[] as Array<{name:string}>,
            realDataList:[] as unknown as Array<DataList>
        }
    },
    props:{
        dataList:{
            type:Array<{
                title:string
                data:Array<any>
            }>,
            required: true
        },
        flex:{
            type:Boolean,
            required: true
        },
        offsetTop:{
            type:Number,
            required: true
        },
        bgColor:{
            type:String,
            required: true,
            default:"#FFF"
        }
    },
    mounted() {
        //console.log(this.offsetTop);
        
        if(this.dataList){
            this.titleList = this.dataList.map((v)=>{
                return {
                    name:v.title
                }
            })
        }
        //this.realDataList[this.currentIndex] = this.dataList[this.currentIndex]
        this.$nextTick(()=>{
            this.setSwiperHeight()
        })
    },
    methods:{
        onClickTabs({index}:{index:number}){
            //console.log(index);
            this.currentIndex = index
            
        },
        changeSwiper(e: { detail: { current: number; }; }) {
            this.currentIndex = e.detail.current;
            if(!this.realDataList[this.currentIndex]){
                this.realDataList[this.currentIndex] = this.dataList[this.currentIndex]
            }
            this.$nextTick(() => {
                this.setSwiperHeight();
            });
        },
        async setSwiperHeight(){
            let element = "#swiper-item-" + this.currentIndex;
            this.swiperHeight = await measureElHeight(element,this)
           // console.log(this.swiperHeight);
            
        },
        pxToRpx
    },
    watch:{
        dataList:{
            handler(newV,oldV){
                setTimeout(() => {
                    this.setSwiperHeight() 
                }, 10)
            },
            deep:true
        }
    },
}

</script>
<template>
  <div class="main-container">
    <u-sticky :offset-top="pxToRpx(offsetTop)-1" :bgColor="bgColor">
      <div style="position: relative;;padding-bottom: 10px;padding-top: 10px;transform: translateX( 0px );">
        <div :style="{backgroundColor:bgColor}" class="overlay-left"></div>
        <div :style="{backgroundColor:bgColor}" class="overlay-right"></div>
        <u-tabs 
            v-if="flex"
            :list="titleList"
            itemStyle='padding-bottom:10px;flex:1'
            lineWidth="40"
            lineHeight="7"
            :current="currentIndex"
            @click="onClickTabs"
        />
        <u-tabs 
            v-else="flex"
            :list="titleList"
            itemStyle='padding-bottom:10px;'
            lineWidth="40"
            lineHeight="7"
            :current="currentIndex"
            @click="onClickTabs"
        />
      </div>
    </u-sticky>
    <swiper
        :style="{height:swiperHeight+50+'px'}"
        @change="changeSwiper"
        class="swiper" 
		:duration="500"
        :current="currentIndex"
        >
			<swiper-item :key="index" v-for="(data,index) in dataList" >   
				<view  
                    style="padding-left: 0px;padding-top: 0px;" 
                    :id="'swiper-item-'+index" 
                >
                    <slot 
                        :data="data['data']"
                        :title="data.title"
                        :index="index"
                    >
                    </slot>
                </view>
			</swiper-item>

    </swiper>
  </div>
</template>

<style lang='less' scoped>
.main-container{
    width: 100%;
    // .swiper {  
    //     height: auto;  
    // }  
    // .uni-swiper-wrapper {  
    //     overflow: inherit;
    // }  
    // .swiper-item {  
    //     width: 100vw!important;  
    //     height: auto!important; 
    // }
    .overlay-left{
        position: absolute;
        left: -5px;
        top: 0px;
        height: 100%;
        width: 10px;
        background-color: #FFF;
    }
    .overlay-right{
        position: absolute;
        right: -5px;
        top: 0px;
        height: 100%;
        width: 10px;
        background-color: #FFF;
    }
}
</style>