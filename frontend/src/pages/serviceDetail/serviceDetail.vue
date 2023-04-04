<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import Navigation from '@/components/Navigation/service.vue'
import { useNavigation } from '@/hooks/useNavigation'
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import { useNavigationScroll } from '@/hooks/useScroll';
import Friend from '@/components/user/Friend.vue';
import { useCollect, usePlus } from '@/hooks/useInteract';
import { Service } from '@/types/serviceEntity/Service';
import { baseUrl } from '@/api/config';
import { computed } from '@vue/reactivity';
const screenHeight = getDimension().height
const { navigationHeight, measuringCb } = useNavigation()
const { opacity } = useNavigationScroll()
const option =[
    {
        left:'规格',
        right:'选择规格 >',
        click:()=> show.value = true
    },
    {
        left:'保障',
        right:'专业滴露消毒·严选服务人员·收费透明公开',
        click:()=>{}
    }
]
const users =[
    {
        'icon':'/static/icon.png',
        'title':'Danny',
        'subTitle':'3天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Tom',
        'subTitle':'18天前'
    }
]
const typeMap = {
    '1':'居家清洁',
    '2':'清洗维修',
    '3':'搬家项目'
}
const { serviceDetailInfo , currentItemIndex , show } = useState({
    serviceDetailInfo:null as unknown as Service,
    currentItemIndex:0,
    show:false
})
const priceArr = computed(()=>{
    if(serviceDetailInfo.value.price){
       return serviceDetailInfo.value.price.split(',') 
    }else{
        return []
    }
})
const serviceList = computed(()=>{
    if(serviceDetailInfo.value.specification){
        return serviceDetailInfo.value.specification.split(',')
    }else{
        return []
    }
})
const swiperList = computed(()=>serviceDetailInfo.value.correctImgs.map(v=>baseUrl+v))
const goComment = ()=>uni.navigateTo({
    url:'/pages/serviceDetail/serviceComment'
})
const goBuy = ()=>{
    //console.log(serviceList.value);
    serviceDetailInfo.value.curSer = serviceList.value[currentItemIndex.value]
    serviceDetailInfo.value.curPri = Number(priceArr.value[currentItemIndex.value])
    uni.navigateTo({
        url:'/pages/booking/serviceBooking?serviceInfo='+encodeURIComponent(JSON.stringify(serviceDetailInfo.value))
    })
}
onMounted(() => {

})
// @ts-ignore
onLoad(({info}) => {
    serviceDetailInfo.value = JSON.parse(decodeURIComponent(info))
    //console.log(serviceDetailInfo.value);
    
})
onPageScroll(()=>{
    
})
</script>
<template>
    <Navigation :measuring-cb="measuringCb" title="公寓服务" :opacity="opacity" />
    <div v-if="serviceDetailInfo" class='container'>
        <div class="banner">
            <u-swiper 
                :list="swiperList" 
                height="600" imgMode="aspectFill" 
                />
        </div>
        <div class="info-container">
            <div class="top-container">
                <div class="top-1">
                    <div class="price-container">
                        <div class="unit">$</div>
                        <div class="price">{{ priceArr[currentItemIndex] }}</div>
                    </div>
                    <div class="sales-container">
                        <div class="unit">月销</div>
                        <div class="count">{{ serviceDetailInfo.sales }}</div>
                    </div>
                </div>
                <div class="top-2">{{ typeMap[serviceDetailInfo.type] }}</div>
                <div class="sub">{{'当前规格 : ' +  serviceList[currentItemIndex] }}</div>
                <div class="top-3">
                    <div  v-for="{left,right,click} in option" class="special">
                        <div class="left">{{    left }}</div>
                        <div @click="click" class="right">{{   right }}</div>
                    </div>
                </div>

            </div>
            <div @click="goComment" class="comment-container">
                <div class="top-1">
                    <div class="left">服务评价(100)</div>
                    <div class="right">查看全部 ></div>
                </div>
                <div v-for="user in users" class="user-comment-container">
                    <Friend  :data="user" :sub-title-font-size="10" />
                    <div class="desc">
                        Vue 是一个渐进式的 JavaScript 框架，旨在通过简单的 API 构建快速、可维护的用户界面。
                    </div>
                </div>
            </div>

            <div class="introduce">
                <div class="title">详情介绍</div>
                <image class="img" mode="widthFix" :src="baseUrl + serviceDetailInfo.detailImg" />
            </div>
        </div>
        <div class="bottom-tabbar">
            <div @click="goBuy" class="btn-2">
                立即预约
            </div>
        </div>
    </div>
    <u-popup v-if="serviceDetailInfo" :show="show" @close=" show = false "  mode="bottom" :round="20" >
        <div :style="{height:screenHeight*0.75+'px'}" class="item-specification-container">
            <div class="service-content">
                <image 
                    class="item-img" 
                    :src=" baseUrl + serviceDetailInfo.correctImgs[0]" 
                    
                />
                <div class="service-content-detail">
                    <div class="title">{{ typeMap[serviceDetailInfo.type] }}</div>
                    <div class="service-name">{{ serviceList[currentItemIndex] }}</div>
                    <div class="price">
                        <div class="unit">$</div>
                        {{ priceArr[currentItemIndex] }}
                    </div>
                </div>
            </div>
            <u-line color="#E4E4E4" />
            <div class="service-set-container">
                <div class="title" >选择服务组合</div>
                <div class="service-set">
                    <div 
                        @click="currentItemIndex = index"
                        :class="{chose:index === currentItemIndex }" 
                        v-for="(item,index) in serviceList" 
                        class="service-item"
                    >
                        {{ item }}
                    </div>
                </div>
            </div>
            <div class="bottom-container">
                <div @click="show = false" class="btn">确认</div>
            </div>
        </div>
    </u-popup>
</template>

<style lang='less' scoped>

.item-specification-container{
    padding: 20px;
    position: relative;
    .service-content{
        display: flex;
        margin-bottom: 10px;
        .item-img{
            width: 150px;
            height: 100px;
            border-radius: 10px;
            margin-right: 10px;
        }
        .service-content-detail{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            gap: 10px;
            .title{
                font-weight: 600;
                font-size: 16px;
            }
            .service-name{
                color: @desc-color;
                font-size: 14px;
            }
            .price{
                display: flex;
                align-items: flex-end;
                font-size: 24px;
                color: @major-color;
                font-weight: 600;
                .unit{
                    font-size: 14px;
                    transform: translateY( -4px );
                }
            }
        }
    }
    .service-set-container{
        padding: 10px 0px;
        .title{
            font-weight: 600;
            margin-bottom: 20px;
        }
        .service-set{
            width: 100%;
            display: flex;
            flex-wrap:wrap;
            justify-content: flex-start;
            column-gap: 5px;
            row-gap: 10px;
            .service-item{
                display: flex;
                width: 43%;
                padding: 8px 10px;
                background-color: rgb(247,247,247);
                //background-color: #CDCDCD;
                border-radius: 5px;
                font-size: 12px;
                color: rgb(164,164,164);
                border: 1px solid rgb(247,247,247);
                justify-content: center;
            }
            .chose{
                border: 1px solid @major-color;
                color: @major-color;
            }
        }
    }
    .bottom-container{
        width: 100%;
        height: 80px;
        position: absolute;
        bottom: -30px;
        left: -20px;
        box-shadow: 0 0 10px #CDCDCD;
        display: flex;
        justify-content: center;
        padding: 10px 20px;
        .btn{
            width: calc( 100% - 40px);
            border-radius: 10px;
            font-size: 14px;
            height: 40px;
            color: #FFF;
            background-color: rgb(36,172,242);
            justify-content: center;
        }
    }
}
.container {
    background-color: rgb(242,242,242);
    display: flex;
    flex-direction: column;
    padding-bottom: 100px;
    .banner {
        width: 100%;
    }

    .info-container {
        width: calc(100% - 20px);
        padding: 10px 10px;

        .top-container {
            padding: 10px;
            background-color: #FFF;
            border-radius: 10px;
            margin-bottom: 10px;
            .top-1 {
                
                display: flex;
                justify-content: space-between;
                align-items: center;

                .price-container {
                    display: flex;
                    align-items: first baseline;
                    position: relative;
                    color: @major-color;

                    .price {
                        font-size: 25px;
                        font-weight: 600;

                    }

                    .unit {
                        font-size: 12px;
                        transform: translateY(-3px);
                    }
                }

                .sales-container {
                    font-size: 12px;
                    display: flex;
                    color: @desc-color;

                    .unit {
                        margin-right: 5px;
                    }

                    .count {
                        transform: translateY( 1px );
                    }
                }
            }
            .top-2{
                padding: 10px 0px;
                font-weight: 600;
            }
            .sub{
                font-size: 13px;
                padding-bottom: 10px;
                color: @text-color;
            }
            .top-3{
                .special{
                    display: flex;
                    margin-bottom: 10px;
                    font-size: 13px;
                    .left{
                        color: @desc-color;
                        margin-right: 15px;
                    }
                    .right{
                        
                    }
                }
            }
        }

        .comment-container{
            padding: 10px;
            padding-top: 15px;
            background-color: #FFF;
            border-radius: 10px;
            margin-bottom: 10px;
            .top-1{
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                .left{
                    font-weight: 600;
                }
                .right{
                    font-size: 14px;
                    color: @desc-color;
                }
            }
            .user-comment-container{
                margin-bottom: 15px;
                .desc{
                    transform: translateY( -5px );
                    padding: 0 5px;
                    font-size: 12px;
                }
            }
        }

        .introduce{
            background-color: #FFF;
            border-radius: 10px;
            overflow: hidden;
            .title{
                padding: 10px;
                font-weight: 600;
            }
            .img{
                width: 102%;
            }
        }
    }
    .bottom-tabbar{
        box-shadow: 0px 0px 20px #CDCDCD;
        position: fixed;
        width: calc( 100% - 40px );
        max-height: 74px;
        height: 45px;
        padding: 5px 20px;
        padding-bottom: 34px;
        background-color: #FFF;
        bottom: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 15px;

        .btn-2{
            flex: 1;
            height: 35px;
            background-color: @major2-color;
            text-align: center;
            line-height: 35px;
            color: #FFF;
            font-size: 13px;
            border-radius: 5px;
        }
    }
}
</style>