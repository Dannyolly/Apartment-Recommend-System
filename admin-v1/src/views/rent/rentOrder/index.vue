<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { UserInfo } from "@/types/serviceEntity/user";
import { ServiceManager } from "@/service";
import { RentInfo, RentOrderInfo, RentState, RentStateMap } from "@/types/serviceEntity/Room";
import { getFullTime } from '@/utils/Date'
import { cloneDeep } from "lodash";
import { da } from "element-plus/es/locale";
defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  state:''
})
const rowData = ref<RentInfo>()
const options = [
  {
    value: '3',
    label: '已入住',
    disabled: false,
  },
  {
    value: '4',
    label: '已完成',
    disabled: false,
  }
]
const handleSubmit =async () => {
  let state = formData.state[0]
  // @ts-ignore
  rowData.value.state = state
  // @ts-ignore
  const { data } = await ServiceManager.RentInfoSerivce.update({
    id:Number(rowData.value?.id),
    state:state
  })
  if(data){
    await getTableData()
    ElMessage.success("更新订单状态成功")
    dialogVisible.value = false
  }
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.state = ""
}
//#endregion

//#region 删
const handleDelete = async (row:UserInfo) => {
  console.log(row.name);
  const { value } = await ElMessageBox.confirm(`正在删除订单ID：${row.id}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
  const { data } =  await ServiceManager.RentInfoSerivce.deleteById(row.id)
  if(data){
    ElMessage.success("删除成功")
    getTableData()
    paginationData.total--;
  }
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row:RentInfo) => {
  console.log(row);
  rowData.value = cloneDeep(row)
  currentUpdateId.value = '  '
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<RentInfo[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  id:"",
  userId:""
})
const getTableData =async () => {
  if(searchData.id){
    const { data } = await ServiceManager.RentInfoSerivce.getRentInfoById(Number(searchData.id))
    if(data){
      tableData.value = [data]
      paginationData.total = 1
    }else{
      tableData.value = []
    }
  }else if(searchData.userId){
    getItemCount()
    let { data } = await ServiceManager.RentInfoSerivce.getRentInfoByUserId({
      id:Number(searchData.userId),
      page:paginationData.currentPage,
      pageSize:paginationData.pageSize
    })
    // @ts-ignore
    data = data.result
    data.forEach(v=>{
      v.checkinTime = getFullTime(new Date(v.checkinTime || ''))
      v.createTime = getFullTime(new Date(v.createTime || ''))
      // @ts-ignore
      v.state = RentStateMap[v.state].title
    })
    tableData.value = data
  }else{
    const { data } = await ServiceManager.RentInfoSerivce.getRentInfo({
      page:paginationData.currentPage,
      pageSize:paginationData.pageSize
    })
    data.forEach(v=>{
      v.checkinTime = getFullTime(new Date(v.checkinTime || ''))
      v.createTime = getFullTime(new Date(v.createTime || ''))
      // @ts-ignore
      v.state = RentStateMap[v.state].title
    })
    tableData.value = data
  }
  
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
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
  if(searchData.userId){
    let { data } = await ServiceManager.RentInfoSerivce.getRentInfoByUserId({
      id:Number(searchData.userId),
      page:0,
      pageSize:10000
    })
    //@ts-ignore
    data = data.result
    paginationData.total = data.length
    return
  }
  const { data } = await ServiceManager.RentInfoSerivce.count()
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
        <el-form-item prop="id" label="订单id">
          <el-input v-model="searchData.id" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="userId" label="用户id">
          <el-input v-model="searchData.userId" placeholder="请输入" />
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
          <!-- <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button> -->
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
          <el-table-column prop="id" label="订单id" align="center" />
          <el-table-column prop="userId" label="用户id" align="center" />
          <el-table-column prop="admin" label="管家" align="center" />
          <el-table-column prop="checkinTime" label="入住时间" align="center" />
          <!-- <el-table-column prop="createTime" label="订单创建时间" align="center" /> -->
          <el-table-column prop="houseId" label="公寓id" align="center" />
          <el-table-column prop="payment" label="总额" align="center" />
          <el-table-column prop="serviceIds" label="额外服务Ids"  align="center"/>
          <el-table-column prop="tenancy" label="租期"  align="center"/>
          <el-table-column prop="state" label="订单状态"  align="center"/>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改订单状态</el-button>
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
      :title="currentUpdateId === undefined ? '新增用户' : '修改订单状态'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData"  label-width="100px" label-position="left">
        <el-form-item prop="state" label="用户名">
          <el-cascader
            v-model="formData.state"
            :options="options"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
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
