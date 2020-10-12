<template>
  <div class="home-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ this.articleid ? '修改文章':'发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="publishform" :model="article" label-width="60px" :rules="frmrules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
         <el-form-item label="内容" prop="content">
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            lang="zh"
            height="300"
          />
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option v-for="(channel,index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发布</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getArticlesChannels , addArticle , getArticle, updateArticle } from '@/api/article'
import { uploadImage } from '@/api/image'
import 'element-tiptap/lib/index.css';
import {
  ElementTiptap,
  // necessary extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image
} from 'element-tiptap';

export default {
  name: 'Publish',
  data(){
    return {
      article: {
        title: '',
        content: '',
        cover: {
          type: 0 ,
          images: []
        },
        channel_id: null
      },
      channels:[],
      articleid : null,
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // render command-button in bubble menu.
        new Underline({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image({
          uploadRequest(file){
            const fdata = new FormData();  
            fdata.append('image',file)
            return uploadImage(fdata).then( res => {
              return res.data.data.url
            })
          }
        })
      ],
      frmrules: {
        title: [
           { required: true, message: '请输入标题', trigger: 'blur' },
           { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator:(rule, value, callback) => {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' },
        ],
        channel: [
          { required: true, message: '请选择标题'},
        ]
      }
    }
  },
  created(){
    this.loadChannels()
    
    
    if(this.$route.query.id) {
      this.articleid = this.$route.query.id
      this.loadArticle()
    }
  },
  methods: {
    loadChannels(){
      getArticlesChannels().then( res => {

        this.channels = res.data.data.channels
      })
    },
    onPublish(draft){
      
      this.$refs['publishform'].validate( valid => {
        if( !valid ) {
          return
        }else {
          if(this.articleid) {
            updateArticle(this.articleid,this.article,draft).then( res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            })
          }else {
            addArticle(this.article,draft).then( res => {
              console.log(res)
              this.$message({
                message: `${ draft ? '存入草稿': '发表'}成功`,
                type: 'success'
              })
              this.$router.push('/article')
            })
          }
        }
      })
      // console.log(this.article)
      
     
    },
    loadArticle(){
      getArticle(this.articleid).then( res => {
        // console.log(res)
        this.article = res.data.data
      })
    }
  },
 
  components: {
    'el-tiptap': ElementTiptap,
  }
}
</script>

<style lang="less">
  .el-form-item__content {
    text-align: left;
  }
</style>



