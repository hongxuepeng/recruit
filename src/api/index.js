// 统一请求路径前缀在libs/axios.js中修改
import { postRequest } from '@/libs/axios';

// 登陆
export const login = (params) => {
    return postRequest('/AgentAccount/Login', params)
}

// 获取手机验证码
export const getCode = (params) => {
    return postRequest('/AgentAccount/SendMsg', params)
}

// 重置密码
export const resetPassword = (params) => {
    return postRequest('/AgentAccount/ResetPwd', params)
}

// 忘记密码
export const forgetPassword = (params) => {
    return postRequest('/AgentAccount/ChangePwd', params)
}

// 获取我的支付宝信息
export const getMyAliPayNum = (params) => {
    return postRequest('/AccountReleve/GetAliNum', params)
}

// 申请提现
export const applyDiscountRecord = (params) => {
    return postRequest('/AccountReleve/Discount', params)
}

// 获取省份
export const getProvince = (params) => {
    return postRequest('/ProCity/GetProvince', params)
}

// 获取城市
export const getCity = (params) => {
    return postRequest('/ProCity/GetCity', params)
}

// 获取客服信息
export const getCusService = (params) => {
    return postRequest('/AgentAccount/GetCusService', params)
}

// 获取产品
export const getProduct = (params) => {
    return postRequest('/Product/GetProduct', params)
}

// 获取产品详情
export const getProductDetails = (params) => {
    return postRequest('/Product/GetProductDetails', params)
}

// 产品申请
export const applyProduct = (params) => {
    return postRequest('/Product/ApplyProduct', params)
}

// 查询客户信息
export const searchCustomer = (params) => {
    return postRequest('/Customer/SearchCustomer', params)
}

// 获取我的申请记录
export const getMyApply = (params) => {
    return postRequest('/MyApply/GetMyApply', params)
}

// 获取我的业绩和业绩汇总
export const getMyLoanAndAllLoan = (params) => {
    return postRequest('/MySubAgent/GetMyCommissionAndAllCommission', params)
}

// 获取我的一级代理业绩汇总
export const getMyOneLevelLoan = (params) => {
    return postRequest('/MySubAgent/GetMyOneLevelCommission', params)
}

// 获取我二级代理业绩汇总
export const getMyTwoLevelLoan = (params) => {
    return postRequest('/MySubAgent/GetMyTwoLevelCommission', params)
}

// 获取推荐记录
export const getMyCustomer = (params) => {
    return postRequest('/Customer/GetMyCustomer', params)
}

// 获取记录详情
export const getCustomerDetails = (params) => {
    return postRequest('/Customer/GetCustomerDetails', params)
}

// 获取我的业绩列表
export const getMyLoanList = (params) => {
  return postRequest('/MySubAgent/GetMyCommissionList', params)
}

// 获取一级业绩列表
export const getMyLowLoanList = (params) => {
  return postRequest('/MySubAgent/GetMyLowCommissionList', params)
}

// 获取二级业绩列表
export const getMyLowLowLoanList = (params) => {
  return postRequest('/MySubAgent/GetMyLowLowCommissionList', params)
}

// 添加成为代理-->做单
export const addLowUserInfo = (params) => {
    return postRequest('/AccountReleve/AddLowUserInfo', params)
}

// 注册
export const register = (params) => {
    return postRequest('/AgentAccount/Register', params)
}

// 获取代理基本信息
export const getAgentMsg = (params) => {
    return postRequest('/AgentAccount/GetAgentMsg', params)
}

// 实名认证
export const bindRealName = (params) => {
    return postRequest('/AgentAccount/RealName', params)
}

// 获取我的代理数量-三级代理
export const getMyProxyCount = (params) => {
    return postRequest('/MyAgent/GetMyAgentCount', params)
}

// 获取我的代理数据列表-三级代理
export const getMyProxyList = (params) => {
    return postRequest('/MyAgent/GetMyLowAgentList', params)
}

// 查询佣金规则
export const getCommissionRules = (params) => {
    return postRequest('/MySubAgent/GetCommissionRules', params)
}

// 城市推荐提交
export const cityRecommend = (params) => {
    return postRequest('/CityRe/CityRecommend', params)
}

// 获取城市推荐列表
export const getCityRecommend = (params) => {
    return postRequest('/CityRe/GetCityRecommend', params)
}

// 获取测额结果
export const getApplyMeasure = (params) => {
    return postRequest('/Measure/ApplyMeasure', params)
}

// 获取岗位类型
export const getProductGroup = (params) => {
    return postRequest('/Product/GetProductGroup', params)
}

// 获取岗位
export const getProductList = (params) => {
    return postRequest('/Product/GetProduct', params)
}

// 获取岗位详情页代理基本信息
export const getProductDetailsAgentMsg = (params) => {
    return postRequest('/Product/GetProductDetailsAgentMsg', params)
}

// 获取微信分享内容
export const getSignature = (params) => {
    return postRequest('/WxSignature/GetSignature', params)
}
