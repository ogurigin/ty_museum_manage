<template>
    <div class="myDialogClass">
        <el-dialog v-model="isModalVisible" width="30%" :title="title">
        <div class="modal">
            <div class="modal-content">
                <div class="inputItem">
                    <div class="tab">
                        <div class="tabTitle">类型名称</div>
                        <el-input v-model="vipInfo.name" placeholder="请输入内容" class="tabName"></el-input>
                    </div>
                    <div class="tab">
                        <div class="tabTitle">排序</div>
                        <el-input v-model="vipInfo.day" placeholder="请输入内容" class="tabName"></el-input>
                    </div>
                </div>
                <div class="inputItem inputItemTwo">
                    <el-button type="primary"  @click="closeModal(0)">确定</el-button>
                    <el-button n @click="closeModal(1)">取消</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
    </div>
   
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue';
import { ElMessage, } from "element-plus";
const { proxy } = getCurrentInstance() as any;
const isModalVisible = ref(false);
const title = ref('弹窗标题');

let vipInfo = reactive<any>({
    id: '',
    name: '',
    day: '',
    amount: '',
    pic: 'defult'
});
const emit = defineEmits<{
    (event: "close"): void;
}>();
const showModal = (val: string) => {
    isModalVisible.value = true;
    title.value = val;
};

const closeModal = (val: number) => {
    if (val == 0) {
        postMemberPackInfo();
    } else if (title.value == '新增会员') {
        ElMessage({
            type: 'info',
            message: '取消新增',
        })
    }
    isModalVisible.value = false;
    const initialVipInfo = {
        id: '',
        name: '',
        day: '',
        amount: '',
        pic: 'defult'
    };
    Object.assign(vipInfo, initialVipInfo);
};
const postMemberPackInfo = () => {
    let params = {
        ...vipInfo
    };
    proxy.API.postMemberPackInfo(params).then((res: any) => {
        if (params.id != '') {
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
        } else {
            ElMessage({
                type: 'success',
                message: '新增成功',
            })
        }
        emit('close');
    }).catch((err: any) => {
        if (vipInfo.id != '') {
            ElMessage({
                type: 'error',
                message: '修改失败' + err,
            })
        } else {
            ElMessage({
                type: 'success',
                message: '新增失败' + err,
            })
        }
    })
};
const getMemberPackInfo = (id: any) => {
    let params = {
        id
    };
    proxy.API.getMemberPackInfo(params).then((res: any) => {
        vipInfo.id = res.data.result.id;
        vipInfo.amount = res.data.result.amount;
        vipInfo.day = res.data.result.day;
        vipInfo.name = res.data.result.name
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: err,
        })

    })
};
const getId = (id: any) => {
    getMemberPackInfo(id);
};
defineExpose({ showModal, closeModal, getId })
</script>

<style lang="less" scoped>

.title {
    padding: 10px 0;
    display: flex;
    // border-bottom: 1px solid rgb(111, 111, 111);
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
        // min-width: 80px;
        min-width: 60px;
        text-align: left;
        font-size: 14px;
        color: #606266;
    }

    .tabName {
        flex: 1;
    }
}

.myDialogClass{
    :deep .el-dialog {
        border-radius: 10px; 
        .el-dialog__header {
            border-bottom: 1px solid #eee;
        }
    }
    
}
</style>