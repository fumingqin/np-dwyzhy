<template>
	<view class="container">
		
		<!-- <view class="list-cell m-t b-b">
			<text class="cell-tit">推送设置</text>
			<switch :checked="statu.check1" color="#fa436a" @change="switchChange" />
		</view>
		<view class="list-cell b-b b-l">
			<text class="cell-tit">视频自动播放</text>
			<switch :checked="statu.check2"  color="#fa436a" @change="playChange" />
		</view> -->
		
		<view class="list-cell m-t b-b" @click="clearStorage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text style="font-size: 28upx;">{{currentSize}}</text>
			<text class="cell-more jdticon icon-you"></text>
		</view>
		<view class="list-cell b-b b-l" @click="navTo('aboutApp')">
			<text class="cell-tit">关于APP</text>
			<text class="cell-more jdticon icon-you"></text>
		</view>
		<!-- #ifndef H5 -->
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statu:{
					check1:true,
					check2:true,
				},
				currentSize:'',
			};
		},
		onLoad(){
			this.load();
		},
		methods:{

			navTo(url){
				uni.navigateTo({
					url:url
				})
			},
			async load(){
				var that=this;
				uni.getStorage({
					key:'switch',
					success:function(res1){					
						that.statu.check1=res1.data;
					}
				})
				uni.getStorage({
					key:'play',
					success:function(res2){
						that.statu.check2=res2.data;
					}
				})
				const res = uni.getStorageInfoSync();
				console.log(res,"res3");
				console.log(res.currentSize,"currentSize");
				var size=res.currentSize;
				if(size>=1024){
					var size=(size/1024).toFixed(2);
					that.currentSize=size+" M";
				}else{
					that.currentSize=size+" KB";
				}
			},
			//退出登录
			toLogout(){
				uni.getStorage({
					key:'userInfo',
					success(res) {
						uni.showModal({
						    content: '确定要退出登录么',
						    success: (e)=>{
						    	if(e.confirm){
						    		uni.removeStorageSync('userInfo');
						    		setTimeout(()=>{
						    			uni.switchTab({
						    				url:'/pages/GRZX/user'
						    			})
						    		}, 200)
						    	}
						    }
						});
					},
					fail(err){
						uni.showToast({
							title : '请先登录',
							icon : 'none',
						})
					}
				})
				
			},
			clearStorage(){
				var user=uni.getStorageSync('userInfo');
				uni.showModal({
				    content: '是否清除数据',
				    success: (e)=>{
				    	if(e.confirm){
							uni.clearStorage();
							uni.setStorageSync('userInfo',user);
							uni.redirectTo({
								url:'/pages/GRZX/set'
							})
				    	}
				    }
				});
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? true: false;
				uni.setStorage({
					key:'switch',
					data:statusTip
				})
				//console.log(statusTip)
				//this.$api.msg(`${statusTip}消息推送`);
			},
			playChange(e){
				let statusTip = e.detail.value ? true: false;
				uni.setStorage({
					key:'play',
					data:statusTip
				})
				//console.log(statusTip)
				//this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		&.b-l{
			border-top: 1upx solid #EAEAEA;
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
