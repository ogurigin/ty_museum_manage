<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-form :inline="true" :model="query" class="demo-form-inline">
                    <el-form-item label="视频名称">
                        <el-input v-model="query.name" placeholder="请输入视频名称" clearable />
                    </el-form-item>
                    <el-form-item label="导览类型">
                        <el-select
                            v-model="query.venueType"
                            placeholder="请选择导览类型"
                            clearable
                            >
                            <el-option label="博物馆" value="博物馆" />
                            <el-option label="展览馆" value="展览馆" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                        <el-button type="primary" :icon="Plus" @click="handleSearch">添加</el-button>
                    </el-form-item>
                </el-form>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="name" label="视频名称"></el-table-column>
                <el-table-column prop="venueType" label="导览类型">
					<template #default="scope">
						<img :src="scope.row.thumbnailSrc" alt="Thumbnail" />
						<VideoPlay style="width: 2em; height: 2em; margin-right: 8px;cursor:pointer" @click="openVideo(scope.row.thumbnailSrc)" />
					</template>
				</el-table-column>
				<el-table-column prop="venueLabel"  label="内容视频">
                    <template #default="scope">
						<VideoPlay style="width: 2em; height: 2em; margin-right: 8px;cursor:pointer" @click="openVideo(scope.row.venueLabel)" />
					</template>
                </el-table-column>
                <el-table-column prop="clickCount" label="视频播放量"></el-table-column>
                <el-table-column prop="clickCount" label="视频点赞"></el-table-column>
                <el-table-column prop="clickCount" label="收藏数量"></el-table-column>
                <el-table-column prop="namclickCounte" label="评论数量"></el-table-column>
                <el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.state === '成功' ? 'success' : scope.row.state === '失败' ? 'danger' : ''"
						>
							{{ scope.row.state }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="View" class="green" @click="handleLook(scope.$index)">
							查看详情
						</el-button>
					</template>
				</el-table-column>
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
		</div>
		<div class="videoMap" v-if="showVideo">
			<Close style="width: 2em; height: 2em; margin-right: 8px;cursor:pointer;position:absolute;top:20px;right:20px;color:#fff" @click="cancelVideo" />
			<video :src="videoSrc" controls autoplay class="video-player"></video>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive,defineEmits,onBeforeMount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {  View, Search,Plus,VideoPlay,Close } from '@element-plus/icons-vue';
const {proxy} = getCurrentInstance() as any;
interface TableItem {
	name: string,
	venueLabel:string,
	venueType: string,
	clickCount:string,
	namclickCounte:string,
}
const query = reactive({
	venueType: '',
	name: '',
	currentPage: 1,
	pageSize: 10
});
const showVideo = ref(false)
const videoSrc = ref<string>('')
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
	proxy.API.getvideos({
		pageNum: query.currentPage,
        pageSize: query.pageSize,
        name: '视频'
	}).then((res:any) => {
		if(res.data.success){
			tableData.value = res.data.result.result;
			pageTotal.value = res.data.result.totalItems;
		}
	});
};
onBeforeMount(()=>{
	getData();
})
const emit = defineEmits<{
    (event:'lookFn',val:number): void
}>()
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
const openVideo = (val:string) => {
	console.log('dadasdas')
	showVideo.value =true
	videoSrc.value = val
}
const cancelVideo = () => {
	showVideo.value =false
}
// 删除操作
const handleLook = (index: number) => {
    emit('lookFn',1212)
};
</script>

<style scoped lang="less">
.videoMap{
	position:absolute;
	top:0;
	left:0;
	width:100%;
	height:100%;
	background:rgba(0,0,0,0.5);
	z-index:999;
	display:flex;
	justify-content:center;
	align-items:center;
	.video-player{
		width:600px;
		height:300px;
	}

}
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
	color: rgba(22,155,213);
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
</style>