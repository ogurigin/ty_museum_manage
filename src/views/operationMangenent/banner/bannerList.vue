<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-form :inline="true" :model="query" class="demo-form-inline">
					<el-form-item label="banner名称">
						<el-input v-model="query.name" placeholder="请输入用户名称" clearable />
					</el-form-item>
					<el-form-item label="位置">
						<el-select  v-model="query.location" placeholder="请选择位置" value-key="location" clearable>
							<el-option label="全部" value=""></el-option>
							<el-option label="首页Banner" value="1"></el-option>
							<el-option label="首页腰封banner" value="2"></el-option>
							<el-option label="我的页面banner" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select  v-model="query.status" placeholder="请选择状态" value-key="status"  clearable>
								<el-option label="全部" value="" />
								<el-option label="上架中" value="1" />
								<el-option label="下架" value="2" />
								<el-option label="已失效" value="3" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" :icon="Plus" @click="handleAdd">添加</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
					<el-table-column prop="name" label="名称"></el-table-column>
					<el-table-column prop="location" label="位置">
						<template #default="scope">
							<span>
							{{ scope.row.location == 1 ? "首页Banner" : "" }}
							{{ scope.row.location == 2 ? "首页腰封banner" : "" }}
							{{ scope.row.location == 3 ? "我的页面banner" : "" }}
							{{ scope.row.location == 4 ? "场馆资讯" : "" }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="封面">
						<template #default="scope">
							<el-image
								class="table-td-thumb"
								:src="scope.row.pic ? scope.row.pic : ''"
								:z-index="10"
								:preview-src-list="[scope.row.pic]"
								preview-teleported
							>
							</el-image>
						</template>
					</el-table-column>
					<el-table-column prop="sort" label="排序"></el-table-column>
					<el-table-column prop="source" label="数据来源">
						<template #default="scope">
							<span>
							{{ scope.row.source == 0 ? "自建" : "用户" }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="可见用户">
						<template #default="scope">
							<span>
							{{ scope.row.visibility == 1 ? "不限" : "登录用户" }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="link" label="跳转链接">
						<template #default="scope">
							<a :href="scope.row.link" class="red">{{ scope.row.link }}</a>
						</template>
					</el-table-column>
					<el-table-column  prop="status" label="状态" align="center">
						<template #default="scope">
							<el-tag
								v-if="scope.row.status == 1"
								type="success"
							>
								上架中
							</el-tag>
							<el-tag
								v-else-if="scope.row.status == 2"
								type="danger"
							>
							已下架
							</el-tag>
							<el-tag
								v-else-if="scope.row.status == 3"
								type="danger"
							>
								已失效
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="320" align="center">
						<template #default="scope">
							<el-button text :icon="View" class="green" @click="lookDetail( scope.row.id)">
								查看详情
							</el-button>
							<el-button v-if="scope.row.status == 2" text :icon="ArrowUpBold" class="green"  @click="handleUnder(scope.row.id,scope.row.status)">
								上架
							</el-button>
							<el-button v-if="scope.row.status == 1" text :icon="ArrowDownBold" class="green"  @click="handleUnder(scope.row.id,scope.row.status)">
								下架
							</el-button>
							<el-button v-if="scope.row.status != 3" text :icon="Delete" class="red" @click="handleDelete(scope.row.id)">
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination">
					<el-pagination
						background
						layout="->,total, prev, pager, next"
						:current-page="query.currentPage"
						:page-size="query.pageSize"
						:total="totalPage"
						@current-change="handlePageChange"
					></el-pagination>
				</div>
		</div>
		<add ref="addM" @updated="updated"></add>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive,defineEmits,onBeforeMount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {  Plus,Search,ArrowUpBold,View,ArrowDownBold,Delete } from '@element-plus/icons-vue';
import Add from './components/add.vue'
const {proxy} = getCurrentInstance() as any;
const props = withDefaults(defineProps<{
    msg?:string
}>(),{
    msg: '默认值'
})
interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	address: string;
}
const query = reactive<any>({
	location: '',
	name: '',
	currentPage: 1,
	pageSize: 10,
	status:''
});
const tableData = ref<TableItem[]>([]);
const addM = ref();
const totalPage = ref(0);
// 获取表格数据
const getData = () => {
	proxy.API.getBannerList({
		pageNum:query.currentPage,
		pageSize:query.pageSize || 10,
		name:query.name || '',
		location:query.location || '',
		status:query.status || '',
	}).then((res:any)=> {
		if(res.data.success){
			tableData.value = res.data.result.result;
		  	totalPage.value = res.data.result.totalItems;
		}
	});
};
onBeforeMount(()=>{
	getData();
})
const postBannerInfo = (id:number,status:number) => {
	proxy.API.postBannerInfo({
		id:id,
		status:status
	}).then((res:any) => {
		if(res.data.success){
			getData()
		}else{
			ElMessage.error(res.data.errorMessage)
		}
	})
}
const delBannerInfo = (id:number) => {
	proxy.API.delBannerInfo({
		id:id,
	}).then((res:any) => {
		if(res.data.success){
			ElMessage.success('删除成功!');
			getData()
		}else{
			ElMessage.error(res.data.errorMessage)
		}
	})
}
const handleSearch = () => {
	query.currentPage = 1;
	getData();
};
const handlePageChange = (val: number) => {
	query.currentPage = val;
	getData();
};
const emit = defineEmits<{
    (event:'lookFn',val:number): void
}>()
const handleAdd = () => {
    addM.value.open()
}
const updated = () => {
	query.currentPage = 1;
	getData();
}
const lookDetail = (val: number) => {
    emit('lookFn',val)
}
const handleUnder = (val:number,status:number) => {
	if(status == 1){
		postBannerInfo(val,2)
	}else if(status == 2){
		postBannerInfo(val,1)
	}
}
const handleDelete = (val:number) => {
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	}).then(() => {
			delBannerInfo(val)
		}).catch(() => {});
}
</script>

<style lang="less" scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
}
.green{
    color: rgba(22,155,213);
}
.red {
	color: #F56C6C;
}
.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
