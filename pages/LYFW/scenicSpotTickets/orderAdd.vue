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
				<view class="MP_title">{{admissionTicket.admissionTicketName}}</view>
				<text class="MP_text" @click="open2(1)">{{admissionTicket.ticketComment_s1}}&nbsp;|&nbsp;{{admissionTicket.ticketComment_s2}}&nbsp;|&nbsp;{{admissionTicket.ticketComment_s3}}&nbsp; > </text>
				<!-- 嵌套弹框组件popup -->
				<uni-popup ref="popup1" type="bottom">
					<view class="boxVlew">
						<view class="titleView">
							<text class="Nb_text1">预订须知</text>
							<text class="Nb_text2 jdticon icon-fork " @click="close(1)"></text>
						</view>
						<scroll-view class="noticeBox" scroll-y="ture">
							<text class="Nb_text3">费用包含</text>
							<text class="Nb_text4">
								{{admissionTicket.ticketContain}}
							</text>
							<text class="Nb_text3">预订说明</text>
							<text class="Nb_text4">{{notice.explain}}</text>
							<text class="Nb_text3">使用方法</text>
							<text class="Nb_text4">{{notice.way}}</text>
							<text class="Nb_text3">使用时间</text>
							<text class="Nb_text4">{{notice.date}}</text>
							<text class="Nb_text3">免票政策</text>
							<text class="Nb_text4">{{notice.policy}}</text>
							<text class="Nb_text3">退改规则</text>
							<text class="Nb_text4">{{notice.rule}}</text>
						</scroll-view>
					</view>
				</uni-popup>

			<!-- 预约时间代码开始 -->
				<view class="MP_selectionDate" :hidden="ape_entry==0">
					<text>预约时间</text>
					<text class="MP_textDate" style="font-size: 30upx;">{{ape_time}}</text>
					<text class="MP_textDate" style="margin-right: 24upx; font-size: 30upx;">{{date}}</text>
					<text class="MP_textReminder">{{dateReminder}}</text>
				</view>
				
				<view class="MP_selectionDate" :hidden="ape_entry==1">
					<text>预约时间</text>
					<text class="MP_textDate" @click="open">{{date}}&nbsp;> </text>
					<text class="MP_textReminder">{{dateReminder}}</text>
				</view>
			<!-- 预约时间代码结束 -->
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
			<view class="MP_information2" @click="toggleMask('show')">
				<view class="MP_optionBar">
					<text class="Mp_title">优惠券</text>
					<text class="Mp_arrow"> > </text>
					<text class="Mp_text">{{couponIndex}}</text>
				</view>
			</view>

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
				date:'', //默认时间
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
				ape_entry: '',//预约入口参数
				ape_time:'',//预约时段
				AID:'',//预约下单用的AID，必传
				//---------------预约时段专用参数---------------------
			}
		},

		onLoad:function(options) {
			console.log(options.ape_entry)
			//预约时间代码开始
			if(options.ape_entry==1){
				this.ape_entry = options.ape_entry;
				this.date = options.ape_date;
				this.dateReminder = options.ape_week;
				this.ape_time = options.ape_time;
				this.AID = options.AID;
				console.log(this.ape_date)
				console.log(this.ape_week)
				console.log(this.ape_time)
				console.log(this.AID)
				this.lyfwData();
			}else{
				this.ape_entry = 0;
				this.getDate();
				this.lyfwData();
			}
			//预约时间代码结束
		},
		onShow() {
			this.getUserInfo();
			this.userData();
		},
		components: {
			//加载多方弹框组件
			uniPopup,
			//加载日期组件 
			uniCalendar,
		},
		methods: {
			//获取用户信息
			getUserInfo:function(){
				uni.getStorage({
					key:'userInfo',
					success:(res)=>{
						console.log(res)
						if(res.data==undefined){
							// #ifdef APP-PLUS
							uni.showToast({
								title:'检测到未登录，即将跳转登录页面',
								icon:'none',
								success:function(){
									uni.navigateTo({
										url:'../../GRZX/userLogin?loginType=4'
									})
								}
							})
							// #endif
							// #ifdef H5
							uni.showToast({
								title:'检测到未登录，即将跳转授权主页',
								icon:'none',
								success:function(){
									uni.switchTab({
										url:'../../Home/indexZhly'
									})
								}
							})
							// #endif
						}else{
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
						success:function(res) {
							uni.navigateTo({
								url: '../../GRZX/addPassenger?type=add',
							})
						},
						fail:function(){
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
						success:function(res) {
							uni.navigateTo({
								url: '../../GRZX/passengerInfo?submitType=1',
							})
						},
						fail:function(err){
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
					return item.userType == '成人' || item.userType == '军人' || item.userType == '教师' || item.userType == '学生' ;
				})
				let children = this.addressData.filter(item => {
					return item.userType == '儿童';
				})
				this.adultIndex = adult.length;
				this.childrenIndex = children.length;
				this.numberChange();
			},

			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},

			//优惠券赋值
			couponEvent: function(index) {
				if (this.actualPayment >= this.couponList[index].condition) {
					this.couponIndex = '-' + this.couponList[index].price;
					this.couponColor = this.couponList[index].couponID;
					this.couponCondition = this.couponList[index].condition;
					this.numberChange();
					this.toggleMask();
				} else {
					uni.showToast({
						title: '您的实付款未达到条件，请重新选择',
						icon: 'none'
					})
				}

			},

			//取消优惠券
			couponReset: function(index) {
				this.couponIndex = '请选择优惠券';
				this.couponColor = '';
				this.numberChange();
				this.toggleMask();
			},

			//仿穿透事件
			stopPrevent() {},

			// 数量+计价
			numberChange() {
				const b = (this.admissionTicket.ticketAdultPrice * this.adultIndex) + (this.admissionTicket.ticketChildPrice * this
					.childrenIndex);
				const a = b.toFixed(2);
				if (this.couponColor == '') {
					this.actualPayment = a;
				} else if (a >= this.couponCondition) {
					var total = a - this.couponList[this.couponColor].price;
					this.actualPayment = total;
				} else if (a < this.couponCondition) {
					uni.showToast({
						title: '您的金额不满足优惠券条件，已取消优惠券',
						icon: 'none',
						duration: 2000
					})
					this.couponIndex = '请选择优惠券';
					this.couponColor = '';
					this.couponCondition = 0;
					this.actualPayment = a;
				}
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
			
			//提交表单
			submit: function() {
				var that = this;
				uni.showLoading({
					title: '提交订单中...'
				})
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/getScenicspotOrderList?unid=' + this.userInfo.unid,
					method: 'POST',
					success: (res) => {
						// console.log(res)
						var a = '';
						if(res.data.msg =='获取订单列表成功！'){
							a = res.data.data.filter(item => {
								return item.orderType == '待支付' || item.orderType == '待确认';
							})
						}
						console.log(a)
						console.log(that.dateReminder)
						console.log(that.date)
						console.log(that.AID)
						console.log(that.ape_time)
						console.log(that.userInfo.phoneNumber)
						if (a == '') {
							// #ifdef H5
							uni.getStorage({
								key:'scenicSpotOpenId',
								success:(res)=>{
									uni.request({
										url: 'http://218.67.107.93:9210/api/app/scenicSpotSetOrder',
										data: {
											unid: that.userInfo.unid,
											ticketProductId: that.admissionTicket.admissionTicketID,
											ticketId: 0,
											ticketContain: that.admissionTicket.ticketContain,
									
											companyId: that.admissionTicket.companyId,
											executeScheduleId: that.admissionTicket.executeScheduleId,
									
											addressData: that.addressData,
											couponID: that.couponColor,
									
											orderDateReminder: that.dateReminder,
											orderDate: that.date,
											orderInsure: '',
											orderInsurePrice: '',
											orderActualPayment: that.actualPayment,
											sellerCompanyCode: '南平旅游H5',
											tppId: res.data,
											appointmentId : that.AID,
											tel:that.userInfo.phoneNumber,
										},
									
										method: 'POST',
										//向服务器发送订单数据，返回订单编号
										success: (res) => {
											uni.hideLoading()
											console.log(res)
											if (res.data.msg == '无可售门票！') {
												uni.showToast({
													title: '该景区无可售门票！',
													icon: 'none',
												})
												that.submissionState = false;
											} else if (res.data.msg == '下单失败，联系管理员！') {
												uni.showToast({
													title: '下单失败，联系管理员！',
													icon: 'none',
												})
												that.submissionState = false;
											} else if (res.data.message == '账号ID不能为空') {
												uni.showToast({
													title: '账号ID不能为空，请重新登录账户',
													icon: 'none',
												})
												that.submissionState = false;
											} else if (res.data.msg == '下单成功') {
												if(that.ape_entry=='1'){
													uni.setStorage({
														key: 'submitH5Data',
														data: res.data.data,
														success: function() {
															uni.redirectTo({
																url:'successfulPayment'
															})
														}
													})
												}else{
													uni.setStorage({
														key: 'submitH5Data',
														data: res.data.data,
														success: function() {
															uni.redirectTo({
																url: '/pages/LYFW/scenicSpotTickets/selectivePayment?orderNumber=' + res.data.data.orderNumber
															})
														}
													})
												}
												
									
											}
									
										}
									})
								},
								fail:function(){
									uni.hideLoading()
									uni.showToast({
										title:'请允许授权给公众号，即将为您返回主页！'
									})
									uni.switchTab({
										url:'../../Home/indexZhly'
									})
									that.submissionState = false;
								}
							})
							
							// #endif

							// #ifdef APP-PLUS
							
							uni.request({
								url: 'http://218.67.107.93:9210/api/app/scenicSpotSetOrder',
								data: {
									unid: this.userInfo.unid,
									ticketProductId: this.admissionTicket.admissionTicketID,
									ticketId: 0,
									ticketContain: this.admissionTicket.ticketContain,

									companyId: this.admissionTicket.companyId,
									executeScheduleId: this.admissionTicket.executeScheduleId,

									addressData: this.addressData,
									couponID: this.couponColor,

									orderDateReminder: this.dateReminder,
									orderDate: this.date,
									orderInsure: '',
									orderInsurePrice: '',
									orderActualPayment: this.actualPayment,
									sellerCompanyCode: '南平旅游APP',
									tppId: 0,
									appointmentId : that.AID,
									tel:that.userInfo.phoneNumber,
								},

								method: 'POST',
								//向服务器发送订单数据，返回订单编号
								success: (res) => {
									uni.hideLoading()
									console.log(res)
									if (res.data.msg == '无可售门票！') {
										uni.showToast({
											title: '该景区无可售门票！',
											icon: 'none',
										})
										that.submissionState = false;
									} else if (res.data.msg == '下单失败，联系管理员！') {
										uni.showToast({
											title: '下单失败，联系管理员！',
											icon: 'none',
										})
										that.submissionState = false;
									} else if (res.data.msg == '下单成功') {
										console.log('下单成功')
										if(that.ape_entry == '1'){
											console.log('跳转预约成功')
											uni.redirectTo({
												url:'successfulPayment'
											})
										}else{
											console.log('跳转支付成功')
											uni.redirectTo({
												url: '/pages/LYFW/scenicSpotTickets/selectivePayment?orderNumber=' + res.data.data.orderNumber
											})
										}
										
										
									}

								}
							})
							// #endifA


						} else if (a.length > 0) {
							uni.hideLoading()
							uni.showToast({
								title: '订单中，存在待支付/审核订单，请支付/取消后再下单',
								icon: 'none',
								duration: 2000
							})
							uni.switchTab({
								url: '../../order/OrderList'
							})
						}
					},
					fail:function(ee){
						console.log(ee)
						uni.hideLoading()
						that.submissionState = false;
					}
				})


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
			getDate:function() {
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
	}
</style>
