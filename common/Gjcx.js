/* 接口参数区 */
// 示例
const InterfaceAddress = [
	//获取线路信息，根据站点名称
	'http://218.67.107.93:9267/api/Bus/getBusLineInfoByStationName',
	//获取离某个经纬度最近的一个站点信息，根据经纬度信息
	'http://218.67.107.93:9267/api/Bus/getBusStationInfoByLonLat',
	//获取线路站点信息，根据线路编号，线路方向
	'http://218.67.107.93:9267/api/Bus/getBusLineStationInfoByLineIdDirection',
	//获取车辆实时到站信息，根据线路编号，线路方向
	'http://218.67.107.93:9267/api/Bus/getBusArriveLeaveStationInfoByLineIdDirection',
	//获取距离某站最近车辆信息 根据线路编号，方向，站点名称 
	'http://218.67.107.93:9267/api/Bus/getBusLineArriveLeaveStationInfoByLineIdDirectionStationName',
	//根据起始点经纬度获取距离
	'http://218.67.107.93:9267/api/zhcx/getPlanningLineByLonLat',
	//获取线路轨迹定位信息，根据线路编号，线路方向
	'http://218.67.107.93:9267/api/Bus/getBusLineTrajectoryByLineIdDirection',
	//获取所有线路信息
	'http://218.67.107.93:9267/api/Bus/getBusLineInfo',
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