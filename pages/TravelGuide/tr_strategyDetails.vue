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
				<view class="date">{{(information.updatedTime.substr(0,10))}}&nbsp;&nbsp;浏览数:{{information.count}}</view>
			</view>
			<view class="grClass">
				<view class="grView">
					<view class="name">发布人:{{information.strategyType}}<text class="ladelView" v-if="information.publisher=='管理员'" style="background-color: #0CA1DF;">官方</text></view>
					<!-- <text class="number">电话:{{(titleClick.number.substr(0,3))+'*****'+(titleClick.number.substr(8,11))}}</text> -->
				</view>
			</view>
		</view>

		<!-- 门票滑块 -->
		<!-- 模块命名：Tk godetail(item) -->
		<view>
			<scroll-view class="Tk_scrollview">
				<view class="Tk_item" @click="checkAttention(1)">
					<view class="Tk_bacg">
						<text class="Tk_text1">同行人数信息</text>
						<text class="Tk_text2">同行人数:{{colleagueList[0].appColleagueList.length}}/5</text>
						<text class="Tk_text2" style="color: #FC4646;" v-if="colleagueList[0].appColleagueList.length==5">同行人数:5/5</text>
						<view class="Tk_butter">></view>
					</view>
				</view>
			</scroll-view>
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

		<!-- 底部 -->
		<view class="footer" v-if="information.colleagueStatus=='enable'" style="background: #06B4FD;" @click="confirmPeers">
			<text class="submit">我要同行</text>
		</view>
		<view class="footer" v-if="information.colleagueStatus=='disable'" style="background: #ffc600;" @click="alreadyPeers">
			<text class="submit">已同行</text>
		</view>
		
		<!-- 查看须知popup -->
		<popup ref="popup" type="bottom">
			<view class="boxView2">
				<view class="titleView2">
					<text class="Nb_text3">同行信息</text>
					<text class="Nb_text4 jdticon icon-fork" @click="close(1)"></text>
				</view>
				<scroll-view class="noticeBox2" scroll-y="ture">
					<view class="tv_title" v-for="(item,index) in colleagueList[0].appColleagueList" :key="index">
						<view class="ti_name">同行人:{{item.name}}</view>
						<view class="ti_telephone" v-if="userInfo.phoneNumber!==item.tel">联系电话:{{(item.tel.substr(0,3))+'*****'+(item.tel.substr(8,11))}}</view>
						<view class="ti_telephone" v-if="userInfo.phoneNumber==item.tel">联系电话:{{item.tel}}</view>
					</view>
				</scroll-view>
			</view>
		</popup>
	</view>
</template>

<script>
	import popup from "@/components/CZC/uni-popup/uni-popup.vue";
	export default {
		components: {
			popup
		},
		data() {
			return {
				picList: [], //相册图片数组
				titleClick: '', //标题,点击量
				type: 0,
				number: 2,
				arrangeText: [], //行程安排标题内容数组
				information: [{
					title: '', //标题
					createdTime: '', //时间
					content: '', //图文
				}],
				costDescription: [], //费用明细
				reserve: [], //预定须知
				reserveContent: '', //预定须知内容
				id: '',
				userInfo:[],//用户信息
				colleagueList:[{
					appColleagueList:[{
						name:'',
						tel:'',
					}]
				}],//同行列表
			}
		},

		onLoad(options) {
			this.id = options.id;
			this.routeInit();
			this.getUserInfo();//读取用户信息
		},
		
		onPullDownRefresh:function(){
			this.getArticleInfo();
		},
		
		onNavigationBarButtonTap: function() {
			
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

			//-------------------------------查看须知-----------------------------
			checkAttention(e) {
				if (e == 1) {
					this.$refs.popup.open()
				}
			},
			close(e) {
				if (e == 1) {
					this.$refs.popup.close()
				}
			},
			
			//--------------------------读取用户信息--------------------------
			getUserInfo() {
				var that = this;
				//读取用户ID
				uni.getStorage({
					key: 'userInfo',
					success: function(data) {
						console.log('用户数据',data)
						that.userInfo = data.data;
						// #ifdef MP-WEIXIN
						that.weixinOpenId = data.data.openId_xcx;
						// #endif
						that.getArticleInfo();
					}
				})
			},

			getArticleInfo: function() {
				var that = this;
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/get-strategy-detail',
					method: "GET",
					data: {
						id: this.id,
						colleagueId: this.userInfo.unid
					},
					success: (res) => {
						if(res.data.data.content!==" "){
							uni.stopPullDownRefresh();
							console.log('攻略', res)
							that.information = res.data.data;
							that.information.content = res.data.data.content.replace(/\<img/g,
								'<img style="max-width:100%;height:auto;margin: 2px 0px;" ');
							// console.log('攻略', that.information)
						}
					}
				});
				
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/colleague-list',
					method: "GET",
					data: {
						colleagueId: this.userInfo.unid
					},
					success: (res) => {
						// console.log('同行列表', res)
						this.colleagueList=res.data.data;
						console.log('同行列表', this.colleagueList)
					}
				});
			},
			
			
			// --------------------------------------确认同行------------------
			confirmPeers: function() {
				if(this.userInfo.username!==''){
					uni.showModal({
						title: '您确认要同行吗？',
						success: (res) => {
							console.log(res)
							if (res.confirm == true) {
								// console.log(this.parameter.AID)
								uni.showLoading({
									title: '正在请求同行'
								})
								uni.request({
									url: 'http://218.67.107.93:9210/api/app/colleague-apply',
									method: "GET",
									data: {
										id: this.id,
										colleagueId: this.userInfo.unid,
									},
									success: (res) => {
										console.log(res)
										if (res.data.msg == '申请成功') {
											uni.hideLoading()
											uni.showToast({
												title: '申请成功',
												icon: 'success'
											})
											uni.startPullDownRefresh();
										}else if(res.data.msg == '申请失败，您已申请过！'){
											uni.hideLoading()
											uni.showToast({
												title: '您已申请过！',
												icon: 'success'
											})
										} else {
											uni.hideLoading()
											uni.showToast({
												title: '申请失败',
												icon: 'success'
											})
										}
								
									},
									fail: () => {
										uni.hideLoading()
										uni.showToast({
											title: '服务器异常，请重试',
											icon: 'success'
										})
									}
								})
							} else {
								
							}
						}
					})
				}
			},
			
			alreadyPeers:function(){
				uni.showToast({
					title:'已同行',
					icon: 'success'
				})
			}
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
			margin-top: 30upx;
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
				// margin-left: 25upx;

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

	//Y轴滚动视图
	.Tk_scrollview {
		width: 100%;
		margin: 0 auto;
		background: #fff;

		.Tk_item {
			background: #f9f9f9;
			margin: 32upx 32upx;
			border-radius: 16upx;
			display: flex;
			box-shadow: 0px 1px 2px 0.1px #aaa;

			.Tk_bacg {
				position: relative;
				margin: 32upx 32upx;

				.Tk_text1 {
					font-size: 34upx;
					display: flex;
					text-overflow: ellipsis; //文章超出宽度隐藏并用...表示
					white-space: nowrap;
					overflow: hidden;
					width: 480upx; //内容宽度
				}

				.Tk_text2 {
					font-size: 26upx;
					margin-top: 20upx;
					display: block; // 让字体换行
					text-overflow: ellipsis; //文章超出宽度隐藏并用...表示
					white-space: nowrap;
					overflow: hidden;
					width: 400upx; //内容宽度
				}

				.Tk_butter {
					position: absolute;
					bottom: 22upx;
					right: -158upx;
					font-size: 36upx;
					text-align: center;
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
		width: 92%;
		height: 100upx;
		justify-content: space-between;
		font-size: 30upx;
		z-index: 998;
		box-shadow: 0 0 20px 0 rgba(0, 18, 251, 0.2);
		border-radius: 14upx;
		text-align: center;
		margin-bottom: 30upx;
		margin-left: 30upx;
		margin-right: 30upx;
		justify-content: center;

		.submit {
			color: #fff;
			font-size: 32upx;
		}
	}
	
	//途径点弹框
	.boxView2 {
		width: 90%;
		padding: 16upx 40upx;
		padding-bottom: 40upx;
		background: #FFFFFF;
		z-index: 999;
	
		.titleView2 {
			margin-top: 24upx;
	
			//弹框标题
			.Nb_text3 {
				position: relative;
				font-size: 38upx;
				font-weight: bold;
				top: 8upx;
			}
	
			//弹框关闭按钮
			.Nb_text4 {
				margin-top: 8upx;
				float: right;
				color: #333;
				font-size: 32upx;
			}
		}
	
		.noticeBox2 {
			line-height: 32upx;
			height: 910upx;
			margin-top: 26upx;
	
			.tv_title {
				width: 100%;
				border-bottom: 1px #F5F5F5 dotted;
				
				.ti_name{
					font-size: 30upx;
					margin-top: 40upx;
				}
				
				.ti_telephone{
					font-size: 30upx;
					margin-top: 40upx;
					margin-bottom: 40upx;
				}
			}
		}
	}
</style>
