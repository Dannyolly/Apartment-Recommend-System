"""
@author:dannyolly
@Time: 2023/4/11
@desc: key map .

"""
cols = [
    'id', 'city', 'district', 'road', 'community',
    'price', 'areaSize', 'ori', 'floorInfo',
    'hasRefrigerator', 'hasWashingMachine',
    'hasBalcony', 'hasCook', 'has_air_conditioner',
    'hasBed', 'hasWardrobe', 'hasSofa',
    'has_wifi', 'bedroomNum', 'bathroomNum', 'hallsNum'
]
cities = {
    '上海': 'Shanghai',
    '珠海': 'Zhuhai',
    '广州': 'Guangzhou',
    '深圳': 'Shenzhen',
    '武汉': 'Wuhan'
}


DataMapKey = {
    'fileName': 'fileName',
    'tableName': 'tableName'
}



class DataMap:
    BROWSEHISTORY = {
        'fileName': "browse_history",
        'tableName': 'browse_history'
    }
    FOLLOW = {
        'fileName': 'follow',
        'tableName': 'follows'
    }
    ROOM = {
        'fileName': 'room',
        'tableName': 'room_dataset'
    }

