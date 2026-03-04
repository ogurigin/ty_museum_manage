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
                        <label>用户名称</label>
                        <p >{{ basicInfo.userNick }}</p>
                    </section>
                    <section class="itemItem">
                        <label>入住时间</label>
                        <p >{{ basicInfo.entryDate }}</p>
                    </section>
                    <section class="itemItem">
                        <label>手机号码</label>
                        <p >{{ basicInfo.mobile }}</p>
                    </section>
                </section>
                <section class="item">
                    <section class="itemItem">
                        <label>第一次登陆时间</label>
                        <p >{{ moment(basicInfo.createTime).format("YYYY-MM-DD HH:mm") }}</p>
                    </section>
                    <section class="itemItem">
                        <label>最近登录时间</label>
                        <p > {{ moment(basicInfo.logintime).format("YYYY-MM-DD HH:mm") }}</p>
                    </section>
                    <section class="itemItem">
                        <label>会员类型</label>
                        <p >  {{ basicInfo.userType == 1 ? '普通用户' : '会员用户' }}</p>
                    </section>
                </section>
                <section class="item">
                    <section class="itemItem">
                        <label>累计消费</label>
                        <p >{{ Amount}}</p>
                    </section>
                    <section class="itemItem">
                        <label>用户来源</label>
                        <p >{{ basicInfo.registerSrc }}</p>
                    </section>
                    <section class="itemItem">
                        <label>推广中业务数量</label>
                        <p >{{ ywNumber }}</p>
                    </section>
                </section>
                <section class="item">
                    <section class="itemItem">
                        <label>状态</label>
                        <el-select v-model="basicInfo.status" value-key="status">
                            <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                    </section>
                </section>
            </section>
        </section>
        <section class="jc">
            <section class="head">
                <div class="lineBar"></div>
                推广业务
            </section>
            <el-divider />
            <section class="infoWarp">
                <el-table :data="businessData" border class="table"  header-cell-class-name="table-header">
                    <el-table-column prop="date" label="开始推广时间">
                        <template #default="scope">
                            {{ moment(scope.row.payTime).format("YYYY-MM-DD HH:mm") }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="type" label="业务类型">
                        <template #default="scope">
                            {{ scope.row.type == 1 ? '博物馆' : '' }}
                            {{ scope.row.type == 2 ? '展览' : '' }}
                            {{ scope.row.type == 3 ? '相关书籍' : '' }}
                            {{ scope.row.type == 4 ? '文创商品' : '' }}
                            </template>
                    </el-table-column>
                    <el-table-column prop="adType" label="推广类型">
                        <template #default="scope">
                            {{ scope.row.adType == 1 ? '按天推广' : '' }}
                            {{ scope.row.adType == 2 ? '按点击次数推广(CPC)' : '' }}
                            {{ scope.row.adType == 3 ? '按成功预约推广(CPS)' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="showcaseName" label="推广位置"></el-table-column>
                    <el-table-column prop="adCycle" label="推广周期">
                        <template #default="scope">
                            <div v-if="scope.row.adType == 1">
                            {{scope.row.adCycle }}天
                            </div>
                            <div v-else="scope.row.adType != 1">
                            {{ scope.row.adCycle }}次
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="adResidualCycle" label="剩余推广周期">
                        <template #default="scope">
                            <div v-if="scope.row.adType == 1">
                            {{ getDaysFromSeconds(scope.row.adResidualCycle) }}天
                            </div>
                            <div v-else="scope.row.adType != 1">
                            {{ scope.row.adResidualCycle }}次
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="adAmount" label="费用"></el-table-column>
			    </el-table>
                <div class="pagination">
				<el-pagination
					background
					layout="->,total, prev, pager, next"
					:current-page="query.currentPage"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
			    ></el-pagination>
		    </div>
            </section>
        </section>
        <section class="footer">
            <el-button @click="cancal">取消</el-button>
            <el-button type="primary"  @click="onSubmit">确定</el-button>
        </section>
    </div>
</template>
<script setup lang='ts'>
import {ref,reactive,defineEmits,defineProps,onBeforeMount} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import moment from "moment";
const {proxy} = getCurrentInstance() as any;
interface childProps {
    detailId:number
}
const props = defineProps<childProps>();
const basicInfo = ref({
    userNick:'',
    entryDate:'',
    mobile:'',
    createTime:'',
    showUserName:'',
    userType:1,
    registerSrc:'',
    logintime:'',
    status: '1',
});
const router = useRouter();
const ywNumber = ref(0) as any;
const statusList = ref([
    {
        value: 1,
        label: "激活",
    },
    {
        value: 2,
        label: "锁定",
    },
    {
        value: 3,
        label: "临时锁定",
    },
])
const pageTotal = ref(0);
const businessData = ref<any>([]);
const query = reactive({
	currentPage: 1,
	pageSize: 10
});
const Amount = ref(0);
const emit = defineEmits<{
        (event:'canFn'):void
    }>();
const  getDaysFromSeconds = (seconds:any) => {
      const secondsInADay = 24 * 60 * 60; // 一天的秒数
      const days = Math.floor(seconds / secondsInADay); // 计算整数天数
      return days;
}
const getLaunchList = () => {
    proxy.API.getLaunchList({
        id:props.detailId,
        pageNum: query.currentPage,
        pageSize: query.pageSize,
        status: 0,
        name: '',
        type: '',
        adType: '',
        showcaseId: ''
    }).then((res:any) => {
        if(res.data.success){
            const len = res.data.result.result.length
            console.log( len,'len' )
            ywNumber.value = len
            businessData.value = res.data.result.result
            console.log( businessData.value )
            query.currentPage = res.data.result.page;
            pageTotal.value = res.data.result.totalItems;
        }else{
            ElMessage.error(res.data.errorMessage)
        }
    })
}
const searchUserAmount =() => {
    proxy.API.searchUserAmount({
        id:props.detailId
    }).then((res:any) => {
        if(res.data.success){
            Amount.value = res.data.result   
        }else{
            ElMessage.error(res.data.result.errorMessage)
        }
    })
}
const getDetail = ()=>{
    proxy.API.searchUserInfo(props.detailId).then((res:any) => {
        if(res.data.success){
            basicInfo.value = res.data.result;
            basicInfo.value.logintime = moment(res.data.result.loginTime).format("YYYY-MM-DD HH:mm");
            basicInfo.value.createTime = moment(res.data.result.createTime).format("YYYY-MM-DD HH:mm");
           
        }else{
            ElMessage.error(res.data.errorMessage)
        }
    })
}
const updateUserStatus = async () => {
  try {
    const res = await proxy.API.updateUserStatus({
      status: basicInfo.value.status,
      id: props.detailId
    });
    if (res) {
      
    } else {
      ElMessage.error(res.data.errorMessage);
    }
  } catch (err) {
    emit('canFn');
    console.log(err);
  }
};
// 分页导航
const handlePageChange = (val: number) => {
    query.currentPage = val
    getLaunchList()
};
const cancal = () => {
    emit('canFn')
}
const onSubmit = () => {
    updateUserStatus()
}
onBeforeMount(() => {
    getDetail()
    getLaunchList()
    searchUserAmount()
    window.addEventListener('popstate', function () {
        router.push('./orgList')
    }, true)
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
        height:40px;
        line-height: 40px;
        overflow: hidden;
        .itemItem{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width:33.3%;
            height:40px;
            line-height: 40px;
            label{
                color:rgb(96, 98, 102);
                font-size: 16px;
                padding-right:10px;
            }
            p{
                font-size: 14px;
                color:rgb(96, 98, 102);  
            }
        }
    }
}
.footer{
    margin-bottom: 60px;
}
</style>