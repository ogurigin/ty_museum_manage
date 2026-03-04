<template>
	<div>
		<div v-if="tabShow" class="container">
			<div class="handle-box">
				<el-form :inline="true" :model="formInline" class="demo-form-inline">
					<el-form-item label="订单编号">
						<el-input v-model="query.name" placeholder="请输入订单编号" clearable />
					</el-form-item>
					<el-form-item label="商品名称">
						<el-input v-model="query.account" placeholder="请输入商品名称" clearable />
					</el-form-item>
					<el-form-item label="所属场馆">
						<el-select v-model="formInline.venueId" placeholder="请选择" :teleported="false" filterable remote
							clearable :remote-method="sreachVenue" v-loadMore="moreVenue">
							<el-option v-for="item in Venueoptions" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="用户手机号">
						<el-input v-model="query.account" placeholder="请输入用户手机号" clearable />
					</el-form-item>
					<el-form-item label="收件人">
						<el-input v-model="query.account" placeholder="请输入收件人" clearable />
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
				<el-table-column label="订单状态" align="center">
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status == 2">正常</el-tag>
						<el-tag type="danger" v-else-if="scope.row.status == 4">禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="sort" label="订单编号" width="55" align="center"></el-table-column>
				<el-table-column prop="userPhone" label="场馆名称"></el-table-column>
				<el-table-column prop="title" label="商品名称"></el-table-column>
				<el-table-column prop="likeCount" label="商品主图" align="center"></el-table-column>
				<el-table-column prop="remarkCount" label="商品销售价" align="center"></el-table-column>
				<el-table-column prop="remarkCount" label="商品数量" align="center"></el-table-column>
				<el-table-column prop="remarkCount" label="商品运费" align="center"></el-table-column>
				<el-table-column prop="remarkCount" label="优惠券" align="center"></el-table-column>
				<el-table-column prop="remarkCount" label="订单实付总金额" align="center"></el-table-column>
				<el-table-column prop="remarkCount" label="用户手机号" align="center"></el-table-column>
				<el-table-column prop="remarkCount" label="收件人" align="center"></el-table-column>
				<el-table-column prop="remarkCount" label="支付渠道" align="center"></el-table-column>
				<el-table-column prop="createTime" label="付费时间" align="center" width="150">
					<template #default="scope">
						{{ moment(scope.row.loginTime).format("YYYY-MM-DD HH:mm") }}
					</template>
				</el-table-column>

				<el-table-column label="操作" width="320" align="center">
					<template #default="scope">
						<el-button text :icon="View" class="green" @click="lookDetail(scope.row.id)">
							查看详情
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
};
const Venueoptions = ref<any>([]);
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
const queryVenue = reactive({
    venueType: '',
    name: '',
    currentPage: 1,
    pageSize: 10,
    pageTotal: 1,
    finished: false
});
const query = reactive({
    account:'',
	name:'',
	pageSize:10,
	currentPage:1,
	status:'1'
})
const tableData = ref<TableItem[]>([]);
const totalPage = ref(0);
// 获取表格数据
const getData = () => {
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

onMounted(() => {
	getData();
	sreachVenueTwo();
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
