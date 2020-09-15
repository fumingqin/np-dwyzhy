<template>
	<view>
		<!-- 顶部轮播图（可点击进入相册并放大） -->
		<swiper style="width: 750rpx;height: 400rpx;" circular autoplay>
			<swiper-item style="width: 750rpx;" v-for="(item,index) in pictureArr" :key="index">
				<image :src="item.ImageUrl" style="width: 750rpx;height: 400rpx;" mode="aspectFill" />
			</swiper-item>
		</swiper>
		<view style="padding: 0 20rpx;">
			<view style="margin: 20rpx 0;display: flex;justify-content: space-between;align-items: center;">
				<text style="font-size: 40rpx;font-weight: bold">{{DataArr.Name}}</text>
				<view style="display: flex;">
					<view style="padding:10rpx 20rpx;font-size: 32rpx;background-color: #007AFF;color: #FFFFFF;border-radius: 12rpx;"
					 hover-class="active" @click="LookAround">查看周边</view>
					<view style="padding:10rpx 20rpx;font-size: 32rpx;background-color: #007AFF;color: #FFFFFF;border-radius: 12rpx;margin-left: 10rpx;"
					 hover-class="active" @click="GoToHere">去这里</view>
				</view>
			</view>
			<view>
				<view style="margin: 20rpx 0;display: flex;justify-content: space-between;align-items: center;">
					<text style="font-size: 40rpx;font-weight: bold">介绍</text>
					<view style="display: flex;" v-if="DataArr.ScenicDetails!=''">
						<view style="padding:10rpx 20rpx;font-size: 32rpx;background-color: #007AFF;color: #FFFFFF;border-radius: 12rpx;"
						 hover-class="active" @click="VoicePlay" v-if="!IsPlay">语音播放</view>
						<view style="padding:10rpx 20rpx;font-size: 32rpx;background-color: #E3424B;color: #FFFFFF;border-radius: 12rpx;margin-left: 10rpx;"
						 hover-class="active" @click="VoicePause" v-if="IsPlay&&!IsPause">暂停</view>
						<view style="padding:10rpx 20rpx;font-size: 32rpx;background-color: #007AFF;color: #FFFFFF;border-radius: 12rpx;margin-left: 10rpx;"
						 hover-class="active" @click="VoicePlayAgain" v-if="IsPlay&&IsPause">继续</view>
						<view style="padding:10rpx 20rpx;font-size: 32rpx;background-color: #E3424B;color: #FFFFFF;border-radius: 12rpx;margin-left: 10rpx;"
						 hover-class="active" @click="VoiceStop" v-if="IsPlay">停止</view>
					</view>
				</view>
				<view style="text-align: justify;font-size: 36rpx;color: #333333;">
					{{DataArr.ScenicDetails}}
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import Map from '@/common/my-openMap/openMap.js';
	import Voice from '@/components/QS-baiduyy/QS-baiduyy.js';
	export default {
		data() {
			return {
				pictureArr: [],
				DataArr: "",
				voiceObject: "",
				IsPlay: false,
				IsPause: false,
			}
		},
		onLoad(options) {
			if(options.ScenicCode){
				this.getScenicDetails(options.ScenicCode);
			}
		},
		onHide() {
			if(this.voiceObject){
				this.VoiceStop();
			}
		},
		methods: {
			//查看周边
			LookAround: function() {
				uni.navigateTo({
					url:"./LookAround"
				})
			},
			//打开第三方地图导航
			GoToHere: function() {
				let that = this;
				Map.openMap(that.DataArr.Latitude, that.DataArr.Longitude, that.DataArr.Alias, 'gcj02');
			},
			getScenicDetails: function(ScenicCode) {
				let that = this;
				uni.request({
					url: "http://218.67.107.93:9266/Appointment/getScenicDetailsByCode",
					method: "POST",
					data: {
						ScenicCode: ScenicCode
					},
					success: (res) => {
						let Arr = [];
						Arr = res.data.ImageUrl.split("，");
						for (let i = 0; i < Arr.length; i++) {
							let obj = {
								ImageUrl: Arr[i]
							}
							that.pictureArr.push(obj);
						}
						that.DataArr = res.data;
					}
				})
			},
			VoicePlay: function() {
				let that = this;
				let str = {
					voiceSet: {
						tex: that.DataArr.ScenicDetails,
						spd: 5,
						pit: 5,
						vol: 5,
						per: 3
					},
					audioSet: {
						volume: 1,
						obeyMuteSwitch: false
					},
					audioCallback: {
						onPlay: () => { //属性名去掉 - , 不知道为什么全名显示不了
							console.log('音频开始播放了')
						}
					},
					returnAudio: true,
				}
				that.voiceObject = Voice.openVoice(str)
				that.voiceObject.then(res => {
					res.play();
					that.IsPlay = true;
				}).catch(err => {
					console.log('获取语音tok接口失败');
				})
			},
			VoicePause: function() {
				let that = this;
				this.voiceObject.then(res => {
					res.pause();
					console.log(res);
					that.IsPause = true;
				}).catch(err => {
					console.log('获取语音tok接口失败');
				})
			},
			VoicePlayAgain: function() {
				let that = this;
				this.voiceObject.then(res => {
					res.play();
					that.IsPause = false;
				}).catch(err => {
					console.log('获取语音tok接口失败');
				})
			},
			VoiceStop: function() {
				let that = this;
				this.voiceObject.then(res => {
					res.stop();
					that.IsPlay = false;
					that.IsPause = false;
				}).catch(err => {
					console.log('获取语音tok接口失败');
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFF;
	}

	.active {
		transition: all .3s; //过度
		opacity: 0.8;
		background-color: #007AFF;
	}
</style>
