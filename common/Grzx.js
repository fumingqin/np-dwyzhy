/* 接口参数区 */
// 示例
const Url = 'http://218.67.107.93:9210'; //http请求

const VersionUrl='http://27.148.155.9:9055'; //检查系统版本

const Interface={
	login:{
		url:Url+'/api/app/login',
		name:'通过手机号获取用户信息',
		method:'POST',
		pages: [],
	},
	bindTel:{
		url:Url+'/api/app/bindTel',
		name:'绑定手机号',
		method:'POST',
		pages: [],
	},
	getLoginCode:{
		url:Url+'/api/app/getLoginCode',
		name:'获取短信验证码',
		method:'POST',
		pages: [],
	},
	changeInfo:{
		url:Url+'/api/app/changeInfo',
		name:'修改用户信息',
		method:'POST',
		pages: [],
	},
	
	getAppVersion:{
		url:VersionUrl+'/CTKY/getAppVersion',
		name:'检查系统版本',
		method:'POST',
		pages: [],
	},
}

// 接口声明区
export default {
	Interface
}