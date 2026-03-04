<template>
	<div class="myDialogClass">
    	<el-dialog title="添加场馆类型" v-model="editVisible" width="20%">
			<el-form  ref="ruleFormRef"
    			:model="ruleForm"
				:rules="rules"
				label-width="80px">
				<el-form-item label="类型名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入类型名称"></el-input>
				</el-form-item>
				<el-form-item label="图片">
					<upload-img ref="venty" class="uploadCont"></upload-img>
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
import {ref,defineExpose,defineEmits,reactive} from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import uploadImg from "../../../components/upload1.vue";
const {proxy} = getCurrentInstance() as any;
const editVisible = ref<boolean>(false);
interface RuleForm {name: string;id:string}
const ruleForm =  ref<RuleForm>({
	id: '',
	name: '',
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' },
  ],
});
const venty = ref(null) as any;
const imageUrl = ref('') as any;
const open =async (val?:any) => {
	editVisible.value = true
	nextTick().then(()=>{
		venty.value.returnImg(val.pic??'暂无')
		imageUrl.value = val.pic
		ruleForm.value.name = val.name??'';
		ruleForm.value.id = val.id??undefined;
	});
}
const emit = defineEmits<{
    (event:'updated'): void
}>()
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	Promise.all([
		venty.value.uploadImg()
	]).then((res:any) => {
		if(res != 'err'){
			imageUrl.value = res.toString()
		}
		formEl.validate(async(valid, fields) => {
			if (valid) {
				if(ruleForm.value.id){
					UpDateVenueType();
				} else {
					postVenueType();
				}
			} 
		})
	})
}
const postVenueType = async ()=>{
	await proxy.API.postVenueType({
		name : ruleForm.value.name,
		type : 9,
		pic : imageUrl.value
	});
	editVisible.value = false
	emit('updated')
}

const UpDateVenueType = async ()=>{
	await proxy.API.UpDateVenueType({
		id : ruleForm.value.id,
		name : ruleForm.value.name,
		type : 9,
		pic : imageUrl.value
	});
	editVisible.value = false
	emit('updated')
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