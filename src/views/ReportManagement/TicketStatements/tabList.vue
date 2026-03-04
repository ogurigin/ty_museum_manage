<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="">
            <el-date-picker v-model="TrumInfo.timeArray" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="售票渠道">
            <el-input v-model="formInline.value" placeholder="请输入订单编号" clearable />
          </el-form-item>
          <el-form-item label="门票名称">
            <el-input v-model="formInline.value" placeholder="请输入订单编号" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" :icon="Refresh" @click="handleSearch">重置</el-button>
            <el-button type="primary" :icon="Download" @click="handleSearch">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="今日" name="first"></el-tab-pane>
        <el-tab-pane label="过去七天" name="second"></el-tab-pane>
        <el-tab-pane label="过去三十天" name="third"></el-tab-pane>
      </el-tabs>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="sort" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="orderSerial" label="购票渠道" align="center"></el-table-column>
        <el-table-column prop="vipName" label="售票渠道（场馆名称）" align="center"></el-table-column>
        <el-table-column prop="vipDay" label="门票名称" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="售票数量" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="未检票数量" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="已检票数量" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="退票数量" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="未检过期数量" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="核销检票入园人数" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="微信已核销金额" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="微信退款金额" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="微信收款金额" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="微信总金额" align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="->,total,sizes, prev, pager, next,jumper" :current-page="query.pageIndex"
          :page-size="query.pageSize" :total="pageTotal" :page-sizes="[10, 20, 50, 100]" @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted, getCurrentInstance } from "vue";
import { Search,Refresh,Download } from "@element-plus/icons-vue";
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
  value: "",
});
//分页查询
const query = reactive({
  pageIndex: 1,
  pageSize: 10,
});
const activeName = ref<any>('first')
const TrumInfo =reactive<any>({
  timeArray:[]
})
const tableData = ref<TableItem[]>([]);
// 表格数据
const pageTotal = ref(10);
// 快捷时间范围
const shortcuts = [
    {
        text: '上周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '上个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '上三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]

// 改变页码
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData();
};
// 改变每页条数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  query.pageSize = val;
  getData();
}

const handleClick = () => {
  console.log('1111');
}
// 获取表格数据
const getData = () => {
  let params = {
    pageNum: query.pageIndex,
    pageSize: query.pageSize,
    id: formInline.value || '',
    // pageSize: this.pageSize,
  };

  proxy.API.getvipDdList(params).then((res: any) => {
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

// 查询
const emit = defineEmits<{
  (event: "lookFn", val: any): void;
}>();

//查询列表
const handleSearch = () => {
  getData();
}

// 导出
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

// .edit :deep(.el-table__cell) {
//   display: flex;
// }

// .edit /deep/ .el-table td.el-table__cell div {
//   display: flex;
// }
</style>
  