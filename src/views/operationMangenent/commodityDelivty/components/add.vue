<template>
    <div class="myDialogClass">
        <el-dialog title="添加投放" v-model="editVisible" width="28%">
            <section>
                <section>
                    <p>选择场馆</p>
                    <el-select v-model="query.venueId" data-class="select-class" class="more-select m-2 mt10"
                        placeholder="请选择场馆" size="large" style="width:100%" v-loadMore="loadMore"
                        :popper-class="`more-select-dropdown ${loading && 'loading'}`" @change="changeVenue"
                        :teleported="false" filterable remote clearable :remote-method="sreachVenue">
                        <el-option v-for="(item, index) in venueList" :key="index" :label="item.name" :value="item.id" />
                    </el-select>
                </section>
                <section class="mt20">
                    <p>选择推广业务</p>
                    <section class="typeContent mt10">
                        <el-button class="btn" :class="{ active: activeyIndex == 1 ? true : false }"
                            @click="changeType(1)">场馆</el-button>
                        <el-button class="btn" :class="{ active: activeyIndex == 2 ? true : false }"
                            @click="changeType(2)">展览</el-button>
                        <el-button class="btn" :class="{ active: activeyIndex == 3 ? true : false }"
                            @click="changeType(3)">相关书籍</el-button>
                        <el-button class="btn" :class="{ active: activeyIndex == 4 ? true : false }"
                            @click="changeType(4)">文创商品</el-button>
                    </section>
                    <el-select v-model="query.entityId" class="m-2 mt10" placeholder="请选择业务推广类型" size="large"
                        style="width:100%" :teleported="false" v-loadMore="loadMoreTwo">
                        <el-option v-for="(item, index) in showInfo" :key="index" :label="item.name" :value="item.id" />
                    </el-select>
                </section>
                <section class="mt20">
                    <p>选择推广模式</p>
                    <section class="typeContent mt10">
                        <el-button class="btn" :class="{ active: activetgIndex == 1 ? true : false }"
                            @click="changetgType(1)">按天数推广</el-button>
                        <el-button class="btn" :class="{ active: activetgIndex == 2 ? true : false }"
                            @click="changetgType(2)">按点击次数推广(CPC)</el-button>
                        <el-button class="btn" :class="{ active: activetgIndex == 3 ? true : false }"
                            @click="changetgType(3)">按成功预约推广(CPS)</el-button>
                        <div class="btn"></div>
                    </section>
                </section>
                <section class="mt20">
                    <p>选择推广位置</p>
                    <section class="typeContent mt10">
                        <el-button class="btn" :class="{ active: activewzIndex == index ? true : false }"
                            v-for="(item, index) in  TGlist" :key="index" :label="item.id"
                            @click="changewzType(item.id, index)">{{ item.name }}</el-button>
                    </section>
                </section>
                <section class="mt20" v-if="activetgIndex == 1">
                    <p>选择推广天数</p>
                    <section class="typeContent mt10">
                        <el-button class="btn" :class="{ active: activedayIndex == index ? true : false }"
                            v-for="(item, index) in  Buylist" :key="index" @click="changedayType(item.id, index)">{{
                                item.content }}</el-button>
                        <div class="btn"></div>
                    </section>
                </section>
                <section class="mt20" v-if="activetgIndex != 1">
                    <p>选择推广次数</p>
                    <section class="typeContent mt10">
                        <el-button class="btn" :class="{ active: activecsIndex == index ? true : false }"
                            v-for="(item, index) in  Buylist" :key="index" @click="changecsType(item.id, index)">{{
                                item.content }}</el-button>
                        <div class="btn"></div>
                    </section>
                </section>
            </section>
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
const query = reactive<any>({
    venueId: '',//选择的场馆id
    type: '1',//选择业务的类型
    entityId: '',//选择的业务
    adType: '1',//推广模式类型
    entityName: '',
    pageNum: 1,
    finished: false,
    promotionMealLocationId: '1',//推广位置id
    promotionMealId: '',
    amount: '',
})
const query1 = reactive<any>({
    pageNum: 1,
    finished: false,
})
const query2 = reactive<any>({
    pageNum: 1,
    finished: false,
})
const query3 = reactive<any>({
    pageNum: 1,
    finished: false,
})
const venueList = ref<any>([]);
const zlList = ref<any>([]);//展览信息
const booklist = ref<any>([]); //书籍列表
const goodslist = ref<any>([]); //商品列表
const showInfo = ref<any>([]);
const newLocations = ref<any>([]);
const newBuyList = ref<any>([]);
const adList = ref<any>([]);
const locationList = ref<any>([]);
const TGlist = ref<any>([]);
const Buylist = ref<any>([]);
const allModelList = ref<any>({});
const activeyIndex = ref<number>(1);
const activetgIndex = ref<number>(1);
const activewzIndex = ref() as any;
const activedayIndex = ref() as any;
const activecsIndex = ref() as any;
const pageTotal = ref(1) as any;
const pageTotal1 = ref(1) as any;
const pageTotal2 = ref(1) as any;
const pageTotal3 = ref(1) as any;
const venueId = ref<any>(null);
const loading = ref(false)
const open = () => {
    editVisible.value = true
    activeyIndex.value = 1
    activetgIndex.value = 1
    activewzIndex.value = null
    activedayIndex.value = null
    activecsIndex.value = null
    pageTotal.value = 1
    pageTotal1.value = 1
    pageTotal2.value = 1
    pageTotal3.value = 1
    query.venueId = ''
    query.pageNum = 1
    query.name = ''
    query.finished = false
    query1.pageNum = 1
    query1.finished = false
    query2.pageNum = 1
    query2.finished = false
    query3.pageNum = 1
    query3.finished = false
    showInfo.value = []
    venueList.value = []
    booklist.value = []
    goodslist.value = []
    zlList.value = []
    getVenueList();
    getTgtSaleList();
}
const emit = defineEmits<{
    (event: 'updated'): void
}>()
//触底函数
const loadMore = () => {
    console.log('触底了')
    // 防抖处理
    setTimeout(() => {
        if (query.pageNum >= pageTotal.value || query.finished) {
            return
        } else {
            query.pageNum += 1
            getVenueList()
        }
    }, 500)
}
const sreachVenue = (e: string) => {
    if (e) {
        query.name = e;
    } else {
        query.name = ''
    }
    query.pageNum = 1;
    getVenueList();
}
const loadMoreTwo = () => {
    setTimeout(() => {
        if (query.type == '2') {
            if (query1.pageNum >= pageTotal1.value || query1.finished) {
                return
            } else {
                query1.pageNum += 1
                getTrumlist(venueId.value)
            }
        } else if (query.type == '3') {
            if (query2.pageNum >= pageTotal2.value || query2.finished) {
                return
            } else {
                query2.pageNum += 1
                getTrumBooklist(venueId.value)
            }
        } else if (query.type == '4') {
            if (query3.pageNum >= pageTotal3.value || query3.finished) {
                return
            } else {
                query3.pageNum += 1
                getTrumGoodslist(venueId.value)
            }
        }
    }, 500)
}
const getVenueList = () => {
    proxy.API.getVenueList({
        pageNum: query.pageNum,
        pageSize: 10,
        venueType: '',
        name: query.name,
        status: ''
    }).then((res: any) => {
        if (res.data.result.result.length > 0) {
            pageTotal.value = res.data.result.pages
            query.pageNum = res.data.result.page
            if (query.pageNum > pageTotal.value) {
                query.finished = true
            } else if (query.pageNum == 1) {
                venueList.value = res.data.result.result
            } else {
                venueList.value = [...venueList.value, ...res.data.result.result]
            }
        } else {
            query.finished = true
        }
    }).catch((res: any) => {
        query.finished = true
        console.log(res)
    })
}
const postLaunchInfo = () => {
    forEach(showInfo.value, ele => {
        if (ele.id == query.entityId) {
            query.entityName = ele.name
        }
    })
    forEach(Buylist.value, ele => {
        if (ele.id == query.promotionMealId) {
            query.amount = ele.adAmount
        }
    })
    console.log(query.entityId);

    proxy.API.postLaunchInfo({
        venueId: query.venueId,
        type: query.type,
        entityId: query.entityId,
        entityName: query.entityName,
        adType: query.adType,
        promotionMealLocationId: query.promotionMealLocationId,
        promotionMealId: query.promotionMealId,
        amount: query.amount,
    }).then((res: any) => {
        if (res.data.success) {
            ElMessage.success('新增成功')
            editVisible.value = false
            emit('updated')
        } else {
            ElMessage.error(res.data.errorMessage)
        }
    })
}
const getTrumlist = (id: number) => {
    proxy.API.getTrumlist({
        pageNum: query1.pageNum,
        id: id
    }).then((res: any) => {
        if (res.data.success) {
            if (res.data.result.result.length > 0) {
                pageTotal1.value = res.data.result.pages
                query1.pageNum = res.data.result.page
                if (query1.pageNum > pageTotal1.value) {
                    query1.finished = true
                } else {
                    zlList.value = [...zlList.value, ...res.data.result.result]
                }
            } else {
                query1.finished = true
            }
        }
    }).catch((res: any) => {
        query1.finished = true
        ElMessage.error(res)
    })
}
const getTrumBooklist = (id: number) => {
    proxy.API.getTrumBooklist({
        pageNum: query2.pageNum,
        id: id
    }).then((res: any) => {
        if (res.data.success) {
            if (res.data.result.result.length > 0) {
                pageTotal2.value = res.data.result.pages
                query2.pageNum = res.data.result.page
                if (query2.pageNum > pageTotal2.value) {
                    query2.finished = true
                } else {
                    booklist.value = [...booklist.value, ...res.data.result.result]
                }
            } else {
                query2.finished = true
            }
        }
    }).catch((res: any) => {
        query2.finished = true
        console.log(res)
    })
}
const getTrumGoodslist = (id: number) => {
    proxy.API.getTrumGoodslist({
        pageNum: query3.pageNum,
        id: id
    }).then((res: any) => {
        if (res.data.success) {
            if (res.data.result.result.length > 0) {
                pageTotal3.value = res.data.result.pages
                query3.pageNum = res.data.result.page
                if (query3.pageNum > pageTotal3.value) {
                    query3.finished = true
                } else {
                    goodslist.value = [...goodslist.value, ...res.data.result.result]
                }
            } else {
                query3.finished = true
            }
        }
    }).catch((res: any) => {
        query3.finished = true
        console.log(res)
    })
}
const getTgtSaleList = () => {
    proxy.API.getTgtSaleList({}).then((res: any) => {
        if (res.data.success) {
            allModelList.value = res.data.result
            changetgType(1)
        }
    })
}
const changeVenue = (id: number) => {
    venueId.value = id
    activeyIndex.value = 1
    activetgIndex.value = 1
    activewzIndex.value = null
    activedayIndex.value = null
    activecsIndex.value = null
    query.type = '1'
    query.entityId = ''
    showInfo.value = []
    booklist.value = []
    goodslist.value = []
    zlList.value = []
    forEach(venueList.value, ele => {
        if (ele.id === venueId.value) {
            showInfo.value.push(ele)
        }
    })
    getTrumlist(id)
    getTrumBooklist(id)
    getTrumGoodslist(id)
}
const changeType = (val: number) => {
    activeyIndex.value = val
    query.type = '' + val
    query.entityId = ''
    query.entityName = ''
    showInfo.value = []
    if (val == 1) {
        forEach(venueList.value, ele => {
            if (ele.id === venueId.value) {
                showInfo.value.push(ele)
            }
        })
    } else if (val == 2) {
        console.log(2)
        showInfo.value.push(...zlList.value)
    } else if (val == 3) {
        console.log(3)
        showInfo.value.push(...booklist.value)
    } else if (val == 4) {
        console.log(4)
        showInfo.value.push(...goodslist.value)
    }
}
const changetgType = (val: number) => {
    activetgIndex.value = val
    query.adType = '' + val
    newLocations.value = []
    newBuyList.value = []
    if (val == 1) {
        // 更新推广位置
        adList.value = allModelList.value.dayMeal.adList
        locationList.value = allModelList.value.dayMeal.locationList
    } else if (val == 2) {
        adList.value = allModelList.value.cpcMeal.adList
        locationList.value = allModelList.value.cpcMeal.locationList
    } else if (val == 3) {
        adList.value = allModelList.value.cpsMeal.adList
        locationList.value = allModelList.value.cpsMeal.locationList
    }
    adList.value.forEach((item: any) => {
        let newobj = {
            id: item.promotionMealId,
            content: item.adCycle + '天/￥' + item.adAmount,
            adCycle: item.adCycle,
            adAmount: item.adAmount
        };
        newBuyList.value.push(newobj)
    })
    locationList.value.forEach((item: any) => {
        let newobjTwo = {
            name: item.name,
            id: item.promotionMealLocationId,
            content: item.residual
        };
        newLocations.value.push(newobjTwo)
    })
    TGlist.value = newLocations.value;
    Buylist.value = newBuyList.value;
}
const changewzType = (val: number, index: number) => {
    query.promotionMealLocationId = '' + val
    activewzIndex.value = index
}
const changedayType = (val: number, index: number) => {
    query.promotionMealId = '' + val
    activedayIndex.value = index
}
const changecsType = (val: number, index: number) => {
    query.promotionMealId = '' + val
    activecsIndex.value = index
}
const saveEdit = () => {
    postLaunchInfo()
}
const cancel = () => {
    editVisible.value = false
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
</style>