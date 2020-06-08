<template>
	<view class="Cr_background">
		<form @submit="formSubmit" >
			<image class="bg" :src="backImg||'/static/GRZX/banner3.jpg'" mode="aspectFill" name="backImg"></image>
			<image class="tx" :src="portrait||'/static/GRZX/missing-face.png'" name="portrait" @click="getPhoto"></image>
			<button class="xgbg"  plain="" @click="reviseBackground">修改背景</button>
			<view class="Cr_slk1">
				<text class="bz">姓&nbsp;名：</text>
				<input class="slk"  name="nickname"  placeholder="请输入" v-model="nickname" adjust-position="" />
			</view>
			<view class="Cr_slk2">
				<text class="bz">性&nbsp;别：</text>
				<!-- <picker @change="selectorChange" mode = "selector" :range="aim" name="aim" :value="user.aim"> -->
				<picker class="slk1" name="gender"  mode="selector" @change="genderChange" :range="genderSex" :value="gender">
					{{selector}}
				</picker>
			</view>
			<view class="Cr_slk2"> 
				<text class="bz">生&nbsp;日：</text>
				<picker class="slk1" name="birthday"  mode="date" @change="dateChange" v-model="birthday"  :start="startDate" :end="endDate" placeholder="请选择"  >
					{{birthday}}
				</picker>
			</view>
			<view class="Cr_slk2">
				<text class="bz">地&nbsp;址：</text>
				<input class="slk" name="address"  disabled="disabled" @tap="toggleTab"  placeholder="你的常住地" v-model="address" />
				<w-picker
					mode="region"
					:areaCode="['35', '3507', '350782']"
					:hideArea="false"
					@confirm="onConfirm" 
					ref="region"
					:timeout="true"
				></w-picker>
			</view>
		<!-- 	<view class="Cr_slk2">
				<text class="bz">签&nbsp;名：</text>
				<input class="slk" name="autograph" placeholder="你想要说的话"  v-model="autograph" />
			</view> -->
			<button class="an" type="primary" form-type="submit">保存</button>
			
		</form>
	</view>
	 
</template>
<script>
	import { pathToBase64, base64ToPath } from '../../components/GRZX/js_sdk/gsq-image-tools/image-tools/index.js';
	import wPicker from "@/components/GRZX/w-picker/w-picker.vue";
	export default {
		data() {
			return {
				mode:"region",
				genderSex:['','男','女'], 
				selector:'请选择',
				/* 载入数据 */
				portrait : '',
				backImg:'',
				nickname : '',
				gender:'',
				birthday : '请选择',
				address : '',
				//autograph : '',
				phoneNumber:'',
				unid:'',
				openId_qq:'',
				openId_wx:'',
				username:'',
				port:'',
			};
		},
		onLoad:function(){
			this.loadUserInfo();
			
		},
		computed:{
			
			startDate() {
			            return this.getDate('start');
			        }, 
			endDate() {
			            return this.getDate('end');
			        }
		},
		components:{
		     wPicker
		},
		methods:{
			loadUserInfo(){
				uni.showLoading({
					title:'加载中...'
				})
				var theself=this;
				uni.getStorage({
					key:'backUrl',
					success:function(res){
						theself.backImg=res.data;
					}
				})
				uni.getStorage({
					key:'userInfo',
					success(res){
						uni.request({
							// url:'http://218.67.107.93:9210/api/app/login?phoneNumber='+res.data.phoneNumber,
							url:theself.$Grzx.Interface.url+'?phoneNumber='+res.data.phoneNumber,
							method:"POST",
							success(res1) {
								console.log(res1,'res1')
								var base64=res1.data.data.portrait;
								theself.port=res1.data.data.portrait;
								if(base64!=""&&base64!=null&&theself.isBase64(base64)){
									base64ToPath(base64)
									  .then(path => {
										theself.portrait=path;
									  })
									  .catch(error => {
										console.error(error)
									  })	
								}else{
									theself.portrait=base64;
								}
								if(res1.data.data.nickname==null||res1.data.data.nickname==""){
									theself.nickname="";
								}else{
									theself.nickname =res1.data.data.nickname;
								}
								
								if(res1.data.data.gender==null||res1.data.data.gender==""){
									theself.selector="请选择";
								}else{
									theself.selector=res1.data.data.gender;
								}
								if(res1.data.data.birthday==null||res1.data.data.birthday==""){
									theself.birthday="请选择";
								}else{
									theself.birthday =res1.data.data.birthday.substring(0,10);
								}
								if(res1.data.data.address==null||res1.data.data.address==""){
									theself.address="";
								}else{
									theself.address =res1.data.data.address;
								}
								theself.phoneNumber=res1.data.data.phoneNumber;
								theself.unid=res1.data.data.unid;
								theself.openId_qq=res1.data.data.openId_qq;
								theself.openId_wx=res1.data.data.openId_wx;
								theself.username=res1.data.data.username;
							}
						})
						uni.hideLoading();
					}
				})	
			},
			genderChange : function(e){
				//console.log(e.detail.value,"sex")
				if(e.detail.value==0){
					this.selector="请选择";
				}else{
					this.selector =this.genderSex[e.detail.value]; 
				}
				this.gender=e.detail.value;
			},
			dateChange : function(e){
				this.birthday = e.detail.value;
			},
			getDate(type) {
						const date = new Date();
						let year = date.getFullYear();
						let month = date.getMonth() + 1;
						let day = date.getDate();

						if (type === 'start') {
							year = year - 60;
						} else if (type === 'end') {
							year = year + 2;
						}
						month = month > 9 ? month : '0' + month;;
						day = day > 9 ? day : '0' + day;
						return `${year}-${month}-${day}`;
					},
			toggleTab(e){
				this.$refs[this.mode].show(); 
			},
			onConfirm(e){
				this.address=e.result;
			},
			reviseBackground(){
				var that=this;
				uni.chooseImage({
					count:1,
					//sourceType:['album'],
					success(res) {
						console.log(res,"res11");
						var tempFilePaths = res.tempFilePaths;
						uni.saveFile({
						  tempFilePath: tempFilePaths[0],
						  success: function (res1) {
							var savedFilePath = res1.savedFilePath;
							uni.setStorage({
								key:'backUrl',
								data:savedFilePath
							})
							uni.getStorage({
								key:'backUrl',
								success:function(res){
									that.backImg=res.data;
									console.log(res.data,"res..data")
								}
							})
						  }
						});
					}
				})
			},
			formSubmit: function(e) {
				uni.showLoading({					title:'保存中...'				})
				// console.log(this.portrait)
				// console.log(this.port)
				console.log(this.unid)
				console.log(this.openId_qq)
				console.log(this.openId_wx)
				console.log(this.selector)
				console.log(this.address)
				console.log(this.nickname)
				console.log(this.birthday)
				console.log(this.backImg)
				console.log(this.phoneNumber)
				console.log(this.username)
				uni.request({
					// url:'http://218.67.107.93:9210/api/app/changeInfo',
					url:this.$Grzx.Interface.changeInfo.url,
					data:{
						portrait:this.port,
						unid:this.unid,
						openId_qq:this.openId_qq,
						openId_wx:this.openId_wx,
						gender:this.selector,
						address:this.address,
						nickname:this.nickname,
						birthday:this.birthday,
						backImg:this.backImg,
						phoneNumber:this.phoneNumber,
						username:this.username,
					},
					method:'POST',
					success(res) {
						console.log(res,'res')
					},
					fail(err) {
						console.log(err,"err")
					}
				})
				var list={
						portrait:this.portrait,
						unid:this.unid,
						openId_qq:this.openId_qq,
						openId_wx:this.openId_wx,
						gender:this.gender,
						address:this.address,
						nickname:this.nickname,
						birthday:this.birthday,
						backImg:this.backImg,
						phoneNumber:this.phoneNumber,
						username:this.username,
					};
				uni.setStorageSync('userInfo',list);
				uni.hideLoading();
				uni.navigateBack();
			},
			getPhoto(){
				var that=this;
				uni.chooseImage({
					count:1,
					//sourceType:['album'],
					success(res) {
						var tempFilePaths = res.tempFilePaths;
						uni.saveFile({
						  tempFilePath: tempFilePaths[0],
						  success: function (res1) {
							 that.portrait=res1.savedFilePath;
							 pathToBase64(res1.savedFilePath)
							 .then(base64 => {
								 that.port=base64;
							 })
						  }
						}); 
					}
				})	
			},
			//------------判断是否为base64格式-----------
			isBase64:function(str) {
			    if (str ==='' || str.trim() ===''){ return false; }
			    try {
			        return btoa(atob(str)) == str;
			    } catch (err) {
			        return false;
			    }
			},
	}
}
</script>
<style lang="scss">	
	.Cr_background{
		widows: 100%;
		height: 100%;
		.bg{
			width: 100%;
			height: 464upx;
			filter: blur(0.5px);
			opacity: .7;
		}
		.tx{
			position: absolute;
			width: 200upx;
			height: 200upx; 
			left: 250upx;
			top: 52upx;
			border-radius: 50%;
			margin: 20upx;
		}
		.xgbg{
			position: absolute;
			width:220upx;
			font-size:32upx;
			left: 242upx;
			top: 294upx;
			margin: 20upx;
			border-radius: 40upx;
			line-height: 74upx;
			border-color: #FFFFFF;
			color: #FFFFFF;
		}
		.Cr_slk1{
			margin-top: -20upx;
		}
		.Cr_slk2{
			margin-top: -8upx;
		}
		.bz{
			position: relative;
			left: 36upx;
			top: 74upx;
			color: #AAAAAA;
		}
		.slk{
			position: relative;
			width: 90%;
			height: 104upx;
			left: 36upx;
			text-align: right;
			border-bottom:#F5F5F5 1px solid;
			border-left-width:0px;
			border-right-width:0px;
			border-top-width:0px;
		}
		.slk1{
			position: relative;
			width: 90%;
			height: 72upx;
			left: 36upx;
			text-align: right;
			padding-top: 24upx;
			padding-bottom: 4upx;
			border-bottom:#F5F5F5 1px solid;
			border-left-width:0px;
			border-right-width:0px;
			border-top-width:0px;
		}
		.an{
			width: 90%;
			height: 104upx;
			line-height: 104upx;
			padding-top: 12upx;
			font-size: 40upx;
			margin-top: 48upx; 
			margin-bottom: 48upx;
		}
	}

</style>