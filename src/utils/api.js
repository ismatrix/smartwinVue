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

export class FundService {
  static async fundlist(params) {
    return request(baseUrl, '/funds', params, 'get')
  }
  static async tradingdays(fundid, params) {
    return request(baseUrl, '/funds/'+fundid +'/tradingdays', params, 'get')
  }
  static async netvalue(fundid, params) {
    return request(baseUrl, '/funds/'+fundid +'/netValue', params, 'get')
  }
  static async fundpro(fundid, params) {
    return request(baseUrl, '/funds/'+fundid, params, 'get')
  }
  static async fundproTotal(fundid, params) {
    return request(baseUrl, '/funds/'+fundid+'/total', params, 'get')
  }
  static async dynamicEquity(fundid, params) {
    return request(baseUrl, '/funds/'+fundid+'/dynamicEquity', params, 'get')
  }
  static async netvalues(fundid, params) {
    return request(baseUrl, '/funds/'+fundid +'/netValues', params, 'get')
  }
}

export class landRelevant {
  static async landList(params) {
    return request('/land_list_info', params, 'get')
  }
}