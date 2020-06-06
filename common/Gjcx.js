/* 接口参数区 */
// 示例
const InterfaceAddress = [
	//获取线路信息，根据站点名称
	'https://27.148.155.9:9099/api/bus/getBusLineInfoByStationName',
	//获取离某个经纬度最近的一个站点信息，根据经纬度信息
	'https://27.148.155.9:9099/api/bus/getBusStationInfoByLonLat',
	//获取线路站点信息，根据线路编号，线路方向
	'https://27.148.155.9:9099/api/bus/getBusLineStationInfoByLineIdDirection',
	//获取车辆实时到站信息，根据线路编号，线路方向
	'https://27.148.155.9:9099/api/bus/getBusArriveLeaveStationInfoByLineIdDirection',
	//获取距离某站最近车辆信息 根据线路编号，方向，站点名称 
	'https://27.148.155.9:9099/api/bus/getBusLineArriveLeaveStationInfoByLineIdDirectionStationName',
	//根据起始点经纬度获取距离
	'https://27.148.155.9:9099/api/zhcx/getPlanningLineByLonLat',
	//获取线路轨迹定位信息，根据线路编号，线路方向
	'https://27.148.155.9:9099/api/bus/getBusLineTrajectoryByLineIdDirection',
	//获取所有线路信息
	'https://27.148.155.9:9099/api/bus/getBusLineInfo',
]
const GaoDeWebKey = [
	"2348ba1d476b5e44917533b65583f969", 
	"1df2cef2c0e71acc0ed1e90d5bf6431a"
]
// 接口声明区
export default {
	InterfaceAddress,
	GaoDeWebKey
}