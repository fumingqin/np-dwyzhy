/* 接口参数区 */
// 示例


//传统客运接口配置


//接口域名
// #ifdef H5
	const Url = 'http://218.67.107.93:9210';
// #endif
// #ifndef H5
	const Url = 'https://zntc.145u.net:9099'; //https请求
// #endif



const systemName = '南平旅游';

//接口对象
const KyInterface = {
	//GET-POST
	//--------------------------------------通用接口--------------------------------------
	systemName:{
		companyCode:'南平旅游',
		companyCodeApp:'南平旅游APP',
		companyCodeH5:'南平旅游H5',
		companyCodeWeiXin:'南平旅游小程序',
	},
	
	
}
// 接口声明区
export default {
	KyInterface
}