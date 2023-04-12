<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, ElNotification } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Service } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { UserInfo } from "@/types/serviceEntity/user";
import { ServiceManager } from "@/service";
import { FilterOption, Room , FilterOptionPlus } from "@/types/serviceEntity/Room";
import { filter } from "lodash";
import { parseMinWidth } from "element-plus/es/components/table/src/util";
import { Post ,PostOption, PostType} from "@/types/serviceEntity/post";
import { getFullTime } from "@/utils/Date";

defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增 ---------------------------------------------------------
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  city:undefined,
  district:undefined,
  road:undefined,
  community:undefined,
  price:undefined,
  areasize:undefined,
  roomtype:undefined,
  ori:undefined,
  floorinfo:undefined
})
const getParamsByFormData = ()=>{
  let params:Partial<Room> = {}
  for (const key in formData) {
    // @ts-ignore
    const el = formData[key];
    
    if(el){
      // @ts-ignore
      params[key] = el
    }
  }
  return params
}
const handleCreateOrUpdate = async () => {
  
  if(currentUpdateId.value){
    let params = getParamsByFormData()
    params.id = Number(currentUpdateId.value)
    const { data } =  await ServiceManager.RoomService.update(params)
    if(data){
      ElMessage.success("更新成功")
      getTableData()
    }else{
      ElMessage.warning("更新失败")
    }
    dialogVisible.value =  false
    
  }else{
    // create
    // @ts-ignore
    const { data } = await ServiceManager.RoomService.add({...formData})
    if(data){
      ElMessage.success("增加成功")
      ElNotification({
        title: '增加成功',
        message: '刚上传的id是:'+data.id,
        type: 'success',
      })
      searchData.id = data.id
      dialogVisible.value =  false
    }
  }
  
}
const resetForm = () => {
    for (const key in formData) {
      //@ts-ignore
      formData[key] = undefined;
    }
    setTimeout(()=>{
      currentUpdateId.value = undefined
    },100)
}
//#endregion ---------------------------------------------------------

//#region 删 ---------------------------------------------------------
const handleDelete = async (row:Post) => {
  const { value } = await ElMessageBox.confirm(`正在删除公寓：${row.id}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
  const { data } =  await ServiceManager.RoomService.deleteById(row.id)
  if(data){
    ElMessage.success("删除成功")
    getTableData()
    paginationData.total--;
  }
}
//#endregion

//#region 改 ---------------------------------------------------------
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row:Post) => {
  currentUpdateId.value = String(row.id)
  dialogVisible.value = true
}
//#endregion

//#region 查 ----------------------------------------------------------
const options = [
  {
    value: 1,
    label: '帖子',
    disabled: false,
  },
  {
    value: 2,
    label: '问答',
    disabled: false,
  }
]
const tableData = ref<Post[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive<PostOption>({})
const getParamsBySearchData = ()=>{
  let params:PostOption = {}
  for (const key in searchData) {
    // @ts-ignore
    const el = searchData[key];
    
    if(el !== undefined){
      // @ts-ignore
      params[key] = el
    }
  }
  return params
}
const getTableData =async () => {
  let params = getParamsBySearchData()
  if(params.type){
    //@ts-ignore
    params.type = params.type[0]
  }
  const { data } = await ServiceManager.PostService.select({
      ...params,
      page:paginationData.currentPage,
      pageSize:paginationData.pageSize
  })
  data.forEach(v=>{
    v.date = getFullTime(new Date(v.date || ''))
    //@ts-ignore
    v.type = Number(v.type) === 1 ? '帖子' : '问答'
  })
  tableData.value = data
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
    getItemCount()
  }
  paginationData.currentPage = 1
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  paginationData.currentPage = 1
  getTableData()
  getItemCount()
}

const handleRefresh = () => {
  getTableData()
}
const getItemCount = async () =>{
  let params = getParamsBySearchData()
  if(params.type){
    //@ts-ignore
    params.type = params.type[0]
  }
  const { data } = await ServiceManager.PostService.count({
    ...params,
    page:0,
    pageSize:100000
  })
  paginationData.total = data
}

onMounted(()=>{
  getItemCount()
})
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="id" label="postid">
          <el-input v-model="searchData.id" placeholder="postid" />
        </el-form-item>
        <el-form-item label-width="40" prop="userId" label="userId">
          <el-input v-model="searchData.userId" placeholder="用户id" />
        </el-form-item>
        <el-form-item label-width="40" prop="type" label="类型">
          <el-cascader
            
            v-model="searchData.type"
            :options="options"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="postId" align="center" />
          <el-table-column prop="userId" label="userId" align="center" />
          <el-table-column prop="title" label="标题" align="center" />
          <el-table-column prop="desc" label="帖子内容" align="center" />
          <el-table-column prop="like" label="like" align="center" />
          <el-table-column prop="date"  width="150" label="发布日期" align="center" />
          <el-table-column prop="type" label="类型" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
