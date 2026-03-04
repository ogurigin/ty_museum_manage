<template>
	<div class="myDialogClass">
    	<el-dialog title="场馆类型详情" v-model="editVisible" width="20%">
			<el-form  ref="ruleFormRef"
    			:model="ruleForm"
				:rules="rules"
				label-width="80px">
				<el-form-item label="类型名称" prop="name">
					<el-input v-model="ruleForm.name" aria-readonly="true"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input v-model="ruleForm.sort" aria-readonly="true" placeholder="请输入排序"></el-input>
				</el-form-item>
				<el-form-item label="图片" prop="name">
					<upload-img ref="ventyd" class="uploadCont"></upload-img>
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
import {ref,defineExpose,defineEmits,nextTick} from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import uploadImg from "../../../../components/upload1.vue";
const {proxy} = getCurrentInstance() as any;
const editVisible = ref<boolean>(false);
	interface RuleForm {name: string, sort: string;}
const ruleForm =  ref<RuleForm>({
	name: '',
	sort:'',
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' },
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' },
  ],
});
const emit = defineEmits<{
	(event:'updated'): void
}>()
const detailId = ref() as any;
const imageUrl = ref() as any;
const ventyd = ref() as any
const open = (val:any) => {
	editVisible.value = true
	detailId.value = val.id
	ruleForm.value.name = val.name
	ruleForm.value.sort = val.sort
	nextTick(() => {
		ventyd.value.returnImg(val.pic)
	})
	imageUrl.value = val.pic
}
const saveEdit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await Promise.all([
		ventyd.value.uploadImg()
	]).then((res:any) => {
		if(res !='err'){
			imageUrl.value = res.toString()
		}
	})
	await formEl.validate((valid, fields) => {
		if (valid) {
			proxy.API.UpDateVenueType({
				id:detailId.value,
				name : ruleForm.value.name,
				sort:ruleForm.value.sort,
				type : 1,
				venueId : 0,
				pic : imageUrl.value
			}).then((res:any) => {
				if(res.data.success){
					editVisible.value = false
					ElMessage.success('编辑成功')
					emit('updated')
				}
			})
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