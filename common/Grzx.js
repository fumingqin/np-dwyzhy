/* 接口参数区 */
// 示例
const Url = 'http://218.67.107.93:9210'; //http请求

const VersionUrl='http://27.148.155.9:9055'; //检查系统版本

const IMEIUrl='http://www.npzhly.com:9266'; //上传IMEI

const upLoadUrl='http://218.67.107.93:9266';//上传定位（经纬度）


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
	setDownload:{
		url:IMEIUrl+'/Home/setDownload',
		name:'上传IMEI',
		method:'POST',
		pages: [],
	},
	setAppLocation:{
		url:upLoadUrl+'/Appointment/setAppLocation',
		name:'上传定位（经纬度）',
		method:'POST',
		pages: [],
	},
	
	get_bkbw_list:{
		url:Url+'/api/app/get-bkbw-list',
		name:'获取必看必玩列表',
		method:'POST',
		pages: [],
	},
	get_bkbw_detail:{
		url:Url+'/api/app/get-bkbw-detail',
		name:'根据id获取必看必玩详情',
		method:'POST',
		pages: [],
	},
	
	colleague_list:{
		url:Url+'/api/app/colleague-list',
		name:'同行列表',
		method:'POST',
		pages: [],
	},
	colleague_cancel:{
		url:Url+'/api/app/colleague-cancel',
		name:'取消同行',
		method:'POST',
		pages: [],
	},
}

// 接口声明区
export default {
	Interface
}