<template>
    <div class="handle-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="合集名称">
                <el-input v-model="formInline.name" placeholder="请输入合集名称" clearable />
            </el-form-item>
            <!-- <el-form-item label="关联展览">
                <el-select v-model="formInline.exchange" class="m-2" placeholder="请选择关联展览">
                    <el-option label="全部" value="0"></el-option>
                    <el-option v-for="item in exchangeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="状态">
                <el-select v-model="formInline.status" class="m-2" placeholder="请选择状态">
                    <el-option label="正常" value="0"></el-option>
                    <el-option label="禁用" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="点击量">
                <el-select v-model="formInline.numOrder" class="m-2" placeholder="请选择点击量">
                    <el-option label="顺序" value="2"></el-option>
                    <el-option label="倒序" value="1"></el-option>
                </el-select>
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
        <el-table-column prop="pic" label="音频图片" align="center">
            <template #default="scope">
                <el-image class="table-td-thumb" :src="scope.row.pic" :z-index="10" :preview-src-list="[scope.row.pic]"
                    preview-teleported>
                </el-image>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="合集名称" align="center"></el-table-column>
        <el-table-column prop="associationName" label="关联" align="center"></el-table-column>
        <!-- <el-table-column prop="number" label="合集数量" align="center">
            <template v-slot="scope">
                {{ scope.row.number == 1 ? '1-50件' : '' }}
                {{ scope.row.number == 2 ? '51-100件' : '' }}
                {{ scope.row.number == 3 ? '101-150件' : '' }}
                {{ scope.row.number == 4 ? '151-200件' : '' }}
                {{ scope.row.number == 5 ? '200件以上' : '' }}

            </template>
        </el-table-column> -->
        <el-table-column prop="clickCount" label="点击量" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" align="center">
            <template v-slot="scope">
                {{ scope.row.updateTime ? moment(scope.row.updateTime).format("YYYY-MM-DD HH:mm") : '-' }}
            </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
            <template #default="scope">
                <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
                <el-tag type="danger" v-else-if="scope.row.status == 1">禁用</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="320" align="center" class="edit">
            <template #default="scope">
                <el-button text :icon="Lock" class="red" @click="close(scope.row.id, 1)" v-if="scope.row.status == 0">
                    禁用
                </el-button>
                <el-button text :icon="Unlock" class="green" @click="open(scope.row.id, 0)" v-else>
                    启用
                </el-button>
                <el-button text :icon="View" class="green" @click="lookDetail(scope.row.id)">
                    编辑
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
import { Plus, Search, View, Delete,Lock,Unlock } from "@element-plus/icons-vue";
import moment from "moment";
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
    status: '0',
    numOrder: '2',
});
//分页查询
const query = reactive({
    pageIndex: 1,
    pageSize: 10,
});
//搜索框数组

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);


// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    getData();
};

// 获取表格数据
const getData = () => {
    const params = {
        pageNum: query.pageIndex,
        pageSize: query.pageSize,
        name: formInline.name || '',
        status: formInline.status,
        numOrder: formInline.numOrder,
    };
    proxy.API.getMusicList(params)
        .then((res: any) => {
            let data = res.data.result.result.map((item: object, index: number) => {
                return {
                    ...item,
                    sort: index + 1 + (res.data.result.page - 1) * 10,
                };
            });

            if (formInline.numOrder === '1') {
                data = data.sort((a: any, b: any) => b.sort - a.sort);
            }

            tableData.value = data;
            pageTotal.value = res.data.result.totalItems || 50;
        })
        .catch((err: any) => {
            console.log(err);
        });
};

const emit = defineEmits<{
    (event: "lookFn", val: any): void;
    (event: "add",): void;
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
            delMusicInfo(val);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消操作',
            })
        })
}
const open = (val: number,num:any) => {
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
            update(val,num);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消操作',
            })
        })
}
const close = (val: number,num:any) => {
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
            update(val,num);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消操作',
            })
        })
};
const update = (id:number,status:any) =>{
	proxy.API.updateMusicInfo({
        status:status,
        id:id
    }).then((res:any) => {
        if(res.data.success){
            getData();
            ElMessage.success('更新成功!')
        }
    })
}
//查询列表
const handleSearch = () => {
    getData();
}
//新增供应链详情
const handleCreate = () => {
    emit("add");
}
//删除展览交流详情
const delMusicInfo = (id: number) => {
    let params = {
        id,
    }
    proxy.API.delMusicInfo(params).then((res: any) => {
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
defineExpose({ handleSearch })
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
  