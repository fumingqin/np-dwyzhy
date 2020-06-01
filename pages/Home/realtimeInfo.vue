<template>
	<view class="container">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titleNViewBackground: '',
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
			}
		},
		onLoad() {
			this.loadData();
		},
		onPullDownRefresh:function(){
			this.loadData(); //请求接口数据
		},
		methods: {
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
							console.log(e)
						}
					})
					setTimeout(()=>{
						uni.stopPullDownRefresh();
					},1000)
					
			},
			
			//资讯详情页
			informationTo:function(e) {
				uni.navigateTo({
					url: 'InformationDetails?id=' +e
				})
			}
		},
		
		
		 
	}
</script>

<style lang="scss">
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
		padding: 32upx;
		color: #333333;
		font-size: 34upx;
		font-weight: bold;
		background: #fff;

	}
</style>
