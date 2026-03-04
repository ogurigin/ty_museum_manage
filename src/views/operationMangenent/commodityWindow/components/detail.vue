<template>
	<div class="myDialogClass">
    <el-dialog title="橱窗详情" v-model="editVisible" width="25%">
			<el-form  ref="ruleFormRef"
    			:model="ruleForm"
    			:rules="rules"
				label-width="120px">
                <el-form-item label="橱窗名称" prop="name">
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>
				<el-form-item label="橱窗内容上限" prop="upper">
					<el-input v-model="ruleForm.upper"></el-input>
				</el-form-item>
				<el-form-item label="橱窗顺序" prop="sort">
					<el-input v-model="ruleForm.sort"></el-input>
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
import {ref,reactive,defineEmits,defineExpose} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
const {proxy} = getCurrentInstance() as any;
const editVisible = ref<boolean>(false)
interface RuleForm {name: string,upper:string,sort:string}
const ruleFormRef = ref<FormInstance>()
const ruleForm =  reactive<RuleForm>({
	name: 'Hello',
	upper:'',
	sort:''
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
}) as  any;
const detailId = ref() as any;
const emit = defineEmits<{
    (event:'updated'): void
}>()
const getShowCaseInfo = (id:number) => {
	proxy.API.getShowCaseInfo({id:id}).then((res:any) =>{
		if(res.data.success){
			ruleForm.name = res.data.result.name
			ruleForm.upper = res.data.result.upper
			ruleForm.sort = res.data.result.sort
		}
	})
}
const updateInfo = () => {
	proxy.API.postShowCaseInfo({
		id:detailId.value,
		name:ruleForm.name,
		sort:ruleForm.sort,
		upper:ruleForm.upper,
		status: '1',
	}).then((res:any) => {
		if(res.data.success){
			ElMessage.success('修改成功')
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
			updateInfo()
		} else {
			console.log('error submit!', fields)
		}
  })
}
const open = (id:number) => {
	editVisible.value = true
	detailId.value = id
	getShowCaseInfo(id)
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