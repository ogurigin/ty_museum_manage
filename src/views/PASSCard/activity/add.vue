<template>
  <div class="container">
    <div class="form-box" style="width: 680px;">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属场馆" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" placeholder="请选择场馆" @change="handleVenueChange" filterable>
            <el-option
              v-for="item in creatorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称" />
        </el-form-item>

        <el-form-item label="活动时间" prop="timeRange">
          <el-date-picker
            v-model="form.timeRange"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="满减金额" >
          <div class="flex-row">
            <span>满</span>
            <el-input-number v-model="form.promotionPrice" :min="0" :precision="0" :controls="false" class="money-input" placeholder="请输入整数" />
            <span>减</span>
            <el-input-number v-model="form.discountPrice" :min="0" :precision="0" :controls="false" class="money-input" placeholder="请输入整数" />
          </div>
        </el-form-item>

        <el-form-item label="活动任务">
          <el-transfer
            v-model="form.taskIds"
            :data="transferData"
            :titles="['待选择', '已选择']"
            filterable
            filter-placeholder="请输入搜索内容"
          />
        </el-form-item>

        <el-form-item label="活动状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="开启" :value="1" />
            <el-option label="关闭" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance() as any
const emit = defineEmits(['open', 'refresh'])

const formRef = ref()
const creatorList = ref<any[]>([])
const transferData = ref<any[]>([])

const form = reactive({
  id: '',
  enterpriseId: undefined as number | undefined,
  name: '',
  timeRange: [] as any,
  promotionPrice: undefined as number | undefined,
  discountPrice: undefined as number | undefined,
  taskIds: [] as string[],
  status: 1
})

const rules = {
  enterpriseId: [{ required: true, message: '请选择场馆', trigger: 'change' }],
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  timeRange: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  status: [{ required: true, message: '请选择活动状态', trigger: 'change' }],

}

// Get Venues (Creators)
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

// Get Tasks (Cards) for the selected venue
const getTasks = async (venueId: string | number) => {
  if (!venueId) {
    transferData.value = []
    return
  }
  try {
    const res = await proxy.API.getPromotionCardList({
      enterpriseId: venueId
    })
    if (res.data.success) {
      // API returns a list, map it to transfer data format
      transferData.value = (res.data.result || []).map((item: any) => ({
        key: String(item.id),
        label: item.name,
        disabled: false
      }))
    } else {
      transferData.value = []
    }
  } catch (error) {
    console.error(error)
    transferData.value = []
  }
}

const handleVenueChange = (val: string | number) => {
  form.taskIds = [] // Clear selection when venue changes
  getTasks(val)
}

const onSubmit = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (!form.promotionPrice || !form.discountPrice) {
        ElMessage.warning('请输入满减金额')
        return
      }

      const params = {
        id: form.id,
        enterpriseId: form.enterpriseId,
        name: form.name,
        startTime: form.timeRange[0],
        endTime: form.timeRange[1],
        promotionPrice: form.promotionPrice,
        discountPrice: form.discountPrice,
        status: form.status,
        passcardIds: form.taskIds.join(',')
      }

      try {
        let res
        if (form.id) {
          res = await proxy.API.updatePassActivity(params)
        } else {
          // Remove id for insert if it's empty
          const { id, ...insertParams } = params
          res = await proxy.API.insertPassActivity(insertParams)
        }

        if (res.data.success) {
          ElMessage.success('操作成功')
          emit('refresh')
          emit('open')
        } else {
          ElMessage.error(res.data.message || '操作失败')
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('操作失败')
      }
    }
  })
}

const init = async (id?: string,) => {
  const data = { id }
  await getCreatorAll()
  if (id) {
    form.id = id
    // Fetch detail to get full data including passcardIds
    try {
      const res = await proxy.API.getPassActivityDetail({ id: data.id })
      if (res.data.success) {
        const detail = res.data.result
        form.enterpriseId = detail.enterpriseId
        form.name = detail.name
        form.timeRange = [detail.startTime, detail.endTime]
        form.promotionPrice = detail.promotionPrice
        form.discountPrice = detail.discountPrice
        form.status = detail.status
        
        // Load tasks for this venue
        await getTasks(detail.enterpriseId)
        // Set selected tasks
        if (detail.passcardIds) {
          form.taskIds = detail.passcardIds
            .split(',')
            .map((id: string) => id.trim())
            .filter((id: string) => !!id)
        } else {
          form.taskIds = []
        }
        console.log(form.taskIds)
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    // Reset form
    form.id = ''
    form.enterpriseId = undefined
    form.name = ''
    form.timeRange = []
    form.promotionPrice = undefined
    form.discountPrice = undefined
    form.status = 1
    form.taskIds = []
    transferData.value = []
    
    // Clear validation
    setTimeout(() => {
      formRef.value?.clearValidate()
    }, 0)
  }
}

const onCancel = () => {
  emit('open')
}

defineExpose({
  init
})
</script>

<style scoped>
.form-box {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}
.money-input {
  width: 220px;
  margin: 0 10px;
}
.flex-row {
  display: flex;
  align-items: center;
}
</style>
