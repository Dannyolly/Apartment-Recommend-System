<script setup lang="ts">
import { onLaunch, onShow, onHide, onUnload, onInit } from "@dcloudio/uni-app";
import { getLocation, loadCity } from '@/utils/location'
import { login , getUserInfo } from '@/api/login'
import { PostSerivce } from "./service/PostService";
import { ServiceManager } from '@/service'
import { useHouseAppointmentStore } from "./store/HouseAppointment";
import { RecommendRecordHandler } from "./utils/RecommendRecordHandler";
onLaunch(async () => {
  /**
   * changes something
   */
  // let promiseArr = []
  // for (let i = 0; i < 1000; i++) {
  //   promiseArr.push(ServiceManager.RoomService.getRecommendRooms(1,1,1))
  // }
})



onShow(() => {
  console.log("App Show");
  
});
onHide(() => {
  console.log("App Hide");

});


</script>
<template>
 
</template>
<style lang="scss">
@import "uview-plus/index.scss";
@import "./app.less";
body{
  font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;;
}
</style>
