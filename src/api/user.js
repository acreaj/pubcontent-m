import request from '../utils/request'

// 获取用户信息
export const getUserProfile = () => {
 
  // console.log(user)
  return request({
    
    url: '/mp/v1_0/user/profile',
    method: 'get',
    // headers: {
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

// 修改用户头像
export const updateAvator = data => {
 
  return request({
    
    url: '/mp/v1_0/user/photo',
    method: 'PATCH',
    data
  })
}

// 编辑用户资料
export const updateUser = data => {
 
  return request({ 
    url: '/mp/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}