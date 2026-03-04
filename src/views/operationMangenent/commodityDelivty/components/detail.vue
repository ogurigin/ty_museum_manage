<template>
    <div class="myDialogClass">
        <el-dialog title="投放详情" v-model="editVisible" width="28%">
            <div class="tab">
                <div class="tabTitle"><span style="color: red;">*</span>广告周期</div>
                <span v-if="info.adType == 1"  >
                    {{ info.adCycle }}天
                </span>
                <span v-else="info.adType != 1"  >
                    {{ info.adCycle }}次
                </span>
            </div>
            <div class="tab">
                <div class="tabTitle"><span style="color: red;">*</span>广告剩余周期</div>
                <span v-if="info.adType == 1"  >
                    {{ getDaysFromSeconds(info.adResidualCycle) }}天
                </span>
                <span v-else="info.adType != 1"  >
                    {{ info.adResidualCycle }}次
                </span>
            </div>
            <div class="tab">
                <div class="tabTitle"><span style="color: red;">*</span>广告点击次数</div>
                <span >{{ info.adClickCount }}</span>
            </div>
            <div class="tab">
                <div class="tabTitle"><span style="color: red;">*</span>核销次数</div>
                <span>{{ info.adPrebookCount }}</span>
            </div>
            <div class="tab">
                <div class="tabTitle"><span style="color: red;">*</span>转化率</div>
                <span v-if="info.adClickCount != 0 && info.adType == 2">
                    {{ (info.adPrebookCount / info.adResidualCycle * 100).toFixed(0) }}%
                </span>
                <span v-else-if="info.adClickCount != 0 && info.adType != 2">
                    {{ (info.adPrebookCount / info.adClickCount * 100).toFixed(0) }}%
                </span>
                <span v-else>
                    0%
                </span>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="saveEdit()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang='ts'>
import { ref, reactive, defineExpose, defineEmits, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { forEach, uniq, intersection } from "lodash";
const { proxy } = getCurrentInstance() as any;
const editVisible = ref<boolean>(false);
const info = reactive<any>({
    adPrebookCount: '',
    adResidualCycle: '',
    adType: '',
    adCycle: "",
    adClickCount: "",
})
const open = (val: any) => {
    editVisible.value = true;
    getTgtSaleInfo(val);
    console.log(val);
}
const emit = defineEmits<{
    (event: 'updated'): void
}>()

const saveEdit = () => {
    editVisible.value = false
}
const cancel = () => {
    editVisible.value = false
}
const getDaysFromSeconds = (seconds: any) => {
	const secondsInADay = 24 * 60 * 60; // 一天的秒数
	const days = Math.floor(seconds / secondsInADay); // 计算整数天数
	return days;
}
const getTgtSaleInfo = (id: any) => {
    proxy.API.getTgtSaleInfo({
        id
    }).then((res: any) => {
        console.log(res);
        info.adClickCount = res.data.result.adClickCount;
        info.adResidualCycle = res.data.result.adResidualCycle;
        info.adType = res.data.result.adType;
        info.adCycle = res.data.result.adCycle;
        info.adPrebookCount = res.data.result.adPrebookCount;
        console.log( info);
        
    })
}
defineExpose({
    open
})
</script>
<style lang='less' scoped>
.myDialogClass {
    :deep .el-dialog {
        border-radius: 10px;

        .el-dialog__header {
            border-bottom: 1px solid #eee;
        }
    }

}

p {
    font-size: 16px;
}

.typeContent {
    padding: 5px 0px;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;

    .btn {
        margin-left: 20px;
        max-width: 130px;
        min-width: 90px;
        height: 40px;
        white-space: wrap;
        text-align: center;
        overflow: hidden;
    }

    .btn:first-child {
        margin-left: 0;
    }
}

.active {
    color: #fff;
    background: #409EFF;
}

.mt10 {
    margin-top: 10px;
}

.mt20 {
    margin-top: 20px;
}

.tab {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .tabTitle {
        min-width: 120px;
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
        min-width: 120px;
        text-align: left;
        font-size: 14px;
        color: #606266;
    }

    .tabName {
        margin-right: 20px;
    }
}
</style>