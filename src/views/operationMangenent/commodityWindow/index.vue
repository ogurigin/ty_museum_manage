<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-form :inline="true" :model="query" class="demo-form-inline">
                    <el-form-item label="橱窗名称">
                        <el-input v-model="query.name" placeholder="请输入橱窗名称" clearable />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select  v-model="query.status" placeholder="请选择状态" value-key="status" clearable>
							<el-option label="全部" value="" />
                            <el-option label="正常" value="1" />
                            <el-option label="失效" value="2" />
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
				<el-table-column prop="name" label="橱窗名称"></el-table-column>
				<el-table-column prop="upper" label="橱窗内容上限"></el-table-column>
				<el-table-column prop="residual" label="剩余内容数量"></el-table-column>
				<el-table-column prop="sort" label="橱窗顺序"></el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template #default="scope">
						<el-tag
							v-if="scope.row.status == 1"
							type="success"
						>
							正常
						</el-tag>
						<el-tag
							v-else
							type="danger"
						>
							失效
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="320" align="center">
					<template #default="scope">
						<el-button text :icon="View" class="green" @click="lookDetail(scope.row.id)">
							查看详情
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
					:current-page="query.pageNum"
					:page-size="query.pageSize"
					:total="totalPage"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>
        <add ref="addW" @updated="updated"></add>
        <Details ref="detailW" @updated="updated"></Details>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive,onBeforeMount} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, View, Search, Plus } from '@element-plus/icons-vue';
import Add from './components/add.vue'
import Details from './components/detail.vue'
const {proxy} = getCurrentInstance() as any;
interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	address: string;
}
const addW = ref();
const detailW = ref();
const query = reactive({
	status: '',
	name: '',
	pageNum: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const totalPage = ref(0);
// 获取表格数据
const getData = () => {
	proxy.API.getShowcase({
		pageNum:query.pageNum,
		pageSize: query.pageSize,
		name:query.name,
		status:query.status
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
const delShowCaseInfo = (id:number) => {
	proxy.API.delShowCaseInfo({id:id}).then((res:any) => {
		if(res.data.success){
			ElMessage.success('删除成功!')
			getData();
		}
	})
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
const updated = () => {
    //新增刷新
    query.pageNum = 1;
	getData();
}
const handleAdd = () => {
    addW.value.open()
}
const lookDetail = (val:number) => {
    detailW.value.open(val)
}
// 删除操作
const handleDelete = (val: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			delShowCaseInfo(val)
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
