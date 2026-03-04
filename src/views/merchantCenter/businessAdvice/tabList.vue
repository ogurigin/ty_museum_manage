<template>
    <div class="container" v-scrollbar>
        <div class="handle-box">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="标题">
                    <el-input v-model="formInline.name" placeholder="请输入标题" clearable />
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
            <el-table-column prop="name" label="标题" align="center"></el-table-column>
            <el-table-column label="视频" align="center">
                <template v-slot="scope">
                    <video :src="scope.row.videoLink" controls autoplay class="video-player"
                        style="width: 200px;height: 100px;"></video>
                </template>
            </el-table-column>
            <el-table-column label="图片" align="center">
                <template v-slot="scope">
                    <el-image class="table-td-thumb" :src="scope.row.pic" :z-index="10" :preview-src-list="[scope.row.pic]"
                        preview-teleported>
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column prop="viewCount" label="点击数量" align="center">
            </el-table-column>
            <el-table-column prop="sort" label="顺序" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template v-slot="scope">
                    <el-tag :type="scope.row.status === 1
                        ? 'success'
                        : scope.row.status !== 1
                            ? 'danger'
                            : ''
                        ">
                        {{ scope.row.status == 1 ? '使用中' : '已禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="320" align="center" class="edit">
                <template #default="scope">
                    <el-button text :icon="Lock" class="green" @click="update(scope.row.id, scope.row.status)"
                        v-if="scope.row.status == 1">
                        禁用
                    </el-button>
                    <el-button text :icon="Unlock" class="green" @click="update(scope.row.id, scope.row.status)"
                        v-if="scope.row.status == 2">
                        启用
                    </el-button>
                    <el-button text :icon="Edit" class="green" @click="edit(scope.$index)">
                        查看详情
                    </el-button>
                    <el-button text :icon="Delete" class="green red" @click="del(scope.row.id)">
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
import { ref, reactive, defineEmits, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit, Plus, Search, Lock, Unlock, Delete } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance() as any;
//搜索条件
const formInline = reactive({
    name: "",
});
//分页查询
const query = reactive({
    pageIndex: 1,
    pageSize: 10,
});

const tableData = ref<any>([]);
const pageTotal = ref(0);

// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    getData();
};

onMounted(() => {
    getData();
});
// 获取表格数据
const getData = () => {
    let params = {
        pageNum: query.pageIndex,
        name: formInline.name || "",
        pageSize: query.pageSize,
    };
    proxy.API.getSuggetList(params).then((res: any) => {
        tableData.value = res.data.result.result;
        pageTotal.value = res.data.result.totalItems
    }).catch((err: any) => {
        console.log(err);
    });
};

const emit = defineEmits<{
    (event: "lookFn", val: any): void;
    (event: "open", val: any): void;
    (event: "assignment", val: any): void;
}>();
//新增
const Turn = () => {
    emit("open", '新增经营建议');
}
//编辑
const edit = (val: number) => {
    emit("open", '查看经营建议');
    emit("assignment", JSON.parse(JSON.stringify(tableData.value[val])))
}
//启用或禁用
const update = (id: any, stu: any) => {
    let text: any
    if (stu == 1) {
        text = '禁用'
    } else {
        text = '启用'
    }
    ElMessageBox.confirm(
        `确定${text}?`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            if (stu == 1) {
                stu = 2
            } else {
                stu = 1
            };
            PostUpDownSuggetInfo(id, stu);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: `取消${text}`,
            })
        })

}
const PostUpDownSuggetInfo = (id: any, stu: any) => {
    let text: any
    if (stu == 1) {
        text = '禁用'
    } else {
        text = '启用'
    }
    let params = {
        'id': id.toString(),
        'status': {
            'status': stu.toString()
        }
    };

    proxy.API.PostUpDownSuggetInfo(params).then((res: any) => {
        ElMessage({
            type: 'success',
            message: `${text}成功`,
        });
        getData();
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: `${text}失败`,
        });
    })
}

const del = (id: any) => {

    ElMessageBox.confirm(
        `确定删除?`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            DelUpDownSuggetInfo(id);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: `取消删除`,
            })
        })
}
const DelUpDownSuggetInfo = (id: any) => {
    let params = {
        'id': id.toString(),
    };

    proxy.API.DelUpDownSuggetInfo(params).then((res: any) => {
        ElMessage({
            type: 'success',
            message: `删除成功`,
        });
        getData();
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: `删除失败`,
        });
    })
}
//查询列表
const handleSearch = () => {
    getData();
}
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

:deep(.el-image__preview) {
    object-fit: cover !important;
}

// .edit :deep(.el-table__cell) {
//     display: flex;
// }

// .edit /deep/ .el-table td.el-table__cell div {
//     display: flex;
// }
</style>