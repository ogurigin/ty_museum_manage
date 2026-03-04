
<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-form :inline="true" :model="query" class="demo-form-inline">
                    <el-form-item label="类型名称">
                        <el-input v-model="query.name" placeholder="请输入类型名称" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                        <el-button type="primary" :icon="Plus" @click="handleAdd">添加</el-button>
                    </el-form-item>
                </el-form>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="sort" label="排序"></el-table-column>
				<el-table-column prop="name" label="类型名称"></el-table-column>
                <el-table-column prop="pic" label="类型LOGO">
                    <template #default="scope">
						<el-image
							class="table-td-thumb"
							:src="scope.row.pic"
							:z-index="10"
							:preview-src-list="[scope.row.pic]"
							preview-teleported
						>
						</el-image>
					</template>
                </el-table-column>
				<el-table-column label="操作" width="320" align="center">
					<template #default="scope">
						<el-button text :icon="View" class="green" @click="handleLook(scope.row)">
							编辑
						</el-button>
                        <el-button text :icon="Delete" class="red" @click="handleDelete(scope.row.id)">
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
        <add ref="addV" @updated="updated"></add>
        <detail ref="detailV" @updated="updated"></detail>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive ,onBeforeMount} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {  View, Search,Plus,Delete } from '@element-plus/icons-vue';
import Add from './components/add.vue';
import Detail from './components/detail.vue';
const {proxy} = getCurrentInstance() as any;
interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	address: string;
}
const addV = ref();
const detailV = ref();
const query = reactive({
	name: '',
	currentPage: 1,
	pageSize: 10
});
const handleAdd = () => {
    addV.value.open()
}
const tableData = ref<TableItem[]>([]);
const totalPage = ref(0);
// 获取表格数据
const getData = () => {
	proxy.API.getVenueTypeList({
		pageNum: query.currentPage,
        pageSize: query.pageSize,
        venueId : '',
        type : 1,
        name : query.name
	}).then((res:any) => {
		if(res.data.success){
			tableData.value = res.data.result.result;
			totalPage.value = res.data.result.totalItems;
		}
	});
};
onBeforeMount(() => {
	getData();
})
// 查询操作
const handleSearch = () => {
	query.currentPage = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.currentPage = val;
	getData();
};
const handleLook = (row: any) => {
    detailV.value.open(row)
}
const updated = () =>{
	query.currentPage = 1;
	getData();
}
const delVenueType = (id:number) => {
	proxy.API.delVenueType({
		id:id
	}).then((res:any)=>{
		if(res.data.success){
			getData();
			ElMessage.success('删除成功');
		}
	})
}
// 删除操作
const handleDelete = (id:number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			delVenueType(id);
		})
		.catch(() => {});
};
</script>

<style scoped>
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
.red {
	color: #F56C6C;
}

.green{
    color: rgba(22,155,213);
}
.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	/* margin: auto; */
	width: 40px;
	height: 40px;
}
</style>