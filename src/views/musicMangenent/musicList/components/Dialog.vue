<template>
    <div class="myDialogClass">
        <el-dialog v-model="isModalVisible" width="35%" :title="title">
            <div class="modal">
                <div class="modal-content">
                    <div class="inputItem">
                        <div class="tab">
                            <div class="tabTitle"><span style="color: red;">*</span>合集名称</div>
                            <el-input v-model="newMusic.name" placeholder="请输入内容" class="tabName"></el-input>
                        </div>
                        <div class="tab">
                            <div class="tabTitle">选择关联</div>
                            <el-radio-group v-model="newMusic.associationType" class="ml-4" @change="handleRadioChange">
                                <el-radio label="1" size="large">场馆</el-radio>
                                <el-radio label="2" size="large">展览</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="tab" :hidden="newMusic.associationType == '2'">
                            <div class="tabTitle">关联场馆</div>
                            <el-select v-model="newMusic.associationId" placeholder="请选择" :teleported="false" filterable
                                remote :remote-method="sreachVenue" v-loadMore="moreVenue">
                                <el-option v-for="item in Venueoptions" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="tab" :hidden="newMusic.associationType == '1'">
                            <div class="tabTitle">关联展览</div>
                            <el-select v-model="newMusic.associationId" placeholder="请选择" :teleported="false" filterable
                                remote :remote-method="sreachZL" v-loadMore="moreZL">
                                <el-option v-for="item in ZLoptions" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="tab">
                            <div class="tabTitle">音频介绍</div>
                            <el-input type="textarea" autosize placeholder="请输入内容" v-model="newMusic.des" maxlength="2000"
                                show-word-limit>
                            </el-input>
                        </div>
                        <div class="tab">
                            <div class="tabTitle">图片</div>
                            <upload1 ref="upload"></upload1>
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
import upload1 from '@/components/upload1.vue';
const { proxy } = getCurrentInstance() as any;

const isModalVisible = ref(true);
const title = ref('新增音频');

let newMusic = reactive<any>({
    name: '',
    associationType: '1',
    associationId: '',
    pic: [],
    des: ''
});
const query = reactive({
    venueType: '',
    name: '',
    currentPage: 1,
    pageSize: 10,
    pageTotal: 1,
    finished: false
});
const queryTwo = reactive({
    venueType: '',
    name: '',
    currentPage: 1,
    pageSize: 10,
    pageTotal: 1,
    finished: false
});
const ZLoptions = ref<any>([]);
const Venueoptions = ref<any>([]);
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref<any>()


const emit = defineEmits<{
    (event: "refresh"): void;
    (event: 'close'): void
}>();
const loadMore = () => {
    // 防抖处理
    setTimeout(() => {
        if (query.currentPage >= query.pageTotal || query.finished) {
            return
        } else {
            query.currentPage += 1
            //   sreachVenueTwo()
        }
    }, 500)
}
//触底加载更多场馆
const moreVenue = () => {
    // 防抖处理
    setTimeout(() => {
        if (query.currentPage >= query.pageTotal || query.finished) {
            return
        } else {
            query.currentPage += 1
            sreachVenueTwo()
        }
    }, 500)
}
//关联场馆加载更多
const sreachVenueTwo = () => {
    proxy.API.getVenueList({
        pageNum: query.currentPage,
        pageSize: query.pageSize,
        name: query.name || '',
        status: '0',
        venueType: query.venueType || ''
    }).then((res: any) => {
        if (res.data.result.result.length >= 0) {
            query.pageTotal = res.data.result.pages
            query.currentPage = res.data.result.page
            console.log(Venueoptions.value);
            if (query.currentPage > query.pageTotal) {
                query.finished = true
                console.log(Venueoptions.value);
            } else {
                Venueoptions.value = [...Venueoptions.value, ...res.data.result.result];
            }
            console.log(Venueoptions.value);
        } else {
            query.finished = true
        }
    });
}
//关联场馆筛选功能
const sreachVenue = (e: string) => {
    if (e) {
        query.name = e;
    } else {
        query.name = ''
    }
    query.currentPage = 1;
    proxy.API.getVenueList({
        pageNum: query.currentPage,
        pageSize: query.pageSize,
        name: query.name || '',
        status: '0',
        venueType: query.venueType || ''
    }).then((res: any) => {
        query.pageTotal = res.data.result.pages
        query.currentPage = res.data.result.page
        if (res.data.result.result.length >= 0) {
            Venueoptions.value = res.data.result.result
        }
    });
};
//触底加载更多展览
const moreZL = () => {
    // 防抖处理
    setTimeout(() => {
        if (queryTwo.currentPage >= queryTwo.pageTotal || queryTwo.finished) {
            return
        } else {
            queryTwo.currentPage += 1;
            sreachZLTwo()
        }
    }, 500)
}
//关联展览筛选功能
const sreachZL = (e: string) => {
    if (e) {
        queryTwo.name = e;
    } else {
        queryTwo.name = ''
    }
    queryTwo.currentPage = 1;
    proxy.API.getTrumInfo({
        pageNum: queryTwo.currentPage,
        pageSize: queryTwo.pageSize,
        venueId: '',
        name: queryTwo.name || '',
        status: '0',
        venueType: queryTwo.venueType || ''
    }).then((res: any) => {
        queryTwo.pageTotal = res.data.result.pages
        queryTwo.currentPage = res.data.result.page
        if (res.data.result.result.length >= 0) {
            ZLoptions.value = res.data.result.result
        }
    });
};
//关联展览加载更多
const sreachZLTwo = () => {
    proxy.API.getTrumInfo({
        pageNum: queryTwo.currentPage,
        pageSize: queryTwo.pageSize,
        name: queryTwo.name || '',
        venueId: '',
        status: '0',
        venueType: queryTwo.venueType || ''
    }).then((res: any) => {
        if (res.data.result.result.length >= 0) {
            queryTwo.pageTotal = res.data.result.pages
            queryTwo.currentPage = res.data.result.page
            if (queryTwo.currentPage > queryTwo.pageTotal) {
                queryTwo.finished = true
            } else {
                ZLoptions.value = [...ZLoptions.value, ...res.data.result.result];
            }
        } else {
            queryTwo.finished = true
        }
    });
}
const showModal = () => {
    isModalVisible.value = true;
}
const closeModal = (val: number) => {
    if (val == 0) {
        // PostSuggetInfo();
        console.log('1111');
        newMusic.pic = upload.value.uploadImg();
        postMusicList();
        console.log(newMusic);
    } else if (val == 1) {
        if (newMusic.id) {
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
        emit('close')
    }
};
const handleRadioChange = ()=>{
    newMusic.associationId = '';
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
//上传音频合集
const postMusicList = () => {
    proxy.API.postMusicList({
        ...newMusic
    }).then((res: any) => {
        if (res.data.success) {
            ElMessage({
                type: 'success',
                message: '新增成功',
            });
            emit('close')
        } else {
            ElMessage({
                type: 'success',
                message: '新增失败',
            });
        }
    }).catch((err: any) => {
        ElMessage({
            type: 'success',
            message: '错误' + err,
        });
    })
}
onMounted(() => {
    sreachVenueTwo();
    sreachZLTwo();
    // nextTick(()=>{
    //     sreachVenueTwo();
    // })
})
defineExpose({ showModal, closeModal, })
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

.myDialogClass {
    :deep .el-dialog {
        border-radius: 10px;

        .el-dialog__header {
            border-bottom: 1px solid #eee;
        }
    }

}
</style>