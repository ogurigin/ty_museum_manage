<template>
    <div class="container">
        <div class="handle-box">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="套餐名称">
                    <el-input v-model="formInline.name" placeholder="请输入套餐名称" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Plus" @click="Turn">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="sort" label="序号" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="套餐名称" align="center"></el-table-column>
            <el-table-column prop="day" label="天数" align="center"></el-table-column>
            <el-table-column prop="amount" label="金额" align="center"></el-table-column>
            <el-table-column prop="purchaseCount" label="购买数量" align="center"></el-table-column>
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
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, defineEmits, onBeforeMount } from "vue";
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
        pageSize: query.pageSize,
    };
    proxy.API.getMemberPack(params).then((res: any) => {
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
    (event: "open", val: any, id: any): void;
}>();
const lookDetail = (val: number) => {
    //查看详情
    emit("open", '会员详情', val);
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
            delMemberPackInfo(val);
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
//新增
const Turn = () => {
    emit("open", '新增会员', '');
}


const delMemberPackInfo = (id: number) => {
    let params = {
        id,
    }
    proxy.API.delMemberPackInfo(params).then((res: any) => {
        ElMessage({
            type: 'success',
            message: '删除成功',
        });
        getData();
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: '删除失败' + err,
        });
    })
}
onBeforeMount(() => {
    getData();
});
defineExpose({ getData })
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
    width: 40px;
    height: 40px;
}

img {
    width: 80px;
    height: 80px;
}
</style>
  