<template>
  <div class="container" v-scrollbar>
    <div class="videoInput">
      <div class="videoInp">
        <div class="text"><span class="require">*</span>公司名称</div>
        <el-input v-model="formInline.name" placeholder="请输入展览名称"></el-input>
      </div>
      <div class="videoInp">
        <div class="text">中标记录</div>
        <el-input v-model="formInline.record" placeholder="请输入内容"></el-input>
      </div>
      <div class="videoInp">
        <div class="text">公司地址</div>
        <el-input v-model="formInline.address" placeholder="请输入内容"></el-input>
      </div>
      <div class="videoInp">
        <div class="text">联系电话</div>
        <el-input v-model="formInline.mobile" placeholder="请输入内容"></el-input>
      </div>
      <div class="videoInp">
        <div class="text"><span class="require">*</span>供应链分类</div>
        <el-select v-model="formInline.type" placeholder="请选择">
          <el-option v-for="item in ZLoptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="videoInp">
        <div class="text">供应链标签</div>
        <div style="display: flex">
          <el-select v-model="formInline.labels" placeholder="请选择" multiple :teleported="false" filterable remote 
            v-loadMore="loadMore" :remote-method="getTabsTwo">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" plain style="margin-left: 20px" @click="showAdd">添加标签</el-button>
        </div>
      </div>
    </div>
    <div class="videoInput">
      <div class="videoInp" style="align-items: flex-start; width: 960px">
        <div class="text"><span class="require">*</span>公司简介</div>
        <div class="editor">
          <editor :content="formInline.des" ref="NewEditor"></editor>
        </div>
      </div>
      <div class="videoInp" style="align-items: flex-start">
        <div class="text"><span class="require">*</span>公司图片</div>
        <el-upload v-model:file-list="formInline.pic" action="http://dfs.taoart.com/image.htm" ref="upload"
          list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="1"
          :on-exceed="handleExceed">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </div>
    </div>
    <div class="videoInput" style="justify-content: flex-end;">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="sure()">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Plus, } from '@element-plus/icons-vue';
import { genFileId, ElMessage, ElMessageBox } from 'element-plus'
import editor from '../../../components/editor.vue'
import type { UploadProps, UploadRawFile, UploadInstance, } from 'element-plus'
import Editor from "wangeditor";
const { proxy } = getCurrentInstance() as any;

const props = defineProps({
  msg: Number,
})
interface formInline {
  name: string;
  type: string;
  address: string;
  mobile: string;
  record: string;
  labels: any;
  pic: any;
  des: string;
}
//供应链基本信息
let formInline = reactive<formInline>({
  name: "",
  type: "",
  address: "",
  mobile: "",
  record: "",
  des: '',
  labels: [],
  pic: []
});
const query = reactive({
  name: '',
  currentPage: 1,
  pageSize: 10,
  pageTotal: 1,
  finished: false
});
const timer1 = ref(null) as any;
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref<UploadInstance>()
let options = reactive<any>([]);
let ZLoptions = reactive<any>([
  {
    value: 1,
    label: "展览展陈",
  },
  {
    value: 2,
    label: "展柜硬件",
  },
  {
    value: 3,
    label: "多媒体视觉",
  },
  {
    value: 4,
    label: "消防安防",
  },
  {
    value: 5,
    label: "导视软装",
  },
]);
const NewEditor = ref<any>(null);
onMounted(async () => {
  await getTabs();
  if (props.msg != 0 && props.msg) {
    getSupplyInfo();
  }
});
//获取供应链标签
const getTabs = () => {
  let params = {
    pageNum: query.currentPage,
    name: query.name,
    venueId: "",
    type: 6,
  };
  proxy.API.getTabs(params).then((res: any) => {
    const newArray = res.data.result.result.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    query.currentPage = res.data.result.page;
    query.pageTotal = res.data.result.pages;
    for (let i = 0; i < newArray.length; i++) {
      options.push(newArray[i]);
    }
  });
};

const getTabsTwo = (e:any) => {
  if (e) {
    query.name = e;
  } else {
    query.name = ''
  }
  query.currentPage = 1;
  let params = {
    pageNum: query.currentPage,
    name: query.name,
    venueId: "",
    type: 6,
  };
  proxy.API.getTabs(params).then((res: any) => {
    const newArray = res.data.result.result.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    query.currentPage = res.data.result.page;
    query.pageTotal = res.data.result.pages;
    options.length = 0;
    Object.assign(options,newArray)
  });
};

const loadMore = () => {
  // 防抖处理
  setTimeout(() => {
    if (query.currentPage >= query.pageTotal || query.finished) {
      return
    } else {
      query.currentPage += 1
      getTabs();
    }
  }, 500)
}


const emit = defineEmits<{
  (event: "lookFn", val: any): void;
}>();
const cancel = () => {
  emit("lookFn", null);
};
const sure = () => {
  if (NewEditor.value) {
    formInline.des = NewEditor.value.syncHTML() || ''
    if (props.msg && props.msg != 0) {
      postUpDateSupplyInfo();
    } else {
      postSupplyInfo();
    }
  }

};
const showAdd = () => {
  ElMessageBox.prompt('标签名称', '新增供应链标签', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    // inputPattern:
    //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: 'Invalid Email',
  })
    .then(({ value }) => {
      postTabs(value);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消新增',
      })
    })
};
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
//新增供应链详情
const postSupplyInfo = () => {
  let params = {
    ...formInline,
    labels: formInline.labels.join(','),
    pic: formInline.pic[0].response.url
  };
  proxy.API.postSupplyInfo(params).then((res: any) => {
    ElMessage.success('新建成功');
    emit("lookFn", null);
  });
};
//获取供应链详情
const getSupplyInfo = () => {
  let params = {
    id: props.msg
  };
  proxy.API.getSupplyInfo(params).then((res: any) => {
    formInline.name = res.data.result.name;
    if (formInline.labels != '') {
      res.data.result.labels = res.data.result.labels.split(',').map((label: any) => parseInt(label))
    }
    formInline.labels = res.data.result.labels.split(',');

    let labelMap: { [key: string]: string } = {};
    options.forEach((option: any) => {
      labelMap[option.value] = option.value;
    });

    formInline.labels = formInline.labels.map((label: string) => {
      return labelMap[label] || label;
    });

    formInline.record = res.data.result.record;
    formInline.mobile = res.data.result.mobile;
    formInline.des = res.data.result.des;
    if (res.data.result.type == 0) {
      res.data.result.type = '';
    }
    formInline.type = res.data.result.type;
    formInline.address = res.data.result.address
    let pic = [] as any;
    pic.push({
      'url': res.data.result.pic
    });
    formInline.pic = pic;
  });
}
//更新供应链详情
const postUpDateSupplyInfo = () => {
  let pic
  if (formInline.pic.length > 0 && formInline.pic[0].response) {
    pic = formInline.pic[0].response.url
  } else if (formInline.pic.length > 0 && formInline.pic[0].url) {
    pic = formInline.pic[0].url
  } else if (formInline.pic.length == 0) {
    pic = '';
  }
  let params = {
    ...formInline,
    labels: formInline.labels.join(','),
    pic: pic,
    id: props.msg,
  };

  proxy.API.postUpDateSupplyInfo(params).then((res: any) => {
    ElMessage.success('修改成功');
    emit("lookFn", null);
  });
}
const postTabs = (name: string) => {
  let params = {
    'name': name,
    'type': 6
  };
  proxy.API.postTabs(params).then((res: any) => {
    ElMessage({
      type: 'success',
      message: '新增成功',
    });
    query.currentPage = 1;
    options.length = 0;
    getTabs();
  });
}
</script>

<style lang="less" scoped>
.videoInput {
  display: flex;
  margin-top: 40px;
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
  min-width: 100px;
}

.editor {
  width: 800px;
  height: auto;
}
</style>