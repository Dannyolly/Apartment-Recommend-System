<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { getDimension } from '@/utils/Equipment';
import { onLoad , onPageScroll} from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useTabbarStore } from '@/store/Tabbar';
import Home from '../Tenantpages/Home.vue';
import OwnerHome from '../ownerpages/Home.vue'
import { LocalStorageManager } from '@/utils/localStorage';
import { useHouseAppointmentStore } from '@/store/HouseAppointment';
import Login from '@/pages/login.vue'
import { getUserInfo ,login } from '@/api/login';
import { UserInfo } from '@/types/serviceEntity/user';
import { ServiceManager } from '@/service';
import { usePubSub } from '@/hooks/usePubSub';
const height = getDimension().height +'px' 
const { isLogin,isCheck ,isNewUser} = useState({
    isLogin:true,
    isCheck:false,
    isNewUser:false
})
const pubsub = usePubSub()
const { isTenant } = storeToRefs(useTabbarStore())
const { setup } = useHouseAppointmentStore()
onMounted(()=>{
    
})
const loginAction = async ()=>{
    const openId = await login()
    const res = await ServiceManager.UserService.login(openId)
    let userInfo:UserInfo | undefined = undefined
    if(res.state ===  'ERROR'){
        // 未注冊 --- 新用戶
        const registerInfo = await ServiceManager.UserService.register(openId);
        userInfo = registerInfo.result
        LocalStorageManager.setLocalStorageInfo('userInfo',{userInfo:userInfo})
        uni.navigateTo({
            url:'/pages/preference'
        })
        
        
    }else{
        userInfo = res.result;
        LocalStorageManager.setLocalStorageInfo('userInfo',{userInfo:userInfo})
        isLogin.value = true
        setup()
    }
    
}
onLoad(async (query)=>{
    const usrInfo = LocalStorageManager.getLocalStorageInfo('userInfo')
    if(!usrInfo){
        // loginAction()
        isLogin.value = false
    }else{
        const openId = usrInfo.openId     
        const res = await ServiceManager.UserService.login(openId)
        const userInfo = res.result;
        LocalStorageManager.setLocalStorageInfo('userInfo',{userInfo:userInfo})
        setup()
    }
    isCheck.value = true

    // 新注冊用戶流程 填偏好
    pubsub.subscribe('perference',()=>{
        isLogin.value = true
        //setup()
    })
})
onPageScroll(()=>{})
</script>
<template >
    <div v-if="isCheck" >
        <div v-if="isLogin">
            <Home v-if="isTenant" />
            <OwnerHome v-else />
        </div>
        <div v-else >
            <Login :login="loginAction"/>
        </div>
    </div>
    
</template>

<style lang='less' scoped>
.container{

}
</style>