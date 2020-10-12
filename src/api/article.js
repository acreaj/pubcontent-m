import request from '../utils/request'

// body参数使用data
// query参数使用params设置
// headers参数使用headers设置
export const getArticles = params => {
  return request({
    url: '/mp/v1_0/articles',
    method: 'get',
    params
  })
}

// 获取文章频道
export const getArticlesChannels = () => {
  return request({
    url: '/mp/v1_0/channels',
    method: 'get',
  })
}

// 删除文章
export const deleteArticle = articleid => {
  return request({
    url:  `/mp/v1_0/articles/${articleid}`,
    method: 'delete',
  })
}

// 发表文章
export const addArticle = (data,draft) => {
  return request({
    url:  '/mp/v1_0/articles',
    method: 'post',
    params: {
      draft
    },
    data
  })
}

// 获取指定文章
export const getArticle = articleid => {
  return request({
    url:  `/mp/v1_0/articles/${articleid}`,
    method: 'get',
  })
}

// 修改指定文章
export const updateArticle = (articleid,data,draft) => {
  return request({
    url:  `/mp/v1_0/articles/${articleid}`,
    method: 'put',
    params: {
      draft
    },
    data
  })
}

// 修改文章评论状态
export const updateCommentsStatus = (articleid,allowComment) => {
  return request({
    url: '/mp/v1_0/comments/status',
    method: 'put',
    params: {
      article_id:articleid
    },
    data: {
      allow_comment: allowComment
    }
  })
}