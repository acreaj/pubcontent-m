import request from '../utils/request'

// 上传图片
export const uploadImage = data => {
  return request({
    url: '/mp/v1_0/user/images',
    method: 'post',
    data
  })
} 

// 获取图片
export const getImages = params => {
  return request({
    url: '/mp/v1_0/user/images',
    method: 'get',
    params
  })
} 

// 收藏图片
export const collectImage = (imageid,collect) => {
  return request({
    url: `/mp/v1_0/user/images/${imageid}`,
    method: 'put',
    data: {
      collect
    }
  })
} 

// 删除图片素材
export const deleteImage = imageid => {
  return request({
    url: `/mp/v1_0/user/images/${imageid}`,
    method: 'delete',
  })
} 