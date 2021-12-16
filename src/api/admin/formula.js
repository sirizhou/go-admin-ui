import request from '@/utils/request'

// 查询Formula列表
export function listFormula(query) {
  return request({
    url: '/api/v1/formula',
    method: 'get',
    params: query
  })
}

// 查询Formula详细
export function getFormula(id) {
  return request({
    url: '/api/v1/formula/' + id,
    method: 'get'
  })
}

// 新增Formula
export function addFormula(data) {
  return request({
    url: '/api/v1/formula',
    method: 'post',
    data: data
  })
}

// 修改Formula
export function updateFormula(data) {
  return request({
    url: '/api/v1/formula/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除Formula
export function delFormula(data) {
  return request({
    url: '/api/v1/formula',
    method: 'delete',
    data: data
  })
}

