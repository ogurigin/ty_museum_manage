
<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-form :inline="true" :model="formInline" class="demo-form-inline">
					<el-form-item label="内容标题">
						<el-input v-model="formInline.title" placeholder="请输入内容标题" clearable />
					</el-form-item>
					<el-form-item label="关联场馆">
						<el-select v-model="formInline.venueIds" placeholder="请选择场馆名称" multiple filterable remote
							:remote-method="sreachVenue" :multiple-limit="3" v-loadMore="loadMore" :teleported="false">
							<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="上传视频">
						<el-upload class="avatar-uploader" :action="uploadImgUrl" :data="uploadImgData"
							:show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
							<video width="100%" v-if="imageUrl" controls="false" :key="menuKey">
								<source :src="rightData.props.src" type="video/mp4" />
							</video>
							<el-button v-show="!imageUrl" type="primary" plain>点击上传</el-button>
						</el-upload>
					</el-form-item> -->
					<el-form-item label="上传图片（不超过九张）">
						<upload-lun ref="avaUp1" class="uploadCont"></upload-lun>
					</el-form-item>
				</el-form>
			</div>
			<Editor class="editor" :content="formInline.detail" ref="NewEditor"/>
			<span class="footer">
				<el-button type="primary" @click="cancle()">取 消</el-button>
				<el-button type="primary" @click="saveEdit()">确 定</el-button>
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits,onMounted } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import Editor from '../../../../components/editor.vue'
import uploadLun from "../../../../components/uploadImg.vue";
import { forEach,uniq } from "lodash";
const { proxy } = getCurrentInstance() as any;
const formInline = reactive({
	userNick:'淘艺数据技术',
	userPhone:sessionStorage.getItem('ms_username'),
	title: '',
	venueIds: [],
	detail:'',
	pics:''
});
const NewEditor = ref<any>(null);
const query = reactive({
	venueType: '',
	name: '',
	currentPage: 1,
	pageSize: 10,
	pageTotal:1,
	finished : false
});
const options = ref<any>([]);
const emit = defineEmits<{
	(event: 'goBack'): void
	(event: 'refresh'): void
}>()
const avaUp1 = ref(null) as any


const cancle = () => {
	emit('goBack')
}
const saveEdit = async() => {
	await Promise.all([
        avaUp1.value.uploadImg()
	]).then((res:any) => {
        if(res != 'err'){
            let arr = [] as any;
            forEach(res,ele=>{
                forEach(ele,a=>{
                    arr.push(a.url)
                })
            })
            formInline.pics = arr.toString()
        }else{
            ElMessage.warning('请上传图片！')
        }
	});
	formInline.detail = NewEditor.value.syncHTML();
	PostContentInfo();
}
const sreachVenue = (e: string) => {
	if(e){
		query.name = e;
	}else{
		query.name = ''
	}
	proxy.API.getVenueList({
		pageNum:query.currentPage,
		pageSize:query.pageSize,
		name:query.name || '',
		status : '0',
		venueType:query.venueType || ''
	}).then((res:any) => {
		if(res.data.result.result.length >=0){
			options.value = res.data.result.result
        }
	});
};
const sreachVenueTwo = () =>{
	proxy.API.getVenueList({
		pageNum:query.currentPage,
		pageSize:query.pageSize,
		name:query.name || '',
		status : '0',
		venueType:query.venueType || ''
	}).then((res:any) => {
		if(res.data.result.result.length >=0){
            forEach(options.value,ele=>{
                if(ele.id === res.data.result.result[0].id){
                    query.finished= true
                }
            })
            if(query.finished){
                options.value = uniq(options.value)
            }else{
                options.value = [...options.value ,...res.data.result.result];
            }
        }else{
            query.finished = true
        }  
	});
}
const PostContentInfo = ()=>{
	let newobj = {
		...formInline
	}
	if(newobj.venueIds.length>0){
		 newobj.venueIds = newobj.venueIds.join(',') as never;
	}else{
		newobj.venueIds = '' as never
	}
	proxy.API.PostContentInfo(newobj).then((res:any)=>{
        if(res.data.success){
			ElMessage.success('新增内容成功')
			emit('refresh');
			emit('goBack');
		}
	}).catch((err:any)=>{
		ElMessage.warning(err)
	})
};
const loadMore = () => {
    // 防抖处理
    setTimeout(() => {
        if (query.finished) return
        query.currentPage += 1
        sreachVenueTwo()
    }, 500)
}
onMounted(()=>{
	sreachVenueTwo();
})
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.editor {
	line-height: normal !important;
	height: 400px;
	margin-bottom: 30px;
}

.footer {
	display: inline-block;
	line-height: 40px;
	margin-top: 20px;
}
:deep(.el-form--inline .el-form-item){
	display: inline-flex;
    vertical-align: middle;
    margin-right: 32px;
    align-items: center;
}
</style>
