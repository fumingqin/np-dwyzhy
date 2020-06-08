<template>
	<view>
		<text>经度：{{lat}}</text>
		<text>纬度：{{lon}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lat:'',
				lon:'',
			}
		},
		onLoad() {
			uni.getLocation({
				type:'gcj02',
				success: res => {
					console.log(res)
					this.lat=res.latitude,
					this.lon=res.longitude
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
