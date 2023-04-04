<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
type Base = {
    id:number,
    icon:string,
    title:string,
    subTitle:string
}
interface FriendProps {
    data:Base,
    isShowFollow?:boolean,
    marginBottom?:number,
    subTitleColor?:string,
    subTitleFontSize?:number,
    titleColor?:string,
    titleFontSize?:number,
    imageSize?:number,
    follow?:boolean,
    followCallback?:(state:boolean,userId:number)=>void,
    onlyShow?:boolean
}
const { 
    onlyShow,
    followCallback,
    data ,
    isShowFollow, 
    marginBottom,
    titleColor,
    subTitleColor,
    follow 
} = withDefaults(
    defineProps<FriendProps>(),
    {
        isShowFollow:false,
        marginBottom:15,
        subTitleColor:'rgb(137,137,137)',
        subTitleFontSize:8,
        titleColor:'#000000',
        titleFontSize:14,
        imageSize:40,
        follow:false,
        onlyShow:false
    }
)
const { isFollow } = useState({
    isFollow:follow
})
const followAction = ()=>{
    isFollow.value = !isFollow.value
    followCallback && followCallback(isFollow.value,data.id)
}
const goUserInfo = ()=>{
    //console.log(onlyShow);
    
    if(onlyShow) return
    uni.navigateTo({
        url:'/pages/user/UserInfo?userId='+data.id
    })
}

</script>
<template>
  <div :style="{ marginBottom:marginBottom+'px' }" class="container">
    <image
        @click="goUserInfo"
        :src="data.icon"
        mode="widthFill"
        :style="{width:imageSize+'px',height:imageSize+'px',borderRadius:(imageSize/2)+'px'}"
        class="icon"
    />
    <div :style="{height:imageSize+'px'}" class="content">
        <div :style="{color:titleColor,fontSize:titleFontSize+'px'}" class="title">{{ data.title }}</div>
        <div :style="{color:subTitleColor,fontSize:subTitleFontSize+'px'}" class="sub-title">{{ data.subTitle }}</div>
    </div>
    <div @click="followAction"  v-if="isShowFollow" class="interaction">
        <div  :style="isFollow?{backgroundColor:'#e6e6e6',color:'black'}:{}" class="btn">
            {{ isFollow?'已关注':'关注' }}
        </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.container{
    display: flex;
    width: 100%;
    margin-bottom: 15px;
    position: relative;
    .icon{
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin-right: 10px;
    }
    .content{
        height: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title{
            font-size: 14px;
            padding-bottom: 3px;
            font-weight: bolder;
        }
        .sub-title{
            font-size: 8px;
            color: @desc-color;
        }
    }
    .interaction{
        position: absolute;
        right: 10px;
        height: 40px;
        display: flex;
        align-items: center;
        .btn{
            width: 30px;
            display: flex;
            justify-content: center;
            background-color: @major-color;
            border-radius: 10px;
            font-size: 10px;
            padding: 5px;
            padding-left: 10px;
            padding-right: 10px;
            color: #FFF;
        }
    }
}
</style>
