<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import Notis from '@/components/public/Notis.vue';
import { useNoti } from '@/hooks/useNoti'
import { uploadImage } from '@/api/request';
import { ServiceManager } from '@/service';
import { LocalStorageManager } from '@/utils/localStorage';
import { PostType } from '@/types/serviceEntity/post';
import { usePubSub } from '@/hooks/usePubSub';
interface PublishPostProps {
  props?:any
}
const {} = defineProps<PublishPostProps>()
const pubsub  = usePubSub()
const height = getDimension().height +'px' 
const { noti,fileList ,title,desc , isQAndA } = useState({
 ...useNoti(),
 fileList:[] as any[],
 title:'',
 desc:'',
 isQAndA:false
})
async function afterRead(event:any) {
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    let lists:any[] = [].concat(event.file)
    let url =  lists[lists.length-1].url
    console.log(event, lists);
    lists.forEach((item) => {
        fileList.value.push({
            ...item,
            //status: 'uploading',
            //message: '上传中'
        })
    })
    console.log(lists);
}
function deletePic(event:any) {
    fileList.value.splice(event.index, 1)
}
async function uploadPostAction(){
    let urls =  fileList.value.map(v=>v.url)
    
    const userId = LocalStorageManager.getLocalStorageInfo('userInfo').id
    const { result } = await ServiceManager.PostService.uploadPost(urls,userId,title.value,desc.value,isQAndA.value)
    pubsub.publish('post',JSON.stringify(result))
    console.log('publish');
    
    setTimeout(() => {
        uni.navigateBack()
    }, 0);
}   
onMounted(()=>{
    
})

onLoad((query)=>{  
    if(!query) return
    isQAndA.value =  Number(query.type)  === PostType.QANDA

})
onPageScroll(()=>{})
</script>
<template>
<div  :style='{height:height}' class='container'>
    <div v-if="!isQAndA" class="pic-container">
        <u-upload
            :fileList="fileList"
            @afterRead="afterRead"
            @delete="deletePic"
            multiple
            :maxCount="10"
            :width="220"
	        :height="220"
        />
    </div>
    <div class="content-container">
        <div class="title-container">
            <u-input
                v-model="title"
                placeholder="填写标题会有更多赞哦~"
                border="bottom"
                clearable
            />
        </div>
        <div class="desc-container">
            <u-textarea 
                v-model="desc" 
                placeholder="输入正文" 
                :height="300"
                count
                border="bottom"
            />
        </div>
    </div>
    <div class="bottom-container">
        <div @click="uploadPostAction" class="uploader">上传帖子</div>
    </div>
</div>
<Notis ref='noti'  :duration='2000' />
</template>

<style lang='less' scoped>

.container{

    :deep( .u-upload__button){
        border-radius: 10px;
    }
    :deep(.u-upload__wrap__preview__image){
        border-radius: 10px;
    }
    :deep(.u-textarea){
        border: 0px;
        padding-top: 20px;
    }
    :deep(.u-input__content){
        margin-bottom: 10px;
    }
    .pic-container{
        padding: 15px;
    }
    .content-container{
        padding: 0px 15px;
    }
    .bottom-container{
        padding: 20px;
        padding-bottom: 37px;
        position: fixed;
        bottom: 0px;
        width: calc( 100% - 40px );
        //box-shadow: 0 0 20px #CDCDCD;
        .uploader{
            width: calc( 100% - 0px);
            height: 35px;
            border-radius: 20px;
            color: #FFF;
            background-color: @major-color;
            text-align: center;
            line-height: 35px;
        }
    }
}
</style>