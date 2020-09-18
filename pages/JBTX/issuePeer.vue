<template>
	<view>
		<scroll-view style="height: 1020rpx;" :scroll-y='true'>
		<view>
			<view class="ps_view">
				<view style="margin-left: 40rpx;">
					<view style="padding-top: 20rpx ;">
						<text class="titleFont">标题</text>
					</view>
					<view style="padding: 20rpx 0;border-bottom: #EAEAEA 1px solid;display: flex;flex-direction: row;width: 90%;">
						<input class="contentFont" v-model="title" placeholder="请输入标题" />
					</view>
				</view>
				<view style="margin-left: 40rpx;">
					<view style="padding-top: 20rpx ;">
						<text class="titleFont">同行人数</text>
					</view>
					<view style="padding: 20rpx 0;border-bottom: #EAEAEA 1px solid;display: flex;flex-direction: row;width: 90%;">
						<input class="contentFont" type="number" v-model="people_number" placeholder="请输入可同行人数" maxlength="2" />
					</view>
				</view>
				<view style="margin-left: 40rpx;">
					<view style="padding-top: 20rpx ;">
						<text class="titleFont">预算费用</text>
					</view>
					<view style="padding: 20rpx 0;border-bottom: #EAEAEA 1px solid;display: flex;flex-direction: row;width: 90%;">
						<input class="contentFont" type="number" v-model="people_cost" placeholder="请输入预算人均费用" maxlength="5" />
					</view>
				</view>
				<view style="margin-left: 40rpx;margin-top: 30rpx;" class="titleFont">行程时间</view>
				   <view class="test">
				            {{range[0]}} - {{range[1]}}
				            <button type="primary" @click="onShowDatePicker('range')">选择日期范围</button>
				        </view>
				        <mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
			<view class="fb_Text2">主页图片</view>
			<view class="add-img-box">
				<view class="add-img-item" v-for="(item, index) in imgList" :key="index">
					<image class="add-img" @click="imgInfo(index)" :src="item.path" mode="aspectFill"></image>
					<image class="add-img-del" @click="delImg(index)" src="../../static/JBCX/delete.png"></image>
				</view>
				<view v-if="imgList.length < 1 " class="add-img-item" @click="openCamera">
					<image class="add-img" src="../../static/JBCX/add.png"></image>
				</view> 
			</view>
			</view>
			<view style="font-weight: bold;font-size: 30upx;padding-left: 34upx;padding-top: 30upx;margin-bottom: 20upx;">同行说明</view>
			<view class="container">
				<editor id="editor" show-img-size :read-only="isEdit" show-img-resize show-img-toolbar class="ql-container"
				 :placeholder="placeholder" @statuschange="onStatusChange" @ready="onEditorReady" v-model="text">
				</editor>
			</view>
			<view class="toolbar" @touchend.stop="format" :style="'bottom: ' + (isIOS ? keyboardHeight : 0) + 'px'">
				<i class="iconfont icon-charutupian" @touchend.stop="insertImage"></i>
				<i :class="'iconfont icon-format-header-1 ' + (formats.header === 1 ? 'ql-active' : '')" data-name="header"
				 :data-value="1"></i>
				<i :class="'iconfont icon-format-header-2 ' + (formats.header === 2 ? 'ql-active' : '')" data-name="header"
				 :data-value="2"></i>
				<i :class="'iconfont icon-format-header-3 ' + (formats.header === 3 ? 'ql-active' : '')" data-name="header"
				 :data-value="3"></i>
				<i :class="'iconfont icon-format-header-4 ' + (formats.header === 4 ? 'ql-active' : '')" data-name="header"
				 :data-value="4"></i>
				<i :class="'iconfont icon-format-header-5 ' + (formats.header === 5 ? 'ql-active' : '')" data-name="header"
				 :data-value="5"></i>
				<i :class="'iconfont icon-format-header-6 ' + (formats.header === 6 ? 'ql-active' : '')" data-name="header"
				 :data-value="6"></i>
				<i :class="'iconfont icon-zitijiacu ' + (formats.bold ? 'ql-active' : '')" data-name="bold"></i>
				<i :class="'iconfont icon-zitishanchuxian ' + (formats.strike ? 'ql-active' : '')" data-name="strike"></i>
				<i :class="'iconfont icon-zitixieti ' + (formats.italic ? 'ql-active' : '')" data-name="italic"></i>
				<i :class="'iconfont icon-zuoduiqi ' + (formats.align === 'left' ? 'ql-active' : '')" data-name="align" data-value="left"></i>
				<i :class="'iconfont icon-juzhongduiqi ' + (formats.align === 'center' ? 'ql-active' : '')" data-name="align"
				 data-value="center"></i>
				<i :class="'iconfont icon-youduiqi ' + (formats.align === 'right' ? 'ql-active' : '')" data-name="align" data-value="right"></i>
				<i :class="'iconfont icon-zuoyouduiqi ' + (formats.align === 'justify' ? 'ql-active' : '')" data-name="align"
				 data-value="justify"></i>
				<i :class="'iconfont icon-line-height ' + (formats.lineHeight ? 'ql-active' : '')" data-name="lineHeight" data-value="2"></i>
				<i :class="'iconfont icon-Character-Spacing ' + (formats.letterSpacing ? 'ql-active' : '')" data-name="letterSpacing"
				 data-value="2em"></i>
				<i :class="'iconfont icon-722bianjiqi_duanqianju ' + (formats.marginTop ? 'ql-active' : '')" data-name="marginTop"
				 data-value="20px"></i>
				<i :class="'iconfont icon-723bianjiqi_duanhouju ' + (formats.micon-previewarginBottom ? 'ql-active' : '')" data-name="marginBottom"
				 data-value="20px"></i>
				<i class="iconfont icon-clearedformat" @tap="removeFormat"></i>
				<i :class="'iconfont icon-font ' + (formats.fontFamily ? 'ql-active' : '')" data-name="fontFamily" data-value="Pacifico"></i>
				<i :class="'iconfont icon-fontsize ' + (formats.fontSize === '24px' ? 'ql-active' : '')" data-name="fontSize"
				 data-value="24px"></i>
				<i :class="'iconfont icon-text_color ' + (formats.color === fontColor ? 'ql-active' : '')" data-name="color"
				 :data-value="fontColor" @tap="open"></i>
				<i :class="'iconfont icon-fontbgcolor ' + (formats.backgroundColor === '#00ff00' ? 'ql-active' : '')" data-name="backgroundColor"
				 data-value="#00ff00"></i>
				<!-- 引用黄河浪的color取色器 -->
				<i class="iconfont icon-date" @tap="insertDate"></i>
				<i class="iconfont icon-undo" @tap="undo"></i>
				<i class="iconfont icon-redo" @tap="redo"></i>
				<i :class="'iconfont icon-zitixiahuaxian ' + (formats.underline ? 'ql-active' : '')" data-name="underline"></i>
				<i class="iconfont icon--checklist" data-name="list" data-value="check"></i>
				<i :class="'iconfont icon-youxupailie ' + (formats.list === 'ordered' ? 'ql-active' : '')" data-name="list"
				 data-value="ordered"></i>
				<i :class="'iconfont icon-wuxupailie ' + (formats.list === 'bullet' ? 'ql-active' : '')" data-name="list" data-value="bullet"></i>
				<i class="iconfont icon-outdent" data-name="indent" data-value="-1"></i>
				<i class="iconfont icon-indent" data-name="indent" data-value="+1"></i>
				<i class="iconfont icon-fengexian" @tap="insertDivider"></i>
				<i class="iconfont icon-preview" @tap="store" id="2"></i>
				<i :class="'iconfont icon-zitixiabiao ' + (formats.script === 'sub' ? 'ql-active' : '')" data-name="script"
				 data-value="sub"></i>
				<i :class="'iconfont icon-zitishangbiao ' + (formats.script === 'super' ? 'ql-active' : '')" data-name="script"
				 data-value="super"></i>
				<!-- <i class="iconfont icon-quanping"></i> -->
				<i class="iconfont icon-shanchu" @tap="clear"></i>
				<i :class="'iconfont icon-direction-rtl ' + (formats.direction === 'rtl' ? 'ql-active' : '')" data-name="direction"
				 data-value="rtl"></i>
				<i class="iconfont icon-baocun" @tap="store" id="1"></i>
			</view>
			<t-color-picker ref="colorPicker" :color="color" @confirm="confirm" @cancel="cancel"></t-color-picker>
		</view>
		</scroll-view>
		<view class="tjButton" @click="submitState">提交</view>
	</view>
</template>

<script>
	import MxDatePicker from '@/components/JBTX/mx-datepicker/mx-datepicker.vue';
	import tColorPicke from '@/components/JBTX/t-color-picker.vue';
	var _self;
	export default {
		components: {
			MxDatePicker,
			't-color-picker': tColorPicke,
		},
		data() {
			return {
				color: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				isEdit: false,
				fontColor: '#000',
				formats: {},
				readOnly: false,
				placeholder: '开始输入...',
				editorHeight: 300,
				keyboardHeight: 0,
				isIOS: false,
				title:'',
				people_number:'',
				people_cost:'',
				type:'range',
				timer:'',
				issueText:'',
				range: [],
				value: '',
				showPicker: false,
				text:'',
				imgList: [],
				list: [],
				cloudimgList: [],
				info: [],
				imgCount: 1, //最多支持9张上传，可以修改
				submissionState: false,
				oneImg: '',
				twoImg: '',
				threeImg: '',
			}
		},
		onLoad() {
			uni.getStorage({
				key:'userInfo',
				fail() {
					uni.showToast({
						icon:'none',
						title:'暂未登录,请登录后查看'
					})
					setTimeout(function(){
						uni.navigateTo({	
							//loginType=1,泉运登录界面
							//loginType=2,今点通登录界面
							//loginType=3,武夷股份登录界面
							url  : '/pages/GRZX/userLogin?loginType=4'
						}) 
					},500);
				}
			});
			_self = this;
			this.getTodayDate();
		},
		methods: {
			
			//---------------------------------获取当前日期---------------------------------
			getTodayDate: function() {
				/*
				当前选择时间（必须选择2天后的时间）
				*/
				var date = new Date(),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				var timer = year + '/' + month + '/' + day; //当前年月日时分
				this.range.push(timer);
				this.range.push(timer);
				this.timer=timer;
			},
		
		
		 onShowDatePicker(type){//显示
		                this.type = type;
		                this.showPicker = true;
		                this.value = this[type];
		            },
		            onSelected(e) {//选择
		                this.showPicker = false;
		                if(e) {
		                    this[this.type] = e.value; 
		                    //选择的值
		                    console.log('value => '+ e.value);
		                    //原始的Date对象
		                    console.log('date => ' + e.date);
		                }
		            },
			//-----------上传图片----------------------------------------
			openCamera() {
				uni.chooseImage({
					count: this.imgCount,
					sizeType: ['compressed'],
					success: e => {
						this.imgList = [...this.imgList, ...e.tempFiles];
					}
				});
			},
			imgInfo(i) {
				let tempList = [];
				this.imgList.forEach(img => {
					tempList.push(img.path);
				});
				console.log(tempList);
				console.log(this.imgList)
				//显示图片
				uni.previewImage({
					current: i,
					loop: false,
					urls: tempList,
					indicator: 'default'
				});
			},
			delImg(i) {
				uni.showModal({
					content: '确定删除这张吗',
					success: res => {
						if (res.confirm) { 
							this.imgList.splice(i, 1);
							this.imgCount=1;
							console.log(this.imgList)
						} else if (res.cancel) {

						}
					}
				});
			},
			submitState:function(){
				var that=this;
				if (that.title == '') {
					uni.showToast({
						title: '标题不能为空',
						icon: 'none'
					})
				}
				if (that.people_number == '') {
					uni.showToast({
						title: '结伴人数不能为空',
						icon: 'none'
					})
				}
				if (that.people_cost == '') {
					uni.showToast({
						title: '人均预算不能为空',
						icon: 'none'
					})
				}
				if (that.range[0]<=that.timer) {
					uni.showToast({
						title: '请选择当前日期之后的时间',
						icon: 'none'
					})
				};
				console.log(that.imgList);
				if (that.imgList.length==0) {
					uni.showToast({
						title: '主页图片不能为空',
						icon: 'none'
					})
				};
				this.editorCtx.getContents({
					success: function(res) {
						console.log(res);
						that.issueText=res.html;
						console.log(res.html);
						console.log(that.issueText);
					}
				});
				
				
				if (that.issueText==''||that.issueText=='开始输入') {
					uni.showToast({
						title: '请输入同行说明',
						icon: 'none'
					})
				};
				if (this.submissionState == false) {
					// this.submissionState = true;
					// this.submit();
				} else if (this.submissionState == true) {
					uni.showToast({
						title: '请勿重复点击提交',
						icon: 'none',
						duration: 2000
					})
				}
			},
			submit: function() {
				var that = this;
				console.log(that.issueText);
				uni.showLoading({
					title: '提交数据中...'
				});
					uni.getStorage({
						key: 'userInfo',
						success: (res) => {
							console.log(res)
							uni.request({
								url: 'http://218.67.107.93:9210/api/app/publish-strategy',
								method: 'POST',
								data: {
									title: that.title,
									content: that.issueText,
									imgUrl: that.imgList[0].path,
									publisher: res.data.username,
									publisherTel: res.data.phoneNumber,
									colleagueNum: that.people_number,
									cost:that.people_cost,
									startPlayTime:that.range[0],
									endPlayTime:that.range[1],
								},
								success: (res) => {
									console.log(res)
									if (res.data.msg == '发布攻略成功，待后台审核！') {
										uni.hideLoading()
										uni.showToast({
											title: '提交成功',
											success() {
												uni.navigateBack({
													url: './pictureList'
												})
											}
										})
									} else if (res.data.msg == '提交失败2分钟内请勿重复发表照片') {
										uni.hideLoading()
										uni.showToast({
											title: '每次提交请间隔两分钟',
											icon: 'none'
										})
									} else {
										uni.hideLoading()
										uni.showToast({
											title: '提交失败',
											icon: 'none'
										})
									}
								},
								fail: (res) => {
									console.log(res)
									uni.hideLoading()
									uni.showToast({
										title: '提交失败',
										icon: 'none'
									})
								}
							})
						}
					})

			},
			
			//------------------富文本--------------

			cancel() {
				this.isEdit = false;
			},
			open() {
				this.$refs.colorPicker.open();
				this.isEdit = true;
				// uni.hideKeyboard();
			},
			hideKey() {
				uni.hideKeyboard();
			},
			async confirm(e) {
				this.isEdit = false;
				this.fontColor = await e.hex;
				this.onStatusChange({
					detail: {
						color: e.hex
					}
				});
				this.$forceUpdate();
			},
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context(function(res) {
					_self.editorCtx = res.context;
				}).exec();
			},
			undo() {
				this.editorCtx.undo();
			},

			redo() {
				this.editorCtx.redo();
			},

			blur() {
				this.editorCtx.blur();
			},

			format(e) {
			var	that=this;
				// this.hideKey();
				let {
					name,
					value
				} = e.target.dataset;
				console.log(name);
				console.log(value);
				console.log(e.target.dataset);
				if (!name) return; // console.log('format', name, value)
				that.editorCtx.format(name, value);
			},

			onStatusChange(e) {
				this.formats = e.detail;
			},

			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success');
					}
				});
			},

			store(e) {
				
				this.editorCtx.getContents({
					success: function(res) {
						console.log(res);
						e.currentTarget.id == 1 ? console.log('保存内容:', res.html) : uni.navigateTo({
							url: `../preview/preview?rich=${encodeURIComponent(res.html)}`
						});
					}
				});
			},

			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success");
					}
				});
			},

			removeFormat() {
				this.editorCtx.removeFormat();
			},

			insertDate() {
				const date = new Date();
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
				this.editorCtx.insertText({
					text: formatDate
				});
			},

			insertImage() {
				// const that = this;
				uni.chooseImage({
					count: 1,
					success: function(res) {
						_self.editorCtx.insertImage({
							src: res.tempFilePaths[0],
							data: {
								id: 'abcd',
								role: 'god'
							},
							width: '80%',
							success: function() {
								console.log('insert image success');
							}
						});
					}
				});
			}
		
		}
	}
</script>

<style lang="scss">
	@import "./editor.css";
	
	page {
		background-color: #F5F7F9;
	}
	
	.titleFont {
		font-size: 36rpx;
		font-family: Source Han Sans SC;
		font-weight: bold;
		color: #333333;
	}
	
	.contentFont {
		font-size: 34rpx;
		font-family: Source Han Sans SC;
		font-weight: 400;
		color: #2C2D2D;
	}

	.ps_view {
		width: 100%;
		height:120%;
		background: #FFFFFF;
		

		.dl_choice {
			display: flex;
			font-size: 38upx;
			color: #5E5E60;
			padding-top: 41upx;
			padding-left: 20upx;
		}

		.lineClass {
			display: flex;
			align-items: center;
			justify-items: center;
			padding-left: 20upx;
			margin-top: 20upx;
			.li_input{
				width: 700upx;
				height: 60upx;
				border: 1px solid #000000;
			}
		}

		//转换图片
		.changeImage {

			width: 57upx;
			height: 59upx;
			padding-top: 44upx;
			margin: 0 auto;
		}

			.fb_Text2 {
				font-weight: bold;
				font-size: 30upx;
				padding-left: 34upx;
				padding-top: 30upx;
			}
		
			.add-img-box {
				display: flex;
				width: 750rpx;
				padding-left: 10rpx;
				flex-direction: row;
				flex-wrap: wrap;
				margin-bottom: 40rpx;
			}
		
			.add-img-item {
				width: 200rpx;
				height: 200rpx;
				border-radius: 24rpx;
				position: relative;
				padding: 9rpx 0;
				margin-left: 20rpx;
			}
		
			.add-img {
				width: 200rpx;
				height: 200rpx;
				margin-top: 32upx;
				margin-left: 20upx;
				border-radius: 24rpx;
			}
		
			.add-img-del {
				position: absolute;
				width: 40rpx;
				height: 40rpx;
				right: -23rpx;
				top: 23rpx;
				border-radius: 20rpx;
			}
		
	}

	.fb_view3 {
		margin-top: 200upx;
		margin-left: 70upx;

		.fb_btn {
			width: 600upx;
			height: 100upx;
			border-radius: 12upx;
			background: #FC4646;
			color: #FFFFFF;
		}

		.fb_text {
			padding-left: 180upx;
			padding-top: 30upx;
			font-size: 32upx;
		}
	}

	.tjButton {
		position: fixed;
		bottom: 50upx;
		left: 0;
		right: 0;
		padding: 24upx 0;
		border-radius: 64upx;
		margin: 0 40upx;
		background: #FC4646;
		text-align: center;
		color: #FFFFFF;
		font-size: 38upx;
		font-weight: 400;
		box-shadow: 0px 0.2px 0px #aaa;
	}
	 .test{
	        text-align: center;
	        padding: 10px 0;
	    }
	 button{
	        margin: 20upx;
	        font-size: 28upx;
	    }
</style>
