<template>
  <div>
    <el-form
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :rules="rules"
        ref="loginForm"
        :model="loginForm"
        class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入用密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码"
                  style="width:250px;margin-right: 5px"></el-input>
        <img :src="captchaUrl" alt="暂无" @click="updateCaptchaUrl"/>
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width:100%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import router from '../router'

export default {
  name: "Login",
  data() {
    return {
      loading: false,//加载动画
      captchaUrl: '/captchar?time=' + new Date(),
      loginForm: {
        username: 'admin',
        password: 'admin',
        code: ''
      },
      checked: true,
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
      },
    }
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest('/login', this.loginForm).then(resp => {
            if (resp) {
              this.loading = false;
              //token
              const tokenStr = "响应的token信息";
              window.sessionStorage.setItem("tokenStr", tokenStr);
              //跳转首页
              router.replace("/home");
            }
          });
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      });
    },
    updateCaptchaUrl() {
      this.captchaUrl = '/captchar?time=' + new Date();
    }
  }
}
</script>

<style>

.loginContainer {
  border-radius: 15px;
  backgroundclip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}

</style>
