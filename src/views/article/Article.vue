<template>
  <div class="article-container">

    <el-card class="filter-card" >
      <div slot="header" class="clearfix">
         <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelid" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="(channel,index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
          v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadArticles(1)" :disabled="loading">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="list-card">
      <div slot="header" class="count">
         共查询到{{totalCount}}条数据
      </div>
      <el-table
        :data="articles"
        style="width: 100%"
        class="list-item"
        v-loading="loading"
      >
        <el-table-column
          label="封面"
        >
          <template slot-scope="scope">
            <!-- <img :src="scope.row.cover.images[0]" alt="" class="article-cover"> -->
             <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.cover.images[0]"
              fit="cover"
             ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}</el-tag>
            <!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1" >待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
           <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              circle
              type="primary"  
              @click="onEdit(scope.row.id)"         
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="ondeleteArticle(scope.row.id)"
             />
          </template>
        </el-table-column>
      </el-table>

    <!-- 列表分页 -->
      <el-pagination
        layout="prev, pager, next"
        :total="totalCount"
        @current-change="onCurrentChange"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"/>
    
    </el-card>
    
  </div>
</template>

<script>
import { getArticles , getArticlesChannels , deleteArticle } from '@/api/article'
// import { getArticles } from '../../../../toutiao-m/src/network/recomm'
export default {
  name: 'Article',
  data(){
    return {
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
    
      articles: [],
      articleStatus: [
        { status: 0, text: '草稿', type: 'info'},
        { status: 1, text: '待审核', type: ''},
        { status: 2, text: '审核成功', type: 'success'},
        { status: 3, text: '审核失败', type: 'warning'},
        { status: 4, text: '已删除', type: 'danger'},
      ],
      totalCount: 0,
      pageSize: 10,
      status: null,
      channels: [],
      channelid: null,
      rangeDate: [],
      loading: true,
      page: 1
    
    }
  },
  created(){
    this.loadArticles()
    this.loadChannels()
  },
  methods: {
    loadArticles( page = 1 ){
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelid,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res=>{
        const {results,total_count} = res.data.data
        this.articles = results
        this.totalCount = total_count
        this.loading = false
      })
    },
    loadChannels(){
      getArticlesChannels().then(res=>{
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onCurrentChange(page) {
      // console.log(page)
      this.loadArticles(page)
    },
    ondeleteArticle(articleid){
       this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticle(articleid.toString()).then(res=>{
            this.loadArticles(this.page)
          })
        }).catch(() => {
                 
        });
      
    },
    onEdit(articleid){
      this.$router.push('/publish?id='+articleid)
    }
    
  },
 
  components: {
  }
}
</script>

<style lang="less">
  .filter-card {
    margin-bottom: 10px;
    .el-form-item__content {
      text-align: left;
    }
  }

  .count {
    text-align: left;
  }

  .list-item {
    margin-bottom: 5px;
    .article-cover {
      width: 60px;
      height: 60px;
      // background-size: cover;
    }
  }
  
</style>



