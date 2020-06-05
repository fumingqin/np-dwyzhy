
//弹框须知文本
const notice = {
	status: 1, //1成功/0失败提示返回值
	data: {
		explain: '预订时间：最晚需在出行当天18:00前购票 \n 有效时间：指定购买日期起，1日有效',
		way: '1、本产品每个账号每天限购一张，购买APP订单中的二维码检票入园即可 \n 2、费用包含：成人票一张、竹筏票一张 \n 3、本产品不支持代购或转售，仅限购票人本人使用。因代购或转售无法入园申请退改，不退不改。',
		date: '周一至周日 09:00~18:00',
		policy: '1、70岁以上老年人凭老年证免费 \n 2、身高80厘米以下免票 \n 3、身高80-120厘米儿童票价半折 \n 4、身高120以上儿童全票',
		rule: '该产品未使用且在有效期内支持随时退，过期不退不改，敬请谅解！如需取消，请登录APP账号申请取消，经核实 未使用且在有效期内，可免费取消。如需 改期，请申请取消后重新预订。',
		security: '1、严禁携带易燃、易爆、剧毒等危险品进入景区; \n 2、严禁在景区随意起火野炊; \n 3、每个分风景区均设有公厕、垃圾桶(池)，请勿乱丢废弃物，严禁随地便溺，请自觉遵守社会公德，维护景区环境卫生; \n 4、严禁在景区内狩猎、挖掘药材，有效的保护野生动、植物资源。请爱护水源，保护景区的生态环境; \n 5、请自觉遵守每个分景区内的各项提示：严禁随意攀险，崖根处请勿停留，谨防落石;景区内个别植物有毒，请勿随意攀摘;如遇突发事件，请您服从管理人员的指挥; \n 6、景区内道窄路滑处，请您行路注目、观景驻足; \n 7、未成年人、残疾人务必在监护人的陪同下观光游览，严禁其单独游览，以免发生意外; \n 8、景区内设有游客中心，您有什么意见和要求，请到那里，有工作人员为您服务。',
	},
	msg: '提示' 
}


/* 旅游路线-景区推文 */
const tweets = {
		id: 1,
		date : '2019-11-05',
		clicks : '2.1',
		image: ['../../static/FYWH/banner1.jpg','../../static/FYWH/banner2.jpg','../../static/FYWH/banner3.jpg'],
		imageNumber:3,
		title: '武夷山 | 全方位详尽三日',
		titlecontent : '武夷山，武夷山位于江西与福建西北部两省交界处，武夷山脉北段东南麓总面积999.75平方公里，是中国著名的风景旅游区和避暑胜地。属典型的丹霞地貌，是首批国家级重点风景名胜区之一。武夷山是三教名山。自秦汉以来，武夷山就为羽流禅家栖息之地，留下了不少宫观、道院和庵堂故址。武夷山还曾是儒家学者倡道讲学之地。武夷山自然保护区，是地球同纬度地区保护最好、物种最丰富的生态系统，拥有2527种植物物种，近5000种野生动物。在中生代晚期，武夷山发生了强烈的火山喷发活动，继之为大规模的花岗岩侵入，已发现本区有丰富的火山机构，为典型的亚洲东部环太平洋带的构造特征。白垩纪晚期的红色砂砾岩是形成丹霞地貌的主体。中生代的地壳运动奠定了武夷山地貌的基本骨架。告性对武夷山地貌发育也很明显，西部海拔1500m以上的山峰，基本上由坚硬的凝灰熔岩和流纹岩等构成，东部红色砂页岩地区则往往发育有较宽的谷地和盆地。所以武夷山丰富的地貌类型是地质构造、流水侵蚀、风化剥蚀、重力崩塌等综合作用的结果。',
		scenicSpot : [{
				id: 1,
				scennicName : '武夷山风景名胜区三日游',
				jungle : '自然风光',
				cost : 1200,
				days : 3,
				related : 108,
				attribute : '旅游度假区',
				image : '../../static/FYWH/scenicSpot/wuyishan.jpg',
				date : '2019-11-05',
				like : 207,
				comment : 92,
			},{
				id: 2,
				scennicName : '溪源峡谷风景名胜区',
				scName : '溪源峡谷',
				scEnglish : 'Creek Gorge',
				jungle : '自然风光',
				cost : 600,
				days : 2,
				related : 89,
				attribute : '旅游度假区',
				image : '../../static/FYWH/scenicSpot/xiyuanxiagu.jpg',
				date : '2019-11-05',
				like : 195,
				comment : 78,
			}]
	}

/* 旅游路线-回复内容 */
const reply = [{
		unid : 185677868,
		scennicName : '李大刚',
		portrait: '/static/FYWH/userhead/t1.jpg',
		content : '小姐姐的笔记写的很好啊！照片也拍的很美，给你点个赞，想来武夷山游玩的朋友们可以加我微信15359031110为您提供游玩攻略、民宿、帐篷预订及门票船票预订等旅游服务。我们整合了山上所有的旅游资源，花2分钟咨询，换一次完美旅行。赶紧动动手指联系我们把！',
		date : '2019-12-16',
		fabulous : 18,
		fabulous_state : false,
	},{
		unid : 185271851,
		scennicName : 'NDNPSOSWANGT',
		portrait: '/static/FYWH/userhead/t2.jpg',
		content : '不错,很赞的小姐姐,感谢分享',
		date : '2019-12-16',
		fabulous : 15,
		fabulous_state : true,
	},{
		unid : 153218884,
		scennicName : '小郑哥',
		portrait: '/static/FYWH/userhead/t3.jpg',
		content : '专门说武夷山的笔记在哪里？',
		date : '2019-12-16',
		fabulous : 12,
		fabulous_state : false,
	},{
		unid : 415546455,
		scennicName : 'Mickin',
		portrait: '/static/FYWH/userhead/t1.jpg',
		content : '小姐姐的笔记写的很好啊',
		date : '2019-12-16',
		fabulous : 8,
		fabulous_state : true,
	},{
		unid : 653235635,
		scennicName : '王老五',
		portrait: '/static/FYWH/userhead/t2.jpg',
		content : '不错,很赞的小姐姐,感谢分享',
		date : '2019-12-16',
		fabulous : 5,
		fabulous_state : false,
	},{
		unid : 215851875,
		scennicName : '富士康代工007',
		portrait: '/static/FYWH/userhead/t3.jpg',
		content : '小姐姐真好看？Emm?',
		date : '2019-12-16',
		fabulous : 0,
		fabulous_state : false,
	}]




// 接口声明区
export default {
	tweets,
	reply,
	notice
}
