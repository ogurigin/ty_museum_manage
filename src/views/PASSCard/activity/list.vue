<template>
  <div>
    <div class="container" v-if="show">
      <div class="handle-box">
        <el-form :inline="true" :model="query" class="demo-form-inline">
          <el-form-item label="所属场馆">
            <el-select v-model="query.enterpriseId" placeholder="全部" clearable filterable>
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="v in creatorList"
                :key="v.id"
                :label="v.name"
                :value="v.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称">
            <el-input v-model="query.name" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker
              v-model="query.time"
              type="date"
              placeholder="请选择"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" :icon="Plus" @click="handleCreate">新建优惠活动</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="enterpriseName" label="所属场馆" min-width="140"/>
        <el-table-column prop="name" label="活动名称" min-width="140"/>
        <el-table-column prop="timeRange" label="活动时间" min-width="220"/>
        <el-table-column prop="rule" label="满减金额" min-width="140"/>
        <el-table-column prop="statusStr" label="活动状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">{{ scope.row.statusStr }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="verifyCount" label="核销人数" min-width="100"/>
        <el-table-column prop="createTime" label="创建时间" min-width="160">
          <template #default="scope">
						{{ moment(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
					</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" icon="Delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          :total="totalItems"
          @current-change="handlePageChange"
        />
      </div>
    </div>
    <Add ref="addV" @open="updated" v-if="!show"></Add>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import Add from './add.vue'
import moment from "moment";

const { proxy } = getCurrentInstance() as any

interface ActivityRow {
  id: number
  enterpriseName: string
  name: string
  startTime: string
  endTime: string
  rule: string
  statusStr: string
  verifyCount: number
  createTime: string
  timeRange?: string
}

const query = reactive({
  enterpriseId: '',
  name: '',
  time: '',
  pageNum: 1,
  pageSize: 10
})
const totalItems = ref(0)
const tableData = ref<ActivityRow[]>([])
const creatorList = ref<any[]>([])
const show = ref(true)
const addV = ref()

const getCreatorAll = async () => {
  try {
    const res = await proxy.API.getPromotionCreatorList()
    if (res.data.success) {
      creatorList.value = res.data.result
    }
  } catch (error) {
    console.error(error)
  }
}

const statusColor = (s: string) => {
  if (s === '进行中') return '#13ce66'
  if (s === '未开始') return '#f0ad4e'
  if (s === '已结束') return '#909399'
  if (s === '已关闭') return '#f56c6c'
  return '#606266'
}

const formatRange = (r: ActivityRow) => {
  if (r.startTime && r.endTime) {
    r.timeRange = `${r.startTime} - ${r.endTime}`
  } else {
    r.timeRange = ''
  }
  // 核销人数暂时全部写0
  r.verifyCount = 0
  return r
}

const getData = async () => {
  try {
    const res = await proxy.API.getPassActivityList({
      pageNum: query.pageNum,
      pageSize: query.pageSize,
      name: query.name,
      promotionDate: query.time??'',
      enterpriseId: query.enterpriseId
    })
    if (res.data.success) {
      const { result, total } = res.data.result
      tableData.value = (result || []).map((item: any) => ({
        ...item,
        statusStr: item.statusStr,
        timeRange: `${item.startTime} ~ ${item.endTime}`,
        rule: `满${item.promotionPrice}减${item.discountPrice}`,
        verifyCount: 0 
      }))
      totalItems.value = total
    }
  } catch (error) {
    console.error(error)
  }
}

const handleSearch = () => {
  query.pageNum = 1
  getData()
}
const handlePageChange = (val: number) => {
  query.pageNum = val
  getData()
}

const handleSizeChange = (val: number) => {
  query.pageSize = val
  getData()
}
const handleCreate = async () => {
  show.value = false
  await nextTick()
  addV.value?.init()
}
const handleEdit = async (row: ActivityRow) => {
  show.value = false
  await nextTick()
  
  addV.value?.init(row.id)
}
const updated = () => {
  show.value = true
  getData()
}
const handleDelete = (row: ActivityRow) => {
  ElMessageBox.confirm('确认删除该活动？', '提示', { type: 'warning' })
    .then(async () => {
      // 暂时先不要,删除了会影响到历史数据展示
      // ElMessage.warning('暂不支持删除')
      try {
        const res = await proxy.API.deletePassActivity({ id: row.id })
        if (res.data.success) {
          ElMessage.success('已删除')
          getData()
        } else {
          ElMessage.error(res.data.message || '删除失败')
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

onMounted(() => {
  getCreatorAll()
  getData()
})
</script>

<style scoped>
.handle-box { margin-bottom: 20px; }
.table { width: 100%; font-size: 14px; }
.red { color: #F56C6C; }
.green { color: rgba(22,155,213); }
</style>

