<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import Friend from '@/components/user/Friend.vue'
import { usePlus } from '@/hooks/useInteract'
import { ServiceManager } from '@/service';
import { FormattedPost, Post, PostType } from '@/types/serviceEntity/post';
import { LocalStorageManager } from '@/utils/localStorage';
import { baseUrl } from '@/api/config';
import { calculateDate, getFormatDate } from '@/utils/Date';
interface UserPostProps {
  post: FormattedPost,
  openOption?:()=>void,
  marginBottom?:number,
  descFontSize?:number,
  showInteract?:boolean,
  showPic?:boolean
}
const { post ,openOption , marginBottom , descFontSize,showInteract  } = withDefaults(
  defineProps<UserPostProps>(),
  {
    marginBottom:15,
    descFontSize:12,
    showInteract:true,
    showPic:true
  }
)
const [ likeCount,likeAction, isLike ] = usePlus(post.like,async ()=>{
  const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
  if(isLike.value){
    await ServiceManager.PostService.likeAdd({
      userId,
      postId:post.id
    })
  }else{
    await ServiceManager.PostService.likeCancel({
      userId,
      postId:post.id
    })
  }
  
})
const { commentCount } = useState({
  commentCount:0
})
const goDetailPage = ()=>{
  uni.navigateTo({
    url:'/pages/PostDetail?post='+ encodeURIComponent(JSON.stringify(post))+'&isLike='+isLike.value+'&commentCount='+commentCount.value
  })
}
onMounted( async()=>{
  const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
  const postId = post.id
  const {result} = await ServiceManager.PostService.likeCheck({
    postId,
    userId
  })
  commentCount.value = (await ServiceManager.PostService.commentCount(postId)).result
  
  isLike.value =  result === 'liked'
  //console.log(postId,result,isLike.value);
  
})
</script>
<template>
  <div @click="goDetailPage" :style="{ marginBottom:marginBottom+'px' }" class="user-post-container">
    <Friend  :data="{ id:post.id,icon:post.user.avatar, title: post.user.name, subTitle: calculateDate(new Date(post.date))+'' }" />
    <div :style="{ fontSize:descFontSize }" class="desc">
      {{ post.desc }}
    </div>
    <div v-if="post.type === PostType.NORMAL && showPic && post.picArr?.length!==0" class="pic-container">
      <image imgMode="aspectFill" v-for="(url, index) in post.picArr" :src="url" class="pic" />
    </div>
    <div v-if="showInteract" class="interact-container">
      <div class="comment-outer">
        <image src="/static/community/comment.png" class="image" />
        <div class="count">{{ commentCount }}</div>
      </div>
      <div @click.stop="likeAction" class="like-outer">
        <image v-if="isLike" src="/static/community/like-fill.png" class="image" />
        <image v-else src="/static/community/like.png" class="image" />
        <div v-if="likeCount!==0" class="count">{{ likeCount }}</div>
      </div>
      <div @click.stop="openOption" class="more-outer">
        <image src="/static/community/more.png" class="image" />
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.user-post-container {
  width: calc(100% - 40px);
  padding: 15px;
  background-color: #FFF;
  border-radius: 10px;
  margin-bottom: 15px;

  .desc {
    padding: 0 5px;
    padding-bottom: 5px;
    color: @text-color;
    font-size: 12px;
  }

  .pic-container {
    display: flex;
    flex: 1;
    padding: 10px 5px;

    .pic {
      display: flex;
      width: 100px;
      height: 100px;
      border-radius: 5px;
      margin-right: 10px;
    }
  }

  .interact-container {
    display: flex;
    font-size: 12px;
    padding: 0px 5px;
    padding-top: 5px;
    .image {
      width: 15px;
      height: 15px;
      margin-right: 3px;
    }

    .comment-outer {
      display: flex;
      align-items: center;
      margin-right: 15px;
    }

    .like-outer {
      display: flex;
      align-items: center;
    }

    .more-outer {
      position: absolute;
      right: 30px;

      .image {
        width: 20px;
      }
    }
  }
}
</style>