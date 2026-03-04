
<template>
	<div>
		<div class="container"  v-if="show">
			<div class="handle-box">
				<el-form :inline="true" :model="query" class="demo-form-inline">
                    <el-form-item label="标题名称">
                        <el-input v-model="query.name" placeholder="请输入标题名称" clearable />
                    </el-form-item>
                    <el-form-item label="文物类型">
						<el-select 
							v-model="query.type" 
							placeholder="请选择"  
							:teleported="false" 
							filterable 
							remote 
							v-loadMore="loadTabsMore"
						>
						<el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="query.status" placeholder="请选择">
                            <el-option label="全部" :value="-1"></el-option>
                            <el-option label="正常" :value="0"></el-option>
                            <el-option label="禁用" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                        <el-button type="primary" :icon="Plus" @click="handleAdd()">添加</el-button>
                    </el-form-item>
                </el-form>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="pic" label="文物图片">
                    <template #default="{row}">
						<el-image
							class="table-td-thumb"
							:src="row.pic"
							:z-index="10"
							:preview-src-list="[row.pic]"
							preview-teleported
						>
						</el-image>
					</template>
                </el-table-column>
				<el-table-column prop="name" label="文物标题"></el-table-column>
				<el-table-column prop="typeName" label="文物分类"></el-table-column>
				<el-table-column prop="address" label="文物地址"></el-table-column>
				<el-table-column prop="yearString" label="文物朝代"></el-table-column>
				<el-table-column prop="status" label="状态">
					<template #default="{row}">
						<span>{{row.status === 1?'禁用':'正常'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="320" align="center">
					<template #default="{row}">
						<el-button text :icon="View" class="green" @click="handleAdd(row.id)">
							编辑
						</el-button>
                        <el-button v-if="row.status === 0" text :icon="Delete" class="red"  @click="handleDisable(row.id,1)">
							禁用
						</el-button>
						<el-button text :icon="Unlock" class="green" @click="handleDisable(row.id,0)" v-else>
							启用
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(row.id)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="->,total, prev, pager, next"
					:current-page="query.pageNum"
					:page-size="query.pageSize"
					:total="totalPage"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>
    <Add ref="addV"  @open="updated" v-if="!show"></Add>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive ,onBeforeMount} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {  View, Search,Plus,Delete,Unlock } from '@element-plus/icons-vue';
import Add from './add.vue';
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
const show = ref(true);
const detailV = ref();
const query = reactive({
	name: '',
	type: '',
	status: -1,
	pageNum: 1,
	pageSize: 10
});

const typeOptions = ref<any[]>([]);
const typeQuery = reactive({
	pageNum: 1,
	pageSize: 10,
	pageTotal: 1
});
const getTabs =async () => {
	let params = {
		...typeQuery,
		type:9,
		venueId: "",
		name: "",
	};
	const {data} =await proxy.API.getTabs(params);
	typeQuery.pageTotal = data.result.pages;
	typeOptions.value.push(...data.result.result);
};
const loadTabsMore =() =>{
	if(typeQuery.pageNum === typeQuery.pageTotal)return;
	typeQuery.pageNum ++;
	getTabs();
  }


const handleAdd =async (id?:number) => {
    show.value = false;
	await nextTick();
    addV.value?.init(id)
}
const tableData = ref<TableItem[]>([]);
const totalPage = ref(0);
// 获取表格数据
const getData = () => {
	proxy.API.getAntiqueList({
		...query,
        venueId : '',
	}).then((res:any) => {
		if(res.data.success){
			tableData.value = res.data.result.result;
			totalPage.value = res.data.result.totalItems;
		}
	});
};
onBeforeMount(() => {
	getTabs();
	getData();
})
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

const updated = () =>{
    show.value = true;
	query.pageNum = 1;
	getData();
}

// 删除操作
const handleDisable = (id:number,status:0|1) => {
	// 二次确认删除
	ElMessageBox.confirm(`确定要${status === 1?'禁用':'启用'}吗？`, '提示', {
		type: 'warning'
	})
	.then(async () => {
		await proxy.API.updateAntique({id,status})
		ElMessage.success('操作成功');
		handleSearch();
	})
	.catch(() => {});
};

// 删除操作
const handleDelete = (id:number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(async () => {
			await proxy.API.delAntique({id})
			ElMessage.success('操作成功');
			handleSearch();
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