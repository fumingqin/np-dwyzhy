<template>
	<view>
		<web-view src="http://m.wyschina.com/"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad:function(options){
			if(options.data==0){
				uni.showToast({
					title:'app暂不支持武夷山线上购票，请前往公众号进行购票',
					icon:'none',
					duration:3000
				})
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
