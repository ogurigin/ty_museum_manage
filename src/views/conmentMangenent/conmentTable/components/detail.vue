<template>
    <div>
        <div class="container pr" v-scrollbar>
            <section style="width: 75%">
                <section class="jc">
                    <section class="head">
                        <div class="lineBar"></div>
                        基础信息
                    </section>
                    <el-divider />
                    <section class="infoWarp">
                        <el-form :inline="true" :model="ContentInfo" class="demo-form-inline">
                            <el-row :gutter="20" style="margin-bottom: 20px;">
                                <!-- <el-col :span="8">
                                <el-form-item label="内容序号">
                                    <el-input v-model="ContentInfo.user" placeholder="Approved by" style="width: 230px;" clearable />
                                </el-form-item>
                                </el-col> -->
                                <el-col :span="8">
                                    <el-form-item label="内容标题">
                                        <el-input v-model="ContentInfo.title" placeholder="Approved by"
                                            style="width: 230px;" clearable :disabled="ContentInfo.source == '用户'" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="点赞数量">
                                        <el-input v-model="ContentInfo.likeCount" placeholder="Approved by"
                                            style="width: 230px;" clearable disabled />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="评论数量">
                                        <el-input v-model="ContentInfo.remarkCount" placeholder="Approved by"
                                            style="width: 230px;" clearable disabled />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" style="margin-bottom: 20px;">
                                <el-col :span="8">
                                    <el-form-item label="内容来源">
                                        <el-input v-model="ContentInfo.source" placeholder="Approved by"
                                            style="width: 230px;" clearable disabled />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="发布时间">
                                        <el-date-picker v-model="ContentInfo.createTime" type="date"
                                            placeholder="Pick a date" style="width: 230px;" clearable disabled />
                                    </el-form-item>
                                </el-col>
                                <!-- <el-col :span="8">
                                    <el-form-item label="内容链接">
                                        <el-input v-model="ContentInfo.title" placeholder="Approved by"  style="width: 230px;" clearable />
                                    </el-form-item>
                                </el-col> -->
                                <!-- <el-col :span="8">
                                    <el-form-item label="导览分类">
                                        <el-input v-model="ContentInfo.title" placeholder="Approved by"
                                            style="width: 230px;" clearable />
                                    </el-form-item>
                                </el-col> -->

                            </el-row>
                            <el-row :gutter="20" style="margin-bottom: 20px;">
                                <!-- <el-col :span="8">
                                    <el-form-item label="状态">
                                        <el-select
                                            v-model="ContentInfo.region"
                                            placeholder="Activity zone"
                                            style="width: 230px;"
                                            clearable
                                        >
                                            <el-option label="Zone one" value="shanghai" />
                                            <el-option label="Zone two" value="beijing" />
                                        </el-select>
                                    </el-form-item>
                                </el-col> -->
                            </el-row>
                        </el-form>
                    </section>
                </section>
                <section class="jc">
                    <section class="head">
                        <div class="lineBar"></div>
                        内容详情
                    </section>
                    <el-divider />
                    <section class="infoWarp">
                        <Editor class="editor" :content="ContentInfo.detail" ref="newEditor" />
                    </section>
                </section>
            </section>
            <section class="pjContent">
                <section>全部评论</section>
                <div @scroll="handleScroll" ref="scrollContainer" class="main">
                    <section v-for="(item, index)  in remarklist.info" key="item.id">
                        <div class="contentMain">
                            <div class="avtor">
                                <img :src="item.userAvatar" alt="">
                            </div>
                            <div class="replay">
                                <div class="conText">
                                    <p class="name">{{ item.userNick }}</p>
                                    <p class="userRemark">
                                        {{ item.detail }}
                                    </p>
                                    <p class="time">{{ item.createTime }}</p>
                                </div>
                                <div class="btns">
                                    <span class="del" @click="del(item, 0)">删除</span>
                                    <span class="ck">
                                        <span class="icon">
                                            <img src="@/assets/img/loves.png" alt="">
                                        </span>
                                        <span class="text">{{ item.likeCount }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <section class="pd40" v-for="(itemTwo, indexTwo) in item.replies">
                            <div class="contentMainTwo"
                                :class="{ move: item.open ? true : false, upper: item.close ? true : false }">
                                <div class="avtor">
                                    <img :src="itemTwo.userAvatar" alt="">
                                </div>
                                <div class="replay">
                                    <div class="conText">
                                        <p class="name">{{ itemTwo.userNick }}<text
                                                style="font-size: 14px;margin: 0 5px;">回复<text
                                                    style="margin: 5px;font-size: 16px;">{{ itemTwo.replyUserNick
                                                    }}</text></text></p>
                                        <p class="userRemark">
                                            {{ itemTwo.detail }}
                                        </p>
                                        <p class="time">{{ itemTwo.createTime }}</p>
                                    </div>
                                    <div class="btns">
                                        <span class="del" @click="del(itemTwo, 1)">删除</span>
                                        <span class="ck">
                                            <span class="icon">
                                                <img src="@/assets/img/loves.png" alt="">
                                            </span>
                                            <span class="text">{{ itemTwo.likeCount }}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section class="upOrDown" :hidden="item.replyRemarkCount == 0">
                            <span :style="{ color: item.open ? '#579bfa' : '#c0c0c0' }" @click="zkClick(item)"
                                :hidden="item.renderRemarkCount < 0">展开{{ item.renderRemarkCount == item.replyRemarkCount ?
                                    item.replyRemarkCount + '条回复' : '更多' }}</span>
                            <span :style="{ color: item.open ? '#c0c0c0' : '#579bfa' }" @click="sqClick(item)"
                                :hidden="item.renderRemarkCount >= item.replyRemarkCount">收起</span>
                        </section>
                    </section>
                </div>

            </section>
            <div class="footer">
                <el-button @click="handleColse">取消</el-button>
                <el-button type="primary" @click="HandleSure">确认</el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { ref, reactive, defineEmits, } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import Editor from '../../../../components/editor.vue'
import moment from "moment";
import { text } from 'stream/consumers';
const { proxy } = getCurrentInstance() as any;
const open = ref<boolean>(false)
const close = ref<boolean>(false)
const ContentInfo = reactive({
    id: '',
    title: '',
    detail: '',
    createTime: '',
    remarkCount: '',
    likeCount: '',
    source: '',
    venueIds: '',
    pics:''
});
const remarklist = reactive({
    info: [] as any,
    pageNum: 1,
    pageSize: 10,
    totalPages: 1,
})
const newEditor = ref();
const scrollContainer = ref(null as any);
const emit = defineEmits<{
    (event: 'onClose'): void
    (event: 'refresh'): void
}>()
const zkClick = (item: any) => {
    item.open = false
    item.close = true
    let length = item.replies.length;
    let num = item.replyRemarkCount - item.renderRemarkCount;
    if (length <= num) {
        getRemarkReplys(item)
    } else {
        const comment_list = remarklist.info;
        // 遍历数组，找到对应的comment_id
        for (let i = 0; i < comment_list.length; i++) {
            if (comment_list[i].id === item.id) {
                // 页数增加
                // comment_list[i].page++;
                comment_list[i].renderRemarkCount -= comment_list[i].pageSize;
                //更新数组
                remarklist.info = comment_list
                break; // 停止遍历，已找到对应的comment_id并更新
            }
        }
    }
}
const sqClick = (item: any) => {
    item.open = true
    item.close = false
    const id = item.id;
    const comment_list = remarklist.info;
    // 遍历数组，找到对应的comment_id
    for (let i = 0; i < comment_list.length; i++) {
        if (comment_list[i].id === id) {
            // 恢复渲染的评论数
            comment_list[i].renderRemarkCount = comment_list[i].replyRemarkCount;
            //更新数组
            remarklist.info = comment_list
            break; // 停止遍历，已找到对应的comment_id并更新
        }
    }
}
const HandleSure = () => {
    PostContentInfo();
}
const handleColse = () => {
    emit('onClose');
};
const handleScroll = () => {
    if (scrollContainer.value.scrollHeight - scrollContainer.value.scrollTop === scrollContainer.value.clientHeight) {
        // 滚动条滚动到底部，触发加载更多的操作
        loadMore();
    }
};
const loadMore = () => {
    // 防抖处理
    setTimeout(() => {
        let page = remarklist.pageNum + 1
        if (page <= remarklist.totalPages) {
            remarklist.pageNum = page;
            getContentRemarkList(ContentInfo.id)
        }

    }, 500)
}
const del = (item: any, num: number) => {
    ElMessageBox.confirm(
        '确定要删除该评论?',
        'Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            delRemark(item.id);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消操作',
            })
        })
}
//获取内容详情
const getContentInfo = (id: any) => {
    let data = {
        contentId: id
    };
    
    
    proxy.API.getContentInfo(data).then((res: any) => {
        ContentInfo.id = res.data.result.id
        ContentInfo.title = res.data.result.title
        ContentInfo.likeCount = res.data.result.likeCount
        ContentInfo.remarkCount = res.data.result.remarkCount
        ContentInfo.createTime = moment(res.data.result.createTime).format("YYYY-MM-DD HH:mm")
        ContentInfo.detail = res.data.result.detail,
        ContentInfo.pics = res.data.result.pics,
            ContentInfo.venueIds = res.data.result.venueIds,
            ContentInfo.source = res.data.result.source == 2 ? '自建' : '用户'
        if (ContentInfo.source == '用户') {
            newEditor.value.onlyRead();
        }
        console.log(ContentInfo);
    }).catch((err: any) => {
        console.log(err);
    })
}
//修改内容详情
const PostContentInfo = () => {
    ContentInfo.detail = newEditor.value.syncHTML();
    let newobj = {
        id: ContentInfo.id,
        title: ContentInfo.title,
        detail: ContentInfo.detail,
        venueIds: ContentInfo.venueIds,
        pics:ContentInfo.pics,
    }
    proxy.API.PostContentInfo(newobj).then((res: any) => {
        if (res.data.success) {
            ElMessage.success('修改内容成功')
            emit('refresh');
            emit('onClose')
        }
    }).catch((err: any) => {
        ElMessage.warning(err)
    })
};
//获取内容详情下评论列表
const getContentRemarkList = (id: any) => {
    let data = {
        contentId: id,
        remarkId: 0,
        pageNum: remarklist.pageNum,
        pageSize: remarklist.pageSize,
    };
    proxy.API.getContentRemarkList(data).then((res: any) => {
        let newArray
        if (res.data.result.result.length > 0) {
            newArray = res.data.result.result.map((item: any) => {
                if (item.userAvatar && item.userAvatar != null) {
                    item.userAvatar = JSON.parse(item.userAvatar)[0].pic_path
                };
                if (item.createTime) {
                    item.createTime = moment(item.createTime).format("YYYY-MM-DD")
                }
                return {
                    id: item.id, //该评论的id
                    contentId: item.contentId, //当前视频的id
                    userId: item.userId, //该评论用户的id
                    userNick: item.userNick, //该评论的用户昵称
                    userAvatar: item.userAvatar, //该评论的用户头像
                    detail: item.detail, //评论内容
                    likeCount: item.likeCount, //该评论的点赞数
                    replyRemarkCount: item.replyRemarkCount, //该评论的回复数
                    renderRemarkCount: item.replyRemarkCount, //用于计算剩余的回复数
                    isLike: item.like, //该用户是否点赞
                    createTime: item.createTime, //该评论发布时间
                    replies: [],
                    page: 1, //当前请求次数 对应 页数
                    pageSize: 3, //一次请求几个
                    open: false,
                    close: true
                }
            });
        }
        if (res.data.result.page > 1) {
            remarklist.info = remarklist.info.concat(newArray)
        } else {
            remarklist.info = newArray;
        }
        remarklist.totalPages = res.data.result.pages;
    }).catch((err: any) => {
        console.log(err);
    })
}
//获取评论下回复列表
const getRemarkReplys = (item: any) => {
    let params = {
        contentId: item.contentId,
        remarkId: item.id,
        pageNum: item.page,
        pageSize: item.pageSize
    };
    proxy.API.getRemarkReplys(params).then((res: any) => {
        if (res.data.success) {
            const comment_list = remarklist.info;
            // 遍历数组，找到对应的comment_id
            for (let i = 0; i < comment_list.length; i++) {
                if (comment_list[i].id === item.id) {
                    // 页数增加
                    comment_list[i].page++;
                    //筛选出相同id的不进行显示；
                    let uniqueElements = [];
                    if (comment_list[i].replies && comment_list[i].replies.length > 0) {
                        uniqueElements = res.data.result.result.filter((element2: any) => !comment_list[i].replies.some((element1: any) => element1.id === element2.id));
                    } else {
                        uniqueElements = res.data.result.result;
                    };
                    //数组进行处理
                    const newArray = uniqueElements.map((item: any) => {
                        return {
                            id: item.id, //该评论的id
                            contentId: item.contentId, //当前视频的id
                            userId: item.userId, //该评论用户的id
                            userNick: item.userNick, //该评论的用户昵称
                            userAvatar: JSON.parse(item.userAvatar)[0].pic_path, //该评论的用户头像
                            detail: item.detail, //评论内容
                            likeCount: item.likeCount, //该评论的点赞数
                            replyUserNick: item.replyUserNick, //该评论回复的用户昵称
                            replyRemarkCount: item.replyRemarkCount, //该评论的回复数
                            isLike: item.like, //该用户是否点赞
                            createTime: moment(item.createTime).format("YYYY-MM-DD"), //该评论发布时间
                        }
                    });
                    //修改评论的显示数量
                    comment_list[i].replies = comment_list[i].replies.concat(newArray);
                    comment_list[i].renderRemarkCount -= comment_list[i].pageSize;
                    //更新数组
                    remarklist.info = comment_list;

                    break; // 停止遍历，已找到对应的comment_id并更新
                }
            }

        }
    }).catch((err: any) => {
        ElMessage.error(err)
    })
}
//删除评论
const delRemark = (id: any) => {
    let params = {
        remarkId: id
    };
    proxy.API.delRemark(params).then((res: any) => {
        if (res.data.success) {
            ElMessage({
                type: 'success',
                message: '删除成功',
            });
            for (let i = 0; i < remarklist.info.length; i++) {
                if (remarklist.info[i].id == id) {
                    remarklist.info.splice(i, 1);
                    break;
                } else {
                    for (let j = 0; j < remarklist.info[i].replies.length; j++) {
                        if (remarklist.info[i].replies[j].id == id) {
                            remarklist.info[i].replies.splice(j,1);
                            break;
                        }
                    }
                }
            }
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
defineExpose({ getContentInfo, getContentRemarkList })
</script>
<style>
.demo-form-inline .el-input {
    --el-input-width: 420px;
}
</style>
<style lang='less' scoped>
.footer {
    width: 100%;
    height: 60px;
    margin: 20px 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
}

.pr {
    position: relative;
}

.jc {
    margin-bottom: 10px;
}

.head {
    padding-left: 15px;
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 20px;

    .lineBar {
        position: absolute;
        top: 2px;
        left: 0px;
        height: 30px;
        border: 3px solid rgba(102, 153, 255);
    }
}

.infoWarp {
    width: 100%;
}

.demo-form-inline .el-input {
    --el-input-width: 420px;
}

.editor {
    line-height: normal !important;
    height: 330px;
    margin-bottom: 30px;
}

.pjContent {
    position: absolute;
    top: 10px;
    right: 5px;
    width: 25%;
    height: calc(100% - 20px);
    border-radius: 8px;
    background-color: #e9e9e9;
    padding: 20px;
    box-sizing: border-box;
    z-index: 90;


    .main {
        width: 100%;
        margin-bottom: 16px;
        height: 100%;
        overflow-y: auto;

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
            margin-top: 20px;
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
                width: calc(100% - 50px);
                display: flex;
                justify-content: flex-start;
                align-items: start;

                .conText {
                    width: calc(100% - 100px);

                    .name {
                        color: #99999b;
                        height: 40px;
                        line-height: 40px;
                    }

                    .userRemark {
                        margin-top: 6px;
                        line-height: 18px;
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

        .contentMainTwo {
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
                width: calc(100% - 50px);
                display: flex;
                justify-content: flex-start;
                align-items: start;

                .conText {
                    width: calc(100% - 100px);

                    .name {
                        color: #99999b;
                    }

                    .userRemark {
                        margin-top: 6px;
                        line-height: 18px;
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
            display: none;
            overflow: hidden;
        }


        .upper {
            height: auto;
            display: flex;
            overflow: hidden;
        }


    }

    .pd40 {
        width: calc(100% - 40px);
        padding-left: 40px;
    }
}
</style>