<script setup lang='ts'>
import {defineProps, toRefs, ref, watchEffect, onMounted, onUnmounted} from 'vue';
import {useState} from '@/hooks/useState';
import NavigationBar from '@/components/Navigation/NavigationBar.vue';
import CommunityNavigationBar from '@/components/Navigation/Community.vue'
import { getDimension } from '@/utils/Equipment'
import { onPageScroll } from '@dcloudio/uni-app';
import SwiperList from '@/components/public/SwiperList.vue';
import { DataList } from '@/types/Entity/DataList';
import UserPost from '@/components/user/UserPost.vue'
import Friend from '@/components/user/Friend.vue'
import { ServiceManager } from '@/service'
import { LocalStorageManager } from '@/utils/localStorage';
import Notis from '@/components/public/Notis.vue';
import { NotificationType } from '@/types/PublicCompType';
import { FormattedPost, PostType } from '@/types/serviceEntity/post';
import { usePubSub } from '@/hooks/usePubSub';
import { baseUrl } from '@/api/config';
import Tabbar from '@/components/Tabbar.vue';
import { UserInfo } from '@/types/serviceEntity/user';
interface CommunityProps {}
const {} = defineProps<CommunityProps>()
const height = getDimension().height 
const scrollTopMax = 70
const pubsub = usePubSub();
const { opacity,navigationHeight,dataList,fdRecommendList,fdRecommendIndex,info ,showAllPostOpton} = useState({
  opacity:0,
  navigationHeight:0,
  dataList: [
        // {
        //     title: '推荐',
        //     data: []
        // },
        {
            title: '关注',
            data: []
        },
        {
            title: '问答',
            data: []
        }
  ] as Array<DataList<FormattedPost>>,
  fdRecommendList:[] as UserInfo[],
  fdRecommendIndex:0,
  info:'',
  showAllPostOpton:false
})
const Noti = ref<NotificationType>();
// actionSheet
const { title , list ,show } = useState({
    title:'Options',
    list: [
      {
        name:'report',
      },
      {
        name: 'ban',
      },
    ],
    show: false,
})


const openOption = ()=>{
  show.value = true
  setTimeout(()=>{
    uni.hideTabBar({
      animation:false
    })
  },0)
  
}
const closeOption = ()=>{
  uni.showTabBar({
    animation:false
  })
  show.value = false
}
const onSelect = (title:string)=>{
  console.log(`select-${title}`);
  
}
const onChange = ({detail}:any)=>{
  fdRecommendIndex.value =  detail.current
}
const follow = async (state:boolean,followId:number)=>{
  //console.log(state,followId);
  
  //const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
  if(state){
    //const { result } = await ServiceManager.UserService.follow(userId,followId)
    //info.value = result
    Noti.value?.open('follow')
  }else{
    //const { result } = await ServiceManager.UserService.unFollow(userId,followId)
    //info.value = result
    Noti.value?.open('unfollow')
  }
}
const goPublishPost = (type:PostType)=>{
  uni.navigateTo({
    url:'/pages/PublishPost?type='+type
  })
  showAllPostOpton.value = false
}

onPageScroll(({scrollTop})=>{
  if(scrollTop>scrollTopMax+100){
    return 
  }
  opacity.value = scrollTop / scrollTopMax
})
onMounted(async ()=>{
  // 獲取所有post
  dataList.value[0].data =  (await ServiceManager.PostService.getAllPosts({userId:1,page:0,pageSize:5,type:PostType.NORMAL})).result
  dataList.value[1].data = (await ServiceManager.PostService.getAllPosts({userId:1,page:0,pageSize:5,type:PostType.QANDA})).result
  dataList.value[0].data = dataList.value[0].data.map(v => {
      v.picArr = v.pic.split(',').map(v=>baseUrl +v)
      return v
  })

  // 加載所有好友推薦列表..
  const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
  const res = await  ServiceManager.UserService.getRecommendUser(userId)
  console.log(res);
  fdRecommendList.value = res

  // 訂閱發布事件
  pubsub.subscribe('post',(msg,data)=>{
    let post:FormattedPost = JSON.parse(data)
    post.user = LocalStorageManager.getLocalStorageInfo('userInfo')
    post.picArr = post.pic.split(',').map(v=>baseUrl + v)
    post.type === PostType.NORMAL?
      dataList.value[0].data.unshift(post)
      :
      dataList.value[1].data.unshift(post)
    Noti.value?.open("upload Post successfully")
  })
})

onUnmounted(()=>{
  pubsub.unsubscribe('post')
})
</script>
<template>
  <div class="community-container"  >
    <image
      :showLoading="true" 
      :src="'/static/community/home.jpg'" 
      mode="widthFill"
      class="top-image"
    />
    <!-- <div class="top-container">
      <div class="title">发现生活</div>
      <div class="sub-title">50万业主都在分享的生活广场</div>
    </div> -->
    <CommunityNavigationBar 
        :measuringCb="height=>navigationHeight = height" 
        :opacity="opacity"
    />
    <div class="main-container">
      <div class="top-container">
        <div class="title">发现生活</div>
        <div class="sub-title">50万业主都在分享的生活广场</div>
      </div>
       <div class="fd-recommend-list-container">
          <div class="rl-title">
              推荐关注
          </div>
          <div class="paganation">
            <div :class="{cur:index === fdRecommendIndex}" v-for="(item,index) in 3" class="point" ></div>
          </div>
          <swiper @change="onChange">
            <swiper-item>
              <Friend 
              is-show-follow 
              :key="index" v-for="(item,index) in fdRecommendList.slice(0,3) " 
              :data="{
                id:item.id,
                icon:item.avatar,
                title:item.name,
                subTitle:'recommend'
              }" 
              :follow-callback="follow" />
            </swiper-item>
            <swiper-item>
              <Friend 
              is-show-follow 
              :key="index" 
              v-for="(item,index) in fdRecommendList.slice(3,6) " 
              :data="{
                id:item.id,
                icon:item.avatar,
                title:item.name,
                subTitle:'recommend'
              }" 
              :follow-callback="follow" />
            </swiper-item>
            <swiper-item>
              <Friend 
              is-show-follow 
              :key="index" 
              v-for="(item,index) in fdRecommendList.slice(6,9) " 
              :data="{
                id:item.id,
                icon:item.avatar,
                title:item.name,
                subTitle:'recommend'
              }" 
              :follow-callback="follow" />
            </swiper-item>
          </swiper>
       </div>
       <div class="user-post-container">
          <SwiperList  v-if="navigationHeight" bgColor="#f7f7f7" :dataList="dataList" :flex="false" :offset-top="navigationHeight+1" v-slot="{ data , title  }">
              <UserPost 
                v-for="(post ) in data"
                :key="post.id"
                :margin-bottom="title==='问答'?10:15" 
                :openOption="openOption" 
                :post="post"
              />
          </SwiperList>
       </div>
    </div>
    <u-action-sheet
      :safeAreaInsetBottom="true" 
      @select="onSelect"
      @close="closeOption" 
      :actions="list" 
      :title="title" 
      :show="show"
      round="20"
     />
  </div>
  <div @click="showAllPostOpton = !showAllPostOpton" class="publish-1">
    <image  class="img" src="/static/community/publish.png"/>
  </div>
  <div @click="()=>goPublishPost(PostType.NORMAL)" class="publish-2" :class="{move2:showAllPostOpton}">
    <image class="post" src="/static/community/post.png" />
  </div>
  <div @click="()=>goPublishPost(PostType.QANDA)" class="publish-3" :class="{move3:showAllPostOpton}">
    <image class="qanda" src="/static/community/qanda.png"/>
  </div>
  <Notis  ref="Noti" :info="info" isTabbar />
  <Tabbar/>
</template>

<style lang='less' scoped>

.publish-1{
    z-index: 3;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px #CDCDCD;
    border-radius: 50%;
    position: fixed;
    border-bottom: 0px;
    right: 20px;
    bottom: 105px;
    background-color: @major-color;
    z-index: 1001;
    .img{
      width: 20px;
      height: 20px;
    }
}
.publish-2.move2{
  bottom: 165px;
}
.publish-3.move3{
  bottom: 225px;
}
.publish-2{
    transition: all 0.3s;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px #CDCDCD;
    border-radius: 50%;
    position: fixed;
    border-bottom: 0px;
    right: 20px;
    bottom: 105px;
    background-color: @major-color;
    z-index: 1000;
    .post{
      width: 20px;
      height: 20px;
    }
    
    
}
.publish-3{
    transition: all 0.3s;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px #CDCDCD;
    border-radius: 50%;
    position: fixed;
    border-bottom: 0px;
    right: 20px;
    bottom: 105px;
    background-color: @major-color;
    z-index: 999;
    .qanda{
      width: 20px;
      height: 20px;
    }
    
}
.community-container{
  width: 100%;
  position: relative;
  background-color: rgb(247,247,247);
  .top-image{
    width: 100%;
    height: 250px;
    z-index: 0;
    //opacity: 0.7;
    filter: opacity(0.7);
    position: absolute;
  }
  .top-container{
    z-index: 5;
    padding: 10px;
    margin-bottom: 10px;
    color:black;
    .title{
      font-size: 20px;
      font-weight: bolder;
    }
    .sub-title{
      font-size: 12px;
      color: @text-color;
    }
  }
  .main-container{
    ///background-color: #FFF;
    background-color: rgb(247,247,247);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    width: calc( 100% - 20px ) ;
    position: absolute;
    top: 190px;
    z-index: 10;
    padding: 10px;
    padding-top: 20px;
    .fd-recommend-list-container{
      background-color: #FFFFFF;
      padding: 20px;
      padding-bottom: 40px;
      border-radius: 20px;
      position: relative;
      margin-bottom: 10px;
      .rl-title{
        font-weight: bolder;
        font-size: 14px;
        margin-bottom: 10px;
      }
      .paganation{
        width: 45px;
        height: 20px;
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: space-around;
        .point{
          background-color: #CDCDCD;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .cur{
          background-color: black;
        }
      }
    }

    .user-post-container{

    }
    
  }
}
</style>