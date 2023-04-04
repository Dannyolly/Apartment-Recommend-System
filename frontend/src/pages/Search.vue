<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted } from 'vue';
import { useState } from '@/hooks/useState';
import { usePicker } from '@/hooks/usePicker';
import { ServiceManager } from '@/service';
interface SearchProps {
    any: any
}
const { } = defineProps<SearchProps>()
const { text ,community,open } = useState({
    text: '',
    community:[] as string[],
    open:false
})
const { show, columns ,cur } = usePicker(['小区','道路'])
const back = () => uni.navigateBack()
const recommendList: Array<{
    pic: string,
    title: string,
    list: Array<string>
}> = [
        {
            pic: '/static/home/community.png',
            title: '热门小区',
            list: [
                '铁机盛世家园',
                '泛悦城',
                '光谷青年城(一期)',
                '碧桂园泰富城',
                '成园小区'
            ]
        }
        // ,
        // {
        //     pic: '/static/home/train.png',
        //     title: '热搜地铁',
        //     list: [
        //         '九亭',
        //         '中山公园',
        //         '七宝',
        //         '世纪大道',
        //         '桃浦新村'
        //     ]
        // }
]
const submit = ()=>{
    // do some request
    uni.navigateTo({
        url:`/pages/HouseSearch/Search?keyword=${text.value}&option=${cur.value}`,
    })
}
const confirm = (e:any)=>{
    show.value = false
    cur.value = e.value[0]
}

const onInput = () =>{
    // @ts-ignore
    uni.$u.debounce(async()=>{
       
       const res = await ServiceManager.RoomService.getCommunityByKeyWord(text.value)
        community.value = res.result
    },500)
    
}
const chooseCommunity = (v:string)=>{
    text.value = v
    submit()
}
const onFocus = ()=>{
    open.value = true
}
const onBlur = ()=>{
    open.value =false
}
</script>
<template>
    <div class="search-container">
        <u-picker @confirm="confirm" @cancel="show = false" closeOnClickOverlay :show="show" :columns="columns"></u-picker>
        <div class="input-container">
            <div @click="show = true" class="option">
                {{ cur }}
                <image class="img" src="/static/down.png" />
            </div>
            
            <input @focus="onFocus" @blur="onBlur"  @confirm="submit" confirm-type="search" placeholder="你想住哪?" v-model="text" @input="onInput" />
            <div @click="back" style="position: absolute;right: -40px;top: 0;font-size: 14px;">取消</div>
            <div :class="{open:open}" class="community-list-container">
                <div :style="{padding:'5px 20px'}" @click="()=>chooseCommunity(item)" v-for="item in community">{{ item }}</div>
            </div>
        </div>
        
        <div class="recommend-keyword-container">
            <div class="title">大家都在看</div>
            <div class="recommend-outer-container">
                <div v-for="(item, index) in recommendList" class="recommend-container">
                    <div class="recommend-top">
                        <image :showLoading="true" :src="item.pic" class="pic" mode="widthFill" />
                        <div>{{ item.title }}</div>
                    </div>
                    <div class="recommend-list">
                        <div @click="chooseCommunity(i)" class="item" v-for="(i, index) in item.list">{{ i }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang='less' scoped>
.search-container {
    padding: 20px;
    position: relative;

    .input-container {
        padding-left: 0px;
        height: 33px;
        width: 90%;
        position: relative;
        margin-bottom: 30px;
        line-height: 33px;
        .option{
            position: absolute;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 13px;
            width: 60px;
            .img{
                width: 12px;
                height: 12px;
                padding-left: 2px;
            }
        }
        input {
            height: 33px;
            background-color: rgb(239, 239, 239);
            border-radius: 5px;
            font-size: 13px;
            padding-left: 60px;

        }
        .community-list-container{
            width: calc( 100% - 60px );
            height: 0px;
            left: 60px;
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
    
    .recommend-keyword-container {
        .title {
            font-size: 15px;
            margin-bottom: 20px;
        }

        .recommend-outer-container {
            display: flex;
            .recommend-container {
                margin-right: 20px;
                display: flex;
                flex-direction: column;

                .recommend-top {
                    display: flex;
                    line-height: 20px;
                    font-size: 14px;

                    .pic {
                        width: 20px;
                        height: 20px;
                        margin-right: 3px;
                    }
                }

                .recommend-list {
                    padding-top: 10px;
                    padding-left: 23px;

                    .item {
                        margin-bottom: 10px;
                        font-size: 14px;
                        color: @desc-color;
                    }
                }
            }
        }

    }
}
</style>