<template>
	<view>
		<!-- 顶部图片 -->
		<view class="zl_topPicture">
			<image class="zl_image" src="../../static/Home/ho_zhly/kaiyuanshi.png" mode="aspectFill"></image>
		</view>

		<!-- 顶部点击跳转栏 -->
		<view class="zl_click">
			<view class="zl_topClick">
				<!-- 自由行 -->
				<view class="zl_independentTravel">
					<image class="zl_itImage" src="../../static/Home/ho_zhly/ziyouxin.png"></image>
					<text class="zl_itText">自由行</text>
				</view>
				<!-- 跟团游 -->
				<view class="zl_groupTour">
					<image class="zl_gtImage" src="../../static/Home/ho_zhly/gentuanyou.png"></image>
					<text class="zl_gtText">跟团游</text>
				</view>
				<!-- 景区门票 -->
				<view class="zl_admissionTicket">
					<image class="zl_atImage" src="../../static/Home/ho_zhly/jinqugoupiao.png"></image>
					<text class="zl_atText">景区门票</text>
				</view>
				<!-- 景区商品 -->
				<view class="zl_commodity">
					<image class="zl_coImage" src="../../static/Home/ho_zhly/jinqushangpin.png"></image>
					<text class="zl_coText">景区门票</text>
				</view>
			</view>
		</view>

		<!-- 消息通告 -->
		<view class="notice">
			<view class="zl_content">
				<image class="zl_noImage" src="../../static/Home/ho_zhly/xiaoxitonggao.png" mode="aspectFill"></image>
				<view class="zl_noContent">
					<text class="zl_noText">{{Announcement.zl_title}}</text>
					<view class="zl_label">
						<view class="la_label" v-for="(item,index) in Announcement.LabelContent" :key="index" v-if="index<2">
							<text class="la_background" style="background-color: #e2f1fa;border-radius:20px;">{{item.lc_text}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 旅游推荐 -->
		<view class="zl_recommend">
			<view>
				<view class="zl_reContent">
					<text class="zl_reTitle">旅游推荐</text>
					<text class="zl_reMore">更多></text>
				</view>
			</view>
			<view class="zl_reContent2">
				<view class="zl_contentImage1">
					<!-- 泉州小西埕 -->
					<view class="ct_content1">
						<image class="ct_image1" :src="recommendedContent[0].rc_image" mode="aspectFill"></image>
						<text class="ct_text1" style="background:rgba(0,0,0,1);opacity:0.7;border-radius:4px;margin-left: 10upx;margin-bottom: 21upx;">{{recommendedContent[0].rc_text}}</text>
					</view>
					<!-- 稻田摸鱼 -->
					<view class="ct_content2">
						<image class="ct_image2" :src="recommendedContent[1].rc_image" mode="aspectFill"></image>
						<text class="ct_text2" style="background:rgba(0,0,0,1);opacity:0.7;border-radius:4px;margin-left: 10upx;margin-bottom: 21upx;">{{recommendedContent[1].rc_text}}</text>
					</view>
				</view>

				<view class="zl_contentImage2">
					<!-- 泉州钟楼 -->
					<view class="ct_content3">
						<image class="ct_image3" :src="recommendedContent[2].rc_image" mode="aspectFill"></image>
						<text class="ct_text3" style="background:rgba(0,0,0,1);opacity:0.7;border-radius:4px;margin-left: 10upx;margin-bottom: 21upx;">{{recommendedContent[2].rc_text}}</text>
					</view>
					<!-- 泉州洛阳桥 -->
					<view class="ct_content4">
						<image class="ct_image4" :src="recommendedContent[3].rc_image" mode="aspectFill"></image>
						<text class="ct_text4" style="background:rgba(0,0,0,1);opacity:0.7;border-radius:4px;margin-left: 10upx;margin-bottom: 21upx;">{{recommendedContent[3].rc_text}}</text>
					</view>
					<!-- 七彩官畲 -->
					<view class="ct_content5">
						<image class="ct_image5" :src="recommendedContent[4].rc_image" mode="aspectFill"></image>
						<text class="ct_text5" style="background:rgba(0,0,0,1);opacity:0.7;border-radius:4px;margin-left: 10upx;margin-bottom: 21upx;">{{recommendedContent[4].rc_text}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Announcement: '', //通知内容
				recommendedContent: [], //推荐内容
			}
		},
		onLoad() {
			this.routeInit();
		},
		methods: {
			//读取静态数据json.js
			async routeInit() {
				let Announcement = await this.$api.lyfwcwd('Announcement');
				this.Announcement = Announcement.data;
				let recommendedContent = await this.$api.lyfwcwd('recommendedContent');
				this.recommendedContent = recommendedContent.data;
			},
		}
	}
</script>

<style lang="scss">
	//默认背景颜色
	page {
		background-color: #f6f6f6;
	}

	//顶部图片
	.zl_topPicture {
		width: 750upx;
		height: 406upx;

		.zl_image {
			width: 100%;
			height: 100%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	//顶部点击跳转栏
	.zl_click {
		position: absolute;
		background: rgba(255, 255, 255, 1);
		border-radius: 12px;
		z-index: 2;
		width: 706upx;
		height: 178upx;
		margin-left: 22upx;
		top: 352upx;
		box-shadow: 0px 6px 20px 0px rgba(231, 231, 231, 0.53);

		.zl_topClick {
			display: flex;

			// 自由行
			.zl_independentTravel {
				position: relative;
				margin: 44upx 45upx;

				.zl_itImage {
					width: 44upx;
					height: 44upx;
					margin: 0rpx 15rpx 11rpx 15rpx;
				}

				.zl_itText {
					font-size: 26upx;
					color: FF333333;
					display: block;
				}
			}

			//跟团游
			.zl_groupTour {
				position: relative;
				margin: 44upx 45upx;

				.zl_gtImage {
					width: 53upx;
					height: 44upx;
					margin: 0rpx 12rpx 11rpx 12rpx;
				}

				.zl_gtText {
					font-size: 26upx;
					color: FF333333;
					display: block;
				}
			}

			//景区门票
			.zl_admissionTicket {
				position: relative;
				margin: 44upx 40upx;

				.zl_atImage {
					width: 48upx;
					height: 35upx;
					margin: 0rpx 27rpx 18rpx 27rpx;
				}

				.zl_atText {
					font-size: 26upx;
					color: FF333333;
					display: block;
				}
			}

			//景区商品
			.zl_commodity {
				position: relative;
				margin: 44upx 39upx;

				.zl_coImage {
					width: 42upx;
					height: 41upx;
					margin: 0rpx 29rpx 11rpx 29rpx;
				}

				.zl_coText {
					font-size: 26upx;
					color: FF333333;
					display: block;
				}
			}
		}
	}

	//消息通告
	.notice {
		background: #fff;
		margin-top: 146upx;

		.zl_content {
			display: flex;

			.zl_noImage {
				width: 146upx;
				height: 83upx;
				margin: 47upx 0upx;
				margin-left: 32upx;
			}

			.zl_noContent {

				.zl_noText {
					display: flex;
					font-size: 26upx;
					color: #333333;
					margin-top: 35upx;
					margin-left: 46upx;
				}

				.zl_label {
					display: flex;
					margin-left: 35upx;
					margin-top: 27upx;

					.la_label {
						margin-right: 10upx;

						.la_background {
							background-color: #e2f1fa;
							border-radius: 20px;
							font-size: 24upx;
							color: #7fbbe1;
							padding: 9upx 20upx;
						}
					}
				}
			}
		}
	}

	// 旅游推荐
	.zl_recommend {
		background: #fff;
		margin-top: 20upx;
		padding: 0 31upx;

		.zl_reContent {
			position: relative;
			padding-top: 40upx;

			.zl_reTitle {
				font-size: 32upx;
				color: #333333;
				font-weight: bold;
			}

			.zl_reMore {
				position: absolute;
				padding-right: 31upx;
				padding: 4upx 0;
				right: 0;
				font-size: 24upx;
				color: #5E5E60;
			}
		}

		.zl_reContent2 {
			padding-top: 42upx;
			padding-bottom: 40upx;

			.zl_contentImage1 {
				display: flex;
				
				// 泉州小西埕
				.ct_content1 {
					display: flex;
					position: relative;
					margin-right: 10upx;

					.ct_image1 {
						width: 454upx;
						height: 207upx;
						overflow: hidden;

					}

					.ct_text1 {
						position: absolute;
						font-size: 22upx;
						bottom: 0;
						padding: 11upx 15upx;
						color: #fff;
					}
				}
				
				// 稻田摸鱼
				.ct_content2 {
					display: flex;
					position: relative;

					.ct_image2 {
						width: 222upx;
						height: 207upx;
						overflow: hidden;

					}

					.ct_text2 {
						position: absolute;
						font-size: 22upx;
						bottom: 0;
						padding: 11upx 15upx;
						color: #fff;
					}
				}
			}
			
			.zl_contentImage2{
				display: flex;
				margin-top: 20upx;
				
				// 泉州钟楼
				.ct_content3 {
					display: flex;
					position: relative;
				
					.ct_image3 {
						width: 222upx;
						height: 207upx;
						overflow: hidden;
				
					}
				
					.ct_text3 {
						position: absolute;
						font-size: 22upx;
						bottom: 0;
						padding: 11upx 15upx;
						color: #fff;
					}
				}
				// 泉州洛阳桥
				.ct_content4 {
					display: flex;
					position: relative;
					margin-left: 10upx;
				
					.ct_image4 {
						width: 222upx;
						height: 207upx;
						overflow: hidden;
				
					}
				
					.ct_text4 {
						position: absolute;
						font-size: 22upx;
						bottom: 0;
						padding: 11upx 15upx;
						color: #fff;
					}
				}
				// 七彩官畲
				.ct_content5 {
					display: flex;
					position: relative;
					margin-left: 10upx;
				
					.ct_image5 {
						width: 222upx;
						height: 207upx;
						overflow: hidden;
				
					}
				
					.ct_text5 {
						position: absolute;
						font-size: 22upx;
						bottom: 0;
						padding: 11upx 15upx;
						color: #fff;
					}
				}
			}
		}
	}
</style>
