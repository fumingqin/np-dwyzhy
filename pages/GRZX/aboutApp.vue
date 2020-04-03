<template>
	<view class="content">
		<image src="../../static/GRZX/logo_wuyi.png" class="logoClass"></image>
		<text class="titleClass">{{title}}</text>
		<text class="versionClass">{{versionNum}}</text>
		<view class="boxClass1">
			<view class="functionClass" @click="functionClick">
				<text class="fontClass">{{functionIntroduction}}</text>
				<image src="../../static/GRZX/btnRight.png" class="imgClass1"></image>
			</view>
			<view class="checkClass" @click="checkClick">
				<text class="fontClass">{{checkVersion}}</text>
				<text class="appVersionClass">{{appVersion}}</text>
				<image src="../../static/GRZX/btnRight.png" class="imgClass2"></image>
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
				title:'大武夷智慧游',
				versionNum:'Version 1.0.0',
				functionIntroduction:'功能介绍',
				checkVersion:'检查新版本',
				appVersion:'',
				agreement:'《软件许可及服务协议》',
				privacy:'《隐私保护指引》',
				copyright1:'途游信息科技 版权所有',
				copyright2:'Copyright©2020 Journey',
				copyright3:'All Rights Reserved',
			}
		},
		onShow() {
			this.appVersion=plus.runtime.version;
		},
		methods:{
			agreementClick(){
				//console.log(63)
				uni.showToast({
					title: '软件许可及服务协议',
					icon:"none"
				})
			},
			privacyClick(){
				uni.showToast({
					title: '隐私保护指引',
					icon:"none"
				})
			},
			functionClick(){
				uni.showToast({
					title: '功能介绍',
					icon:"none"
				})
			},
			checkClick(){
				//var version=plus.runtime.version;
				uni.showToast({
					title: '检查新版本',
					icon:"none"
				})
			}
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
		width: 160upx;
		height: 160upx;
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
		top:364upx;
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
		color: #9299b4;
		font-size: 30upx;
		margin-left: 26%;
		width: 350upx;
		height: 30upx;
		line-height: 30upx;
	}
	.privacyClass{
		color: #9299b4;
		font-size: 30upx;
		margin-left: 26%;
		width: 350upx;
		height: 30upx;
		line-height: 30upx;
	} 
	.copyrightClass{
		color: #b6b6b6;
		font-size: 26upx;
	}
	.imgClass1{
		position: absolute;
		top:34upx;
		right: 0%;
		width: 50upx;
		height: 50upx;
	}
	.imgClass2{
		position: absolute;
		top:145upx;
		right: 0%;
		width: 50upx;
		height: 50upx;
	}
	.appVersionClass{
		position: absolute;
		right: 7%;
		font-size: 32upx;
		color: #b6b6b6;
	}
</style>
