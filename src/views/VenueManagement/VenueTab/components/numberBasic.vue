<template>
    <div style="display: flex;">
        <el-input v-model="query.name" placeholder="请输入数字展名称" style="width: 400px;"/>
        <el-button type="primary" :icon="Search" @click="searchZL" style="margin-left: 40px;">搜索</el-button>
    </div>
    <div class="exhibitCont">
        <section class="itemCont" v-for="(item,index) in szList" :key="index" @click="openInfo(item)">
            <div class="imgCont">
                <div class="covImg">
                    <img v-if="item.pics && item.pics != null" :src="item.pic[0]" alt="底图">
                    <img v-else src="@/assets/img/loginBg.jpg" alt="底图">
                </div>
                <div class="typeImg">
                    <img v-if="item.status == 1 ? true:false" src="@/assets/img/zhanlan.png" alt="">
                    <img v-else-if="item.status == 2 ? true:false" src="@/assets/img/xiajia.png" alt="">
                    <img v-else-if="item.status == 0 ? true:false" src="@/assets/img/guoqi.png" alt="">
                </div>
                <div class="footer">
                    <span class="clickNum">点击量{{ item.clickCount }}</span>
                    <section class="action">
                        <span class="downLow" @click.stop="upperOrDown(item.id,item.status)">{{ item.status == 1 ? '下架' : '上架' }}</span>
                        <span class="line"></span>
                        <span class="dele" @click.stop="delTrumDigInfo(item.id)">删除</span>
                    </section>
                </div>
            </div>
            <div class="cardName"> {{ item.name }} </div>
        </section>
        <section class="itemCont add" @click="add">+创建展览</section>
    </div>
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
</template>
<script setup lang='ts'>
import { ElMessage} from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import {ref,defineEmits,defineProps,defineExpose,onMounted} from 'vue';
import { useRouter } from 'vue-router';
const {proxy} = getCurrentInstance() as any;
const props = defineProps<{
    detailId:number
}>()
const szList = ref<any>([])
const query = reactive({
	currentPage: 1,
	pageSize: 10,
    name:''
});
const pageTotal = ref(0);
const router = useRouter();
const emit = defineEmits<{
    (event:'newAdd'):void
    (event:'updateInfo',{}):void,
}>()
const searchZL = () =>{
    query.currentPage = 1;
    getTrumDigList();
}
const getTrumDigList = () => {
    proxy.API.getTrumDigList({
        pageNum:query.currentPage,
        pageSize:query.pageSize,
        name:query.name,
        id:props.detailId
    }).then((res:any) => {
        if(res.data.success){
            let newArray = res.data.result.result.map((item:any) => {
            return {
              ...item,
              pic: item.pics.split(",")
            }
          })
          pageTotal.value = res.data.result.totalItems
          szList.value = newArray;
        }
    })
}
const ChangeTrumDigInfo = (id:number,status:number) => {
    proxy.API.ChangeTrumDigInfo({
        status:status,
        id:id
    }).then((res:any) => {
        if(res.data.success){
            getTrumDigList()
            ElMessage.success('更新成功!')
        }
    })
}
const upperOrDown = (id:number,status:number) => {
    if(status == 1){
        ChangeTrumDigInfo(id,2)
    }else if(status == 2){
        ChangeTrumDigInfo(id,1)
    }
}
const delTrumDigInfo = (id:number) => {
    proxy.API.delTrumDigInfo({id:id}).then((res:any)=> {
        if(res.data.success){
            getTrumDigList()
            ElMessage.success('删除成功!')
        }
    })
}
const add = () => {
    emit('newAdd')
}
// 分页导航
const handlePageChange = (val: number) => {
	query.currentPage = val;
    getTrumDigList()
};
const openInfo = (info:any) =>{
    emit('updateInfo',info)
}
onMounted(() => {
    getTrumDigList()
    window.addEventListener('popstate', function () {
        router.push('./venueTab')
    }, false)
})
defineExpose({
    getTrumDigList
})
</script>
<style lang='less' scoped>
.exhibitCont{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow: hidden;
    .itemCont{
        width: 343px;
        height: 190px;
        border-radius: 8px;
        overflow: hidden;
        margin-top: 20px;
        margin-left: 20px;
        .cardName{
            width: 100%;
            height: 20%;
            line-height: 48px;
            font-size: 16px;
            font-weight: 400;
        }
        .imgCont{
            width: 100%;
            height: 80%;
            background-color: #6d6d6d;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            .covImg{
                position: absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
                img{
                    width: 100%;
                    height: 100%;
                } 
            }
            .typeImg{
                position: absolute;
                top:0;
                right:0;
                width:52px;
                height:62px;
                z-index: 99;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .footer{
                position: absolute;
                left:0;
                bottom:0;
                width:100%;
                height:40px;
                background:linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.47));
                z-index: 99;
                .action{
                    position: absolute;
                    right:0;
                    top:0;
                    width: 150px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .downLow{
                        display: inline-block;
                        height: 40px;
                        line-height: 40px;
                        font-size: 16px;
                        color: #fff;
                        font-weight: 400;
                    }
                    .downLow:hover{
                        color:#02a7f0;
                        cursor:pointer;
                    }
                    .line{
                        margin: 0 10px;
                        height: 16px;
                        border:1.5px solid #fff;
                    }
                    .dele{
                        display: inline-block;
                        height: 40px;
                        line-height: 40px;
                        font-size: 16px;
                        color: #fff;
                        font-weight: 400; 
                    }
                    .dele:hover{
                        color:#02a7f0;
                        cursor:pointer;
                    }
                }
                .clickNum{
                    display: inline-block;
                    height:40px;
                    line-height: 40px;
                    margin: 0 10px;
                    font-size: 16px;
                    color: #fff;
                    font-weight: 400;
                }
                .collectNum{
                    display: inline-block;
                    height:40px;
                    line-height: 40px;
                    margin: 0 10px;
                    font-size: 16px;
                    color: #fff;
                    font-weight: 400;
                }
            }
        }
    }
    .add{
        height: 154px;
        width: 343px;
        text-align: center;
        line-height: 154px;
        background-color: #f2f2f2;
        border-radius: 8px;
        color: #02a7f0;
        cursor: pointer;
        margin-top: 20px;
        margin-left: 20px;
    }
}
</style>