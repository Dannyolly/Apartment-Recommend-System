<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';

interface InputProps {
  props?:any,
  commmit?:(word:string)=>void,
  bkColor?:string,
  fontColor?:string,
  width?:string,
  boxShadow?:string,
  borderRadius?:string,
  defaultText?:string,
  showIcon?:boolean,
  paddingLeft?:number,
  onChange?:(word:string)=>void,
  onFocus?:()=>void,
  onBlur?:()=>void
}
const { defaultText , onChange } = withDefaults(
    defineProps<InputProps>(),
    {
        bkColor:"#FFFFFF",
        fontColor:"",
        width:'200',
        boxShadow:'0px 0px 10px #CDCDCD',
        borderRadius:'5',
        defaultText:'',
        showIcon:true,
        paddingLeft:30,
        onFocus:()=>{},
        onBlur:()=>{}
    }
)
const { text } = useState({
    text:defaultText
})

const setText = (v:string)=>{
    text.value = v
}
defineExpose({
    setText
})
const onInput = (v:Event)=>{
    // @ts-ignore
    uni.$u.debounce(()=>{
        onChange && onChange(text.value)
    },1000)
    
}

onMounted(()=>{
    
})
</script>
<template>
  <div :style="{ width:width?`calc( ${width} - 0px )`:width+'px' }" class="input-container">
    <u-icon v-if="showIcon" class="icon" name="search" color="#CDCDCD" size="40" />
    <input 
        @blur="onBlur"
        @focus="onFocus"
        @input="onInput"
        :style="{paddingLeft:paddingLeft+'px',borderRadius:borderRadius+'px',boxShadow,backgroundColor:bkColor,color:fontColor}" placeholder="请输入内容" 
        v-model="text"
        @confirm="()=>{
            commmit && commmit(text)
        }" confirm-type="search"
    />
</div>
</template>

<style lang='less' scoped>
.input-container {
    padding-left: 0px;
    height: 33px;
    position: relative;
    line-height: 33px;
    display: flex;
    .icon {
        padding-left: 5px;
        position: absolute;
        font-size: 14px;
        line-height: 30px;
        top: 50%;
        transform: translateY(-50%);
    }

    input {
        width: calc( 100% - 30px );
        height: 33px;
        background-color: #FFFFFF;
        border-radius: 5px;
        font-size: 13px;
        padding-left: 30px;
        //box-shadow: 0px 0px 10px #CDCDCD;
    }
}
</style>