
<template>
	<div>
		<div class="container"  v-if="show">
			<div class="handle-box">
				<el-form :inline="true" :model="query" class="demo-form-inline">
                    <el-form-item label="卡片名称">
                        <el-input v-model="query.name" placeholder="请输入标题名称" clearable />
                    </el-form-item>
                    <el-form-item label="创作者">
						<el-select 
							filterable
							v-model="query.enterpriseId" 
							placeholder="请选择"  
							:teleported="false" 
							remote 
						>
						<el-option v-for="item in creatorList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                        <el-button type="primary" :icon="Plus" @click="handleAdd()">新建卡片</el-button>
                    </el-form-item>
                </el-form>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="name" label="卡片名称"> </el-table-column>
                <el-table-column prop="nfcId" label="卡片编号"> </el-table-column>
				<el-table-column prop="enterpriseName" label="创作者"></el-table-column>
				<el-table-column prop="createTime" label="创建时间"></el-table-column>
				<el-table-column label="操作" width="320" align="center">
					<template #default="{row}">
						<el-button text :icon="View" class="green" @click="handleAdd(row.id,1)" >
							查看 
						</el-button>
						<el-button text :icon="Edit" class="green" @click="handleAdd(row.id)">
							编辑
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
import {  View,Edit, Search,Plus,Delete } from '@element-plus/icons-vue';
import moment from "moment";
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
const query = reactive({
	name: '',
	enterpriseId: '',
	pageNum: 1,
	pageSize: 10
});

const creatorList = ref<any[]>([]);//创作者列表
const getCreatorAll =async () => {
	const res =await proxy.API.getCreatorAll();
	creatorList.value = res.data.result;
};

const handleAdd =async (id?:number,type?:number) => {
    show.value = false;
	await nextTick();
    addV.value?.init(id,type)
}
const tableData = ref<TableItem[]>([]);
const totalPage = ref(0);
// 获取表格数据
const getData = () => {
	proxy.API.getPassCardList({
		...query,
	}).then((res:any) => {
		if(res.data.success){
			// tableData.value = res.data.result.result;
			const data = res.data.result.result;
			tableData.value = data.map((item:any)=>{
        				item.createTime = moment(item.createTime).format("YYYY-MM-DD HH:mm")			
				return item;
			})
			totalPage.value = res.data.result.totalItems;
		}
	});
};
onBeforeMount(() => {
	getCreatorAll();
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
const handleDelete = (id:number) => {
	
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
	.then(async () => {
		await proxy.API.delPasscard({id})
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