<template>
    <div class="parentDoc">
        <section class="leftCont">
            <el-form :model="form" label-width="100px">
                <el-form-item label="企业id">
                    <el-input v-model="form.enterpriseId" placeholder="请输入企业id" />
                </el-form-item>
                <el-form-item label="场馆名称">
                    <el-input v-model="form.name" placeholder="请输入场馆名称" />
                </el-form-item>
                <el-form-item label="营业时间">
                    <el-input v-model="form.workingDate" placeholder="请输入营业时间" />
                </el-form-item>
                <el-form-item label="经度">
                    <el-input v-model="form.longitude" placeholder="请输入经度" />
                </el-form-item>
                <el-form-item label="维度">
                    <el-input v-model="form.latitude" placeholder="请输入维度" />
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address" placeholder="请输入地址" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.venueType" placeholder="请选择类型" :teleported="false" v-loadMore="loadMore">
                        <el-option v-for="item in typeVenue" :key="item.value" :label="item.label" :value="item.value">

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select v-model="form.venueLabel" placeholder="请选择标签" :teleported="false" v-loadMore="loadMoreTwo"
                        multiple popper-class="mySelect">
                        <el-option v-for="item in tipVenue" :key="item.value" :label="item.label" :value="item.value">
                            <span>{{ item.label }}</span>
                            <el-button type="text" icon="el-icon-close" @click.stop="removeTag(item)" style="
                                float: right;
                                color: var(--el-text-color-secondary);
                                font-size: 13px;
                            ">删除</el-button>
                        </el-option>
                    </el-select>
                    <el-button type="primary" style="margin-left: 20px;" @click="addTag">添加标签</el-button>
                </el-form-item>
                <el-form-item label="标签颜色">
                    <el-select v-model="form.labelColors" placeholder="请选择颜色" :teleported="false"
                        multiple popper-class="mySelect">
                        <el-option v-for="item in colorlist" :key="item.value" :label="item.label" :value="item.value">
                            <el-tag class="ml-2" :color="item.label">{{ item.label }}</el-tag>
                            <!-- <el-button type="text" icon="el-icon-close" @click.stop="removeTag(item)" style="
                                float: right;
                                color: var(--el-text-color-secondary);
                                font-size: 13px;
                            ">删除</el-button> -->
                        </el-option>
                    </el-select>
                    <!-- <el-button type="primary" style="margin-left: 20px;" @click="addTag">添加标签</el-button> -->
                </el-form-item>
                <el-form-item label="是否可以预约">
                    <el-radio-group v-model="form.isVisitor" class="ml-4">
                        <el-radio :label="0" size="large">可预约</el-radio>
                        <el-radio :label="1" size="large">不可预约</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否置顶">
                    <el-radio-group v-model="form.isTop" class="ml-4">
                        <el-radio :label="0" size="large">不置顶</el-radio>
                        <el-radio :label="1" size="large">置顶</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="场馆简介">
                    <!-- <el-input v-model="form.des" placeholder="请描述..." type="textarea" :rows="4" /> -->
                    <Editor ref="edt" :content="form.des" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancal">取消</el-button>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </section>
        <section class="rightCont">
            <avatar-upload ref="avaUp"></avatar-upload>
        </section>
        <!-- 编辑弹出框 -->
        <div class="myDialogClass">
            <el-dialog title="添加场馆标签" v-model="editVisible" width="25%">
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
    </div>
</template>
<script setup lang='ts'>
import { ref, defineEmits, defineProps, nextTick, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import avatarUpload from "../../../../components/avatarUpload.vue";
import { useRouter } from 'vue-router';
import editor from "../../../../components/editor.vue";
import moment from "moment";
const { proxy } = getCurrentInstance() as any;
const props = defineProps<{
    detailId: number
}>();
const editVisible = ref(false) as any;
const tagName = ref(null) as any;
const form = ref({
    enterpriseId: '',
    name: '',
    workingDate: '',
    endDate: '',
    startDate: '',
    address: '',
    latitude: '',
    longitude: '',
    venueType: '',
    venueLabel: [],
    isVisitor: '',
    isTop:'',
    labelColors:[],
    des: '',
    pic: ''
}) as any;
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
const avaUp = ref('') as any
const tipVenue = ref([]) as any
const typeVenue = ref([]) as any
const edt = ref('') as any;
const colorlist = ref([
  { label: '#EBDCDC', value: '#EBDCDC' },
  { label: '#C4CBDE', value: '#C4CBDE' },
  { label: '#CCD4DA', value: '#CCD4DA' },
  { label: '#D4D3D6', value: '#D4D3D6' },
  { label: '#F7ECDB', value: '#F7ECDB' },
  { label: '#DDA494', value: '#DDA494' },
  { label: '#F7DAAA', value: '#F7DAAA' },
  { label: '#C7CCBF', value: '#C7CCBF' }
]) as any
const router = useRouter();
const emit = defineEmits<{
    (event: 'Cancal'): void
}>();
const onSubmit = () => {
    UpdateVenueInfo()
}
const cancal = () => {
    emit('Cancal');
}
const UpdateVenueInfo = async () => {
    await Promise.all([
        avaUp.value.uploadImg()
    ]).then((res: any) => {
        if (res != 'err') {
            form.value.pic = res.toString()
        } else {
            form.value.pic = ''
        }
    })
    //拼接标签
    if(form.value.venueLabel){
        form.value.venueLabel = form.value.venueLabel.join(',');
    }else{
        form.value.venueLabel = ''
    };
    //拼接标签颜色
    if(form.value.labelColors){
        form.value.labelColors = form.value.labelColors.join(',');
    }else{
        form.value.labelColors = ''
    };
    //获取富文本
    form.value.des = edt.value.syncHTML();
    proxy.API.UpdateVenueInfo({
        enterpriseId: form.value.enterpriseId,
        id: props.detailId,
        name: form.value.name,
        workingDate: form.value.workingDate,
        startDate: form.value.startDate,
        latitude: form.value.latitude,
        longitude: form.value.longitude,
        address: form.value.address,
        venueType: form.value.venueType,
        venueLabel: form.value.venueLabel,
        labelColors:form.value.labelColors,
        isVisitor: form.value.isVisitor,
        isTop:form.value.isTop,
        des: form.value.des,
        pic: form.value.pic || ''
    }).then((res: any) => {
        if (res.data.success) {
            emit('Cancal');
        } else {
            ElMessage.warning(res.data.errors[0].message)
        }
    })
}
const getVenueTypeList = () => {
    proxy.API.getVenueTypeList({
        pageNum: query1.pageNum,
        pageSize: 99,
        venueId: '',
        type: 2,
        name: ''
    }).then((res: any) => {
        if (res.data.success) {
            query1.pageTotal = res.data.result.pages
            query1.pageNum = res.data.result.page
            if (query1.pageNum > query1.pageTotal) {
                query1.finished = true
            } else {
                let newArray = res.data.result.result.map((item: any) => {
                    return {
                        value: item.id.toString(),
                        label: item.name
                    }
                })
                if (query1.pageNum == 1) {
                    tipVenue.value = [...newArray]
                } else {
                    tipVenue.value = [...tipVenue.value, ...newArray];
                }
            }
        }
    });
}
const getTabs = () => {
    proxy.API.getTabs({
        pageNum: query.pageNum,
        venueId: "",
        type: 1,
        pageSize: 99,
    }).then((res: any) => {
        if (res.data.success) {
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
                if (query.pageNum == 1) {
                    typeVenue.value = [...newArray]
                } else {
                    typeVenue.value = [...typeVenue.value, ...newArray];
                }
            }

        }
    })
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
const loadMore = () => {
    console.log('触底了')
    // 防抖处理
    setTimeout(() => {
        if (query.pageNum >= query.pageTotal || query.finished) {
            return
        } else {
            query.pageNum += 1
            getTabs()
        }
    }, 500)
}
const loadMoreTwo = () => {
    // 防抖处理
    setTimeout(() => {
        if (query1.pageNum >= query1.pageTotal || query1.finished) {
            return
        } else {
            query1.pageNum += 1
            getVenueTypeList()
        }
    }, 500)
}
const getVenueInfo = () => {
    proxy.API.getVenueInfo({
        id: props.detailId
    }).then((res: any) => {
        if (res.data.success && res.data.result) {
            res.data.result.startDate = res.data.result.startDate ? moment(res.data.result.startDate).format("YYYY-MM-DD HH:mm") : ''
            res.data.result.endDate = res.data.result.endDate ? moment(res.data.result.endDate).format("YYYY-MM-DD HH:mm") : ''
            if (res.data.result.venueType == 0) res.data.result.venueType = ''
            if (res.data.result.venueLabel) {
                res.data.result.venueLabel = res.data.result.venueLabel.split(',')
            }
            if(res.data.result.labelColors) {
                res.data.result.labelColors = res.data.result.labelColors.split(',')
            }
            form.value = res.data.result
            console.log(
                form.value
            );
            nextTick(() => {
                avaUp.value.returnImg(res.data.result.pic)
            })
        }
    })
}
const addTag = () => {
    editVisible.value = true
}
const saveEdit = () => {
    if (!tagName.value) {
        editVisible.value = false
        return
    }
    proxy.API.postTabs({
        name: tagName.value,
        type: 2
    }).then((res: any) => {
        if (res.data.success) {
            editVisible.value = false
            getVenueTypeList()
        }
    })
}
const delTag = (item: any) => {
    proxy.API.delTabs({
        id: item.value
    }).then((res: any) => {
        if (res.data.success) {
            const index = tipVenue.value.findIndex((option: any) => option.value === item.value);
            if (index !== -1) {
                tipVenue.value.splice(index, 1);
            }
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        }
    })
}
onMounted(() => {
    getVenueInfo()
    getVenueTypeList()
    getTabs()
    window.addEventListener('popstate', function () {
        router.push('./venueTab')
    }, true)
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

.parentDoc {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .leftCont {
        width: 50%;
        padding-right: 30%;
        overflow: hidden;
    }

    .rightCont {
        width: 50%;

        /deep/.el-upload-list--picture-card>.el-upload--picture-card {
            margin-top: 20px;
            border-radius: 50%;
        }
    }
}


</style>
<style lang="less">
.mySelect .el-select-dropdown__list .el-select-dropdown__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mySelect .el-select-dropdown__list .el-select-dropdown__item .el-tag{
    color: #000;
}
</style>