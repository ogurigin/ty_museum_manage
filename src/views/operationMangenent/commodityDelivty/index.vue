<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-form :inline="true" :model="query" class="demo-form-inline">
					<el-form-item label="名称">
						<el-input v-model="query.name" placeholder="请输入橱窗名称" clearable />
					</el-form-item>
					<el-form-item label="业务类型">
						<el-select v-model="query.type" placeholder="请选择业务类型" value-key="type" clearable>
							<el-option label="全部" value="" />
							<el-option label="场馆" value="1" />
							<el-option label="展览" value="2" />
							<el-option label="相关书籍" value="3" />
							<el-option label="文创商品" value="4" />
						</el-select>
					</el-form-item>
					<el-form-item label="橱窗类型">
						<el-select v-model="query.showcaseId" placeholder="请选择橱窗类型" value-key="showcaseId" clearable>
							<el-option label="全部" value="" />
							<el-option :label="item.name" :value="item.id" :key="index"
								v-for="(item, index) in commodityType"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="广告类型">
						<el-select v-model="query.adType" placeholder="请选择广告类型" value-key="adType" clearable>
							<el-option label="全部" value=""></el-option>
							<el-option label="按天推广" value="1"></el-option>
							<el-option label="按点击次数推广(CPC)" value="2"></el-option>
							<el-option label="按成功预约推广(CPS)" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="query.status" placeholder="请选择状态" value-key="status" clearable>
							<el-option label="全部" value=""></el-option>
							<el-option label="上架中" value="1"></el-option>
							<el-option label="已下架" value="2"></el-option>
							<el-option label="已失效" value="3"></el-option>
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
				<el-table-column prop="name" label="博物馆名称"></el-table-column>
				<el-table-column prop="type" label="业务类型">
					<template #default="scope">
						{{ scope.row.type == 1 ? '场馆' : '' }}
						{{ scope.row.type == 2 ? '展览' : '' }}
						{{ scope.row.type == 3 ? '相关书籍' : '' }}
						{{ scope.row.type == 4 ? '文创商品' : '' }}
					</template>
				</el-table-column>
				<el-table-column prop="showcaseName" label="橱窗类型"></el-table-column>
				<el-table-column prop="sort" label="排序"></el-table-column>
				<el-table-column prop="source" label="数据来源">
					<template #default="scope">
						{{ scope.row.source == 1 ? '用户' : '自建' }}
					</template>
				</el-table-column>
				<el-table-column prop="visibility" label="可见用户">
					<template #default="scope">
						{{ scope.row.visibility == 1 ? '不限' : '登录用户' }}
					</template>
				</el-table-column>
				<el-table-column prop="adType" label="广告类型">
					<template #default="scope">
						{{ scope.row.adType == 1 ? '按天推广' : '' }}
						{{ scope.row.adType == 2 ? '按点击次数推广(CPC)' : '' }}
						{{ scope.row.adType == 3 ? '按成功预约推广(CPS)' : '' }}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="adCycle" label="广告周期">
					<template #default="scope">
						<div v-if="scope.row.adType == 1">
							{{ scope.row.adCycle }}天
						</div>
						<div v-else="scope.row.adType != 1">
							{{ scope.row.adCycle }}次
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="adResidualCycle" label="剩余广告周期">
					<template #default="scope">
						<div v-if="scope.row.adType == 1">
							{{ getDaysFromSeconds(scope.row.adResidualCycle) }}天
						</div>
						<div v-else="scope.row.adType != 1">
							{{ scope.row.adResidualCycle }}次
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="adClickCount" label="广告点击次数"></el-table-column>
				<el-table-column prop="adPrebookCount" label="核销次数"></el-table-column>
				<el-table-column prop="useType" label="广告转化率">
					<template #default="scope">
						<span v-if="scope.row.adClickCount != 0 && scope.row.adType == 2">
							{{ (scope.row.adPrebookCount / scope.row.adResidualCycle * 100).toFixed(0) }}%
						</span>
						<span v-else-if="scope.row.adClickCount != 0 && scope.row.adType != 2">
							{{ (scope.row.adPrebookCount / scope.row.adClickCount * 100).toFixed(0) }}%
						</span>
						<span v-else>
							0%
						</span>
					</template>
				</el-table-column> -->
				<el-table-column prop="status" label="状态" align="center">
					<template #default="scope">
						<el-tag v-if="scope.row.status == 1" danger="success">
							上架中
						</el-tag>
						<el-tag v-else-if="scope.row.status == 2" type="success">
							已下架
						</el-tag>
						<el-tag v-else type="danger">
							已失效
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="320" align="center">
					<template #default="scope">
						<el-button v-if="scope.row.status == 2" text :icon="ArrowUpBold" class="green"
							@click="handleUnder(scope.row.id, scope.row.status)">
							上架
						</el-button>
						<el-button v-if="scope.row.status == 1" text :icon="ArrowDownBold" class="green"
							@click="handleUnder(scope.row.id, scope.row.status)">
							下架
						</el-button>
						<el-button v-if="scope.row.status != 1" text :icon="Delete" class="red"
							@click="handleDelete(scope.row.id)">
							删除
						</el-button>
						<el-button text :icon="Edit" class="green" @click="lookDetail(scope.row.id)">
							查看详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="->,total, prev, pager, next" :current-page="query.pageNum"
					:page-size="query.pageSize" :total="totalPage" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>
		<add ref="addD" @updated="updated"></add>
		<detail ref="detail"></detail>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowDownBold, ArrowUpBold, Search, Plus, Delete, Edit } from '@element-plus/icons-vue';
import Add from "./components/add.vue";
import Detail from "./components/detail.vue";
const { proxy } = getCurrentInstance() as any;
interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	address: string;
}
const query = reactive({
	type: '',
	name: '',
	adType: '',
	showcaseId: '',
	status: '',
	pageNum: 1,
	pageSize: 10
});
const commodityType = ref([]) as any;
const addD = ref();
const detail = ref();;
const tableData = ref<TableItem[]>([]);
const totalPage = ref(0);
// 获取表格数据
const getData = () => {
	proxy.API.getLaunchList({
		pageNum: query.pageNum,
		pageSize: query.pageSize,
		name: query.name || '',
		type: query.type || '',
		adType: query.adType || '',
		showcaseId: query.showcaseId || '',
		id: '',
		status: query.status || '',
	}).then((res: any) => {
		if (res.data.success) {
			tableData.value = res.data.result.result;
			totalPage.value = res.data.result.totalItems;
		}
	});
};
const postLaunchInfoUpDown = (id: number, status: number) => {
	proxy.API.postLaunchInfoUpDown({
		id: id,
		status: status
	}).then((res: any) => {
		if (res.data.success) {
			getData()
		} else {
			ElMessage.error(res.data.errorMessage)
		}
	})
}
const getShowcaseList = () => {
	proxy.API.getShowcaseList({}).then((res: any) => {
		if (res.data.success) {
			let newArray = res.data.result.map((item: any) => {
				return {
					name: item.name + ' (' + item.residual + ')',
					label: item.residual,
					id: item.id
				};
			});
			commodityType.value = newArray;
		} else {
			ElMessage.error(res.data.errorMessage)
		}
	})
}
onBeforeMount(() => {
	getData();
	getShowcaseList();
})
const lookDetail = (val: any) => {
	detail.value.open(val);
}
const handleUnder = (id: number, status: any) => {
	if (status == 1) {
		postLaunchInfoUpDown(id, 2)
	} else if (status == 2) {
		postLaunchInfoUpDown(id, 1)
	}
}
const handleDel = (id: number) => {
	proxy.API.delLaunchInfo({ id: id }).then((res: any) => {
		if (res.data.success) {
			ElMessage.success('删除成功');
			getData();
		}
	})
}
const getDaysFromSeconds = (seconds: any) => {
	const secondsInADay = 24 * 60 * 60; // 一天的秒数
	const days = Math.floor(seconds / secondsInADay); // 计算整数天数
	return days;
}
const handleAdd = () => {
	//新增
	addD.value.open()
}
const updated = () => {
	// 新增刷新
	query.pageNum = 1;
	getData();
}
// 查询操作
const handleSearch = () => {
	query.pageNum = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageNum = val;
	getData();
};

// 删除操作
const handleDelete = (id: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			handleDel(id)
		})
		.catch(() => { });
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
	color: rgba(22, 155, 213);
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
