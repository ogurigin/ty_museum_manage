<template>
    <div class="videoInput">
        <div class="videoInp">
            <div class="text"><span class="require">*</span>合集名称</div>
            <el-input v-model="formInline.name" placeholder="请输入合集名称"></el-input>
        </div>
    </div>
    <div class="videoInput">
        <div class="videoInp">
            <div class="text"><span class="require">*</span>合集名称</div>
            <el-radio-group v-model="formInline.associationType" class="ml-4" @change="handleRadioChange">
                <el-radio label="1" size="large">场馆</el-radio>
                <el-radio label="2" size="large">展览</el-radio>
            </el-radio-group>
        </div>
    </div>
    <div class="videoInput">
        <div class="videoInp">
            <div class="text"><span class="require">*</span>选择标签</div>
            <el-select v-model="formInline.label" placeholder="请选择标签" :teleported="false" clearable popper-class="mySelect">
                <el-option v-for="item in labelList" :key="item.value" :label="item.label" :value="item.value">
                    <span>{{ item.label }}</span>
                    <el-button type="text" icon="el-icon-close" @click.stop="removeTag(item)" style="
                                float: right;
                                color: var(--el-text-color-secondary);
                                font-size: 13px;
                            ">删除</el-button>
                </el-option>
            </el-select>

            <el-button type="primary" style="margin-left: 20px;" @click="addTag">添加标签</el-button>
        </div>
    </div>
    <div class="videoInput" style="margin-top: 0;">
        <div class="videoInp" :hidden="formInline.associationType == '2'">
            <div class="text"><span class="require">*</span>关联场馆</div>
            <el-select v-model="formInline.venueId" placeholder="请选择" :teleported="false" filterable remote clearable
                :remote-method="sreachVenue" v-loadMore="moreVenue">
                <el-option v-for="item in Venueoptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="videoInp" :hidden="formInline.associationType == '1'">
            <div class="text"><span class="require">*</span>关联展览</div>
            <el-select v-model="formInline.zlId" placeholder="请选择" :teleported="false" filterable remote clearable
                :remote-method="sreachZL" v-loadMore="moreZL">
                <el-option v-for="item in ZLoptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </div>
    </div>
    <div class="videoInput">
        <div class="videoInp">
            <div class="text"><span class="require">*</span>音频简介</div>
            <el-input type="textarea" autosize placeholder="请输入内容" v-model="formInline.des" maxlength="2000"
                show-word-limit>
            </el-input>
            <!-- <div class="editor">
          <editor :content="formInline.des" ref="NewEditor"></editor>
        </div> -->
        </div>
    </div>
    <div class="videoInput">
        <div class="videoInp" style="align-items: flex-start">
            <div class="text"><span class="require">*</span>图片</div>
            <UploadImg ref="upload"></UploadImg>
        </div>
    </div>
    <div class="videoInput">
        <div class="videoInp" style="align-items: flex-start;flex-direction: column;width: 100%;">
            <el-table :data="tableData" style="width: 100%" max-height="650" border>
                <el-table-column fixed label="排序值" align="center">
                    <template #default="scope">
                        <el-input v-model="scope.row.sort" />
                    </template>
                </el-table-column>
                <el-table-column label="音频标题" align="center">
                    <template #default="scope">
                        <el-input v-model="scope.row.name" />
                    </template>
                </el-table-column>
                <el-table-column label="作者" align="center">
                    <template #default="scope">
                        <el-input v-model="scope.row.name" />
                    </template>
                </el-table-column>
                <el-table-column prop="pic" label="音频图片" align="center" width="500">
                    <template #default="scope">
                        <UploadImg ref="uploadThree" :index="scope.$index" :pic="scope.row.pic"
                            @uploadSuccess="uploadSuccess" :key="scope.row.pic" />
                    </template>
                </el-table-column>
                <el-table-column prop="videoUrl" label="音频文件" align="center">
                    <template #default="scope">
                        <UploadFile ref="uploadTwo" :index="scope.$index" :videoUrl="scope.row.videoUrl"
                            @uploadSuccessTwo="uploadSuccessTwo" :key="scope.row.videoUrl" />
                    </template>
                </el-table-column>
                <el-table-column label="音频字幕" align="center">
                    <template #default="scope">
                        <el-input type="textarea" v-model="scope.row.captions" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button text :icon="Delete" class="green" type="primary"
                            @click.prevent="deleteRow(scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button class="mt-4" style="width: 100%" @click="onAddItem">添加</el-button>
        </div>
    </div>
    <div class="videoInput" style="justify-content: flex-end;">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="sure()">确定</el-button>
    </div>
    <!-- 编辑弹出框 -->
    <div class="myDialogClass">
        <el-dialog title="添加标签" v-model="editVisible" width="25%">
            <el-form label-width="70px">
                <el-form-item label="标签名称">
                    <el-input v-model="tagName"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
    
<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { Plus, Delete } from '@element-plus/icons-vue';
import { genFileId, ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadRawFile, UploadInstance, } from 'element-plus'
import UploadImg from "@/components/upload1.vue";
import UploadFile from "@/components/uploadFile.vue";
const { proxy } = getCurrentInstance() as any;
const props = defineProps({
    msg: Number,
})
interface formInline {
    id: any,
    name: string;
    pic: any;
    des: string;
    associationId: string;
    zlId: string;
    venueId: string;
    associationType: any
    label: any
}
//供应链基本信息
let formInline = reactive<formInline>({
    id: '',
    name: "",
    des: '',
    associationId: '',
    associationType: '1',
    zlId: '',
    venueId: '',
    label: '',
    pic: []
});
const editVisible = ref(false) as any;
const tagName = ref(null) as any;
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref<any>()
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
const query1 = reactive<any>({
    pageNum: 1,
    pageTotal: 1,
    finished: false,
})
const ZLoptions = ref<any>([]);
const Venueoptions = ref<any>([]);
const tableData = ref<any>([]);
const OldtableData = ref<any>([]);
const labelList = ref<any>([]);
const onAddItem = () => {
    if (tableData.value.length > 0) {
        tableData.value.push({
            sort: tableData.value[tableData.value.length - 1].sort + 1,
            name: '',
            pic: '',
            videoUrl: '',
            captions: '',
        })
    } else {
        tableData.value.push({
            sort: tableData.value.length + 1,
            name: '',
            pic: '',
            videoUrl: '',
            captions: '',
        })
    }
    // now.setDate(now.getDate() + 1)

};
const deleteRow = (index: number) => {
    tableData.value.splice(index, 1)
}
const handleRadioChange = () => {
    formInline.associationId = '';
}
const emit = defineEmits<{
    (event: "lookFn", val: any): void;
}>();
const cancel = () => {
    emit("lookFn", null);
};
const sure = () => {
    // formInline.des = NewEditor.value.syncHTML() || ''
    if (props.msg && props.msg != 0) {
        executeOperations(tableData.value, OldtableData.value);
        emit("lookFn", null);
        ElMessage({
            type: 'success',
            message: '修改成功',
        });
    } else {
        // postExchangeInfo();
    }
};
const saveEdit = () => {
    if (!tagName.value) {
        editVisible.value = false
        return
    }
    proxy.API.postMusicLabel({
        name: tagName.value,
    }).then((res: any) => {
        if (res.data.success) {
            editVisible.value = false
            getMusicLabelList()
        }
    })
}
const addTag = () => {
    editVisible.value = true
}
async function executeOperations(userArray: any, backendArray: any) {

    // 新增操作数组
    const insertArray = userArray.filter((userItem: any) => !backendArray.some((backendItem: any) => backendItem.id === userItem.id));

    // 修改操作数组
    // 修改操作数组
    const updateArray = userArray.filter((userItem: any) => backendArray.some((backendItem: any) => backendItem.id === userItem.id && (
        userItem.sort !== backendItem.sort ||
        userItem.name !== backendItem.name ||
        userItem.pic !== backendItem.pic ||
        userItem.videoUrl !== backendItem.videoUrl ||
        userItem.captions !== backendItem.captions
    )));


    // 删除操作数组
    const deleteArray = backendArray.filter((backendItem: any) => !userArray.some((userItem: any) => userItem.id === backendItem.id));
    // 执行新增操作

    const insertPromises = insertArray.map((item: any) => {
        return new Promise((resolve, reject) => {
            // 执行新增操作的逻辑
            // ...
            item.collectionId = props.msg;
            postMusicInfoItem(item);
            // 在适当的位置调用 resolve() 表示操作完成
            // resolve();
        });
    });

    // 执行修改操作
    const updatePromises = updateArray.map((item: any) => {
        return new Promise((resolve, reject) => {
            // 执行修改操作的逻辑
            // ...
            item.collectionId = props.msg;
            updateMusicInfoItem(item);
            // 在适当的位置调用 resolve() 表示操作完成
            // resolve();
        });
    });

    // 执行删除操作
    const deletePromises = deleteArray.map((item: any) => {
        return new Promise((resolve, reject) => {
            // 执行删除操作的逻辑
            // ...
            delpostMusicInfoItem(item.id);
            // 在适当的位置调用 resolve() 表示操作完成
            // resolve();
        });
    });
    postMusicInfo();
    //等待所有操作完成
    await Promise.all([...insertPromises, ...updatePromises, ...deletePromises]);
}
const removeTag = (item: any) => {
    ElMessageBox.confirm(
        '确定要删除吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            delTag(item)
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消操作',
            })
        })

}

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    upload.value!.clearFiles();
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
    upload.value!.submit();
}
//删除标签
const delTag = (item: any) => {
    proxy.API.delMusicLabel({
        id: item.value
    }).then((res: any) => {
        if (res.data.success) {
            const index = labelList.value.findIndex((option: any) => option.value === item.value);
            if (index !== -1) {
                labelList.value.splice(index, 1);
            }
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        }
    })
}
//获取音乐合集详情
const getMusicInfo = () => {
    return new Promise((resolve, reject) => {
        const params = {
            id: props.msg,
        };
        proxy.API.getMusicInfo(params)
            .then((res: any) => {
                Object.assign(formInline, res.data.result);
                formInline.associationId = formInline.associationId;
                formInline.associationType = formInline.associationType.toString();
                upload.value.returnImg(formInline.pic);
                if (formInline.associationType === '1') {
                    formInline.venueId = formInline.associationId;
                } else if (formInline.associationType === '2') {
                    formInline.zlId = formInline.associationId;
                };
                tableData.value = JSON.parse(JSON.stringify(res.data.exports));
                OldtableData.value = JSON.parse(JSON.stringify(res.data.exports));
                resolve(formInline);
            })
            .catch((error: any) => {
                console.error(error);
                reject(error);
            });
    });
};
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
        venueType: query.venueType || '',
    }).then((res: any) => {
        if (res.data.result.result.length >= 0) {
            if (query.currentPage <= query.pageTotal) {
                const newOptions = res.data.result.result;
                query.pageTotal = res.data.result.pages;
                query.currentPage = res.data.result.page;
                Venueoptions.value = [...Venueoptions.value, ...newOptions];
                // 检查 venueId 是否在 Venueoptions 中
                if (formInline.venueId && formInline.venueId != '' && !newOptions.some((option: any) => option.id === formInline.venueId)) {
                    query.currentPage = query.currentPage + 1;
                    sreachVenueTwo(); // 继续加载下一页
                }
            }
        }
    });
};
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
        name: queryTwo.name,
        status: '0',
        venueType: queryTwo.venueType
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
        venueType: queryTwo.venueType || '',
    }).then((res: any) => {
        if (res.data.result.result.length >= 0) {
            if (queryTwo.currentPage <= queryTwo.pageTotal) {
                queryTwo.pageTotal = res.data.result.pages;
                queryTwo.currentPage = res.data.result.page;
                ZLoptions.value = [...ZLoptions.value, ...res.data.result.result];
                // 检查关联展览 ID 是否在当前选项数组中
                if (formInline.zlId && formInline.zlId != '' && !ZLoptions.value.some((option: any) => option.id === formInline.associationId)) {
                    queryTwo.currentPage = queryTwo.currentPage + 1;
                    sreachZLTwo(); // 继续加载下一页
                }
            };
        }
    });
};
//获取合集标签
const getMusicLabelList = () => {
    proxy.API.getMusicLabelList().then((res: any) => {
        if (res.data.success) {
            let newArray = res.data.result.map((item: any) => {
                return {
                    value: item.id.toString(),
                    label: item.name
                }
            });
            labelList.value = [...newArray]
        }
    });
}
const uploadSuccess = (url: any, index: any) => {
    tableData.value[index].pic = url;
}
const uploadSuccessTwo = (url: any, index: any) => {
    tableData.value[index].videoUrl = url;
}

//上传音频合集
const postMusicInfo = () => {
    return new Promise((resolve, reject) => {
        formInline.pic = upload.value.uploadImg();
        if (formInline.associationType == '1') {
            formInline.associationId = formInline.venueId;
        } else if (formInline.associationType == '2') {
            formInline.associationId = formInline.zlId;
        }

        let params = {
            associationType: formInline.associationType,
            associationId: formInline.associationId,
            pic: formInline.pic,
            name: formInline.name,
            des: formInline.des,
            id: formInline.id,
            label: formInline.label
        };
        proxy.API.postMusicInfo(params)
            .then((res: any) => {

            })
            .catch((err: any) => {
                ElMessage({
                    type: 'error',
                    message: '错误' + err,
                });
                reject(err); // 将错误传递给 Promise 的 reject
            });
    });
};
//上传单个音频
const postMusicInfoItem = (obj: any) => {
    let params = {
        ...obj
    };
    proxy.API.postMusicInfoItem(params).then((res: any) => {
    }).catch((err: any) => {
        ElMessage({
            type: 'success',
            message: '错误' + err,
        });
    })
}
//更新单个音频
const updateMusicInfoItem = (obj: any) => {
    let params = {
        ...obj
    };
    proxy.API.updateMusicInfoItem(params).then((res: any) => {
    }).catch((err: any) => {
        ElMessage({
            type: 'success',
            message: '错误' + err,
        });
    })
}
//删除单个音频
const delpostMusicInfoItem = (id: any) => {
    let params = {
        id
    };
    proxy.API.delpostMusicInfoItem(params).then((res: any) => {

    }).catch((err: any) => {
        ElMessage({
            type: 'success',
            message: '错误' + err,
        });
    })
}
onMounted(async () => {
    if (props.msg != 0 && props.msg) {
        formInline.id = props.msg
        await getMusicInfo();
        sreachVenueTwo();
        sreachZLTwo();
        getMusicLabelList()
    }
});
</script>
    
<style lang="less" scoped>
.videoInput {
    display: flex;
    margin-left: 40px;
    margin-right: 40px;
    flex-direction: row;
    flex-wrap: wrap;
}

.videoInp {
    width: 480px;
    min-height: 60px;
    display: flex;
    margin-left: 40px;
    flex-direction: row;
    margin-top: 20px;
    align-items: center;
}

.require {
    color: red;
}

.videoInp .text {
    min-width: 90px;
}

.editor {
    width: 800px;
    height: auto;
}
</style>
<style lang="less">
.mySelect .el-select-dropdown__list .el-select-dropdown__item {
    display: flex;
    justify-content: space-between;
}
</style>