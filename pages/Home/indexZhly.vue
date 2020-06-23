<template>
	<view class="container">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view class="mp-search-box">
			<input class="ser-input" type="text" value="输入关键字搜索" disabled @click="searchTo" />
		</view>
		<!-- #endif -->

		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{background:titleNViewBackground}"></view>
			<swiper class="carousel" circular @change="swiperChange" autoplay>
				<swiper-item v-for="(item, index) in rotationPicture" :key="index" class="carousel-item" @click="navToDetailPage(index)">
					<image style="width: 100%;" :src="item.ticketImage" mode="aspectFill" />
				</swiper-item>
			</swiper>

			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<!-- 分类 -->
		<view class="cate-section">
			<view class="cate-item" @click="route1">
				<image src="../../static/Home/indexzhly/fujin.png" mode="aspectFit"></image>
				<text>自由行</text>
			</view>
			<view class="cate-item" @click="route2">
				<image src="../../static/Home/indexzhly/luxian.png" mode="aspectFit"></image>
				<text>跟团游</text>
			</view>
			<view class="cate-item" @click="route3">
				<image src="../../static/Home/indexzhly/gongJiao.png" mode="aspectFit"></image>
				<text>公交查询</text>
			</view>
			<view class="cate-item" @click="route4">
				<image src="../../static/Home/indexzhly/menpiao.png" mode="aspectFit"></image>
				<text>景区门票</text>
			</view>
			<view class="cate-item" @click="route5">
				<image src="../../static/Home/indexzhly/chepiao.png" mode="aspectFit"></image>
				<text>车票订购</text>
			</view>
		</view>
		<!-- #ifdef H5 -->
		<!-- <view style="margin-top: 24upx;width: 90%;border: 1upx solid #007AFF;height: 500upx;word-break:break-all;">测试url：{{cod}}</view> -->
		<!-- #endif -->
		
		<!-- 南平景区 -->
		<view class="titNp">南平景区</view>
		<view class="npjc-section">
			<view style="position: relative;">
				<image class="image1" mode="aspectFill" :src="square[0].ticketImage" @click="navTo(0)"></image>
				<view class="text1">{{square[0].ticketName}}</view>
			</view>
			<view style="position: relative;">
				<image class="image2" mode="aspectFill" :src="square[1].ticketImage" @click="navTo(1)"></image>
				<view class="text2">{{square[1].ticketName}}</view>
				<image class="image2" mode="aspectFill" :src="square[2].ticketImage" @click="navTo(2)"></image>
				<view class="text3">{{square[2].ticketName}}</view>
				<image class="image3" mode="aspectFill" :src="square[3].ticketImage" @click="navTo(3)"></image>
				<view class="text4">{{square[3].ticketName}}</view>
			</view>
		</view>

		<!-- 资讯信息 -->
		<view class="titNp">资讯信息</view>
		<view class="guess-section">
			<view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="informationTo(item.id)">
				<view class="image-wrapper">
					<image :src="item.imgUrl" mode="aspectFill"></image>
				</view>
				<view class="title clamp">{{item.title}}</view>
				<view>
					<image class="Portrait" src="../../static/GRZX/missing-face.png" mode="aspectFill"></image>
					<text class="price">{{item.createdTime}}</text>
					<text class="price-zan">阅读{{item.count+1080}}</text> 
				</view>
			</view>
		</view>
		
		<!-- 服务协议和隐私政策 -->
		<uni-popup ref="centerPopup" type="center">
			<view class="centerClass">
				<view class="pTitleClass">服务协议和隐私政策</view>
				<view class="pTextClass">
					<text>请你务必审慎阅读，充分理解"软件许可及服务协议"和"隐私政策"各条款。</br>你可阅读</text>
					<text style="color: #2F9BFE;" @click="agreementClick">《软件许可及服务协议》</text>
					<text>和</text>
					<text style="color: #2F9BFE;" @click="privacyClick">《隐私政策》</text>
					<text>了解详细信息。如你同意，请点击"同意"开始接受我们的服务。</text>
				</view>
				<view class="btnBox">
					<view class="btnClass1" @click="closeApp">暂不使用</view>
					<view class="btnClass2" @click="confirm">同意</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 检查新版本-->
		<uni-popup ref="versionPopup" type="center">
			<view class="versionClass">
				<view class="vTitleClass">检查新版本</view>
				<view class="vTextClass">
					检查到新版本，是否立即更新？
				</view>
				<view class="vbtnBox">
					<view class="btnClass1 fs" @click="neverUpdateApp">不再提醒</view>
					<view class="btnClass1 fs" @click="notUpdateApp">暂不更新</view>
					<view class="btnClass2 fs" @click="updateApp">更新</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/HOME/uni-popup/uni-popup.vue";
	import {
		mapState,
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				npjq: [],
				autoplay: true,
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				rotationPicture: [],
				goodsList: [],
				square: [{
					ticketId: '',
					ticketName: '',
					ticketImage: '',
				}, {
					ticketId: '',
					ticketName: '',
					ticketImage: '',
				}, {
					ticketId: '',
					ticketName: '',
					ticketImage: '',
				}, {
					ticketId: '',
					ticketName: '',
					ticketImage: '',
				}],
				
				DownLoadUrl:'',//app下载地址
				version:'',//当前app的版本号
				systemName:'大武夷智慧游',//系统名称
			}
		},
		onLoad() {
			this.loadData();
			
			//-------------H5授权登录------------
			// #ifdef  H5	
			var that=this;
			uni.getStorage({
				key:'userInfo',
				fail() {
					that.getCode();	
				}
			})
			//#endif
			
			//-------------app服务协议和隐私政策------------
			// #ifdef  APP-PLUS ||MP-WEIXIN
				this.loadService();
			//#endif
			
			//-------------app检查新版本------------
			// #ifdef  APP-PLUS ||MP-WEIXIN
				// this.loadVersion();
				this.version=plus.runtime.version;
			//#endif
			
		},
		components: { uniPopup },  //注册为子组件
		onShow() {
		},
		onPullDownRefresh:function(){
			this.loadData(); //请求接口数据
		},
		methods: {
			...mapMutations(['login']),
			loadData: function() {
				// 轮播图
				uni.request({
						url: 'http://218.67.107.93:9266/travelImage/getRotationPicture',
						method: 'POST',
						header: {'content-type': 'application/x-www-form-urlencoded'},
						success: (e) => {
							// console.log(e)
							this.titleNViewBackground = e.data.data[0].background;
							this.swiperLength = e.data.data.length;
							this.rotationPicture = e.data.data;
						}
					}),
					// 四宫格
					uni.request({
						url: 'http://218.67.107.93:9210/api/app/getFourScenicspotList',
						method: 'POST',
						success: (e) => {
							// console.log(e)
							this.square = e.data.data;
						}
					})
					// 资讯
					uni.request({
						url: 'http://218.67.107.93:9210/api/app/getInformationList',
						method: 'POST',
						success: (e) => {
							this.goodsList = e.data.data;
							//console.log(e)
						}
					})
					setTimeout(()=>{
						uni.stopPullDownRefresh();
					},1000)
					
			},


			//轮播图切换修改背景色
			swiperChange:function(e) {
				// console.log(e)
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.rotationPicture[index].background;
			},
			//轮播图跳详情页
			navToDetailPage:function(e) {
				uni.navigateTo({
					url: '/pages/LYFW/scenicSpotTickets/ticketsDetails?ticketId=' + JSON.stringify(this.rotationPicture[e].ticketId)
				})
			},
			
			//资讯详情页
			informationTo:function(e) {
				uni.navigateTo({
					url: 'InformationDetails?id=' +e
				})
			},
			
			//四方格跳详情
			navTo:function(e) {
				uni.navigateTo({
					url: '/pages/LYFW/scenicSpotTickets/ticketsDetails?ticketId=' + JSON.stringify(this.square[e].ticketId)
				})
			},
			
			//金刚区各模块入口
			route1:function() {
				// #ifdef MP-WEIXIN
				uni.redirectTo({
					url: '/pages/LYFW/independentTravel/it_list'
				})
				// #endif
				// #ifndef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/LYFW/independentTravel/it_list'
				})
				// #endif
			},
			route2:function() {
				// #ifdef MP-WEIXIN
				uni.redirectTo({
					url: '/pages/LYFW/groupTour/groupTourList'
				})
				// #endif
				// #ifndef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/LYFW/groupTour/groupTourList'
				})
				// #endif
			},
			route3:function() {
				// #ifdef MP-WEIXIN
				uni.redirectTo({
					url: '/pages/GJCX/busIndex'
				})
				// #endif
				// #ifndef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/GJCX/busIndex'
				})
				// #endif
			},
			route4:function() {
				// #ifdef MP-WEIXIN
				uni.redirectTo({
					url: '/pages/LYFW/scenicSpotTickets/ticketsList'
				})
				// #endif
				// #ifndef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/LYFW/scenicSpotTickets/ticketsList'
				})
				// #endif
			},
			route5:function() {
				console.log('点击了');
				uni.getStorage({
					key:'userInfo',
					success:function(res){
						console.log(res)
						if(res.data.unid){
							uni.navigateTo({
								url: '/pages/CTKY/ctkyIndex'
							})
						}
					},
					fail:function(){
						console.log('失败了');
						uni.showModal({
							content:'暂未登录，请问是否登录？',
							success: (res) => {
								if(res.confirm){
									uni.navigateTo({
										url:'../GRZX/userLogin?loginType=4'
									})
								}
							}
						})
					}
				})
			},
			
			//小程序-搜索框点击事件
			searchTo:function(){
				uni.navigateTo({
					url: './navigation'
				})
			},
			// #ifdef  H5
			//获取openid
			getCode() {
				let that=this;
			    let Appid = "wx4f666a59748ab68f";//appid
				let code = this.getUrlParam('code'); //是否存在code
				console.log(code);
				let local = "http://wxsp.npzhly.com/#/";
				var indexCode=uni.getStorageSync('indexCode');
				if (code == indexCode||code == null || code === "") {
				  //不存在就打开上面的地址进行授权
					window.location.href =
						"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
						Appid +
						"&redirect_uri=" +
						encodeURIComponent(local) +
						"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"; 
				} else {
				  //存在则通过code传向后台调用接口返回微信的个人信息
					uni.setStorageSync('indexCode',code);
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
										}
									}
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
			 
			 //-----------加载是否服务------------
			 loadService:function(){
			 	var that=this;
			 	uni.getStorage({
			 		key:'acceptService',
			 		success(res) {
			 			console.log(res)
			 			if(!res.data){
			 				that.openPopup('centerPopup');
			 			}else{
							that.loadVersion();
						}
			 		},
			 		fail(err) {
			 			that.openPopup('centerPopup');
			 		}
			 	})
			 },
			 //-----------开启弹窗------------
			 openPopup: function(value) {
			 	this.$nextTick(function() {
			 		this.$refs[value].open();
			 	});
			 },
			 //-----------关闭弹窗------------
			 closePopup: function(value) {
			 	this.$nextTick(function() {
			 		this.$refs[value].close();
			 	});
			 },
			 confirm:function(){
			 	uni.setStorageSync('acceptService',true);
			 	this.closePopup('centerPopup');
				this.loadVersion(); //app检查新版本
			 },
			 closeApp(){
				// #ifdef APP-PLUS  
				plus.runtime.quit();  
				// #endif 
			 },
			agreementClick(){
				uni.navigateTo({
					url:'/pages/GRZX/privacyService?title=软件许可及服务协议',
				})
			},
			privacyClick(){
				uni.navigateTo({
					url:'/pages/GRZX/privacyService?title=隐私政策',
				})
			},
			
			//-------------app检查新版本------------
			loadVersion:function(){
				var that=this;
				uni.getStorage({
					key:'tipVersion',
					success(res) {
						console.log(res)
						if(!res.data){
							that.checkVersion();
						}
					},
					fail(err) {
						that.checkVersion();
					}
				})
			},
			checkVersion:function(){
				var that=this;
				uni.request({
					url:that.$Grzx.Interface.getAppVersion.url+'?systemName='+that.systemName,
					method:that.$Grzx.Interface.getAppVersion.method,
					success(res) {
						console.log(res)
						if(that.version!=res.data.VersionCode){
							that.DownLoadUrl=res.data.DownLoadUrl;
							that.openPopup('versionPopup');
						}
					}
				})
			},
			updateApp:function(){
				plus.runtime.openURL(this.DownLoadUrl);
			},
			notUpdateApp:function(){
				this.closePopup('versionPopup');
			},  
			neverUpdateApp:function(){
				uni.setStorageSync('tipVersion',true);
				this.closePopup('versionPopup');
			},
		},
		
		// #ifndef MP
		// 搜索框点击事件
		onNavigationBarSearchInputClicked: async function(e) {
			uni.navigateTo({
				url: 'navigation'
			})
		},
		
		
		//扫描按钮点击事件
		onNavigationBarButtonTap(e) {
			// console.log(e);
			const index = e.index;
			if (index === 0) {
				uni.scanCode({
					onlyFromCamera: true,
					success: function(res) {
						void plus.runtime.openWeb(res.result, function() {
							//识别失败
						});
					}
				})
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				//消息点击事件
				uni.navigateTo({
					url: '/pages/GRZX/myNews'
				})
			}
		},
		// #endif
		 
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	.mp-search-box {
		position: relative;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 79%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: #aaa;
			border-radius: 20px;
			background: rgba(255, 255, 255, .6);
		}
	}

	page {
		.cate-section {
			position: relative;
			z-index: 5;
		}

		.carousel-section {
			padding: 0;

			.titleNview-placing {
				position: absolute;
				top: 0;
			}

			.titleNview-background {
				height: 376upx;
			}

			.carousel {
				background: #FFFFFF;

				.carousel-item {}
			}

			.swiper-dots {
				top: 400upx;
			}
		}
	}
	/* #endif */
	
	/* #ifdef H5 */
	page {
		.carousel-section {
			.titleNview-background {
				height: 376upx;
			}
			.carousel {
				margin-top: 0upx;
			}
			.swiper-dots {
				top: 400upx;
			}
		}
	}
	/* #endif */
	
	

	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 16upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		padding-top: 10px;

		.titleNview-placing {
			height: var(64upx);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 440upx;
			transition: .4s;
		}
	}

	.carousel {
		margin-top: 56upx;
		height: 350upx;
		padding: 0 28upx;
		background: #FFFFFF;

		.carousel-item {
			width: 100%;
			height: 100%;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		top: 460upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 26upx;
			color: #333;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 56upx;
			height: 56upx;
			margin-bottom: 16upx;
			opacity: .7;
		}
	}

	/* 南平景区-样式*/
	.npjc-section {
		display: flex;
		padding: 0 30upx;
		background: #fff;
		font-size: 30upx;
		color: #fff;
		.text1 {
			position: absolute;
			bottom: 48upx;
			left: 24upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 200upx;

		}

		.text2 {
			position: absolute;
			bottom: 220upx;
			left: 32upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 172upx;
		}

		.text3 {
			position: absolute;
			bottom: 220upx;
			left: 256upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 172upx;
		}

		.text4 {
			position: absolute;
			bottom: 48upx;
			left: 32upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 360upx;
		}

		.image1 {
			width: 240upx;
			height: 340upx;
			border-radius: 6px;
			margin-bottom: 24upx;
		}

		.image2 {
			width: 213upx;
			height: 164upx;
			margin-left: 12upx;
			border-radius: 6px;
		}

		.image3 {
			width: 438upx;
			height: 164upx;
			margin-left: 12upx;
			margin-top: 4upx;
			border-radius: 3px;
			margin-bottom: 24upx;
		}
	}

	,

	/* 南平周边-样式*/
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 360upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: 32upx;
			color: #333;
			line-height: 72upx;
			display: block;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			width: 160px;
		}

		.Portrait {
			width: 40upx;
			height: 40upx;
			opacity: 1;
		}

		.price {
			position: relative;
			font-size: 26upx;
			color: #666;
			left: 54upx;
			top: 32upx;
			max-width: 5;
			display: block;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			width: 76px;
			margin-top: -80upx;
		}

		.price-zan {
			font-size: 24upx;
			color: #666;
			float: right;
			margin-top: 3upx;
		}
	}

	/*通用字体样式*/
	.titNp {
		margin-top: 24upx;
		padding: 32upx;
		color: #333333;
		font-size: 34upx;
		font-weight: bold;
		background: #fff;

	}
	
	//服务协议的弹框start
	.centerClass{  //弹框的样式
		width: 78%;
		margin-left: 11%;
		background-color: #FFFFFF;
		border-radius: 20upx;
	}
	.pTitleClass{
		padding-top: 15upx;
		text-align: center;
		font-size: 38upx;
		color: #333333;
		padding: 40upx 0 20upx 0;
	}
	.pTextClass{
		width: 80%;
		margin-left: 10%;
		font-size: 34upx;
	}
	.btnBox{
		width: 100%;
		border-top: 1upx solid #EAEAEA;
		margin-top: 80upx;
		display: flex;
		flex-direction: row; //column纵向，row横向
	}
	.btnClass1{
		color: #333333;
		text-align: center;
		width: 50%;
		font-size: 38upx;
		padding: 25upx 0;
		border-right: 1upx solid #EAEAEA;
	}
	.btnClass2{
		color: #2F9BFE;
		text-align: center;
		width: 50%;
		font-size: 38upx;
		padding: 25upx 0;
	}
	//服务协议的弹框end
	
	//检查新版本的弹框start
	.versionClass{  //弹框的样式
		background-color: #FFFFFF;
		border-radius: 20upx;
	}
	.vTitleClass{
		padding-top: 15upx;
		text-align: center;
		font-size: 38upx;
		color: #333333;
		padding: 40upx 180upx 40upx 180upx;
	}
	.vTextClass{
		width: 100%;
		text-align: center;
		font-size: 34upx;
	}
	.vbtnBox{
		width: 100%;
		border-top: 1upx solid #EAEAEA;
		margin-top: 70upx;
		display: flex;
		flex-direction: row; //column纵向，row横向
	}
	.fs{
		font-size: 34upx;
	}
	//检查新版本的弹框end
</style>
