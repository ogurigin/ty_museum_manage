<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="">
            <el-date-picker v-model="TrumInfo.timeArray" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="场馆名称">
            <el-select v-model="TrumInfo.name" placeholder="请选择" :teleported="false" filterable remote clearable
              :remote-method="sreachVenue" v-loadMore="moreVenue">
              <el-option v-for="item in Venueoptions" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
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
        <el-table-column prop="orderSerial" label="场馆名称" align="center"></el-table-column>
        <el-table-column prop="vipName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="vipDay" label="商品类型" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="售出数量" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="退货数量" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="微信收款" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="微信手续费" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="微信实收" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="商品总收入" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="商品实收总额" align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination  v-model:current-page="query.pageIndex"
          v-model:page-size="query.pageSize" :page-sizes="[10, 20, 50, 100]" :total="pageTotal"
          @current-change="handlePageChange" @size-change="handleSizeChange" background layout="->,total, sizes,prev, pager, next"></el-pagination>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted, getCurrentInstance } from "vue";
import { Search, Refresh, Download } from "@element-plus/icons-vue";
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
const activeName = ref<any>('first')
const TrumInfo = reactive<any>({
  timeArray: []
})
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(10);
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

// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData();
};
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  query.pageSize = val;
  getData();
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

const handleClick = (e: any) => {
   console.log('点击了');
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

const emit = defineEmits<{
  (event: "lookFn", val: any): void;
}>();

//查询列表
const handleSearch = () => {
  getData();
}
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
  