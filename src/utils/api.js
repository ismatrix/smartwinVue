import { request } from './request'

const baseUrl = 'https://quantowin.com/api/'
const socketUrl = 'https://quantowin.com/'
const jupyterUrl = 'https://nb.quantowin.com'

export class UserService {
  static async login(params) {
    return request(baseUrl, '/public/auth/password', params, 'post')
  }
  static async login3(params) {
    return request('/login', params, 'post')
  }
}

export class MDService {
  static async productGroups(params) {
    return request(baseUrl, '/productGroups', params, 'get')
  }
  static async hotContracts(params) {
    return request(baseUrl, '/markets/futures/contracts', params, 'post')
  }
  static async lastSnapshot(params) {
    return request(baseUrl, '/markets/futures/lastSnapshot', params, 'post')
  }
}

export class landRelevant {
  static async landList(params) {
    return request('/land_list_info', params, 'get')
  }
}