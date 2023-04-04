<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad, onPageScroll, onPullDownRefresh } from '@dcloudio/uni-app';
import Navigation from '@/components/Navigation/UserInfo.vue'
import { useNavigationScroll } from '@/hooks/useScroll';
import { UserInfo } from '@/types/serviceEntity/user';
import Friend from '@/components/user/Friend.vue';
import UserPost from '@/components/user/UserPost.vue';
import { LocalStorageManager } from '@/utils/localStorage';
import { ServiceManager } from '@/service';
import { FormattedPost, PostType } from '@/types/serviceEntity/post';
import { usePage } from '@/hooks/usePage';
import SwiperList from '@/components/public/SwiperList.vue';
import { DataList } from '@/types/Entity/DataList';
import { PostSerivce } from '@/service/PostService';
import { baseUrl } from '@/api/config';
import { isLet } from '@babel/types';
import { NO } from '@vue/shared';
import NoMore from '@/components/public/NoMore.vue';

const height = getDimension().height + 'px'
const { opacity, navigationHeight, measuringCb } = useNavigationScroll(150)
const {  dataList, isFollow, pageSize, currentPage, userId ,isLoad ,isSelf,tabbarVal} = useState({
    dataList: [
        {
            title: '帖子',
            data: []
        },
        {
            title: '问答',
            data: []
        }
    ] as Array<DataList<FormattedPost>>,
    isFollow: false,
    userId: -1,
    isLoad:false,
    isSelf:false,
    tabbarVal:'',
    ...usePage(0, 5)
})
const userT = { id: 1, icon: '/static/icon.png', title: 'danny', 'subTitle': 'hello you can call me danny' }
const prestige = [
    {
        name: '关注',
        count: 104
    },
    {
        name: '粉丝',
        count: 39
    },
    {
        name: '获赞',
        count: 294
    }
]
//@ts-ignore
const setup = async (query)=>{
    // @ts-ignore
    const followId = query.userId
    //const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    const userId = 1
    if(userId === followId){
        isSelf.value = true
        return;
    }
    const { result } = await ServiceManager.UserService.checkFollow(userId,followId)
    isFollow.value = result === 1
    const { result :postRes} = await ServiceManager.PostService.getAllPosts({
        userId,
        type: PostType.NORMAL,
        page: currentPage.value,
        pageSize:pageSize.value
    })
    const { result :qanda} = await ServiceManager.PostService.getAllPosts({
        userId,
        type: PostType.QANDA,
        page: currentPage.value,
        pageSize:pageSize.value
    })
    postRes.push(...qanda)
    postRes.forEach(v=>{
        v.type  === PostType.NORMAL?
            dataList.value[0].data.push(v)
            :
            dataList.value[1].data.push(v)
    })
    dataList.value[0].data = dataList.value[0].data.map(v => {
        v.picArr = v.pic.split(',').map(v=>baseUrl +v)
        return v
    })
    isLoad.value = true
}
onLoad(async (query) => {
    setup(query)
    
})

onPullDownRefresh(()=>{

})


onPageScroll(() => { })
</script>
<template>
    <Navigation :measuring-cb="measuringCb" :opacity="opacity" :title="'danny'" />
    <div :style="{ height: height }" class='container'>
        <div class="background-container"></div>
        <div class="info-container">
            <div class="user-detail-container">
                <div class="user-info">
                    <Friend 
                        :follow="isFollow" 
                        :isShowFollow="isSelf?true:false" 
                        :data="userT" 
                        :image-size="50"
                        :title-font-size="16"
                        :sub-title-font-size="13" 
                    />
                </div>
                <div class="prestige-container">
                    <div class="prestige" v-for="{ name, count } in prestige">
                        <div class="name">{{ name }}</div>
                        <div class="count">{{ count }}</div>
                    </div>
                </div>
            </div>
            <div class="user-post-container">
                <SwiperList v-if="navigationHeight"  :dataList="dataList" 
                :offset-top="navigationHeight+20" v-slot="{ data }" :flex="true"  >
                    <div v-if="data.length!==0">
                        <div  v-for="item in data" style="padding: 0px 10px;width: calc( 100% - 10px );padding-top: 10px;">
                            <UserPost :margin-bottom="0" :post="item" />
                        </div>
                    </div>
                    <div v-else>
                        <NoMore/>
                    </div>
                </SwiperList>

            </div>
        </div> 
    </div>
</template>

<style lang='less' scoped>
.container {
    background-color: rgb(242, 242, 242);
    .background-container {
        width: 100%;
        height: 200px;
        background-image: linear-gradient(rgb(66, 154, 254), rgb(41, 192, 253), rgb(33, 207, 254));

    }

    .info-container {
        padding: 0px;
        transform: translateY(-20px);
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        background-color: rgb(242, 242, 242);

        .user-detail-container {
            background-color: #FFF;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            padding-bottom: 20px;

            .user-info {
                padding: 10px 20px;
                padding-top: 20px;
            }

            .prestige-container {
                display: flex;
                gap: 20px;
                padding: 0 20px;

                .prestige {
                    display: flex;
                    gap: 5px;
                    line-height: 20px;

                    .name {
                        color: @desc-color;
                        font-size: 14px;
                    }

                    .count {
                        font-weight: 600;
                    }
                }
            }
        }

        .user-post-container {
            padding: 0px;
            padding-right: 0px;
            width: calc(100% - 0px);
            height: 100%;
        }
    }
}
</style>