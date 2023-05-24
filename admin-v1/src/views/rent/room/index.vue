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
const handleDelete = async (row:Room) => {
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
const handleUpdate = (row:Room) => {
  currentUpdateId.value = String(row.id)
  //@ts-ignore
  formData.city =  row.city
  //@ts-ignore
  formData.district = row.district
  //@ts-ignore
  formData.road = row.road
  //@ts-ignore
  formData.price = row.price
  //@ts-ignore
  formData.areasize = row.areasize
  //@ts-ignore
  formData.roomtype = row.roomtype
  //@ts-ignore
  formData.ori  =row.ori
  //@ts-ignore
  formData.community = row.community
  //@ts-ignore
  formData.floorinfo = row.floorinfo
  dialogVisible.value = true
}
//#endregion

//#region 查 ----------------------------------------------------------
const tableData = ref<Room[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive<FilterOptionPlus>({})
const getParamsBySearchData = ()=>{
  let params:FilterOptionPlus = {}
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
  if(Object.values(params).length!==0){
    const { data } = await ServiceManager.RoomService.select({
      ...params,
      page:paginationData.currentPage,
      pageSize:paginationData.pageSize
    })
    tableData.value = data
    
  }else{
    const { data } = await ServiceManager.RoomService.select({
      page:paginationData.currentPage,
      pageSize:paginationData.pageSize
    })
    tableData.value = data
  }
  
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
  if(Object.values(params).length!==0){
    const { data } = await ServiceManager.RoomService.select({
      ...params,
      page:0,
      pageSize:100000
    })
    paginationData.total = data.length
    return
  }
  const { data } = await ServiceManager.RoomService.count()
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
        <el-form-item prop="id" label="公寓id">
          <el-input v-model="searchData.id" placeholder="公寓id" />
        </el-form-item>
        <el-form-item prop="community" label="社区">
          <el-input v-model="searchData.community" placeholder="社区" />
        </el-form-item>
        <el-form-item prop="road" label="道路">
          <el-input v-model="searchData.road" placeholder="道路" />
        </el-form-item>
        <el-form-item prop="floorInfo" label="楼层">
          <el-input v-model="searchData.floorInfo" placeholder="楼层" />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增公寓</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
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
          <el-table-column prop="id" label="公寓id" align="center" />
          <el-table-column prop="city" label="城市" align="center" />
          <el-table-column prop="district" label="区" align="center" />
          <el-table-column prop="road" label="道路" align="center" />
          <el-table-column prop="community" label="社区" align="center" />
          <el-table-column prop="price" label="价格" align="center" />
          <el-table-column prop="areasize" label="面积" align="center" />
          <el-table-column prop="roomtype" label="公寓" align="center" />
          <el-table-column prop="ori" label="朝向" align="center" />
          <el-table-column prop="floorinfo" label="楼层" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
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
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增公寓' : '修改公寓'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData"  label-width="100px" label-position="left">
        <el-form-item prop="city" label="城市">
          <el-input v-model="formData.city" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="district" label="区" >
          <el-input v-model="formData.district" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="road" label="道路" >
          <el-input v-model="formData.road" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="community" label="社区" >
          <el-input v-model="formData.community" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="price" label="价格" >
          <el-input v-model="formData.price" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="areasize" label="面积" >
          <el-input v-model="formData.areasize" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="roomtype" label="面积" >
          <el-input v-model="formData.roomtype" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="floorinfo" label="楼层" >
          <el-input v-model="formData.floorinfo" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate">提交</el-button>
      </template>
    </el-dialog>
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
