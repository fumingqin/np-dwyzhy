<template>
	<view class="Ly_background">
			<!-- 顶部轮播图（可点击进入相册并放大） -->
			<swiper class="swi" circular autoplay >
				<swiper-item class="swi-item" v-for="(item,index) in piclist" :key="index">
				<image :src="item" @click="goImgList" />
				<view class="view">{{imgnumber}}张图片</view>
				</swiper-item>
			</swiper>
			<view>
				<!-- 标题、发布时间、点击量、分享 -->
				<view class="clicks">
				<text class="title">{{tweets.title}}</text>
				<text class="time">{{tweets.date}}&nbsp;&nbsp;{{tweets.clicks}}万次游览</text>
				</view>
			</view>
			<!-- 文章内容 -->
			<view class="Zj_background">
				<view class="tweetsTitle">介绍</view>
				<view class="tweetscontent" >
					<rich-text :nodes="tweets.titlecontent"></rich-text>
				</view>
			</view>
			
			<!-- 回复区 -->
			<!-- 模块命名：Hf -->
			<view>
				<view class="tweetsTitle">回复</view> 
				<view class="Hf_box" style="margin: 72upx 0;" >
					<image class="Hf_image" :src="userInfo.portrait || '/static/FYWH/missing-face.png'" mode="aspectFill" ></image>
					<input class="Hf_input" type="text" placeholder="回复点什么吧" v-model="userInfo.content"  @confirm="publish"/>
			</view>
				
				<view class="Hf_box" v-for="(item,index) in replyContent" v-if="index<3" :key="index">
					<image class="Hf_portrait" :src="item.portrait" mode="aspectFill"></image>
					<view class="Hf_right">
						<text class="Hf_name">{{item.scennicName}}</text>
						<text class="Hf_date">{{item.date}}</text>
						<view class="Hf_btn" :class="{active: item.fabulous_state}" @click="tofabulous(index)" >
							<text class="jdticon icon-dianzan-ash"></text>
							<text>{{item.fabulous}}</text>
						</view>
						<text class="Hf_con">{{item.content}}</text>
				</view>
					
				</view>
					<view class="Hf_viewreply" @click="navTo('/pages/FYWH/fy_toreply')">
					<text> 查看{{replyContent.length}}条回复 ></text>
				</view>
			</view>
	</view>
</template>
<script>
	import {
	    mapState 
	} from 'vuex'; 
	export default {
		data() {
			return {
				userInfo : {
					unid : '',     //用户id号
					nickname : '', //用户姓名
					portrait: '',  //用户头像
					content : '',  //回复内容
					date : '2019-12-21',  //回复日期
					fabulous : 0, 		  //点赞数
					fabulous_state : false,	 //点赞状态
				}, //评论内容
				
				
				piclist :[],    //相册图片数组
				imgnumber : '', //图片张数
				tweets : {},    //用户内容
				scenicSpot : [], //景点内容
				replyContent : [],//回复内容
				scrollTop: 0,	//相册图片
			}
		},
		onLoad:function(options){
			// let id = options.id;
			// if(id){
			// 	this.$api.msg(`点击了${id}`);
			// }
			this.tweetsInit();
			
		},
		onNavigationBarButtonTap : function() {
			 this.share();
		},
		onShareAppMessage(res){
			  if (res.from === 'menu') {// 来自页面内分享按钮
			     return{
			     	title : '来自'+this.tweets.nickname+'的分享',
					imageUrl : this.tweets.image[0].ticketImage,
					success: function () {
					    uni.showToast({
					    	title:'分享成功',
							duration : 3000
					    })
					},
					fail: function () {
					    uni.showToast({
					    	title:'分享失败',
							duration : 3000
					    })
					}
			     }
			    }
		},

		methods: {
			//读取静态数据json.js 
			async tweetsInit(){
				uni.setStorage({
					key:'userInfo',
					success: (res) => {
						this.userInfo.unid = this.userInfo.unid;
						this.userInfo.nickname = this.userInfo.nickname;
						this.userInfo.portrait = this.userInfo.portrait;
					}
				})
				
				let ts = await this.$api.lyfwfmq('tweets');
				this.tweets = ts;
				this.piclist = ts.image;
				this.imgnumber = ts.imageNumber;
				
				let replycontent = await this.$api.lyfwfmq('reply');
				this.replyContent = replycontent;
				
				
			},
			//保存图片至本地并打开新页面
			goImgList(){
				uni.setStorageSync('imagePiclist',this.piclist);
				uni.navigateTo({
					url:'fy_imglist'
				})
			},
			//路由整合
			godetail : function (value){
				// console.log(id)
				uni.showToast({
					title:'你点击了'+value,
				})
				// uni.navigateTo({
				// 	url'',
				// })
			},
			// 点赞事件
			tofabulous : function(index){
				if(this.replyContent[index].fabulous_state==false){
					this.replyContent[index].fabulous_state = true;
					var num = this.replyContent[index].fabulous;
					this.replyContent[index].fabulous = num+1;
				}else {
					this.replyContent[index].fabulous_state = false;
					var num = this.replyContent[index].fabulous;
					this.replyContent[index].fabulous = num-1;
				};
			},


			
			
			//分享
			share(){
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
				    href: "http://www.baidu.com",
				    title: "来自"+this.tweets.nickname+"的分享",
				    summary: this.tweets.title,
				    imageUrl: this.tweets.image[0].ticketImage,
				    success: function () {
				        uni.showToast({
				        	title:'分享成功',
							duration : 3000
				        })
				    },
				    fail: function () {
				        uni.showToast({
				        	title:'分享失败',
							duration : 3000
				        })
				    }
				}); 
			},
			// 统一跳转接口
			navTo(url){
				uni.navigateTo({
					url
				})  
			},
			//回复，判断是否登录后才能进行回复
			publish(){
				uni.getStorage({
					key:'userInfo',
					success:function(){
							uni.showToast({
								title:'回复成功',
							})
							this.userInfo.content = ''; 
					},
					fail:function(){
						uni.showToast({
							title : '请先登录再回复',
							icon : 'none',
						})
						setTimeout(function(){
							uni.navigateTo({
								url  : '../GRZX/userLogin?loginType=4'
							})  
						},1500);
					}
				})
			}
			
		} 
	}
</script>

<style lang="scss">
	//页面背景
	.Ly_background{
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
		.clicks{
			display: flex;
			flex-direction: column;
			//标题
			.title{
				font-size: 44upx;
				font-weight: bold;
				color: #333333;
				padding-top: 32upx;
				padding: 32upx 32upx;
			}
			//时间
			.time{
				font-size: 28upx;
				color: #333333;
				padding-left: 32upx;
			}
		}
		
		//头像
		.portrait{
			display:flex;
			position: relative;
			width: 104upx;
			height: 104upx;
			left: 30upx;
			top: 48upx;
			border:5upx solid #fff;
			border-radius: 50%;
		}
		//名称
		.nickname{
			position: relative;
			font-size: 32upx;
			color: #333333;
			margin-left: 156upx;
			bottom : 44upx;
			text-overflow:ellipsis;
			white-space:nowrap;
			overflow:hidden;
			width:160px;
		}
		//签名
		.autograph{
			position: relative;
			font-size: 26upx;
			color: #aaa;
			margin-left: 156upx;
			bottom : 38upx;
			text-overflow:ellipsis;
			white-space:nowrap;
			overflow:hidden;
			width:160px;
		}
		//地址
		.address{
			position: relative;
			text-align: right;
			display: flex;
			flex-direction: column;
			font-size: 34upx;
			color: #333;
			right: 32upx;
			bottom : 104upx;
		}
		//X轴滚动视图
		.Hk_scrollview{
			white-space: nowrap; // 滚动必须加的属性
			width: 100%;
			height: 240upx;
			padding: 20upx;
			margin: 0 auto;
			.Hk_item{
				 margin-right: 20upx;
				 display: inline-block;
				 vertical-align: top;
			}
			.Hk_image{
					position: relative ;
					top: 8upx;
					width: 152upx;
					height: 152upx;
					border-radius: 12upx;
					margin: 16rpx 16rpx;
				}
			.Hk_text1{
				 position: relative ;
				 text-overflow:ellipsis; //文章超出宽度隐藏并用...表示
				 white-space:nowrap;
				 overflow:hidden;
				 width:240px;			//内容宽度
				 padding-right: 20upx;
				 bottom: 172upx;
				 margin-left: 200upx;
			}
			.Hk_text2{
				 position: relative ;
				 padding-right: 20upx;
				 bottom: 172upx;
				 margin-left: 200upx;
				 font-size: 26upx;
				 margin-top: 20upx;
				 display: block; // 让字体换行
			}
			.Hk_text3{
				 position: relative ;
				 padding-right: 20upx;
				 bottom: 172upx;
				 margin-left: 200upx;
				 font-size: 24upx;
				 margin-top: 28upx;
				 color: #AAAAAA;
				 display: block; // 让字体换行
			}
		}
		//Y轴滚动视图
		.Tk_scrollview{
			width: 100%;
			padding-left: 32upx;
			margin: 0 auto;
			background: #fff;
			max-height: 800upx;
			.Tk_item{
				 display: flex;
				 .Tk_image{
				 		width: 182upx;
				 		height: 152upx;
				 		border-radius: 12upx;
				 		margin: 24rpx 0rpx;
				 	}
				.Tk_bacg{
					margin-top: 20upx;
					margin-left: 24upx;
				}
				.Tk_text1{
					 display: flex;
					 text-overflow:ellipsis; //文章超出宽度隐藏并用...表示
					 white-space:nowrap;
					 overflow:hidden;
					 width:480upx;			//内容宽度
				}
				.Tk_text2{
					 font-size: 26upx;
					 margin-top: 20upx;
					 display: block; // 让字体换行
				}
				.Tk_text3{
					 font-size: 24upx;
					 margin-top: 28upx;
					 color: #AAAAAA;
					 display: block; // 让字体换行
				}
			}
		}
		//推文标题
		.tweetsTitle{
			display: flex;
			position : relative;
			flex-direction: column;
			font-size: 38upx;
			font-weight: bold;
			color: #333333; 
			margin-top: 32upx;
			padding: 32upx 32upx;
			padding-bottom: 0upx;
			text-overflow:ellipsis;
			white-space:nowrap;
			overflow:hidden;
		}
		//下弹框标题
		.tweetsTitle2{
			position : relative;
			font-size: 38upx;
			font-weight: bold;
			color: #333333; 
			padding-top: 32upx;
		}
		//推文内容
		.tweetscontent{
			letter-spacing : 2upx;
			font-size: 32upx;
			padding: 32upx 32upx;
		}
		//回复区
		.Hf_box{
			display: flex;
			.Hf_portrait{
				position: relative;
				flex-shrink: 0;
				width: 80upx;
				height: 80upx;
				border-radius: 100px;
				left: 30upx;
			}
			.Hf_image{
				position: relative;
				flex-shrink: 0;
				width: 80upx;
				height: 80upx;
				border-radius: 100px;
				left: 30upx;
			}
			.Hf_input{
				position: relative;
				font-size: 30upx;
				color: #333;
				padding: 12upx 32upx;
				padding-bottom: 18upx;
				padding-left: 32upx;
				background: #f5f5f5;
				left: 50upx;
				width: 74%;
				height: 62upx;
				border-radius: 56rpx;
			}
			.Hf_right{
				flex: 1;
				display: flex;
				flex-direction: column;
				position: relative;
				font-size: 30upx;
				color: #aaa;
				padding-top: 8upx;
				padding-left: 50upx;
				padding-right: 32upx;
				margin-bottom: 56upx;
				.Hf_btn{
					display:flex;
					align-items:base-line;
					position:absolute;
					top: 18upx;
					right: 48upx;
					font-size: 32upx;
					.yticon{
						font-size: 44upx;
						margin-left: 8upx; 
						color: #aaa;
					}
					&.active, &.active .yticon{
						color: #28a4ff;
					}
				}
				.Hf_con{
					font-size: 30upx;
					color: #333;
					padding-top:32upx;
					padding-right:14upx;
				}
			}
			}
		// 更多回复消息
		.Hf_viewreply{
			height: 56upx;
			font-size: 30upx;
			text-align: center;
			margin-bottom: 72upx;
			background: #FFFFFF;
		}
		// 底部操作菜单 
		.page-bottom{
			position:fixed;
			left: 30upx;
			bottom:30upx;
			z-index: 95;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 690upx;
			height: 112upx;
			background: rgba(255,255,255,.9);
			box-shadow: 0 0 12upx 0 rgba(0,0,0,.5);
			border-radius: 16upx;
			
			.p-b-btn{
				display:flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: $font-sm;
				color: $font-color-base;
				width: 96upx;
				height: 80upx;
				margin: 16upx 16upx;
				.yticon{
					font-size: 40upx;
					line-height: 48upx;
					color: #333333;
				}
				&.active, &.active .yticon{
					color: #ff4443;
				}
				.icon-fenxiang2{
					font-size: 42upx;
					transform: translateY(-2upx);
				}
				.icon-shoucang{
					font-size: 46upx;
				}
			}
			.action-btn-group{
				display: flex;
				height: 76upx;
				border-radius: 100px;
				overflow: hidden;
				box-shadow: 1px 2px 5px #65bbf9;
				background: linear-gradient(to right, #65bbf9,#28a4ff);
				margin: 20upx 20upx;
				position:relative;
				.action-btn{
					display:flex;
					align-items: center;
					justify-content: center;
					width: 224upx;
					height: 100%;
					font-size: $font-base ;
					padding: 0;
					border-radius: 0;
					background: transparent;
				}
			}
		}
	}
	
	
</style>
