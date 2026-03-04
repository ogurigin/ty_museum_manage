<template>
    <div class="container" v-scrollbar>
        <section class="jc">
            <section class="head">
                <div class="lineBar"></div>
                基础信息
            </section>
            <el-divider />
            <section class="infoWarp">
                <section class="item" v-for="(item,index) in arr" :key="index">
                    <section class="itemItem" v-for="(it,j) in item.children" :key="j">
                        <label>{{ it.label }}:</label>
                        <p v-if="it.label != '状态'">{{ it.text }}</p>
                        <el-select v-else-if="it.label =='状态'" v-model="it.text">
                            <el-option label="激活" value="激活" />
                            <el-option label="锁定" value="锁定" />
                            <el-option label="暂时激活" value="暂时激活" />
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
                <section class="item" v-for="(item,index) in arr1" :key="index">
                    <section class="itemItem" v-for="(it,j) in item.children" :key="j">
                        <label>{{ it.label }}:</label>
                        <p>{{ it.text }}</p>
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
                <el-table :data="tableData" border class="table"  header-cell-class-name="table-header">
                    <el-table-column prop="name" label="商品名称"></el-table-column>
                    <el-table-column prop="name" label="时间"></el-table-column>
                    <el-table-column prop="name" label="类型"></el-table-column>
                    <el-table-column prop="name" label="价格"></el-table-column>
			    </el-table>
                <div class="pagination">
				<el-pagination
					background
					layout="->,total, prev, pager, next"
					:current-page="query.pageIndex"
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
                <el-table :data="tableData" border class="table"  header-cell-class-name="table-header">
                    <el-table-column prop="name" label="场馆名称"></el-table-column>
                    <el-table-column prop="name" label="参观日期"></el-table-column>
                    <el-table-column prop="name" label="参观时段"></el-table-column>
                    <el-table-column prop="name" label="参观人数"></el-table-column>
                    <el-table-column prop="name" label="预约状态"></el-table-column>
			    </el-table>
                <div class="pagination">
				<el-pagination
					background
					layout="->,total, prev, pager, next"
					:current-page="query.pageIndex"
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
                用户动态
            </section>
            <el-divider />
            <section class="infoWarp">
                <el-table :data="tableData" border class="table"  header-cell-class-name="table-header">
                    <el-table-column prop="name" label="动态标题"></el-table-column>
                    <el-table-column prop="name" label="关联场馆"></el-table-column>
                    <el-table-column prop="name" label="浏览次数"></el-table-column>
                    <el-table-column prop="name" label="评论次数"></el-table-column>
                    <el-table-column prop="name" label="发布日期"></el-table-column>
			    </el-table>
                <div class="pagination">
				<el-pagination
					background
					layout="->,total, prev, pager, next"
					:current-page="query.pageIndex"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
			    ></el-pagination>
		    </div>
            </section>
        </section>
        <div class="footer">
                <el-button @click="handleColse" >取消</el-button>
                <el-button type="primary" @click="HandleSure">确认</el-button>
        </div>
    </div>
</template>
<script setup lang='ts'>
import {ref,reactive,defineEmits} from 'vue'
interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	address: string;
}
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const query = reactive({
	address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});
const arr = reactive<any>([
    {
        children:[
            {
                label:'用户名称',
                text:'张三'
            },
            {
                label:'性别',
                text:'男'
            },
            {
                label:'手机号',
                text:'张三'
            },
        ]
    },
    {
        children:[
            {
                label:'第一次登录时间',
                text:'2021'
            },
            {
                label:'用户类型',
                text:'会员'
            },
            {
                label:'最近登录时间',
                text:'2023'
            },
        ]
    },
    {
        children:[
            {
                label:'累计消费',
                text:'180000'
            },
            {
                label:'用户来源',
                text:'小程序'
            },
            {
                label:'总预约次数',
                text:'18'
            },
        ]
    },
    {
        children:[
            {
                label:'状态',
                text:'暂时激活'
            },
        ]
    },
])
const arr1 = reactive<any>([
    {
        children:[
            {
                label:'到期时间',
                text:'2023'
            },
            {
                label:'购买次数',
                text:'2500'
            },
            {
                label:'上次购买时间',
                text:'2021'
            },
        ]
    },
    {
        children:[
            {
                label:'累计购买金额',
                text:'￥250000'
            },
        ]
    },
])
const emit = defineEmits<{
    (event:'onClose'):void
}>()
// 分页导航
const handlePageChange = (val: number) => {
	
};
const HandleSure = () => {
    emit('onClose')
}
const handleColse = () => {
    emit('onClose')
}
</script>
<style lang='less' scoped>
.footer{
    width: 100%;
    height: 60px;
    margin: 20px 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
}
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
</style>