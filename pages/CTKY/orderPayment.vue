<template>
	<!-- 订单支付页面 -->
	<view>
		<view style="color: #000000; font-size: 26upx; position: absolute; right: 32upx; z-index: 1; top: 24upx;">倒计时：{{countDownDate}}秒</view>
		<view class="cover-container">
			<view class="MP_information1">
				<view class="MP_title">{{orderInfo.startStaion}} - {{orderInfo.endStation}}</view>
				<text class="MP_text">费用包含：车票 {{insurance}}</text>

				<view class="MP_selectionDate">
					<view class="MP_title">使用时间</view>
					<text class="MP_text">{{turnDate(orderInfo.setTime)}} &nbsp; 仅限当天</text>
				</view>

				<view class="MP_selectionDate" :hidden="hiddenValues==0">
					<view class="MP_title">购票人信息</view>
					<view class="MP_userInformation" v-for="(item,index) in passengerInfo" :key="index">
						<text>{{item.userName}}</text>
						<text class="Mp_sex">{{item.userSex}}</text>
						<text class="Mp_square">{{item.userType}}</text>
						<text class="Mp_square" v-if="item.userDefault == true">本人</text>
						<text class="Mp_square" v-if="item.userEmergencyContact == true">紧急联系人</text>
						<text class="Mp_text">身份证：{{item.userCodeNum}}</text>
						<text class="Mp_text">手机号：{{item.userPhoneNum}}</text>
					</view>
				</view>

				<view class="MP_selectionDate" :hidden="hiddenValues==0">
					<view class="MP_title">费用详情</view>
					<view class="MP_cost" v-if="adultNum>=1">
						<text>成人票</text>
						<text class="MP_number">×{{adultNum}}</text>
						<text class="MP_userCost">¥{{orderInfo.fare}}</text>
					</view>

					<view class="MP_cost" v-if="childrenNum>=1">
						<text>儿童票</text>
						<text class="MP_number">×{{childrenNum}}</text>
						<text class="MP_userCost">¥{{orderInfo.halfTicket}}</text>
					</view>

					<!-- 保险 -->
					<view class="MP_cost" v-if="isInsurance == 1 ">
						<text>保险</text>
						<text class="MP_number">×{{ticketNum}}</text>
						<text class="MP_total">¥{{insuredPrice}}</text>
					</view>

					<!-- 优惠券 -->
					<!-- <view class="MP_cost" v-if="orderInfo[0].couponPrice>0" v-if="false">
						<text>{{orderInfo[0].couponTitle}}</text>
						<text class="MP_number">×1</text>
						<text class="MP_total">-&nbsp;¥{{orderInfo[0].couponPrice}}</text>
					</view> -->

					<!-- <view class="MP_cost">
						<text class="MP_total">共计&nbsp;¥{{orderInfo[0].orderActualPayment}}</text>
					</view> -->

				</view>

				<view class="jdticon icon-xia" style="padding: 24upx 0upx; text-align: center; margin-top: 64upx;" @click="hide(0)"
				 :hidden="hiddenValues==1"></view>
				<view class="jdticon icon-shang" style="padding: 24upx 0upx; text-align: center; margin-top: 64upx;" @click="hide(1)"
				 :hidden="hiddenValues==0"></view>

			</view>

			<view class="MP_information2">
				<view class="MP_optionBar">
					<text class="Mp-icon jdticon icon-weixinzhifu"></text>
					<text class="Mp_title">微信</text>
					<radio class="Mp_box" :checked="channeIndex===0" :color="'#36cb59'" @click="Selection"></radio>
				</view>
			</view>

			<view class="MP_information2" v-if="false">
				<view class="MP_optionBar">
					<text class="Mp-icon jdticon icon-alipay"></text>
					<text class="Mp_title">支付宝</text>
					<radio class="Mp_box" :checked="channeIndex===1" :color="'#01aaef'" @click="Selection"></radio>
				</view>
			</view>

			<view class="MP_information3" @click="payment">
				支付{{totalPrice}}元
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				countDownDate: 120, //倒计时时间
				userInfo: [], //用户信息
				hiddenValues: '0', //隐藏状态值
				channel: [{
					name: '微信'
				}, {
					name: '支付宝'
				}],
				insurance: '', //保险
				isInsurance: '', //是否有保险
				insuredPrice:'',//保险价格
				channeIndex: 0, //选择支付方式
				orderInfo: [], //订单数据
				passengerInfo: [], //乘车人信息
				idNameType: [], //乘车人数组（发送请求需要）
				ticketNum: 0, //总票数
				adultNum: 0, //成人数量
				childrenNum: 0, //儿童数量	
				adultTotalPrice: '', //成人总价
				childrenTotalPrice: '', //儿童总价
				totalPrice: '', //总价格
				paymentData: [], //保存支付参数
				timer: '', //定时器数据
				orderID: '', //订单id
				ctkyOpenID:'',
				weixinOpenId:'',
				ticketInfo: [],
			}
		},
		onLoad: function(param) {
			var that = this;
			that.ticketInfo = JSON.parse(param.array);
			
			that.totalPrice = that.ticketInfo.totalPrice;//总价格
			that.insuredPrice = that.ticketInfo.insuredPrice;//保险价格
			if (that.ticketInfo.isInsurance == 1) {
				this.insurance = '保险';
				this.isInsurance = true;
			} else {
				this.insurance = '';
				this.isInsurance = false;
			}
			//读取车票信息
			this.getTickerInfo();
			//读取用户信息
			this.getUserInfo();
		},
		onUnload() {
			clearInterval(this.timer);
		},
		//--------------------------监听页面返回--------------------------
		onBackPress(options) {
			var that = this;
			// console.log('返回',that.orderID);
			if (options.from === 'backbutton') {
				// console.log('返回',options.from);
				that.refundTticket();
			}
		},
		methods: {
			//--------------------------读取车票信息--------------------------
			getTickerInfo() {
				var that = this;
				//读取车票信息
				uni.getStorage({
					key: 'ticketDate',
					success: function(data) {
						that.orderInfo = data.data;
						console.log('订单数据', that.orderInfo)
					},
					fail() {
						uni.showToast({
							title: '获取信息失败',
							icon: 'none'
						})
					}
				})
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
						//读取乘车人信息
						that.getPassengerInfo();
					}
				})
			},
			//-------------------------------时间转换-------------------------------
			turnDate(date) {
				if (date) {
					var setTime = date.replace('T', ' ');
					return setTime;
				}
			},
			//--------------------------读取乘车人信息--------------------------
			getPassengerInfo() {
				var that = this;
				//读取乘车人信息
				uni.getStorage({
					key: 'passengerList',
					success: function(data) {
						console.log('乘车人信息',data);
						that.passengerInfo = data.data;
						for (let i = 0; i < that.passengerInfo.length; i++) {
							let array = {
								userCodeNum: data.data[i].userCodeNum,
								userDefault: data.data[i].userDefault,
								userEmergencyContact: data.data[i].userEmergencyContact,
								userID: data.data[i].userID,
								userName: data.data[i].userName,
								userPhoneNum: data.data[i].userPhoneNum,
								userSex: data.data[i].userSex,
								userType: data.data[i].userType,
							}
							that.idNameType.push(array);
							that.ticketNum++;
							//把儿童票筛选出来
							if (that.passengerInfo.userType == '儿童') {
								that.childrenNum++;
							} else {
								that.adultNum++;
							}
						}
						//-------------------------------读取用户openID-------------------------------
						// #ifdef H5
						that.getOpenID();
						// #endif
						
						//-------------------------------下单-------------------------------
						// #ifdef APP-PLUS || MP-WEIXIN
						that.getOrder();
						// #endif
					},
					fail() {
						uni.showToast({
							title: '获取信息失败',
							icon: 'none'
						})
					}
				})
			},
			//--------------------------读取公众号openid--------------------------
			getOpenID() {
				var that = this;
				uni.getStorage({
					key:'ctkyOpenId',
					success:function(response){
						console.log('openid',response);
						that.ctkyOpenID = response.data
						//等待读取用户缓存成功之后再请求接口数据
						that.getOrder();
					},
					fail:function(fail){
						console.log(fail);
						// uni.showModal({
						// 	content:'用户未授权',
						// })
						console.log('用户未授权');
						// that.getOrder();
					}
				})
			},
			//--------------------------隐藏操作--------------------------
			hide(e) {
				if (e == 0) {
					this.hiddenValues = 1;
				} else {
					this.hiddenValues = 0;
				}
			},

			//--------------------------同意购买-点击事件--------------------------
			Selection: function() {
				if (this.channeIndex == 0) {
					this.channeIndex = 1;
				} else {
					this.channeIndex = 0;
				}
			},

			//--------------------------数组提取--------------------------
			screenUser: function() {
				let adult = this.orderInfo.filter(item => {
					return item.userType == '成人';
				})
				let children = this.orderInfo.filter(item => {
					return item.userType == '儿童';
				})

				this.adultIndex = adult.length;
				this.childrenIndex = children.length;
				this.adultTotalPrice = adult.length * this.orderInfo[0].ticketAdultPrice;
				this.childrenTotalPrice = children.length * this.orderInfo[0].ticketChildPrice;
			},
			//--------------------------退票-----------------------
			refundTticket: function() {
				var that = this;
				if (that.orderID) {
					console.log('开始退票');
					//当页面返回的时候取消订单
					uni.request({
						url: 'http://218.67.107.93:9210/api/app/returnCpxsOrder',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							id: that.orderID
						},
						success: (res) => {
							console.log('成功', res);
						},
						fail(res) {
							console.log('错误', res);
						}
					})
				}
			},
			//--------------------------发起下单请求-----------------------
			getOrder: function() {
				var that = this;
				console.log('用户信息',this.userInfo);
				// console.log('订单信息',this.orderInfo);
				// console.log('idNameType',this.idNameType);
				var setTime = that.orderInfo.setTime.replace('T', ' ');
				var openId = '';
				// #ifdef MP-WEIXIN
				openId = that.weixinOpenId;
				// #endif
				// #ifdef H5
				openId = that.ctkyOpenID;
				// #endif
				var companyCode = '南平旅游APP';
				// #ifdef H5
				companyCode = '南平旅游H5';
				// #endif
				// #ifdef APP-PLUS
				companyCode = '南平旅游APP';
				// #endif
				
				uni.showLoading();
				var data= {
					companyCode: companyCode,
					clientID: that.userInfo.unid, //用户ID
					clientName: that.userInfo.username, //用户名
					phoneNumber: that.userInfo.phoneNumber, //手机号码
				
					scheduleCompanyCode: that.orderInfo.scheduleCompanyCode,
					executeScheduleID: that.orderInfo.executeScheduleID,
					startSiteID: that.orderInfo.startSiteID, //上车点ID
					endSiteID: that.orderInfo.endSiteID, //下车点ID
					startSiteName: that.orderInfo.startStaion, //起点站
					endSiteName: that.orderInfo.endStation, //终点站
					priceID: that.orderInfo.priceID, //价格ID
					setOutTime: setTime, //订单时间
					insuredPrice: that.insuredPrice, //保险价格
					carType: that.orderInfo.shuttleType, //班车类型
				
					fullTicket: that.adultNum, //全票人数
					halfTicket: that.childrenNum, //半票人数
					carryChild: that.childrenNum, //携童人数
					idNameType: that.idNameType,
					insured: that.isInsurance, //是否选择了保险
					openId: openId,
					totalPrice: that.totalPrice, //总价格
				};
				console.log(data)
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/addOrder',
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					data: {
						companyCode: companyCode,
						clientID: that.userInfo.unid, //用户ID
						clientName: that.userInfo.username, //用户名
						phoneNumber: that.userInfo.phoneNumber, //手机号码
										
						scheduleCompanyCode: that.orderInfo.scheduleCompanyCode,
						executeScheduleID: that.orderInfo.executeScheduleID,
						startSiteID: that.orderInfo.startSiteID, //上车点ID
						endSiteID: that.orderInfo.endSiteID, //下车点ID
						startSiteName: that.orderInfo.startStaion, //起点站
						endSiteName: that.orderInfo.endStation, //终点站
						priceID: that.orderInfo.priceID, //价格ID
						setOutTime: setTime, //订单时间
						insuredPrice: that.insuredPrice, //保险价格
						carType: that.orderInfo.shuttleType, //班车类型
										
						fullTicket: that.adultNum, //全票人数
						halfTicket: that.childrenNum, //半票人数
						carryChild: that.childrenNum, //携童人数
						idNameType: that.idNameType,
						insured: that.isInsurance, //是否选择了保险
						openId: openId,
						totalPrice: that.totalPrice, //总价格
					},
					success: (res) => {
						console.log('订单返回数据', res);
						if (res.data.msg == '下单成功！') {
							uni.setStorage({
								key: 'payInfo',
								data: {
									resultStr: res.data.data.resultStr,
									orderID: res.data.data.id,
								},
								success() {
									console.log('success');
								}
							})
							that.orderID = res.data.data.id;
							//获取车票支付参数
							that.getTicketPaymentInfo(res);
						} else if (res.data.code == 'FAILED') {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						} else {
							uni.hideLoading();
							console.log('出错了');
						}
					},
					fail(res) {
						uni.hideLoading();
						uni.showToast({
							title: '下单失败，请重新下单',
							icon: 'none'
						})
					}
				})
			},

			//--------------------------获取车票支付参数--------------------------
			getTicketPaymentInfo: function(res) {
				console.log(res);
				var that = this;
				var timer = null;
				that.timer = timer;
				timer = setInterval(function() {
					uni.request({
						url: 'http://218.67.107.93:9210/api/app/getPayParam',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							resultStr: res.data.data.resultStr,
							id: res.data.data.id
						},
						success: (payData) => {
							console.log('支付参数',payData);
							if (payData.data != null) {
								if (payData.data.data != null) {
									uni.hideLoading();
									that.paymentData = JSON.parse(payData.data.data);
									that.isPayEnable = 1;
									that.totalPrice = res.data.data.orderPrice;
									clearInterval(timer);
								}
								if (payData.data.msg == '获取支付参数成功！') {
									uni.hideLoading();
									uni.showModal({
										content: '请在2分钟内完成支付',
										success(res) {
											if(res.confirm) {
												that.payment();
											}
										}
									})
									clearInterval(timer);
									//--------------------------------开启计时器--------------------------------
									that.getDate(res);
								} else if (payData.data.msg != null) {
									uni.hideLoading();
									uni.showModal({
										content:payData.data.msg,
										success(res) {
											if(res.confirm){
												clearInterval(timer);
												clearInterval(interval);
												uni.switchTab({
													url:'../order/OrderList'
												})
											}
										}
									})
								}
							} else {
								uni.showToast({
									title: '请求错误，请重新选择班次',
									icon: 'none'
								})
							}
						},
						fail(res) {
							uni.hideLoading();
							console.log('失败');
							//回调失败，取消定时器
							clearInterval(timer);
						}
					})
				}, 1000)
			},
			//--------------------------计时器--------------------------
			countDown: function() {
				var interval = setInterval(() => {
					--this.countDownDate;
					uni.setStorage({
						key: 'countDown',
						data: this.countDownDate,
					})
					if (this.countDownDate <= 0) {
						clearInterval(interval)
						
						this.countDownEnd();
						uni.removeStorage({
							key: 'countDown'
						})
					}
				}, 1000)
			},
			//--------------------------倒计时结束--------------------------
			countDownEnd: function() {
				var that = this;
				uni.showToast({
					title: '支付超时，已自动取消订单',
					icon: 'none',
					duration: 2000
				})
				that.refundTticket();
			},

			//--------------------------调起支付--------------------------
			payment: function() {
				
				var that = this;
				console.log('点击了支付', that.paymentData);
				
				// #ifdef H5
				console.log('点击了支付', that.paymentData);
				WeixinJSBridge.invoke('getBrandWCPayRequest', {
					"appId": that.paymentData.AppId, //公众号名称，由商户传入
					"timeStamp": that.paymentData.TimeStamp, //时间戳
					"nonceStr": that.paymentData.NonceStr, //随机串
					"package": that.paymentData.Package, //扩展包
					"signType": that.paymentData.SignType, //微信签名方式:MD5
					"paySign": that.paymentData.PaySign //微信签名
				}, function(res) {
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						//支付成功再进计时器查询状态
						uni.showToast({
							title: '支付成功',
							icon: 'none'
						})
						setTimeout(function(){
							// that.getTicketPaymentInfo_ticketIssue(that.orderNum);
						},4000)
					} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
						uni.showToast({
							title: '您取消了支付',
							icon: 'none'
						})
					} else if (res.err_msg == "get_brand_wcpay_request:faile") {
						uni.showToast({
							title: '支付失败，请重新支付',
							icon: 'none'
						})
					} else {
						// location.href = "/Coach/GetCoach";
					}
				});
				// #endif
				
				
				// #ifdef APP-PLUS
				uni.hideLoading()
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: {
						appid: that.paymentData.AppId,
						timestamp: that.paymentData.TimeStamp,
						noncestr: that.paymentData.NonceStr,
						package: 'Sign=WXPay',
						sign: that.paymentData.PaySign,
						partnerid: that.paymentData.PartnerId, 
						prepayid: that.paymentData.PrepayId,
					},
					success:function(res){
						console.log(response)
						if(res.errMsg == 'requestPayment:ok') {//成功
							uni.showToast({
								title: '支付成功',
								icon: 'none'
							})
							setTimeout(function(){
								// that.getTicketPaymentInfo_ticketIssue(that.orderNum);
							},4000)
						}else if(res.errMsg == 'requestPayment:fail errors') {//错误
							uni.showToast({
								title: '支付失败，请重新支付',
								icon: 'none'
							})
							uni.redirectTo({
								url: '/pages/CTKY/payFail'
							})
						}else if(res.errMsg == 'requestPayment:fail canceled') {//用户取消
							uni.showToast({
								title: '您取消了支付',
								icon: 'none'
							})
						}
					},
										
					fail: function(ee) {
						console.log(ee)
						uni.showToast({
							title: '拉起支付失败，请检查网络后重试',
							icon: 'none',
							duration: 3000
						})
					}
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.hideLoading()
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp:that.paymentData.TimeStamp,
					nonceStr:that.paymentData.NonceStr,
					package:that.paymentData.Package,
					signType:that.paymentData.SignType,
					paySign:that.paymentData.PaySign,
					success(res) {
						console.log(res)
						if (res.errMsg == "requestPayment:ok") {
							uni.showToast({
								title: '支付成功',
								icon: 'none',
							})
							uni.showLoading({
							    title: '加载中...'
							});
							setTimeout(function(){
								that.getTicketPaymentInfo_ticketIssue(that.orderNum);
							},4000)
						}else if (res.errMsg == "requestPayment:fail cancel") {
							setTimeout(function() {
								that.showToast("您取消了支付，请重新支付")
							}, 1000)
						}else if (res.errMsg == "requestPayment:fail errors") {
							setTimeout(function() {
								that.showToast("支付失败，请重新支付")
							}, 1000)
						}
					},
					fail(res) {
						console.log(res)
						if (res.errMsg == "requestPayment:fail cancel") {
							setTimeout(function() {
								that.showToast("您取消了支付，请重新支付")
							}, 1000)
						}else if (res.errMsg == "requestPayment:fail errors") {
							setTimeout(function() {
								that.showToast("支付失败，请重新支付")
							}, 1000)
						}else {
							that.showToast("支付出错")
						}
					}
				});
				// #endif
			},
			//--------------------------成功之后重新获取车票支付参数--------------------------
			getTicketPaymentInfo_ticketIssue: function(orderNumber) {
				var that = this;
				var timer = null;
				that.timer = timer;
				uni.showLoading({
					title: '检索订单是否支付...'
				});
				timer = setInterval(function() {
					uni.request({
						url: 'http://218.67.107.93:9210/api/app/getPayParam',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							resultStr: res.data.data.resultStr,
							id: res.data.data.id
						},
						success: (res) => {
							console.log('支付参数返回数据', res);
							if (res.data.data == '订票成功') {
								uni.hideLoading();
								clearInterval(timer);
								uni.showToast({
									title: '出票成功',
									icon: 'none',
								})
								uni.redirectTo({
									url: './CTKYPaySuccess'
								})
							}
						},
						fail(res) {
							uni.hideLoading();
							//回调失败，取消定时器
							clearInterval(timer);
						}
					})
				}, 3000)
			},
			//获取当前时间并格式化
			getDate: function(res) {
				var that = this;
				console.log('1111', res);
				//先提取订单下单时间把空格转换成T
				var a = res.data.data.createdTime.replace(' ', 'T')
				//把时间转换成时间戳---订单时间
				var orderDate = new Date(a).getTime();

				//获取当前时间（为什么要先把当前时间戳格式化？）是因为直接获取当前时间戳存在时间误差
				var date = new Date(),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate(),
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
					minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
					second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				var timer = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second;
				//把转换后的时间，转换成时间戳
				var c = new Date(timer).getTime();

				//用当前时间-下单时间再除于1000就是秒
				var d = (c - orderDate) / 1000;

				//这里的214秒就是支付倒计时
				var e = 214 - d;

				that.countDownDate = e;
				that.countDown();
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F5F5;
		padding-bottom: 40upx;
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
		top: 30upx;
		padding: 32upx 30upx;
	}

	//公共样式 - 适用多个数据框
	.MP_information1 {
		border-radius: 16upx;
		background: #FFFFFF;
		padding: 44upx 32upx;
		padding-bottom: 24upx;
		font-size: 32upx;
		box-shadow: 0px 0.2px 0px #aaa;

		.MP_title {
			font-size: 34upx;
			display: flex;
			font-weight: bold;
			// margin-top: 20upx;
		}

		.MP_text {
			color: #888;
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

		//选项框样式
		.MP_optionBar {
			.Mp_title {
				font-size: 32upx;
				margin-left: 20upx;
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

			.Mp_icon {
				width: 100upx;
				font-size: 52upx;
			}

			.icon-weixinzhifu {
				color: #36cb59;
			}

			.icon-alipay {
				color: #01aaef;
			}
		}
	}

	//公共样式3 - 适用按钮
	.MP_information3 {
		padding: 24upx 0;
		border-radius: 64upx;
		background: #FF6600;
		text-align: center;
		color: #FFFFFF;
		font-size: 38upx;
		font-weight: 400;
		box-shadow: 0px 0.2px 0px #aaa;
		margin-top: 80upx;
	}

	//使用时间/费用详情
	.MP_selectionDate {
		margin-top: 24upx;
		margin-bottom: 24upx;
		border-top: 1px #F5F5F5 dashed;

		.MP_title {
			margin-top: 24upx;
			font-size: 34upx;
			display: flex;
			font-weight: bold;
		}

		.MP_text {
			color: #888;
			font-size: 28upx;
			display: block; // 让字体换行
		}

		.MP_cost {
			display: block; // 让字体换行
			margin: 20upx 0;
			font-size: 28upx;
			color: #888;

			.MP_number {
				margin-left: 16upx;
			}

			.MP_userCost {
				float: right;
			}

			.MP_total {
				color: #f85e52;
				float: right;
			}
		}
	}

	// 出行人信息
	.MP_userInformation {
		margin-top: 32upx;

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
</style>
