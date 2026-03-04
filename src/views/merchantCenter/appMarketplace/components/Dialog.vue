<template>
    <div class="myDialogClass">
        <el-dialog v-model="isModalVisible" width="35%" :title="title">
            <div class="modal">
                <div class="modal-content">
                    <div class="inputItem">
                        <div class="tab">
                            <div class="tabTitle"><span style="color: red;">*</span>标题</div>
                            <el-input v-model="busInfo.name" placeholder="请输入内容" class="tabName"></el-input>
                        </div>
                        <div class="tab">
                            <div class="tabTitle"><span style="color: red;">*</span>业务介绍</div>
                            <el-input type="textarea" autosize placeholder="请输入内容" v-model="busInfo.detail" maxlength="2000"
                                show-word-limit>
                            </el-input>
                        </div>
                        <div class="tab">
                            <div class="tabTitle"><span style="color: red;">*</span>业务类型</div>
                            <el-select v-model="busInfo.typeId" placeholder="请选择">
                                <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="tab">
                            <div class="tabTitle"><span style="color: red;">*</span>图片</div>
                            <el-upload v-model:file-list="busInfo.pic" action="http://dfs.taoart.com/image.htm"
                                ref="upload" list-type="picture-card" :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove" :limit="1" :on-exceed="handleExceed" :auto-upload="true">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                            </el-upload>
                            <el-dialog v-model="dialogVisible">
                                <img w-full :src="dialogImageUrl" alt="Preview Image" />
                            </el-dialog>
                        </div>
                    </div>
                    <div class="inputItem inputItemTwo">
                        <el-button type="primary"  @click="closeModal(0)">确定</el-button>
                        <el-button  @click="closeModal(1)">取消</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile } from "element-plus";
const { proxy } = getCurrentInstance() as any;

const isModalVisible = ref(false);
const title = ref('弹窗标题');
let busInfo = reactive<any>({
    id: '',
    name: '',
    detail: '',
    typeId: '',
    businessId: '',
    pic: []
});

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref<UploadInstance>()
const option = reactive<any>([])


const emit = defineEmits<{
    (event: "refresh"): void;
}>();
const showModal = (val: string, id: any) => {
    isModalVisible.value = true;
    title.value = val;
    busInfo.businessId = id
};

const postBusinessInfo = () => {
    let Other = JSON.parse(JSON.stringify(busInfo));
    let params = {
        ...Other
    };
    if (Other.pic[0].response) {
        params.pic = Other.pic[0].response.url;
    } else {
        params.pic = Other.pic[0].url;
    }
    proxy.API.postBusinessInfo(params).then((res: any) => {
        if (params.id != '') {
            ElMessage({
                type: 'success',
                message: '修改成功',
            });
        } else {
            ElMessage({
                type: 'success',
                message: '新增成功',
            });
        }
        emit('refresh');
    }).catch((err: any) => {
        if (params.id != '') {
            ElMessage({
                type: 'error',
                message: '修改失败' + err,
            });
        } else {
            ElMessage({
                type: 'error',
                message: '新增失败' + err,
            });
        }
    })
};


//获取业务类型列表
const getBusinessInfoType = () => {
    let params = {};
    proxy.API.getBusinessInfoType(params).then((res: any) => {
        const newArray = res.data.result.map((item: any) => {
            return {
                label: item.name,
                value: item.id
            }
        })
        Object.assign(option, newArray);
    }).catch((err: any) => {
        ElMessage({
            type: 'error',
            message: err,
        });
    })
}
const closeModal = (val: number) => {
    if (val == 0) {
        postBusinessInfo();
    } else if (val == 1) {
        if (busInfo.id) {
            ElMessage({
                type: 'info',
                message: '取消修改',
            });
        } else {
            ElMessage({
                type: 'info',
                message: '取消新增',
            });
        }

    }
    dialogImageUrl.value = '';
    dialogVisible.value = false;
    const initialbusInfo = {
        id: '',
        name: '',
        detail: '',
        typeId: '',
        businessId: '',
        pic: []
    };
    Object.assign(busInfo, initialbusInfo);
    isModalVisible.value = false;
};
const assignment = (obj: any) => {
    busInfo.name = obj.name;
    busInfo.detail = obj.detail;
    busInfo.id = obj.id;
    busInfo.typeId = obj.typeId
    busInfo.pic.push({
        'url': obj.pic
    });
}


//图片移除
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    upload.value!.clearFiles();
}
//图片预览
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
//图片超出时限制进行的处理
const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file);
    upload.value!.submit();
}
onMounted(() => {
    getBusinessInfoType();
});
defineExpose({ showModal, closeModal, assignment })
</script>

<style lang="less" scoped>
// .modal {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background-color: rgba(0, 0, 0, 0.5);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     z-index: 99;
// }

// .modal-content {
//     background-color: #fff;
//     padding: 20px;
//     border-radius: 4px;
//     text-align: center;
//     width: 25%;
//     height: auto;
// }

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

.myDialogClass{
    :deep .el-dialog {
        border-radius: 10px; 
        .el-dialog__header {
            border-bottom: 1px solid #eee;
        }
    }
    
}
</style>