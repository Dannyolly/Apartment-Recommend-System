<script lang='ts'>
import { toRefs, ref, watchEffect, onMounted, nextTick} from 'vue';
import {useState} from '@/hooks/useState';
import { measureElHeight } from '@/utils/Measure';
interface NavigationBarProps {
    city?:string,
    opacity:number,
    measuringCb:(height:number)=>void,
    backgroundColor?:string
}
export default{
    data(){
        return{
            text:'',
        }
    },
    props:{
        opacity:{
            required:true,
            type:Number
        },
        measuringCb:{
            required:true,
            type:Function
        },
        backgroundColor:{
            type:String
        }
    },
    mounted(){
        this.$nextTick(async ()=>{
            const height = await measureElHeight('.navigation-bar-container',this)
            this.measuringCb(height)
        })
    },
}
</script>
<template>
<div >
   <div :style="{paddingTop:'44px',
   backgroundColor:backgroundColor?backgroundColor:`rgba(255,255,255,${opacity})`}" class="navigation-bar-container">
    
        <slot></slot>
  </div> 
</div>
  
</template>

<style lang='less' scoped>

.navigation-bar-container{
    height: 40px;
    display: flex;
    position: fixed;
    align-items: center;
    z-index: @navigation-bar-z-index;
    padding: 20px;
    padding-bottom: 3px;
    padding-top: px;
    padding-left: 15px;
    width: 100%;
    background-color: #FFFFFF;
    
}
</style>