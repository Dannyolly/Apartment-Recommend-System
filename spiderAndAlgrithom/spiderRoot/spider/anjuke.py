import bs4
import requests
from requests.exceptions import RequestException
import re
import time
import uuid
from bs4 import BeautifulSoup
import string
import lxml
import datetime
import pymysql
import sys
import random
import threading
from fake_useragent import UserAgent
from spiderRoot.spider.room import RoomField
from spiderRoot.spider.city import City
from spiderRoot.database.sqldb import DataBase
from typing import List, Dict
from urllib import parse
import json
from sklearn.feature_extraction.text import CountVectorizer

threads = []

"""
name:爬虫类
description:加载房屋对象，创建代理ip池，加载浏览器代理库
time:2023-01-10
author:dannyolly 
"""


class Spider:
    def __init__(self, cityList: List[str], room: Dict, db: DataBase):
        self.cityList = cityList  # 加载城市信息
        self.room = room  # 初始化房屋对象
        self.db = db  # 初始化数据库对象
        self.ua = None  # 初始化ua对象
        self.db.initConnect()
        self.proxies = None
        self.proxy = None

    # 获取代理ip
    def getProxies(self):
        """
        # 获取代理ip
        """
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
        }
        response = requests.get('http://www.89ip.cn/tqdl.html?num=100&address=&kill_address=&port=&kill_port=&isp=',
                                headers=headers)
        if response.status_code == 200:
            content = response.text
            text = BeautifulSoup(content, 'lxml')
            pattern = re.compile(r'\d+.\d+.\d+.\d+:\d+')
            number = text.find(attrs={'style': 'padding-left:20px;'})
            ipList = re.findall(pattern, str(number))
            print('成功创建ip代理池')
            self.proxies = ipList
            self.proxy = self.proxies[random.randint(0, len(self.proxies))]

    # 获取useragent代理库
    def getUserAgent(self):
        """
        # 获取useragent代理库
        """
        while True:
            try:
                self.ua = UserAgent().random
                print('成功获取useragent库')
                return self.ua
            except Exception as e:
                print(e)
                print('连接useragent库出错，正在准备重新连接...')

    # 获取房屋信息页面
    def getXmlByUrl(self, url: str, isPic=False):
        """
        获取房屋信息页面
        """
        userAgent = self.ua
        headers = {
            'User-Agent': userAgent,
        }
        # proxy = {
        #     'http': 'http://' + self.proxy,
        #     # 'https': self.proxy
        # }
        try:
            response = requests.get(url=url, headers=headers)
            if response.status_code == 200:
                if isPic:
                    return response.content
                return response.text
        except requests.exceptions.ConnectionError:
            print("Connection refused")

    # 根據url 獲取lxml
    def getTextByLink(self, url: str):
        """
        根據url 獲取lxml
        """
        userAgent = self.ua
        headers = {
            'User-Agent': userAgent,
        }
        # proxy = {
        #     'http': 'http://' + self.proxy,
        #     # 'https': self.proxy
        # }
        try:
            response = requests.get(url=url, headers=headers)
            if response.status_code == 200:
                return response.text
        except requests.exceptions.ConnectionError:
            print("Connection refused")

    # 提取房屋信息
    def getHousingInfo(self, content):
        """
        提取房屋信息
        """
        room = self.room
        soup = BeautifulSoup(content, 'lxml')
        room['title'] = soup.find_all(attrs={'class': 'house-title'})[0].div.string
        payType = soup.find_all(attrs={'class': 'full-line cf'})
        room['payType'] = payType[0].find(attrs={'class': 'type'}).string
        room['price'] = soup.find_all(attrs={'class': 'light'})[0].em.string
        house_text = soup.find_all(attrs={'class': 'house-info-item'})
        location_text = soup.find_all(attrs={'_soj': 'propview'})
        room['community'] = location_text[0].string  # 区、小区、路
        room['district'] = location_text[1].string
        room['road'] = location_text[2].string

        ifo = []
        for i in range(len(house_text)):  # 面积，户型，朝向，装修类型
            info_item = house_text[i].find_all(attrs={'class': 'info'})
            if i == 0:
                string = re.sub("[A-Za-z\!\"\<\>\,\=\;\:\[\]\-\/\s]", "", str(info_item))  # 户型信息提取
                ifo.append(string)
            if info_item and i != 0:
                ifo.append(info_item[0].string)
        room['roomType'] = ifo[0]
        room['areaSize'] = ifo[1].replace("平方米", "")
        room['ori'] = ifo[2]
        room['floorInfo'] = ifo[3]
        room['decorateType'] = ifo[4]
        room['houseType'] = ifo[5]
        room_nums = re.findall('\d+', ifo[0])
        if (len(room_nums) == 3):
            room['roomNum'] = room_nums[0]
            room['hallsNum'] = room_nums[1]
            room['bathNum'] = room_nums[2]
        peitao_text = soup.find_all(attrs={'class': 'peitao-item'})  # 房屋配套信息
        peitao_list = []
        for i in range(16):
            peitao_list.append(0)
        for i in range(len(peitao_text)):
            if (peitao_text[i]['class'] == ['peitao-item', 'has']):
                peitao_list[i] = 1
        flag = 0
        peitaoType = soup.find_all(attrs={'class': 'mod-title bottomed'})
        for item in peitaoType:
            if (item.h2):
                if (item.h2.string == '房屋配套'):
                    flag = 1  # 置赋值标记
                    room['hasRefrigerator'] = peitao_list[0]
                    room['hasWashingMachine'] = peitao_list[1]
                    room['hasWaterHeater'] = peitao_list[2]
                    room['hasWifi'] = peitao_list[3]
                    room['hasSofa'] = peitao_list[4]
                    room['hasVentilator'] = peitao_list[5]
                    room['hasGasStove'] = peitao_list[6]
                    room['hasCook'] = peitao_list[7]
                    room['hasTV'] = peitao_list[8]
                    room['hasAirConditioner'] = peitao_list[9]
                    room['hasWardrobe'] = peitao_list[10]
                    room['hasBed'] = peitao_list[11]
                    room['hasToilet'] = peitao_list[12]
                    room['hasSmartLock'] = peitao_list[13]
                    room['hasBalcony'] = peitao_list[14]
                    room['hasHeat'] = peitao_list[15]
                    break

        # print(peitaoType)
        # print(peitao_text)
        if (flag != 1):
            room['hasTV'] = peitao_list[0]
            room['hasAirConditioner'] = peitao_list[1]
            room['hasWardrobe'] = peitao_list[2]
            room['hasBed'] = peitao_list[3]
            room['hasToilet'] = peitao_list[4]
            room['hasSmartLock'] = peitao_list[5]
            room['hasBalcony'] = peitao_list[6]
            room['hasHeat'] = peitao_list[7]
            room['hasRefrigerator'] = peitao_list[8]
            room['hasWashingMachine'] = peitao_list[9]
            room['hasWaterHeater'] = peitao_list[10]
            room['hasWifi'] = peitao_list[11]
            room['hasSofa'] = peitao_list[12]
            room['hasVentilator'] = peitao_list[13]
            room['hasGasStove'] = peitao_list[14]
            room['hasCook'] = peitao_list[15]
        fabu_text = soup.find_all(attrs={'class': 'right-info'})
        upTime = re.findall('b.*?>(.*?)<', str(fabu_text[0]))
        room['upTime'] = upTime[0]
        pic = soup.find_all(attrs={'height': '450'})
        imageUrl = []
        for i in range(len(pic)):
            if (pic[i].has_attr('trainedData-src')):
                imageUrl.append(str(pic[i]['trainedData-src']))
        room['picUrl'] = str(imageUrl)

        # 保存图片

        # room['picPath'] = self.getImage(imageUrl=imageUrl)
        rentalMethod = soup.find(class_='rent')  # 租赁方式
        traffic = soup.find(class_='subway')  # 交通信息
        room['rentalMethod'] = rentalMethod.string
        room['traffic'] = traffic.string
        description = soup.find(class_='auto-general')
        result = re.sub('<.*?>', '', str(description))
        room['description'] = re.sub('\n', '', str(result))
        return room

    # 提取房东评论"
    @staticmethod
    def extractOwnerComment(txt):
        """提取房东评论"""
        pattern = re.compile("[\u4e00-\u9fa5]")
        return "".join(pattern.findall(txt))

    # 获取城市地址信息
    def getCityLink(self):
        return self.cityList

    # 城市网址拼接
    @staticmethod
    def splicingCityLink(cityList, house=True):
        """城市网址拼接"""
        for i in range(len(cityList)):
            if house is True:
                cityList[i]['url'] = cityList[i]['url'] + str('/fangyuan/vr1-')
            else:
                cityList[i]['url'] = cityList[i]['url'] + str('/fangyuan/')
        return cityList

    # 獲取vr info
    def getVRInfo(self, content):
        baseUrl = "https://apphouse.58.com/api/detail/vrpano"
        params = {}
        userAgent = self.ua
        headers = {
            'User-Agent': userAgent,
        }

        soup = BeautifulSoup(content, 'lxml')
        res = soup.find('iframe')
        # response = requests.get(url=baseUrl, params=params, headers=self.getUserAgent())
        iframeSrc = res['src']
        params = parse.parse_qs(parse.urlparse(iframeSrc).query)

        resultUrl = baseUrl + '?' + parse.urlparse(iframeSrc).query
        for key in params:
            if key == 'params':
                params[key] = json.dumps(eval(params[key][0]))
            else:
                params[key] = int(params[key][0])
        # 這是VR 接口  - VR相關信息...

        # response = requests.get(url=baseUrl, params=params, headers=headers)
        self.room['vrInfo'] = resultUrl
        print(resultUrl)

    @staticmethod
    def getAllRoomUrlByPage(content):
        roomUrls = []
        items = content
        for m in range(len(items)):  # 获取页面中所有房源url
            roomUrls.append(items[m].attrs['link'])
        print('当前页面房源个数：%s' % len(roomUrls))
        return roomUrls

    def handleDetailPage(self, roomUrls, city, sleepTime, stopFlag, startPage, sum):
        count = 0
        length = len(roomUrls)
        i = 0
        while True:  # 单个房源信息提取
            if i == length:
                break
            item = roomUrls[i]
            try:
                content = self.getXmlByUrl(item)
                room = self.getHousingInfo(content)
                # self.getVRInfo(content)
                room['url'] = item
                room['city'] = city['name']
                room['saveTime'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                count += 1
                i += 1
                print('第：%s 条' % count)
                self.db.insertionData(room_data=room)
                time.sleep(random.randint(3, 6))
            except Exception as e:
                i += 1
                time.sleep(sleepTime)
                continue
            if stopFlag is None:  # 没有下一页时跳出
                self.db.cursor.close()  # 关闭数据库连接
                self.db.db.close()
                break
            startPage += 1
            sum += count
            time.sleep(sleepTime)
            print('总共已爬取%d条' % sum)

    # 获取某個城市房源信息
    def getCityInfo(self, city, sleepTime, startPage=1):
        """
        # 获取每个城市房源信息
        """
        base_url = city['url']
        sum = 0
        j = startPage
        while True:
            print('正在爬取第%s页' % j)
            pageUrl = base_url + 'p' + str(j) + '/'
            # 獲取公寓頁面
            roomsPageXml = self.getXmlByUrl(url=pageUrl)
            soup = BeautifulSoup(roomsPageXml, 'lxml')
            # 停止標誌..
            stopFlag = soup.find(attrs={'class': 'aNxt'})
            # 所有公寓詳情頁面
            roomsXml = soup.find_all(attrs={'class': 'zu-itemmod'})
            # 獲取所有url
            roomUrls = self.getAllRoomUrlByPage(roomsXml)
            time.sleep(3)
            # 獲取詳情頁面
            self.handleDetailPage(roomUrls, city, sleepTime, stopFlag, startPage, sum)

    # 獲取社區列表
    def getCommunityLinkListText(self, url):
        communityText = self.getTextByLink(url)
        community_soup = BeautifulSoup(communityText, 'lxml')
        return community_soup.find(attrs={'class': 'sub-items sub-level2'})

    # 獲取城市所有地區
    def getCityArea(self, city, cityName):

        pageUrl = city['url']
        text = self.getXmlByUrl(url=pageUrl)
        soup = BeautifulSoup(text, 'lxml')
        # 獲取區域url 如洪山區的url
        areaLinkList = []
        linkListText = soup.find(attrs={'class': 'sub-items sub-level1'})
        linkList = linkListText.findAll(name='a')
        linkList.pop(0)
        linkList.pop()
        linkList.pop()
        for i in range(len(linkList)):
            areaLink = linkList[i]
            areaAttr = {
                'title': areaLink.text,
                'url': areaLink.attrs['href'],
                'community': [

                ]
            }
            print(areaAttr['url'])
            print(areaAttr)
            time.sleep(2)
            communityLinkListText = None
            while True:
                communityLinkListText = self.getCommunityLinkListText(areaAttr['url'])
                if communityLinkListText is not None:
                    break
                else:
                    time.sleep(2)
                    continue
            communityLinkList = communityLinkListText.find_all(name='a')
            for index in range(len(communityLinkList)):
                communityLink = communityLinkList[index]
                areaAttr['community'].append(communityLink.text)
                # time.sleep(2)
            print(areaAttr)
            areaLinkList.append(areaAttr)
        filename = f"{cityName}.json"
        with open(filename, 'w', encoding='utf8') as file_obj:
            json.dump(areaLinkList, file_obj, ensure_ascii=False, indent=2)

    @staticmethod
    def getAllCityArea(cityList, spider):
        for i in range(cityList):
            cityItem = cityList[i]
            spider.getCityArea(city=cityList[i], cityName=cityItem['name'])


def setup():
    db = DataBase(host='127.0.0.1', user='root', password='123456', database='house')
    house = RoomField()
    city = City()
    # 初始化房源对象
    anjuke = Spider(room=house.rome, cityList=city.cityList, db=db)
    # 加载浏览器代理库
    anjuke.getUserAgent()
    # 获取各个城市房源分站链接
    anjuke.getProxies()
    city_init_list = anjuke.getCityLink()
    cityList = Spider.splicingCityLink(city_init_list, False)
    return anjuke, cityList


if __name__ == '__main__':
    aujuke, cityList = setup()
    # 收集城市的區域
    # anjuke.getCityArea(city=cityList[5], cityName=city.cityList[5]['name'])
    # 收集所有城市的區域
    # anjuke.getAllCityArea(spiderRoot=anjuke, cityList=cityList)
    # 对单个城市房源进行爬取
    aujuke.getCityInfo(city=cityList[5], sleepTime=3, startPage=0)
