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
                        <label>性别</label>
                        <p >{{ basicInfo.sex == 1? '男': '女' }}</p>
                    </section>
                    <section class="itemItem">
                        <label>手机号码</label>
                        <p >{{ basicInfo.mobile }}</p>
                    </section>
                </section>
                <section class="item">
                    <section class="itemItem">
                        <label>第一次登录时间</label>
                        <p >{{ basicInfo.createTime }}</p>
                    </section>
                    <section class="itemItem">
                        <label>用户类型</label>
                        <p >{{ basicInfo.showUserName }}</p>
                    </section>
                    <section class="itemItem">
                        <label>最近登录时间</label>
                        <p >{{basicInfo.useType == 1 ? '普通用户' : '会员用户' }}</p>
                    </section>
                </section>
                <section class="item">
                    <section class="itemItem">
                        <label>累计消费</label>
                        <p >{{ Amount }}</p>
                    </section>
                    <section class="itemItem">
                        <label>用户来源</label>
                        <p >{{ basicInfo.registerSrc }}</p>
                    </section>
                    <section class="itemItem">
                        <label>总预约次数</label>
                        <p >{{ yyNum}}</p>
                    </section>
                </section>
                <section class="item">
                    <section class="itemItem">
                        <label>状态</label>
                        <el-select  v-model="basicInfo.status" value-key="status">
                            <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                                :value="item.value">
                        </el-option>
                        </el-select>
                    </section>
                </section>
            </section>
        </section>
        <section class="jc">
            <section class="head">
                <div class="lineBar"></div>
                会员信息
            </section>
            <el-divider />
            <section class="infoWarp">
                <section class="item">
                    <section class="itemItem">
                        <label>到期时间</label>
                        <p >{{ moment(vipInfo.endTime).format("YYYY-MM-DD HH:mm") }} </p>
                    </section>
                    <section class="itemItem">
                        <label>购买次数</label>
                        <p >{{ vipInfo.renewTimes }}</p>
                    </section>
                    <section class="itemItem">
                        <label>上次购买时间</label>
                        <p >{{ moment(vipInfo.payTime).format("YYYY-MM-DD HH:mm") }} </p>
                    </section>
                </section>
                <section class="item">
                    <section class="itemItem">
                        <label>累计购买金额</label>
                        <p >{{ vipInfo.totalAmount }}</p>
                    </section>
                </section>
            </section>
        </section>
        <section class="jc">
            <section class="head">
                <div class="lineBar"></div>
                购买记录
            </section>
            <el-divider />
            <section class="infoWarp">
                <el-table :data="BuyTableData" border class="table"  header-cell-class-name="table-header">
                    <el-table-column prop="vipName" label="商品名称"></el-table-column>
                    <el-table-column prop="paidTime" label="时间"></el-table-column>
                    <el-table-column prop="vip" label="类型"></el-table-column>
                    <el-table-column prop="orderAmount" label="价格"></el-table-column>
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
        <section class="jc">
            <section class="head">
                <div class="lineBar"></div>
                预约记录
            </section>
            <el-divider />
            <section class="infoWarp">
                <el-table :data="BookTableData" border class="table"  header-cell-class-name="table-header">
                    <el-table-column prop="enterpriseName" label="场馆名称"></el-table-column>
                    <el-table-column prop="previewDate" label="参观日期"></el-table-column>
                    <el-table-column prop="periodName" label="参观时段"></el-table-column>
                    <el-table-column prop="quantity" label="参观人数"></el-table-column>
                    <el-table-column prop="useStatus" label="预约状态"></el-table-column>
			    </el-table>
                <div class="pagination">
				<el-pagination
					background
					layout="->,total, prev, pager, next"
					:current-page="query1.currentPage"
					:page-size="query1.pageSize"
					:total="pageTotal1"
					@current-change="handlePageChange1"
			    ></el-pagination>
		    </div>
            </section>
        </section>
        <section class="jc">
            <section class="head">
                <div class="lineBar"></div>
                用户动态
            </section>
            <el-divider />
            <section class="infoWarp">
                <el-table :data="TextTableData" border class="table"  header-cell-class-name="table-header">
                    <el-table-column prop="date" label="动态标题"></el-table-column>
                    <el-table-column prop="name" label="关联场馆"></el-table-column>
                    <el-table-column prop="address" label="浏览次数"></el-table-column>
                    <el-table-column prop="address" label="评论次数"></el-table-column>
                    <el-table-column prop="address" label="发布日期"></el-table-column>
			    </el-table>
                <div class="pagination">
				<el-pagination
					background
					layout="->,total, prev, pager, next"
					:current-page="query2.currentPage"
					:page-size="query2.pageSize"
					:total="pageTotal2"
					@current-change="handlePageChange2"
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
import {ref,reactive,defineProps,defineEmits,onBeforeMount} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import moment from "moment";
const {proxy} = getCurrentInstance() as any;
interface TableItem {
}
interface ChildProps{
    detailId:number
}
const basicInfo = ref({
    userNick:'',
    sex:0,
    mobile:'',
    createTime:'',
    showUserName:'',
    useType:1,
    registerSrc:'',
    user:'',
    loginTime:'',
    status:'1',
});
const router = useRouter();
const props = defineProps<ChildProps>();
const emit = defineEmits<{
        (event:'canFn'):void
    }>();
const BuyTableData = ref<TableItem[]>([
]);
const BookTableData = ref<TableItem[]>([]);
const TextTableData = ref<TableItem[]>([]);
const Amount = ref();
const pageTotal = ref(11);
const pageTotal1 = ref(0);
const pageTotal2 = ref(0);
const vipInfo = ref({
    endTime:'2020',
    renewTimes:'',
    payTime:'',
    totalAmount:''
});
const yyNum = ref(0) as any;
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
const query = reactive({
	currentPage: 1,
	pageSize: 10
});
const query1 = reactive({
	currentPage: 1,
	pageSize: 10
});
const query2 = reactive({
	currentPage: 1,
	pageSize: 10
});
const getDetail = ()=>{
    proxy.API.searchUserInfo(props.detailId).then((res:any) => {
        if(res.data.success){
            basicInfo.value = res.data.result;
            basicInfo.value.loginTime = moment(res.data.result.loginTime).format("YYYY-MM-DD HH:mm");
            basicInfo.value.createTime = moment(res.data.result.createTime).format("YYYY-MM-DD HH:mm");
           
        }else{
            ElMessage.error(res.data.errorMessage)
        }
    })
}
const searchVipInfo = () =>{
    proxy.API.searchUserVipInfo({
        id:props.detailId
    }).then((res:any) => {
        if(res.data.success){
            vipInfo.value = res.data.result.vipUser?res.data.result.vipUser:{} 
        }else{
            ElMessage.error(res.data.result.errorMessage)
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
const getUserBuyInfo = () => {
    proxy.API.getUserBuyInfo({
        pageNum: query.currentPage,
        pageSize : query.pageSize,
        id:props.detailId
    }).then((res:any)=>{
        if(res.data.success){
            BuyTableData.value =  res.data.result.result.map((item:any)=>{
            return{
              ...item,
              paidTime : moment(item.paidTime).format("YYYY-MM-DD HH:mm")
            }
          })
          query.currentPage = res.data.result.page;
          query.pageSize = res.data.result.pageSize;
          pageTotal.value = res.data.result.totalItems;
        }else{
            ElMessage.error(res.data.errorMessage)
        }
    })
}
const getUserBookInfo = () => {
    proxy.API.getUserBookInfo({
        page: query1.currentPage,
        pageSize : query1.pageSize,
        id:props.detailId
    }).then((res:any) => {
        if(res.data.success){
            yyNum.value = res.data.result.totalItems;
            BookTableData.value = res.data.result.result.map((item:any)=>{
            return{
              ...item,
              previewDate : moment(item.previewDate).format("YYYY-MM-DD"),
              useStatus : item.useStatus == 0 ? '未使用' : item.useStatus == 1 ? '已使用' : '已取消'
            };
          });
          query1.currentPage = res.data.result.page;
          query1.pageSize = res.data.result.pageSize;
          pageTotal1.value = res.data.result.totalItems;
        }else{
            ElMessage.error(res.data.errorMessage)
        }
    })
}
 //获取用户动态记录
const getUserTextInfo = () => {
     proxy.API.getUserTextInfo({
        id:props.detailId,
        page: query2.currentPage,
        pageSize : query2.pageSize,
     }).then((res:any) => {
        if(res.data.success){
            TextTableData.value = res.data.result.result;
            query2.currentPage = res.data.result.page;
            query2.pageSize = res.data.result.pageSize;
            pageTotal2.value = res.data.result.totalItems;
        }else{
            ElMessage.error(res.data.errorMessage)
        }
     })
      
}
const updateUserStatus  = () => {
    proxy.API.updateUserStatus({
        status: basicInfo.value.status,
        id: props.detailId
    }).then((res:any) => {
        if(res){
            console.log(res,'res')
            emit('canFn')
        }else{
            ElMessage.error(res.data.errorMessage)
        }
    }).catch((err:any) => {} ).finally( () => {
        emit('canFn')
    })
}
const cancal = () => {
    emit('canFn')
}
const onSubmit = () => {
    updateUserStatus()
}
// 分页导航
const handlePageChange = (val: number) => {
	query.currentPage = val
    getUserBuyInfo()
};
const handlePageChange1= (val: number) => {
	query1.currentPage = val
    getUserBookInfo()
};
const handlePageChange2 = (val: number) => {
	query2.currentPage = val
    getUserTextInfo()
};
onBeforeMount(() => {
    getDetail()
    searchVipInfo()
    searchUserAmount()
    getUserBuyInfo()
    getUserBookInfo()
    getUserTextInfo()
    window.addEventListener('popstate', function () {
        router.push('./userList')
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