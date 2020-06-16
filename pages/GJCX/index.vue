<template>
	<view class="content">
		<view class="tab">
			<button class="button_left" type="primary" size="mini" :plain="true">取消</button>
			<button class="button_right" type="primary" size="mini" :plain="false" @click="dataaa">完成</button>
		</view>
		<map
			:id="mapId"
			:longitude="longitude"
			:latitude="latitude"
			ref="map"
			:controls="controls"
			class="map"
			:show-location="true"
			@regionchange="regionchange"
			@updated="updated"
			:style="{ width: '750rpx', height: mapHeight + 'px' }"
		>
			<cover-image :style="{ 'margin-top': mapHeight - 70 + 'px' }" class="relocate" @click="relocate" src="/static/icon-dingwei.png"></cover-image>
		</map>
		<view class="list" :style="{ height: mapHeight + 'px' }">
			<!-- @blur="blur" -->
			<uni-search-bar @confirm="confirm" @input="input" @cancel="cancel" placeholder="搜索地点" radius="5" clearButton="auto" cancelButton="auto"></uni-search-bar>
			<view class="list_item" :style="{ height: mapHeight - 52 + 'px' }">
				<uni-list>
					<scroll-view
						lower-threshold="50"
						@scrolltolower="scrolltolower"
						:scroll-top="poisListTop"
						:style="{ height: mapHeight - 52 + 'px' }"
						class="scroll-view_H"
						scroll-y="true"
						@scroll="scroll"
						scroll-left="120"
					>
						<radio-group @change="radioChange">
							<uni-list-item
								@click="radioChange({ detail: { value: String(index) } })"
								v-for="(item, index) in poisList"
								:key="index"
								:title="item.title"
								:note="item.address"
								:showArrow="false"
							>
								<template v-slot:right="">
									<radio :value="String(index)" :checked="index == poisListCurrentIndex ? true : false" />
								</template>
							</uni-list-item>
							<uni-load-more :status="uniLoadMoreStatus"></uni-load-more>
						</radio-group>
					</scroll-view>
				</uni-list>
			</view>
		</view>
	</view>
</template>

<script>
import uniSearchBar from '@/components/GJCX/uni-search-bar/uni-search-bar.vue';
import uniList from '@/components/GJCX/uni-list/uni-list.vue';
import uniListItem from '@/components/GJCX/uni-list-item/uni-list-item.vue';
import uniLoadMore from '@/components/GJCX/uni-load-more/uni-load-more.vue'; //下拉加载
import Vue from 'vue';
import VueJsonp from 'vue-jsonp';
Vue.use(VueJsonp);
export default {
	data() {
		return {
			mapId: 'map',
			longitude: 116.38,
			latitude: 39.9,
			mapContext: null,
			searchObj: null,
			mapHeight: 0,
			controls: [],
			poisList: [],
			poisListTop: 0,
			poisListType: 0, //数据类型 0定位,地铁 1:搜索
			old: {
				poisListTop: 0
			},
			poisListCurrentIndex: null,
			Page: 1, //页码
			limit: 20, //每页数量
			windowHeight: 0, //屏幕高度
			searchContent: null, //搜索内容
			uniLoadMoreStatus: 'more' ,//当前状态loading 的状态，可选值：more（loading前）、loading（loading中）、noMore（没有更多了）
			addressinfo:[],
		};
	},
	components: {
		uniSearchBar,
		uniList,
		uniLoadMore,
		uniListItem
	},
	onLoad() {
		const res = uni.getSystemInfoSync();
		this.windowHeight = res.windowHeight;
		this.mapHeight = res.windowHeight / 2;

		this.controlsupdated();
		this.relocate();
	},
	onReady() {
		// this.controls[0].position.top = this.mapHeight / 2;
		// this.controls[0].position.left = uni.upx2px(750) / 2;

		this.controlsupdated();
		var createMapContext = uni.createMapContext(this.mapId, this);

		// this.searchObj = this.createMapContext.$getAppMap();
		console.log(createMapContext);
		this.createMapContext = createMapContext;
		// var createMapContext = uni.createMapContext(this.mapId,this);
		// createMapContext
	},
	methods: {
		radioChange(index) {
			this.poisListCurrentIndex = index.detail.value;
			console.log(index);
		},
		scroll(e) {
			console.log(e.detail.scrollTop);
			this.old.poisListTop = e.detail.scrollTop;
			console.log('input');
		},
		input(e) {
			//console.log(e.value);
			this.poisListType = 1;
			this.searchContent = e.value;
			this.poiSearchNearBy(1);
		},
		relocate() {
			uni.showLoading({
				title: '获取定位中'
			});
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					console.log('成功');
					console.log(res);
					this.longitude =res.longitude;
					this.latitude=res.latitude;
					//定位转换
					this.$jsonp('//apis.map.qq.com/ws/coord/v1/translate', {
						key: 'D74BZ-7CIK4-EQLUK-DR4DG-2OSLQ-AGBN6',
						output: 'jsonp',
						locations: res.latitude + ',' + res.longitude,
						type: 1
					})
						.then(json => {
							console.log(json);
							if (json.status === 0) {
								this.longitude = json.locations[0].lng;
								this.latitude = json.locations[0].lat;
								this.poisListType = 0;
								this.poiSearchNearBy(1);
								uni.showToast({
									title: '获取定位成功',
									duration: 2000
								});
							}
							// let address = json.result.address;
						})
						.catch(err => {
							console.log(err);
						});
					// https://apis.map.qq.com/ws/coord/v1/translate?locations=39.12,116.83;30.21,115.43&type=3&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
				},
				fail: data => {
					console.log(data);
					uni.showToast({
						title: '获取定位失败',
						duration: 2000
					});
				},
				complete: () => {
					uni.hideLoading();
				}
			});
			console.log('relocate');
		},
		cancel() {
			console.log('cancel');
		},
		dataaa() {
			
			if(!this.poisList[this.poisListCurrentIndex]){
				console.log('当前未选中地址');
				return;
			}
			else{
				
				// let pages = getCurrentPages(); 
				// let prevPage = pages[pages.length - 2]; //上一个页面 
				this.addressinfo=this.poisList[this.poisListCurrentIndex];
				//console.log(this.addressinfo);
				// prevPage.$vm.addressinfo = this.addressinfo;
				// console.log(prevPage.$vm.addressinfo);
				var pages = getCurrentPages();
				    var prepage = pages[pages.length - 2]; //上一个页面
				    prepage.$vm.addressinfo = this.addressinfo;
				uni.navigateBack();
			}
			console.log(this.poisList[this.poisListCurrentIndex]);
			
			// this.mapHeight = this.mapHeight == 200 ? 350 : 200;
		},
		scrolltolower(e) {
			console.log(e);
			console.log(1111);
			// this.mapHeight = this.mapHeight == 200 ? 350 : 200;
		},
		regionchange(e) {
			console.log(e);
			console.log('regionchange');
			var seif = this;
			this.createMapContext.getCenterLocation({
				success(res) {
					seif.longitude = res.longitude;
					seif.latitude = res.latitude;
					seif.poisListType = 0;
					seif.poiSearchNearBy(1);
				}
			});
		},
		tap() {
			console.log('tap');
		},
		poiSearchNearBy(Page) {
			this.Page = Page;
			var locationdata = this.latitude + ',' + this.longitude; //纬度，经度
			if (this.poisListType === 0) {
				var url = 'https://apis.map.qq.com/ws/geocoder/v1/';
				var data = {
					key: 'D74BZ-7CIK4-EQLUK-DR4DG-2OSLQ-AGBN6',
					poi_options: 'page_size=' + this.limit + ';page_index=' + this.Page,
					output: 'jsonp',
					location: locationdata,
					get_poi: 1
				};
			} else {
				var url = '//apis.map.qq.com/ws/place/v1/search';
				var data = {
					// page_size=20&page_index
					key: 'D74BZ-7CIK4-EQLUK-DR4DG-2OSLQ-AGBN6',
					page_size: this.limit,
					page_index: this.Page,
					keyword: this.searchContent,
					// poi_options: 'page_size=' + this.limit + ';page_index=' + this.Page,
					boundary: 'nearby(' + this.latitude + ',' + this.longitude + ',1000)', //经纬度搜索周边
					orderby: '_distance',
					output: 'jsonp'
				};
				// https://apis.map.qq.com/ws/place/v1/search?boundary&keyword=KFC
			}
			this.$jsonp(url, data)
				.then(json => {
					if (json.status === 0) {
						if (this.poisListType === 0) {
							var data = json.result.pois;
						} else {
							var data = json.data;
						}
						this.poisList = data;

						this.poisListTop = this.old.poisListTop;
						this.$nextTick(function() {
							this.poisListTop = 0;
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		controlsupdated() {
			this.controls = [
				{
					id: 1,
					iconPath: '/static/64.png',
					position: {
						left: uni.upx2px(750) / 2 - 25,
						top: this.mapHeight / 2 - 50,
						width: 50,
						height: 50
					},
					clickable: true
				}
			];
		}
	}
};
</script>

<style>
.tab {
	position: absolute;
	z-index: 1000;
	left: 0;
	top: 0;
	width: 100%;
	height: 68px;
	background-color: antiquewhite;
	background: -webkit-linear-gradient(rgb(179, 179, 179), rgba(0, 0, 0, 0));
}

.button_left {
	color: #ffffff !important;
	border: 0 !important;
	text-align: left;
	margin: 10rpx;
}

.button_right {
	font-size: 8px;
	color: #ffffff !important;
	background-color: #09c767 !important;
	margin: 10rpx;
	border: 0 !important;
	float: right;
	text-align: right;
}

.uni-list-item {
	font-size: 16px;
	position: relative;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-webkit-flex-direction: column;
	flex-direction: column;
	-webkit-box-pack: justify;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	padding-left: 15px;
}

.list_item {
	height: 200px;
}

.relocate {
	width: 50px;
	height: 50px;
	margin: 20px;
	float: right;
}
</style>
