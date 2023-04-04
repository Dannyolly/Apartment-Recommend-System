import { get } from "@/api/request";
interface Location {
    status: string;
    info: string;
    infocode: string;
    count: string;
    geocodes: Geocode[];
}

interface Geocode {
    formatted_address: string;
    country: string;
    province: string;
    citycode: string;
    city: string;
    district: string;
    township: any[];
    neighborhood: Neighborhood;
    building: Neighborhood;
    adcode: string;
    street: string;
    number: string;
    /**
     * 經緯度
     */
    location: string;
    level: string;
}

interface Neighborhood {
    name: any[];
    type: any[];
}
const mapKey = "64008c66a4ecb4ec16cb77939caa388f"
export function getLocation():Promise<{
    latitude: number,
    longitude: number,
    address?: string
}>{
    return new Promise((resolve, rej) => {
        uni.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
                console.log('authroized!!!!');

                let location = uni.getStorageSync('location');
                console.log(location);

                if (!location) {
                    // 未授权
                    uni.getLocation({
                        type: 'gcj02',
                        geocode: true,
                        success: ({ latitude, longitude, address }) => {
                            uni.setStorage({
                                key: 'location',
                                data: {
                                    latitude, longitude
                                }
                            });
                            // 定位成功 回调
                            resolve({ latitude, longitude, address })
                        },
                        fail: (err) => {
                            // 失败 回调
                            rej(err)
                        }
                    })
                } else {
                    // 已授权 回调
                    resolve(location)
                }
            },
            fail: (err) => {
                // 执行失败，弹窗提示是否授权
                console.log(err, 'unAuth');
                isOpenAuth()
            }
        })
    })

}

export function loadCity(longitude: number, latitude: number): Promise<{
    locationDetail: any,
    city: string
}> {
    return new Promise((resolve, rej) => {
        const url = 'https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=' +
            longitude +
            ',' +
            latitude +
            '&key=' +
            mapKey +
            '&radius=1000&extensions=all'
        uni.request({
            header: {
                'Content-Type': 'application/text',
            },
            //注意:这里的key值需要高德地图的 web服务生成的key  只有web服务才有逆地理编码
            url
            ,
            success(res) {
                console.log(res);

                if (res.statusCode === 200) {
                    //@ts-ignore
                    let city = res.data.regeocode.addressComponent.city
                    resolve({
                        //@ts-ignore
                        locationDetail: res.data.regeocode,
                        city
                    })
                } else {
                    console.log('获取信息失败，请重试！')
                }
            },
            fail(result) {
                rej(result)
            },
        })
    })
}

export function isOpenAuth() {
    return new Promise((resolve, rej) => {
        uni.showModal({
            content: '由于您还没有允许授权位置，无法定位，请点击确定允许授权',
            success: (res) => {
                if (res.confirm) {
                    uni.openSetting({
                        success: (result) => {
                            if (result.authSetting['scope.userLocation']) {
                                // 引导用户授权成功 调用获取位置接口
                                resolve('OK')
                            } else {
                                // console.log('失败')
                            }
                        }
                    });
                } else {
                    uni.navigateBack({
                        delta: 1
                    })
                }
            }
        });
    })

}


export function getLocationByAddress(address: string): Promise<Location> {
    return new Promise((resolve, rej) => {
        uni.request({
            url: 'https://restapi.amap.com/v3/geocode/geo',
            data: {
                address,
                city: '武汉',
                key:mapKey
            },
            method: 'GET',
            success: ({ data, statusCode, header, cookies }) => {
                let realData = data as unknown as Location
                resolve(realData)
            },
            fail: ({ errMsg }) => {
                rej(errMsg)
            }
        })
    })
}
