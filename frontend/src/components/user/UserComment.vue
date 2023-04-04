<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import Friend from './Friend.vue';
import { UserPost } from '@/types/Entity/UserPost';
import { usePlus } from '@/hooks/useInteract';
import { PostComment } from '@/types/serviceEntity/posticeEntity/posticeEntity/post';
import { getFormatDate } from '@/utils/Date';
interface UserCommentProps {
    data:PostComment
}
const { data } = defineProps<UserCommentProps>()
const { startTransition } = useState({
    startTransition:false
})
const [ likeCount,likeAction, isLike ] = usePlus(8)
onMounted(()=>{
    setTimeout(()=>{
        startTransition.value = true
    },1000)
})
</script>
<template>
  <div  class="container">
    <Friend v-if="data.user" :marginBottom="0" 
    :data="{ 
        id:data.user.id , 
        icon:data.user.avatar,
        title:data.user.name,
        subTitle:getFormatDate(new Date(data.date))}" 
    />
    <div class="desc">
        {{ data.desc }}
    </div>
    <div class="interact-container">
        <!-- <div @click="likeAction" class="like-outer">
            <image :src="isLike ? '/static/community/like-fill.png' : '/static/community/like.png'" class="image" />
            <div v-if="likeCount!==0" class="count">{{ likeCount }}</div>
        </div> -->
        <div>
            <div  class="more-outer">
                <image src="/static/community/more.png" class="image" />
            </div>
        </div>
    </div>
    <div  style="padding: 15px 0px;padding-left: 50px;padding-right: 10px;">
        <u-line color="#CDCDCD"></u-line>
    </div>
  </div>
</template>

<style lang='less' scoped>
.container{
    position: relative;
    .desc{
        padding-left: 50px;
        font-weight: 100;
        font-size: 13px;
        color: @text-color;
    }
    .interact-container{
        position: absolute;
        display: flex;
        top: 10px;
        right: 10px;
        font-size: 13px;
        line-height: 15px;
        color: #b4b4b4;
        
        .image{
            width: 15px;
            height: 15px;
        }
        .like-outer {
            display: flex;
            align-items: center;
            margin-right: 20px;
            .image{
                margin-right: 5px;
            }
        }
        .more-outer{
            .image{
                width: 20px;
            }
        }
    }
}
</style>