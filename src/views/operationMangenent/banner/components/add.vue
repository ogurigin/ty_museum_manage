<template>
	<div class="myDialogClass">
    	<el-dialog title="添加" v-model="editVisible" width="30%">
			<el-form  ref="ruleFormRef"
    			:model="ruleForm"
    			:rules="rules"
				label-width="90px">
				<el-form-item label="名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="跳转链接" prop="link">
					<el-input v-model="ruleForm.link" placeholder="请输入跳转链接"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input v-model="ruleForm.sort" placeholder="请输入排序"></el-input>
				</el-form-item>
				<el-form-item label="位置" prop="location">
					<el-select v-model="ruleForm.location" value-key="location" placeholder="请选择橱窗位置"  style="width:100%">
						<el-option label="首页Banner" value="1"></el-option>
						<el-option label="首页腰封banner" value="2"></el-option>
						<el-option label="我的页面banner" value="3"></el-option>
						<el-option label="场馆资讯" value="4"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="可见用户" prop="visibility">
					<el-select v-model="ruleForm.visibility" value-key="visibility" placeholder="请选择用户类型" style="width:100%">
						<el-option label="不限" value="1"></el-option>
						<el-option label="登录用户" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item required label="封面">
					<upload-img ref="uploadf"></upload-img>
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
import uploadImg from "../../../../components/upload1.vue";
const {proxy} = getCurrentInstance() as any;
const editVisible = ref<boolean>(false)
interface RuleForm {
	name: string,
	link:string,
	sort:string,
	location:string,
	visibility:string,
	pic:string
}
const uploadf = ref() as any;
const ruleFormRef = ref<FormInstance>()
const ruleForm =  reactive<RuleForm>({
	name: '',
	link:'',
	sort:'',
	location:"",
	visibility:'',
	pic:''
})
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
});
const postBannerList = () => {
	proxy.API.postBannerList({
		name:ruleForm.name,
		link:ruleForm.link,
		sort:ruleForm.sort,
		location:parseInt(ruleForm.location),
		pic:ruleForm.pic,
		visibility:1,
	}).then((res:any) => {
		if(res.data.success){
			ElMessage.success('新增成功！')
			editVisible.value = false
			emit('updated')
		}
	})
}

const saveEdit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await Promise.all([
		uploadf.value.uploadImg()
	]).then((res:any) => {
		if(res != 'err'){
			ruleForm.pic = res.toString()
		}else{
			ElMessage.warning('请上传封面图！')
		}
		
	})
	await formEl.validate((valid, fields) => {
		if (valid) {
			postBannerList()			
		} else {
			console.log('error submit!', fields)
		}
	})
  	
}
const open = () => {
	editVisible.value = true
}
const emit = defineEmits<{
    (event:'updated'): void
}>()
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