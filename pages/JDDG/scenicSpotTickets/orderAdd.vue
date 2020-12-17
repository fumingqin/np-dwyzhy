<template>
	<view>

		<!-- 顶部背景 -->
		<view class="ob_background">
			<image src="../../../static/LYFW/scenicSpotTickets/addOrder/orderBackground.png" mode="aspectFill"></image>
		</view>

		<!-- 门票信息/数量 -->
		<!-- 命名：MP -->
		<view class="cover-container">
			<view class="MP_information1">
				<view class="MP_title">{{name}}</view>
				<view class="MP_text">{{productName}}</view>
				<!-- <text class="MP_text" @click="open2(1)">{{admissionTicket.ticketComment_s1}}&nbsp;|&nbsp;{{admissionTicket.ticketComment_s2}}&nbsp;|&nbsp;{{admissionTicket.ticketComment_s3}}&nbsp; > </text> -->

				<!-- 预约时间代码开始 -->
				<view class="MP_selectionDate">
					<text>预约入住时间:</text>
					<text class="MP_textDate" style="font-size: 30upx;">{{startTime}}-{{endTime}} </text>
				</view>
				<!-- 预约时间代码结束 -->
				<navigator url="../time/day" class="text-area">
					<button @click="set" type="primary">请选择入住时间</button>
				</navigator>

			</view>

			<!-- 购票人信息 -->
			<view class="MP_information2">
				<text class="MP_title">购票人信息</text>
				<text class="MP_text" style="color: #aaa;">请选择预订人，票价会根据人数自动变更</text>

				<view class="MP_userInformation" v-for="(item,index) in addressData" :key="index">
					<text>{{item.userName}}</text>
					<text class="Mp_sex">{{item.userSex}}</text>
					<text class="Mp_square">{{item.userType}}</text>
					<text class="Mp_square" v-if="item.userDefault == true">本人</text>
					<text class="Mp_square" v-if="item.userEmergencyContact == true">紧急联系人</text>
					<text class="Mp_delete  jdticon icon-fork" @click="deleteUser(index)"></text>
					<text class="Mp_text">身份证：{{item.userCodeNum}}</text>
					<text class="Mp_text">手机号：{{item.userPhoneNum}}</text>
				</view>

				<view class="MP_userInformation">
					<button class="Mp_addTo" type="default" plain="true" @click="choiceUser(0)">添加</button>
					<button class="Mp_Selection" type="primary" plain="true" @click="choiceUser(1)">选择</button>
				</view>

			</view>

			<!-- 优惠券 -->
			<!-- <view class="MP_information2" @click="toggleMask('show')">
				<view class="MP_optionBar">
					<text class="Mp_title">优惠券</text>
					<text class="Mp_arrow"> > </text>
					<text class="Mp_text">{{couponIndex}}</text>
				</view>
			</view> -->

			<!-- 呼出优惠券面板 -->
			<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
				<view class="mask-content" @click.stop.prevent="stopPrevent">
					<!-- 优惠券页面，仿mt -->
					<view class="couponTitle">
						<text class="Co_text1">优惠券</text>
						<text class="Co_text2" @click="couponReset">不使用优惠券</text>
					</view>

					<view class="coupon-item" v-for="(item,index) in couponList" :key="index" @click="couponEvent(index)">
						<view class="con">
							<view class="left">
								<text class="title">{{item.title}}</text>
								<text class="time">有效期至2019-06-30</text>
							</view>

							<view class="right">
								<text class="price">{{item.price}}</text>
								<text>满{{couponList[index].condition}}可用</text>
							</view>

							<view class="circle l"></view>
							<view class="circle r"></view>
						</view>
						<text class="tips">限新用户使用</text>
					</view>
				</view>
			</view>
			<view class="MP_information2" style="display: flex;">
				<view>数量</view>
				<view style="display: flex;align-items: center;">
					<view style="border:solid 1px #999999;width: 36rpx;height: 36rpx;border-radius: 100px;color: #999999;line-height: 30rpx;text-align: center;margin-left: 400rpx;"
					 @click="changeNum(false)">
						—
					</view>
					<view>
						<input style="width: 60rpx;text-align: center;" v-model="num" type="number" @change="checknum" />
					</view>
					<view style="border:solid 1px #999999;width: 36rpx;height: 36rpx;border-radius: 100px;color: #999999;line-height: 30rpx;text-align: center;"
					 @click="changeNum(true)">
						+
					</view>
				</view>
			</view>
			<view class="MP_information2">
				<view class="MP_optionBar">
					<text class="Mp_title">同意游客须知</text>
					<text class="Mp_textBlue" @click="open2(2)">(点击查看须知)</text>
					<radio class="Mp_box" value="1" :color="'#01aaef'" :checked="selectedValue===1 ? true : false" @click="Selection"></radio>
				</view>

				<!-- 嵌套弹框组件popup -->
				<uni-popup ref="popup2" type="bottom">
					<view class="boxVlew">
						<view class="titleView">
							<text class="Nb_text1">游客须知</text>
							<text class="Nb_text2 jdticon icon-fork " @click="close(2)"></text>
						</view>
						<scroll-view class="noticeBox" scroll-y="ture">
							<text class="Nb_text4">
								{{notice.security}}
							</text>
						</scroll-view>
					</view>
				</uni-popup>
			</view>

			<!-- 底部 -->
			<view class="footer">
				<view class="price-content">
					<text>实付款</text>
					<text class="price-tip">￥</text>
					<text class="price">{{actualPayment}}</text>
					<text class="people">共{{addressData.length}}人</text>
				</view>

				<view class="submitChange" enabl :class="{submitColor: selectedValue===1 && addressData.length>0}" @click="submitState">
					<text class="submit">立即预订</text>
				</view>
			</view>

		</view>
		<uni-calendar ref="calendar" :insert="false" :lunar="true" @confirm="confirm"></uni-calendar>
	</view>
</template>

<script>
	import uniPopup from "../../../components/LYFW/scenicSpotTickets/uni-popup/uni-popup.vue"
	import uniCalendar from '../../../components/LYFW/scenicSpotTickets/uni-calendar/uni-calendar.vue'
	export default {
		data() {
			return {
				submissionState: false, //提交状态
				actualPayment: '', //实际付款
				selectedValue: 0, //同意须知的选中值
				dateReminder: '今天', //日期提醒
				date: '', //默认时间
				maskState: 0, //优惠券面板显示状态

				admissionTicket: '', //门票内容
				userInfo: '', //个人信息

				couponIndex: '请选择优惠券', //优惠券默认内容
				couponColor: '', //优惠券couponID
				couponCondition: '', //优惠券的满足条件值

				notice: '', // 预订须知

				addressData: '', //购票人信息
				adultIndex: '', //成人数量
				childrenIndex: '', //儿童数量

				couponList: [],
				//---------------预约时段专用参数---------------------
				ape_entry: '', //预约入口参数
				ape_time: '', //预约时段
				AID: '', //预约下单用的AID，必传
				name: '',
				productName: '',
				price: '',
				startTime: '',
				endTime: '',
				day: '',
				num: 1,
				productId: '',
				//---------------预约时段专用参数---------------------
			}
		},

		onLoad: function(options) {
			var that = this;
			that.name = options.name;
			that.productName = options.productName;
			that.price = options.price;
			that.productId = options.productId;
			console.log(options.ape_entry)
			//预约时间代码开始
			if (options.ape_entry == 1) {
				this.ape_entry = options.ape_entry;
				this.date = options.ape_date;
				this.dateReminder = options.ape_week;
				this.ape_time = options.ape_time;
				this.AID = options.AID;
				this.lyfwData();
			} else {
				this.ape_entry = 0;
				this.getDate();
				this.lyfwData();
			}
			//预约时间代码结束
		},
		onShow() {
			var that = this;
			uni.getStorage({
				key: 'Time',
				success(res) {
					that.startTime = JSON.parse(res.data).start;
					that.endTime = JSON.parse(res.data).end;
					that.day = JSON.parse(res.data).day;
					that.numberChange();
				},
			})
			that.getUserInfo();
			that.userData();

		},
		components: {
			//加载多方弹框组件
			uniPopup,
			//加载日期组件 
			uniCalendar,
		},
		methods: {
			set() {

				uni.removeStorage({
					key: 'Price',
					success: () => {
						// this.price = null
					}
				})
			},
			//获取用户信息
			getUserInfo: function() {
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						console.log(res)
						if (res.data == undefined) {
							// #ifdef APP-PLUS
							uni.showToast({
								title: '检测到未登录，即将跳转登录页面',
								icon: 'none',
								success: function() {
									uni.navigateTo({
										url: '../../GRZX/userLogin?loginType=4'
									})
								}
							})
							// #endif
							// #ifdef H5
							uni.showToast({
								title: '检测到未登录，即将跳转授权主页',
								icon: 'none',
								success: function() {
									uni.switchTab({
										url: '../../Home/indexZhly'
									})
								}
							})
							// #endif
						} else {
							this.userInfo = res.data;
						}

					},

				})
			},

			//读取静态数据
			async lyfwData() {
				uni.getStorage({
					key: 'ticketInformation',
					success: (res) => {
						this.admissionTicket = res.data;
						// console.log(res)
					}
				})

				let notice = await this.$api.lyfwfmq('notice');
				this.notice = notice.data;
			},

			//删除出行人
			deleteUser: function(e) {
				var a = this.addressData;
				if (e < 0) {
					return false;
				} else {
					var b = a.slice(0, e).concat(a.slice(e + 1, a.length));
					this.addressData = b;
					uni.setStorage({
						key: "passengerList",
						data: b
					})
					this.screenUser();
				}
			},

			//选择用户
			choiceUser: function(e) {
				if (e == 0) {
					uni.getStorage({
						key: 'userInfo',
						success: function(res) {
							uni.navigateTo({
								url: '../../GRZX/addPassenger?type=add',
							})
						},
						fail: function() {
							uni.showToast({
								icon: 'none',
								title: '未登录无法添加乘车人,请先登录'
							})
							setTimeout(function() {
								uni.navigateTo({
									//loginType=1,泉运登录界面
									//loginType=2,今点通登录界面
									//loginType=3,武夷股份登录界面
									url: '../../GRZX/userLogin?loginType=4'
								})
							}, 500);
						}
					})
				} else if (e == 1) {
					uni.getStorage({
						key: 'userInfo',
						success: function(res) {
							uni.navigateTo({
								url: '../../GRZX/passengerInfo?submitType=1',
							})
						},
						fail: function(err) {
							uni.showToast({
								icon: 'none',
								title: '未登录无法选择乘车人,请先登录'
							})
							setTimeout(function() {
								uni.navigateTo({
									//loginType=1,泉运登录界面
									//loginType=2,今点通登录界面
									//loginType=3,武夷股份登录界面
									url: '../../GRZX/userLogin?loginType=4'
								})
							}, 500);
						}
					})
				}
			},

			//用户数据读取
			userData() {
				uni.getStorage({
					key: 'passengerList',
					success: (res) => {
						this.addressData = res.data;
						this.screenUser();
					}
				});
			},

			//数组提取
			screenUser: function() {
				let adult = this.addressData.filter(item => {
					return item.userType == '成人' || item.userType == '军人' || item.userType == '教师' || item.userType == '学生';
				})
				let children = this.addressData.filter(item => {
					return item.userType == '儿童';
				})
				this.adultIndex = adult.length;
				this.childrenIndex = children.length;
				this.numberChange();
			},

			//仿穿透事件
			stopPrevent() {},

			// 数量+计价
			numberChange() {
				var that = this;
				that.changeNum();
				console.log(that.price, that.day, that.num, '数量计价');
			},

			//提交按钮状态赋值
			submitState: function() {
				//这边还得加上是否选择人数和勾选同意的判断
				if (this.selectedValue == 1 && this.addressData.length > 0) {

					if (this.submissionState == false) {
						this.submissionState = true;
						this.submit();
					} else if (this.submissionState == true) {
						uni.showToast({
							title: '请勿重复点击提交',
							icon: 'none',
							duration: 2000
						})
					}

				} else if (this.addressData.length == 0) {
					uni.showToast({
						title: '请添加购票人信息',
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: '请同意购买须知',
						icon: 'none'
					})
				}
			},

			//预约酒店订单
			submit: function() {
				var that = this;
				uni.showLoading({
					title: '提交订单中...'
				})
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/addHotelOrder',
					data: {
						touristId: that.userInfo.unid,
						productId: that.productId, //产品id
						amount: that.num, //数量
						time: that.startTime + ',' + that.endTime, //入住时间
						checkinMan: that.addressData[0].userName, //入住人
						tel: that.addressData[0].userPhoneNum, //电话号码
						idNo: that.addressData[0].userCodeNum, //身份证
						orderPrice: that.price, //订单价格
						remark: '',
					},
					method: 'POST',
					success: (res) => {
						uni.hideLoading()
						console.log(res)
						if (res.data.msg == '下单成功') {
							that.showToast('预约酒店成功,请打电话与酒店联系核实！');
							setTimeout(function() {
								uni.navigateTo({
									url: './successfulPayment'
								})
							}, 1500)
						} else {
							that.showToast('预约失败');
						}
					},
					fail: function(res) {
						console.log(res);
						that.showToast('预约失败');
					}
				})


			},
			showToast: function(title, icon = 'none') {
				uni.showToast({
					title: title,
					icon: icon
				});
			},

			//打开选择器
			open() {
				this.$refs.calendar.open();
			},

			//打开popup下弹框
			open2(e) {
				if (e == 1) {
					this.$refs.popup1.open()
				} else {
					this.$refs.popup2.open()
				}
			},

			close(e) {
				if (e == 1) {
					this.$refs.popup1.close()
				} else {
					this.$refs.popup2.close()
				}
			},



			//获取当前时间并格式化
			getDate: function() {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				// if (type === 'start') {
				// 	year = year - 60;
				// } else if (type === 'end') {
				// 	year = year + 2;
				// }
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				this.date = `${year}-${month}-${day}`;
			},


			//时间选择器，确认选择
			confirm(e) {
				this.getTime(e);
			},

			//时间效验，已提示
			getTime: function(e) {
				let date = new Date(),
					day = date.getDate(),
					second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				var index = e.date - day;
				// console.log(e)
				if (index < 0) {
					uni.showToast({
						title: '请勿选择以往日期',
						icon: 'none'
					})
				} else if (index == 0) {
					this.dateReminder = '今天'
					this.date = e.fulldate;
				} else if (index == 1) {
					this.dateReminder = '明天'
					this.date = e.fulldate;
				} else if (index == 2) {
					this.dateReminder = '后天'
					this.date = e.fulldate;
				} else {
					this.dateReminder = e.lunar.ncWeek;
					this.date = e.fulldate;
				}
			},

			//同意购买-点击事件
			Selection: function() {
				if (this.selectedValue == 0) {
					this.selectedValue = 1;
				} else {
					this.selectedValue = 0;
				}
			},
			checknum: function(e) {
				console.log(e);
				var a = e.detail.value;
				console.log(a);
				if (this.num < 1 || this.num == '') {
					uni.showToast({
						title: "票数不能小于1",
						icon: "none"
					})
					this.num = 1;
				} else if (this.num > 60) {
					uni.showToast({
						title: "票数不能大于60",
						icon: "none"
					})
					this.num = 1;
				} else {
					this.num = a;
				}

			},
			changeNum: function(type) {
				var that = this;
				if (type) {
					if (that.num == 60) {
						uni.showToast({
							title: "票数不能大于60",
							icon: "none"
						})
					} else {
						that.num++;
						console.log(that.num);
					}
				} else {
					if (that.num == 1) {
						uni.showToast({
							title: "票数不能小于1",
							icon: "none"
						})
					} else {
						that.num--;
						console.log(that.num);
					}
				}
				if (that.day == '') {
					that.actualPayment = that.price;
				} else {
					that.actualPayment = that.price * that.day * that.num;
				}
			},

		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F5F5;
		padding-bottom: 100upx;
	}

	//背景图样式
	.ob_background {
		position: absolute;
		width: 100%;
		height: 320upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	//整体容器样式
	.cover-container {
		position: relative;
		top: 148upx;
		padding: 32upx 30upx;
		padding-bottom: 180upx;
	}

	/* #ifdef MP-WEIXIN */
	//整体容器样式 -微信版
	.cover-container {
		top: 64upx;
	}

	/* #endif */


	//公共样式 - 适用多个数据框
	.MP_information1 {
		border-radius: 16upx;
		background: #FFFFFF;
		padding: 24upx 32upx;
		font-size: 32upx;
		box-shadow: 0px 0.2px 0px #aaa;

		.MP_title {
			font-size: 34upx;
			display: flex;
			font-weight: bold;
			margin-top: 20upx;
		}

		.MP_text {
			color: #3EABFC;
			font-size: 28upx;
			margin-top: 20upx;
			display: block; // 让字体换行
		}
	}

	//公共样式2 - 适用单选框
	.MP_information2 {
		border-radius: 16upx;
		background: #FFFFFF;
		padding: 36upx 32upx;
		font-size: 32upx;
		box-shadow: 0px 0.2px 0px #aaa;
		margin-top: 24upx;

		.kj {
			font-size: 34upx;
			display: flex;
			font-weight: bold;
			margin-top: 8upx;
		}

		.MP_text {
			font-size: 26upx;
			margin-top: 20upx;
			display: block; // 让字体换行
		}
	}


	//须知弹框
	.boxVlew {
		width: 90%;
		padding: 16upx 40upx;
		padding-bottom: 92upx;
		background: #FFFFFF;

		.titleView {
			margin: 24upx 0;

			//弹框标题
			.Nb_text1 {
				position: relative;
				font-size: 38upx;
				font-weight: bold;
				top: 8upx;
				margin-bottom: 16upx;
			}

			//弹框关闭按钮
			.Nb_text2 {
				margin-top: 8upx;
				float: right;
				color: #333;
				font-size: 32upx;
			}
		}

		.noticeBox {
			height: 800upx;
			line-height: 32upx;

			.Nb_text3 {
				display: block;
				margin-top: 32upx;
				font-size: 34upx;
				font-weight: bold;
			}

			.Nb_text4 {
				display: block;
				line-height: 64upx;
				margin: 32upx 0;
				font-size: 30upx;
			}
		}
	}


	//使用日期
	.MP_selectionDate {
		width: 100%;
		line-height: 120upx;
		margin-top: 46upx;
		border-top: 1px #F5F5F5 dashed;

		.MP_textDate {
			float: right;
		}

		.MP_textReminder {
			font-size: 26upx;
			color: #aaa;
			float: right;
			margin-right: 24upx;
		}
	}

	// 用户信息
	.MP_userInformation {
		width: 100%;
		margin-top: 32upx;
		border-top: 1px #F5F5F5 dashed;
		padding-top: 32upx;

		.Mp_sex {
			margin-left: 24upx;
		}

		.Mp_text {
			font-size: 28upx;
			display: block;
			color: #888;
			margin-top: 20upx;
		}

		.Mp_square {
			margin-left: 24upx;
			padding: 2upx 20upx;
			background: #3DABFC;
			font-size: 26upx;
			color: #fff;
			text-align: center;
			border-radius: 8upx;
		}

		.Mp_delete {
			float: right;
			color: #f85e52;
			font-size: 34upx;
		}

		.Mp_addTo {
			float: left;
			font-size: 30upx;
			margin-left: 64upx;
			width: 200upx;
		}

		.Mp_Selection {
			font-size: 30upx;
			margin-right: 64upx;
			width: 200upx;
		}
	}

	//选项框样式
	.MP_optionBar {
		.Mp_title {
			font-size: 32upx;
		}

		.Mp_text {
			margin-top: 6upx;
			float: right;
			font-size: 28upx;
			color: #f85e52;
		}

		.Mp_textBlue {
			margin-left: 16upx;
			font-size: 26upx;
			color: #3EABFC;
		}

		.Mp_box {
			float: right;
			position: relative;
			bottom: 6upx;
			right: -12upx;
		}

		.Mp_arrow {
			margin-top: 6upx;
			margin-left: 24upx;
			float: right;
			font-size: 28upx;
			color: #aaa;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}


	/* 优惠券列表 */

	//下弹框标题
	.couponTitle {
		padding: 40upx;
		padding-bottom: 16upx;

		.Co_text1 {
			font-size: 38upx;
			font-weight: bold;
		}

		.Co_text2 {
			margin-top: 8upx;
			float: right;
			color: #f85e52;
			font-size: 28upx;
		}
	}

	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: #f85e52;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: #999999;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #999999;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: #f85e52;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: #999999;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}

	.text-area {
		display: flex;
		justify-content: center;
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

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: #f85e52;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: #f85e52;
		}

		.people {
			font-size: 28upx;
			margin-left: 24upx;
			color: #999999;
		}

		.submitChange {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			background: #aaa;

			.submit {
				color: #fff;
				font-size: 32upx;
			}

			&.submitColor {
				background: #06B4FD;
			}
		}

		.ticket {

			background-color: #FFF;
			border-radius: 20rpx;
			font-size: 32rpx;
			height: 106rpx;
			margin-top: 20rpx;
			color: rgba(51, 51, 51, 1);
			padding: 0 38rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-shadow: 0px 6px 20px 0px rgba(231, 231, 231, 0.53);
		}
	}
</style>
