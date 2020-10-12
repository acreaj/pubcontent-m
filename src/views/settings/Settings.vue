<template>
  <div class="settings-container">
     <el-card >
      <div slot="header" class="clearfix">
         <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="16">
          <el-form ref="userfm" :model="user" label-width="80px" :rules="userForm"> 
            <el-form-item label="编号">
              {{user.id}}
            </el-form-item>
            <el-form-item label="手机号">
              {{user.mobile}}
            </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item> 
            <el-form-item>
              <el-button type="primary" @click="onUpadateUser" :loading="onUpadateUserLoading">修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="6">
          <div @click="$refs.file.click()">
            <el-avatar  shape="square" :size="100" fit="fit" :src="user.photo"></el-avatar>
          </div>
          <input  type="file" ref="file" hidden @change="onChangeFile"/>
        </el-col>
      </el-row>
  
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      >
      <div class="image-wrap"> 
        <img :src="previewImage" alt="" srcset="" class="image-item" ref="previewimage">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateAvator" :loading="onUpdateLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getUserProfile, updateAvator, updateUser } from '@/api/user.js'

import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import bus from '@/api/bus.js'

export default {
  name: 'Settings',
  data(){
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false,
      previewImage: '',
      cropper: null,
      onUpdateLoading: false,
      onUpadateUserLoading: false,
      userForm: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入内容', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created(){
    this.loadUser()
  },
  methods: {
    loadUser(){
      getUserProfile().then( res => {
        this.user = res.data.data
      })
    },
    onChangeFile(){
      // console.log('123')
      this.dialogVisible = true
      console.log(window.URL.createObjectURL(this.$refs.file.files[0]))
      this.previewImage = window.URL.createObjectURL(this.$refs.file.files[0])

      // 解决相同文件不触发的问题
      this.$refs.file.value = ''
    },
    onDialogOpened(){
      console.log('opened')
      const image = this.$refs['previewimage'];

      if(this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        dragMode: 'none',
        aspectRatio: 1,
        cropBoxResizable: false,
        background: false
        // crop(event) {
        //   console.log(event.detail.x);
        //   console.log(event.detail.y);
        //   console.log(event.detail.width);
        //   console.log(event.detail.height);
        //   console.log(event.detail.rotate);
        //   console.log(event.detail.scaleX);
        //   console.log(event.detail.scaleY);
        // },
      });
    },
    onUpdateAvator(){
      this.onUpdateLoading = true
      this.cropper.getCroppedCanvas().toBlob( file => {
        const formData = new FormData();
        formData.append('photo',file)
        updateAvator(formData).then(res => {
          this.onUpdateLoading = false
          this.dialogVisible = false
          this.user.photo = window.URL.createObjectURL(file)

          bus.$emit('updateuser',this.user)
        })
      })
    },
    onUpadateUser(){
      this.$refs['userfm'].validate( valid => {
        if( !valid ) {
          return
        }else {
          this.onUpadateUserLoading = true
          const {name, intro, email} = this.user
          updateUser({
            name,
            intro,
            email
          }).then( res => {
            
            this.$message({
              type:'success',
              message: '修改成功'
            })

            this.onUpadateUserLoading = false

            bus.$emit('updateuser',this.user)
          })
        }
      })
      
    }

  },
 
  components: {
  }
}
</script>

<style lang="less">
  .image-wrap {
    .image-item {
      display: block;
      max-width: 100%;
      height: 300px;
    }
  }
</style>



