<template>
	<div>
		<div v-if="tabShow" class="container">
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
							<el-option label="正常" value="2" />
							<el-option label="禁用" value="4" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-form-item>
							<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
							<el-button type="primary" :icon="Plus" @click="handleAdd">添加</el-button>
						</el-form-item>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="sort" label="序号" width="55" align="center"></el-table-column>
				<el-table-column prop="userNick" label="用户昵称" align="center">
					<template #default="scope">
						<div>
							{{ scope.row.userId == 0 ? '淘艺' : scope.row.userNick }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="userPhone" label="用户账号"></el-table-column>
				<el-table-column prop="title" label="内容标题"></el-table-column>
				<el-table-column prop="venueName" label="场馆名称" width="175">
					<template #default="scope">
						<div v-for="item in scope.row.venueName">
							<el-tag> {{ item.name }}</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="source" label="内容来源" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.source == '用户' ? '' : 'success'"> {{ scope.row.source }}</el-tag>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="name" label="内容视频">
                    <template #default="scope">
						<VideoPlay style="width: 2em; height: 2em; margin-right: 8px;cursor:pointer" @click="openVideo(scope.name)" />
					</template>
                </el-table-column> -->
				<el-table-column prop="likeCount" label="点赞数量" align="center"></el-table-column>
				<el-table-column prop="remarkCount" label="评论数量" align="center"></el-table-column>
				<el-table-column prop="createTime" label="发布时间" align="center" width="150">
					<template #default="scope">
						{{ moment(scope.row.loginTime).format("YYYY-MM-DD HH:mm") }}
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status == 2">正常</el-tag>
						<el-tag type="danger" v-else-if="scope.row.status == 4">禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="320" align="center">
					<template #default="scope">
						<el-button text :icon="Link" class="green">
							复制链接
						</el-button>
						<el-button text :icon="View" class="green" @click="lookDetail(scope.row.id)">
							查看详情
						</el-button>
						<el-button text :icon="Lock" class="red" @click="update(scope.row.id, 4)"
							v-if="scope.row.status == 2">
							禁用
						</el-button>
						<el-button text :icon="Unlock" class="green" @click="update(scope.row.id, 2)"
							v-if="scope.row.status == 4">
							启用
						</el-button>
						<el-button text :icon="Delete" class="red" @click="del(scope.row.id)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="->,total, prev, pager, next" :current-page="query.currentPage"
					:page-size="query.pageSize" :total="totalPage" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>
		<div class="videoMap" v-if="showVideo">
			<Close
				style="width: 2em; height: 2em; margin-right: 8px;cursor:pointer;position:absolute;top:20px;right:20px;color:#fff"
				@click="cancelVideo" />
			<video :src="videoSrc" controls autoplay class="video-player"></video>
		</div>
		<add ref="addCon" v-if="addShow" @goBack="goBack" @refresh="getData"></add>
		<detail ref="contentInfo" v-if="detailShow" @onClose="onClose" @refresh="getData"></detail>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, nextTick } from 'vue';
import moment from "moment";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, View, Link, Delete, Search, Unlock, Lock } from '@element-plus/icons-vue';
import Add from './components/add.vue';
import Detail from './components/detail.vue';
const { proxy } = getCurrentInstance() as any;
interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	address: string;
}
const showVideo = ref(false)
const videoSrc = ref<string>('')
const addShow = ref(false);
const detailShow = ref(false);
const tabShow = ref(true);
const addCon = ref();
const contentInfo = ref<any>();
const formInline = reactive<any>({
	user: '',
	region: '',
	date: '',
})
const query = reactive({
	name: '',
	account: '',
	publishStartTime: '',
	publishEndTime: '',
	status: "",
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
	proxy.API.getContentList({
		name: query.name,
		account: query.account,
		publishStartTime: query.publishStartTime,
		publishEndTime: query.publishEndTime,
		status: query.status || '',
		pageNum: query.currentPage,
		pageSize: query.pageSize || 5,
	}).then((res: any) => {
		if (res.data.success) {
			let newTable = res.data.result.result;
			let count = 0; // 用于统计满足条件的 item 的总数
			if (newTable.length > 0) {
				newTable.forEach((item: {
					source: any; sort: any; pics: string | null; venueIds: any; venueName: any;
				}, index: number) => {
					item.sort = ((res.data.result.page - 1) * 5) + index + 1;
					if (item.pics && item.pics !== null) {
						item.pics = item.pics.split(',')[0];
					}
					if (item.source == 1) {
						item.source = "用户";
					} else {
						item.source = "自建";
					};
					if (item.venueIds !== null && item.venueIds.length > 0) {
						count++;
						item.venueIds = item.venueIds.split(',');
						venueList(item.venueIds).then((result: any) => {
							item.venueName = result;
							count--; // 异步请求完成后，总数减一
							if (count === 0) {
								// 所有异步请求完成后进行数据更新
								tableData.value = newTable;
								totalPage.value = res.data.result.totalItems;
							}
						});
					} else {
						tableData.value = newTable;
						totalPage.value = res.data.result.totalItems;
					}
				});
			} else {
				tableData.value = newTable;
				totalPage.value = res.data.result.totalItems;
			}


		}
	});
};
//删除内容
const del = (id: any) => {
	ElMessageBox.confirm(`确定删除?`,
	{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'error',
		}
	)
		.then(() => {
			delContent(id)
		})
		.catch(() => {
			ElMessage({
				type: 'info',
				message: '取消',
			})
		})

}
//删除内容详情
const delContent = (id: any) => {
	proxy.API.delContentInfo({
		contentId: id
	}).then((res: any) => {
		if (res.data.success) {
			ElMessage({
				type: 'success',
				message: '删除成功',
			});
			getData();
		} else {
			ElMessage({
				type: 'warning',
				message: '删除失败' + res.data.errorMessage,
			});
		}
	}).catch((err: any) => {
		ElMessage({
			type: 'error',
			message: '错误' + err,
		});
	});
}
onBeforeMount(() => {
	getData();
})
const openVideo = (val: string) => {
	showVideo.value = true
	videoSrc.value = val
}
const cancelVideo = () => {
	showVideo.value = false
}

// 查询操作
const handleSearch = () => {
	query.currentPage = 1;
	getData();
};

// 新增
const handleAdd = () => {
	addShow.value = true;
	tabShow.value = false;
};
const goBack = () => {
	addShow.value = false;
	tabShow.value = true;
}

// 分页导航
const handlePageChange = (val: number) => {
	query.currentPage = val;
	getData();
};
const lookDetail = (val: number) => {
	//查看详情
	detailShow.value = true;
	nextTick(() => {
		contentInfo.value.getContentInfo(val);
		contentInfo.value.getContentRemarkList(val);
	})
	tabShow.value = false;
}
const onClose = () => {
	detailShow.value = false;
	tabShow.value = true;
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
			resolve(vueneList);
		}).catch((err) => {
			// 返回一个空数组或者其他默认值，根据实际需求进行处理
			resolve([]);
		});
	});
}
const update = (id: any, status: any) => {
	if (status == 4) {
		ElMessageBox.confirm(`确定禁用?`,
	{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(() => {
				updateContentStatus(id, status)
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: '取消',
				})
			})
	} else {
		ElMessageBox.confirm(`确定启用?`)
			.then(() => {
				updateContentStatus(id, status)
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: '取消',
				})
			})
	}

}
//修改内容状态
const updateContentStatus = (id: any, status: any) => {
	let params = {
		contentId: id,
		status: {
			status
		}
	}
	proxy.API.updateContentStatus(params).then((res: any) => {
		if (res.data.success) {
			if (status == 4) {
				ElMessage({
					type: 'success',
					message: '禁用成功',
				});

			} else {
				ElMessage({
					type: 'success',
					message: '启用成功',
				})
			};
			getData();
		} else {
			if (status == 4) {
				ElMessage({
					type: 'warning',
					message: '禁用失败',
				});
			} else {
				ElMessage({
					type: 'warning',
					message: '启用失败',
				})
			};
		}
	}).catch((err: any) => {
		ElMessage({
			type: 'error',
			message: '错误' + err,
		})
	})
}
onMounted(() => {
	getData();
})
</script>

<style lang="less" scoped>
.videoMap {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	justify-content: center;
	align-items: center;

	.video-player {
		width: 600px;
		height: 300px;
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
	width: 40px;
	height: 40px;
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
