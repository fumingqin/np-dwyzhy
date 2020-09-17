<template>
	<view class="container">
		<view class="title">
			<rich-text :nodes="information.title"></rich-text>
		</view>
		<view class="time">
			<text>{{information.createdTime}}</text>
		</view>
		<view class="content">
			<rich-text :nodes="imageText"></rich-text>
		</view>
		<view class="count">
		   <text>游览量：{{information.count}}</text>
		</view>
		<view class="peerBox">
			<text class="fontClass titleClass">同行行程</text>
			<text class="fontClass">发布人：{{publisher || '暂无'}}</text>
			<text class="fontClass">预计费用：{{information.cost || '暂无'}}</text>
			<text class="fontClass">结伴人数：{{information.colleagueNum || '0'}}</text>
			<text class="fontClass">开始游玩时间：{{information.startPlayTime || '暂无'}}</text>
			<text class="fontClass">结束游玩时间：{{information.endPlayTime || '暂无'}}</text>
			<view class="fontClass pb"><!-- information.publisherTel  information.publisher-->
				<text>联系电话：{{ publisherTel|| '暂无'}}</text>
				<text class="ml" @click="callClick">点击拨打联系电话</text>
			</view>
		</view>
		<text @click="cancelClcik" class="cancelClass">取消行程</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				information: {
					title: '', //标题
					createdTime: '', //时间
					count: '', //游览量
				},
				publisher:'', //发布人
				publisherTel:'',//联系电话
				id : '',
				imageText : '', //图文
				unid:'',		//用户id
			}
		},
		onLoad(options) {
			uni.getStorage({
				key:'userInfo',
				success:res=>{
					this.unid = res.data.unid;
				}
			})
			this.id = options.id 
			this.getPeers();
		},
		methods: {
			//---------------------------获取行程信息---------------------------
			getPeers :function(){
				uni.showLoading({
					title:'加载中...'
				})
				uni.getStorage({
					key:'peerDetail',
					success:res=>{
						this.information = res.data;
						this.imageText = res.data.content.replace(/\<img/g, '<img style="max-width:100%;height:auto;margin: 2px 0px;" ');
						this.publisher = this.information.publisher=='管理员'?this.information.publisher:this.formateName(this.information.publisher);
						this.publisherTel = this.information.publisherTel==null?this.information.publisherTel:this.formatePhone(this.information.publisherTel);
					},
					complete: () => {
						uni.hideLoading();
						uni.removeStorageSync('peerDetail');
					}
				})
			},
			
			//---------------------------拨打联系电话---------------------------
			callClick:function(){
				if(this.publisherTel == null){
					uni.showToast({
						title: '当前暂无联系电话',
						icon:'none'
					});
				}else{
					uni.makePhoneCall({
						phoneNumber: this.publisherTel, 
					});
				}
			},
			
			//---------------------------取消行程---------------------------
			cancelClcik:function(){
				uni.showLoading({
					title: '取消中...',
					mask: true
				});
				uni.request({
					url: this.$Grzx.Interface.colleague_cancel.url,
					method: this.$Grzx.Interface.colleague_cancel.method,
					data: {
						id:this.information.id,
						colleagueId:this.unid,//用户id
					},
					success: res => {
						console.log(res);
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
						if(res.statusCode == 200){
							setTimeout(function(){
								uni.navigateBack();
							},500)
						}
					},
					fail: () => {
						uni.showToast({
							title:'网络连接失败',
							icon:'none'
						})
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
			
			//---------------------------格式化发布人电话---------------------------
			formatePhone:function(phoneNum){
				return phoneNum.substring(0,3)+'****'+phoneNum.substring(7,11);
			},
			
			//---------------------------格式化发布人---------------------------
			formateName:function(name){
				var subName = name.substring(0,1)+'**';
				return subName;
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		width: 100%;
		.title{
			font-size: 40upx;  
			padding: 32upx 32upx;
		}
		
		.time {
			display: flex; 
			font-size: 30upx; 
			margin-left: 32upx;
			color: #888;
		}
		
		.content {
			display: flex; 
			padding: 32upx 32upx; 
			// margin-top: 24upx; 
			font-size: 33upx; 
			letter-spacing: 4upx; 
			line-height: 48upx; 
			color: #444;
			text-align: justify;
		}
		
		.count {
			margin: 32upx 0;
			width: 85%;
			text-align: right;
			font-size: 30upx;
		}
	}
	
	.peerBox{
		margin: 20upx;
		background-color: #dddddd;
		display: flex;
		flex-direction: column;
		border-radius: 20upx;
		.fontClass{
			padding-top: 20upx;
			padding-left: 5%;
			display: flex;
			flex-direction: row;
		}
		.ml{
			margin-left: 5%;
		}
		.pb{
			padding-bottom: 25upx;
		}
		.titleClass{
			font-weight: bold;
			font-size: 44upx;
		}
	}
	
	.cancelClass{
		margin: 20upx 5%;
		width: 90%;
		padding: 20upx 0;
		text-align: center;
		font-size: 32upx;
		background-color: #0055ff;
		color: #FFFFFF;
		border-radius: 10upx;
	}
</style>
