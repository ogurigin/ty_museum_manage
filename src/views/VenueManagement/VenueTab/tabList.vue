<template>
	<div class="container">
		<div class="handle-box">
			<el-form :inline="true" :model="query" class="demo-form-inline">
				<el-form-item label="场馆名称">
					<el-input v-model="query.name" placeholder="请输入场馆名称" clearable />
				</el-form-item>
				<el-form-item label="场馆类型">
					<el-select v-model="query.venueType" placeholder="请选择场馆类型" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in typeOptions"
							:key="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="query.status" placeholder="请选择状态" clearable>
						<el-option value="-1" label="全部"></el-option>
						<el-option value="0" label="正常"></el-option>
						<el-option value="1" label="禁用"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="enterpriseId" label="企业id"></el-table-column>
			<el-table-column prop="name" label="场馆名称"></el-table-column>
			<el-table-column prop="venueType" label="场馆类型"></el-table-column>
			<el-table-column prop="labelName" label="场馆标签"></el-table-column>
			<el-table-column prop="clickCount" label="访问数量"></el-table-column>
			<el-table-column prop="collectCount" label="收藏数量"></el-table-column>
			<el-table-column prop="informationCount" label="当前展览"></el-table-column>
			<el-table-column prop="digitalCount" label="数字展"></el-table-column>
			<el-table-column prop="goodsCount" label="文创商品"></el-table-column>
			<el-table-column prop="bookCount" label="相关书籍"></el-table-column>
			<el-table-column prop="isTop" label="置顶">
				<template #default="scope">
					<el-switch v-model="scope.row.isTop" :active-value="1" :inactive-value="0"
						@change="changeIstop(scope.row.id, scope.row.isTop)" />
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.status == 1" type="danger">
						禁用
					</el-tag>
					<el-tag v-else type="success">
						正常
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="250" align="center">
				<template #default="scope">
					<el-button text :icon="View" class="green" @click="handleLook(scope.row.id,query.currentPage)">
						查看详情
					</el-button>
					<el-button text :icon="Lock" class="red" @click="close(scope.row.id, 1)" v-if="scope.row.status == 0">
						禁用
					</el-button>
					<el-button text :icon="Unlock" class="green" @click="open(scope.row.id, 0)" v-else>
						启用
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination background layout="->,total, prev, pager, next,jumper" :current-page="query.currentPage"
				:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, onBeforeMount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { View, Search, Unlock, Lock } from '@element-plus/icons-vue';
const { proxy } = getCurrentInstance() as any;
const query = reactive({
	venueType: '',
	name: '',
	status: '-1',
	currentPage: 1,
	pageSize: 10
});
const tableData = ref<any>([]);
const pageTotal = ref(0);
const typeOptions = ref<any>([]);
// 获取表格数据
const getData = async (num:number) => {
	console.log('我执行了',num);
	console.log(tableData.value,'旧的');
	if (num > 0) { query.currentPage = num }
	const res = await proxy.API.getVenueList({
		pageNum: query.currentPage,
		pageSize: query.pageSize,
		status: query.status,
		name: query.name || '',
		venueType: query.venueType || ''
	})
	if (res.data.success) {
		tableData.value = res.data.result.result;
		pageTotal.value = res.data.result.totalItems;
		console.log(tableData.value,'新的');
		
		// getVenueTypeList();
	}
};
// 获取场馆类型
const getVenueTypeList = () => {
	proxy.API.getVenueTypeList({
		pageNum: 1,
		venueId: '',
		name: '',
		type: 1
	}).then((res: any) => {
		if (res.data.success) {
			const newArray = res.data.result.result.map((item: any) => {
				return {
					value: item.id,
					label: item.name
				}
			})
			newArray.unshift({
				value: 0,
				label: '-'
			})
			typeOptions.value = newArray;
			for (let i = 0; i < typeOptions.value.length; i++) {
				const typeValue = typeOptions.value[i].value;
				const typeLabel = typeOptions.value[i].label;
				for (let j = 0; j < tableData.value.length; j++) {
					if (typeValue === tableData.value[j].venueType) {
						tableData.value[j].venueType = typeLabel;
					}
				}
			}
		}
	});
}
const changeIstop = (val: any, isTop: any) => {
	proxy.API.updateVenueTop({
		id: val,
		status: isTop,
	}).then((res: any) => {
		if (res.data.success) {
			if (isTop == 0) {
				ElMessage({
					type: 'info',
					message: '取消置顶',
				});
			} else {
				ElMessage({
					type: 'success',
					message: '置顶成功',
				});
			}
			getData(query.currentPage);
		} else {
			if (isTop == 0) {
				ElMessage({
					type: 'info',
					message: '置顶失败',
				});
				getData(query.currentPage);
			} else {
				ElMessage({
					type: 'success',
					message: '取消置顶失败',
				});
				getData(query.currentPage);
			}
		}
	})
}
const emit = defineEmits<{
	(event: 'lookFn', id: number,pageNum:number): void
}>()
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

// 查看详情操作
const handleLook = (id: number,pageNum:number) => {
	emit('lookFn', id,pageNum)
};
const open = (val: number, num: any) => {
	ElMessageBox.confirm(
		'确定要启用吗?',
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
			update(val, num);
		})
		.catch(() => {
			ElMessage({
				type: 'info',
				message: '取消操作',
			})
		})
}
const close = (val: number, num: any) => {
	ElMessageBox.confirm(
		'确定要禁用吗?',
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
			update(val, num);
		})
		.catch(() => {
			ElMessage({
				type: 'info',
				message: '取消操作',
			})
		})
};
const update = (id: number, status: any) => {
	proxy.API.updateNewVenue({
		status: status,
		id: id
	}).then((res: any) => {
		if (res.data.success) {
			getData(query.currentPage);
			ElMessage.success('更新成功!')
		}
	})
}
defineExpose({
	getData
})
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
	color: #e4393c
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