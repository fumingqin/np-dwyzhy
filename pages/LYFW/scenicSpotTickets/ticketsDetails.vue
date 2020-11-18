<template>
	<view class="Ly_background">
		<!-- 顶部轮播图（可点击进入相册并放大） -->
		<swiper class="swi" circular autoplay>
			<swiper-item class="swi-item" v-for="(item,index) in piclist" :key="index">
				<image :src="item.ticketImage" mode="aspectFill" @click="goImgList" />
				<view class="view">1张图片</view>
			</swiper-item>
		</swiper>
		<view>
			<!-- 标题、发布时间、点击量、分享 -->
			<view class="clicks">
				<text class="title">{{scSpotContent.ticketName}}</text>
				<text class="time">开放时间：{{scSpotContent.ticketOpenUp}} </text>
				<text class="time">当前流量：<text style="color: #09C767;" v-if="scSpotContent.personFlow !== 0">{{visitorsFlowrate(scSpotContent.personFlow)}}</text><text style="color: #FD5745;" v-if="scSpotContent.personFlow == 0">{{visitorsFlowrate(scSpotContent.personFlow)}}</text>    </text>
			</view>
		</view>
		<!-- 门票滑块 -->
		<!-- 模块命名：Tk godetail(item) -->
		<view :hidden="admissionTicketStatus == '该景区暂无门票产品信息！'">
			<scroll-view class="Tk_scrollview">
				<view class="tweetsTitle2">门票</view>
				<view class="Tk_item" v-for="(item,index) in admissionTicket" :key="item" @click="show(item)">
					<view class="Tk_bacg">
						<text class="Tk_text1">{{item.admissionTicketName}}</text>
						<text class="Tk_text3">¥{{item.ticketAdultPrice}}元</text>
						<text class="Tk_text2">包含：{{item.ticketContain}}</text>
						<text class="Tk_text2">{{item.ticketComment_s1}}&nbsp;|&nbsp;{{item.ticketComment_s2}}&nbsp;|&nbsp;{{item.ticketComment_s3}}</text>
						<view class="Tk_butter">立即预订</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 文章内容 -->
		<view class="Zj_background">
			<view class="tweetsTitle">介绍</view>
			<rich-text class="tweetscontent" :nodes="scSpotContent.ticketScenicContent"></rich-text>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="boxVlew">
				<view class="titleView">
					<text class="Nb_text1">预约时间</text>
					<text class="Nb_text2 jdticon icon-fork " @click="close"></text>
				</view>

				<view class="headerClass">
					<scroll-view class="scrollClass" scroll-x>
						<view class="blockClass" :class="selectIndex == index ? 'viewPress': '' " v-for="(item,index) in dateArray" :key="index"
						 @click="viewClick(index,item)" v-model="selectIndex">
							<view class="textCLass">
								<view class="weekClass">{{item.week}}</view>
								<view class="dateClass">{{item.date}}</view>
							</view>
						</view>
					</scroll-view>
					<view style="width: 14%; align-items: center; justify-content: center;display: flex;" @click="onShowDatePicker">
						<image src="../../../static/LYFW/scenicSpotTickets/ticketsList/calendar.png" class="calendarImage"></image>
					</view>
				</view>

				<view class="ape_title">选择预约时段</view>
				<scroll-view style="height: 566upx;" scroll-y>
						<view class="ape_contView" v-for="(item,index) in apeData" :key="item.ape_time" :class="index==radioCurrent && item.AppointmentQuota != 0  ? 'ape_contViewBackground' : ''" @click="radioChange(index)">
							<image  class="ape_contImage" src="../../../static/LYFW/scenicSpotTickets/ticketsList/xuanzhong.png" mode="aspectFill" :hidden="index==radioCurrent && item.AppointmentQuota != 0 "></image>
							<image  class="ape_contImage" src="../../../static/LYFW/scenicSpotTickets/ticketsList/xuanzhong2.png" mode="aspectFill" v-if="index==radioCurrent && item.AppointmentQuota != 0 "></image>
							<text class="ape_contText" style="font-weight: bold;">{{item.AppointmentTimeSlot}}</text>
							<text class="ape_contText">剩余名额：{{item.AppointmentQuota}}名</text>
							<text class="ape_contIcon jdticon icon-zuojiantou-up" :hidden="index!==radioCurrent"></text>
						</view>
				</scroll-view>

				<view class="ape_contButter" @click="godetail">
					确认预约
				</view>
			</view>
		</uni-popup>
		<uni-calendar ref="calendar" :insert="false" :date="date" :lunar="true" @confirm="onSelected"></uni-calendar>

	</view>
</template>
<script>
	import uniCalendar from '@/components/LYFW/scenicSpotTickets/uni-calendar/uni-calendar.vue'
	import uniPopup from "@/components/LYFW/scenicSpotTickets/uni-popup/uni-popup.vue"
	export default {
		components: {
			//加载多方弹框组件
			uniPopup,
			//加载日期组件
			uniCalendar,
		},
		data() {
			return {
				piclist: [{
					ticketImage: '',
				}], //图片内容
				scSpotContent: [{
					ticketId: '',
					ticketTitle: '',
					ticketOpenUp: '',
					ticketScenicContent: '',
				}], //景区内容
				admissionTicket: [{
					admissionTicketID: '',
					admissionTicketName: '',
					ticketContain: '',
					ticketComment_s1: '',
					ticketComment_s2: '',
					ticketComment_s3: '',
					ticketAdultPrice: 240,
					ticketChildPrice: '',
					ticketAdultPrice: '',
					companyId: '',
					executeScheduleId: '',
				}], //门票内容
				admissionTicketStatus: '', //判断是否展示

				//-----------------时间选择器参数开始-------------------
				selectIndex: '', //选中的下标
				dateArray: [], //时间轴的数量的数组
				date: '', //时间轴上选中的日期
				currentTime: '', //当前时间
				//-----------------时间选择器参数结束-------------------
				ticketInformation : '', //景区信息（点击预定后存）
				radioCurrent: -1, //时段radio选择参数
				apeData: [],
				ticketId : '',//景区详情ID

			}
		},
		onLoad(options) {
			this.ticketId = JSON.parse(options.ticketId)
			this.lyfwData(this.ticketId);
		},
		onPullDownRefresh:function(){
			this.lyfwData(this.ticketId)
		},
		onNavigationBarButtonTap: function() {
			this.share();
		},
		onShareAppMessage(res) {
			if (res.from === 'menu') { // 来自页面内分享按钮
				return {
					title: '来自' + this.userInfo.nickname + '的分享',
					imageUrl: this.piclist[0].ticketImage,
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
				}
			}
		},
		methods: {
			//读取静态数据json.js 
			lyfwData: function(e) {
				// 请求景区图片
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/getScenicspotDetailImg?ticketId=' + e,
					method: 'POST',
					success: (res) => {
						// console.log(res)
						uni.stopPullDownRefresh()
						this.piclist = res.data.data;
					}
				})
				// 请求景区详情
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/getScenicspotDetail?ticketId=' + e,
					method: 'POST',
					success: (res) => {
						// console.log(res)
						uni.stopPullDownRefresh()
						this.scSpotContent = res.data.data;
					}
				})

				// 请求景区门票
				uni.request({
					url: 'http://218.67.107.93:9210/api/app/getOneScenicspotTicket?ticketId=' + e,
					method: 'POST',
					success: (res) => {
						// console.log(res)
						uni.stopPullDownRefresh()
						this.admissionTicket = res.data.data;
						this.admissionTicketStatus = res.data.msg;
					}
				})
				

			},

			//保存图片至本地并打开新页面
			goImgList() {
				uni.setStorageSync('imagePiclist', this.piclist);
				uni.navigateTo({
					url: '/pages/LYFW/currency/imglist'
				})
			},

			//打开弹框，判断预约功能是否开启，并执行对应操作
			show: function(e) {
				// console.log(e)
				this.ticketInformation = e;
				uni.setStorage({
					key: 'ticketInformation',
					data: e,
					success: () => {
						uni.request({
							url:'http://218.67.107.93:9266/Appointment/getScenicSpotByID?CompanyID='+e.companyId,
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success:(res)=>{
								console.log(res)
								if (res.data.data.IsAppointment == false) {
									uni.navigateTo({
										url: '/pages/LYFW/scenicSpotTickets/orderAdd?ape_entry=0'
									})
								} else if (res.data.data.IsAppointment == true) {
									this.getDate();
									this.$refs.popup.open()
								}
							}
						})
						
						
					}
				})
			},
			//关闭弹框
			close: function() {
				this.$refs.popup.close()
			},


			//预约时段点击跳转
			godetail: function() {
				// console.log(this.dateArray[this.selectIndex])
				// console.log(this.apeData[this.radioCurrent].date)
				if(this.radioCurrent == -1 || this.radioCurrent===''){
					uni.showToast({
						title:'请选择预约时段',
						icon:'none'
					})
				}else{
					if(this.apeData[this.radioCurrent].AppointmentTimeSlot ==undefined){
						uni.showToast({
							title:'请选择预约时段',
							icon:'none'
						})
					}else{
						uni.navigateTo({
							url: '/pages/LYFW/scenicSpotTickets/orderAdd?ape_entry=1&ape_date=' + this.dateArray[this.selectIndex].longDate +
								'&ape_week=' + this.dateArray[this.selectIndex].week + '&ape_time=' + this.apeData[this.radioCurrent].AppointmentTimeSlot
								+ '&AID=' + this.apeData[this.radioCurrent].AID
						})
					}
					
				}
				

			},

			//分享
			share() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 0,
					href: "http://www.baidu.com",
					title: "来自" + this.userInfo.nickname + "的分享",
					summary: this.scSpotContent[0].ticketTitle,
					imageUrl: this.piclist[0].ticketImage,
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

			// 统一跳转接口
			navTo(url) {
				uni.navigateTo({
					url
				})
			},

			//--------------------------------时间选择器代码开始（整体直接复制，遇到“必改”2个字根据自身代码实际情况进行微调----------------
			//-------------------------请求预约时段数据-------------------------------------
			ape_period:function(e){
				console.log(e)
				if(e == ''){
					uni.request({
						url:'http://218.67.107.93:9266/Appointment/getAppointmentLogByID?CompanyID='+this.ticketInformation.companyId +'&dateTime='+e,
						method:'POST',
						header: {'content-type': 'application/x-www-form-urlencoded'},
						success:(res)=>{
							console.log(res)
							this.apeData = res.data.data;
						}
					})
				}else {
					uni.request({
						url:'http://218.67.107.93:9266/Appointment/getAppointmentLogByID?CompanyID='+this.ticketInformation.companyId +'&dateTime='+this.currentTime,
						method:'POST',
						header: {'content-type': 'application/x-www-form-urlencoded'},
						success:(res)=>{
							console.log(res)
							this.apeData = res.data.data;
						}
					})
				}

			},
			//-------------------------点击时间选择器发生事件-------------------------------------
			viewClick: function(e, item) { 
				this.selectIndex = e;
				this.date = item.longDate;
				console.log(item)
				this.getDeparture();
			},

			//点击顶部时间，请求该时间的班次列表
			getDeparture: function() {
				this.currentTime = this.date; //必改，currentTime为你要请求的时间
				console.log(typeof(this.currentTime))
				console.log(typeof(this.date))
				// console.log(this.setOutDate)
				this.ape_period(); //必改
			},
			//-------------------------------显示日期-------------------------------
			onShowDatePicker() { //显示
				this.$refs.calendar.open();
			},

			//-------------------------------选择日期-------------------------------
			onSelected: function(e) {
				this.date = e.fulldate;
				this.currentTime = e.fulldate; //必改，currentTime为你要请求的时间
				this.ape_period();  //必改，GetSchedule为请求班次的方法
				var IsExist = false;
				for (var i = 0; i < this.dateArray.length; i++) {
					if ((new Date(this.dateArray[i].longDate)).getTime() == (new Date(this.date)).getTime()) {
						IsExist = true;
						this.selectIndex = i;
					}
				}
				//判断时间轴上是否存在改日期，不存在则重新绘制
				if (!IsExist) {
					this.dateArray = [];
					var dateToday = new Date(); //获取今天日期
					var date = new Date(this.date); //选中的日期
					this.selectIndex = 0;
					for (var i = 0; i < 8; i++) {
						var mydate = new Date(date.getTime() + 24 * i * 60 * 60 * 1000); //日期一天加一次
						var nowdate = this.getTime(3, mydate); //获取该日期的缩写  月/日
						var week = this.getTime(2, mydate); //获取该日期为周几
						var longdate = this.getTime(0, mydate); //获取 年/月/日
						if (this.getTime(0, mydate) == this.getTime(0, dateToday)) {
							week = '今天';
						}
						this.dateArray.push({
							week: week,
							date: nowdate,
							longDate: longdate,
						});
					}
				}
			},
			//-------------------------------获取当前时间-------------------------------
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
				this.currentTime = `${year}/${month}/${day}`;
				var dateTime = `${year}-${month}-${day}`
				console.log(this.currentTime)
				this.loadDate(this.currentTime); //初始化时间轴
				this.ape_period(dateTime); //获取预约时段数据
			},

			//-------------------------------初始化时间轴-------------------------------
			loadDate: function(param) {
				var that = this;
				var date = '';


				//将时间的-转换成/
				// var subStr = new RegExp('-', 'ig');
				// var result = param.replace(subStr, "/");
				date = new Date(param);
				// console.log(date)

				this.selectIndex = 0;
				for (var i = 0; i < 7; i++) {
					var mydate = new Date(date.getTime() + 24 * i * 60 * 60 * 1000);
					var nowdate = this.getTime(3, mydate);
					var week = this.getTime(2, mydate);
					var longdate = this.getTime(0, mydate);
					if (mydate.getTime() == date.getTime()) {
						week = '今天';
					}
					this.dateArray.push({
						week: week,
						date: nowdate,
						longDate: longdate,
					});
				}
			},
			//-------------------------------点击班次进行缓存，并打开页面  结束-------------------------------
			//日期时间转换函数   type 0 年月日 ，1 时分秒 ， 2 星期 ，3 月/日  4几月几日
			getTime: function(type, date1) {
				let date = new Date(date1.getTime()),
					currentDate,
					currentTime,
					sortDate,
					monthAndDay,
					seperator = "-", // 如果想要其他格式 只需 修改这里 
					year = date.getFullYear(),
					month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
					weex = date.getDay(),
					day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
					minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
					second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				// month >= 1 && month <= 9 ? (month = "0" + month) : "";
				// day >= 0 && day <= 9 ? (day = "0" + day) : "";
				//当前 日期
				currentDate = year + seperator + month + seperator + day;
				//当前 时间
				currentTime = hour + ":" + minute + ":" + second;
				sortDate = month + "-" + day;
				monthAndDay = month + "月" + day + "日";
				// 输出格式 为 2018-8-27 14:45:33
				// console.log(currentDate +" "+ currentTime);
				if (type == 0) {
					// console.log('-1',currentDate)
					return currentDate
				} else if (type == 1) {
					// console.log('0',currentTime)
					return currentTime;
				} else if (type == 2) {
					if (weex == 1) {
						return '周一'
					}
					if (weex == 2) {
						return '周二'
					}
					if (weex == 3) {
						return '周三'
					}
					if (weex == 4) {
						return '周四'
					}
					if (weex == 5) {
						return '周五'
					}
					if (weex == 6) {
						return '周六'
					}
					if (weex == 0) {
						return '周日'
					}
				} else if (type == 3) {
					// console.log('1',sortDate)
					return sortDate;

				} else if (type == 4) {
					// console.log('2',monthAndDay)
					return monthAndDay;
				} else {
					// console.log('3',currentDate + " " + currentTime)
					return currentDate + " " + currentTime;
				}
			},
			//--------------------------------时间选择器代码结束-----------------------------------------------------

			radioChange: function(e) {
				console.log(e)
				if(this.apeData[e].AppointmentQuota==0){
					// console.log('已满')
					uni.showToast({
						title:'该时段预约人数已满，请选择其他时段',
						icon:'none'
					})
					// this.radioCurrent = '';
				}else if(this.apeData[e].AppointmentQuota!==0){
					if(this.radioCurrent == e){
						// console.log('重点')
						this.radioCurrent = -1;
						// console.log(this.radioCurrent)
					}else{
						// console.log('未满')
						this.radioCurrent = e;
						// console.log(this.radioCurrent)
					}
				}
			},
			
			//人流量转编译
			visitorsFlowrate : function(e){
				return  e +'人'
			}

		}
	}
</script>

<style lang="scss">
	//页面背景
	.Ly_background {
		width: 100%;
		height: 100%;
		background: #fff;

		//顶部轮播区样式
		.swi {
			width: 100%;
			height: 440upx;

			.swi-item {
				width: 100%;
				height: 100%;
				overflow: hidden;
			}

			image {
				width: 100%;
				height: 100%;
			}
		}

		//相册下标
		.view {
			background-color: rgba(0, 0, 0, 0.7);
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 32upx;
			height: 48upx;
			position: absolute;
			bottom: 24upx;
			right: 24upx;
			font-size: 30upx;
			border-radius: 24upx;
		}

		//时间、点击量、标题
		.clicks {
			display: flex;
			flex-direction: column;

			//标题
			.title {
				font-size: 44upx;
				font-weight: bold;
				color: #333333;
				padding-top: 32upx;
				padding: 32upx 32upx;
			}

			//时间
			.time {
				font-size: 32upx;
				color: #333333;
				padding-left: 32upx;
				margin: 24upx 0;
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
						font-weight: bold;
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

					.Tk_text3 {
						position: absolute;
						float: right;
						right: -156upx;
						top: 0upx;
						font-size: 28upx;
						color: #FF6600;
					}

					.Tk_butter {
						position: absolute;
						width: 164upx;
						height: 64upx;
						bottom: -4upx;
						right: -158upx;
						margin-top: 24upx;
						background: linear-gradient(to right, #65bbf9, #28a4ff);
						border-radius: 32upx;
						color: #FFFFFF;
						font-size: 28upx;
						text-align: center;
						line-height: 64upx;
					}
				}

			}
		}

		//推文标题
		.tweetsTitle {
			font-size: 38upx;
			font-weight: bold;
			color: #333333;
			padding: 24upx 32upx;
			padding-top: 40upx;
		}

		.tweetsTitle2 {
			font-size: 38upx;
			font-weight: bold;
			color: #333333;
			padding: 24upx 32upx;
			padding-top: 40upx;
		}

		//推文内容
		.tweetscontent {
			display: flex;
			position: relative;
			letter-spacing: 4upx;
			line-height: 48upx;
			color: #333333;
			padding: 32upx 32upx;
			padding-top: 8upx;
			font-size: 33upx;
		}
	}

	//须知弹框
	.boxVlew {
		width: 90%;
		height: 928upx;
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
	}

	//---------------------------------------时间轴样式开始-----------------------------------------------------
	.headerClass {
		width: 100%;
		background: #FFFFFF;
		// height: 780upx;
		//padding-left: 10upx;
		margin-bottom: 10upx;
		display: flex;
		margin-top: 40upx;
	}

	.scrollClass {
		height: 102upx;
		width: 86%;
		white-space: nowrap; //外层写这俩
		flex-wrap: nowrap;
		border-right: 1rpx #ddd solid;
	}

	.blockClass {
		margin: 12upx 14upx;
		//background: #FFFFFF;
		width: 87upx;
		height: 84upx;
		border-radius: 8upx;
		display: inline-block; //里层写这个
	}

	.textCLass {
		margin: 9upx 10upx;
	}

	.weekClass {
		//display: block;
		font-size: 26upx;
		font-family: MicrosoftYaHei;
		font-weight: 400;
		color: #333333;
		text-align: center;
	}

	.dateClass {
		//display: block;
		font-size: 24upx;
		font-family: MicrosoftYaHei;
		font-weight: 400;
		color: #333333;
		text-align: center;
	}

	.calendarImage {
		width: 35upx;
		height: 37upx;
	}

	.viewPress {
		background: #1EA2FF;

		.weekClass {
			color: #FFFFFF;
		}

		.dateClass {
			color: #FFFFFF;
		}
	}

	//---------------------------------------时间轴样式结束-----------------------------------------------------


	//---------------------------------------预约时段样式开始-----------------------------------------------------
	.ape_title {
		margin: 16upx 0;
		margin-top: 32upx;
		font-size: 30upx;
	}


	.ape_contView {
		display: flex;
		padding: 32upx 0 32upx 16upx;
		border-radius: 12upx;
		margin: 24upx 0;
		background: #eee;

		&.ape_contViewBackground {
			background: #49abf1;
			color: #fff;
		}

		.ape_contImage{
			margin: 0 0 0 8upx;
			width: 40upx;
			height: 40upx;
		}

		.ape_contText {
			margin: 0 12upx;
			padding-top: 2upx;
			font-size: 28upx;
		}

		.ape_contIcon {
			padding-top: 10upx;
			font-size: 24upx;
			margin-left: 6upx;
			color: #fff;
		}
	}

	.ape_contButter {
		height: 96upx;
		font-size: 30upx;
		letter-spacing: 2upx;
		margin: 24upx 0;
		background: #ff6600;
		color: #fff;
		border-radius: 48upx;
		text-align: center;
		line-height: 96upx;
	}

	//---------------------------------------预约时段样式结束-----------------------------------------------------
</style>
