<template>
	<view>
		<view class="topSearch">
			<!-- 搜索栏 -->
			<view class="searchTopBox">
				<!-- #ifdef MP -->
				<text  class="locationTxt" @click="oncity">{{regionWeixin}}<text class="icon jdticon icon-xia"></text></text>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<text  class="locationTxt" @click="oncity">{{regionApp.city}}<text class="icon jdticon icon-xia"></text></text>
				<!-- #endif -->
				<view class="searchBoxRadius">
					<input class="inputIocale" type="search" v-model="searchValue" @confirm="searchNow" placeholder="搜索景区名称" />
					<image class="searchImage" src="../../../static/LYFW/currency/search.png" />
				</view>
			</view>

			<!-- 选择地址 -->
			<popup-layer ref="popupRef" :direction="'right'">
				<view style="width:750upx;height: 100%;">
					<citySelect @back_city="backCity"></citySelect>
				</view>
			</popup-layer>

			<!-- 搜索内容 -->
			<view :hidden="searchIndex==0" v-for="(item,index) in searchData" :key="index">
				<view class="Tk_scrollview" @click="godetail(item.ticketId)">
					<view class="Tk_item">
						<image class="Tk_image" :src="item.ticketImage" />
						<view class="Tk_bacg">
							<text class="Tk_text1">{{item.ticketTitle}}</text>
							<text class="Tk_text2">{{item.ticketComment_s1}}&nbsp;|&nbsp;{{item.ticketComment_s2}}&nbsp;|&nbsp;{{item.ticketComment_s3}}</text>
							<text class="Tk_text3">¥{{item.ticketAdultPrice}}元起</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- tabs点击切换栏 -->
		<view class="tabsBox">
			<QSTabs :current="current" :tabs="tabs" minWidth="80" @change="change($event)" />
		</view>

		<!-- 内容1 -->
		<view :hidden="current == 1">
			<view class="content" v-for="(item,index) in groupTitle" :key="index">
				<view class="title">
					<view style="background: #00B5FF;width: 56upx;height: 56upx;border-radius:4px;"><text class="titleId">{{item.groupId}}</text></view>
					<text class="contentTitle">{{item.groupTItle}}</text>
				</view>
				<view class="groupTour" v-for="(item2,index2) in item.content" :key="index2" v-if="index2<3" @click="details">
					<view class="groupContent">
						<image class="contentImage" :src="item2.contentImage" mode="aspectFill"></image>
					</view>
					<view class="groupText">
						<text class="contentText">{{item2.contentTitle}}</text>
						<text class="contentLabel">{{item2.contentLabelS1}} | {{item2.contentLabelS2}} | {{item2.contentLabelS3}}</text>
						<view class="groupCost">
							<text class="cost">￥<text class="contentCost">{{item2.cost}}</text>元</text>
							<text class="sellComment">已售{{item2.sell}}</text>
						</view>
					</view>
				</view>
				<view class="findMore" v-if="index>3">
					<text class="findMoreText" @click="selete(item.content)">查看更多>></text>
				</view>
			</view>
		</view>
		
		<!-- 筛选内容 -->
		<view :hidden="current == 0 ">
			<view class="content">
				<view class="groupTour" v-for="(item,index) in screenContent" :key="index">
					<view class="groupContent">
						<image class="contentImage" :src="item.contentImage" mode="aspectFill"></image>
					</view>
					<view class="groupText">
						<text class="contentText">{{item.contentTitle}}</text>
						<text class="contentLabel">{{item.contentLabelS1}} | {{item.contentLabelS2}} | {{item.contentLabelS3}}</text>
						<view class="groupCost">
							<text class="cost">￥<text class="contentCost">{{item.cost}}</text>元</text>
							<text class="sellComment">已售{{item.sell}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 分类面板 -->
		<view>
			<view class="cate-mask" :class="currentIndex===0 ? 'none' : currentIndex===1 ? 'show' : ''" @click="close">
				<view class="cate-content">
					<scroll-view scroll-y class="cate">
						<view class="cate-list" v-for="item2 in groupTitle" :key="item2.groupId" @click="changeCate(item2.content)">
							<text class="cate-Text">{{item2.groupId}}&nbsp;&nbsp;{{item2.groupTItle}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import citySelect from '@/components/HOME/uni-location/linzq-citySelect/linzq-citySelect.vue'
	import popupLayer from '@/components/HOME/uni-location/popup-layer/popup-layer.vue'
	import QSTabs from '../../../components/LYFW/independentTravel/QS-tabs/QS-tabs.vue'
	import uniPopup from '../../../components/LYFW/scenicSpotTickets/uni-popup/uni-popup.vue'
	export default {
		components: {
			citySelect,
			popupLayer,
			QSTabs,
			uniPopup
		},
		data() {
			return {
				searchValue: '', //搜索框值
				regionWeixin: '请选择', //微信地区数值
				regionApp : '请选择',//APP地区数值
				
				content:[],
				
				searchIndex: 0, //搜索框是否启用状态值
				searchData: '', //搜索后的值
				current: 0, //标题下标
				currentIndex : 0,//弹框默认值
				groupId:'',
				screenContent : [],
				
				tabs: ['推荐', '全部'], //选项标题
				groupTitle: [], //内容标题
				cateMaskState: 0, //分类面板展开状态
			}
		},

		onLoad(options) {
			// this.routeInit();
			this.Getpostion();
			this.routeData();
			
			// #ifdef  H5
			uni.getStorage({
				key:'userInfo',
				fail() {
					this.getCode();	
				}
			})
			//#endif
		},

		methods: {
			//读取静态数据json.js
			// async routeInit() {
			// 	let groupTour = await this.$api.lyfwcwd('groupTour');
			// 	this.groupTitle = groupTour.data;
			// },
			
			routeData : function(){
				uni.request({
					url:'http://218.67.107.93:9210/api/app/getPackageTourList',
					method:'POST',
					success: (e) => {
						console.log(e)
						this.groupTitle = e.data.data;
					}
				})
			},
			
			//获取定位数据
			Getpostion:function(){
				setTimeout(()=>{
					uni.getStorage({
						key:'wx_position',
						success:(res)=>{
							// console.log(res)
							this.regionWeixin = res.data;
						}
					}),
					
					uni.getStorage({
						key:'app_position',
						success: (res) => {
							// console.log(res)
							this.regionApp = res.data;
						}
					})
				},500)
				
			},
			
			//打开地区选择器
			oncity() {
				this.$refs.popupRef.show();
			},
			
			//地区获取
			backCity(e) {
				if (e !== 'no' && e !== 'yes') {
					// console.log(e)
					this.regionWeixin = e.cityName
					this.regionApp = e.cityName
					this.$refs.popupRef.close();
					// this.lyfwData();
					this.screenIndex = 0;
					this.searchIndex = 0;
				} else if(e == 'yes'){
					uni.getStorage({
						key:'wx_position',
						success:(res)=>{
							// console.log(res)
							this.regionWeixin = res.data;
						}
					}),
					uni.getStorage({
						key:'app_position',
						success: (res) => {
							// console.log(res)
							this.regionApp = res.data;
						}
					})
					this.$refs.popupRef.close();
				}else{
					this.$refs.popupRef.close();
				}
			},

			//搜索框-搜索
			searchNow: function() {
				if (this.searchValue == '') {
					uni.showToast({
						title: '未输入搜索关键字',
						icon: 'none',
						duration: 1000
					});
					// retuan false;
				}
				//搜索请求
				uni.hideKeyboard()
				uni.showLoading({
					title: '正在搜索',
				})
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/searchScenicspotList?searchValue=' + this.searchValue,
					method: 'POST',
					success: (res) => {
						if (res.data.msg == '搜索景区信息成功！') {
							this.searchData = res.data.data;
							this.searchValue = ''
							this.searchIndex = 1;
							uni.hideLoading()
							console.log(searchData)
						} else if (res.data.msg == '查不到相关景区，请确认景区名！') {
							uni.hideLoading()
							uni.showToast({
								title: '查不到相关景区！如:武夷/武夷山',
								icon: 'none',
								duration: 1500
							});
							this.searchValue = ''

						}
					}
				})
			},
			
			details:function(e){
				uni.navigateTo({
					url: '../currency/travelDetails'
				})
			},
			
			// details:function(e){
			// 	uni.navigateTo({
			// 		url: 'travelDetails?id=' +e
			// 	})
			// },

			//tabbar筛选点击
			change(e) {
				// console.log(e)
				if(e==0){
					this.current = e;
					this.currentIndex = 0;
				}else if(e==1){
					this.current = e;
					this.currentIndex = 1;
				}
				
			},
			close(){
				this.currentIndex = 0;
			},
			
			selete(e) {
				
				// console.log(e.contents)
				uni.setStorage({
					key: 'groupTour',
					data: e
				})
				uni.navigateTo({
					url: '/pages/LYFW/groupTour/viewMore'
				})
			},
			
			changeCate: function(e){
				console.log(e)
				this.currentIndex = 1;
				this.screenContent = e;	
			},
			// #ifdef  H5
			//获取openid
			getCode() {
				let that=this;
			    let Appid = "wx4f666a59748ab68f";//appid
				let code = this.getUrlParam('code'); //是否存在code
				console.log(code);
				let local = "http://nply.fjmtcy.com/#/pages/LYFW/groupTour/groupTourList";
				if (code == null || code === "") {
				  //不存在就打开上面的地址进行授权
					window.location.href =
						"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
						Appid +
						"&redirect_uri=" +
						encodeURIComponent(local) +
						"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"; 
				} else {
				  //存在则通过code传向后台调用接口返回微信的个人信息
					uni.request({
						url:'http://27.148.155.9:9055/CTKY/getWxUserinfo?code='+code+'&Appid='+Appid+'&Appsecret=788709805b9c0cbd3ccd3c7d0318c7bb',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						method:'POST',
						success(res) {
							console.log(res,"res")
							uni.setStorageSync('scenicSpotOpenId',res.data.openid)
							uni.setStorageSync('res',res.data)
							let user=res.data;
							uni.request({
								url:'http://218.67.107.93:9210/api/app/changeInfo',
								data:{
									nickname:user.nickname,
									openId_wx:user.openid,
									portrait:user.headimgurl,
									unid:'',
									openId_qq:'',
									gender:'',
									address:user.province+user.city,
									birthday:'',
									phoneNumber:'',
									username:user.nickname,
								},
								method:'POST',
								success(res1) {
									if(res1.data.msg=="信息保存成功！"){
										uni.setStorageSync('userInfo',res1.data.data)
										if(res1.data.data.phoneNumber==null){
											uni.navigateTo({
												url:'/pages/GRZX/wxLogin',
											})
										}else{
											that.logining=true;
											that.login(res1.data.data)
										}
									}
									console.log(res1,'res1')
								}
							})
						},
						fail(err){
							uni.showToast({
								title:"err是"+err.errMsg,
								icon:'none'
							})
						}
					})
				}
			},
			//判断code信息是否存在
			getUrlParam(name) {
				  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')  
				  let url = window.location.href.split('#')[0]   
				  let search = url.split('?')[1]  
				  if (search) {  
				    var r = search.substr(0).match(reg)  
				    if (r !== null) return unescape(r[2])  
				    return null  
				  } else {  
				    return null  
				  }  
			},
			 //#endif
		
		}
	}
</script>

<style lang="scss">
	//默认背景颜色
	page {
		background-color: #f6f6f6;
	}

	.topSearch {
		background-color: #FFFFFF;
		// margin-bottom: 20upx;

		//搜索框
		.searchTopBox {
			display: flex;
			text-overflow: ellipsis; //文本溢出：省略号
			padding: 32upx 32upx;

			.locationTxt {
				color: #333333;
				font-size: 36upx;
				font-weight: bold;
				text-overflow: ellipsis;
				margin-top: 16upx;
				width: 25%;
				text-overflow: ellipsis; //文本溢出：省略号
			}

			/* 向下小图标 */
			.icon {
				font-size: 20upx;
				color: #AAAAAA;
				margin-left: 15upx;
			}

			.searchBoxRadius {
				width: 76%;
				height: 78upx;
				background-color: #fff;
				border-radius: 46upx;
				background: #f5f5f5;

				.searchImage {
					padding-left: 24upx;
					padding-top: 18upx;
					width: 48upx;
					height: 48upx;
				}

				.inputIocale {
					position: absolute;
					height: 72upx;
					padding-top: 4upx;
					padding-left: 88upx;
					font-size: 30upx;
				}

			}
		}

		//Y轴滚动视图
		.Tk_scrollview {
			padding: 16upx 32upx;
			margin: 0 auto;

			.Tk_item {
				display: flex;

				.Tk_image {
					width: 182upx;
					height: 152upx;
					border-radius: 12upx;
					margin: 24rpx 0rpx;
				}

				.Tk_bacg {
					margin-top: 20upx;
					margin-left: 24upx;
				}

				.Tk_text1 {
					display: flex;
					text-overflow: ellipsis; //文章超出宽度隐藏并用...表示
					white-space: nowrap;
					overflow: hidden;
					width: 480upx; //内容宽度
				}

				.Tk_text2 {
					font-size: 26upx;
					margin-top: 16upx;
					color: #AAAAAA;
					display: block; // 让字体换行
				}

				.Tk_text3 {
					font-size: 24upx;
					margin-top: 24upx;
					text-align: right;
					color: #FF6600;
					display: block; // 让字体换行
				}
			}
		}
	}

	//tabs点击
	.tabsBox {
		// z-index: 999;
		position: sticky;
		top: 0;
		// width: 100%;
		// height: 80upx;
		background: #fff;
	}

	//内容1
	.content {
		background-color: #FFFFFF;
		padding: 0upx 32upx;
		padding-top: 39upx;
		margin-bottom: 20upx;

		.title {
			display: flex;

			.titleId {
				color: #FFFFFF;
				font-size: 34upx;
				margin: 0upx 18upx;
				line-height: 53upx;
			}

			.contentTitle {
				margin-left: 12upx;
				color: #333333;
				font-size: 40upx;
				font-weight: bold;
			}
		}

		.groupTour {
			display: flex;
			padding-top: 40upx;
			padding-bottom: 40upx;
			border-bottom: 1px #F5F5F5 dotted;

			.groupContent {

				// display: flex;
				.contentImage {
					width: 228upx;
					height: 190upx;
					border-radius: 8px;
				}
			}

			.groupText {
				margin-left: 25upx;

				.contentText {
					font-size: 36upx;
					font-weight: 40;
					font-family: Source Han Sans SC;
					overflow: hidden; //超出溢出
					-webkit-line-clamp: 2; //限制2行
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					text-align: justify;
					margin-top: 4upx;
				}

				.contentLabel {
					display: block;
					font-size: 28upx;
					color: #aba9aa;
					margin-top: 24upx;
				}

				.groupCost {
					margin-top: 18upx;
					position: relative;
					width: 430upx;

					.cost {
						font-size: 28upx;
						color: #FF6600;

						.contentCost {
							font-size: 36upx;
							color: #FF6600;
						}
					}

					.sellComment {
						position: absolute;
						font-size: 28upx;
						line-height: 53upx;
						color: #aba9aa;
						right: 0;
					}
				}
			}
		}

		.findMore {
			padding: 38upx 259upx;

			.findMoreText {
				font-size: 30upx;
				color: #aba9aa;
			}
		}
	}


	/* 分类 */
	.cate-mask {
		// z-index: 999;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
			z-index: 96;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}
	
	.cate{
		.cate-list{
			display: block;
			padding: 40upx 40upx;
			border-bottom: 1px #F5F5F5 dotted;
			.cate-Text{
				color: #333333;
				font-size: 34upx;
			}
		}
	}
</style>
