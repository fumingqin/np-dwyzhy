<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			this.loadList();
		},
		methods: {
			loadList(){
				uni.request({
					url: this.$Grzx.Interface.get_bkbw_list.url,
					method: this.$Grzx.Interface.get_bkbw_list.method,
					success: res => {
						console.log(res);
					},
					fail: () => {},
					complete: () => {}
				});
			},
		}
	}
</script>

<style>

</style>
