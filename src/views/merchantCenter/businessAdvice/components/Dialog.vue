<template>
    <div class="myDialogClass">
        <el-dialog v-model="isModalVisible" width="35%" :title="title">
            <div class="modal">
                <div class="modal-content">
                    <div class="inputItem">
                        <div class="tab">
                            <div class="tabTitle"><span style="color: red;">*</span>标题</div>
                            <el-input v-model="advice.name" placeholder="请输入内容" class="tabName"></el-input>
                        </div>
                        <div class="tab">
                            <div class="tabTitle">排序</div>
                            <el-input v-model="advice.sort" placeholder="请输入内容" class="tabName"></el-input>
                        </div>
                        <div class="tab">
                            <div class="tabTitle">描述</div>
                            <el-input v-model="advice.detail" placeholder="请输入内容" class="tabName"></el-input>
                        </div>
                        <div class="tab">
                            <div class="tabTitle">跳转位置</div>
                            <el-input v-model="advice.link" placeholder="请输入内容" class="tabName"></el-input>
                        </div>
                        <div class="tab">
                            <div class="tabTitle">图片</div>
                            <el-upload v-model:file-list="advice.pic" action="http://dfs.taoart.com/image.htm"
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
                        <div class="tab">
                            <div class="tabTitle">视频</div>
                            <el-upload class="upload-demo"
                                action="http://dfs.taoart.com/image.htm?crossOrigin=http://dfs.taoart.com/crossOrigin.html&dir=alonemedia"
                                :auto-upload="true" ref="uploadVedio" :limit="1" :on-exceed="handleExceedVedio"
                                v-model:file-list="advice.videoLink" :on-success="beforeAvatarUploadVedio"
                                :on-remove="handleRemoveVedio">
                                <video v-if="isShow" style="width: 100%;height: auto;" controls :src="VediodialogImageUrl"
                                    class="avatar" height="200px"></video>
                                <el-button v-else size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </div>
                    </div>
                    <div class="inputItem inputItemTwo">
                        <el-button type="primary" @click="closeModal(0)">确定</el-button>
                        <el-button plain @click="closeModal(1)">取消</el-button>
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

let advice = reactive<any>({
    id: '',
    name: '',
    sort: '',
    link: '',
    pic: [],
    videoLink: [],
    detail: ''
});
const Tgtoptions = reactive<any>({});

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref<UploadInstance>()
const uploadVedio = ref<UploadInstance>()
const isShow = ref(false)
const VediodialogImageUrl = ref('');


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
const PostSuggetInfo = () => {
    let Other = JSON.parse(JSON.stringify(advice));
    let params = {
        ...Other
    };
    if (Other.pic[0].response) {
        params.pic = Other.pic[0].response.url;
        if (Other.videoLink[0].response) {
            params.videoLink = Other.videoLink[0].response.url;
        }
    } else if (Other.videoLink[0].response) {
        params.videoLink = Other.videoLink[0].response.url;
    } else {
        params.pic = Other.pic[0].url;
        params.videoLink = Other.videoLink[0].url;
    }
    proxy.API.PostSuggetInfo(params).then((res: any) => {
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
    if (val == 0) {
        PostSuggetInfo();
    } else if (val == 1) {
        if (advice.id) {
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
    const initialadvice = {
        id: '',
        name: '',
        sort: '',
        link: '',
        pic: [],
        videoLink: [],
        detail: ''
    };
    Object.assign(advice, initialadvice);
    isModalVisible.value = false;
    isShow.value = false;
    VediodialogImageUrl.value = '';
};
const assignment = (obj: any) => {
    advice.name = obj.name;
    advice.detail = obj.detail;
    advice.id = obj.id;
    advice.sort = obj.sort;
    advice.link = obj.link;
    advice.pic.push({
        'url': obj.pic
    });
    advice.videoLink.push({
        'url': obj.videoLink
    });
    isShow.value = true;
    VediodialogImageUrl.value = obj.videoLink;
}
//图片移除
const handleRemove: UploadProps['onRemove'] = () => {
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
//视频超出时限制进行的处理
const handleExceedVedio: UploadProps['onExceed'] = (files) => {
    uploadVedio.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadVedio.value!.handleStart(file);
    uploadVedio.value!.submit();
}

const beforeAvatarUploadVedio: UploadProps['onSuccess'] = (response: any) => {
    isShow.value = true;
    VediodialogImageUrl.value = response.url;
}
const handleRemoveVedio: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    uploadVedio.value!.clearFiles();
    isShow.value = false;
    VediodialogImageUrl.value = '';
}
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
        text-align: right;
        font-size: 14px;
        margin-right: 20px;
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