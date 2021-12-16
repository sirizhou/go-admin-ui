import request from '@/utils/request'

// 查询Dato列表
export function listDato(query) {
  return request({
    url: '/api/v1/dato',
    method: 'get',
    params: query
  })
}

// 查询Dato详细
export function getDato(id) {
  return request({
    url: '/api/v1/dato/' + id,
    method: 'get'
  })
}

// 删除Dato
export function delDato(data) {
  return request({
    url: '/api/v1/dato',
    method: 'delete',
    data: data
  })
}

