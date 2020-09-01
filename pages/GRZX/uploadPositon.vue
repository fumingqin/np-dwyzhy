<template>
	<view class="content">
		<view class="topClass">
			<text class="textClass">描述：</text>
			<textarea v-model="reason" placeholder="请填写上传定位的原因" maxlength="300" class="textareaClass" @input="inputChange" />
			<view class="textLength">
				{{textLength}}/300字
			</view>
		</view>
		<view class="boxClass">
			<text class="textClass">紧急联系人</text>
			<input class="inputClass" v-model="emergency" placeholder="紧急联系人手机号(选填)" maxlength="11" type="number"/>
		</view>
		
		<text class="fontStyle" @click="upLoadPosition">确定上传</text>
	</view>
</template>

<script>
export default{
	data(){
		return{
			textLength:0,  //描述的长度
			reason:'',		//上传定位的原因	
			emergency:'',	//紧急联系人
			
			latitude:'',	//纬度
			longitude:'',	//经度
			unid:'',		//用户id
			phoneNumber:'',	//电话号码
		}
	},
	onLoad() {
		uni.getStorage({
			key:'userInfo',
			success:res=>{
				if(res.data.unid != "" && res.data.unid != ""){
					this.unid = res.data.unid;
					this.phoneNumber = res.data.phoneNumber;
				}
				this.getLocation();
			},
			fail: () => {
				uni.showToast({
					title: '当前暂未登录，请先登录'
				});
			}
		})
	},
	methods:{
		//------------------------------统计字数------------------------------
		inputChange(e){
			this.textLength=e.detail.cursor; 
		},
		
		//------------------------------获得当前位置------------------------------
		getLocation(){
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					console.log(res.latitude);
					console.log(res.longitude);
					this.latitude = res.latitude;
					this.longitude = res.longitude;
				},
				fail: () => {
					uni.showToast({
						title: '获取当前位置失败',
						icon:'none',
					});
				},
			});
		},
		
		//------------------------------上传定位------------------------------
		upLoadPosition(){
			if(this.unid == "" || this.phoneNumber == ""){
				uni.showToast({
					title: '当前登录异常或未登录',
					icon:'none',
				});
			}else if(this.latitude == "" || this.longitude == ""){
				uni.showToast({
					title: '获取当前位置失败',
					icon:'none',
				});
			}else if(this.reason == ""){
				uni.showToast({
					title: '请填写上传定位的原因',
					icon:'none',
				});
			}else{
				uni.request({
					url: this.$Grzx.Interface.setAppLocation.url + "?passengerId="
					+ this.unid + "&longitude=" + this.longitude + "&latitude=" 
					+ this.latitude + "&phoneNumber=" + this.phoneNumber 
					+ "&contactNumber=" + this.emergency +"&locationExplain=" + this.reason,
					method: this.$Grzx.Interface.setAppLocation.method,
					success: res => {
						console.log(res);
						if(res.statusCode==200 && res.data=="上传定位成功。"){
							uni.showToast({
								title: res.data,
							});
							setTimeout(function(){
								uni.navigateBack();
							},300)
						}else{
							uni.showToast({
								title: res.data,
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络连接失败',
							icon:'none',
						});
					},
				});
			}
		},
	}
}
</script>

<style lang="scss">
	page{
		background-color: #f6f6f6;
	}
	.content{
		
	}
	.topClass{
		background-color: #ffffff;
		width: 90%;
		border-radius: 20upx;
		margin-left: 5%;
		margin-top: 20upx;
		display: flex;
		flex-direction: column;
		.textClass{
			margin-left: 5%;
			margin-top: 20upx;
		}
		.textareaClass{
			margin-left: 5%;
			width: 90%;
			margin-top: 10upx;
			height: 300upx;
			color: #333333;
		}
		.textLength{
			font-size: 28upx;
			color: #333333;
			margin-left: 78%;
			padding:20upx 0;
		}
	}
	.boxClass{
		width: 90%;
		margin-left: 5%;
		margin-top: 20upx;
		border-radius: 20upx;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		.textClass{
			margin-left: 5%;
			padding: 30upx 0;
		}
		.inputClass{
			margin-left: 14%;
			margin-top: 27upx;
			text-align: right;
		}
	}
	
	.fontStyle{
		padding: 30upx 0;
		width: 90%;
		bottom: 20upx;
		left: 5%;
		position: fixed;
		text-align: center;
		background-color: #007AFF;
		color: #FFFFFF;
		border-radius: 20upx;
	}
</style>
