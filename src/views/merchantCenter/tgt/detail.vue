<template>
    <div>
        <div class="container">
            <div class="form">
                <el-form :inline="true" class="demo-form-inline" style="flex-wrap: wrap;">
                    <el-form-item label="推广名称：">
                        {{ Info.name }}
                    </el-form-item>
                    <el-form-item label="可推广位置：">
                        <div v-for="(item, index) in Info.location" :key="index">
                            {{ item.showcaseName + ',' }}
                        </div>
                    </el-form-item>
                    <el-form-item label="推广类型：">
                        <div v-if="Info.adType == 1">按天数推广</div>
                        <div v-if="Info.adType == 2">按点击次数推广(cpc)</div>
                        <div v-if="Info.adType == 3">按成功预约推广(CPS)</div>
                    </el-form-item>
                    <el-form-item label="推广数量/金额：">
                        <div v-for="subItem in Info.data" :key="subItem.id" style="display: flex !important;">
                            {{ subItem.adCycle }}<span v-if="Info.adType == 1">天</span>
                            <span v-if="Info.adType != 1">次</span> /￥{{ subItem.adAmount
                            }}&nbsp;,&nbsp;
                        </div>
                    </el-form-item>
                    <el-form-item label="总付费商家数量：">
                        {{ Info.payCount }}
                    </el-form-item>
                    <el-form-item label="总到期商家数量：">
                        {{ Info.expireCount }}
                    </el-form-item>
                </el-form>
            </div>
            <div class="form">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="商家名称">
                        <el-input v-model="SearchInfo.entityName" placeholder="请输入商家名称"></el-input>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input v-model="SearchInfo.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="SearchInfo.userPhone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="付款时间">
                        <el-date-picker v-model="SearchInfo.payTime" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="推广位置">
                        <el-select v-model="SearchInfo.showcaseId" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchInfo">搜索</el-button>
                        <el-button type="primary" @click="back">返回</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane :label="item" :name="Info.data[index].id.toString()" v-for="(item, index) in Info.content"
                    :key="index"></el-tab-pane>
            </el-tabs>
            <div class="table">
                <el-table :data="tableData" style="width: 100%" class="table" ref="multipleTable"
                    header-cell-class-name="table-header">
                    <el-table-column align="center" prop="sort" label="序号">
                    </el-table-column>
                    <el-table-column align="center" prop="name" label="商家名称">
                    </el-table-column>
                    <el-table-column align="center" prop="entityName" label="名称">
                    </el-table-column>
                    <el-table-column align="center" prop="userPhone" label="手机号码">
                    </el-table-column>
                    <el-table-column align="center" prop="name" label="推广数量/金额">
                        <template v-slot="scope">
                            <div>
                                {{ scope.row.adCycle }}<span v-if="scope.row.adType == 1">天</span>
                                <span v-if="scope.row.adType != 1">次</span> /￥{{ scope.row.adAmount
                                }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="showcaseName" label="推广位置">
                    </el-table-column>
                    <el-table-column align="center" prop="payTime" label="付款时间">
                        <template v-slot="scope">
                            {{ moment(scope.row.payTime).format("YYYY-MM-DD HH:mm") }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="adResidualCycle" label="剩余">
                        <template v-slot="scope">
                            <div v-if="scope.row.adType == 1">
                                {{ getDaysFromSeconds(scope.row.adResidualCycle) }}天
                            </div>
                            <div v-else-if="scope.row.adType != 1">
                                {{ scope.row.adResidualCycle }}次
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="adClickCount" label="点击次数">
                    </el-table-column>
                    <el-table-column align="center" prop="adPrebookCount" label="预约次数">
                    </el-table-column>
                    <el-table-column align="center" label="转化率">
                        <template v-slot="scope">
                            <span v-if="scope.row.adClickCount != 0 && scope.row.adType == 2">
                                {{ (scope.row.adPrebookCount / scope.row.adClickCount * 100).toFixed(2) }}%
                            </span>
                            <span v-else-if="scope.row.adClickCount != 0 && scope.row.adType == 1">
                                {{ (scope.row.adPrebookCount / scope.row.adClickCount * 100).toFixed(2) }}%
                            </span>
                            <span v-else-if="scope.row.adClickCount != 0 && scope.row.adType == 3">
                                {{ (scope.row.adPrebookCount / scope.row.adClickCount * 100).toFixed(2) }}%
                            </span>
                            <span v-else>
                                0%
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template v-slot="scope">
                            <div>
                                <el-tag :type="scope.row.status === 1
                                    ? 'success'
                                    : scope.row.state === 2
                                        ? 'danger'
                                        :
                                        scope.row.state === 3
                                            ? 'info'
                                            : ''
                                    ">
                                    {{ scope.row.status == 1 ? '上架中' : scope.row.status == 2 ? '已下架' : '已失效' }}
                                </el-tag>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination background layout="->,total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import moment from "moment";
const { proxy } = getCurrentInstance() as any;
const props = defineProps({
    msg: <any>({}),
})
interface Info {
    name: string,
    location: any,
    adType: any,
    data: any,
    payCount: any,
    expireCount: any
    content: any
}
interface SearchInfo {
    name: string,
    entityName: any,
    userPhone: any,
    payTime: any,
    showcaseId: any,
}
const Info = reactive<Info>({
    name: "",
    location: [],
    adType: '',
    data: [],
    payCount: 0,
    expireCount: 0,
    content: ''
});
const SearchInfo = reactive<SearchInfo>({
    name: '',
    entityName: '',
    userPhone: '',
    payTime: '',
    showcaseId: '',
})
//分页查询
const query = reactive({
    pageIndex: 1,
    pageSize: 10,
});

const tableData = ref<any>([]);
const pageTotal = ref(0);
const activeName = ref<any>(0);
const options = reactive<any>([]);


const emit = defineEmits<{
    (event: "lookFn", val: any): void;
    (event: "open", val: any): void;
    (event: "assignment", val: any): void;
}>();

const lookDetail = (val: number) => {
    //查看详情
    emit("lookFn", val);
};
const back = () => {
    emit("lookFn", null);
}

// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    getData('');
};

//转换时间
const getDaysFromSeconds = (seconds: number) => {
    const secondsInADay = 24 * 60 * 60; // 一天的秒数
    const days = Math.floor(seconds / secondsInADay); // 计算整数天数
    return days;
}

//查询列表
const searchInfo = () => {
    getData(activeName.value);
}

//更换时查询列表
const handleClick = (e: any) => {
    activeName.value = e.props.name
    getData(activeName.value);
}

//查询推广详情列表
const getData = (id: any) => {
    let payStartTime;
    let payEndTime;
    if (SearchInfo.payTime) {
        // payStartTime = moment(SearchInfo.payTime).format('YYYY-MM-DD');
        // payEndTime = moment(SearchInfo.payTime).format('YYYY-MM-DD')
    } else {
        payStartTime = '';
        payEndTime = '';
    }
    let params = {
        promotionMealId: id || '',
        pageNum: query.pageIndex,
        pageSize: query.pageSize,
        venueName: SearchInfo.entityName || '',
        name: SearchInfo.name || '',
        showcaseId: SearchInfo.showcaseId || 0,
        phone: SearchInfo.userPhone.toString() || '',
        payStartTime: payStartTime || '',
        payEndTime: payEndTime || '',
    };
    proxy.API.getTgtInfo(params).then((res: any) => {
        console.log(res);
        let newtableData = res.data.result.result.map((item: any, index: number) => {
            return {
                ...item,
                sort: index + 1
            }
        });
        tableData.value = newtableData;
        pageTotal.value = res.data.result.totalItems
    }).catch((err: any) => {
        console.log(err);
    });
};
onMounted(() => {
    //   getTabs();
    if (props.msg != 0) {
        //推广位置
        let newlist = props.msg;
        let content = [] as any;
        let newoptions = newlist.location.map((item: any) => {
            return {
                value: item.showcaseId,
                label: item.showcaseName
            }
        })
        Object.assign(options, newoptions);

        for (let i = 0; i < newlist.data.length; i++) {
            if (newlist.data[i].adType === 1) {
                content.push(newlist.data[i].adCycle + '天/' + '￥' + newlist.data[i].adAmount);
            } else {
                content.push(newlist.data[i].adCycle + '天/' + '￥' + newlist.data[i].adAmount);
            }
        }

        newlist.content = content
        Object.assign(Info, newlist)
        activeName.value = Info.data[0].id.toString();
    };
    getData(Info.data[0].id);
});
</script>

<style lang = "less" scoped>
.form {
    background: #fff;
    height: auto;
    padding-top: 10px;
    padding-left: 20px;
    margin: 20px 0;
    box-shadow: 0px 0px 3px #eee;
    display: flex;
    align-items: center;
}

.switch {
    margin-bottom: 40px;

    .el-button-group {
        border: 1px solid #eee;

        .el-button {
            margin: 0;
            border: 0;
            border-radius: 0;
        }

        .el-button--default {
            color: #999;
        }
    }
}

.el-table {
    img {
        width: 150px;
        height: 150px;
    }
}

.demo-form-inline {
    display: flex;
    align-items: center;
}

.el-form--inline .el-form-item {
    margin-right: 40px
}

.el-form--inline .el-form-item,
.el-form--inline .el-form-item__content {
    display: flex;
}

.el-form-item /deep/ .el-form-item__content {
    display: flex !important;
    flex-wrap: nowrap;
}

/deep/ .el-form-item__label {
    min-width: 70px;
}
</style>