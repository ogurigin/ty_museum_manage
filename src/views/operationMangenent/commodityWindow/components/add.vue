<template>
	<div class="myDialogClass">
    <el-dialog title="添加橱窗" v-model="editVisible" width="25%">
			<el-form  ref="ruleFormRef"
    			:model="ruleForm"
    			:rules="rules"
				label-width="120px">
				<el-form-item label="橱窗名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入橱窗名称"></el-input>
				</el-form-item>
				<el-form-item label="橱窗内容上限" prop="upper">
					<el-input v-model="ruleForm.upper" placeholder="请输入内容上限"></el-input>
				</el-form-item>
				<el-form-item label="橱窗顺序" prop="sort">
					<el-input v-model="ruleForm.sort" placeholder="请输入橱窗顺序"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit(ruleFormRef)">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang='ts'>
import {ref,reactive,defineExpose,defineEmits} from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
const {proxy} = getCurrentInstance() as any;
const editVisible = ref<boolean>(false);
interface RuleForm {
	name: string,
	sort:string,
	upper:string
}
const ruleFormRef = ref<FormInstance>()
const ruleForm =  reactive<RuleForm>({
	name: '',
	upper:'',
	sort:'',
})
const rules = reactive({
  name: [
    { required: true, message: '请输入橱窗名称', trigger: 'blur' },
  ],
  upper: [
    { required: true, message: '请输入内容上限', trigger: 'blur' },
  ],
  sort: [
    { required: true, message: '请输入橱窗顺序', trigger: 'blur' },
  ],
}) as any;
const open = () => {
	editVisible.value = true
}
const emit = defineEmits<{
    (event:'updated'): void
}>()
const postShowCaseInfo = () => {
	proxy.API.postShowCaseInfo({
		name:ruleForm.name,
		sort:ruleForm.sort,
		upper:ruleForm.upper,
		status: '1',
	}).then((res:any) => {
		if(res.data.success){
			ElMessage.success('新增成功')
			editVisible.value = false
			emit('updated')
		}else{
			ElMessage.warning(res.data.errors[0].message)
		}
	})
}
const saveEdit = async (formEl: FormInstance | undefined)=> {
	if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (valid) {
			postShowCaseInfo()
		} else {
			console.log('error submit!', fields)
		}
  })
}
defineExpose({
	open
})
</script>
<style lang='less' scoped>
.myDialogClass{
    :deep .el-dialog {
        border-radius: 10px; 
        .el-dialog__header {
            border-bottom: 1px solid #eee;
        }
    }
    
}
</style>