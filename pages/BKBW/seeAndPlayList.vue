<template>
	<view class="content">
		<view class="guess-section" v-if="show">
			<view v-for="(item, index) in bkbw_list" :key="index" class="guess-item" @click="informationTo(item.id)">
				<view class="image-wrapper">
					<image :src="item.imgUrl" mode="aspectFill"></image>
				</view>
				<view class="title clamp">{{item.title}}</view>
				<view class="boxClass">
					<text class="price">{{item.createdTime}}</text>
					<text class="price-zan">阅读{{item.count}}</text> 
				</view>
			</view>
		</view>
		<view class="noneData" v-if="!show">
			当前暂无相关内容
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,		//是否显示
				bkbw_list:[],	//必看必玩列表
			}
		},
		onLoad() {
			this.loadList();
		},
		methods: {
			loadList(){
				uni.showLoading({
					title: '加载中...',
					mask: false
				});
				uni.request({
					url: this.$Grzx.Interface.get_bkbw_list.url,
					method: this.$Grzx.Interface.get_bkbw_list.method,
					success: res => {
						console.log(res);
						if(res.data.data.length > 0){
							this.show = true;
						}
						this.bkbw_list = res.data.data;
					},
					fail: () => {},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
			informationTo(id){
				uni.navigateTo({
					url:'./seeAndPlayDetail?id='+id,
				})
			},
		}
	}
</script>

<style lang="scss">
	.content{
		width: 100%;
	}
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 360upx;
			border-radius: 5px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: 32upx;
			color: #333;
			line-height: 72upx;
			display: block;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			width: 160px;
		}

		.Portrait {
			width: 40upx;
			height: 40upx;
			opacity: 1;
		}
		.boxClass{
			display: flex;
			flex-direction: row;
		}
		.price {
			font-size: 26upx;
			color: #666;
			display: block;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			width: 90px;
		}

		.price-zan {
			font-size: 24upx;
			color: #666;
			float: right;
			margin-left: 15%;
		}
	}
	
	.noneData{
		color: #5a5a5b;
		display: flex; 
		justify-content: center;
		margin-top: 400upx;
	}
</style>
