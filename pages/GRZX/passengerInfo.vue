<template>
	<view class="content">	
		<view class="passengerList">
			<view class="boxClass" v-if="submitType == 1 || submitType == 2" v-for="(item, index) in passengerList" :key="index" @click="choosePassenger(item)">  <!--非个人中心页面进入 -->
				<view class="nameClass">{{item.userName}}</view>
				<view class="sexClass" name="userSex">{{item.userSex}}</view>
				<view class="typeClass">{{item.userType}}</view>
				<view class="codeClass fontStyle">身份证</view>
				<view class="codeNumClass fontStyle">{{item.userCodeNum}}</view>
				<view class="phoneClass fontStyle">联系电话</view>
				<view class="phoneNumClass fontStyle">{{item.userPhoneNum}}</view>
				<view>
					<image v-if="item.hiddenIndex == 1"  class="checkClass" src="../../static/GRZX/checked.png"></image>
				</view>
				<view class="redBox">
					<text v-if="item.userDefault=='true'" class="fontClass" style="width: 80upx;">本人</text>
					<text v-if="item.userEmergencyContact=='true'" class="fontClass" style="width: 80upx;">联系人</text>
					<text v-if="item.auditState==1" class="fontClass" style="width: 80upx;">待审核</text>
					<text v-if="item.auditState==2" class="fontClass" style="width: 100upx;">审核通过</text>
					<text v-if="item.auditState==3" class="fontClass" style="width: 120upx;">审核未通过</text>	
				</view>
			</view>
			<view class="boxClass" v-if="submitType == 0" v-for="(item, index) in passengerList" :key="index" @click="editPassenger(item)">  <!--个人中心页面进入 -->
				<view class="nameClass">{{item.userName}}</view>
				<view class="sexClass">{{item.userSex}}</view>
				<view class="typeClass">{{item.userType}}</view>
				<view class="codeClass fontStyle">身份证</view>
				<view class="codeNumClass fontStyle">{{item.userCodeNum}}</view>
				<view class="phoneClass fontStyle">联系电话</view>
				<view class="phoneNumClass fontStyle">{{item.userPhoneNum}}</view>
				<image src="../../static/GRZX/btnRight.png" class="btnRight"></image>
				<view class="redBox">
					<text v-if="item.userDefault=='true'" class="fontClass" style="width: 80upx;">本人</text>
					<text v-if="item.userEmergencyContact=='true'" class="fontClass" style="width: 80upx;">联系人</text>
					<text v-if="item.auditState==1" class="fontClass" style="width: 80upx;">待审核</text>
					<text v-if="item.auditState==2" class="fontClass" style="width: 100upx;">审核通过</text>
					<text v-if="item.auditState==3" class="fontClass" style="width: 120upx;">审核未通过</text>	
				</view>
			</view>
		</view>	
		<view v-if="submitType == 1 || submitType == 2" class="btnBox">  <!--非个人中心页面进入 -->
			<button @click="addPassenger" class="btnAdd1">+添加乘客</button>
			<button type="primary" @click="definite" class="btnDefinite">确定</button>
		</view>
		<view v-if="submitType == 0" class="btnBox">  <!--个人中心页面进入-->
			<button @click="addPassenger" class="btnAdd2">+添加乘客</button>
		</view>	
		<view class="returnBox" @click="returnPages">
			<image class="returnClass" src="../../static/GRZX/btnReturn.png"></image>
			<view class="titleClass">返回</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				limt:'',
				passengerList:[],
				submitType:1,
			}
		},
		onLoad(options){
			//传参
			//submitType参数为1,为旅游进入
			//submitType参数为2,为出租车进入
			//submitType参数为3,为传统客运进入
			//limitNum参数为你限制添加乘车人的数量（大于等于1）
			this.submitType=options.submitType;
			this.limit=options.limitNum;
			uni.getStorage({
				key:'userInfo',
				fail() {
					uni.showToast({
						icon:'none',
						title:'暂未登录,请登录后查看'
					})
					setTimeout(function(){
						uni.navigateTo({	
							//loginType=1,泉运登录界面
							//loginType=2,今点通登录界面
							//loginType=3,武夷股份登录界面
							url  : '/pages/GRZX/userLogin?loginType=4'
						}) 
					},500);
				}
			})
		},
		onShow() {
			this.loadData();
		},
		methods:{
			async loadData(){
				var that=this;
				var array=[];
				var list=[];
				uni.getStorage({
					key:"passengerList",
					success(res2) {
						console.log("6666")
						for(var j=0;j<res2.data.length;j++){
							list.push(res2.data[j].userID);
						}
					}
				})
				console.log(list,"list")
				uni.getStorage({
					key:'userInfo',
					success(res){
						uni.request({
							url:'http://218.67.107.93:9210/api/app/userInfoList?id='+res.data.unid,
							method:'POST',
							success(res1) {
								console.log(res1,'111')
								for(var i=0;i<res1.data.data.length;i++){
									var data1=res1.data.data[i];
									//console.log(data1,"data1")
									data1.hiddenIndex=0;
									for(var q=0;q<list.length;q++){
										if(data1.userID==list[q]){
											data1.hiddenIndex=1;
										}
									}
									array.push(data1);
								}
								var defaultList=[];
								for(var n=0;n<array.length;n++){
									if(array[n].hiddenIndex==1){
										defaultList.unshift(array[n]);
									}else{
										defaultList.push(array[n]);
									}
								}
								that.passengerList=defaultList;
							}
						})
					}
				})
			},
			addPassenger(){
				uni.getStorage({
					key:'userInfo',
					success() {
						uni.navigateTo({
							url:'/pages/GRZX/addPassenger?type=ad'
						})
					},
					fail() {
						uni.showToast({
							icon:'none',
							title:'暂未登录,无法添加乘客'
						})
					}
				})
				
			},
			returnPages(){
				uni.navigateBack();
			},
			editPassenger(e){   //编辑乘车人信息
				uni.setStorage({
					key:'editPassenger',
					data:e
				})
				uni.navigateTo({
					url:'/pages/GRZX/addPassenger?type=edit'
				})
			},
			choosePassenger(e){  //选择乘车人
				//console.log(e,"....00000")
				var list=this.passengerList;
				var count=0;
				for(var i=0;i<list.length;i++){
					if(list[i].hiddenIndex==1){
						count++;
					}
				}
				if(e.auditState==2||e.userType=="儿童"||e.userType=="成人"||e.userType=="老人"){
					if(e.hiddenIndex==1){
						e.hiddenIndex=0;
					}else if(count>(this.limit-1) && this.submitType==2){
						uni.showToast({
							title: '乘客最多只能添加'+this.limit+'名',
							icon:"none"
						});
					}else{
						e.hiddenIndex=1;
					}		
				}else{
					uni.showToast({
						title: '该审核未通过或待审核，无法选用',
						icon:"none"
					});
				}
			},
			definite(){ //提交array
				var data=this.passengerList;
				var array=[];
				for(var i=0;i<data.length;i++){
					if(data[i].hiddenIndex==1){
						array.push(data[i]);
					}
				}
				if(array.length==0){
					uni.showToast({
						title: '请选择乘客',
						icon:"none"
					})
				}else{
					uni.setStorage({
						key:"passengerList",
						data:array
					})
					uni.navigateBack();	
				}			
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F6F8FC;
	}
	.content {
		width: 100%;
	}
	.checkClass{	//勾选
		position: absolute;
		left: 89.26%;
		top:90upx;
		width: 45upx;
		height:46upx ;
	}
	.returnClass{ //返回按钮
		width: 22upx;
		/* #ifdef H5 */
		margin-top: 30upx;
		/* #endif */
		/* #ifndef H5 */
		margin-top: 103upx;
		/* #endif */
		height: 40upx;
		margin-left: 3.47%;
	}
	.btnRight{ //进入编辑的箭头
		width:60upx;
		height: 60upx; 
		position: absolute;
		left: 90%;
		top:80upx;
	}
	.titleClass{
		margin-left: 20upx;
		font-size: 38upx;
		/*font-weight: bold; */
		/* #ifdef H5 */
		margin-top: 20upx;
		/* #endif */
		/* #ifndef H5 */
		margin-top: 95upx;
		/* #endif */
	}
	.passengerList{ //列表样式
		width: 100%;
		/* #ifdef H5 */
		margin-top: 110upx;
		margin-bottom: 30upx;
		padding-bottom: 160upx;
		/* #endif */
		/* #ifndef H5 */
		margin-top: 180upx;
		margin-bottom: 160upx;
		/* #endif */
	}
	.btnAdd1{
		border-radius: 12upx;
		width: 45%;
		height: 90upx;
		line-height: 90upx;
		margin-top: 30upx;
		background-color: #007AFF;
		color: #FFFFFF;
	}
	.btnDefinite{
		border-radius: 12upx;
		width: 45%;
		height: 90upx;
		line-height: 90upx;
		margin-top: 30upx;
	}
	.btnAdd2{ //添加按钮
		width: 92%;
		height: 90upx;
		line-height: 90upx;
		border-radius: 12upx;
		background-color: #007AFF;
		color: #FFFFFF;
		margin-top: 30upx;
	}
	.boxClass{
		background-color: #FFFFFF;
		width: 94%;
		margin-top: 20upx;
		margin-left: 3%;
		height: 230upx;
		font-size:28upx;
		color: #666666;
		position: relative;
		border-radius:20upx ;
	}
	.nameClass{
		font-size: 36upx;
		color: #2C2D2D;
		position: absolute;
		left: 4%;
		top:30upx;
		font-weight: bold;
	}
	.sexClass{
		position: absolute;
		left: 25%;
		top:47upx;
		font-size: 24upx;
		color: #2C2D2D;
	}
	.fontStyle{
		color: #666666;
		font-size: 27upx;
	}
	.typeClass{
		font-size: 24upx;
		color: #2C2D2D;
		position: absolute;
		left: 33%;
		top:47upx;
	}
	.codeClass{
		position: absolute;
		left: 4%;
		top:108upx;
	}
	.codeNumClass{
		position: absolute;
		left: 25%;
		top:108upx;
	}
	.phoneClass{
		position: absolute;
		left: 4%;
		top:163upx;
	}
	.phoneNumClass{
		position: absolute;
		left: 25%;
		top:163upx;
	}
	.returnBox{
		width: 100%;
		height: 160upx;
		position: fixed;
		top: 0upx;
		display: flex;
		flex-direction: row;
		background-color: #F6F8FC;
		z-index: 9999;
	}
	.btnBox{ //按钮位置样式
		position: fixed;
		display: flex;
		flex-direction: row;
		bottom: 0upx;
		width: 100%;
		height: 158upx;
		background-color: #F6F8FC;
		/* border: 1px solid #4CD964; */
	}
	.redBox{
		position: absolute;
		left:40%;
		top: 34upx;
		display: flex;
	}
	.fontClass{ //本人,紧急联系人,待审核,审核通过,审核未通过
		height: 40upx;
		line-height: 40upx;
		font-size: 24upx;
		color: #007AFF;
		margin-left: 20upx;
		border: 1upx solid #007AFF;
		border-radius: 10upx;
		text-align: center;
	}
</style>
