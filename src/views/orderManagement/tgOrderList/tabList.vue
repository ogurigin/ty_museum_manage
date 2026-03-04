<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="订单编号">
                        <el-input v-model="formInline.value" placeholder="请输入订单编号" clearable />
                    </el-form-item>
                    <el-form-item label="推广类型">
                        <el-select v-model="formInline.type" placeholder="请选择">
                            <el-option label="全部" value="">
                            </el-option>
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="sort" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="orderSerial" label="订单编号" align="center"></el-table-column>
                <el-table-column label="推广类型" align="center">
                    <template v-slot="scope">
                        {{ scope.row.promotionType == 1 ? '场馆' : '' }}
                        {{ scope.row.promotionType == 2 ? '展览' : '' }}
                        {{ scope.row.promotionType == 3 ? '文创商品' : '' }}
                        {{ scope.row.promotionType == 4 ? '相关书籍' : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="promotionName" label="推广名称" align="center"></el-table-column>
                <el-table-column label="推广模式" align="center">
                    <template v-slot="scope">
                        {{ scope.row.promotionAdType == 1 ? '按天推广' : '' }}
                        {{ scope.row.promotionAdType == 2 ? '按点击次数推广(CPC)' : '' }}
                        {{ scope.row.promotionAdType == 3 ? '按成功预约推广(CPS)' : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="showcaseName" label="推广位置" align="center"></el-table-column>
                <el-table-column prop="promotionAdCycle" label="推广周期" align="center">
                    <template v-slot="scope">
                        <div v-if="scope.row.promotionType == 1">
                            {{ scope.row.promotionAdCycle }}天
                        </div>
                        <div v-else-if="scope.row.promotionType != 1">
                            {{ scope.row.promotionAdCycle }}次
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="orderAmount" label="订单金额" align="center"></el-table-column>
                <el-table-column label="支付通道" align="center">
                    <template v-slot="scope">
                        {{ scope.row.payWay == 1 ? '微信' : '' }}
                        {{ scope.row.payWay == 2 ? 'alipaly' : '' }}
                        {{ scope.row.payWay == 3 ? '现金' : '' }}
                        {{ scope.row.payWay == 4 ? '余额' : '' }}
                        {{ scope.row.payWay == 5 ? '银联' : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="userMobile" label="用户手机号" align="center"></el-table-column>
                <el-table-column prop="paidTime" label="付款时间" align="center">
                    <template v-slot="scope">
                        {{ scope.row.paidTime != null ? moment(scope.row.paidTime).format("YYYY-MM-DD HH:mm") : '暂无' }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="订单状态" align="center">
                    <template v-slot="scope">
                        <el-tag :type="scope.row.status === 1
                            ? 'warning'
                            : scope.row.status === 2
                                ? 'success'
                                : ''
                            ">
                            {{ scope.row.status == 1 ? '待付款' : '已付款' }}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="->,total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
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
    value: '',
    type: ''
});
//分页查询
const query = reactive({
    pageIndex: 1,
    pageSize: 10,
});
const options = reactive([{
    label: '场馆',
    value: '1'
}, {
    label: '展览',
    value: '2'
}, {
    label: '文创商品',
    value: '3'
}, {
    label: '相关书籍',
    value: '4'
}],)

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
        pageSize: query.pageSize,
        id: formInline.value || '',
        type: formInline.type || ''
    };
    proxy.API.getTgDdList(params).then((res: any) => {
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

//查询列表
const handleSearch = () => {
    getData();
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

.edit :deep(.el-table__cell) {
    display: flex;
}

.edit /deep/ .el-table td.el-table__cell div {
    display: flex;
}
</style>
  