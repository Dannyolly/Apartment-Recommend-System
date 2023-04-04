<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useTabbarStore } from '@/store/Tabbar';
import { usePubSub } from '@/hooks/usePubSub';
import MyInput  from '@/components/public/Input.vue'
import { ServiceManager } from '@/service';
import Tag from '@/components/public/Tag.vue';
import { flowRight } from 'lodash';
import { Perference } from '@/types/serviceEntity/user'
import { LocalStorageManager } from '@/utils/localStorage';
import Notis from '@/components/public/Notis.vue';
import { useNoti } from '@/hooks/useNoti';
interface SwitchProps {
  props?:any
}
const {} = defineProps<SwitchProps>()
const { open , community,floor,lowestPrice,highestPrice,communityInfo,noti} = useState({
    open:false,
    community:[] as string[],
    communityInfo:'',
    floor:'',
    lowestPrice:'',
    highestPrice:'',
    ...useNoti()
})
const pubsub = usePubSub()
const input = ref<InstanceType<typeof MyInput>>()
const height = getDimension().height - 40 +'px' 
const perferences = [
    '你想在哪个社区住?',
    '高层/中层/低层?',
    '预算是?'
]
const floorOption = [
'高层',
'中层',
'低层'
]
const onChange = async (v:string)=>{
    
    const res = await ServiceManager.RoomService.getCommunityByKeyWord(v)
    community.value = res.result
}
const onFocus = ()=>{
    open.value = true
}
const onBlur = ()=>{
    open.value =false
}
const chooseCommunity = (v:string)=>{
    input.value?.setText(v)
    communityInfo.value = v
}
const submit = ()=>{
    let temp:Perference = {
        community:communityInfo.value,
        floor:floor.value,
        lowestPrice:lowestPrice.value,
        highestPrice:highestPrice.value
    }
    const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    LocalStorageManager.setLocalStorageInfo('perference',{
        perference:temp
    },userId)
    pubsub.publish('perference',temp)
    noti.value?.open('提交成功')
    setTimeout(()=>{
        uni.navigateBack()
    },0)
    
}

const skip = ()=>{
    let temp:Perference = {
        community:undefined,
        floor:undefined,
        lowestPrice:'0',
        highestPrice:'10000000'
    }
    const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    LocalStorageManager.setLocalStorageInfo('perference',{
        perference:temp
    },userId)
    pubsub.publish('perference',temp)
    setTimeout(()=>{
        uni.navigateBack()
    },0)
    
}

</script>
<template>
<div  :style='{height:height}' class='container'>
    <div class="content">
        <div class="title">偏好设置</div>
        <div class="sub-title">设置偏好可以让以后的推荐结果更加准!</div>
        <div @click="skip" class="skip">跳过</div>
    </div>
    <div  class="option">
        <div class="title">{{ perferences[0] }}</div>
        <div class="input-container">
            <MyInput ref="input" :onBlur="onBlur" :onFocus="onFocus" :onChange="onChange" :show-icon="false"/>
            <div :class="{open:open}" class="community-list-container">
                <div :style="{padding:'5px 20px'}" @click="()=>chooseCommunity(item)" v-for="item in community">{{ item }}</div>
            </div>
        </div>
    </div>
    <div  class="option">
        <div class="title">{{ perferences[1] }}</div>
        <div style="display: flex;gap: 10px;">
            <Tag 
            :content-style="{
                padding:'3px 10px'
            }"
            :click="()=>floor = index" 
            v-for="(tag,index) in floorOption" 
            fontSize="14" 
            :title="tag" 
            :bk-color=" index === floor ? '#24ACF2':undefined"
            :color="index === floor ? '#FFF':undefined"
            />
        </div>
    </div>
    <div  class="option">
        <div class="title">{{ perferences[2] }}</div>
        <div style="display: flex;gap: 10px;">
            <div style="z-index: 0;display: flex;gap: 10px;align-items: center;">
                <input class="normal-input" v-model="lowestPrice" placeholder="最低价格" />
                <div style="font-size: 20px;">-</div>
                <input class="normal-input" v-model="highestPrice" placeholder="最高价格" />
            </div>
        </div>
    </div>
    <div style="position: absolute;bottom: 50px;width: 100%;">
        <div @click="submit()" style="width: calc( 100% - 60px );" class="btn">
            提交
        </div>
    </div>
    
</div>
<Notis ref="noti" />
</template>

<style lang='less' scoped>
.normal-input{
    box-shadow: 0 0 10px #CDCDCD;
    padding: 5px;
}
.container{
    display: flex;
    flex-direction: column;
    padding: 20px;
    padding-top: 80px;
    width: calc( 100% - 40px );
    .content{
        width: 100%;
        margin-bottom: 20px;
        position: relative;
        .title{
            font-size: 26px;
            font-weight: 600;
            display: flex;
            width: 100%;
        }
        .sub-title{
            width: 100%;
            font-size: 14px;
            display: flex;
            color: @desc-color;
            margin-bottom: 20px;
        }
        .img-container{
            box-shadow: 0px 2px 23px 0px #E4E4E4;
            border-radius: 10px;
            margin-bottom: 20px;
            image{
                width: 100%;
                height: 100px;
            }
        }
        .skip{
            position: absolute;
            right: 0px;
            top: 10px;
        }
    }
    .option{
        margin-bottom: 40px;
        .title{
            font-size: 20px;
            font-weight: 600;
            display: flex;
            width: 100%; 
            margin-bottom: 10px;
        }
        .input-container{
            position: relative;
            .community-list-container{
                width: 100%;
                height: 0px;
                position: absolute;
                transition: all 0.3s ;
                box-shadow: 0 0 10px #CDCDCD;
                background-color: #FFF;
                overflow: hidden;
                z-index: 1;
            }
            .open{
                height: 250px;
                overflow: scroll;
            }
        }
    }
}
</style>