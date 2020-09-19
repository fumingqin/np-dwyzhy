<template>
	<view>
		<!-- 内容1 -->
		<view>
			<view class="content">
				<view class="groupTour" v-for="(item,index) in groupTitle" :key="index" @click="details(item.id)" v-if="item.auditStatus==1">
					<view class="groupContent">
						<image class="contentImage" :src="item.imgUrl" mode="aspectFill"></image>
					</view>
					<view class="groupText">
						<text class="contentText">{{item.title}}</text>
						<!-- <text class="contentLabel">{{item2.contentLabelS1}} | {{item2.contentLabelS2}} | {{item2.contentLabelS3}}</text> -->
						<view class="groupCost">
							<text class="cost2">阅读量:{{item.count}}</text>
							<text class="cost">{{(item.updatedTime.substr(0,10))}}</text>
							<text class="sellComment" style="color: #42e800;" v-if="item.dataState=='Enable'">可同行</text>
							<text class="sellComment" style="color: #ff0000;" v-if="item.dataState!=='Enable'">不可同行</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import citySelect from '@/components/HOME/uni-location/linzq-citySelect/linzq-citySelect.vue'
	import popupLayer from '@/components/HOME/uni-location/popup-layer/popup-layer.vue'
	import QSTabs from '@/components/LYFW/independentTravel/QS-tabs/QS-tabs.vue'
	import uniPopup from '@/components/CZC/uni-popup/uni-popup.vue'
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
				content:[],
				searchIndex: 0, //搜索框是否启用状态值
				searchData: '', //搜索后的值
				current: 0, //标题下标
				currentIndex : 0,//弹框默认值
				groupId:'',
				screenContent : [],
				time:'',//年月日
				tabs: ['推荐', '全部'], //选项标题
				groupTitle: [], //内容标题
				cateMaskState: 0, //分类面板展开状态
			}
		},

		onLoad(options) {
			// #ifdef H5
			uni.showToast({
				title:'公众号当前定位无法启用，已默认定位南平市',
				icon:'none'
			})
			this.regionWeixin = '南平市'; //h5无法自动定位，采用手动赋值
			// #endif
			// this.routeInit();
			this.routeData();
			
			// #ifdef  H5
			var that=this;
			uni.getStorage({
				key:'userInfo',
				fail() {
					that.getCode();	
				}
			})
			//#endif
		},

		methods: {
			routeData : function(){
				// uni.request({
				// 	url:'http://218.67.107.93:9210/api/app/getPackageTourList',
				// 	method:'POST',
				// 	success: (e) => {
				// 		console.log(e)
				// 		this.groupTitle = e.data.data;
				// 	}
				// });
				
				uni.request({
					url:'http://218.67.107.93:9210/api/app/get-strategy-list',
					method:'GET',
					success: (e) => {
						console.log(e)
						this.groupTitle = e.data.data;
					}
				})
			},
			
			//-------------------------------时间转换-------------------------------
			turnDate(date) {
				var setTime = setTime.substr(0, 10);
				return setTime;
			},
			
			details:function(e){
				uni.navigateTo({
					url: './tr_strategyDetails?id='+e,
				})
			},
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
			padding-top: 60upx;
			padding-bottom: 60upx;
			border-bottom: 1px #F5F5F5 dotted;

			.groupContent {

				// display: flex;
				.contentImage {
					width: 228upx;
					height: 148upx;
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
					-webkit-line-clamp: 1; //限制2行
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
						display: block;
						font-size: 28upx;
						color: #aba9aa;
						padding-top: 10upx;
					}
					
					.cost2 {
						font-size: 28upx;
						color: #aba9aa;
					}
					
					.sellComment {
						position: absolute;
						font-size: 28upx;
						right: 0;
						bottom: 0;
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
