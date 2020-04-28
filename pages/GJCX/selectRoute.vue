<template>
	<view>
		<view class="bgColor"></view>
		<view class="box1">
			<view class="searchBoxRadius2">
				<image class="searchImage2" src="../../static/GCJX/busIndex/green.png" />
				<text class="text1">泉州茶叶大厦</text>
			</view>
			<view class="searchBoxRadius2">
				<image class="searchImage2" src="../../static/GCJX/busIndex/red.png" />
				<text class="text1">信和站</text>
			</view>
		</view>
		<view class="box2">
			
		</view>
	</view>
</template>

<script>
	import amapFile from '../../components/HOME/uni-location/amap/amap-wx.js'
	export default {
		data() {
			return {
				key: "134acca8871d797b16a9a6a0a873bab5",//申请的高德地图key（申请的web key）
			}
		},
		onLoad() {
			this.getpages();
		},
		methods: {
			getpages:function(){
							 var that=this;
							var myAmapFun = new amapFile.AMapWX({
												  key: '134acca8871d797b16a9a6a0a873bab5',
												  });
							// console.log(myAmapFun);
							myAmapFun.getTransitRoute({
								origin: '116.481028,39.989643',
								      destination: '116.434446,39.90816',
								      city: '北京',
							  success:(data) =>{
								console.log(data);
							  },
							  fail:(res)=>{
													console.log(res)
												}
							});
							 
			},
		}
	}
</script>

<style lang="scss">
.bgColor {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #F3F3F3;
		z-index: -1;
	}
	.box1{
		width: 670rpx;
		background-color: #ffffff;
		padding-left: 20upx;
		margin-left: 32upx;
		border-radius: 11rpx;
		margin-bottom: 45upx;
		margin-top: 20upx;
		height: 180upx;
		.searchBoxRadius2 {
			// right: -157upx;
			width: 83%;
			height: 74upx;
			background-color: #fff;
			display: flex;
			position: relative;
			background: #ffffff;
		
			.searchImage2 {
				padding-left: 16upx;
				padding-top: 38upx;
				width: 50upx;
				height: 48upx;
				transform: scale(0.5);
			}
		.text1{
			font-size: 34upx;
			font-weight: bold;
			padding-top: 25upx;
		}
		// .text2{
		// 	font-size: 34upx;
		// 	font-weight: bold;
		// 	padding-top: 20upx;
		// }
		}
	}
	.box2{
		width: 670rpx;
		background-color: #ffffff;
		padding-left: 20upx;
		margin-left: 32upx;
		border-radius: 11rpx;
		margin-bottom: 45upx;
		margin-top: 20upx;
	}
</style>
