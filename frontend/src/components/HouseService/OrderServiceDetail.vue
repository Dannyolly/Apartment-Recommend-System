<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import { Service, ServiceOrder } from '@/types/serviceEntity/Service';
import { onLoad } from '@dcloudio/uni-app';
import { baseUrl } from '@/api/config';
// 公寓服务組件 --- 訂單詳細
interface OrderService {

    title: string,
    service:Service

}
const { title, service} = withDefaults(
    defineProps<OrderService>()
    ,
    {

    }
)
const { } = useState({

})
const goDetail = (e: any) => {
    uni.navigateTo({
        url: '/pages/houseOrder/orderDetail'
    })
}
onMounted(() => {

})

</script>
<template>
    <div @click="e => goDetail(e)" class="outer-container">
        <div class="real-container">
            <div class="OrderService-service-container">
                <div  class="top-container">
                    <div class="type">
                        <image class="img" src="/static/service/clean.png" />
                        <div class="name">日常保洁</div>
                    </div>
                    <div class="state">
                        {{ title }}
                    </div>
                </div>
                <image :showLoading="true" v-if="service.correctImgs" :src="baseUrl + service.correctImgs[0]" class="pic" mode="aspectFill" />
                <div class="OrderService-service-bottom">

                    <div class="title">
                        <div class="service-time">
                            {{ service.title }}
                        </div>

                    </div>
                    <div class="content">
                        {{ service.curSer }}
                    </div>
                    <div class="price-container">
                        <div class="unit">$</div>
                        <div class="price">{{ service.curPri }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang='less' scoped>
.outer-container {
    .OrderService-service-container {
        width: calc(100% - 30px - 10px);
        background-color: #FFF;
        border-radius: 10px;
        padding: 15px;
        position: relative;
        display: flex;
        padding-top: 40px;

        .top-container {
            position: absolute;
            top: 0;
            width: calc(100% - 30px);
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-around;

            .type {
                display: flex;
                flex: 0.5;
                align-items: center;

                .img {
                    width: 25px;
                    height: 25px;
                }

                .name {
                    font-size: 14px;
                    font-weight: 600;
                    color: @text-color;
                }
            }

            .state {
                flex: 0.5;
                line-height: 25px;
                display: flex;
                justify-content: flex-end;
                font-size: 13px;
                color: @major2-color;
            }
        }

        .pic {
            width: 100px;
            height: 100px;
            border-radius: 10px;
            margin-bottom: 5px;
            margin-right: 10px;
        }

        .bottom-container {
            width: calc(100% - 30px);
            display: flex;
            position: absolute;
            bottom: 10px;
            height: 30px;
            padding: 0 0px;

            .more {
                color: @desc-color;
                font-size: 14px;
                flex: 0.2;
                display: flex;
                align-items: center;
            }

            .others {
                flex: 0.8;
                display: flex;
                justify-content: flex-end;
                gap: 10px;

                .btn {
                    width: max-content;
                    border-radius: 20px;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    color: #FFF;
                    padding: 0px 10px;
                    background-color: @major-color;
                }
            }
        }

        .OrderService-service-bottom {
            display: flex;
            flex-direction: column;
            flex: 1;
            position: relative;

            .title {
                display: flex;
                font-size: 16px;
                font-weight: bold;
                line-height: 30px;

                .service-time {
                    margin-right: 10px;
                }
            }

            .content {
                color: @desc-color;
                font-size: 13px;
                margin-bottom: 10px;
            }

            .tag-container {
                width: 100%;
                display: flex;
                gap: 10px;
                font-size: 10px;
                margin-bottom: 8px;
            }

            .price-container {
                color: @major-color;
                display: flex;
                align-items: center;
                line-height: 30px;

                .unit {
                    font-size: 12px;
                }

                .price {
                    font-size: 16px;
                }

                .operation {
                    padding: 0 5px;
                    color: @text-color;
                    font-size: 12px;
                }

                .count {
                    color: @text-color;
                    font-size: 12px;
                }
            }

            .pay-container {
                width: 100%;
                height: 40px;
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                font-size: 13px;
                font-weight: 600;
                line-height: 30px;

                .money {
                    font-size: 16px;
                }
            }
        }
    }

}</style>