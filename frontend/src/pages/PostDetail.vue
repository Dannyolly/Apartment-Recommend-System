<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import { UserPost as UserPostEntity } from '@/types/Entity/UserPost';
import UserPost from '@/components/user/UserPost.vue';
import UserComment from '@/components/user/UserComment.vue';
import { usePlus } from '@/hooks/useInteract'
import { ServiceManager } from '@/service';
import { FormattedPost, Post, PostComment } from '@/types/serviceEntity/posticeEntity/posticeEntity/post';
import { LocalStorageManager } from '@/utils/localStorage';
import { NotificationType } from '@/types/PublicCompType'
import { uuid } from '@/utils/uuid';
import Notis from '@/components/public/Notis.vue';
import { onLoad } from '@dcloudio/uni-app';
import { useNoti } from '@/hooks/useNoti';
import { usePage } from '@/hooks/usePage';
import { getUserInfo } from '@/api/login';
import NoMore from '@/components/public/NoMore.vue';
const { text, data, user, comments, noti, pageSize, currentPage } = useState({
    text: '',
    data: {} as FormattedPost,
    user: {
        icon: '/static/icon.png',
        name: 'jimmy',
        desc: '快来和我平分千元好礼，参加自如做省心房东，希望自如越来越自如',
        pic: [
        ]
    },
    comments: [] as PostComment[],
    ...useNoti(),
    ...usePage()
})
const [likeCount, likeAction, isLike] = usePlus(0, async () => {
    const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    const postId = data.value.id
    if (isLike.value) {
        await ServiceManager.PostService.likeAdd({
            userId,
            postId
        })
    } else {
        await ServiceManager.PostService.likeCancel({
            userId,
            postId
        })
    }
})
const [commentCount, commentAction] = usePlus(0)
const onClick = () => { }
const onChange = () => { }
const submit = async (t: any) => {
    text.value = ''
    let desc = t.detail.value
    let userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    let postId = data.value.id
    let commentT: PostComment = {
        id: 0,
        userId,
        postId,
        title: '',
        desc,
        date: new Date().toJSON(),
        like: 0,
        toUserId: 0,
        user: LocalStorageManager.getLocalStorageInfo('userInfo')
    }
    const { result } = await ServiceManager.PostService.addComment({
        desc,
        userId,
        postId,
        title: ''
    })
    comments.value.unshift(commentT)
    commentCount.value++
    noti.value?.open("已成功留言")
    
}
const onTyping = (t: any) => {
    //console.log(t);
}

onLoad(async (query) => {
    if (!query) return;
    let post: FormattedPost = JSON.parse(decodeURIComponent(query.post))
    data.value = post
    likeCount.value = post.like
    isLike.value = JSON.parse(query.isLike)
    commentCount.value = Number(query.commentCount)
    let temp = (await ServiceManager.PostService.comments({
        postId: post.id,
        page: currentPage.value,
        pageSize: pageSize.value
    })).result
    for (let i = 0; i < temp.length; i++) {
        const el = temp[i];
        el.user = (await ServiceManager.UserService.getUserById(post.userId)).result
    }
    comments.value = temp
    

    console.log(isLike.value);
    
    
})
</script>
<template>
    <div class="container">
        <div class="swiper-container">
            <u-swiper height="700" imgMode="aspectFill" :list="data.picArr" @change="onChange" @click="onClick" />
        </div>
        <div v-if="data.user" class="user-container">
            <UserPost :show-pic="false" :showInteract="false" :post="data" />
        </div>
        <div style="padding: 0px 15px;">
            <u-line color="#CDCDCD"></u-line>
        </div>
        <div class="comment-container">
            <div class="title">
                评论
                <div class="count">({{ commentCount }})</div>
            </div>
            <div class="user-comments-container">
                <div v-if="comments.length!==0">
                    <div class="user-comments-real-container" :key="comment.id" v-for="(comment, index) in comments">
                        <UserComment :data="comment" />
                    </div>
                </div>
                <div v-else>
                    <NoMore title="没有更多留言了"/>
                </div>
            </div>
        </div>
        <div class="user-comment-container">
            <div class="input-container">
                <input :focus="true" @confirm="submit" confirm-type="search" placeholder="说点甚么吧" v-model="text"
                    @change="onTyping" />
            </div>
            <div class="interact-container">
                <div @click="likeAction" class="outer">
                    <image v-if="isLike" :src="'/static/community/like-fill.png'" class="image" />
                    <image v-else :src="'/static/community/like.png'" class="image" />
                    <div v-if="likeCount !== 0" class="count">{{ likeCount }}</div>
                </div>
            </div>
        </div>
    </div>
    <Notis ref="noti" :duration="2000" />
</template>

<style lang='less' scoped>
.user-comments-real-container {}

.container {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 87px;

    .swiper-container {
        width: 100%;
    }

    .comment-container {
        padding: 15px;
        color: black;
        font-weight: bolder;

        .title {
            font-size: 18px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            margin-right: 5px;

            .count {
                font-size: 14px;
            }
        }
    }

    .user-comment-container {
        padding: 5px;
        padding-top: 10px;
        padding-bottom: 44px;
        width: 100px;
        position: fixed;
        display: flex;
        bottom: 0;
        z-index: @bottom-bar-z-index;
        width: calc(100% - 10px);
        background-color: #FFF;
        box-shadow: 0px 0px 10px #CDCDCD;

        .input-container {
            padding-top: 3px;
            padding-left: 10px;
            height: 30px;
            width: 70%;
            position: relative;
            line-height: 30px;

            input {
                height: 30px;
                background-color: @input-bkColor;
                border-radius: 10px;
                font-size: 13px;
                padding-left: 30px;

            }
        }

        .interact-container {
            padding-left: 20px;
            display: flex;
            line-height: 25px;
            font-size: 14px;

            color: @text-color;

            .image {
                width: 25px;
                height: 25px;
                margin-right: 3px;
            }

            .outer {
                display: flex;
                align-items: center;
                margin-right: 15px;
            }
        }
    }

}
</style>