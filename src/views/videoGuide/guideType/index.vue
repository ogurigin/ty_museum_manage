<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-form :inline="true" :model="query" class="demo-form-inline">
                    <el-form-item label="视频名称">
                        <el-input v-model="query.name" placeholder="请输入视频名称" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                        <el-button type="primary" :icon="Plus" @click="handleSearch">添加</el-button>
                    </el-form-item>
                </el-form>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="name" label="类型名称"></el-table-column>
                <el-table-column prop="name" label="关联视频数量"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="->,total, prev, pager, next"
					:current-page="query.pageIndex"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive,defineEmits,onBeforeMount } from 'vue';
import {  Search,Plus } from '@element-plus/icons-vue';
const {proxy} = getCurrentInstance() as any;
interface TableItem {
	id: number;
	name: string;
}
const query = reactive({
	name: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
	proxy.API.fetchData({}).then((res:any) => {
		tableData.value = res.data.list;
		pageTotal.value = res.data.pageTotal;
	});
};
onBeforeMount(()=>{
	getData();
})
const emit = defineEmits<{
    (event:'lookFn',val:number): void
}>()
// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleLook = (index: number) => {
    emit('lookFn',1212)
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
.green {
	color: rgba(22,155,213);
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