
# 房屋字段描述 (未經選擇)
class RoomField:
    def __init__(self):
        self.rome = {
            'title': None,  # 房屋标题
            'city': None,  # 房屋所在城市
            'district': None,  # 房屋所在区
            'road': None,  # 房屋所在路,
             'location': None,  # 經緯度
            'community': None,  # 房屋所在小区名
            'upTime': None,  # 上传时间
            'saveTime': None,  # 保存时间
            'price': None,  # 价格
            'payType': None,  # 支付类型
            'rentalMethod': None,  # 租赁方式(整租合租等）
            'requireType': None,  # 要求类型（男女不限，限定男女等）
            'houseType': None,  # 房屋类型（公寓，商户等）
            'roomType': None,  # 户型（三室一厅）
            'areaSize': None,  # 房屋大小
            'decorateType': None,  # 装修类型（精装、毛坯）
            'ori': None,  # 房屋朝向
            'liveInfo': None,  # 入住信息（随时入住）
            'rentTimeInfo': None,  # 房屋租期
            'viewInfo': None,  # 看房信息（看房请预约）
            'floorInfo': None,  # 楼层信息
            'elevatorInfo': None,  # 电梯信息
            'carInfo': None,  # 车位信息
            'waterInfo': None,  # 用水信息
            'electrInfo': None,  # 用电信息
            'gasInfo': None,  # 燃气信息
            'heatInfo': None,  # 供暖信息
            'hasTelevision': None,  # 电视
            'hasRefrigerator': None,  # 冰箱
            'hasToilet': None,  # 卫生间
            'hasSmartLock': None,  # 智能门锁
            'hasHeat': None,  # 暖气
            'hasWashingMachine': None,  # 洗衣机
            'hasBalcony': None,  # 阳台
            'hasCook': None,  # 厨房
            'hasAirConditioner': None,  # 空调
            'hasWaterHeater': None,  # 热水器
            'hasVentilator': None,  # 油烟机
            'hasGasStove': None,  # 燃气灶
            'hasBed': None,  # 床
            'hasWardrobe': None,  # 衣柜
            'hasSofa': None,  # 沙发
            'hasWifi': None,  # 网络
            'traffic': None,  # 交通
            'roomNum': None,  # 房间个数
            'bathNum': None,  # 浴室个数
            'hallsNum': None,  # 客厅个数
            'description': None,  # 房东描述
            'picUrl': None,  # 房屋图片地址
            'picPath': None,  # 房屋图片本地路径
            'url': None,  # 房源url
            'vrInfo': None
        }


class RoomDateSet:
    def __init__(self):
        self.rome = {
            'city': None,  # 房屋所在城市
            'district': None,  # 房屋所在区
            'road': None,  # 房屋所在路,
            'community': None,  # 房屋所在小区名
            'price': None,  # 价格
            'rentalMethod': None,  # 租赁方式(整租合租等）
            'houseType': None,  # 房屋类型（公寓，商户等）
            'roomType': None,  # 户型（三室一厅）
            'areaSize': None,  # 房屋大小
            'decorateType': None,  # 装修类型（精装、毛坯）
            'ori': None,  # 房屋朝向
            'floorInfo': None,  # 楼层信息
            'hasRefrigerator': None,  # 冰箱
            'hasWashingMachine': None,  # 洗衣机
            'hasBalcony': None,  # 阳台
            'hasCook': None,  # 厨房
            'hasAirConditioner': None,  # 空调
            'hasWaterHeater': None,  # 热水器
            'hasBed': None,  # 床
            'hasWardrobe': None,  # 衣柜
            'hasSofa': None,  # 沙发
            'hasWifi': None,  # 网络
            'traffic': None,  # 交通
            'bedroomNum': None,  # 房间个数
            'bathroomNum': None,  # 浴室个数
            'hallsNum': None,  # 客厅个数
        }
