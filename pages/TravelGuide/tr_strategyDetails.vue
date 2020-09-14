<template>
	<view>
		<!-- 顶部轮播图（可点击进入相册并放大） -->
		<swiper class="swi" circular autoplay>
			<swiper-item class="swiItem" @click="goImgList">
				<image :src="information.imgUrl" />
				<!-- <view class="view">{{imgnumber}}</view> -->
			</swiper-item>
		</swiper>

		<!-- 标题、发布时间-->
		<view class="titleClass">
			<text class="title">{{information.title}}</text>
			<view class="dateCost">
				<view class="date">{{information.updatedTime}}&nbsp;&nbsp;浏览数:{{information.count}}</view>
			</view>
		</view>


		<!-- 景区介绍 -->
		<view>
			<!-- 内容 -->
			<view class="scenicspotContent">
				<view class="content2">
					<rich-text :nodes="information.content"></rich-text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				picList: [], //相册图片数组
				titleClick: '', //标题,点击量
				type: 0,
				arrangeText: [], //行程安排标题内容数组
				information: [{
					title: '', //标题
					createdTime: '', //时间
					content: '', //图文
				}],
				costDescription: [], //费用明细
				reserve: [], //预定须知
				reserveContent: '', //预定须知内容
				id:'',
			}
		},

		onLoad(options) {
			this.id = options.id;
			this.routeInit();
			this.getArticleInfo();
			// this.dayInit();
		},

		onNavigationBarButtonTap: function() {
			this.share();
		},

		methods: {
			//读取静态数据json.js
			async routeInit() {
				let routeComment2 = await this.$api.lyfwcwd('routeComment2');
				this.picList = routeComment2.data.image;
				let travel = await this.$api.lyfwcwd('travel');
				this.titleClick = travel.data;
				let arrange = await this.$api.lyfwcwd('arrange');
				this.arrangeText = arrange.data;
				let description = await this.$api.lyfwcwd('description');
				this.costDescription = description.data;
				let reserve = await this.$api.lyfwcwd('reserve');
				this.reserve = reserve.data;
			},

			//保存图片至本地并打开新页面
			goImgList() {
				uni.setStorageSync('imagePiclist', this.picList);
				uni.navigateTo({
					url: '/pages/LYFW/currency/imglist'
				})
			},

			// tabClick(e) {
			// 	if (e == 0) {
			// 		this.type = 0;
			// 	} else if (e == 1) {
			// 		this.type = 1;
			// 	} else if (e == 2) {
			// 		this.type = 2;
			// 	} else if (e == 3) {
			// 		this.type = 3;
			// 	}

			// },

			getArticleInfo: function() {
				var that = this;
				// uni.request({
				// 	url: 'http://218.67.107.93:9210/api/app/getInformationList?id=' + this.id,
				// 	method: "POST",
				// 	success: function(res) {
				// 		that.information = res.data.data;
				// 		for (var i = 0; i < res.data.data.length; i++) {
				// 			that.information[i].content = res.data.data[i].content.replace(/\<img/g,
				// 				'<img style="max-width:100%;height:auto;margin: 2px 0px;" ');
				// 		}
				// 		console.log(res)
				// 	}
				// });
				
				// uni.request({
				// 	url: 'http://218.67.107.93:9210/api/app/get-strategy-list',
				// 	method: "GET",
				// 	success: (res) => {
				// 		console.log('攻略', res)
				// 	}
				// });
				
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/get-strategy-detail',
					method: "GET",
					data:{
						id:this.id
					},
					success: (res) => {
						// console.log('攻略', res)
						that.information = res.data.data;
						that.information.content = res.data.data.content.replace(/\<img/g,
							'<img style="max-width:100%;height:auto;margin: 2px 0px;" ');
						console.log('攻略', that.information)
					}
				});
			},

			//点击跳转付款页面
			submit: function() {
				uni.navigateTo({
					url: '../scenicSpotTickets/orderAdd',
				})
			},

			//点击客服
			godetail: function() {
				uni.showToast({
					title: '你点击了' + this.titleClick.scenicName,
					icon: 'none'
				})
				setTimeout(function() {
					uni.navigateTo({
						url: ''
					})
				}, 500);
			},

			//分享
			share() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 0,
					href: "pages/LYFW/ouristRoute/travelArrange",
					title: "来自" + this.titleClick.name + "的分享",
					summary: this.titleClick.scenicName,
					imageUrl: this.picList[0].ticketImage,
					success: function() {
						uni.showToast({
							title: '分享成功',
							duration: 3000
						})
					},
					fail: function() {
						uni.showToast({
							title: '分享失败',
							duration: 3000
						})
					}
				});
			},


		}
	}
</script>

<style lang="scss">
	//默认背景颜色
	page {
		background-color: #f6f6f6;
	}

	//轮播图样式
	.swi {
		width: 100%;
		height: 440upx;

		.swiItem {
			width: 100%;
			height: 100%;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}


	//标题
	.titleClass {
		position: relative;
		padding-top: 29upx;
		border-radius: 27upx 27upx 0 0;
		width: 100%;
		background-color: #FFFFFF;
		margin-top: -25upx;
		padding-bottom: 47upx; //暂时的，事后有数据了之后要删除

		.title {
			display: flex;
			color: #333333;
			font-size: 44upx;
			font-weight: bold;
			margin-right: 40upx;
			margin-left: 40upx;
			margin-top: 16upx;
		}

		.dateCost {
			padding-top: 29upx;
			padding-left: 40upx;
			padding-right: 40upx;

			.date {
				position: relative;
				display: flex;
				font-size: 28upx;
				color: #aba9aa;

				.cost1 {
					position: absolute;
					font-size: 30upx;
					color: #FC4646;
					right: 0;
					top: -11upx;

					.cost2 {
						font-size: 40upx;
						color: #FC4646;
					}
				}
			}
		}

		.grClass {
			position: relative;
			display: flex;
			margin-top: 60upx;
			margin-left: 40upx;
			margin-right: 40upx;
			padding-bottom: 30upx;

			// padding-right: 40upx;
			.txImage {
				border-radius: 50%;
				width: 88upx;
				height: 88upx;
			}

			.grView {
				margin-left: 25upx;

				.name {
					display: flex;
					font-size: 32upx;
					color: #333333;

					.ladelView {
						border-radius: 5px;
						margin-left: 11upx;
						font-size: 20upx;
						color: #FFFFFF;
						text-align: center;
						width: 80upx;
						height: 35upx;
						line-height: 32upx;
						margin-top: 5upx;
					}
				}

				.number {
					display: block;
					font-size: 28upx;
					color: #aba9aa;
					padding-top: 10upx;
				}
			}

			.address {
				position: absolute;
				font-size: 32upx;
				color: #333333;
				right: 0;
				top: 16upx;
			}
		}

		.ladel {
			display: flex;
			border-radius: 2px;
			font-size: 20upx;
			color: #FFFFFF;
		}
	}

	//筛选样式
	.screen {
		background: #FFFFFF;


		.screenView {
			left: 0;
			display: flex;
			width: 100%;
			height: 97upx;
			background: #fff;
			z-index: 10;
			position: sticky;
			top: 0;
			// background-color: #F5F5F5;
			margin-top: 20upx;

			.screenText {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				font-size: 30upx;
				color: #888;
				position: relative;



				&.current {
					color: #06B4FD;
					// background-color: #FFFFFF;

					&:after {
						content: '';
						position: absolute;
						left: 50%;
						bottom: 0;
						transform: translateX(-50%);
						width: 104upx;
						height: 0;
						border-bottom: 4upx solid #06B4FD;
					}
				}
			}
		}
	}

	// 景区介绍
	.scenicspotContent {
		background: #FFFFFF;
		// padding: 40upx 30upx;
		padding: 0 30upx;
		flex-direction: column;

		.content2 {
			padding-top: 50upx;
			padding-bottom: 106upx;
			letter-spacing: 4upx;
			line-height: 48upx;
			// text-indent:2em;
			text-align: justify;
			font-size: 30upx;

		}
	}


	// 行程安排样式
	.scheduling {
		background: #FFFFFF;
		padding-left: 40upx;
		padding-top: 56upx;
		padding-bottom: 106upx;

		.tripTitle {
			display: flex;

			.circle {
				position: relative;
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
				border: 2px #06B4FD solid;

				.circleDay {
					position: absolute;
					font-size: 28upx;
					color: #06B4FD;
					top: 12upx;
					left: 12upx;
				}
			}

			.title {
				font-size: 40upx;
				color: #333333;
				font-weight: bold;
				padding-left: 31upx;
				padding-top: 5upx;
			}
		}

		.contentView {
			margin-top: 50upx;
			margin-left: 32upx;
			border-left: 2upx dashed rgba(200, 200, 200, 1);

			.hotel {
				padding-left: 71upx;
				padding-bottom: 30upx;

				.iconHotel {
					position: relative;
					width: 39upx;
					height: 33upx;
				}

				.hotelText {
					font-size: 30upx;
					color: #aba9aa;
					margin-left: 18upx;
				}
			}

			.content {
				// display: flex;
				margin-right: 30upx;

				.informationTitle {
					display: flex;
					flex-direction: column;

					.titleDian {
						position: relative;
						width: 18upx;
						height: 18upx;
						background: rgba(6, 180, 253, 1);
						border-radius: 50%;
						top: 32upx;
						left: -9upx;
					}

					.title2 {
						font-size: 32upx;
						padding-right: 15upx;
						font-weight: bold;
						color: #333333;
						padding-left: 46upx;
						line-height: 47upx;
						letter-spacing: 4upx;
						text-align: justify;
					}
				}

				.informationTime {
					margin-top: 25upx;
					font-size: 30upx;
					color: #aba9aa;
					padding-left: 46upx;
					line-height: 47upx;
					letter-spacing: 4upx;

					.time {}
				}

				.informationText {
					font-size: 30upx;
					padding-left: 46upx;
					margin-top: 30upx;
					padding-bottom: 30upx;
					letter-spacing: 4upx;
					line-height: 48upx;
					text-align: justify;
				}
			}
		}
	}

	// 费用说明
	.description {
		background: #FFFFFF;
		padding-bottom: 106upx;

		.costDescription {
			position: relative;
			padding-top: 41upx;

			.costTitle {
				font-weight: bold;
				font-size: 34upx;
				padding-left: 30upx;
			}

			.costText {
				padding-top: 13upx;
				padding-left: 30upx;
				padding-right: 30upx;
				font-size: 30upx;
				color: #5E5E60;
				text-align: justify;
				line-height: 52upx;
			}
		}

	}

	// 预定须知
	.preset {
		.presetNeeds {
			background: #FFFFFF;
			padding-bottom: 106upx;

			.reserve {
				position: relative;
				padding-top: 41upx;

				.reserveTitle {
					font-weight: bold;
					font-size: 34upx;
					padding-left: 30upx;
				}

				.reserveText {
					padding-top: 13upx;
					font-size: 30upx;
					color: #5E5E60;
					line-height: 52upx;
					padding-left: 30upx;
					padding-right: 30upx;
					text-align: justify;
				}
			}
		}
	}

	//底部
	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background: #fff;
		z-index: 998;
		color: #f85e52;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.footerPrice {
			padding-left: 55upx;

			.kfIcon {
				// position: relative;
				width: 40upx;
				height: 36upx;
				color: rgba(44, 45, 45, 1);
				// top: 7upx;
			}

			.zfIcon {
				padding-left: 50upx;
				width: 32upx;
				height: 33upx;
				color: rgba(44, 45, 45, 1);
			}
		}

		.submitChange {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			background: #06B4FD;

			.submit {
				color: #fff;
				font-size: 32upx;
			}
		}
	}
</style>
