<template>
  <div class="login-container">
    <el-form :model="user" :rules="rules"  ref="ruleForm">
      <el-form-item>
        <img src="./logo_index.png" alt="" srcset="">
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item >
       <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="checked">
        <el-checkbox v-model="user.checked" >
         请勾选是否同意协议和用户说明
       </el-checkbox>
      </el-form-item> 
       <el-form-item>
        <el-button type="primary" class="login-btn" @click="onLogin" :loading="loginLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import request from '@/utils/request'
export default {
  name: 'Login',
  data(){
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        checked: false
      },
      loginLoading: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { pattern: /\d{6}$/, message: '请输入正确的验证码', trigger: 'change' }
        ],
        checked: [
          { 
            validator:(rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback(new Error("请勾选协议"))
            }
          },
          trigger: 'change' },
        ]
      }
    }
  },
  methods: {
    login(){
      request({
        url: '/mp/v1_0/authorizations',
        method: 'post',
        data: this.user
      }).then(res => {
        // console.log(res)
        this.$message({
          type: 'success',
          message: '登录成功'
        })
        window.localStorage.setItem('user',JSON.stringify(res.data.data))
        this.$router.push('/')
        this.loginLoading = false
        
      }).catch(res => {
         this.$message({
          type: 'error',
          message: '登录失败，手机或验证码错误'
        })
        this.loginLoading = false
      })
    },
    onLogin(){
      this.loginLoading = true

      this.$refs['ruleForm'].validate((valid) => {
          if (!valid) {
            return 
          } else {
            this.login()
          }
      })
      
    },
  },
 
  components: {
  }
}
</script>

<style lang="less">
  .login-container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background:  url('./login_bg.jpg') no-repeat;
    background-size: cover;
    .el-form {
      background-color: #fff;
      padding: 20px 50px;
      min-width: 230px;
      .el-form-item:first-child {
        margin-bottom: 0;
      }
      .login-btn {
        width: 100%;
      }
    }
    
  }
</style>



