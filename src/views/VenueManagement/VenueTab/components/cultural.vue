<template>
    <div class="exhibitCont">
        <section class="itemCont" v-for="(item,index) in culList" :key="index" @click="updatedInfo(item)">
            <div class="imgCont">
                <div class="covImg">
                    <img v-if="item.pics && item.pics != null" :src="item.pic[0]" alt="底图">
                    <img v-else src="@/assets/img/loginBg.jpg" alt="底图">
                </div>
                <div class="typeImg">
                    <img v-if="item.status == 1 ? true:false" src="@/assets/img/zhanlan.png" alt="">
                    <img v-else-if="item.status == 2 ? true:false" src="@/assets/img/shoumai.png" alt="">
                    <img v-else-if="item.status == 3 ?true:false" src="@/assets/img/xiajia.png" alt="">
                </div>
                <div class="footer">
                    <span class="clickNum">点击量{{ item.clickCount }}</span>
                    <section class="action">
                        <span class="downLow"  @click.stop="upperOrDown(item.id,item.status)">{{ item.status == 1 ? '下架' : '上架' }}</span>
                        <span class="line"></span>
                        <span class="dele" @click.stop="delTrumGoodsInfo(item.id)">删除</span>
                    </section>
                </div>
            </div>
            <div class="cardName"> {{ item.name }} </div>
        </section>
        <section class="itemCont add" @click="add">+添加附件</section>
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
import { ElMessage } from 'element-plus';
import {ref,defineEmits,defineProps,defineExpose,onMounted} from 'vue';
import { useRouter } from 'vue-router';
const {proxy} = getCurrentInstance() as any;
const props = defineProps<{
    detailId:number
}>()
const culList = ref<any>([])
    const query = reactive({
	currentPage: 1,
	pageSize: 10
});
const pageTotal = ref(0);
const router = useRouter();
const emit = defineEmits<{
    (event:'newAdd'):void,
    (event:'updateInfo',{}):void,
}>()
const add = () => {
    emit('newAdd')
}
const getTrumGoodslist = () => {
    proxy.API.getTrumGoodslist({
        pageNum:query.currentPage,
        pageSize:query.pageSize,
        id:props.detailId
    }).then((res:any) => {
        if(res.data.success){
            let newArray = res.data.result.result.map((item:any) => {
            return {
              ...item,
              pic: item.pics?item.pics.split(","):[]
            }
          })
          pageTotal.value = res.data.result.totalItems
          culList.value = newArray;
        }
    })
}
const ChangeTrumGoodsInfo = (id:number,status:number) => {
    proxy.API.ChangeTrumGoodsInfo({
        status:status,
        id:id
    }).then((res:any) => {
        if(res.data.success){
            getTrumGoodslist()
            ElMessage.success('更新成功!')
        }
    })
}
const upperOrDown = (id:number,status:number) => {
    if(status == 1){
        ChangeTrumGoodsInfo(id,2)
    }else if(status == 2){
        ChangeTrumGoodsInfo(id,1)
    }
}
// 分页导航
const handlePageChange = (val: number) => {
	query.currentPage = val;
    getTrumGoodslist()
};
const updatedInfo = (val:any) => {
    emit('updateInfo',val)
}
const delTrumGoodsInfo = (id:number) => {
    proxy.API.delTrumGoodsInfo({id:id}).then((res:any)=> {
        if(res.data.success){
            getTrumGoodslist()
            ElMessage.success('删除成功!')
        }
    })
}
onMounted(() => {
    getTrumGoodslist()
    window.addEventListener('popstate', function () {
        router.push('./venueTab')
    }, false)
})
defineExpose({
    getTrumGoodslist
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
        width: 480px;
        height: 240px;
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
        height: 192px;
        width: 480px;
        text-align: center;
        line-height: 192px;
        background-color: #f2f2f2;
        border-radius: 8px;
        color: #02a7f0;
        cursor: pointer;
        margin-top: 20px;
        margin-left: 20px;
    }
}
</style>