<template>
	<view class="content">
		<image src="../../static/GRZX/logo5.png" class="logoClass"></image>
		<text class="titleClass">{{title}}</text>
		<text class="versionClass">{{versionNum}}  {{version}}</text>
		<view class="boxClass1">
			<!-- <view class="functionClass" @click="functionClick">
				<text class="fontClass">{{functionIntroduction}}</text>
				<image src="../../static/GRZX/btnRight.png" class="imgClass1"></image>
			</view> -->
			<view class="checkClass" @click="checkClick">
				<text class="fontClass">{{checkVersion}}</text>
				<!-- <text class="textCLass">{{version}}</text> -->
				<image src="../../static/GRZX/btnRight.png" class="imgClass1"></image>
			</view>
		</view>
		<view class="boxClass2">
			<text class="agreementClass" @click="agreementClick">{{agreement}}</text>
			<text class="privacyClass" @click="privacyClick">{{privacy}}</text>
			<text class="copyrightClass">{{copyright1}}</text>
			<text class="copyrightClass">{{copyright2}}</text>
			<text class="copyrightClass">{{copyright3}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				systemName:'大武夷智慧游',
				title:'大武夷智慧游',
				versionNum:'Version',
				functionIntroduction:'功能介绍',
				checkVersion:'检查新版本',
				agreement:'《软件许可及服务协议》',
				privacy:'《隐私政策》',
				copyright1:'今点通旅游 版权所有',
				copyright2:'Copyright©2020 Journey',
				copyright3:'All Rights Reserved',
				version:'',
			}
		},
		onLoad(){
			//#ifdef APP-PLUS
			this.version=plus.runtime.version;
			//#endif
		},
		methods:{
			functionClick(){
				uni.showToast({
					icon:'none',
					title:'功能介绍'
				})
			},
			checkClick(){
				var that=this;
				uni.request({
					url:that.$Grzx.Interface.getAppVersion.url+'?systemName='+that.systemName,
					method:that.$Grzx.Interface.getAppVersion.method,
					success(res) {
						console.log(res)
						if(that.version!=res.data.VersionCode){
							uni.showModal({
							    content: '是否下载新版本',
							    success: (e)=>{
							    	if(e.confirm){
										plus.runtime.openURL(res.data.DownLoadUrl);
							    	}
							    }
							});
						}else{
							uni.showToast({
								icon:'none',
								title:'当前版本为最新版本'
							})
						}
					}
				})
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
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #FFFFFF;
	}
	.content{
		
	}
	.logoClass{		//LOGO样式
		position: absolute;
		top:100upx;
		left: 39%;
		width: 200upx;
		height: 200upx;
	}
	.titleClass{	//大武夷智慧游
		position: absolute;
		top:300upx;
		width: 100%;
		font-size: 50upx;
		font-weight: bold;
		text-align: center;
	}
	.versionClass{	//版本号
		position: absolute;
		top:360upx;
		width: 100%;
		font-size: 36upx;
		text-align: center;
	}
	.boxClass1{
		position: absolute;
		top:520upx;
		left: 5%;
		width: 90%;
		font-size: 34upx;
		display: flex;
		flex-direction: column;
	}
	.boxClass2{
		position: absolute;
		bottom:40upx;
		width: 100%;
		display: flex;
		text-align: center;
		flex-direction: column;
	}
	.functionClass{		//功能介绍
		width: 100%;
		height: 110upx;
		line-height: 110upx;
		border-top: 1upx solid #EAEAEA;
	}
	.checkClass{		//检查新版本
		width: 100%;
		height: 110upx;
		line-height: 110upx;
		border-top: 1upx solid #EAEAEA;
		border-bottom: 1upx solid #EAEAEA;
	}
	.fontClass{
		margin-left: 3%;
	}
	.agreementClass{
		color: #96a0b4;
		font-size: 30upx;
		margin-left: 28%;
		width: 335upx;
		height: 30upx;
		line-height: 30upx;
		margin-bottom: 15upx;
	}
	.privacyClass{
		color: #96a0b4;
		font-size: 30upx;
		margin-left: 28%;
		width: 335upx;
		height: 30upx;
		line-height: 30upx;
		margin-bottom: 10upx;
	} 
	.copyrightClass{
		color: #bababa;
		font-size: 26upx;
		margin-bottom: 5upx;
	}
	.imgClass1{
		width: 45upx;
		height: 45upx;
		position: absolute;
		top:35upx;
		right: 0%;
	}
	.imgClass2{
		width: 45upx;
		height: 45upx;
		position: absolute;
		top:146upx;
		right: 0%;
	}
	.textCLass{
		font-size: 30upx;
		position: absolute;
		top:2upx;
		//top:116upx;
		right: 6%;
	}
</style>
