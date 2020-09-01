<template>
	<view class="content">
		<view class="backImg">
			<image src="../../static/GRZX/backImg.png" class="imgClass"></image>
			<!-- #ifdef MP-WEIXIN -->
			<image src="../../static/GRZX/set.png" class="setClass" @click="navTo('/pages/GRZX/set')"></image>
			<image src="../../static/GRZX/info.png" class="infoClass" @click="navTo('/pages/GRZX/myNews')"></image>
			<!-- #endif -->
			<view class="userInfoClass" @click="checkLogin">
				<image class="portraitClass" :src="portrait || '/static/GRZX/missing-face.png'"></image>
				<text class="usernameClass">{{nickname || '游客'}}</text>
			</view>
			
			<view class="typeBox">
				<image src="../../static/GRZX/huangguan.png" class="imgTubiao"></image>
				<text class="fontClass">普通用户</text>
			</view>
			
			<view class="grzyClass" @click="checkLogin">
				<text>个人主页</text>
				<image src="../../static/GRZX/btnRight_Home.png" class="rightClass"></image>
			</view>
			
			<view class="myBox">
				<view class="collection" @click="collectionClick">
					<image src="../../static/GRZX/tubiao_shoucan.png" class="imgStyle1" mode="aspectFill"></image>
					<text class="myFont">我的收藏</text>
				</view>
				<view class="order" @click="orderClick">
					<image src="../../static/GRZX/tubiao_dingdan.png" class="imgStyle2" mode="aspectFill"></image>
					<text class="myFont">我的订单</text>
				</view>
				<view class="history" @click="historyClick">
					<image src="../../static/GRZX/tubiao_lishi.png" class="imgStyle3" mode="aspectFill"></image>
					<text class="myFont">我的历史</text>
				</view>
			</view>
		</view>
		
		<image src="../../static/GRZX/advert.png" class="advertClass"></image>
	
		<view class="serviceBox">
			<text class="moreClass">更多服务</text>
			<view class="boxClass" v-for="(item,index) in serviceList" :key="index" @click="clickService(item.title)" :class="index==0?'':'borderTop'">
				<image :src="item.src" :class="item.style"></image>
				<text class="fontStyle">{{item.title}}</text>
				<image src="../../static/GRZX/tubiao_Right.png" class="btnClass"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/GRZX/mix-list-cell';
	import { pathToBase64, base64ToPath } from '../../components/GRZX/js_sdk/gsq-image-tools/image-tools/index.js';
	export default{
		components: {
			listCell
		},
		data(){
			return{
				QQ:'2482549389',
				portrait:'',
				nickname:'',
				userInfo:'',
				
				serviceList:[{
					title:'信息管理',
					style:'iconClass1',
					src:'../../static/GRZX/tubiao_zhengzhao.png',
				},
				{
					title:'QQ客服',
					style:'iconClass2',
					src:'../../static/GRZX/tubiao_kefu.png',
				},
				{
					title:'我要投诉',
					style:'iconClass3',
					src:'../../static/GRZX/tubiao_tousu.png',
				},
				{
					title:'上传定位',
					style:'iconClass4',
					src:'../../static/GRZX/tubiao_dingwei.png',
				}]
			}
		},
		onLoad(){
		},
		onShow(){
			this.loadData();
		},
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if(index === 0){
				uni.navigateTo({
					url:'/pages/GRZX/set'
				})
			}
			if(index === 1){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url:'/pages/GRZX/myNews'
				})
			}
			if(index === 2){
				uni.scanCode({
					onlyFromCamera:true,
					success:function(res){
						void plus.runtime.openWeb(res.result,function(){
							//识别失败
						});
					}
				})
			}
			
		},
		methods:{
			loadData(){
				var that=this;
				uni.showLoading({
					title:'加载信息中..'
				})
				uni.getStorage({
					key:'userInfo',
					success(res){
						uni.hideLoading();
						if(res.data.phoneNumber!=""&&res.data.phoneNumber!=null){
							uni.request({
								url:that.$Grzx.Interface.login.url+'?phoneNumber='+res.data.phoneNumber,
								method:'POST',
								success(res1) {
									uni.setStorageSync('userInfo',res1.data.data)
									if(res1.data.data.nickname==""||res1.data.data.nickname==null){
										that.nickname="请输入昵称";
									}else{
										that.nickname=res1.data.data.nickname;
									}
									var base64=res1.data.data.portrait;
									if(base64!=""&&base64!=null&&that.isBase64(base64)){
										base64ToPath(base64)
										  .then(path => {
											that.portrait=path;
										  })
										  .catch(error => {
											console.error(error)
										  })	
									}else{
										that.portrait=base64;
									}
								}
							})
						}else{
							//#ifdef H5
							uni.showToast({
								title:'该用户未绑定手机号',
								icon:'none'
							})
							//#endif
						}
					},
					fail() {
						uni.hideLoading();
						that.nickname='';
						that.portrait='';
					}
				})
			},
			orderClick(){
				uni.switchTab({
					url:'/pages/order/OrderList'
				})
			},
			navTo(e){
				uni.navigateTo({
					url:e,
				})
			},
			clickService(e){
				switch (e){
					case '信息管理':
						uni.navigateTo({
							url:'/pages/GRZX/infoList'
						})
						break;
					case 'QQ客服':
						this.QQClick();
						break;
					case '我要投诉':
						uni.navigateTo({
							url:'/pages/GRZX/complaint'
						}) 
						break;
					case '上传定位':
						uni.navigateTo({
							url:'/pages/GRZX/uploadPositon'
						}) 
						break;
					default:
						return '';
				}
			},
			checkLogin(){
				uni.getStorage({
					key:'userInfo',
					fail() {
						uni.showToast({
							title : '请先登录',
							icon : 'none',
						})
						setTimeout(function(){
							uni.navigateTo({	
								//loginType=1,泉运登录界面
								//loginType=2,今点通登录界面
								//loginType=3,南平综合出行界面
								//loginType=4,武夷股份登录界面(大武夷智慧游)
								url  : '/pages/GRZX/userLogin?loginType=4&&urlData=1'
							}) 
						},500);
					},
					success(res) {
						console.log(res,"183")
						// #ifdef  H5
						if(res.data.phoneNumber==null||res.data.phoneNumber==""){
							uni.showToast({
								title:'未绑定手机号，请绑定手机号',
								icon:'none',
							})
						  setTimeout(function(){
							uni.navigateTo({
								url :'/pages/GRZX/wxLogin',
							})
						  },1000);
						}else{
							uni.navigateTo({
								url :'/pages/GRZX/personal',
							})  
						}
						// #endif
						
						// #ifndef  H5
						uni.navigateTo({
							url :'/pages/GRZX/personal',
						})
						// #endif
					}
				})

			},
			collectionClick(){
				uni.navigateTo({
					url:'/pages/GRZX/collection'
				}) 
			},
			historyClick(){
				uni.navigateTo({
					url:'/pages/GRZX/history'
				}) 
				
			},
			scanClick(){
				uni.showToast({
					title : '扫一扫',
					icon : 'none',
				})
			},
			QQClick(){
				//#ifdef APP-PLUS
				plus.runtime.openURL('mqq://im/chat?chat_type=wpa&uin=' + this.QQ + '&version=1&src_type=web ');
				//#endif
				//#ifndef APP-PLUS
				uni.showToast({
					title:'该功能只能在app上使用',
					icon:'none',
				})
				//#endif
			},
			//------------判断是否为base64格式-----------
			isBase64:function(str) {
			    if (str ==='' || str.trim() ===''){ return false; }
			    try {
			        return btoa(atob(str)) == str;
			    } catch (err) {
			        return false;
			    }
			},
		}
		
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F9FA;
	}
	.content{
		
	}
	.backImg{ 
		width: 100%;
		height: 490upx;
	}
	.imgClass{ //背景图片
		width: 100%;
		height: 490upx;
	}
	.setClass{ //设置按钮
		width: 47upx;
		height: 45upx;
		position: absolute;
		left: 4.67%;
		top: 74upx;
	}
	.scanClass{ //扫一扫按钮
		width: 44upx;
		height: 41upx;
		position: absolute;
		left: 14.8%;
		top: 74upx;
	}
	.infoClass{ 	//消息按钮
		width: 47upx;
		height: 42upx;
		position: absolute;
		left: 20%;
		top: 74upx;
	}
	.userInfoClass{ 	//包括头像昵称
		position: absolute;
		left: 4.53%;
		top:161upx;
		height: 127upx;
		width: 68.4%;
		display: flex;
		flex-direction: row;
	}
	.portraitClass{ 	//头像
		border-radius: 50%;
		width: 127upx;
		height: 127upx;
	}
	.usernameClass{		//昵称
		font-size: 48upx;
		color: #FFFFFF;
		margin-top: 20upx;
		margin-left: 3%;
		width: 350upx;
		display: block;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.grzyClass{  		//个人主页
		width: 20%;
		height: 34upx;
		position: absolute;
		left:75.47%;
		top: 200upx;
		color: #FFFFFF;
		font-size: 28upx;
		line-height: 27upx;
	}
	.rightClass{
		width: 10%;
		height: 29upx;
		position: absolute;
		left:82%;
		/* #ifdef APP-PLUS */
		top:-3upx;
		/* #endif */
		top:0upx;
	}
	.typeBox{  //普通用户
		width: 126upx;
		height: 42upx;
		background-color: #3480B8;
		position: absolute;
		top: 245upx;
		left: 24%;
		border-radius: 8upx;
	}
	.imgTubiao{
		width: 15%;
		height: 21upx;
		position: absolute;
		left: 9upx;
		top: 10upx;
	}
	.fontClass{
		font-size: 20upx;
		color: #FFFFFF;
		line-height: 42upx;
		height: 42upx;
		position: absolute;
		left: 34upx;
		top: 1upx;
	}
	.editClass{		//修改按钮
		width: 40upx;
		height: 40upx;
		margin-left: 17upx;
		margin-top: 25upx;
	}
	.myBox{			//包括我的收藏，我的订单，我的历史
		width: 91.47%;
		height: 170upx;
		position: absolute;
		left: 4.27%;
		top:341upx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		border-radius: 12upx;
	}
	.collection{		//我的收藏
		width: 33.33%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.imgStyle1{
		width: 61upx;
		height: 59upx;
		margin-top: 31upx;
		margin-left: 36.68%;
	}
	.order{				//我的订单
		width: 33.33%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.imgStyle2{
		width: 55upx;
		height: 56upx;
		margin-top: 32upx;
		margin-left: 36.68%;
	}
	.history{			//我的历史
		width: 33.34%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.imgStyle3{
		width: 58upx;
		height: 57upx;
		margin-top: 31upx;
		margin-left: 36.68%;
	}
	.myFont{		//文字的样式
		color: #2C2D2D;
		height: 27upx;
		line-height: 27upx;
		font-size:28upx;
		font-family: SourceHanSansSC-Regular;
		margin-top: 22upx;
		text-align: center;
	}
	.advertClass{		//广告
		width: 91.47%;
		height: 160upx;
		margin-top: 42upx;
		margin-left: 4.27%;
	}
	.serviceBox{		//更多服务
		width:91.47%;
		background-color: #FFFFFF;
		border-radius: 12upx;
		margin-top: 10upx;
		margin-left: 4.27%;
		display: flex;
		flex-direction: column;
	}
	.moreClass{		
		font-size:32upx ;
		font-weight: bold;
		color: #000000;
		margin-top: 34upx;
		margin-left: 3.55%;
	}
	.boxClass{
		width: 620upx;
		height: 104upx;
		margin-top: 0upx;
		margin-left: 4.27%;
		position: relative;
	}
	.marginTop{
		margin-top: 18upx;
	}
	
	.iconClass1{  //证照信息图标
		width: 42upx;
		height: 34upx;
		margin-top: 34upx;
		margin-left: 8upx;
	}
	.iconClass2{  //客服图标
		width: 40upx;
		height: 38upx;
		margin-top: 34upx;
		margin-left: 9upx;
	}
	
	.iconClass3{  //我的投诉图标
		width: 36upx;
		height: 39upx;
		margin-top: 29upx;
		margin-left: 13upx;
	}
	.iconClass4{  //上传定位图标
		width: 40upx;
		height: 40upx;
		position: absolute;
		left: 11upx;
		top:31upx;
	}
	.btnClass{
		width: 11upx;
		height: 22upx;
		position: absolute;
		left: 610upx;
		top:43upx;
	}
	.fontStyle{
		font-size: 28upx;
		color: #2C2D2D;
		position: absolute;
		left: 80upx;
		top:33upx;
	}
	.borderTop{
		border-top: 1upx solid #EAEAEA;
	}
</style>
