<template>
    <el-drawer v-model="isModalVisible" :direction="direction">
        <template #header>
            <h4>{{ title }}</h4>
        </template>
        <template #default>
            <div class="ConTitle">
                <h1>{{ ContentInfo.title }}</h1>
            </div>
            <div class="ConBody">
                <div class="head">
                    <div class="left">{{ ContentInfo.userNick }}</div>
                    <div class="right">{{ ContentInfo.createTime }}</div>
                </div>
                <div class="middle">
                    <div class="imgCard" v-for="(item, index) in imglist" key="index">
                        <el-image :src="item" :preview-src-list="[item]" />
                    </div>
                </div>
                <div class="bottom">
                    <div class="text">
                        {{ ContentInfo.detail }}
                    </div>
                    <div class="labels" v-for="item in ContentInfo.venueIds">
                        <div class="label">{{ item.name }}</div>
                    </div>
                </div>
            </div>
            <div class="ConBottom" v-if="title == '审核评论'">
                <section class="main">
                    <div class="contentMain">
                        <div class="avtor">
                            <img :src="remarkInfo.userAvatar" alt="">
                        </div>
                        <div class="replay">
                            <div class="conText">
                                <p class="name">{{ remarkInfo.userNick }}</p>
                                <p class="userRemark">
                                    {{ remarkInfo.detail }}
                                </p>
                                <p class="time">{{ moment(remarkInfo.createTime).format("YYYY-MM-DD HH:mm") }}</p>
                                <!-- <section class="main pd40">
                                    <div class="contentMain"
                                        :class="{ move: open ? true : false, upper: close ? true : false }">
                                        <div class="avtor">
                                            <img src="@/assets/img/img.jpg" alt="">
                                        </div>
                                        <div class="replay">
                                            <div class="conText">
                                                <p class="name">用户昵称</p>
                                                <p class="userRemark">
                                                    这里是用户的评论,Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                    Necessitatibus
                                                    maxime cupiditate nulla deleniti mollitia? Nam rem, ad illum eum
                                                    exercitationem
                                                    sapiente corrupti, dignissimos accusamus totam, eligendi asperiores.
                                                    Sed,
                                                    quasi
                                                    quis?
                                                </p>
                                                <p class="time">评论的时间 2023/10/10 10:59:06</p>
                                            </div>
                                            <div class="btns">
                                                <span class="del">删除</span>
                                                <span class="ck">
                                                    <span class="icon">
                                                        <img src="@/assets/img/loves.png" alt="">
                                                    </span>
                                                    <span class="text">点赞数</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section class="upOrDown">
                                    <span :style="{ color: open ? '#579bfa' : '#c0c0c0' }" @click="zkClick">展开</span>
                                    <span :style="{ color: open ? '#c0c0c0' : '#579bfa' }" @click="sqClick">收起</span>
                                </section> -->
                            </div>
                            <!-- <div class="btns">
                                <span class="del">删除</span>
                                <span class="ck">
                                    <span class="icon">
                                        <img src="@/assets/img/loves.png" alt="">
                                    </span>
                                    <span class="text">点赞数</span>
                                </span>
                            </div> -->

                        </div>
                    </div>

                </section>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto" v-if="title == '审核内容'">
                <el-button type="primary" @click="confirmClick(0)" v-if="ContentInfo.status != 2">通过</el-button>
                <el-button type="primary" @click="confirmClick(1)" v-if="ContentInfo.status != 3">未通过</el-button>
                <el-button @click="cancelClick" :disabled="ContentInfo.status == 1 ? true : false">删除</el-button>
            </div>
            <div style="flex: auto" v-else>
                <el-button type="primary" @click="confirmClickTwo(0)" v-if="remarkInfo.status != 2">通过</el-button>
                <el-button type="primary" @click="confirmClickTwo(1)" v-if="remarkInfo.status != 3">未通过</el-button>
                <el-button @click="cancelClickTwo" :disabled="remarkInfo.status == 1 ? true : false">删除</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
const { proxy } = getCurrentInstance() as any;

const isModalVisible = ref(false);
const title = ref('弹窗标题');
let ContentInfo = reactive<any>({
    id: '',
    title: '',
    detail: '',
    userNick: '',
    createTime: '',
    status: '',
    venueIds: [],
});
let remarkInfo = ref<any>({
});

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const direction = ref<any>('rtl')
const open = ref<boolean>(false)
const close = ref<boolean>(false)
const imglist = ref([])
const contentlist = ref([]);
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure you want to close this?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
function cancelClick() {
    ElMessageBox.confirm(`确定删除?`)
        .then(() => {
            delContentInfo()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消',
            })
        })
}
function confirmClick(num: any) {
    if (num == 0) {
        ElMessageBox.confirm(`确定通过?`)
            .then(() => {
                update(2);
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消',
                })
            })
    } else if (num == 1) {
        ElMessageBox.confirm(`确定未通过?`)
            .then(() => {
                update(3);
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消',
                })
            })
    }

}
function cancelClickTwo() {
    ElMessageBox.confirm(`确定删除?`)
        .then(() => {
            delRemarkInfo();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消',
            })
        })
}
function confirmClickTwo(num: any) {
    if (num == 0) {
        ElMessageBox.confirm(`确定通过?`)
            .then(() => {
                updateRemarkStatus(2);
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消',
                })
            })
    } else if (num == 1) {
        ElMessageBox.confirm(`确定未通过?`)
            .then(() => {
                updateRemarkStatus(3);
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消',
                })
            })
    }

}


const emit = defineEmits<{
    (event: "refresh"): void;
}>();
const showModal = (val: string, id: any) => {
    isModalVisible.value = true;
    title.value = val;
    console.log(id, '内容的id');
    if (val == '审核内容') {
        getContentInfo(id);
    } else if (val == '审核评论') {
        getremarkInfo(id);
    };
}

const zkClick = () => {
    open.value = false
    close.value = true
}
const sqClick = () => {
    open.value = true
    close.value = false
}


const assignment = (obj: any) => {

};
//根据id查找对应内容详情
const getContentInfo = (id: any) => {
    let data = {
        contentId: id
    };
    proxy.API.getContentInfo(data).then((res: any) => {
        console.log(res, '内容详情');
        ContentInfo.id = res.data.result.id
        ContentInfo.title = res.data.result.title
        ContentInfo.userNick = res.data.result.userNick
        ContentInfo.createTime = moment(res.data.result.createTime).format("YYYY-MM-DD HH:mm")
        ContentInfo.detail = res.data.result.detail
        ContentInfo.status = res.data.result.status
        if (res.data.result.venueIds != null && res.data.result.venueIds.length > 0) {
            ContentInfo.venueIds = res.data.result.venueIds.split(',');
            venueList(ContentInfo.venueIds).then((result: any) => {
                ContentInfo.venueIds = result;
            });
        };
        imglist.value = res.data.result.pics.split(',')
    }).catch((err: any) => {
        console.log(err);

    })
}
//根据id修改内容状态
const update = (status: number) => {
    let params = {
        contentId: ContentInfo.id,
        status: {
            status
        }
    };
    proxy.API.updateContentStatus(params).then((res: any) => {
        if (res.data.success) {
            if (status == 2) {
                ElMessage({
                    type: 'success',
                    message: '通过成功',
                });
            } else if (status == 3) {
                ElMessage({
                    type: 'success',
                    message: '未通过成功',
                })
            };
            console.log('修改成功');
            emit('refresh');
            ContentInfo = reactive<any>({
                id: '',
                title: '',
                detail: '',
                userNick: '',
                createTime: '',
                status: '',
                venueIds: [],
            });
            isModalVisible.value = false
        } else {
            if (status == 2) {
                ElMessage({
                    type: 'warning',
                    message: '通过失败',
                })
            } else if (status == 3) {
                ElMessage({
                    type: 'warning',
                    message: '未通过失败',
                })
            }
        }
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: '错误' + err,
        })
    })
}
//根据id删除内容状态
const delContentInfo = () => {
    let params = {
        contentId: ContentInfo.id
    };
    proxy.API.delContentInfo(params).then((res: any) => {
        if (res.data.success) {
            ElMessage({
                type: 'success',
                message: '删除成功',
            });
            emit('refresh');
            isModalVisible.value = false
        } else {
            ElMessage({
                type: 'warning',
                message: '删除失败',
            })
        }
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: '错误' + err,
        })
    })
}
//根据id修改评论的状态
const updateRemarkStatus = (status: number) => {
    let params = {
        remarkId: remarkInfo.value.id,
        status: {
            status
        }
    };
    proxy.API.updateRemarkStatus(params).then((res: any) => {
        if (res.data.success) {
            if (status == 2) {
                ElMessage({
                    type: 'success',
                    message: '通过成功',
                });
            } else if (status == 3) {
                ElMessage({
                    type: 'success',
                    message: '未通过成功',
                })
            };
            console.log('修改成功');
            emit('refresh');
            isModalVisible.value = false
        } else {
            if (status == 2) {
                ElMessage({
                    type: 'warning',
                    message: '通过失败',
                })
            } else if (status == 3) {
                ElMessage({
                    type: 'warning',
                    message: '未通过失败',
                })
            }
        }
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: '错误' + err,
        })
    })
}
//根据id查找对应评论
const getremarkInfo = (id: any) => {
    let params = {
        remarkId: id
    };
    proxy.API.getremarkInfo(params).then((res: any) => {
        res.data.result.userAvatar = JSON.parse(res.data.result.userAvatar)[0].pic_path;
        remarkInfo.value = res.data.result;
        getContentInfo(res.data.result.contentId);
    }).catch((err: any) => {
        console.log(err);
    })
}

//根据id删除内容状态
const delRemarkInfo = () => {
    let params = {
        contentId: remarkInfo.value.id
    };
    proxy.API.delRemarkInfo(params).then((res: any) => {
        if (res.data.success) {
            ElMessage({
                type: 'success',
                message: '删除成功',
            });
            emit('refresh');
            isModalVisible.value = false
        } else {
            ElMessage({
                type: 'warning',
                message: '删除失败',
            })
        }
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: '错误' + err,
        })
    })
}

//查找场馆名称
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
            console.log(vueneList, 've', remarkInfo.status);

            resolve(vueneList);
        }).catch((err) => {
            // 返回一个空数组或者其他默认值，根据实际需求进行处理
            resolve([]);
        });
    });
}
onMounted(() => {
    // getBusinessInfoType();
    console.log(remarkInfo.value, '11211');
});
defineExpose({ showModal, assignment })
</script>

<style lang="less" scoped>
.title {
    padding: 10px 0;
    display: flex;
    // border-bottom: 1px solid rgb(111, 111, 111);
}

.ConTitle {
    background-color: #dfdfdf;
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    padding: 5px 10px 5px 10px;
    box-sizing: content-box;
}

.ConBody {
    padding: 20px 0;
    border-bottom: 1px solid #ddd;

    .head {
        display: flex;
        font-size: 14px;
        color: #333;

        .left {
            margin-right: auto;
        }

        .right {
            margin-left: auto;
        }
    }

    .middle {
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;

        .imgCard {

            // height: 100px;
            .el-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }

    .bottom {
        margin-top: 10px;

        .text {
            text-indent: 2rem;
            line-height: 22px;
            word-break: break-all;
        }

        .labels {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 10px;

            .label {
                width: auto;
                min-width: 80px;
                font-size: 14px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                border-radius: 5px;
                background-color: #c4c4c4;
                color: #fff;
                padding: 0 10px;
            }
        }
    }
}

.ConBottom {
    max-height: 340px;
    overflow-y: scroll
}

.inputItemTwo {
    display: flex;
    justify-content: right;
}


.tab {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .tabTitle {
        min-width: 80px;
        // min-width: 100px;
        text-align: left;
        font-size: 14px;
        color: #606266;
    }

    .tabName {
        flex: 1;
    }
}

.tabItem {
    .tabTitle {
        // min-width: 80px;
        min-width: 80px;
        text-align: left;
        font-size: 14px;
        color: #606266;
    }

    .tabName {
        margin-right: 20px;
    }
}

.main {
    width: 100%;
    margin-bottom: 16px;
    overflow: hidden;

    .upOrDown {
        margin-left: 50px;
        overflow: hidden;

        span {
            margin: 10px 10px;
            display: inline-block;
            font-size: 18px;
            cursor: pointer;
            transition: 0.2;
        }
    }

    .contentMain {
        width: 100%;
        height: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: start;

        .avtor {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .replay {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: start;
            position: relative;

            .conText {
                width: 100%;

                .name {
                    color: #99999b;
                    min-height: 40px;
                    line-height: 40px;
                }

                .userRemark {
                    margin-top: 6px;
                    line-height: 22px;
                    word-break: break-all;
                    color: #666666;
                    text-indent: 2em;
                }

                .time {
                    margin-top: 8px;
                    font-size: 12px;
                    color: #c9c9c9;
                }
            }

            .btns {
                width: 120px;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                position: absolute;
                right: 0;

                .del {
                    display: inline-block;
                    font-size: 14px;
                    padding: 8px 8px;
                    line-height: 14px;
                    color: #fff;
                    background-color: #579bfa;
                    border-radius: 2px;
                    cursor: pointer;
                }

                .ck {
                    margin-left: 8px;
                    display: inline-block;
                    font-size: 14px;
                    overflow: hidden;
                    cursor: pointer;

                    .icon {
                        display: block;
                        text-align: center;
                    }

                    .text {
                        display: block;
                        text-align: center;
                    }
                }
            }
        }
    }

    .move {
        height: 0px;
        overflow: hidden;
        animation: develop 1s ease 1ms 1 alternate;
    }

    /* 动画定义 */
    @-webkit-keyframes develop {
        from {
            height: 200px;
        }

        to {
            height: 0px;
        }
    }

    @keyframes develop {
        from {
            height: 200px;
        }

        to {
            height: 0px;
        }
    }

    .upper {
        height: 200px;
        overflow: hidden;
        animation: packUp 1s ease 1ms 1 alternate;
    }

    @-webkit-keyframes packUp {
        from {
            height: 0px;
        }

        to {
            height: 200px;
        }
    }

    @keyframes packUp {
        from {
            height: 0px;
        }

        to {
            height: 200px;
        }
    }

}
</style>