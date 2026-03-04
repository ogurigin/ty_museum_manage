<template>
    <div class="box" v-scrollbar>
        <div class="container">
            <div class="Onebox" v-for="(item, index) in Onelist" :key="index">
                <div class="title">
                    <span class="OneTitle">{{ item.name }}</span>
                    <el-button text :icon="Edit" class="green" @click="edit(item.name, item.id)">
                        编辑
                    </el-button>
                    <span class="TwoTitle">|</span>
                    <el-button text :icon="Delete" class="green" @click="delOne(item.id)">
                        删除
                    </el-button>
                </div>
                <div class="Twobox">
                    <div class="card" v-for="(itemTwo, indexTwo) in item.items" :key="itemTwo.id">
                        <div class="pic-img">
                            <img :src='itemTwo.pic' alt=""
                                style="position: absolute;width: 100%;height: 100%;object-fit: cover; top: 0;left: 0;cursor: pointer;"
                                @click.self="showInfo(itemTwo)">
                            <img v-show="itemTwo.status == 1" src="../../../assets/img/zhanlan.png" alt=""
                                style="position: absolute;right: 0;top: 0;height: 70px;height: 62px;">
                            <img v-show="itemTwo.status == 2" src="../../../assets/img/xiajia.png" alt=""
                                style="position: absolute;right: 0;top: 0;height: 70px;height: 62px;">
                            <div
                                style="background: linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, .47));height: 40px;width: 100%;position: absolute;bottom: 0;">
                            </div>
                            <div class="bottom">
                                <div class="clickNum">点击量{{ itemTwo.viewCount }}</div>
                                <div class="action">
                                    <div class="Takedown item" v-show="itemTwo.status == 1"
                                        @click.stop="UpDown(itemTwo.status, itemTwo.id, 0)">下架</div>
                                    <div class="shuxian item" v-show="itemTwo.status == 1">|</div>
                                    <div class="Up item" v-show="itemTwo.status == 2"
                                        @click.stop="UpDown(itemTwo.status, itemTwo.id, 1)">上架</div>
                                    <div class="shuxian item" v-show="itemTwo.status == 2">|</div>
                                    <div class="remove item" @click.stop="delTwo(itemTwo.id)">
                                        删除</div>
                                </div>
                            </div>
                        </div>
                        <div class="cardName">
                            {{ itemTwo.name }}
                        </div>
                    </div>
                    <div class="AddCard" @click="create(item.id)">
                        +创建业务介绍
                    </div>
                </div>
            </div>
            <el-button type="primary" @click="addTitle"
                style="margin-left: 40px;margin-top: 40px;margin-bottom: 40px;">创建一级标题</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit, } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance() as any;
const Onelist = ref<any>([]);
const emit = defineEmits<{
    (event: "open", val: any, id: any): void;
    (event: "assignment", val: any): void;
}>();
const addTitle = () => {
    ElMessageBox.prompt('请输入标题名称', '新建一级标题', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
    })
        .then(({ value }) => {
            postBusinessTitle(value, '')
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消保存',
            })
        })
};
const edit = (name: string, id: number) => {
    ElMessageBox.prompt('请输入标题名称', '修改一级标题', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputValue: name
    })
        .then(({ value }) => {
            postBusinessTitle(value, id);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消修改',
            })
        })
};
const delOne = (id: number) => {
    ElMessageBox.confirm(
        '确定要删除该标题?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            DelBusinessTitle(id);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
};
const delTwo = (id: number) => {
    ElMessageBox.confirm(
        '确定要删除该业务?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            DelBusinessInfo(id);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
};
const UpDown = (stu: any, id: any, num: number) => {
    let text: any
    if (num == 0) {
        text = '下架'
        stu = 2
    } else if (num == 1) {
        text = '上架'
        stu = 1
    }
    ElMessageBox.confirm(
        `确定要${text}该业务?`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            UpDownBusinessInfo(stu, id);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: `取消${text}`,
            })
        })
}
const create = (id: any) => {
    emit('open', '新建业务详情', id);
}
const showInfo = (obj: any) => {
    emit('open', '查看业务详情', obj.businessId);
    emit('assignment', obj);
}

const getData = () => {
    let params = {

    }
    proxy.API.getBusinessList(params).then((res: any) => {
        Onelist.value = res.data.result;
    })
}
const postBusinessTitle = (name: any, id: any) => {
    let params = {
        name,
        id: id || ''
    };
    proxy.API.postBusinessTitle(params).then((res: any) => {
        if (params.id != '') {
            ElMessage({
                type: 'success',
                message: '保存成功',
            })
        } else {
            ElMessage({
                type: 'success',
                message: '新建成功',
            })
        };
        getData();
    }).catch((err: any) => {
        if (id != '') {
            ElMessage({
                type: 'error',
                message: '修改失败' + err,
            })
        } else {
            ElMessage({
                type: 'error',
                message: '新增失败' + err,
            })
        }
    })
}
const DelBusinessTitle = (id: any) => {
    let params = {
        businessId: id
    };
    proxy.API.DelBusinessTitle(params).then((res: any) => {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getData();
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: '删除失败' + err,
        })
    })
}
const DelBusinessInfo = (id: any) => {
    let params = {
        id
    };
    proxy.API.DelBusinessInfo(params).then((res: any) => {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getData();
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: '删除失败' + err,
        })
    })
}
const UpDownBusinessInfo = (stu: any, id: any) => {
    let params = {
        id,
        status: {
            status: stu
        }
    };
    proxy.API.UpDownBusinessInfo(params).then((res: any) => {
        if (stu == 2) {
            ElMessage({
                type: 'success',
                message: '下架成功',
            })
        } else {
            ElMessage({
                type: 'success',
                message: '上架成功',
            })
        }
        getData();
    }).catch((err: any) => {
        if (stu == 2) {
            ElMessage({
                type: 'error',
                message: '下架失败' + err,
            })
        } else {
            ElMessage({
                type: 'error',
                message: '上架失败' + err,
            })
        }
    })
}
onMounted(() => {
    getData();
});
defineExpose({ getData })
</script>

<style lang="less" scoped>
p {
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}

.Onebox {
    margin-top: 40px;
    margin-left: 40px;
    margin-right: 40px;
}

.OneTitle {
    color: #333;
    font-size: 24px;
    font-weight: bold;
}

.TwoTitle {
    color: #858585;
    font-size: 16px;
    // margin-left: 20px;
    cursor: pointer;
}

.Twobox {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.card {
    width: 480px;
    height: 240px;
    // border: 1px solid red;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 20px;
    margin-left: 80px;
}

.card .pic-img {
    width: 100%;
    height: 80%;
    background-color: #6d6d6d;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
}

.card .cardName {
    width: 100%;
    height: 20%;
    line-height: 48px;
}

.card .bottom {
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    color: #ffffff;
}

.card .bottom .clickNum {
    margin-left: 10px;
}

.card .bottom .collectNum {
    margin-left: 10px;
}

.card .action {
    margin-left: auto;
    margin-right: 10px;
    display: flex;
    align-items: center;
}

.action .item {
    margin-right: 10px;
    cursor: pointer;
}

.action .item:hover {
    color: skyblue;
}

.AddCard {
    height: 196px;
    width: 480px;
    text-align: center;
    line-height: 196px;
    background-color: rgb(242, 242, 242);
    border-radius: 8px;
    color: rgb(2, 167, 240);
    cursor: pointer;
    margin-top: 20px;
    margin-left: 80px;
}

.box {
    max-height: 920px;
    overflow: hidden;
    position: relative;
}
</style>