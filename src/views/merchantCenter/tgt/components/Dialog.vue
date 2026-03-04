<template>
    <div class="myDialogClass">
        <el-dialog v-model="isModalVisible" width="35%" :title="title">
            <div class="modal">
                <div class="modal-content">
                    <div class="inputItem">
                        <div class="tab">
                            <div class="tabTitle">推广模式名称</div>
                            <el-input v-model="tgInfo.name" placeholder="请输入内容" class="tabName"></el-input>
                        </div>
                        <div class="tab">
                            <div class="tabTitle">可选推广位置</div>
                            <el-select v-model="tgInfo.locations" multiple placeholder="请选择">
                                <el-option v-for="(item, index) in Tgtoptions" :key="index" :label="item.name"
                                    :value="item.id" :disabled="item.content == 0 ? true : false">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="tab">
                            <div class="tabTitle"><span style="color: red;">*</span>推广类型</div>
                            <el-radio-group v-model="tgInfo.adType">
                                <el-radio :label="1" :disabled="dialogType == 'TgtInfo' ? true : false">按天数推广</el-radio>
                                <el-radio :label="2"
                                    :disabled="dialogType == 'TgtInfo' ? true : false">按点击次数推广(CPC)</el-radio>
                                <el-radio :label="3"
                                    :disabled="dialogType == 'TgtInfo' ? true : false">按成功预约推广(CPS)</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="tab tabItem" v-for="(item, index) in tgInfo.combinationList" :key="index">
                            <div class="tabTitle tabOne"><span style="color: red;">*</span>数量</div>
                            <el-input v-model="item.adCycle" placeholder="请输入内容" class="tabName"></el-input>
                            <div class="tabTitle"><span style="color: red;">*</span>数量金额</div>
                            <el-input v-model="item.adAmount" placeholder="请输入内容" class="tabName"></el-input>
                            <el-button type="primary" style="margin-left: 20px;" @click="delTGcom(index)">删除</el-button>
                        </div>
                    </div>
                    <div class="inputItem inputItemTwo">
                        <el-button type="primary" @click="addTGcom">添加</el-button>
                        <el-button type="primary" @click="closeModal(0)">确定</el-button>
                        <el-button @click="closeModal(1)">取消</el-button>

                    </div>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage } from "element-plus";
import { log } from 'console';
const { proxy } = getCurrentInstance() as any;

const isModalVisible = ref(false);
const title = ref('弹窗标题');

let tgInfo = reactive<any>({
    name: '',
    adType: '',
    locations: [],
    combinationList: [{
        adAmount: null,
        adCycle: ''
    }],
    old: {},
});
const Tgtoptions = reactive<any>({});
const dialogType = ref<string>('');
const emit = defineEmits<{
    (event: "refresh"): void;
}>();
const showModal = (val: string) => {
    isModalVisible.value = true;
    title.value = val;
};
onMounted(() => {
    getShowcaseList();
});
const postTgtInfo = (obj: any) => {
    let params = JSON.parse(JSON.stringify(obj));
    proxy.API.postTgtInfo(params).then((res: any) => {
        ElMessage({
            type: 'success',
            message: '新增成功',
        });
        emit('refresh');
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: err,
        });
    })
};
const postTgtInfoCN = (obj: any) => {
    let params = {
        name: obj.name.toString(),
        id: obj.id.toString(),
        adAmount: obj.adAmount,
        adCycle: obj.adCycle,
        locations: obj.locations
    };
    proxy.API.postTgtInfoCN(params).then((res: any) => {
        ElMessage({
            type: 'success',
            message: '修改成功',
        });
        emit('refresh');
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: err,
        });
    })
}
const delTgtInfoCN = (obj: any) => {
    let params = obj;
    proxy.API.delTgtInfoCN(params).then((res: any) => {
        ElMessage({
            type: 'success',
            message: '删除成功',
        });
        emit('refresh');
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: err,
        });
    })
}
//获取可选橱窗列表
const getShowcaseList = () => {
    let params = {};
    proxy.API.getShowcaseList(params).then((res: any) => {
        let newArray = res.data.result.map(function (item: any) {
            return {
                name: item.name + ' (' + item.residual + ')',
                content: item.residual,
                id: item.id
            };
        });
        Object.assign(Tgtoptions, newArray);
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: err,
        });
    })
}
const closeModal = (val: number) => {
    console.log(val, title.value);

    if (val == 0 && title.value == '添加推广') {
        postTgtInfo(tgInfo);
    } else if (val == 1 && title.value == '添加推广') {
        ElMessage({
            type: 'info',
            message: '取消新增',
        });
    } else if (val == 0 && title.value == '编辑推广') {
        const newArray = tgInfo.combinationList;
        const oldArray = tgInfo.old.combinationList;

        let hasChanged = false; // 设置一个标记来跟踪是否有改动发生

        // 遍历新数组
        newArray.forEach((newItem: any, index: number) => {
            const foundItem = oldArray.find((oldItem: any) => oldItem.id === newItem.id);
            let result;
            if (foundItem) {
                result = compareObjects(newItem, foundItem);
            }
            if (foundItem && !result) {
                console.log(tgInfo.locations);
                
                // 如果找到了相同id的项，并且有改动，则进行修改
                postTgtInfoCN({
                    id: newItem.id,
                    name: tgInfo.name,
                    adAmount: newItem.adAmount,
                    adCycle: newItem.adCycle,
                    locations: tgInfo.locations
                });
                hasChanged = true; // 标记为有改动
            } else if (newItem.id == void 0) {
                // 如果没有找到相同id的项，则进行新增
                let obj = {
                    // id: "",
                    adType: tgInfo.adType.toString(),
                    name: tgInfo.name,
                    locations: tgInfo.locations,
                    combinationList: [{
                        adAmount: parseInt(newItem.adAmount),
                        adCycle: parseInt(newItem.adCycle),
                    }]
                };
                postTgtInfo(obj);
                hasChanged = true; // 标记为有改动
            }
        });

        // 遍历老数组
        oldArray.forEach((oldItem: any) => {
            const foundItem = newArray.find((newItem: any) => newItem.id === oldItem.id);
            if (!foundItem) {
                // 如果在新数组中找不到相同id的项，则将id取出
                delTgtInfoCN({
                    id: oldItem.id
                });
                hasChanged = true; // 标记为有改动
            }
        });

        // 如果没有改动，则调用 postTgtInfoCN
        if (!hasChanged) {
            // 在这里对老数组进行postTgtInfoCN
            for(let i = 0 ;i < oldArray.length ; i ++){
                postTgtInfoCN({
                    id: oldArray[i].id,
                    name: tgInfo.name,
                    adAmount: oldArray[i].adAmount,
                    adCycle: oldArray[i].adCycle,
                    locations: tgInfo.locations
                });
            }
        }

    }
    isModalVisible.value = false;
    const initialtgInfo = {
        name: '',
        adType: '',
        locations: [],
        combinationList: [{
            adAmount: null,
            adCycle: ''
        }],
        old: {},
    };
    Object.assign(tgInfo, initialtgInfo);
    dialogType.value = '';
    // emit("close");
};
const delTGcom = (index: any) => {
    tgInfo.combinationList.splice(index, 1);
};
//推广通添加数量和金额
const addTGcom = () => {
    tgInfo.combinationList.push({
        adAmount: null,
        adCycle: ''
    })
};
const assignment = (obj: any) => {
    tgInfo.name = obj.name;
    tgInfo.adType = obj.adType;
    tgInfo.locations = obj.location.map((item: any) => {
        return item.showcaseId
    });
    tgInfo.combinationList = obj.data
    tgInfo.old = JSON.parse(JSON.stringify(tgInfo));
    dialogType.value = 'TgtInfo';
}


function compareObjects(obj1: any, obj2: any): boolean {
    // 获取 obj1 和 obj2 的属性名数组
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // 如果属性名数组长度不同，说明两个对象有不同的属性数量，返回 false
    if (keys1.length !== keys2.length) {
        return false;
    }

    // 遍历属性名数组
    for (let key of keys1) {
        // 如果 obj2 不包含 obj1 的某个属性名，返回 false
        if (!obj2.hasOwnProperty(key)) {
            return false;
        }

        const value1 = obj1[key];
        const value2 = obj2[key];

        // 如果 obj1 的属性值和 obj2 的属性值不相等，返回 false
        if (value1 !== value2) {
            return false;
        }
    }

    // 所有属性名和属性值都相等，返回 true
    return true;
}
defineExpose({ showModal, closeModal, assignment })
</script>

<style lang="less" scoped>
.title {
    padding: 10px 0;
    display: flex;
    // border-bottom: 1px solid rgb(111, 111, 111);
}

.inputItemTwo {
    display: flex;
    justify-content: center;
}


.tab {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .tabTitle {
        // min-width: 80px;
        min-width: 100px;
        text-align: left;
        font-size: 14px;
        color: #606266;
    }

    .tabName {
        flex: 1;
    }

    .tabOne {
        min-width: 60px !important;
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

.myDialogClass {
    :deep .el-dialog {
        border-radius: 10px;

        .el-dialog__header {
            border-bottom: 1px solid #eee;
        }
    }

}
</style>