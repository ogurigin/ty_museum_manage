<template>
        <div class="container">
            <section class="jc">
                <section class="head">
                    <div class="lineBar"></div>
                    基础信息
                </section>
                <el-divider />
                <section class="infoWarp">
                    <section class="item">
                        <section class="itemItem">
                            <label>广告昵称:</label>
                            <p >{{ basicInfo.name }} </p>
                        </section>
                        <section class="itemItem">
                            <label>位置:</label>
                            <p >
                                {{ basicInfo.location == 1 ? '首页banner ' : '' }}
                                {{ basicInfo.location == 2 ? '首页腰封banner ' : '' }}
                                {{ basicInfo.location == 3 ? '我的页面banner ' : '' }}
                            </p>
                        </section>
                        <section class="itemItem">
                            <label>排序:</label>
                            <p>{{ basicInfo.sort }} </p>
                        </section>
                    </section>
                    <section class="item">
                        <section class="itemItem">
                            <label>数据来源:</label>
                            <p >{{ basicInfo.source == 0 ? '自建' : '用户' }} </p>
                        </section>
                        <section class="itemItem">
                            <label>广告类型:</label>
                            <p>
                                {{ basicInfo.adType == 0 ? '暂无' : '' }}
                                {{ basicInfo.adType == 1 ? '按天推广' : '' }}
                                {{ basicInfo.adType == 2 ? '按点击次数推广(CPC)' : '' }}
                                {{ basicInfo.adType == 3 ? '按成功预约推广(CPS)' : '' }}
                            </p>
                        </section>
                        <section class="itemItem">
                            <label>广告周期:</label>
                            <p>
                                <div v-if="basicInfo.adType == 1">
                                {{  getDaysFromSeconds(basicInfo.adCycle) }}天
                                </div>
                                <div v-else>
                                {{ basicInfo.adCycle }}次
                                </div>
                            </p>
                        </section>
                    </section>
                    <section class="item">
                        <section class="itemItem">
                            <label>剩余广告次数:</label>
                            <p >
                                <span v-if="basicInfo.adType == 1">
                                {{ getDaysFromSeconds(basicInfo.adResidualCycle) }}天
                                </span>
                                <span v-else>
                                {{ basicInfo.adResidualCycle }}次
                                </span>
                            </p>
                        </section>
                        <section class="itemItem">
                            <label>跳转链接:</label>
                            <p >{{ basicInfo.link }}</p>
                        </section>
                        <section class="itemItem">
                            <label>可见用户:</label>
                            <p> {{ basicInfo.visibility == 1 ? '不限' : '' }}
                                {{ basicInfo.visibility == 2 ? '登录用户' : '' }}</p>
                        </section>
                    </section>
                    <section class="item">
                        <section class="itemItem">
                            <label>状态:</label>
                            <el-select  v-model="basicInfo.status" value-key="status">
                                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </section>
                        <section class="itemItem">
                            <label>封面:</label>
                            <upload1 ref="upload"></upload1>
                            <!-- <img v-if="basicInfo.pic != null" :src="basicInfo.pic ? basicInfo.pic : ''" alt="" width="80px" height="80px" />
                            <img v-if="basicInfo.pic == null" src="" alt="" width="80px" height="80px" /> -->
                        </section>
                    </section>
                </section>
            </section>
            <section class="jc">
                <section class="head">
                    <div class="lineBar"></div>
                    购买记录:
                </section>
                <el-divider />
                <section class="infoWarp">
                    <el-table :data="tableData" border class="table"  header-cell-class-name="table-header">
                        <el-table-column prop="adClickCount" label="广告点击次数"></el-table-column>
                        <el-table-column prop="adPrebookCount" label="广告转化次数"></el-table-column>
                        <el-table-column  label="广告转化率">
                            <template #default="scope">
                                <span v-if="scope.row.adClickCount != 0">
                                    {{ (scope.row.adPrebookCount / scope.row.adClickCount * 100).toFixed(2) }}
                                </span>
                                <span v-else>
                                     0%
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- <div class="pagination">
                        <el-pagination
                            background
                            layout="->,total, prev, pager, next"
                            :current-page="query.currentPage"
                            :page-size="query.pageSize"
                            :total="pageTotal"
                            @current-change="handlePageChange"
                        ></el-pagination>
                    </div> -->
                </section>
            </section>
            <section class="footer">
                <el-button @click="cancal">取消</el-button>
                <el-button type="primary"  @click="onSubmit">确定</el-button>
            </section>
        </div>
</template>
<script setup lang='ts'>
import {ref,reactive,defineEmits,defineProps,defineExpose,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import upload1 from '@/components/upload1.vue';
const {proxy} = getCurrentInstance() as any;
const props = withDefaults(defineProps<{
    msg?:string,
    detailId?:number
}>(),{
    msg: '默认值',
    detailId:0
})
interface TableItem {
	adPrebookCount: string;
	adClickCount: string;
}
const router = useRouter();
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const basicInfo = ref({
    name:'',
    location:0,
    sort:0,
    source:0,
    adType:0,
    adCycle:0,
    adResidualCycle:0,
    link:'',
    visibility:1,
    status:1,
    pic:null
});
const statusList = ref([
    {
        value: 1,
        label: "上架中",
    },
    {
        value: 2,
        label: "已下架",
    },
    {
        value: 3,
        label: "已失效",
    },
])
const emit = defineEmits<{
        (event:'canFn'):void
    }>();
const query = reactive({
	currentPage: 1,
	pageSize: 10
});
const upload = ref<any>(null)
const getBannerInfo = () => {
    proxy.API.getBannerInfo({id:props.detailId}).then((res:any) => {
        if(res.data.success){
            basicInfo.value = res.data.result;
            let obj = {
                adPrebookCount:'',
                adClickCount:''
            };
            upload.value.returnImg(res.data.result.pic);
            obj.adClickCount = res.data.result.adPrebookCount
            obj.adPrebookCount = res.data.result.adClickCount
            tableData.value.push(obj)
        }
    })
}
// 分页导航
// const handlePageChange = (val: number) => {
// 	query.currentPage = val
//     getBannerInfo()
// };
const getDaysFromSeconds=(seconds:any) => {
    const secondsInADay = 24 * 60 * 60; // 一天的秒数
    const days = Math.floor(seconds / secondsInADay); // 计算整数天数
    return days;
}
const postBannerInfo  = () => {
  return new Promise((resolve, reject) => {
    proxy.API.postBannerInfo({
      status: basicInfo.value.status,
      id: props.detailId
    }).then((res:any) => {
      if (res.data.success) {
        resolve(res); // 异步操作成功，调用resolve并传递结果
      } else {
        reject(new Error(res.data.errors.message)); // 异步操作失败，调用reject并传递错误信息
      }
    }).catch((error:any) => {
      reject(error); // 捕获异常并调用reject
    });
  });
}
const postBannerList = () => {
  return new Promise((resolve, reject) => {
    basicInfo.value.pic = upload.value.uploadImg();
    proxy.API.postBannerList(basicInfo.value).then((res:any) => {
      if (res.data.success) {
        resolve(res); // 异步操作成功，调用resolve并传递结果
      } else {
        reject(new Error(res.data.errors.message)); // 异步操作失败，调用reject并传递错误信息
      }
    }).catch((error:any) => {
      reject(error); // 捕获异常并调用reject
    });
  });
}
const cancal = () => {
    emit('canFn')
}
const onSubmit = async () => {
    await postBannerInfo();
    await postBannerList();
    emit('canFn');
}
onMounted(() => {
    getBannerInfo()
    window.addEventListener('popstate', function () {
        router.push('./banner')
    }, true)
})
defineExpose({
    getBannerInfo
})
</script>
<style lang='less' scoped>
.jc{
    margin-bottom: 10px;
}
.head{
    padding-left: 15px;
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    .lineBar{
        position:absolute;
        top: 2px;
        left: 0px;
        height: 30px;
        border:3px solid rgba(102,153,255);
    }
}
.infoWarp{
    width: 100%;
    .item{
        padding: 10px 12.5%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        min-height:40px;
        line-height: 40px;
        overflow: hidden;
        .itemItem{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width:33.3%;
            height:auto;
            line-height: 40px;
            label{
                color:rgb(96, 98, 102);
                font-size: 16px;
                padding-right:10px;
                min-width: 80px;
            }
            p{
                font-size: 14px;
                color:rgb(96, 98, 102);  
            }
            img{
                width:80px;
                height:80px;
            }
        }
    }
}
</style>