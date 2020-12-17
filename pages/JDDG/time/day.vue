<template>
	<view class="content">
		<view class="header">
			<view class="bar"></view>
			<view class="set text-gray">
				<text @click="close" style="font-size:40upx;">返回</text>
				<text @click="reset" style="font-size:35upx;color:#DDDDDD">清空</text>
			</view>
			<view class="in-and-out">
				<view class="item" v-if="start.length > 0">
					<view style="font-size:30upx;color:#C0C0C0">入住日期</view>
					<view style="font-weight: bold;margin-top:10upx;font-size:36upx">{{ startDay }}</view>
					<view style="font-size:24upx;margin-top:10upx">{{ startWeek }}</view>
				</view>
				<view class="item text" v-if="start.length == 0"><view>入住日期</view></view>
				<view class="item">
					<view class="count-border" :class="day == 0 ? 'gray' : 'orange'">
						<view class="count" style="font-size:26upx;line-height:26upx;">共{{ day }}晚</view>
					</view>
				</view>
				<view class="item text" v-if="end.length == 0"><view>离店日期</view></view>
				<view class="item" v-if="end.length > 0">
					<view style="font-size:30upx;color:#C0C0C0">离店日期</view>
					<view style="font-weight: bold;margin-top:10upx;font-size:36upx">{{ endDay }}</view>
					<view style="font-size:24upx;margin-top:10upx">{{ endWeek }}</view>
				</view>
			</view>
			<view class="week">
				<view>日</view>
				<view>一</view>
				<view>二</view>
				<view>三</view>
				<view>四</view>
				<view>五</view>
				<view>六</view>
			</view>
		</view>
		<view class="section">
			<view v-for="(res, line) in resDate" class="item" :key="line">
				<view class="year">{{ res.year }}年{{ res.month }}月</view>
				<view class="day">
					<view v-for="week in res.oneDayWeek" class="day-list" :style="{ width: (dayWidth - 10) / 7 + 'px' }"></view>
					<view @tap="selectDay(line, index,(line+1).toString()+index)" v-for="(item, index) in res.day" :key="index" class="day-list"
					 :class="[
													line == start[0] && index == start[1] ? 'bg-orange select-style' : '',
																				(line >= start[0] && line <= end[0] && index > start[1] && index < end[1]) || (line >= start[0] && index > start[1] && line < end[0]) || (line <= end[0] && index < end[1] && line > start[0]) || (line < end[0] && line > start[0]) ? 'bg-higlt-orange' : '',
																				line == 0 && index + 1 < nowDay ? 'time-out' : '',
																				isNaN(item) ? 'is-festival' : '',
																				(isNaN(item) && line == start[0] && index == start[1]) || (isNaN(item) && line == end[0] && index == end[1]) ? 'not-festival' : '',		
																				(priceStauts.length > 0  && priceStauts[line][index] <0 && start.length>0 && end.length>0) ||(priceStauts.length > 0  && priceStauts[line][index] <0 &&start.length==0 && end.length==0)?'not-sub' : '',
																				priceStauts.length > 0 && end.length==0 && start.length>0  && priceStauts[line][index]<0   && line+index*2!=lastNot[0]+lastNot[1]*2? 'not-sub' : '',					
													
												]"
					 :style="{ width: (dayWidth - 10) / 7 + 'px',backgroundColor:line == end[0] && index == end[1]?'#ff9645':'',color:line == end[0] && index == end[1]?'#FFFFFF':''}">
						<view class="select-style" v-if="line == start[0] && index == start[1]">入住</view>
						<view class="select-style" v-if="line == end[0] && index == end[1]">离店</view>
						<view style="padding-top:2px;padding-bottom:2px;">{{ item }}</view>
						<view style="font-size:12px;padding-bottom: 3px;" v-if="priceStauts.length > 0">
							<view v-if="priceStauts[line][index]>0">￥{{ priceStauts[line][index] }}</view>
							<view v-if="priceStauts[line][index] <0">无房</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submit">
			<button class="sub-btn " :disabled="!isSub" @click="submit">
				<text v-if="isSub">确定</text>
				<text v-if="!isSub">请选择入住日期</text>
			</button>
		</view>
	</view>
</template>

<script>
//引入节假日的数据，也可以用后台返回去渲染
import json from './day.js';

export default {
	computed: {
		//房间是否能预订
		isSub() {
			if(this.priceStauts.length>0){
				for(var i=this.start[0];i<=this.end[0];i++){
					if(i==this.start[0]){
						for(var j=this.start[1];j<this.date[i].length;j++){
							if(this.priceStauts[i][j]==-1)return false 
						}
					}else if(this.end[0]==this.start[0]){
						for(var j=this.start[1];j<this.end[1];j++){
							if(this.priceStauts[i][j]==-1)return false
						}
					}else if(i==this.end[0]){
						for(var j=0;j<this.end[1];j++){
							if(this.priceStauts[i][j]==-1)return false 
						}
					}else{
						for(var j=0;j<this.priceStauts[i].length;j++){
							if(this.priceStauts[i][j]==-1 )return false
						}
					}
				}
			}
			return  this.start.length==2 && this.end.length==2 ? true:false
		},
		//计算日历里的节假日
		resDate() {
			
			if(this.date.length==0)return
			
			for (var i = 0; i < this.date.length; i++) {
				for (var j = 0; j < this.festival.length; j++) {
					if (this.festival[j].year == this.date[i].year && this.festival[j].month == this.date[i].month) {
						for (var k = 0; k < this.festival[j].festival.length; k++) {
							if (this.date[i].day.indexOf(this.festival[j].festival[k].day) != -1) {
								this.date[i].day[this.date[i].day.indexOf(this.festival[j].festival[k].day)] = this.festival[j].festival[k].name;
							}
						}
					}
				}
			}

			return this.date;
		}
	},
	data() {
		return {
			out: 0,
			festival: json, //节假日
			type: '-', //日期分隔符
			date: [], //日期数组对象
			dayWidth: 0, //日期的宽度
			nowDay: 0, //当前时间的日
			start: [], //入住时间
			count: 6, //显示月的数量
			startDay: '', //入住日期
			startWeek: '', //入住时间的周几
			end: [], //离开时间
			endDay: '', //离开日期
			endWeek: '', //离开时间的周几
			day: 0, //多少晚
			priceStauts: [], //价格状态
			lastNot: [0, 10] //前置的无房操作
		};
	},
	onLoad(option) {
		uni.getSystemInfo({
			success: res => {
				this.dayWidth = res.windowWidth;
			}
		});
		this.setDate();
		this.nowDay = new Date().getDate();
		/*默认入住离店日期，今日入住明日离店，此处应在setDefaultDate函数内传入vuex里保存的日期进行默认操作
		 *不推荐使用本地缓存，下边只是使用缓存的示例
		 */
		uni.getStorage({
			key:'Time',
			success:(res)=>{
				console.log(res)
				if(res && res.data){
					var obj=JSON.parse(res.data)
					this.start = this.setDefaultDate(obj.start);
					this.end = this.setDefaultDate(obj.end);
					
				}
			},
			fail:()=>{
				this.start = this.setDefaultDate(this.getDefaultDate(0));
				this.end = this.setDefaultDate(this.getDefaultDate(1));
			}
		})
		
		

		//如果需要日期的价格，-1为无房，其他价格代表正常
		if (option && option.request) {
			uni.request({
				url: 'http://api.tcdbp.com', //当需要日历价格的时候请求的后台接口地址
				method: 'GET',
				data: {
					count: this.count //获取几个月分的数据
				},
				success: res => {
					
					if (res.data.status != 1) {
						return uni.showToast({
							title: res.data.message,
							icon: 'none',
							mask: true
						});
					}
					this.priceStauts = res.data.data;
				},
				fail: () => {
					uni.showToast({
						title: '网络错误请稍后再试',
						icon: 'none',
						mask: true
					});
				}
			});
		}
	},

	watch: {
		//离店日期
		end(newVal) {
			if (this.end.length != 0) {
				//计算选择离店日期

				this.endDay = this.setMonth(newVal[0]) + this.isFestival(newVal[0], newVal[1]) + '日';
				this.endWeek = this.getWeek(this.date[newVal[0]].year + '/' + this.date[newVal[0]].month + '/' + this.isFestival(newVal[0], newVal[1]));

				//计算天数

				var startDay = this.date[this.start[0]].year + '/' + this.date[this.start[0]].month + '/' + this.isFestival(this.start[0], this.start[1]);
				var endDay = this.date[newVal[0]].year + '/' + this.date[newVal[0]].month + '/' + this.isFestival(this.end[0], this.end[1]);
				this.day = this.getDay(startDay, endDay);
			} else {
				this.day = 0;
			}
		},
		//入住日期
		start(newVal) {
		if (this.start.length > 0) {
						this.startDay = this.setMonth(newVal[0]) + this.isFestival(newVal[0], newVal[1]) + '日';
						this.startWeek = this.getWeek(this.date[newVal[0]].year + '/' + this.date[newVal[0]].month + '/' + this.isFestival(
							newVal[0], newVal[1]));
					}
		
					if (this.priceStauts.length > 0) {
							console.log(this.lastNot)
						for (var i = newVal[0]; i < this.priceStauts.length; i++) {
		
							if (i == newVal[0]) {
							
								for (var j = newVal[1]; j < this.priceStauts[i].length; j++) {
									if (this.priceStauts[i][j] == -1) {
									
										this.lastNot = [i, j]
		console.log(this.lastNot)
										return
									}
								}
							} else {
								for (var j = 0; j < this.priceStauts[i].length; j++) {
									
									if (this.priceStauts[i][j] == -1) {
										
										this.lastNot = [i, j];
											console.log(this.lastNot)
										return
									}
								}
							}
						}
							//清空
							this.lastNot=[]
					}
		
			
				}
	},
	methods: {
		//月份补零
		setMonth(dateIndex) {
			let month = this.date[dateIndex].month;
			if (month < 10) {
				month = '0' + month;
			}
			return month + '月';
		},
		//如果是节假日名称则返回选择的日期天数
		isFestival(line, index, push = false) {
			var date = this.date[line].day[index];

			if (isNaN(date)) {
				var newIndex = this.date[line].day.indexOf(date) + 1;
				if (push) return newIndex;
				return newIndex < 10 ? '0' + newIndex : newIndex;
			} else {
				if (push) return date;
				return date < 10 ? '0' + date : date;
			}
		},
		//获取今天明天的日期
		getDefaultDate(AddDayCount) {
			var dd = new Date();
			dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
			var year = dd.getFullYear();
			var mon = dd.getMonth() + 1; //获取当前月份的日期
			var day = dd.getDate();
			return year + '-' + mon + '-' + day;
		},
		//设置入住时间 如果没有传值则根据默认值设置
		setDefaultDate(data) {
			var arr = [0, parseInt(this.nowDay - 1)];

			var start = data.indexOf('-') != -1 ? data.split('-') : data.split('/');

			var year = new Date().getFullYear();

			var month = new Date().getMonth() + 1;

			for (var i = 0; i < this.date.length; i++) {
				if (this.date[i].year == start[0] && this.date[i].month == start[1]) {
					if (year == start[0] && month == start[1] && start[2] < this.nowDay) {
						arr = [i, parseInt(this.nowDay - 1)];
					} else {
						arr = [i, parseInt(start[2] - 1)];
					}
					break;
				}
			}
			return arr;
		},
		//清空
		reset() {
			this.start = [];
			this.end = [];
			this.day = 0;
		},
		//补零操作
		setPull(day){
			if (day < 10) {
				day = '0' + day;
			}
			return day
		},
		//计算天数
		getDay(date1, date2) {
			//获得天数
			//date1：开始日期，date2结束日期
			var a1 = Date.parse(new Date(date1));
			var a2 = Date.parse(new Date(date2));
			var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
			return day;
		},
		//计算周几
		getWeek(date) {
			var weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			var myDate = new Date(Date.parse(date));
			return weekDay[myDate.getDay()];
		},

		//选择入住离开
		selectDay(line, index) {
			if (line == 0 && index + 1 < this.nowDay) return;
			//如果有入住情况和价格则需要进行一些列的判断
			if (this.priceStauts.length > 0) {
				if ((this.start.length == 0 && this.priceStauts[line][index] < 0) || (this.end.length > 0 && this.priceStauts[line][index] < 0)) {
					return uni.showToast({
						title: '该日期已被预订',
						icon: 'none'
					});
				}

				if ((this.start.length > 0 && line < this.start[0]) || (line == this.start[0] && this.start[1] > index)) {
					if (this.priceStauts[line][index] < 0)
						return uni.showToast({
							title: '该日期已被预订',
							icon: 'none'
						});
					this.start = [line, index];
					this.end = [];

					return;
				}

				if (this.start.length > 0 && this.end.length == 0) {
					if (this.start[0] - line == 0) {
						for (var j = this.start[1]; j < index; j++) {
							if (this.priceStauts[line][j] < 0)
								return uni.showToast({
									title: '很抱歉，所选入离店时间包含无房日期',
									icon: 'none',
									mask: true
								});
						}
					} else {
						//如果不在同一个月份有三种情况需要处理
						for (var i = this.start[0]; i <= line; i++) {
							//开始日期到开始日期当月的最大日期是否包含无房情况
							if (i == this.start[0]) {
								for (var j = this.start[1]; j < this.priceStauts[i].length; j++) {
									if (this.priceStauts[i][j] < 0)
										return uni.showToast({
											title: '很抱歉，所选入离店时间包含无房日期',
											icon: 'none',
											mask: true
										});
								}
							} else if (i == line) {
								//结束日期到当月结束日期之前是否包含无房情况
								for (var j = 0; j < index; j++) {
									if (this.priceStauts[i][j] < 0)
										return uni.showToast({
											title: '很抱歉，所选入离店时间包含无房日期',
											icon: 'none',
											mask: true
										});
								}
							} else {
								//中间间隔的月份需要检查每一天是否包含无房情况
								for (var j = 0; j < this.priceStauts[i].length; j++) {
									if (this.priceStauts[i][j] < 0)
										return uni.showToast({
											title: '很抱歉，所选入离店时间包含无房日期',
											icon: 'none',
											mask: true
										});
								}
							}
						}
					}
				}
			}

			//如果没有入住时间
			if (this.start.length == 0) {
				//填充入住时间
				this.start = [line, index];
			} else if (this.start.length > 0 && this.start[0] == line && this.start[1] == index && this.end.length == 0) {
				return;
			} else {
				//如果没有离开时间
				if (this.end.length == 0) {
					//如果有价格和入住离开情况则需要进行判断所选的离店时间时候包含无房日期

					if (line < this.start[0] || (line == this.start[0] && index < this.start[1])) {
						this.end = this.start;
						this.start = [line, index];
					} else {
						//如果离开时间比入住时间晚则填充
						this.end = [line, index];
					}
				} else {
					//如果有离开时间则清空离开时间重新填充入住时间
					this.start = [line, index];
					this.end = [];
				}
			}
		},
		//设置日历
		setDate() {
			//年份
			var year = new Date().getFullYear();

			//月份
			var month = new Date().getMonth();
			for (let i = 0; i < this.count; i++) {
				var day = [];
				var week = 0;
				for (var j = 0; j < new Date(year, month + 1, 0).getDate(); j++) {
					day.push(j + 1);
				}

				this.date.push({
					year: year,
					month: month + 1,
					day: day,
					oneDayWeek: new Date(Date.parse(year + '/' + (month + 1) + '/' + '01')).getDay()
				});
				if (month == 11) {
					year += 1;
					month = 0;
				} else {
					month++;
				}
			}

			return this.date;
		},
		//关闭
		close() {
			uni.navigateBack({
				delta: 1
			});
		},
		//确定入住离店事件提交
		submit() {
			
			var obj = {
				/* startYMD: this.date[this.start[0]].year + this.type + this.date[this.start[0]].month + this.type + this.isFestival(
						this.start[0], this.start[1]),
					startMD: this.date[this.start[0]].month + this.type + this.isFestival(this.start[0], this.start[1]),
					startDay: this.startDay,
					startWeek: this.startWeek,
					endYMD: this.date[this.end[0]].year + this.type + this.date[this.end[0]].month + this.type + this.isFestival(this
						.end[0], this.end[1]),
					emdMD: this.date[this.end[0]].month + this.type + this.type + this.isFestival(this.end[0], this.end[1]),
					endDay: this.endDay,
					endWeek: this.endWeek,
					day: this.day */
				start: this.date[this.start[0]].year + this.type + this.date[this.start[0]].month + this.type + this.isFestival(this.start[0], this.start[1], true),
				end: this.date[this.end[0]].year + this.type + this.date[this.end[0]].month + this.type + this.isFestival(this.end[0], this.end[1], true),
				startDay: this.date[this.start[0]].month + '月' + this.isFestival(this.start[0], this.start[1], true) + '日',

				endDay: this.date[this.end[0]].month + '月' + this.isFestival(this.end[0], this.end[1], true) + '日',
				day: this.day
			};

			/*此处应把需要的数据进行保存,如入住离开日期...添加到vuex然后再进行跳转到上一页
			*不推荐使用本地缓存,下面是缓存的示例
			*/
			uni.setStorageSync('Time',JSON.stringify(obj))
			
			
			//价格清单,应该存入vuex获取缓存中
			if (this.priceStauts.length > 0) {
			
				var price = []
				
				if (this.end[0] - this.start[0] == 0) {
			
					for (var i = this.start[1]; i < this.end[1]; i++) {
						var day = this.date[this.start[0]].year + this.type + this.setPull(this.date[this.start[0]].month) + this.type + this.isFestival(
							this.start[0], i)
						price.push({
							day_str: day,
							price: this.priceStauts[this.start[0]][i]
						})
					}
			
				} else {
					for (var i = this.start[0]; i <= this.end[0]; i++) {
						console.log(i)
						if (i == this.start[0]) {
							for (var j = this.start[1]; j < this.date[i].day.length; j++) {
								var day = this.date[i].year + this.type+ this.setPull(this.date[i].month) + this.type + this.isFestival(
									i, j)
								price.push({
									day_str: day,
									price: this.priceStauts[i][j]
								})
							}
						} else if (i == this.end[0]) {
			
							for (var j = 0; j < this.end[1]; j++) {
								var day = this.date[i].year + this.type + this.setPull(this.date[i].month) + this.type + this.isFestival(
									i, j)
								price.push({
									day_str: day,
									price: this.priceStauts[i][j]
								})
							}
						} else {
							for (var j = 0; j < this.date[i].day.length; j++) {
								var day = this.date[i].year + this.type + this.setPull(this.date[i].month) + this.type +this.isFestival(
									i, j)
								price.push({
									day_str: day,
									price: this.priceStauts[i][j]
								})
							}
						}
					}
				}				
				//加入缓存
				uni.setStorage({
					key:'Price',
					data:JSON.stringify(price)
				})
			}
			
			//跳转到上一页
			 uni.navigateBack({
				delta:1
			}) 
			
		}
	}
};
</script>

<style>
/**确认按钮**/
.submit {
	width: 100%;

	background: white;
	position: fixed;
	bottom: 0upx;
	
	height: auto;
	
}

.sub-btn {
	height:auto;
	border-radius: 10upx;
	background: orange;
	color: white;
	

}

.content {
	z-index: 999;
}

/**不能预订**/

/* 入住离开时间的color */
.bg-orange {
	background-color: #ff9645;
	font-size: 18upx;
}

.bg-higlt-orange {
	background-color: #ffefe3;
}

/* 节假日的日期样式 */
.is-festival {
	font-size: 18upx;
	color: orange;
}

/** 非节假日的日期样式**/
.not-festival {
	font-size: 18upx;
	color: white;
}

/***入住离开时间的日历样式*/

.not-sub {
	color: #222222;
	background: #dddddd;
}

.select-out-item {
	background: #ffffff;
}

.select-style {
	color: white;
	font-size: 20upx;
	padding-top: 4upx;
}

.time-out {
	text-decoration: line-through;
	color: #c0c0c0;
}

/**
	 * 点击日期的样式
	 */
.bg {
	background: orange;
}

/**
	 * 日期部分
	 */
.section {
	width: 100%;
	padding-bottom: 150upx;
	height: auto;
	padding-top: 440upx;
	background-color: #ffffff;
}

.section > .item > .year {
	text-align: center;
	height: 100upx;
	line-height: 100upx;
	font-size: 30upx;
	font-weight: bold;
	/* padding-left:30upx;
		padding-right: 30upx; */
}

.section > .item > .day {
	display: flex;
	flex-wrap: wrap;
	text-align: center;
	margin-left: 5px;
	margin-right: 5px;
}

.section > .item > .day > .day-list {
	margin-top: 30upx;
	margin-bottom: 30upx;
	min-height: 100upx;
	max-height: 180upx;
	display: flex;
	font-size: 28upx;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

/**
	 * 头部固定
	 */
.header {
	position: fixed;
	top: 0;
	width: 100%;
	height: 400upx;
	background: white;
}

.bar {
	width: 100%;
	height: var(--status-bar-height);
	background: #222222;
}

/**
	 * 关闭清空
	 */
.set {
	height: 100upx;
	padding-left: 30upx;
	padding-right: 30upx;

	align-items: center;
	display: flex;
	justify-content: space-between;
}

/**
	 * 入住离开时间
	 */
.in-and-out {
	height: 210upx;
	padding-left: 30upx;
	padding-right: 30upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

/**
	 * 入住离开的view
	 */
.in-and-out > .item {
	display: flex;
	flex-direction: column;
	height: 100upx;
}

/**
	 * 未选择入离时间时的文字样式
	 */
.in-and-out > .text {
	margin-top: 100upx;
	font-weight: bold;
	font-size: 36upx;
	color: #c0c0c0;
}

/**
	 * 一共选择了多少晚的样式
	 */
.in-and-out > .item > .count-border {
	width: 200upx;
	font-size: 28upx;
	height: 40upx;
	margin-top: 48upx;
	text-align: center;
}

.gray {
	color: #c0c0c0;
	border-bottom: 1px solid #c0c0c0;
}

.orange {
	color: orange;
	border-bottom: 1px solid orange;
}

/**
	 * 共多少晚
	 */
.in-and-out > .item > .count-border > .count {
	font-size: 10px;
}

/**
	 * 周一到周日
	 */
.week {
	border-bottom: 1px solid #dcdcdc;
	border-top: 1px solid #dcdcdc;
	height: 70upx;
	display: flex;
	margin-bottom: 20upx;
	justify-content: space-between;
	align-items: center;
	padding-left: 25px;
	padding-right: 25px;
	font-size: 26upx;
	background: white;
}

.isa {
	color: red;
}

.isa2 {
	color: red;
}
</style>
