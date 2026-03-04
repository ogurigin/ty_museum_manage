<template>
	<div class="container">
		<div class="handle-box">
			<el-form :inline="true" :model="query" class="demo-form-inline">
				<el-form-item label="手机号码">
					<el-input v-model="query.searchParam" placeholder="请输入手机号码" clearable />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="sort" label="序号" width="55" align="center"></el-table-column>
			<el-table-column prop="userNick" label="用户名称"></el-table-column>
			<el-table-column prop="mobile" label="手机号码"></el-table-column>
			<el-table-column prop="sex" label="性别">
				<template #default="scope">
					<span>
						{{
				scope.row.sex == 1 ? "男" : scope.row.sex == 0 ? "未知" : "女"
			}}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="loginTime" label="最近登录时间">
				<template #default="scope">
					{{ moment(scope.row.loginTime).format("YYYY-MM-DD HH:mm") }}
				</template>
			</el-table-column>
			<el-table-column prop="userType" label="用户类型">
				<template #default="scope">
					{{ scope.row.useType == 1 ? '普通用户' : '会员用户' }}
				</template>
			</el-table-column>
			<el-table-column prop="registerSrc" label="用户来源"></el-table-column>
			<!-- <el-table-column prop="name" label="总预约次数"></el-table-column>
				<el-table-column prop="name" label="累计消费"></el-table-column>
				<el-table-column prop="name" label="状态"></el-table-column> -->
			<el-table-column prop="status" label="状态" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.status === 1" type="success">
						激活
					</el-tag>
					<el-tag v-else-if="scope.row.status === 2" type="danger">
						锁定
					</el-tag>
					<el-tag v-else-if="scope.row.status === 3" type="danger">
						临时锁定
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="220" align="center">
				<template #default="scope">
					<el-button text :icon="View" class="green" @click="lookDetail(scope.row.id)">
						查看详情
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination background layout="->,total, prev, pager, next,jumper" :current-page="query.currentPage"
				:page-size="query.pageSize" :total="totalPage" @current-change="handlePageChange"></el-pagination>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, defineExpose, onBeforeMount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, View } from '@element-plus/icons-vue';
import moment from "moment";
const { proxy } = getCurrentInstance() as any;
interface TableItem {
	id: number;
	searchParam: string;
}
const totalPage = ref(0);
const query = reactive({
	searchParam: '',
	currentPage: 1,
	pageSize: 10,
	tell: ''
});
const tableData = ref<TableItem[]>([]);
// 获取表格数据
const getData = (num: number) => {
	if (num) {
		query.currentPage = num;
	}
	proxy.API.getUserInfo({
		page: query.currentPage,
		tell: query.tell,
		searchParam: query.searchParam,
	}).then((res: any) => {
		if (res.data.success) {
			let newArray = res.data.result.result.map((item: any, sort: any) => {
				return {
					...item,
					sort: sort + ((res.data.result.page - 1) * 10) + 1
				}
			})
			tableData.value = newArray;
			totalPage.value = res.data.result.totalItems;
		}
	});
};
// 查询操作
const handleSearch = () => {
	query.currentPage = 1;
	getData(query.currentPage);
};
// 分页导航
const handlePageChange = (val: number) => {
	query.currentPage = val;
	getData(query.currentPage);
};
const emit = defineEmits<{
	(event: 'lookFn', val: number, num: number): void
}>()
const lookDetail = (val: number) => {
	//查看详情
	emit('lookFn', val, query.currentPage);
}
defineExpose({
	getData
})
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

.green {
	color: rgba(22, 155, 213);
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
