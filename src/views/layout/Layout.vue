<template>
  <div>
    <el-container class="layout-container">
      <el-aside width="auto" class="aside">
        <Aside class="aside-menu" :collapse="isCollapse"/>
      </el-aside>
      <el-container>
        <el-header  class="header">
           <div>
             <i :class="{
               'el-icon-s-fold':isCollapse,
               'el-icon-s-unfold': !isCollapse
             }" @click="isCollapse = !isCollapse"></i>
             <span>fhelkfjslkfjslkfd</span>
           </div>
           <el-dropdown>
            <div class="avatar-warp">
              <!-- <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="" class="avatar"> -->
               <img :src="user.photo" alt="" class="avatar">
              <p>{{user.name}}</p>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="onLoginout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  
  </div>
</template>

<script>
import Aside from './components/Aside'
import {getUserProfile, updateUser} from '../../api/user'
import bus from '@/api/bus.js'


export default {
  name: 'Layout',
  data(){
    return {
      user: {},
      isCollapse: false,
    }
  },
  created(){
    this.loadUserProfile()

    bus.$on('updateuser',data => {
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    loadUserProfile(){
      getUserProfile().then(res=>{
        this.user = res.data.data
      })
    },

    onLoginout(){
      this.$confirm('是否确认退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.localStorage.removeItem('user')
          this.$router.push('/login')
        }).catch(() => {
                 
        });
      
    }
  },
 
  components: {
    Aside
  }
}
</script>

<style lang="less">
  .layout-container {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
  .header {
    display: flex;
    height: 60px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
   .avatar-warp {
     display: flex;
     align-items: center;
     .avatar {
       width: 50px;
       height: 50px;
       border-radius: 25px;
       margin-right: 5px;
     }
   }
  }

  .aside {
    background-color: #d3dce6;
    .aside-menu {
      height: 100%;
    }
  }

  .main {
    background-color: #e9e6f3;
  }
</style>





