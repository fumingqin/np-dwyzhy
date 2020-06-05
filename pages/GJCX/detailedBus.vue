<template>
	<view>
		<view class="bgColor"></view>
		<view class="box">
			<view  class="line1" v-for="(item,index) in lineInfo.segments" :key="index">
			<text v-if="item.bus.buslines.length>0">{{item.bus.buslines[0].esayname}}</text>
			<text v-if="lineInfo.segments.length>2&&item.bus.buslines.length>0&&index!==lineInfo.segments.length-1" class="icon jdticon icon-you" style="font-size: 30upx;color: #06B4FD;"></text>
			</view>
			<view  class="line2">
			<text>共{{lineInfo.segments[0].bus.buslines[0].via_num}}站</text>
			<text>{{lineInfo.duration}}  </text>
			<text>{{lineInfo.walking_distance}}</text>
			</view>
			<view  class="line2" v-for="(item,index) in lineInfo.segments" :key="index" v-if="item.bus.buslines.length>0">
			<text v-if="item.bus.buslines.length>0">{{item.bus.buslines[0].esayname}} ></text>
			<text v-if="item.bus.buslines.length>0">{{item.bus.buslines[0].departure_stop.name}} 上车 ></text>
			<text v-if="item.bus.buslines.length>0">{{item.bus.buslines[0].arrival_stop.name}} 下车</text>
			</view>
			
		</view>
		
		<!-- 顶部基本信息 -->
		<view class="box1">
			<view class="text1">方向:   {{selectList[0].startName}}-{{selectList[0].endName}}</view>
			
			<view class="butter">首末时间</view>
			<view class="text2">{{selectList[0].firstLastTime}}</view>
			<view class="butter2">总票价</view>
			<view class="text3">{{lineInfo.cost}}  ></view>
			
		</view>
		<!-- 地图 -->
		
		<view>
		<!-- 嵌套弹窗 -->
		
			<!-- 线路信息 -->
			<view class="box2">
				<!-- 时间信息左 -->
				<view class="area1">
					<view class="text4">
			            <text v-if="carSta!=='等待发车'">预计到达</text>
						</view>
					<view class="text4">
						<text>{{carSta}}</text>
						<text v-if="carSta!=='等待发车'&&carSta!=='即将到站'">站 </text>
						<text v-if="carSta!=='等待发车'">{{arriveTime}}分/</text>
						<text  v-if="carSta!=='等待发车'">{{carDistance}}米</text>
					</view>
			    </view> 
				
				<!-- 时间信息右 -->
				<!-- <view class="area2">
					<view class="text4">
				        <text >预计起点发车</text>
						</view>
					<view class="text4">
						<text>{{departureTime}}</text>
					</view>
				</view> -->
			</view>
		<!-- 横向动态列表 -->
		<view class="box3">
			<scroll-view scroll-x="true" class="scroll-X" >
				<image class="image1" src="../../static/GCJX/detailedBus/star.png"></image> 
				<view style="position: absolute;top: -4px;left: 33px;height: 600upx;padding-top: 29px;">
					<!-- 循环前判断公交方向 -->
					<block v-for="(item,index) in list1" :key="index">
			<!-- 序号	 -->	<text :class="item.stationName==inStation?'num':'num2'">{{index+1}}</text>
			<!-- 站点	 -->    <text :class="item.stationName==inStation?'stationName':'stationName2'" @click="getCarDetaile(item.stationIndex,item.lat,item.lon)">{{item.stationName}}</text>
			<!-- v-for="(item2,index2) in carList" :key="index2" v-if="item2.stationIndex==index+1" -->
			<!-- <view  > -->
			
			<!-- 公交 -->	   <image v-for="(item2,index2) in carList" :key="index2" v-if="item2.stationIndex==index+1" class="image2" src="../../static/GCJX/detailedBus/bus.png"></image>
			<!-- </view> -->
			<!-- 箭头 -->		<image v-if="index!=0&&index!=list1.length" class="arrowHead"  src="../../static/GCJX/detailedBus/arrowHead.png"></image>
			<!-- 绿条 -->		<image style="width: 107upx;height: 14upx;" src="../../static/GCJX/detailedBus/green.png"></image>
			
			<!-- 橙条	 -->	<!-- <image v-if="item.stationStatu==1&&index!=realtimeDynamic.length-1" style="width: 107upx;height: 14upx;" src="../../static/GCJX/detailedBus/orange.png"></image> -->
			<!-- 红条 -->		<!-- <image v-if="item.stationStatu==2&&index!=realtimeDynamic.length-1" style="width: 107upx;height: 14upx;" src="../../static/GCJX/detailedBus/red.png"></image> -->
			<!-- 终点	 -->	<image v-if="index==list1.length-1" class="image3" src="../../static/GCJX/detailedBus/end.png"></image>
				    </block>
					
					</view>
			</scroll-view>
	      </view>
			
			
			
			
			
			</view>
			<!-- 底部操作 -->
			<view class="box4" v-if="lineInfo.segments.length>2">
				<view class="areaLeft" @click="changeLine()">
					<image class="exchange" src="../../static/GCJX/detailedBus/exchange.png"></image>
					<text class="huanxiang">切换{{lineName}}></text>
				</view>
				
			</view>
	</view>
</template>

<script>
	import gjcx from "../../common/Gjcx.js";
	
	export default {
		data() {
			return {
				text:[1,2,3,4,5],
				Encryption: "XMJDTzzbusxmjdt", //接口校验码
				detailLine:'',
				nearStastion:99999,
				
				inStation:'',
				lineInfo:[],
				realtimeDynamic:[],
				realtimeDynamicback:[],
				direction:0,
				list:'',      //线路接口
				list1:[],
				list2:[],
				longitude: "", //精度
				latitude: "", //纬度
				key: [],
				scale: 16,
				mapHeight: '',
				mapWidth:'319px',
				popupStatu:0, //弹窗状态
				carList:[],
				endStation:'',
				starTime:'',
				endTime:'',
				price:'',
				distance:'',
				unit:'',
				departureTime:'',
				nList:[],
				selectList:[],
				inStationIndex:'',
				inStationIndexlon:'',
				inStationIndexlat:'',
				carSta:999,
				carDistance:'',
				lineIndex:1,
				lineIndex2:0,
				lineName:'',
				arriveTime:'',
			}
		},
		onLoad(options) {
			
			
			this.lineInfo=JSON.parse(options.transitsList);
			this.selectList=JSON.parse(options.arr);
			if(this.lineInfo.segments.length>2){
				this.lineName=this.lineInfo.segments[1].bus.buslines[0].esayname;
			}
			
			
			
			//   console.log("接收到的参数是list="+options.nList);//此处打印出来的是字符串，解析如下   
			// console.log(options)
			//   that.nList = JSON.parse(options.nList);//解析得到集合
			// that.busIndex();
			this.lineDetaile();
			this.getCarList();
			if(this.timer){
				clearInterval(this.timer);
			}
			else{
				this.timer =setInterval(()=>{
					
					console.log('ok!!!!');
					this.getCarList();
					this.getCarDetaile(this.inStationIndex,this.inStationIndexlat,this.inStationIndexlon);  //获取最近站点
				},5000);
			}

		},
		onUnload() {
			var that=this;
			clearInterval(that.timer);
		},
		
		onHide() {
			// console.log(this.timer);
			// clearInterval(this.timer);
		},
		onShow() {
			this.getNearstation();
		},
		components: {
			
		},
		methods: {

			//换向 点击后更换接口
			exchange(){
				
				if(this.direction==0){
				this.direction =1;
				this.list=this.realtimeDynamicback
				}
				else{
					this.direction =0;
					this.list=this.realtimeDynamic
				}
			},
			
			getCarList:function(){
				var that=this;
				uni.request({
					url:gjcx.InterfaceAddress[3],
					data:{
						lineID:that.selectList[0].lineID,
						direction:0,
						Encryption:that.Encryption,
					},
					success:function(res){
						that.carList=res.data;
						console.log(JSON.parse(JSON.stringify(res.data)));
					}
				});
			},
			lineDetaile:function(){
				var that=this;
				// console.log(that.selectList[0].lineID);
				uni.request({
					url:gjcx.InterfaceAddress[2],
					data:{
						lineID:that.selectList[0].lineID,
						direction:0,
						Encryption:that.Encryption,
					},
					success:function(res){
						that.list1=res.data;
						
						// console.log(that.list1);
					}
				});
			},
			changeLine:function(){
				var that=this;
				that.lineIndex=that.lineIndex+1;
				// if(that.lineIndex2<that.selectList.length-1){
				// 	that.lineIndex2+=1;
				// 	 that.lineDetaile(that.lineIndex);
				// }
				// else{
				// 	that.lineIndex2=0;
				// 	 that.lineDetaile(that.lineIndex);
				// }
				console.log(that.lineInfo.segments);
				if(that.lineInfo.segments.length-1==that.lineIndex){
					that.lineIndex=0;
				}
				// if(that.lineInfo.segments[that.lineIndex].bus.buslines.length>0){
				that.lineName=that.lineInfo.segments[that.lineIndex].bus.buslines[0].esayname;
				// }
				// that.lineDetaile();
				console.log(that.selectList);
			},
			
			//计算距离公式
			getDistance: function (la1, lo1, la2, lo2) {
				var that=this;
			    var La1 = la1 * Math.PI / 180.0;
			    var La2 = la2 * Math.PI / 180.0;
			    var La3 = La1 - La2;
			    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
			    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
			    s = s * 6378.137;
			    s = Math.round(s * 10000) / 10000;
			    s = s.toFixed(2);
				// if(s>1000){
				// 	s=s/1000+'公里';
				// }
				// else{
				// 	s=s+'米';
				// }
				console.log(s,that.arriveTime);
				that.arriveTime=Math.ceil((s*1000)/400);
			    return s;
			},
			getNearstation:function(){            //获取该线路最近站点
			var that = this;

			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					var s=0;
					var b=0;
					var lat;
					var lon;
					var myLocation=res.longitude +','+res.latitude;
					that.nearStastion=999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
					// console.log(myLocation);
					// console.log(JSON.stringify(that.list1));
					for(let i in that.list1){
						s=that.getDistance(res.latitude,res.longitude,that.list1[i].lat,that.list1[i].lon);
						 console.log(that.nearStastion>s,that.nearStastion>s,s);
						 if(that.nearStastion>s){
							 
							 that.nearStastion=s;
							 that.inStation=that.list1[i].stationName;
							 b=that.list1[i].stationIndex;
							 console.log(b);
							 lat=that.list1[i].lat;
							 lon=that.list1[i].lon;
						 }
					}
					
					// if(that.direction==0){
						// console.log(b,lat,lon);
					that.getCarDetaile(b,lat,lon);
					// console.log(b);
					// }
					// if(that.direction==1){
					// that.getCarDetaile(b-that.list1.length,lat,lon);
					// console.log(b-that.list1.length);
					
					// }
				},
				fail:function(info){
					console.log(info);
				}
			});
				
			},
			
			getCarDetaile:function(stationIndex,lat,lon){
				var that=this;
				console.log(stationIndex,lat,lon);
				var s=0;
				var b=999;
				that.inStationIndex=stationIndex;
				that.inStationIndexlon=that.list1[stationIndex-1].lon;
				that.inStationIndexlat=that.list1[stationIndex-1].lat;
				that.carSta=999;
				// console.log(that.carList.length);
				that.inStation=that.list1[stationIndex-1].stationName;
				// console.log(stationIndex,lat,lon);
				// console.log(JSON.stringify(that.carList));
				if(that.carList.length>0){                                //判断是否有车
				    for(let i in that.carList){
						// console.log(stationIndex,that.carList[i].stationIndex,stationIndex>that.carList[i].stationIndex)
						// if(stationIndex>that.carList[i].stationIndex){
							s=stationIndex-that.carList[i].stationIndex;
							// console.log(that.carList[i].stationIndex);
							if(that.direction==1){
								s=stationIndex-(that.carList[i].stationIndex-that.list1.length);
							}
							if(s<1&&s>0||s==0){
								that.carSta='即将到站';
								that.carDistance=that.getDistance(lat,lon,that.carList[i].lat,that.carList[i].lon)*1000;
								break;
							}
							if(s<that.carSta&&s>0){
								that.carSta=s;
								that.carDistance=that.getDistance(lat,lon,that.carList[i].lat,that.carList[i].lon)*1000;
							}
							if(s<0){
								console.log(that.carSta,stationIndex);
								if(that.carSta<stationIndex){
									break;
								}
								else{
								s=-s;
								that.carSta='已过'+ s;
								break;
								}
							}
						
					}
				}
				else{
					that.carSta='等待发车';
					
				}
				// console.log(that.carSta);
			},
			
			
		}
	}
</script>

<style lang="scss">
	.bgColor{
	    position: fixed;
	    top: 0;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    background: #F3F3F3;
	    z-index: -1;
		
	  }
	  .box{
		  flex-wrap:wrap;
		  width: 664upx;
		  background-color: #ffffff;
		  border-radius: 11rpx;
		  display: flex;
		  margin-left: 32upx;
		  margin-top: 20upx;
		  padding-left: 30upx;
		  .line1{
			flex-wrap:nowrap;
		  	font-size: 32upx;
			color: #06B4FD;
			margin-top: 37upx;
			// margin-left: 30upx;
			margin-bottom: 33upx;
		  }
		  .line2{
			 
		  	 width: 660upx;
		  	font-size:30upx;
		  	
		  	margin-bottom: 30upx;
			
		  	font-weight:300;
		  	color:#333333;
		  	
		  	
		  }
		  .line3{
		  	flex-wrap:nowrap;
		  	 width: 660upx;
		  	font-size:30upx;
		  	// margin-left: 30upx;
		  	margin-bottom: 30upx;
		  	
		  	font-weight:300;
		  	color:#333333;
		  	display: flex;
		  	margin-right: 20upx;
		  }
	  }
  .box1{
	  width: 690rpx;
	  background-color: #ffffff;
	  border-radius: 11rpx;
	  display: flex;
	  margin-left: 32upx;
	  margin-top: 20upx;
	  flex-wrap: wrap;
	.text1{
		  font-size: 32upx;
		  margin-left: 33upx;
		  margin-top: 38upx;
		  width: 690rpx;
	  }
	  .butter {
	  	width: 136upx;
	  	height: 48upx;
        margin-left: 32upx;
		margin-top: 32upx;
	  	background-color: #01b5fd;
	  	color: #FFFFFF;
	  	font-size: 26upx;
	  	text-align: center;
	  	line-height: 50upx;
		border-radius: 10upx;
		margin-bottom: 41upx;
	  }
	  .butter2 {
		  margin-left: 73upx;
		  margin-top: 32upx;
		  flex-wrap: nowrap;
	  	width: 136upx;
	  	height: 48upx;
	  	background-color: #01b5fd;
	  	color: #FFFFFF;
	  	font-size: 26upx;
	  	text-align: center;
	  	line-height: 50upx;
	  		border-radius: 10upx;
			margin-bottom: 41upx;
	  }
	  .text2{
		  font-size: 30upx;
		  margin-top: 37upx;
		margin-left: 20upx;
	  }
	  .text3{
	  	  margin-left: 20upx;
	  	  font-size: 30upx;
		  margin-top: 37upx;
	  }
  }
  .box2{
  	width: 690rpx;
  	background-color: #ffffff;
  	border-radius: 11rpx;
    display: flex;
	margin-left: 32upx;
	margin-top: 20upx;
	text-align: center;
       .area1{
		   text-align: center;
		   padding-top: 20upx;
		   // margin-left: 88upx;
		   padding-bottom: 41upx;
		   width: 690rpx;
		.text4{
			color: #FF7D43;
			font-size: 30upx;
			padding-top: 22upx;
			padding-right: 40upx;
		}
		}
       .area2{
       		   text-align: center;
       		   padding-top: 20upx;
       		   // margin-left: 121upx;
       		   padding-bottom: 41upx;
			   padding-right: 83upx;
       		.text4{
       			color: #FF7D43;
       			font-size: 30upx;
       			padding-top: 22upx;
       		}
       		}

	}
	.box3{
		width: 690rpx;
		height: 600upx;
		background-color: #ffffff;
		margin-left: 32upx;
		border-radius: 11rpx;
		margin-top: 20upx;
		margin-left: 32upx;
		margin-bottom: 20upx;
		// position: fixed;
		// top: 300upx;
		// z-index: 998;
		.scroll-X{
			white-space: nowrap;
			height: 600upx;
			width: 690rpx;
			position: absolute;
			.image1{
				position: relative;
				width: 36upx;
				height: 36upx;
				padding-left: 43upx;
				padding-top: 76upx;
				z-index: 999;
			}
			.image3{
				position: absolute;
				width: 36upx;
				height: 36upx;
                left:100%;
				padding-top: 18upx;
			}
			.image2{
				height: 27upx;
				width: 54upx;
				position: absolute;
				top: 60upx;
				transform:translateX(-40%);//水平左移
			}
			.arrowHead{
				height: 16upx;
				width: 14upx;
				position: absolute;
				top: 91upx;
				z-index: 998;
			}
			.stationName{
				width: 20px;
				color: #FF7D43;
				white-space: pre-wrap;
				word-wrap: break-word;
				font-size: 28upx;
				position: absolute;
				top: 90px;
				transform:translateX(-25%);
			}
			.stationName2{
				width: 20px;
				
				white-space: pre-wrap;
				word-wrap: break-word;
				font-size: 28upx;
				position: absolute;
				top: 90px;
				transform:translateX(-25%);
			}
			.num{
				color: #FF7D43;
				height: 16upx;
				width: 14upx;
				position: absolute;
				top: 130upx;
				font-size: 28upx;
				transform:translateX(-40%);
			}
			.num2{
				height: 16upx;
				width: 14upx;
				position: absolute;
				top: 130upx;
				font-size: 28upx;
				transform:translateX(-40%);
			}
		}
	}
	.box4{
		
		width: 690rpx;
		height: 110upx;
		background-color: #ffffff;
		margin-left: 32upx;
		border-radius: 11rpx;
		text-align: center;
		margin-bottom: 43upx;
		// padding-top: 32rpx;
        line-height: 97upx;

			.exchange{
				width: 37upx;
				height: 28upx;
			}
			.huanxiang{
				font-size: 36upx;
				
				}
	}
</style>
