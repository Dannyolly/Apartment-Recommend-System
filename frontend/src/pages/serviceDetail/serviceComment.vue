<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import Friend from '@/components/user/Friend.vue';
import Tags from '@/components/public/Tags.vue';
import Tag from '@/components/public/Tag.vue';
interface serviceCommentProps {
  props?:any
}
const {} = defineProps<serviceCommentProps>()
const height = getDimension().height +'px' 
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
    },
    {
        'icon':'/static/icon.png',
        'title':'Danny',
        'subTitle':'3天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Tom',
        'subTitle':'18天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Danny',
        'subTitle':'3天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Tom',
        'subTitle':'18天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Danny',
        'subTitle':'3天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Tom',
        'subTitle':'18天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Danny',
        'subTitle':'3天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Tom',
        'subTitle':'18天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Danny',
        'subTitle':'3天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Tom',
        'subTitle':'18天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Danny',
        'subTitle':'3天前'
    },
    {
        'icon':'/static/icon.png',
        'title':'Tom',
        'subTitle':'18天前'
    },
    
]
const tags = [
    '全部','好评','中评','差评','专业认真','放心','干活利落'
]
const { currentIndex } = useState({
    currentIndex:0
})
onMounted(()=>{

})
onLoad((query)=>{

})
onPageScroll(()=>{})
</script>
<template>
<div  :style='{height:height}' class='container'>
    <div class="tags-container">
        <div @click="currentIndex = index" v-for="(tag,index) in tags" class="tag-container">
            <Tag  v-if="currentIndex != index" :content-style="{ padding:'5px 20px'}" :title="tag"/>
            <Tag  v-else :content-style="{ padding:'5px 20px',backgroundColor:'rgb(36,202,254)',color:'#fff'}" :title="tag"/>
        </div>
    </div>
    <div class="user-outer">
        <div v-for="user in users" class="user-comment-container">
            <Friend  :data="user" :sub-title-font-size="10" />
            <div class="desc">
                Vue 是一个渐进式的 JavaScript 框架，旨在通过简单的 API 构建快速、可维护的用户界面。
            </div>
        </div>
    </div>
</div>
</template>

<style lang='less' scoped>
.container{
    
    .tags-container{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 10px;
        .tag-container{
            display: flex;
        }
    }
    .user-outer{
        padding: 20px;
        .user-comment-container{
            margin-bottom: 30px;
            .desc{
                transform: translateY( -5px );
                padding: 0 5px;
                font-size: 12.5px;
            }
        }
    }
}
</style>