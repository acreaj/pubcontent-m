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