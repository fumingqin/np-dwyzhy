<template>
	<view style="height: 100%;">
		<!-- 列表 -->
		<view style="height: 100%; background-color: #F6F6F6;display: flex;">
			<view style="width: 250rpx;height: 100%;">
				<scroll-view scroll-y="true" style="height: 100%;">
					<view v-for="(item,index) in TravelSiteArr" :key="index" class="item-left"
					 @click="addressclick(index)" :class="leftIndex==index?'active':''">
						<view style="font-size: 30rpx;">{{item.ZoneName}}</view>
					</view>
				</scroll-view>
			</view>
			<view style="width: 500rpx; background-color: #FFF;height: 100%;" >
				<scroll-view scroll-y="true" style="height: 100%;">
					<view hover-class="ve_hover" v-for="(item,index) in TravelSiteArr[leftIndex].Data" :key="index" class="item-right" @click="itemClick(item)">
						<view style="font-size: 30rpx;">{{item.ScenicName}}</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollHeight: '500px',
				TravelSiteArr: [{
					ZoneName: '',
					Data: [{
						ScenicName: '',
					}],
				}],
				leftIndex: 0,
			}
		},
		onLoad(param) {
			var that = this;
			that.getTravelAdressList();
		},
		methods: {
			addressclick: function(e) {
				let that = this;
				that.leftIndex = e;
			},
			//-------------------------获取车站列表数据-------------------------
			getTravelAdressList() {
				let that = this;
				uni.showLoading();
				uni.request({
					url: 'http://218.67.107.93:9266/Appointment/getZoneScenic',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {},
					success: (res) => {
						uni.hideLoading();
						if (res.data.data.length > 0) {
							that.TravelSiteArr = res.data.data;
						}
					},
					fail(res) {
						uni.hideLoading();
					}
				})
			},
			//-------------------------点击下拉站点-------------------------
			itemClick(item) {
				
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.active {
		background-color: #FFF;
	}

	.topSerchView {
		height: 8%;
		background-color: #DBDBDB;
		padding-top: 20rpx;
	}
	
	.ve_hover{
		transition: all .3s;//过度
		opacity: 0.9;
		background: #eeeeee;
	}
	.item-left{
		padding: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		border-bottom: 1rpx solid #F6F6F6;
	}
	.item-right{
		padding: 20rpx;
		margin-left: 10rpx;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-direction: column;
		border-bottom: 1rpx solid #eee;
	}
</style>
