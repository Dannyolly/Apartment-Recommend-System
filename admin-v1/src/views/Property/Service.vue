<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, ElNotification } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight} from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { UserInfo } from "@/types/serviceEntity/user";
import { ServiceManager } from "@/service";
import { FilterOption, Room , FilterOptionPlus } from "@/types/serviceEntity/Room";
import { filter } from "lodash";
import { parseMinWidth } from "element-plus/es/components/table/src/util";
import { Service, ServiceTypeMap,ServiceType } from "@/types/serviceEntity/Service";

defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增 ---------------------------------------------------------
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  title:undefined,
  subtitle:undefined,
  specification:undefined,
  price:undefined,
  tags:undefined,
  type:undefined
})
const options = [
  {
    value: 1,
    label: '居家清洁',
  },
  {
    value: 2,
    label: '清洗维修',
  },
  {
    value: 3,
    label: '清洗维修',
  }
]
const getParamsByFormData = ()=>{
  let params:Partial<Service> = {}
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
    const { data } =  await ServiceManager.ClientService.update(params)
    if(data){
      ElMessage.success("更新成功")
      getTableData()
    }else{
      ElMessage.warning("更新失败")
    }
    dialogVisible.value =  false
    
  }else{
    // create
    const { data } = await ServiceManager.ClientService.add({
      ...formData,
      // @ts-ignore
      type:formData.type[0]
    })
    if(data){
      ElMessage.success("增加成功")
      ElNotification({
        title: '增加成功',
        message: '刚上传的id是:'+data.id,
        type: 'success',
      })
      //@ts-ignore
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
const handleDelete = async (row:Service) => {
  const { value } = await ElMessageBox.confirm(`正在删除公寓：${row.id}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
  console.log(row.id);
  
  const { data } =  await ServiceManager.ClientService.deleteById(row.id)
  if(data){
    ElMessage.success("删除成功")
    getTableData()
    paginationData.total--;
  }
}
//#endregion

//#region 改 ---------------------------------------------------------
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row:Service) => {
  currentUpdateId.value = String(row.id)
  dialogVisible.value = true
  //@ts-ignore
  formData.title = row.title;
  //@ts-ignore
  formData.subtitle = row.subtitle
  //@ts-ignore
  formData.specification = row.specification
  //@ts-ignore
  formData.price = row.price
  //@ts-ignore
  formData.tags = row.tags
}
//#endregion

//#region 查 ----------------------------------------------------------
const tableData = ref<Service[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  id:undefined
})
const getTableData =async () => {
  let id = searchData.id
  let dataTemp:Service[] = []
  if(id){
    let { data } = await ServiceManager.ClientService.selectById(id)
    // @ts-ignore
    data.type = ServiceTypeMap[Number(data.type)]
    dataTemp = [data]
  }else{
    const { data } = await ServiceManager.ClientService.select({
      page:paginationData.currentPage,
      pageSize:paginationData.pageSize
    })
    data.forEach(v=>{
      // @ts-ignore
      v.type = ServiceTypeMap[Number(v.type)]
    })
    dataTemp = data
  }
  tableData.value = dataTemp
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
  if(searchData.id){
    paginationData.total = 1
    return
  }
  const { data } = await ServiceManager.ClientService.select({
    page:0,
    pageSize:1000
  })
  paginationData.total = data.length
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
        <el-form-item prop="id" label="服务id">
          <el-input v-model="searchData.id" placeholder="服务id" />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增服务</el-button>
          
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
          <el-table-column prop="id" width="50" label="服务id" align="center" />
          <el-table-column prop="title" label="标题" align="center" />
          <el-table-column prop="subtitle" label="次标题" align="center" />
          <el-table-column prop="sales" width="50" label="销量" align="center" />
          <el-table-column prop="specification" label="服务详情" align="center" />    
          <el-table-column prop="price" label="价格" align="center" />
          <el-table-column prop="tags" label="标签" align="center" />
          <el-table-column prop="type" label="类型" align="center" />
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
        <el-form-item prop="title" label="标题">
          <el-input v-model="formData.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="subtitle" label="次标题" >
          <el-input v-model="formData.subtitle" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="specification" label="详情" >
          <el-input v-model="formData.specification" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="price" label="价格" >
          <el-input v-model="formData.price" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="tags" label="标签" >
          <el-input v-model="formData.tags" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="type" v-if="currentUpdateId===undefined" label="类型" >
          <el-cascader
            v-model="formData.type"
            :options="options"
          />
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
