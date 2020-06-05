<template>
	<view>
		<!-- 搜索栏 -->
		<view class="searchTopBox">
			<!-- #ifdef MP -->
			<text class="locationTxt" @click="oncity">{{regionWeixin}}<text class="icon jdticon icon-xia"></text></text>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<text class="locationTxt" @click="oncity">{{regionApp}}<text class="icon jdticon icon-xia"></text></text>
			<!-- #endif -->
			<view class="searchBoxRadius">
				<input class="inputIocale" type="search" v-model="searchValue" @confirm="searchNow" placeholder="搜索景区名称" />
				<image class="searchImage" src="../../static/LYFW/currency/search.png" />
			</view>
		</view>

		<!-- 选择地址 -->
		<popup-layer ref="popupRef" :direction="'right'">
			<view style="width:750upx;height: 100%;">
				<citySelect @back_city="backCity"></citySelect>
			</view>
		</popup-layer>

		<!-- 搜索内容 -->
		<view :hidden="searchIndex==0" v-for="(item,index) in searchData" :key="index">
			<view class="Tk_scrollview" @click="godetail(item.fy_Id)">
				<view class="Tk_item">
					<image class="Tk_image" :src="item.fy_imageUrl" mode="aspectFill" />
					<view class="Tk_bacg">
						<text class="Tk_text1">{{item.fy_title}}</text>
						<view class="Tk_text3" >
							<rich-text :nodes="item.fy_synopsis"></rich-text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- tabs点击切换栏 -->
		<view class="tabsBox">
			<QSTabs :current="current" :tabs="tabs" minWidth="80" @change="change($event)" />
		</view>

		<view :hidden="current==1">
			<!-- 注视区 -->
			<view class="fa_MainView">
				<view class="fa_TitleView">
					<text class="fa_DiscoveryTitle">{{screenDate}}</text>
				</view>
			</view>
			<swiper style="height: 560upx; padding: 0 8rpx;" circular="circular" autoplay="autoplay">
				<swiper-item style="display: flex;" v-for="(item,index) in itText" :key="index" @click="natTo(item.fy_Id)">
					<view class="fa_listBarView"  >
						<image class="fa_listBarImage" mode="aspectFill" :src="item.fy_imageUrl"></image>
						<text class="fa_listBarText1">{{item.fy_title}}</text>
						<view class="fa_listBarText2" >
							<rich-text :nodes="item.fy_synopsis"></rich-text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			
			

			<!-- 历史文化 -->
			<view class="newDiscoveryView">
				<view class="newDiscoveryTitleView">
					<text class="newDiscoveryTitle">历史文化</text>
				</view>
				<view class="newDiscoveryConentView" v-for="(item,index) in newDiscovery" :key="index" v-if="index < fy_dataIndex" @click="natTo(item.fy_Id)">
					<image class="newDiscoveryConentImage" mode="aspectFill" :src="item.fy_imageUrl"></image>
					<text class="newDiscoveryConentText1">{{item.fy_title}}</text>
					<!-- <text class="newDiscoveryConentText2">销售量：{{item.salesVolume}}</text> -->
					<view class="newDiscoveryConentText2" >
						<rich-text :nodes="item.fy_synopsis"></rich-text>
					</view>
				</view>
			</view>
			
			
		</view>
		
		<view :hidden="current==0">
			<!-- 注视区 -->
			<view class="fa_MainView">
				<view class="fa_TitleView">
					<text class="fa_DiscoveryTitle">{{screenDate}}</text>
				</view>
			</view>
			<swiper style="height: 560upx; padding: 0 8rpx;" circular="circular" autoplay="autoplay">
				<swiper-item style="display: flex;" v-for="(item,index) in itText" :key="index"  @click="natTo(item.fy_Id)">
					<view class="fa_listBarView"  >
						<image class="fa_listBarImage" mode="aspectFill" :src="item.fy_imageUrl"></image>
						<text class="fa_listBarText1">{{item.fy_title}}</text>
						<view class="fa_listBarText2" >
							<rich-text :nodes="item.fy_synopsis"></rich-text>
							<scroll-view></scroll-view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			
			
			
			<!-- 历史文化 -->
			<view class="newDiscoveryView">
				<view class="newDiscoveryTitleView">
					<text class="newDiscoveryTitle">历史文化</text>
				</view>
				<view class="newDiscoveryConentView" v-for="(item,index) in newDiscovery2" :key="index" v-if="index < fy_dataIndex" @click="natTo(item.fy_Id)">
					<image class="newDiscoveryConentImage" mode="aspectFill" :src="item.fy_imageUrl"></image>
					<text class="newDiscoveryConentText1">{{item.fy_title}}</text>
					<!-- <text class="newDiscoveryConentText2">销售量：{{item.salesVolume}}</text> -->
					<!-- <text class="newDiscoveryConentText2">{{item.fy_synopsis}}</text> -->
					<view class="fa_listBarText2" >
						<rich-text :nodes="item.fy_synopsis"></rich-text>
					</view>
				</view>
			</view>

		</view>
		
		<view style="width: 100%; float: left; text-align: center; font-size: 24upx; margin: 16upx 0; color: #aaa;">
			<text v-if="current==0" :hidden="disStatus== 1">{{loadingType== 0 ? loadingText.down : (loadingType === 1 ? loadingText.refresh : loadingText.nomore)}}</text>
			<text v-if="current==1" :hidden="disStatus2== 1">{{loadingType== 0 ? loadingText.down : (loadingType === 1 ? loadingText.refresh : loadingText.nomore)}}</text>
			<text v-if="current==0" :hidden="disStatus== 0">暂无历史数据</text>
			<text v-if="current==1" :hidden="disStatus2== 0">暂无历史数据</text>
		</view>


		<!-- 分类面板 -->
		<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask('none')"> 
			<view class="cate-content">
				<scroll-view scroll-y class="cate-list">
					<view v-for="(item,index) in regionList" :key="index">
						<view class="cate-item b-b" :class="{active: index==screenIndex}" @click="changeCate(item,index)">
							{{item}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>



	</view>
</template>

<script>
	import citySelect from '@/components/HOME/uni-location/linzq-citySelect/linzq-citySelect.vue'
	import popupLayer from '@/components/HOME/uni-location/popup-layer/popup-layer.vue'
	import QSTabs from '@/components/LYFW/ouristRoute/QS-tabs/QS-tabs.vue'
	export default {
		data() {
			return {
				searchIndex: 0, //搜索框是否启用状态值
				searchValue: '', //搜索框值
				searchData: '', //搜索后的值
				regionWeixin: '请选择', //微信地区数值
				regionApp: '请选择', //APP地区数值

				current: 0, //标题下标
				currentBuffer : 0,//标题缓冲下标
				cateMaskState: 0, //分类面板展开状态
				screenIndex : 8,//点击默认值
				screenDate: '定位中',//地区默认值
				tabs: ['非遗','物质', '全部'], //选项标题
				
				fy_dataIndex: 4, //列表默认数量
				loadingType: 0, //加载更多状态
				loadingText: {
					down: '上拉加载更多',
					refresh: '正在加载...',
					nomore: '没有更多了',
				},
				
				

				itText: '', //非遗六宫格
				itText2: '', //物质六宫格
				newDiscovery: '', //非遗文化
				newDiscovery2: '', //物质文化
				disStatus:0,//非遗内容状态值，当为1的时候为空
				disStatus2:0,//物质内容状态值，当为1的时候为空
				
				
				ifyFirst: {
					imageUrl: ['']
				}, //分类产品首个
				ifyList: '', //分类产品列表
				
				regionList : ['市本级','光泽县','建瓯市','建阳区','浦城县','邵武市','松溪县','武夷山市','延平区','政和县'], //地区

				scrollHeight: '500px',
			}
		},
		components: {
			citySelect,
			popupLayer,
			QSTabs
		},
		onLoad: function() {
			uni.showLoading({
				title: '加载文化中...',
				icon: 'loading'
			})
			this.screenDate = this.regionList[this.screenIndex];
			this.Getpostion();
		},
		onPullDownRefresh: function() {
			this.textData();
		},
		
		//页面触底
		onReachBottom() {
			uni.showLoading({
				title: '加载更多中...',
				icon: 'loading'
			})
			this.getMore();
		},

		methods: {
			//请求列表接口数据
			textData: function() {
				//请求列表
				uni.request({
					url:'http://218.67.107.93:9210/api/app/getFyCultureList?regionWeixin='+this.regionList[this.screenIndex],
					method:'POST',
					success: (res) => {
						console.log(res)
						if (res.data.msg == '非遗文化列表信息成功！') {
							let feiyi = res.data.data.filter(item => {
								return item.type == '非遗';
							})
							let wuzhi = res.data.data.filter(item => {
								return item.type == '物质';
							})
							this.itText = feiyi; //非遗数组
							this.itText2 = wuzhi; //物质数组
							uni.hideLoading()
							uni.stopPullDownRefresh()
						} else {
							uni.hideLoading()
							uni.stopPullDownRefresh()
							this.itText = '';
							this.itText2 = '';
							uni.showToast({
								title: '该地区暂未录入历史文化',
								icon: 'none'
							})

						}

					},
					fail: function() {
						uni.hideLoading()
						uni.stopPullDownRefresh()
						uni.showToast({
							title: '网络异常，请检查网络后尝试',
							icon: 'none'
						})

					}
				})

				//文化接口
				uni.request({
					url:'http://218.67.107.93:9210/api/app/getFyCultureList?regionWeixin='+this.regionList[this.screenIndex],
					method:'POST',
					success: (res) => {
						console.log(res)
						if (res.data.msg == '非遗文化列表信息成功！') {
							var sc = res.data.data;;
							sc.sort((a, b) => a.id - b.id)
							let feiyi2 = sc.filter(item => {
								return item.type == '非遗';
							})
							let wuzhi2 = sc.filter(item => {
								return item.type == '物质';
							})
							if(feiyi2==''){
								this.disStatus = 1;
							}else{
								this.newDiscovery = feiyi2; //非遗数组
								this.disStatus = 0;
							}
							if(wuzhi2==''){
								this.disStatus2 = 1;
							}else{
								this.newDiscovery2 = wuzhi2; //物质数组
								this.disStatus2 = 0;
							}
							uni.hideLoading()
							uni.stopPullDownRefresh()
						} else {
							uni.hideLoading()
							uni.stopPullDownRefresh()
							this.newDiscovery = '';
							this.newDiscovery2 = '';
							uni.showToast({
								title: '该地区暂未录入历史文化',
								icon: 'none'
							})
						}

					},
					fail: function() {
						uni.hideLoading()
						uni.stopPullDownRefresh()
						uni.showToast({
							title: '网络异常，请检查网络后尝试',
							icon: 'none'
						})

					}
				})
			},



			//获取定位数据
			Getpostion: function() {
				setTimeout(() => {
					uni.getStorage({
							key: 'wx_position',
							success: (res) => {
								// console.log(res)
								this.regionWeixin = res.data;
							},
							fail: function() {
								uni.showToast({
									title: '定位失败',
									icon: 'none'
								})
							},
							complete: () => {
								this.textData(); //请求接口数据
							}
						}),

						uni.getStorage({
							key: 'app_position',
							success: (res) => {
								// console.log(res)
								if (res.data !== undefined) {
									this.regionApp = res.data.city;
								}
							},
							fail: function() {
								uni.showToast({
									title: '定位失败',
									icon: 'none'
								})
							}
						})
				}, 500)

			},

			//打开地区选择器
			oncity() {
				this.$refs.popupRef.show();
			},

			//地区获取
			backCity(e) {
				if (e !== 'no' && e !== 'yes') {
					// console.log(e)
					this.regionWeixin = e.cityName
					this.regionApp = e.cityName
					this.$refs.popupRef.close();
					this.textData();
					this.searchIndex = 0;
				} else if (e == 'yes') {
					uni.getStorage({
							key: 'wx_position',
							success: (res) => {
								// console.log(res)
								this.regionWeixin = res.data;
								this.textData();
							}
						}),

						uni.getStorage({
							key: 'app_position',
							success: (res) => {
								// console.log(res)
								if (res.data !== undefined) {
									this.regionApp = res.data.city;
								}
							}
						})


					this.$refs.popupRef.close();
				} else {
					this.$refs.popupRef.close();
				}
			},

			//搜索框-搜索
			searchNow: function() {
				console.log(this.regionList[this.screenIndex])
				console.log(this.searchValue)
				if (this.searchValue == '') {
					uni.showToast({
						title: '未输入搜索关键字',
						icon: 'none',
						duration: 1000
					});
					// retuan false;
				}
				//搜索请求
				uni.hideKeyboard()
				uni.showLoading({
					title: '正在搜索',
				})
				uni.request({
					url:'http://218.67.107.93:9210/api/app/searchFyCultureList?regionWeixin=' +this.regionList[this.screenIndex] +'&title=' +this.searchValue,
					method: 'POST',	
					success: (res) => {
						console.log(res)
						if (res.data.data) {
							this.searchData = res.data.data;
							this.searchValue = ''
							this.searchIndex = 1;
							uni.hideLoading()
						} else if (res.data.status == false) {
							uni.hideLoading()
							uni.showToast({
								title: '查不到相关景区或无相关景区!',
								icon: 'none',
							});
							this.searchValue = ''
						}else if(res.statusCode == 404){
							uni.hideLoading()
							uni.showToast({
								title: '服务器请求失败，请联系客服',
								icon: 'none',
							});
							this.searchValue = ''
						}
					}
				})
			},

			//tabbar筛选点击
			change:function(index) {
				if(index == 0){
					this.current = index;
					this.fy_dataIndex=4;  
				}else if(index == 1){
					this.current = index;
					this.fy_dataIndex=4;
				}else{
					this.currentBuffer = this.current;
					this.current = index;
					this.toggleCateMask('show')
				}
				
			},
			
			//显示分类面板
			toggleCateMask:function(type) {
				if(type=='show'){
					let timer = type === 'show' ? 10 : 300;
					let state = type === 'show' ? 1 : 0;
					this.cateMaskState = 1;
					setTimeout(() => {
						this.cateMaskState = state;
					}, timer)
				}else{
					let timer = type === 'show' ? 10 : 300;
					let state = type === 'show' ? 1 : 0;
					this.cateMaskState = 1;
					this.current = this.currentBuffer;
					setTimeout(() => {
						this.cateMaskState = state;
					}, timer)
				}
				
			},
			
			//分类点击
			changeCate: function(item,index) {
				this.screenIndex = index;
				this.screenDate = item;
				this.toggleCateMask('none');
				this.current = this.currentBuffer;
				this.fy_dataIndex=4;
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				uni.showLoading({
					title: '正在搜索',
				})
				this.textData()
			},

			//跳转
			natTo: function(e) {
				console.log(e)
				uni.navigateTo({
					url:'fy_touristroute?fy_Id=' +e
				})
			},

			
			//页面触底加载信息
			getMore(){
				this.loadingType = 1;
				if(this.current == 0){
					if (this.fy_dataIndex < this.newDiscovery.length) {
						var a = this.fy_dataIndex + 4;
						this.fy_dataIndex = a;
						this.loadingType = 0;
						uni.hideLoading()
					}else if (this.fy_dataIndex >= this.newDiscovery.length) {
						this.loadingType = 2;
						uni.hideLoading()
					}
				}else if(this.current == 1){
					if (this.fy_dataIndex < this.newDiscovery.length) {
						var a = this.fy_dataIndex + 4;
						this.fy_dataIndex = a;
						this.loadingType = 0;
						uni.hideLoading()
					}else if (this.fy_dataIndex >= this.newDiscovery.length) {
						this.loadingType = 2;
						uni.hideLoading()
					}
				}
				
			},
		}
	}
</script>

<style lang="scss">
	//搜索框
	.searchTopBox {
		display: flex;
		text-overflow: ellipsis; //文本溢出：省略号
		margin: 32upx 32upx;

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
			/* #ifdef H5 */
			width: 100%;
			/* #endif */
			/* #ifndef H5 */
			width: 76%;
			/* #endif */

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
				width: 460upx;
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
				margin-top: 8upx;  
				overflow: hidden; 
				text-overflow: ellipsis; 
				white-space: nowrap; 
				width: 216upx;
			}

			.Tk_text3 {
				font-size: 24upx;
				margin-top: 24upx;
				// text-align: left;	
				color: #AAAAAA;
				display: block; // 让字体换行
			}
		}
	}

	//tabs点击
	.tabsBox {
		// z-index: 998; //最外层
		position: sticky;
		background: #fff;
	}
	
	//注视区
	.fa_MainView {
		padding: 32upx 8upx;
		// height: 880upx;
	
		.fa_TitleView {
			margin: 0upx 0upx 0upx 24upx;
	
			.fa_DiscoveryTitle {
				font-weight: bold;
				font-size: 34upx;
			}
		}
	}
	
	.fa_listBarView {
		margin-left: 24upx;
		margin-bottom: 32upx;
		
		.fa_listBarImage {
			width: 680upx;
			height: 424upx;
			border-radius: 12upx;
		}
		
		.fa_listBarText1 {
			display: block;
			margin-top: 12upx;
			font-size: 32upx;
			overflow: hidden;
			white-space: nowrap; 
			text-overflow: ellipsis;
			width: 480upx;
		}
		
		.fa_listBarText2 {
			display: block;
			font-size: 28upx;
			color: #999;
			margin-top: 8upx;  
			overflow: hidden; 
			text-overflow: ellipsis; 
			white-space: nowrap; 
			width: 480upx;
		}
		
	}
	
	//列表栏
	.listBarViewSpace {
		padding: 32upx 8upx;
		// height: 880upx;

		.newDiscoveryTitleView {
			margin: 0upx 0upx 32upx 24upx;

			.newDiscoveryTitle { 
				font-weight: bold;
				font-size: 34upx;
			}
		}

		.listBarView {
			margin-left: 24upx;
			margin-bottom: 32upx;
			
			.listBarImage {
				width: 240upx;
				height: 240upx;
				border-radius: 12upx;
			}

			.listBarText1 {
				display: block;
				margin-top: 12upx;
				font-size: 30upx;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 216upx;
			}

			.listBarText2 {
				display: block;
				font-size: 26upx;
				color: #999;
				margin-top: 8upx;  
				overflow: hidden; 
				text-overflow: ellipsis; 
				white-space: nowrap; 
				width: 216upx;
			}

		}
	}

	//新发现
	.newDiscoveryView {
		padding: 8upx;

		.newDiscoveryTitleView {
			margin: 0upx 0upx 32upx 24upx;

			.newDiscoveryTitle {
				font-weight: bold;
				font-size: 34upx;
			}
		}

		.newDiscoveryConentView {
			margin-left: 24upx;
			margin-bottom: 32upx;
			float: left;

			.newDiscoveryConentImage {
				width: 332upx;
				height: 254upx;
				border-radius: 12upx;
			}

			.newDiscoveryConentText1 {
				display: block;
				margin-top: 12upx;
				font-size: 30upx;
				overflow: hidden;
				white-space: nowrap;
				// text-overflow: ellipsis;
				width: 332upx;
			}

			.newDiscoveryConentText2 {
				display: block;
				font-size: 26upx;
				color: #999;
				margin-top: 8upx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 332upx;
			}
		}
	}

	//联动列表
	.list_box {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		font-size: 28rpx;
		margin-top: 32upx;

		//左边
		.left {
			width: 200rpx;
			line-height: 80rpx;
			// box-sizing: border-box;
			font-size: 32rpx;
			border: 1upx #F5F5F5 double;

			.item {
				display: flex;
				position: relative;

				.itemView {
					width: 8upx;
					height: 56upx;
					margin-top: 16upx;
				}

				.itemText {
					padding-left: 40rpx;
				}

				&:not(:first-child) {
					margin-top: 4px;

					&::after {
						content: '';
						display: block;
						height: 0;
						border-top: #ddd solid 1px;
						width: 620upx;
						position: absolute;
						top: -1px;
						right: 0;
						transform: scaleY(0.5);
						/* 1px像素 */
					}
				}

				&.active,
				&:active {
					color: #4EB3F7;
				}
			}
		}

		//右边
		.main {
			width: 556upx;
			border: 1upx #F5F5F5 double;
			flex-grow: 1;
			box-sizing: border-box;

			.mainScView {
				padding: 20upx 0 32upx 0;

				.big_image {
					margin: 12upx 32upx;
					width: 492upx;
					height: 240upx;
					border-radius: 8upx;
				}

				.big_title {
					font-weight: 500;
				}

				.big_text {
					font-size: 26upx;
					color: #888;
					display: block;
					margin-top: 16upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 490upx;
				}

				.sma_view {
					padding: 8upx 20upx;

					.sma_image {
						margin: 24upx 12upx 12upx 12upx;
						width: 232upx;
						height: 190upx;
						border-radius: 8upx;
					}

					.sma_title {
						margin-left: 12upx;
						font-weight: 500;
						display: block;
					}

					.sma_text {
						margin-left: 12upx;
						margin-top: 16upx;
						font-size: 26upx;
						color: #888;
						display: block;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						width: 234upx;
					}
				}
			}
		}
	}
	
	/* 分类 */
	.cate-mask {
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
	
	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;
	
		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}
	
		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}
	
		.active {
			color: #06B4FD;
		}
	}
</style>
