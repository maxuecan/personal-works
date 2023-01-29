import $http from '@/utils/http'

// 添加用户登录请求 data如果约定好可以添加ts 接口类型
export const userLogin = <T>(data: T) => {
  return $http({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

// 登出
export function logout<T>(data: T) {
  return $http({
    url: '/user/logout',
    method: 'post',
    data: data
  })
}

// 获取个人信息
export function getInfo<T>(data: T) {
  return $http({
    url: '/user/info',
    method: 'post',
    data: data
  })
}

// 刷新token
export function checkToken<T>(data:T) {
  return $http({
    url: '/user/CheckToken',
    method: 'post',
    data: data
  })
}
