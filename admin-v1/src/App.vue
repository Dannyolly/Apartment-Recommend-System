<script lang="ts" setup>
import { h, onMounted } from "vue"
import { useTheme } from "@/hooks/useTheme"
import { ElNotification } from "element-plus"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import { ServiceManager } from "./service";

const { initTheme } = useTheme()
onMounted(async ()=>{
  // let res = []
  // for (let i = 0; i < 1000; i++) {
  //   let promise = ServiceManager.PostService.select({
  //     page:1,
  //     pageSize:10
  //   })
  //   res.push(promise)
  // }
  // Promise.allSettled(res).then(res=>{
  //   console.log('done');
    
  // })
})
/** 初始化主题 */
initTheme()
/** 将 Element Plus 的语言设置为中文 */
const locale = zhCn

</script>

<template>
  <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>
