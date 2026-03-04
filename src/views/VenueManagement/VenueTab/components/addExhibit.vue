<template>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text"><span class="require">*</span>展览名称</div>
                <div class="inputBox">
                    <el-input v-model="TrumInfo.name" placeholder="请输入内容"></el-input>
                </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text"><span class="require">*</span>主办单位</div>
                <div class="inputBox">
                    <el-input v-model="TrumInfo.unit" placeholder="请输入内容"></el-input>
                </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text">展览标签</div>
                <div class="inputBox">
                    <el-select v-model="TrumInfo.label" style="width:100%" placeholder="请选择标签" :teleported="false"
                        v-loadMore="loadMoreTwo" multiple>
                        <el-option v-for="item in Zloptions" :key="item.value" :label="item.label" :value="item.value">
                            <span>{{ item.label }}</span>
                            <el-button type="text" icon="el-icon-close" @click.stop="removeTag(item)" style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        ">删除</el-button>
                        </el-option>
                    </el-select>
                </div>
                <el-button class="btnAdd" type="primary" :icon="Plus" @click="handleAdd">添加标签</el-button>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text">展览数量</div>
                <div class="inputBox">
                    <el-input type="number" v-model="TrumInfo.number" placeholder="请输入内容"></el-input>
                </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text">展览分类</div>
                <div class="inputBox">
                    <el-select v-model="TrumInfo.type" style="width:100%" placeholder="请选择分类">
                        <el-option v-for="item in ZLType" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text">展览空间</div>
                <div class="inputBox">
                    <el-select v-model="TrumInfo.space" style="width:100%" placeholder="请选择空间">
                        <el-option v-for="item in ZLSpace" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text">展览费用</div>
                <div class="inputBox">
                    <el-input type="number" v-model="TrumInfo.price" placeholder="请输入内容"></el-input>
                </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text"><span class="require">*</span>展览时间</div>
                <div class="inputBox">
                    <el-date-picker v-model="TrumInfo.timeArray" type="datetimerange" :shortcuts="shortcuts"
                        range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" />
                </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text">展览主题</div>
                <div class="inputBox">
                    <el-select v-model="TrumInfo.theme" style="width:100%" placeholder="请选择主题" :teleported="false"
                        v-loadMore="loadMore">
                        <el-option v-for="item in Themeoptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button class="btnAdd" type="primary" :icon="Plus" @click="handleAddType">添加主题</el-button>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="14">
            <div class="trumTtem felxT" style="width: 100%;">
                <div class="text">展览简介</div>
                <Editor ref="edt" :content="TrumInfo.des" />
            </div>
        </el-col>
        <el-col :span="7">
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="24">
                    <div class="trumTtem">
                        <div class="text"><span class="require">*</span>展览城市</div>
                        <div class="inputBox">
                            <el-cascader size="large" style="width:100%" :options="ZLCity" v-model="selectedOptions"
                                @change="handleChange" :append-to-body="false" :filterable="true" placeholder="请选择展览城市">
                            </el-cascader>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div class="trumTtem felxT">
                        <div class="text"><span class="require">*</span>展览轮播图</div>
                        <upload-lun ref="avaUp1" class="uploadCont"></upload-lun>
                    </div>
                </el-col>
            </el-row>

        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="14">
            <div class="trumTtem felxT" style="width: 100%;">
                <div class="text">承办单位简介</div>
                <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="TrumInfo.companyDes"></el-input>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem felxT">
                <div class="text">展览清单</div>
                <upload-img ref="avaUp2" class="uploadCont"></upload-img>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 60px;">
        <el-col :span="24">
            <div class="footer">
                <el-button class="btnAdd" size="large" @click="cancel">取消</el-button>
                <el-button class="btnAdd" type="primary" size="large" @click="submitForm">确定</el-button>
            </div>
        </el-col>
    </el-row>
    <!-- 编辑弹出框 -->
    <div class="myDialogClass">
        <el-dialog title="添加展览标签" v-model="editVisible" width="25%">
            <el-form label-width="70px">
                <el-form-item label="标签名称">
                    <el-input v-model="tagName"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="postTabs">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
    <div class="myDialogClass">
        <el-dialog title="添加展览主题" v-model="editVisible1" width="25%">
            <el-form label-width="70px">
                <el-form-item label="主题名称">
                    <el-input v-model="typeName"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible1 = false">取 消</el-button>
                    <el-button type="primary" @click="postThemes">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang='ts'>
import { ref, defineProps, defineEmits, defineExpose, toRaw, onMounted, nextTick } from 'vue';
import { ElMessage,ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data';
import uploadImg from "../../../../components/upload1.vue";
import uploadLun from "../../../../components/uploadImg.vue";
import moment from "moment";
import { forEach } from "lodash";
const { proxy } = getCurrentInstance() as any;
const props = defineProps<{
    detailId: number
}>()
interface FORM {
    id: number,
    name: string,
    unit: string,
    label: any,
    number: string,
    type: string,
    space: string,
    price: string,
    imglist: any,
    imglistTwo: any,
    timeArray: any,
    theme: string,
    des: string,
    city: string,
    companyDes: string,
}
const TrumInfo = ref<FORM>({
    id: 0,
    name: '',
    unit: '',
    label: [],
    number: '',
    type: '',
    space: '',
    price: '',
    imglist: [],
    imglistTwo: [],
    timeArray: ['', ''],
    theme: '',
    des: '',
    city: '',
    companyDes: '',
});
const query = reactive<any>({
    pageNum: 1,
    pageTotal: 1,
    finished: false,
})
const query1 = reactive<any>({
    pageNum: 1,
    pageTotal: 1,
    finished: false,
})
const tagName = ref(null) as any;
const typeName = ref(null) as any;
const Zloptions = ref([]) as any;
const ZLType = ref([
    {
        value: 1,
        label: "历史文物"
    }, {
        value: 2,
        label: "人文艺术"
    }, {
        value: 3,
        label: "自然科学"
    }, {
        value: 4,
        label: "革命历史"
    }, {
        value: 5,
        label: "文明互鉴"
    }]) as any
const ZLSpace = ref([
    {
        value: 1,
        label: "博物馆"
    }, {
        value: 2,
        label: "美术馆"
    }, {
        value: 3,
        label: "纪念馆"
    }, {
        value: 4,
        label: "图书馆"
    }
]) as any;
const Themeoptions = ref([]) as any;
const editVisible = ref(false);
const editVisible1 = ref(false);
const avaUp1 = ref(null) as any
const avaUp2 = ref(null) as any
const selectedOptions = ref([]) as any;
const edt = ref();
const ZLCity = ref([...provinceAndCityData]);
const handleAdd = () => {
    editVisible.value = true
}
const handleAddType = () => {
    editVisible1.value = true
}
const handleChange = (value: any) => {
    if (value[1] != null && value[2] != null) {
        var dz = CodeToText[value[0]] + '/' + CodeToText[value[1]] + '/' + CodeToText[value[2]]
    } else {
        if (value[1] != null) {
            dz = CodeToText[value[0]] + '/' + CodeToText[value[1]]
        } else {
            dz = CodeToText[value[0]]
        }
    }
    TrumInfo.value.city = dz
}
const returnInfo = (val: any) => {
    const info = toRaw(val)
    TrumInfo.value.id = info.id
    TrumInfo.value.name = info.name
    TrumInfo.value.unit = info.unit
    if(info.label && info.label !=''){
        // TrumInfo.value.label = info.label.split(',').toString();
        TrumInfo.value.label = info.label.split(',');
    }else{
        TrumInfo.value.label = [];
    }
    console.log(TrumInfo.value.label);
    
    TrumInfo.value.number = info.number
    TrumInfo.value.type = info.type
    TrumInfo.value.space = info.space
    TrumInfo.value.price = info.price
    TrumInfo.value.theme = info.theme
    TrumInfo.value.des = info.des
    TrumInfo.value.city = info.city
    TrumInfo.value.companyDes = info.companyDes
    if (info.city) {
        let arr = info.city ? info.city.split('/') : ''
        if (arr[0] == '天津市' || arr[0] == '北京市' || arr[0] == '重庆市' || arr[0] == '上海市') {
            arr[1] = '市辖区'
        };
        let city = TextToCodeNum(arr)
        selectedOptions.value = city
    }
    TrumInfo.value.timeArray[0] = info.startDate ? moment(info.startDate).format("YYYY-MM-DD") : ''
    TrumInfo.value.timeArray[1] = info.endDate ? moment(info.endDate).format("YYYY-MM-DD") : ''
    nextTick(() => {
        if (info.headPics) {
            let arr = [] as any
            info.headPics = info.headPics.split(',')
            forEach(info.headPics, ele => {
                arr.push({
                    url: ele
                })
            })
            avaUp1.value.returnImg(arr)
        }
        if (info.pics) {
            avaUp2.value.returnImg(info.pics)
        }
    })
}
const shortcuts = [
    {
        text: 'Last week',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: 'Last month',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: 'Last 3 months',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]
const emit = defineEmits<{
    (event: 'closeDoor', val: string): void
    (event: 'updated', val: string): void
}>()
const postTrumInfo = async () => {
    if (!TrumInfo.value.name) {
        ElMessage.warning('请输入展览名称!')
        return
    }
    if (!TrumInfo.value.unit) {
        ElMessage.warning('请输入主办单位!')
        return
    }
    if (!TrumInfo.value.timeArray[0] || !TrumInfo.value.timeArray[1]) {
        ElMessage.warning('请输入展览时间!')
        return
    }
    if (!TrumInfo.value.city) {
        ElMessage.warning('请输入展览城市!')
        return
    }
    await Promise.all([
        avaUp1.value.uploadImg()
    ]).then((res: any) => {
        if (res != 'err') {
            let arr = [] as any;
            forEach(res, ele => {
                forEach(ele, a => {
                    arr.push(a.url)
                })
            })
            TrumInfo.value.imglist = arr.toString()
        } else {
            ElMessage.warning('请上传展览轮播图！')
        }
    })
    await Promise.all([
        avaUp2.value.uploadImg()
    ]).then((res: any) => {
        if (res != 'err') {
            TrumInfo.value.imglistTwo = res.toString()
        } else {
            TrumInfo.value.imglistTwo = ''
        }
    })
    TrumInfo.value.timeArray = toRaw(TrumInfo.value.timeArray)
    let startDate = ''
    let endDate = ''
    if (TrumInfo.value.timeArray.length) {
        startDate = moment(TrumInfo.value.timeArray[0]).format("YYYY-MM-DD")
        endDate = moment(TrumInfo.value.timeArray[1]).format("YYYY-MM-DD")
    }
    proxy.API.postTrumInfo({
        name: TrumInfo.value.name,
        unit: TrumInfo.value.unit,
        label: TrumInfo.value.label.join(','),
        number: TrumInfo.value.number,
        type: TrumInfo.value.type,
        space: TrumInfo.value.space,
        price: TrumInfo.value.price,
        theme: TrumInfo.value.theme,
        des: TrumInfo.value.des,
        city: TrumInfo.value.city,
        companyDes: TrumInfo.value.companyDes,
        headPics: TrumInfo.value.imglist,
        venueId: props.detailId,
        pics: TrumInfo.value.imglistTwo,
        startDate: startDate,
        endDate: endDate,
        status: 1,
    }).then((res: any) => {
        if (res.data.success) {
            ElMessage.success('添加成功')
            emit('updated', 'second')
        }
    })
}
const getThemes = () => {
    proxy.API.getTabs({
        pageNum: query.pageNum,
        venueId: '',
        type: 4
    }).then((res: any) => {
        if (res.data.success) {
            if (res.data.result.result.length > 0) {
                query.pageTotal = res.data.result.pages
                query.pageNum = res.data.result.page
                if (query.pageNum > query.pageTotal) {
                    query.finished = true
                } else {
                    const newArray = res.data.result.result.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.name
                        }
                    })
                    Themeoptions.value = [...Themeoptions.value, ...newArray]
                }

            } else {
                query.finished = true
            }
        } else {
            query.finished = true
        }
    }).catch((res: any) => {
        query.finished = true
        console.log(res)
    })
}
const loadMore = () => {
    // 防抖处理
    setTimeout(() => {
        if (query.pageNum >= query.pageTotal || query.finished) {
            return
        } else {
            query.pageNum += 1
            getThemes()
        }
    }, 500)
}
const postThemes = () => {
    if (!typeName.value) {
        ElMessage.warning('请输入主题名称!')
        editVisible1.value = false
        return
    }
    proxy.API.postTabs({
        name: typeName.value,
        type: 4
    }).then((res: any) => {
        if (res.data.success) {
            editVisible1.value = false
            getThemes()
        }
    })
}
const getTabs = () => {
    proxy.API.getTabs({
        pageNum: query1.pageNum,
        venueId: '',
        type: 3
    }).then((res: any) => {
        if (res.data.success) {
            if (res.data.result.result.length > 0) {
                query1.pageTotal = res.data.result.pages
                query1.pageNum = res.data.result.page
                if (query1.pageNum > query1.pageTotal) {
                    query1.finished = true
                } else {
                    const newArray = res.data.result.result.map((item: any) => {
                        return {
                            value: item.id.toString(),
                            label: item.name
                        }
                    })
                    Zloptions.value = [...Zloptions.value, ...newArray]
                }
            } else {
                query1.finished = true
            }

        }
    }).catch((res: any) => {
        query1.finished = true
    })
}
const loadMoreTwo = () => {
    // 防抖处理
    setTimeout(() => {
        if (query1.pageNum >= query1.pageTotal || query1.finished) {
            return
        } else {
            query1.pageNum += 1
            getTabs()
        }
    }, 500)
}
const postTabs = () => {
    if (!tagName.value) {
        ElMessage.warning('请输入类型名称!')
        editVisible.value = false
        return
    }
    proxy.API.postTabs({
        name: tagName.value,
        type: 3
    }).then((res: any) => {
        if (res.data.success) {
            editVisible.value = false
            getTabs()
        }
    })
}
const TextToCodeNum = (value: any) => {
    let city = [TextToCode[value[0]].code, TextToCode[value[0]][value[1]].code]
    return city
}
const ChangeTrumInfo = async () => {
    if (!TrumInfo.value.name) {
        ElMessage.warning('请输入展览名称!')
        return
    }
    if (!TrumInfo.value.unit) {
        ElMessage.warning('请输入主办单位!')
        return
    }
    if (!TrumInfo.value.timeArray[0] || !TrumInfo.value.timeArray[1]) {
        ElMessage.warning('请输入展览时间!')
        return
    }
    if (!TrumInfo.value.city) {
        ElMessage.warning('请输入展览城市!')
        return
    }
    await Promise.all([
        avaUp1.value.uploadImg()
    ]).then((res: any) => {
        if (res != 'err') {
            let arr = [] as any;
            forEach(res, ele => {
                forEach(ele, a => {
                    arr.push(a.url)
                })
            })
            TrumInfo.value.imglist = arr.toString()
        } else {
            ElMessage.warning('请上传展览轮播图！')
        }
    })
    await Promise.all([
        avaUp2.value.uploadImg()
    ]).then((res: any) => {
        if (res != 'err') {
            TrumInfo.value.imglistTwo = res.toString()
        } else {
            TrumInfo.value.imglistTwo = ''
        }
    })
    TrumInfo.value.timeArray = toRaw(TrumInfo.value.timeArray)
    let startDate = ''
    let endDate = ''
    if (TrumInfo.value.timeArray.length) {
        console.log('ssy ')
        startDate = moment(TrumInfo.value.timeArray[0]).format("YYYY-MM-DD")
        endDate = moment(TrumInfo.value.timeArray[1]).format("YYYY-MM-DD")
    }
    proxy.API.ChangeTrumInfo({
        id: TrumInfo.value.id,
        name: TrumInfo.value.name,
        unit: TrumInfo.value.unit,
        label: TrumInfo.value.label.join(','),
        number: TrumInfo.value.number,
        type: TrumInfo.value.type,
        space: TrumInfo.value.space,
        price: TrumInfo.value.price,
        theme: TrumInfo.value.theme,
        des: TrumInfo.value.des,
        city: TrumInfo.value.city,
        companyDes: TrumInfo.value.companyDes,
        headPics: TrumInfo.value.imglist,
        venueId: props.detailId,
        pics: TrumInfo.value.imglistTwo,
        startDate: startDate,
        endDate: endDate,
        status: 1,
    }).then((res: any) => {
        if (res.data.success) {
            ElMessage.success('修改成功')
            emit('updated', 'second')
        }
    })
}
const removeTag = (item: any) => {
    console.log(item, '点击的option');
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
const delTag = (item: any) => {
    proxy.API.delTabs({
        id: item.value
    }).then((res: any) => {
        if (res.data.success) {
            const index = Zloptions.value.findIndex((option: any) => option.value === item.value);
            if (index !== -1) {
                Zloptions.value.splice(index, 1);
            }
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        }
    })
}
const submitForm = () => {
    TrumInfo.value.des = edt.value.syncHTML()
    if (TrumInfo.value.id && TrumInfo.value.id != 0) {
        ChangeTrumInfo()
    } else {
        postTrumInfo()
    }
}
const cancel = () => {
    emit('closeDoor', 'second')
}
onMounted(() => {
    tagName.value = ''
    typeName.value = ''
    query.pageNum = 1
    query1.pageNum = 1
    query.finished = false
    query1.finished = false
    getTabs()
    getThemes()
    window.addEventListener('popstate', function () {
        emit('closeDoor', 'second')
    }, true)
})
defineExpose({
    returnInfo
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

.footer {
    padding: 0 150px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
}

.trumTtem {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 480px;
    position: relative;

    .text {
        min-width: 100px;
        text-align: end;
        margin-right: 16px;

        .require {
            display: inline-block;
            margin-right: 4px;
            height: 16px;
            line-height: 16px;
            color: red;
        }
    }

    .inputBox {
        width: 380px;
    }

    .btnAdd {
        position: absolute;
        right: -125px;
        top: 0;
    }
}

.felxT {
    align-items: start;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>