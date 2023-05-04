import pandas as pd
import pymysql
from bs4.element import NavigableString
import csv

from pymysql import Connection


class DataBase:
    def __init__(self, host, user, password, database):
        self.cursor = None
        self.db: Connection = None
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.sql = "insert  into room_data (" \
                   "url, title, city, district, road," \
                   "community, upTime, saveTime, price, rentalMethod," \
                   "requireType, houseType, roomType, areaSize, decorateType," \
                   "ori, liveInfo, rentTimeInfo, viewInfo, floorInfo," \
                   "elevatorInfo, carInfo, waterInfo, electrInfo, gasInfo," \
                   "heatInfo, hasTelevision, hasRefrigerator, hasWashingMachine, hasBalcony," \
                   "hasCook, hasAirConditioner, hasWaterHeater, hasBed, hasWardrobe," \
                   "hasSofa, hasWifi, traffic, bedroomNum, bathroomNum," \
                   "hallsNum,description,pic,vrInfo)" \
                   " values(" \
                   "%s,%s,%s,%s,%s," \
                   "%s,%s,%s,%s,%s," \
                   "%s,%s,%s,%s,%s," \
                   "%s,%s,%s,%s,%s," \
                   "%s,%s,%s,%s,%s," \
                   "%s,%s,%s,%s,%s," \
                   "%s,%s,%s,%s,%s," \
                   "%s,%s,%s,%s,%s," \
                   "%s,%s,%s,%s)"

    # 初始化mysql连接
    def initConnect(self):
        try:
            self.db = pymysql.connect(host=self.host, user=self.user, password=self.password, database=self.database)

            print('mysql connection success!')
        except pymysql.OperationalError as e:
            print(e)
            print('mysql connection failed!')

    # 插入数据
    def insertionData(self, room_data):
        self.cursor = self.db.cursor()
        try:
            data = [room_data['url'], room_data['title'], room_data['city'], room_data['district'], room_data['road'],
                    room_data['community'], room_data['upTime'], room_data['saveTime'], room_data['price'],
                    room_data['rentalMethod'],
                    room_data['requireType'], room_data['houseType'], room_data['roomType'], room_data['areaSize'],
                    room_data['decorateType'],
                    room_data['ori'], room_data['liveInfo'], room_data['rentTimeInfo'], room_data['viewInfo'],
                    room_data['floorInfo'],
                    room_data['elevatorInfo'], room_data['carInfo'], room_data['waterInfo'], room_data['electrInfo'],
                    room_data['gasInfo'],
                    room_data['heatInfo'], room_data['hasTelevision'], room_data['hasRefrigerator'],
                    room_data['hasWashingMachine'], room_data['hasBalcony'],
                    room_data['hasCook'], room_data['hasAirConditioner'], room_data['hasWaterHeater'],
                    room_data['hasBed'], room_data['hasWardrobe'],
                    room_data['hasSofa'], room_data['hasWifi'], room_data['traffic'], room_data['roomNum'],
                    room_data['bathNum'],
                    room_data['hallsNum'],
                    room_data['description'],
                    room_data['picUrl'],
                    room_data['vrInfo']
                    ]
            # trainedData = [
            #     room_data['title']
            # ]
            tuple_data = tuple(data)
            self.cursor.execute(self.sql, tuple_data)
            self.db.commit()
            print('写入数据库成功')
        except Exception as e:
            # self.db.rollback()

            print('写入数据库失败')
            print(e)
