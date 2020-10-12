<template>
  <div class="image-container">
     <el-card class="filter-card" >
      <div slot="header" class="clearfix">
         <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="selectbtn">
        <el-radio-group v-model="collect" size="small" @change="onCllectChange">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button size="small" type='info' @click="dialogUpdateVisible = true">上传素材</el-button>
      </div>

      <!-- 素材展示 -->
      <el-row :gutter="20">
        <el-col :lg='4' :sm='12' :md='6' :xs="24" v-for="(img,index) in images" :key="index" class="image-item">
           <el-image
            style="height: 130px"
            :src="img.url"
            fit="cover"
          />
          <div class="image-action">
            <el-button
              circle
              :icon="img.is_collected ? 'el-icon-star-on':'el-icon-star-off'"
              :loading="img.loading"
              @click="onCollect(img)"
            />
            <el-button
              icon="el-icon-delete-solid"
              circle
              @click="onDelete(img)"
              :loading="img.loading"
            />
          </div>
          
        </el-col>
      </el-row>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalcont"
        :page-size="PageSize"
        @current-change="onPageChange"
        :current-page="page">
      </el-pagination>
    </el-card>

    <!-- 上传素材弹出层 -->
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUpdateVisible"
      :append-to-body='true'
      >
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        name="image"
        :headers="uploadHeaders"
        :on-success="onUploadSuccess"
        :show-file-list="false"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'

export default {
  name: 'ImageIndex',
  data(){
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect : 'false',
      images: [],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      dialogUpdateVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalcont: 0,
      PageSize: 10,
      page: 1,
    }
  },
  created(){
    this.loadImages()
  },
  methods: {
    loadImages( page = 1 ){
      this.page = 1
      getImages({
        collect: this.collect,
        page,
        per_page: this.PageSize
      }).then( res => {

        const results =  res.data.data.results
        results.forEach(element => {
          element.loading = false
        });
        this.images = results
        this.totalcont = res.data.data.total_count
      })
    },
    onCllectChange() {
      this.loadImages()
    },
    onUploadSuccess(){
      this.dialogUpdateVisible = false
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      this.loadImages()
    },
    onPageChange(page){
      this.loadImages(page)
    },
    // 图片收藏
    onCollect(img){
      img.loading = ture
      collectImage(img.id,!img.is_collected).then( res => {
        img.is_collected = !img.is_collected
        img.loading = false
      })
    },
    onDelete(img) {
      img.loading = true
      deleteImage(img.id).then( res => {
        this.loadImages(this.page)
      })
      img.loading = false
    }
  },
 
  components: {
  }
}
</script>


<style lang="less">
  .selectbtn {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .image-item {
    margin-bottom: 20px;
  }
  .image-action {
    height: 50px;
    background-color: rgba(204, 205, 204, .5);
    position: relative;
    margin-top: -54px;
    font-size: 35px;
    display: flex;
    
    justify-content: space-evenly;
    opacity: 1;
  } 

  .image-item:hover .image-action {
    opacity: 1;
    transition: opacity .2s ease-in-out .2s;
  }

  .image-action .el-button {
    border-color: transparent;
    background-color: transparent;
    font-size: 24px;
    color: crimson;
  }
</style>



