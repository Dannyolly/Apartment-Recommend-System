<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, useCssModule} from 'vue';
import {useState} from '@/hooks/useState';
import House from '@/components/FilterBar/House.vue';
import { useCollect} from '@/hooks/useInteract';
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { useMapState } from '@/hooks/component/useMapState';
import { Room } from '@/types/serviceEntity/Room';
import { getLocationByAddress } from '@/utils/location';
import { ServiceManager } from '@/service';
import { LocalStorageManager } from '@/utils/localStorage';
import Notis from '@/components/public/Notis.vue';
import { useNoti } from '@/hooks/useNoti'
import { useHouseAppointmentStore } from '@/store/HouseAppointment';
import { usePage } from '@/hooks/usePage';
import Tabbar from '@/components/Tabbar.vue';
const { 
    longitude,
    latitude,
    covers,
    roomData,
    facilityList,
    recommendList,
    noti,
    isAdded,
    pageSize,
    currentPage
} = useState({
    ...useMapState(0,0),
    ...useNoti(),
    ...usePage(),
    roomData:{} as Room,
    facilityList:[[],[]] as number[][],
    recommendList:[] as Room[],
    isAdded:false,
    
})

const { isCollect , setIsCollect } = useCollect(false,()=>{
    const id = LocalStorageManager.getLocalStorageInfo('userInfo')?.id ?? -1
    const roomIds = LocalStorageManager.getLocalStorageInfo('roomCollectionIds',id) ?? [];
    if(isCollect.value){
        LocalStorageManager.setLocalStorageInfo('roomCollectionIds',{
            roomCollectionIds:[roomData.value.id,...roomIds]
        },id) 
    }else{
        LocalStorageManager.setLocalStorageInfo('roomCollectionIds',{
            roomCollectionIds:[roomData.value.id,...roomIds].filter(v=>v!==roomData.value.id)
        },id) 
    }
    
})
const detail =[
    {
        title:'',
        sec:'房型'
    },
    {
        title:'',
        sec:'面积'
    },
    {
        title:'',
        sec:'楼层'
    },
    {
        title:'',
        sec:'朝向'
    },
]
const facility=[
    {
        title:'卧室设施',
        icon:'/static/houseDetail/bed.png',
        arr:[
            '空调',
            '衣柜',
            '床',
            '卫生间',
            "阳台",
            "智能门锁"
        ]
    },
    {
        title:'公共设施',
        icon:'/static/houseDetail/share.png',
        arr:[
            '冰箱',
            '洗衣机',
            '热水器',
            'Wifi',
            '沙发',
            '燃气灶',
            '可做饭',
            '电磁炉',
        ]
    }
]
const interact = [
    {
        icon:'/static/houseDetail/like.png',
        clicked:'/static/houseDetail/like_fill.png',
        title:'收藏',
        click:()=>{
            setIsCollect()
        }
    },
    {
        icon:'/static/user/collection.png',
        clicked:'/static/user/collection.png',
        title:'看房单',
        click:()=>{
            uni.navigateTo({
                url:'/pages/appointment/AppointmentPage'
            })
        }
    },
]

const goMap = ()=>{
    let params = {
        latitude:latitude.value,
        longitude:longitude.value,
        covers:covers.value,
        community:roomData.value.community
    }
    uni.navigateTo({
        url:'/pages/map/community?mapInfo='
        +encodeURIComponent(JSON.stringify(params))
    })
}
async function setUp(query:any){
    const room:Room = JSON.parse(decodeURIComponent(query.room))
    roomData.value = room
    // checkout
    checkIsCollected()
    isAdded.value = useHouseAppointmentStore().isExist(roomData.value.id)
    saveToHistory()
    
    detail[0].title = room.roomtype
    detail[1].title = room.areasize+'m²'
    detail[2].title = room.floorinfo
    detail[3].title = room.ori
    const res = await getLocationByAddress(room.community);
    const [ longitudeT,latitudeT ] = res.geocodes[0].location.split(',')
    longitude.value = Number(longitudeT)
    latitude.value = Number(latitudeT)
    facilityList.value[0] = [
        room.hasairconditioner,
        room.haswardrobe,
        room.hasbed,
        1,
        room.hasbalcony,
        0
    ]
    facilityList.value[1] = [
        room.hasrefrigerator,
        room.haswashingmachine,
        room.haswaterheater,
        room.haswifi,
        room.hassofa,
        1,
        room.hascook,
        0,
    ]
}
function addToAppointment(){
    useHouseAppointmentStore().add(
        roomData.value,
        ()=>noti.value?.open(' add it to appointmentList successfully'),
        ()=>noti.value?.open(' it has been added  to appointment')
    )
    isAdded.value = true
}
function checkIsCollected(){
    const curRoomId = roomData.value.id
    const id = LocalStorageManager.getLocalStorageInfo('userInfo')?.id ?? -1
    const roomIds = LocalStorageManager.getLocalStorageInfo('roomCollectionIds',id) ?? [];
    setIsCollect(roomIds.findIndex(v=>v===curRoomId) !== -1,true) 
    //console.log(roomIds);
    
    
}
function rentAction(){
    uni.navigateTo({
        url:'/pages/rent/rent?roomInfo='+encodeURIComponent(JSON.stringify(roomData.value))
    })
}
function saveToHistory(){
    const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    let history = LocalStorageManager.getLocalStorageInfo('history',userId )   
    let newHistory = {
        date:new Date(),
        roomId:roomData.value.id
    }
    if(history){
        if( history.findIndex(v=>v.roomId === roomData.value.id) !== -1 ){
            console.log('exist already');
            
            return
        }
    }          
    if(!history){
        LocalStorageManager.setLocalStorageInfo('history',{
            history:[newHistory]
        },userId)
        return
    }   
    LocalStorageManager.setLocalStorageInfo('history',{
        history:[newHistory,...history]
    },userId)
}
onReachBottom(async ()=>{
    recommendList.value.push(...(await ServiceManager.RoomService.getRecommendRoomsByContentBased(roomData.value.id,currentPage.value++ )).result)
    //console.log(recommendList.value);
    
})
onLoad(async (query)=>{
    await setUp(query)
    recommendList.value = (await ServiceManager.RoomService.getRecommendRoomsByContentBased(roomData.value.id,currentPage.value++ )).result
})

</script>
<template>
  <div class='container'>
    <u-swiper
        :list="roomData.correctPic"
        height="550"
        indicator
        indicatorMode="dot"
        indicatorStyle="bottom:10px"
    />
    <div class="info-container">
        <div class="title">{{ roomData.title }}</div>
        <div class="price">
            <div class="money">{{ roomData.price }}</div>
            <div class="unit">元/月</div>
        </div>
        <image
            src="/static/houseDetail/1.png"
            class="img"
        />
        <div class="detail">
            <div v-for="(item,index) in detail" class="detail-item">
                <div class="main">{{ item.title }}</div>
                <div class="sec">{{ item.sec }}</div>
            </div>
        </div>

    </div>
    <div class="community-container">
        <div class="title">
            {{ roomData.community }}
        </div>
        <map 
            @click="goMap"
            style="width: 100%;height: 150px;border-radius: 20px;margin-bottom: 20px;" 
            :latitude="latitude" 
            :longitude="longitude" 
            :markers="covers"
        />
        <div  class="road">
            <image class="road-img" src="/static/houseDetail/train.png" />
            <div class="road-name">{{ roomData.traffic }}</div>
            
        </div>
    </div>
    <div class="house-introduce">
        <div class="title">
            房屋介绍
        </div>
        <div class="desc">
            {{ roomData.description }}
        </div>
    </div>
    <div class="facility-container">
        <div class="title">
            房屋配置
        </div>
        <div v-for="(item,index) in facility" class="facility">
            <div class="facility-type">
                <image class="img" :src="item.icon"/>
                <div class="type">{{ item.title }}</div>
            </div>
            <div class="facilities-container">
                
                <div :class="{wrong:!facilityList[index][i]}" class="fac" v-for="(fac,i) in item.arr"  >
                    <image v-if="!facilityList[index][i]" class="has" src="/static/houseDetail/wrong.png" /> 
                    <image v-else class="has" src="/static/houseDetail/correct.png" />
                    {{ fac }}
                </div>
            </div>
            <div style="position: absolute;bottom: -20px;width: calc( 100% - 35px );padding: 0px 20px;">
                <u-line v-if="index===0" color="#CDCDCD"></u-line>
            </div>
        </div>
    </div>
    <div class="relative-house-conainer">
        <div class="title">
            相似公寓
        </div>
        <div class="house-container">
            <House v-for="item in recommendList" :post="item" />
        </div>
    </div>
    <div class="bottom-tabbar">
        <div @click="index=>item.click() " v-for="(item,index) in interact" class="interact-container">
            <image v-show="isCollect" class="img" :src="item.clicked"/>
            <image v-show="!isCollect" class="img" :src="item.icon"/>
            <div class="title">{{ item.title }}</div>
        </div>
        <div v-if="isAdded === true" class="btn-1" @click="addToAppointment">
            已加入
        </div>
        <div v-if="isAdded === false" class="btn-1" @click="addToAppointment">
            加入看房单
        </div>
        <div @click="rentAction" class="btn-2">
            直接租
        </div>
    </div>
  </div>
  <Notis  ref="noti"/>
</template>

<style lang='less' scoped>
.container{
    padding-bottom: 74px;
    .info-container{
        padding: 20px;
        .title{
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .price{
            color: @major-color;
            display: flex;
            height: 30px;
            display: flex;
            align-items:flex-end;
            margin-bottom: 10px;
            .money{
                font-size: 24px;
                font-weight: 600;
                margin-right: 2px;
            }
            .unit{
                font-size: 14px;
                padding-bottom: 4px;
            }
        }
        .img{
            width: 100%;
            height: 35px;
        }
        .detail{
            padding: 15px 0px;
            display: flex;
            justify-content: space-around;
            .detail-item{
                flex: 1;
                .main{
                    font-size: 16px;
                    text-align: center;
                }
                .sec{
                    font-size: 12px;
                    text-align: center;
                    color: #CDCDCD;
                }
            }
        }
    }
    .community-container{
        padding: 20px;
        padding-top: 0px;
        .title{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .road{
            display: flex;
            gap: 5px;
            margin-bottom: 5px;
            align-items: center;
            .road-img{
                
                width: 15px;
                height: 15px;
            }
            .road-name{
                font-size: 14px;
            }
        }
    }
    .house-introduce{
        padding: 20px;
        padding-top: 0px;
        .title{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .desc{
            font-size: 13px;
        }
    }
    .facility-container{
        padding: 20px;
        padding-bottom: 0px;
        .title{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .facility{
            display: flex;
            margin-bottom: 35px;
            position: relative;
            .facility-type{
                flex: 0.15;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .img{
                    width: 25px;
                    height: 25px;
                    margin-bottom: 5px;
                }
                .type{
                    width: 30px;
                    text-align: center;
                    font-size: 13px;
                }
            }
            .facilities-container{
                flex: 0.8;
                display: flex;
                padding-left: 30px;
                flex-wrap: wrap;
                align-items: center;
                gap: 15px;
                column-gap: 15px;
                .fac{
                    width: 28%;
                    font-weight: 350;
                    font-size: 14px;
                    .has{
                        width: 13px;
                        height: 13px;
                        transform: translateY( 2px );
                    }
                }
                .wrong{
                    color: #CDCDCD;
                }
                
            }
        }
    }
    .relative-house-conainer{
        padding: 20px;
        .title{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .house-container{

        }
    }
    .bottom-tabbar{
        z-index: @bottom-bar-z-index;
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
        justify-content: center;
        align-items: center;
        gap: 15px;
        .interact-container{
            display: flex;
            flex-direction: column;
            flex: 0.1;
            justify-content: center;
            align-items: center;
            .img{
                width: 30px;
                height: 30px;
            }
            .title{
                font-size: 9px;
            }
        }
        .btn-1{
            flex: 0.4;
            height: 35px;
            background-color: @major-color;
            text-align: center;
            line-height: 35px;
            color: #FFF;
            font-size: 13px;
            border-radius: 5px;
        }
        .btn-2{
            flex: 0.4;
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