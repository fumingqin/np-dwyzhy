<template>
	<view v-if="ShowPage">
		<view class="bgColor"></view>
		<view class="box1">
			<view class="searchBoxRadius2">
				<image class="searchImage2" src="../../static/GCJX/busIndex/green.png" />
				<text class="text1">{{initialPoint}}</text>
			</view>
			<view class="searchBoxRadius2">
				<image class="searchImage2" src="../../static/GCJX/busIndex/red.png" />
				<text class="text1">{{destination}}</text>
			</view>
		</view>
		<view v-for="(item,index) in transitsList" :key="index" >
		<view class="box2" @click="goSelect(index)">
			<view>
				<view class="area1">
				<text style="margin-right: 50upx;">总时长:{{item.duration}}</text>
				<text style="margin-right: 50upx;">步行  {{item.walking_distance}}</text>
				<text>票价  {{item.cost}}</text>
				</view>
				<view class="area2" >
				<view v-for="(item2,index2) in item.segments" :key="index2" >
					<text v-if="item2.bus.buslines.length>0">{{item2.bus.buslines[0].esayname}}</text>
					<text v-if="item2.bus.buslines.length>0" class="icon jdticon icon-you" style="font-size: 30upx;"></text>
				</view>
				</view>
				<view class="area3">
					<text style="margin-right: 10upx;">共{{item.routenum}}站  </text>
					<text>{{item.routeStation}}上车</text>
					<!-- <text>{{item.zhida}}</text> -->
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import amapFile from '../../components/HOME/uni-location/amap/amap-wx.js';
	import gjcx from "../../common/Gjcx.js";
	export default {
		data() {
			return {
				key: "134acca8871d797b16a9a6a0a873bab5",//申请的高德地图key（申请的web key） 
				allTime:'',            //总时长
				transitsList:[],       //乘车列表
				routenum:0,            //乘车站数
				startLonLat:'',        //起点经纬度
				endLonLat:'',          //终点经纬度
				initialPoint:'',       //起点位置
				destination:'',        //终点位置
				routeStation:'',       //乘车站点
				zhida:false,           //是否直达
				city:'',               //所在城市
				ShowPage:false,
				lineList:[],
				isline:false,
				arr:[],
				dataSource:[],
				Encryption: "XMJDTzzbusxmjdt",
			}
		},
		onLoad(options) {
			this.startLonLat=options.startLonLat;
			this.endLonLat=options.endLonLat;
			console.log(this.startLonLat);
			console.log(this.endLonLat);
			this.initialPoint=options.initialPoint;
			this.destination=options.destination;
			this.city=options.city;
			this.getAllLine();
			this.getpages();
			
			// this.isLine();
			
		},
		methods: {
			// that.$set(that.transitsList[i], 'routenum', that.transitsList[i].segments[0].bus.buslines[0].via_num);
			getAllLine:function(){
				var that=this;
				uni.request({
					url: gjcx.InterfaceAddress[7],      //获取所有线路
					// method:'POST',
					header:{'content-type':'application/x-www-form-urlencoded'},
					data: {
						Encryption: that.Encryption,
					},
					success:function(res){
						// console.log(res.data);
						for(var i=0;i<res.data.length;i++){
							var obj={
								lineID:res.data[i].lineID,
								name:res.data[i].lineName,
								lineDirection:res.data[i].lineDirection,
								endName:res.data[i].endName,
								startName:res.data[i].startName,
								firstLastTime:res.data[i].firstLastTime,
							};
							that.dataSource.push(obj)
						}
						that.dataSource= that.unique(that.dataSource);
					},
					fail:function(info){
						console.log(info)
					}
				})
			},
			unique(arr){
				const res = new Map();  //定义常量 res,值为一个Map对象实例
				　　//返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
				　　return arr.filter((arr) => !res.has(arr.lineID) && res.set(arr.lineID, 1)) 
			},
			getpages:function(){
							 var that=this;
							 uni.showLoading({
							     title: '加载中'
							 });
								 
							 // console.log(that.startLonLat,that.endLonLat);
							var myAmapFun = new amapFile.AMapWX({
												  key: '134acca8871d797b16a9a6a0a873bab5',
												  });
							// console.log(myAmapFun);
							myAmapFun.getTransitRoute({
								origin:that.startLonLat,            //             '118.04483,27.776371',           
								      destination:that.endLonLat,        //         '117.988495,27.610365',            
								      city: that.city,
									  timeout:5000,
									  extensions:'all',
									  // origin: '116.481028,39.989643'
									  //       destination: '116.434446,39.90816',
									  //       city: '北京',
									  // strategy:'5',
									  
							  success:(data) =>{
								 console.log('等待中');
								console.log(data);
								// console.log(test);
								that.transitsList=data.transits;
								if(that.transitsList.length>0){
									that.isline=true;
									uni.hideLoading();
								}
									 // if(that.transitsList.length==0){
									 // 	uni.showToast({
									 // 			title:'抱歉！未匹配到线路方案',
									 // 			icon:'none',
										// 		duration:6000
									 // 			});
										// 	that.timer =setTimeout(()=>{
										// 		uni.navigateBack({
										// 			delta:1
										// 		})
										// 		},5000);
									 // };
								if(data.distance>50000){
									uni.showToast({
										 			title:'两点距离过远，无法匹配线路',
										 			icon:'none',
													duration:6000
										 			});
												that.timer =setTimeout(()=>{
													uni.navigateBack({
														delta:1
													})
													},5000);
													that.ShowPage=false;
													
								};
								if(data.distance<=100){
									uni.showToast({
										 			title:'两点距离过近，无法匹配线路',
										 			icon:'none',
													duration:3000
										 			});
												that.timer =setTimeout(()=>{
													uni.navigateBack({
														delta:1
													})
													},4000);
													that.ShowPage=false;
													
								};								//数值转换
								for(let i in that.transitsList){
									if(that.transitsList[i].duration>60&&that.transitsList[i].duration<3600){
									that.transitsList[i].duration=Math.ceil(that.transitsList[i].duration/60)+'分';
									}
									if(that.transitsList[i].duration>=3600){
										that.transitsList[i].duration=Math.ceil(that.transitsList[i].duration/3600)+'时'+Math.ceil(that.transitsList[i].duration%3600/60)+'分'
									}
									if(that.transitsList[i].walking_distance>1000){
										that.transitsList[i].walking_distance=that.transitsList[i].walking_distance/1000+'公里';
									}
									else{
										that.transitsList[i].walking_distance=that.transitsList[i].walking_distance+'米';
									}
								
									that.$set(that.transitsList[i], 'routenum', that.transitsList[i].segments[0].bus.buslines[0].via_num);
									that.$set(that.transitsList[i], 'routeStation', that.transitsList[i].segments[0].bus.buslines[0].departure_stop.name);
									// that.$set(that.transitsList[i], 'zhida', that.zhida);
									//判断是否直达
									// if(that.transitsList[i].segments[1].bus.buslines[0].length==0){
									// 	that.zhida=true;
									// 	that.$set(that.transitsList[i], 'zhida', that.zhida);
									// }
									// 高德给的线路数据有起始站，用正则表达转换
									for(let j in that.transitsList[i].segments){
										if(that.transitsList[i].segments[j].bus.buslines.length>0){
										var esayname =that.transitsList[i].segments[j].bus.buslines[0].name;
										var regObj1 = new RegExp("^([^\\(]*)\\(.*$");
										esayname = esayname.replace(regObj1, '$1'); 
										// that.arr.push(esayname);
										// console.log(that.arr);
										// for (let k = 0; k < that.dataSource.length; k++) {
										// 	if (that.dataSource[k].name.indexOf(esayname) !== -1) {
										// 		that.arr.push(that.dataSource[k]);
										// 		console.log(that.arr);
										// 	}
										// }
										that.$set(that.transitsList[i].segments[j].bus.buslines[0],'esayname',esayname)
										// console.log(that.transitsList[i].segments[j].bus.buslines[0].name);
										console.log(that.transitsList[i].segments[j].bus.buslines[0].esayname);
										}
										
									}
								}
								that.ShowPage=true;
							  },
							  
							  fail:(res)=>{
													console.log(res)
												}
							});	
							var timer1=setTimeout(function () {
															 if(that.transitsList.length>0){
							                                 uni.hideLoading();
															 clearTimeout(timer1);
															 }
															 if(!that.isline){								 
							        // that.requestTask.abort();
																 console.log('无结果');
																 uni.hideLoading();
																 uni.showToast({
																 	 			title:'抱歉，未匹配到线路方案',
																 	 			icon:'none',
																 				duration:5000
																 	 			});
																 			var timer2 =setTimeout(function(){
																				uni.navigateBack({
																					delta:1
																				})
																			},5000);
																 	 	
																 // uni.hideLoading();
																 clearTimeout(timer1);
																 // clearTimeout(timer2);
															 }
							}, 5000);
							
			},
			//跳转线路详情
			goSelect:function(i){
				var that=this;
				var transitsList=that.transitsList[i];
				that.arr=[];
				//获取线路并判断是否为南平内线路
				for(let j in that.transitsList[i].segments){
					if(that.transitsList[i].segments[j].bus.buslines.length>0){
					
					// that.arr.push(that.transitsList[i].segments[j].bus.buslines[0].esayname);
					// console.log(that.arr);
					for (let k = 0; k < that.dataSource.length; k++) {
						if (that.dataSource[k].name.indexOf(that.transitsList[i].segments[j].bus.buslines[0].esayname) !== -1) {
							that.arr.push(that.dataSource[k]);
							// console.log(that.arr);
						}
					}
					}
				}
				// if(that.city!=='南平市'){
				if(that.arr.length==0){
					uni.showToast({
						duration:3000,
						title:'抱歉！目前仅支持查看南平地区',
						icon:'none',
					})
				}
				else{
					// console.log(transitsList);
					uni.navigateTo({url:'detailedBus?transitsList='+JSON.stringify(transitsList)+'&arr='+JSON.stringify(that.arr)});
				}
				
			}
		}
	}
</script>

<style lang="scss">
.bgColor {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #F3F3F3;
		z-index: -1;
	}
	.box1{
		width: 670rpx;
		background-color: #ffffff;
		padding-left: 20upx;
		margin-left: 32upx;
		border-radius: 11rpx;
		margin-bottom: 27upx;
		margin-top: 20upx;
		height: 180upx;
		
		.searchBoxRadius2 {
			// right: -157upx;
			width: 83%;
			height: 74upx;
			background-color: #fff;
			display: flex;
			position: relative;
			background: #ffffff;
		
			.searchImage2 {
				padding-left: 16upx;
				padding-top: 38upx;
				width: 50upx;
				height: 48upx;
				transform: scale(0.5);
			}
		.text1{
			font-size: 34upx;
			font-weight: bold;
			padding-top: 25upx;
		}
		// .text2{
		// 	font-size: 34upx;
		// 	font-weight: bold;
		// 	padding-top: 20upx;
		// }
		}
	}
	.box2{
		width: 670rpx;
		background-color: #ffffff;
		padding-left: 20upx;
		margin-left: 32upx;
		border-radius: 11rpx;
		margin-bottom: 25upx;
		margin-top: 20upx;
		.area1{
			font-weight: bolder;
			font-size: 32upx;
			padding-top: 40rpx;
			margin-bottom: 23upx;
		}
		.area2{
			font-weight: 500;
			font-size: 32upx;
			color: #06B4FD;
			margin-bottom: 23upx;
			display: flex;
			
		}
		.area3{
			font-size: 30upx;
			color: #333333;
			font-weight: lighter;
			padding-bottom: 39upx;
		}
	}
</style>
