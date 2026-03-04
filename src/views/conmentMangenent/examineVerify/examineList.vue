<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="内容标题">
                        <el-input v-model="query.name" placeholder="请输入内容标题" clearable />
                    </el-form-item>
                    <el-form-item label="用户登录账号">
                        <el-input v-model="query.account" placeholder="请输入用户登录账号" clearable />
                    </el-form-item>
                    <el-form-item label="发布开始时间">
                        <el-date-picker v-model="query.publishStartTime" type="date" placeholder="请选择发布开始时间" clearable />
                    </el-form-item>
                    <el-form-item label="发布结束时间">
                        <el-date-picker v-model="query.publishEndTime" type="date" placeholder="请选择发布结束时间" clearable />
                    </el-form-item>
                    <el-form-item label="内容状态">
                        <el-select v-model="query.status" placeholder="请选择内容状态" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="待审核" value="1" />
                            <el-option label="未通过" value="3" />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="场馆名称">
                        <el-select v-model="query.status" placeholder="请选择场馆名称" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="待审核" value="1" />
                            <el-option label="未通过" value="3" />
                        </el-select>
                        <el-input v-model="query.venueId" placeholder="请输入场馆名称" clearable />
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="内容审核" name="first">
                    <el-table :data="tableData" border class="table" ref="multipleTable"
                        header-cell-class-name="table-header">
                        <el-table-column prop="sort" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column prop="userNick" label="用户昵称" align="center"></el-table-column>
                        <el-table-column prop="userPhone" label="登录账号" align="center"></el-table-column>
                        <el-table-column prop="title" label="内容标题" align="center"></el-table-column>
                        <el-table-column prop="detail" label="内容详情" align="center"></el-table-column>
                        <el-table-column prop="pics" label="内容图片" align="center">
                            <template #default="scope">
                                <el-image class="table-td-thumb" :src="scope.row.pics" :z-index="10"
                                    :preview-src-list="[scope.row.pics]" preview-teleported>
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column prop="venueName" label="场馆名称" width="175" align="center">
                            <template #default="scope">
                                <div v-for="item in scope.row.venueName">
                                    <el-tag> {{ item.name }}</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="发布时间" align="center">
                            <template #default="scope">
                                {{ moment(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" align="center">
                            <template #default="scope">
                                <el-tag type="warning" v-if="scope.row.status == 1">待审核</el-tag>
                                <el-tag type="success" v-else-if="scope.row.status == 2">通过</el-tag>
                                <el-tag type="danger" v-else>未通过</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="220" align="center">
                            <template #default="scope">
                                <el-button text :icon="View" class="green" @click="lookDetail(scope.row.id, 0)">
                                    查看详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="审核评论" name="Second">
                    <el-table :data="tableData" border class="table" ref="multipleTable"
                        header-cell-class-name="table-header">
                        <el-table-column prop="sort" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column prop="userNick" label="评论用户昵称" align="center"></el-table-column>
                        <el-table-column prop="userPhone" label="登录账号" align="center"></el-table-column>
                        <el-table-column prop="replyUserNick" label="被评论用户昵称" align="center"></el-table-column>
                        <el-table-column prop="contentTitle" label="内容标题" align="center"></el-table-column>
                        <el-table-column prop="detail" label="内容详情" align="center"></el-table-column>
                        <el-table-column prop="detail" label="评论详情" align="center"></el-table-column>
                        <el-table-column prop="venueName" label="场馆名称" width="200" align="center">
                            <template #default="scope">
                                <div v-for="item in scope.row.venueName">
                                    <el-tag> {{ item.name }}</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="评论时间" width="150" align="center">
                            <template #default="scope">
                                {{ moment(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="评论状态" align="center">
                            <template #default="scope">
                                <el-tag type="warning" v-if="scope.row.status == 1">待审核</el-tag>
                                <el-tag type="success" v-else-if="scope.row.status == 2">通过</el-tag>
                                <el-tag type="danger" v-else>未通过</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="220" align="center">
                            <template #default="scope">
                                <el-button text :icon="View" class="green" @click="lookDetail(scope.row.id, 1,)">
                                    查看详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <div class="pagination">
                <el-pagination background layout="->,total, prev, pager, next" :current-page="query.currentPage"
                    :page-size="query.pageSize" :total="totalPage" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, onBeforeMount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { View, Search, } from '@element-plus/icons-vue';
import moment from "moment";
import type { TabsPaneContext } from 'element-plus'
const { proxy } = getCurrentInstance() as any;
interface TableItem {
    id: number;
    name: string;
    money: string;
    state: string;
    date: string;
    address: string;
}
const activeName = ref('first');
const formInline = reactive({
    user: '',
    date: ''
});
const query = reactive({
    name: '',
    account: '',
    publishStartTime: '',
    publishEndTime: '',
    status: '',
    currentPage: 1,
    pageSize: 5
});
const tableData = ref<TableItem[]>([]);
const totalPage = ref(0);
// 获取表格数据
const getData = () => {
    if (query.publishStartTime) {
        query.publishStartTime = moment(query.publishStartTime).format("YYYY-MM-DD")
    } else {
        query.publishStartTime = ''
    };
    if (query.publishStartTime) {
        query.publishEndTime = moment(query.publishEndTime).format("YYYY-MM-DD")
    } else {
        query.publishEndTime = ''
    }
    if (activeName.value == 'first') {
        proxy.API.getCheckList({
            name: query.name,
            account: query.account,
            publishStartTime: query.publishStartTime,
            publishEndTime: query.publishEndTime,
            status: query.status,
            pageNum: query.currentPage,
            pageSize: query.pageSize || 5,
        }).then((res: any) => {
            if (res.data.success) {
                let newTable = res.data.result.result;
                let count = 0; // 用于统计满足条件的 item 的总数

                if (newTable.length > 0) {
                    newTable.forEach((item: { sort: any; pics: string | null; venueIds: any; venueName: any; }, index: number) => {
                        item.sort = ((res.data.result.page - 1) * 10) + index + 1;
                        if (item.pics && item.pics !== null) {
                            item.pics = item.pics.split(',')[0];
                        }
                        if (item.venueIds !== null && item.venueIds.length > 0) {
                            count++;
                            item.venueIds = item.venueIds.split(',');
                            venueList(item.venueIds).then((result: any) => {
                                item.venueName = result;
                                count--; // 异步请求完成后，总数减一
                                if (count === 0) {
                                    // 所有异步请求完成后进行数据更新
                                    console.log(res.data.result);
                                    tableData.value = newTable;
                                    totalPage.value = res.data.result.totalItems;
                                }
                            });
                        } else {
                            if (count === 0) {
                                // 所有异步请求完成后进行数据更新
                                console.log(res.data.result);
                                tableData.value = newTable;
                                totalPage.value = res.data.result.totalItems;
                            }
                        }
                    });
                    // tableData.value = newTable;
                    // totalPage.value = res.data.result.totalItems;
                } else {
                    tableData.value = newTable;
                    totalPage.value = res.data.result.totalItems;
                }

            }
        });
    } else {
        proxy.API.getRemarkList({
            name: query.name,
            account: query.account,
            publishStartTime: query.publishStartTime,
            publishEndTime: query.publishEndTime,
            status: query.status,
            pageNum: query.currentPage,
            pageSize: query.pageSize || 5,
        }).then((res: any) => {
            if (res.data.success) {
                let newTable = res.data.result.result;
                let count = 0; // 用于统计满足条件的 item 的总数
                if (newTable.length > 0) {
                    newTable.forEach((item: { sort: any; pics: string | null; venueId: any; venueName: any; }, index: number) => {
                        item.sort = ((res.data.result.page - 1) * 10) + index + 1;
                        if (item.pics && item.pics !== null) {
                            item.pics = item.pics.split(',')[0];
                        }
                        if (item.venueId !== null && item.venueId.length > 0) {
                            count++;
                            item.venueId = item.venueId.split(',');
                            venueList(item.venueId).then((result: any) => {
                                item.venueName = result;
                                count--; // 异步请求完成后，总数减一
                                if (count === 0) {
                                    // 所有异步请求完成后进行数据更新
                                    console.log(res.data.result);
                                    tableData.value = newTable;
                                    totalPage.value = res.data.result.totalItems;
                                }
                            });
                        }else {
                            if (count === 0) {
                                // 所有异步请求完成后进行数据更新
                                console.log(res.data.result);
                                tableData.value = newTable;
                                totalPage.value = res.data.result.totalItems;
                            }
                        }
                    });
                } else {
                    tableData.value = newTable;
                    totalPage.value = res.data.result.totalItems;
                }


            }
        });
    }
};
onBeforeMount(() => {
    getData();
})
const emit = defineEmits<{
    (event: 'open', val: string, id: any): void
}>()
const handleClick = (tab: TabsPaneContext, event: Event) => {
    if (activeName.value == 'first') {
        activeName.value = 'Second'
    } else {
        activeName.value = 'first'
    };
    tableData.value = [];
    console.log(activeName.value);
    query.currentPage = 1;
    getData();
};
// 查询操作
const handleSearch = () => {
    query.currentPage = 1;
    getData();
};
// 分页导航
const handlePageChange = (val: number) => {
    query.currentPage = val;
    getData();
};
const lookDetail = (val: object, num: number) => {
    if (num == 0) {
        emit('open', '审核内容', val)
    } else {
        emit('open', '审核评论', val)
    }
}
const venueList = (list: any) => {
    return new Promise((resolve, reject) => {
        let vueneList = [];
        let promises = list.map((id: any) => {
            return new Promise((resolve, reject) => {
                proxy.API.getVenueInfo({
                    id: id
                }).then((res: any) => {
                    resolve({
                        name: res.data.result.name
                    });
                }).catch((err: any) => {
                    reject(err);
                });
            });
        });

        Promise.all(promises).then((results) => {
            vueneList = results;
            console.log(vueneList, 've');

            resolve(vueneList);
        }).catch((err) => {
            // 返回一个空数组或者其他默认值，根据实际需求进行处理
            resolve([]);
        });
    });
}
defineExpose({ handleSearch })
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

.green {
    color: rgba(22, 155, 213);
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
    width: 100px;
    height: 100px;
}

:deep(.el-table td.el-table__cell div) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    /* 控制显示的行数 */
}
</style>