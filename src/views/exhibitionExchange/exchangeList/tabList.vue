<template>
    <div class="handle-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="展览名称">
                <el-input v-model="formInline.name" placeholder="请输入展览名称" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="sort" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="展览名称" align="center"></el-table-column>
        <el-table-column prop="bwgName" label="博物馆名称" align="center"></el-table-column>
        <el-table-column prop="pic" label="展览图片" align="center">
            <template #default="scope">
                <el-image class="table-td-thumb" :src="scope.row.pic" :z-index="10" :preview-src-list="[scope.row.pic]"
                    preview-teleported>
                </el-image>
            </template>
        </el-table-column>
        <el-table-column prop="number" label="展品数量" align="center">
            <template v-slot="scope">
                {{ scope.row.number == 1 ? '1-50件' : '' }}
                {{ scope.row.number == 2 ? '51-100件' : '' }}
                {{ scope.row.number == 3 ? '101-150件' : '' }}
                {{ scope.row.number == 4 ? '151-200件' : '' }}
                {{ scope.row.number == 5 ? '200件以上' : '' }}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="展览类型" align="center">
            <template v-slot="scope">
                {{ scope.row.type == 1 ? '历史文物' : '' }}
                {{ scope.row.type == 2 ? '人文艺术' : '' }}
                {{ scope.row.type == 3 ? '自然科学' : '' }}
                {{ scope.row.type == 4 ? '革命历史' : '' }}
                {{ scope.row.type == 5 ? '文明互鉴' : '' }}
            </template>
        </el-table-column>
        <el-table-column prop="person" label="联系电话" align="center"></el-table-column>
        <el-table-column label="操作" width="240" align="center" class="edit">
            <template #default="scope">
                <el-button text :icon="View" class="green" @click="lookDetail(scope.row.id)">
                    查看详情
                </el-button>
                <el-button text :icon="Delete" class="green red" @click="delDetail(scope.row.id)">
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination">
        <el-pagination background layout="->,total, prev, pager, next" :current-page="query.pageIndex"
            :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search, View, Delete } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance() as any;
interface TableItem {
    id: number;
    name: string;
    pic: string;
    type: string;
    address: string;
    mobile: string;
}
//搜索条件
const formInline = reactive({
    name: "",
});
//分页查询
const query = reactive({
    pageIndex: 1,
    pageSize: 10,
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);


// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    getData();
};

// 获取表格数据
const getData = () => {
    let params = {
        pageNum: query.pageIndex,
        name: formInline.name || "",
    };
    proxy.API.getExchangeList(params).then((res: any) => {
        tableData.value = res.data.result.result.map((item: object, index: number) => {
            return {
                ...item,
                sort: index + 1 + (res.data.result.page - 1) * 10,
            };
        });
        pageTotal.value = res.data.result.totalItems || 50;
    }).catch((err: any) => {
        console.log(err);
    });
};

const emit = defineEmits<{
    (event: "lookFn", val: any): void;
}>();
const lookDetail = (val: number) => {
    //查看详情
    emit("lookFn", val);
};
const delDetail = (val: number) => {
    ElMessageBox.confirm(
        '确定要删除吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            delExchangeInfo(val);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消操作',
            })
        })
}
//查询列表
const handleSearch = () => {
    getData();
}
//新增供应链详情
const handleCreate = () => {
    emit("lookFn", 1212);
}
//删除展览交流详情
const delExchangeInfo = (id: number) => {
    let params = {
        id,
    }
    proxy.API.delExchangeInfo(params).then((res: any) => {
        ElMessage({
            type: 'success',
            message: '删除成功',
        });
        getData();
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: '删除失败',
        });
    })
}
onMounted(() => {
    getData();
});
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

.red {
    color: #f56c6c !important
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 100px;
    height: 100px;
}

img {
    width: 80px;
    height: 80px;
}

.edit :deep(.el-table__cell) {
    display: flex;
}

.edit /deep/ .el-table td.el-table__cell div {
    display: flex;
}
</style>
  