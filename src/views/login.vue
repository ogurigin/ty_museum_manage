<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">后台管理系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="adminName">
					<el-input v-model="param.adminName" placeholder="请输入账号">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input
						type="password"
						placeholder="请输入密码"
						v-model="param.password"
						@keyup.enter="submitForm(login)"
					>
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(login)">登录</el-button>
				</div>
				<p class="login-tips">Tips : 请输入正确的用户名和密码。</p>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
const {proxy} = getCurrentInstance() as any;
interface LoginInfo {
	adminName: string;
	password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
	adminName: '',
	password: ''
});

const rules: FormRules = {
	adminName: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			try{
				sessionStorage.setItem('ms_username',param.adminName);
				proxy.API.Login(param).then((res:any) => {
					if(res.data.success){
						ElMessage.success('登录成功');
						setTimeout(() => {
							router.push('/userList');
						}, 100);
					}else{
						ElMessage.error(res.data.errorMessage);
					}
				}).catch((res:any) => {
					
				})
			}catch(error){
				return error
			}
			
		} else {
			 // 校验没有通过，执行这里的代码
			ElMessage.error('请输入正确的信息后在进行提交！');
			return false;
		}
	});
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(@/assets/img/loginBg.jpg);
	background-size: cover;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #fff;
	border-bottom: 1px solid #ddd;
}
.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.ms-content {
	padding: 30px 30px;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
