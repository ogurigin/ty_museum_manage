<template>
    <div class="handle-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="商品名称">
                <el-input v-model="formInline.name" placeholder="请输入商品名称" clearable />
            </el-form-item>
            <el-form-item label="所属场馆">
                <el-select v-model="formInline.name" placeholder="请选择" :teleported="false" filterable remote clearable
                    :remote-method="sreachVenue" v-loadMore="moreVenue">
                    <el-option v-for="item in Venueoptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品类型">
                <el-select v-model="formInline.name" placeholder="请选择商品类型" clearable>
                    <el-option label="全部" value="全部">全部</el-option>
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in typeOptions"
                        :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="销售模式">
                <el-select v-model="formInline.name" placeholder="请选择销售模式" clearable>
                    <el-option label="全部" value="全部">全部</el-option>
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in typeOptions"
                        :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formInline.name" placeholder="请选择状态" clearable>
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in typeOptions"
                        :key="item.id"></el-option>
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
        <el-table-column prop="name" label="商品名称" align="center" width="120"></el-table-column>
        <el-table-column prop="pic" label="商品主图" align="center" width="120">
            <template #default="scope">
                <el-image class="table-td-thumb" :src="scope.row.pic" :z-index="10" :preview-src-list="[scope.row.pic]"
                    preview-teleported>
                </el-image>
            </template>
        </el-table-column>
        <el-table-column prop="bwgName" label="所属场馆" align="center" width="120"></el-table-column>
        <el-table-column prop="bwgName" label="商品类型" align="center" width="120"></el-table-column>
        <el-table-column prop="bwgName" label="商品标签" width="200" align="center">
            <template #default="scope">
                <div v-for="item in scope.row.venueName">
                    <el-tag> {{ item.name }}</el-tag>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="number" label="剩余库存数量" align="center" width="120">
            <template v-slot="scope">
                {{ scope.row.number == 1 ? '1-50件' : '' }}
                {{ scope.row.number == 2 ? '51-100件' : '' }}
                {{ scope.row.number == 3 ? '101-150件' : '' }}
                {{ scope.row.number == 4 ? '151-200件' : '' }}
                {{ scope.row.number == 5 ? '200件以上' : '' }}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="结算价（底价）" align="center" width="120">
            <template v-slot="scope">
                {{ scope.row.type == 1 ? '历史文物' : '' }}
                {{ scope.row.type == 2 ? '人文艺术' : '' }}
                {{ scope.row.type == 3 ? '自然科学' : '' }}
                {{ scope.row.type == 4 ? '革命历史' : '' }}
                {{ scope.row.type == 5 ? '文明互鉴' : '' }}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="销售价" align="center" width="120">
            <template v-slot="scope">
                {{ scope.row.type == 1 ? '历史文物' : '' }}
                {{ scope.row.type == 2 ? '人文艺术' : '' }}
                {{ scope.row.type == 3 ? '自然科学' : '' }}
                {{ scope.row.type == 4 ? '革命历史' : '' }}
                {{ scope.row.type == 5 ? '文明互鉴' : '' }}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="划痕价" align="center" width="120">
            <template v-slot="scope">
                {{ scope.row.type == 1 ? '历史文物' : '' }}
                {{ scope.row.type == 2 ? '人文艺术' : '' }}
                {{ scope.row.type == 3 ? '自然科学' : '' }}
                {{ scope.row.type == 4 ? '革命历史' : '' }}
                {{ scope.row.type == 5 ? '文明互鉴' : '' }}
            </template>
        </el-table-column>
        <el-table-column prop="person" label="销量" align="center" width="120"></el-table-column>
        <el-table-column prop="person" label="售卖模式" align="center" width="120"></el-table-column>
        <el-table-column prop="person" label="结算模式" align="center" width="120"></el-table-column>
        <el-table-column prop="person" label="状态" align="center" width="120"></el-table-column>
        <el-table-column label="操作" width="240" align="center" class="edit" fixed="right">
            <template #default="scope">
                <el-button text :icon="View" class="green" @click="lookDetail(scope.row.id)">
                    查看详情
                </el-button>
                <el-button text :icon="View" class="green" @click="lookDetail(scope.row.id)">
                    置顶
                </el-button>
                <el-button text :icon="View" class="green" @click="lookDetail(scope.row.id)">
                    上架
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
import { ref, reactive, defineEmits, onMounted, getCurrentInstance } from "vue";
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
const Venueoptions = ref<any>([]);
//分页查询
const query = reactive({
    pageIndex: 1,
    pageSize: 10,
});
//场馆分页
const queryVenue = reactive({
    venueType: '',
    name: '',
    currentPage: 1,
    pageSize: 10,
    pageTotal: 1,
    finished: false
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const typeOptions = ref<any>([]);

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
//关联场馆加载更多
const sreachVenueTwo = () => {
    proxy.API.getVenueList({
        pageNum: queryVenue.currentPage,
        pageSize: queryVenue.pageSize,
        name: queryVenue.name || '',
        status: '0',
        venueType: queryVenue.venueType || '',
    }).then((res: any) => {
        if (res.data.result.result.length >= 0) {
            if (queryVenue.currentPage <= queryVenue.pageTotal) {
                const newOptions = res.data.result.result;
                queryVenue.pageTotal = res.data.result.pages;
                queryVenue.currentPage = res.data.result.page;
                Venueoptions.value = [...Venueoptions.value, ...newOptions];
            }
        }
    });
};
//触底加载更多场馆
const moreVenue = () => {
    // 防抖处理
    setTimeout(() => {
        if (queryVenue.currentPage >= queryVenue.pageTotal || queryVenue.finished) {
            return
        } else {
            queryVenue.currentPage += 1
            sreachVenueTwo()
        }
    }, 500)
}
//关联场馆筛选功能
const sreachVenue = (e: string) => {
    if (e) {
        queryVenue.name = e;
    } else {
        queryVenue.name = ''
    }
    queryVenue.currentPage = 1;
    proxy.API.getVenueList({
        pageNum: queryVenue.currentPage,
        pageSize: queryVenue.pageSize,
        name: queryVenue.name || '',
        status: '0',
        venueType: queryVenue.venueType || ''
    }).then((res: any) => {
        queryVenue.pageTotal = res.data.result.pages
        queryVenue.currentPage = res.data.result.page
        if (res.data.result.result.length >= 0) {
            Venueoptions.value = res.data.result.result
        }
    });
};
onMounted(() => {
    getData();
    sreachVenueTwo();
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
  