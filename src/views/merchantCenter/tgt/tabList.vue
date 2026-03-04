<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="推广名称">
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
                <el-table-column prop="name" label="推广模式名称" align="center"></el-table-column>
                <el-table-column label="可推广位置" align="center">
                    <template v-slot="scope">
                        <div v-for="(subItem, index) in scope.row.location" :key="index">
                            {{ subItem.showcaseName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="bwgName" label="推广类型" align="center">
                    <template v-slot="scope">
                        <div v-if="scope.row.adType === 1">按天数推广</div>
                        <div v-if="scope.row.adType == 2">按点击次数推广(cpc)</div>
                        <div v-if="scope.row.adType == 3">按成功预约推广(CPS)</div>
                    </template>
                </el-table-column>
                <el-table-column prop="bwgName" label="推广数量/金额" align="center">
                    <template v-slot="scope">
                        <div v-for="subItem in scope.row.data" :key="subItem.id">
                            {{ subItem.adCycle }}<span v-if="scope.row.adType == 1">天</span>
                            <span v-if="scope.row.adType != 1">次</span> /￥{{ subItem.adAmount
                            }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="payCount" label="总付费商家数量" align="center"></el-table-column>
                <el-table-column prop="expireCount" label="总到期商家数量" align="center"></el-table-column>
                <el-table-column prop="bwgName" label="状态" align="center">
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
                <el-table-column label="操作" width="240" align="center" class="edit">
                    <template #default="scope">
                        <el-button text :icon="Edit" class="green" @click="edit(scope.$index)">
                            编辑
                        </el-button>
                        <el-button text :icon="View" class="green" @click="lookDetail(scope.$index)">
                            查看详情
                        </el-button>
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
import { Edit, Plus, Search, View } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance() as any;

//搜索条件
const formInline = reactive({
    name: "",
});
//分页查询
const query = reactive({
    pageIndex: 1,
    pageSize: 99,
});

const tableData = ref<any>([]);
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
        // pageSize: this.pageSize,
    };
    proxy.API.getTgtPackList(params).then((res: any) => {
        const resultArray = res.data.result.result;
        const mergedData = Object.values(resultArray.reduce((acc: any, item: any) => {
            const type = item.promotionMeal.adType;
            if (!acc[type]) {
                acc[type] = {
                    name: item.promotionMeal.name,
                    adType: item.promotionMeal.adType,
                    data: [{
                        id: item.promotionMeal.id,
                        adCycle: item.promotionMeal.adCycle,
                        adAmount: item.promotionMeal.adAmount,
                    }],
                    payCount: 0,
                    expireCount: 0,
                    location: item.locations,
                    status: item.promotionMeal.status
                };
            } else {
                acc[type].data.push({
                    id: item.promotionMeal.id,
                    adCycle: item.promotionMeal.adCycle,
                    adAmount: item.promotionMeal.adAmount,
                });
                let uniqueObjects: any = [];
                acc[type].location.forEach((obj1: any) => {
                    if (!uniqueObjects.some((obj: any) => obj.showcaseName === obj1.showcaseName)) {
                        uniqueObjects.push(obj1);
                    }
                });
                item.locations.forEach((obj2: any) => {
                    if (!uniqueObjects.some((obj: any) => obj.showcaseName === obj2.showcaseName)) {
                        uniqueObjects.push(obj2);
                    }
                });
                acc[type].location = JSON.parse(JSON.stringify(uniqueObjects));
                acc[type].payCount += item.promotionMeal.payCount;
                acc[type].expireCount += item.promotionMeal.expireCount;
            }
            return acc;
        }, {}));
        tableData.value = mergedData;
        pageTotal.value = res.data.result.totalItems || 50;
    }).catch((err: any) => {
        console.log(err);
    });
};

const emit = defineEmits<{
    (event: "lookFn", val: any): void;
    (event: "open", val: any): void;
    (event: "assignment", val: any): void;
}>();
const lookDetail = (val: number) => {
    console.log(tableData.value[val]);

    //查看详情
    emit("lookFn", tableData.value[val]);
};
//新增
const Turn = () => {
    emit("open", '添加推广');
}
//编辑
const edit = (val: number) => {
    emit("open", '编辑推广');
    emit("assignment", JSON.parse(JSON.stringify(tableData.value[val])))
}
//查询列表
const handleSearch = () => {
    getData();
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