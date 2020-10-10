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