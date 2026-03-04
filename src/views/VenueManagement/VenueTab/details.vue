<template>
    <div class="container">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="基本资料" name="first">
                <BasicDoc :detailId="detailId" @Cancal="Cancal" />
            </el-tab-pane>
            <el-tab-pane label="展览信息" name="second">
                <ExhibitInfo ref="exh" v-if="exhibitShow" :detailId="detailId"  @newAdd="newExbihit" @updateInfo="updateExbihitInfo"/>
                <AddExhibit ref="addExh" v-else :detailId="detailId" @closeDoor="close" @updated="updated" />
            </el-tab-pane>
            <el-tab-pane label="数字展" name="third">
                <NumberBasic ref="numb" v-if="numberShow" :detailId="detailId" @newAdd="newNumber" @updateInfo="updateNumInfo" />
                <AddNumber ref="addNum" v-else :detailId="detailId" @updated="updated" @closeDoor="close" />
            </el-tab-pane>
            <el-tab-pane label="场馆附件" name="fourth">
                <Cultural ref="cul" v-if="culturalShow" :detailId="detailId" @newAdd="newCultural" @updateInfo="updateCulInfo" />
                <AddCultural ref="addCul" v-else :detailId="detailId"  @updated="updated" @closeDoor="close" />
            </el-tab-pane>
            <el-tab-pane label="相关书籍" name="five">
                <Book ref="book" v-if="bookShow" :detailId="detailId" @newAdd="newBook"  @updateInfo="updateBookInfo"/>
                <AddBook ref="addBook" v-else :detailId="detailId" @updated="updated" @closeDoor="close" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup lang='ts'>
import {ref,defineEmits,defineProps,nextTick,onBeforeMount} from 'vue';
import type { TabsPaneContext } from 'element-plus';
import ExhibitInfo from './components/exhibitInfo.vue';
import BasicDoc from './components/basicDoc.vue';
import NumberBasic from './components/numberBasic.vue';
import Cultural from './components/cultural.vue';
import Book from './components/book.vue';
import AddExhibit from './components/addExhibit.vue';
import AddNumber from './components/addNumber.vue';
import AddCultural from './components/addCultural.vue';
import AddBook from './components/addBook.vue';
const activeName = ref('first')
const props = withDefaults(defineProps<{
    detailId?:number
}>(),{
    detailId:0
})
const emit = defineEmits<{
    (event:"hided"):void
}>();
const bookShow = ref(true);
const exhibitShow = ref(true);
const culturalShow = ref(true);
const numberShow = ref(true);
const exh = ref(null) as any;
const addExh = ref(null) as any;
const numb = ref(null) as any;
const addNum = ref(null) as any;
const cul = ref(null) as any;
const addCul = ref(null) as any;
const book = ref(null) as any;
const addBook = ref(null) as any;
const newExbihit = () => {
    console.log('是1')
    exhibitShow.value = false
}
const updateExbihitInfo = (val:any)=>{
    console.log('是2')
    exhibitShow.value = false
    nextTick(() => {
        addExh.value.returnInfo(val)
    }) 
}
const newNumber = () => {
    numberShow.value = false
}
const updateNumInfo = (val:any) => {
    numberShow.value = false
    nextTick(() => {
        addNum.value.returnInfo(val)
    }) 
}
const newCultural = () => {
    culturalShow.value = false
}
const updateCulInfo = (val:any) => {
    culturalShow.value = false
    nextTick(() => {
        addCul.value.returnInfo(val)
    }) 
}
const newBook = () => {
    bookShow.value = false
}
const updateBookInfo = (val:any) => {
    bookShow.value = false
    nextTick(() => {
        addBook.value.returnInfo(val)
    }) 
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
  switch(tab.paneName){
        case 'second':
            exhibitShow.value = true ;
        break;
        case 'third':
            numberShow.value = true;
        break;
        case 'fourth':
            culturalShow.value = true;
        break;
        case 'five':
            bookShow.value = true;
        break;
  }
}
const updated = (val:string) => {
    switch(val){
        case 'second':
            exhibitShow.value = true ;
            exh.value.getTrumlist()
        break;
        case 'third':
            numberShow.value = true;
            numb.value.getTrumDigList()
        break;
        case 'fourth':
            culturalShow.value = true;
            cul.value.getTrumGoodslist()
        break;
        case 'five':
            bookShow.value = true;
            book.value.getTrumBooklist()
        break;
  }
}
const close = (val:string) => {
    switch(val){
        case 'second':
            exhibitShow.value = true ;
        break;
        case 'third':
            numberShow.value = true;
        break;
        case 'fourth':
            culturalShow.value = true;
        break;
        case 'five':
            bookShow.value = true;
        break;
  }
}
const Cancal = () => {
    emit("hided")
}
</script>
<style lang='less' scoped>
</style>