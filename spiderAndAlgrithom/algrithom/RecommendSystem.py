from ordered_set import OrderedSet
from flask_apscheduler import APScheduler
from pandas import DataFrame, Index
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import pairwise_distances
from datetime import datetime
from numpy import ndarray
import numpy as np
from flask import Flask, request, Response, jsonify, current_app
import json
from spiderRoot.database.sqldb import DataBase
from cache import cfFileCache, roomFileCache, followFileCache
from constant import cols, cities, DataMapKey, DataMap

"""
@author:dannyolly
@projectStartTime: 2023/1/1
@desc: Housing RecommendSystem that provide users to find items which they interesting in.
       3 type as follows:
            1. content based -- recommend similar items 
            2. user based collaborative filter -- recommend similar items from users 
            3. user based collaborative filter -- recommend similar users from users


"""

app = Flask('HousingRecommendSystem')

db = DataBase(host='127.0.0.1', user='root', password='123456', database='house')

scheduler = APScheduler()


def calTime(cb):
    startTime = datetime.now()
    cb()
    endTime = datetime.now()
    print((endTime - startTime))


def calculateFollowSimilarity():
    data: DataFrame = pd.read_csv('../dataset/follow_dataset.csv')
    userSimilarity: ndarray = 1 - pairwise_distances(data.values.astype(bool), metric='jaccard')
    df = pd.DataFrame(data=userSimilarity)
    df.to_csv('../trainedData/user_similarity.csv')


def calculateBrowseHistorySimilarity():
    data: DataFrame = pd.read_csv('../dataset/browse_history_dataset.csv')
    userSimilarity: ndarray = 1 - pairwise_distances(data.values.astype(bool), metric='jaccard')
    df = pd.DataFrame(data=userSimilarity)
    df.to_csv('../trainedData/user_based_room_similarity.csv')


def cosineSimilarityRoomRes(city: str, isSave=True):
    # 讀取文件
    data = pd.read_csv('../dataset/room_dataset.csv')
    # 選擇城市
    city_room: DataFrame = data[data['city'] == city]
    # 重置索引
    city_room.reset_index(inplace=True, drop=True)

    ids = city_room['id']
    # one - hot
    codeResult = pd.get_dummies(city_room)
    # 歸一化
    standardResult = MinMaxScaler().fit_transform(codeResult)
    # cosine 相似度
    itemSimilarity: ndarray = cosine_similarity(standardResult)

    dataframe = pd.DataFrame(data=itemSimilarity[0:, 0:])

    idListDf = pd.DataFrame(ids)
    # print(dataframe)
    if isSave:
        idListDf.to_csv(f'../trainedData/{cities[city]}_cosineIds.csv')
        dataframe.to_csv(f'../trainedData/{cities[city]}_cosineRes.csv')
        print(f'the calculation of {cities[city]} has done')


@scheduler.task('cron', id='recall_stage', day='*', hour='5', minute='50', second='0')
def recall():
    DataLoader.loadInfoFromMysql(
        fileName=DataMap.BROWSEHISTORY[DataMapKey['fileName']],
        tableName=DataMap.BROWSEHISTORY[DataMapKey['tableName']]
    )

    DataLoader.loadInfoFromMysql(
        fileName=DataMap.ROOM[DataMapKey['fileName']],
        tableName=DataMap.ROOM[DataMapKey['tableName']]
    )

    DataLoader.loadInfoFromMysql(
        fileName=DataMap.FOLLOW[DataMapKey['fileName']],
        tableName=DataMap.FOLLOW[DataMapKey['tableName']]
    )


@scheduler.task('cron', id='train_stage', day='*', hour='6', minute='0', second='0')
def Training():
    RecommendModel.trainingCityDataByCity(city='武汉')
    RecommendModel.trainingBrowseHistoryData()
    RecommendModel.trainingFollowData()


# 加載數據庫資料變為csv
class DataLoader:
    """
     fileName  : DataType
     tableName : TableName
    """

    @staticmethod
    def loadInfoFromMysql(fileName, tableName):
        cursor = db.db.cursor()
        sql = f"select * from {tableName}"
        cursor.execute(sql)
        des = cursor.description
        title = [each[0] for each in des]
        # 拿到数据库查询的内容
        result_list = []
        for each in cursor.fetchall():
            result_list.append(list(each))

        # 保存成dataframe
        df_dealed = pd.DataFrame(result_list, columns=title)

        if fileName == DataMap.ROOM[DataMapKey['fileName']]:
            df_dealed.to_csv(f"{fileName}_dataset.csv", index=None, encoding='utf_8')
        else:
            df_dealed.to_csv(f"{fileName}_data.csv", index=None, encoding='utf_8')


class PreProcessor:
    # 下面兩個方法把矩陣壓成1 對 多
    """
    userid  action                          2   3
    1       2                   userid 1    1   1
    1       3           ===>
    """

    # 針對follows 作處理
    @staticmethod
    def transformFollowsToDataSet():
        data: DataFrame = pd.read_csv('../dataset/follow_data.csv')
        dataList = []
        dict = {}
        for rowIndex, rowData in data.iterrows():
            userId = int(rowData['user_id'])
            followId = int(rowData['follow_id'])
            if dict.get(userId) is None:
                arr = np.pad([], (0, 500))
                arrList: list = arr.tolist()
                arrList[followId - 1] = 1
                dict.setdefault(userId, arrList)
            else:
                origin = dict.get(userId)
                origin[followId - 1] = 1
                dict.update({userId: origin})
        for key in dict.keys():
            dataList.append(dict[key])
        df = pd.DataFrame(dataList)
        df.to_csv('../dataset/follow_dataset.csv')

    # 針對history 作處理
    @staticmethod
    def transformBrowseHistoryToDataSet():
        data: DataFrame = pd.read_csv('../dataset/browse_history_data.csv')
        dataList = []
        dict = {}
        for rowIndex, rowData in data.iterrows():
            userId = int(rowData['user_id'])
            roomId = int(rowData['room_id'])
            if dict.get(userId) is None:
                arr = np.pad([], (0, 1975))
                arrList: list = arr.tolist()
                arrList[roomId - 1] = 1
                dict.setdefault(userId, arrList)
            else:
                origin = dict.get(userId)
                origin[roomId - 1] = 1
                dict.update({userId: origin})
        for key in dict.keys():
            dataList.append(dict[key])
        df = pd.DataFrame(dataList)
        df.to_csv('../dataset/browse_history_dataset.csv')


class RecommendModel:
    @staticmethod
    def trainingCityDataByCity(city):
        cosineSimilarityRoomRes(city)

    @staticmethod
    def trainingFollowData():
        calculateFollowSimilarity()

    @staticmethod
    def trainingBrowseHistoryData():
        calculateBrowseHistorySimilarity()

    # 公寓相似推薦
    @staticmethod
    def preLoadingByCity(cityName):
        startTime = datetime.now()
        city = cities[cityName]
        roomFileCache[cityName]['ids'] = pd.read_csv(f'../trainedData/{city}_cosineIds.csv')
        roomFileCache[cityName]['trainedData'] = pd.read_csv(f'../trainedData/{city}_cosineRes.csv')
        endTime = datetime.now()
        print((endTime - startTime))
        print('Loaded city ')

    # 加載用戶推薦
    @staticmethod
    def preLoadingUserSimilarity():
        startTime = datetime.now()
        followFileCache['userSimilarity'] = pd.read_csv('../trainedData/user_similarity.csv')
        followFileCache['followDataset'] = pd.read_csv('../dataset/follow_dataset.csv')
        endTime = datetime.now()
        print((endTime - startTime))
        print('Loaded user similarity metrics ')

    # 加載基于協同過濾的公寓推薦
    @staticmethod
    def preLoadingUserBasedCF():
        startTime = datetime.now()
        cfFileCache['user_based'] = pd.read_csv('../trainedData/user_based_room_similarity.csv')
        cfFileCache['browse_history'] = pd.read_csv('../dataset/browse_history_dataset.csv')
        endTime = datetime.now()
        print((endTime - startTime))
        print('Loaded user-based room similarity metrics ')

    @staticmethod
    def preLoadingAll():
        # for key in roomFileCache:
        #     city = cities[key]
        #     roomFileCache[key]['ids'] = pd.read_csv(f'../trainedData/{city}_cosineIds.csv')
        #     roomFileCache[key]['trainedData'] = pd.read_csv(f'../trainedData/{city}_cosineRes.csv')
        startTime = datetime.now()
        RecommendModel.preLoadingUserSimilarity()
        RecommendModel.preLoadingByCity('武汉')
        RecommendModel.preLoadingUserBasedCF()
        endTime = datetime.now()
        print((endTime - startTime))
        print('Loaded all trainedData ')


@app.route('/expect/<city>/<int:houseId>/<int:num>')
def getTopXSimilarityItems(city: str, houseId: int, num=5):
    # 讀取矩陣 和 對應的id
    startTime = datetime.now()
    resDF = None
    if roomFileCache[city]['trainedData'] is not None:
        resDF = roomFileCache[city]['trainedData']
    else:
        roomFileCache[city]['trainedData'] = pd.read_csv(f'../trainedData/{cities[city]}_cosineRes.csv')
        roomFileCache[city]['ids'] = pd.read_csv(f'../trainedData/{cities[city]}_cosineIds.csv')
        resDF = roomFileCache[city]['trainedData']
    endTime = datetime.now()
    print((endTime - startTime))
    # 把id轉為list
    realIds = roomFileCache[city]['ids']['id'].tolist()
    # 獲取對應行的index
    houseIdIndex = realIds.index(houseId)
    # 獲取對應的行
    firstRow: ndarray = resDF.values[houseIdIndex]
    # 把對應的行轉為list
    res: list = firstRow.tolist()
    # 刪除首列 -- 序號
    del (res[0])
    # 浅拷贝并排序
    originRes = res.copy()
    res.sort(reverse=True)

    # ids
    ids = []
    originIds = [houseIdIndex]
    values = []

    for index in range(0, num + 1):
        target = res[index]
        targetIndex = originRes.index(target)
        values.append(target)
        if realIds[targetIndex] != houseId:
            ids.append(realIds[targetIndex])
            originIds.append(targetIndex)

    return json.dumps({
        'code': 200,
        'state': 1,
        'message': "OK",
        'houseIds': ids,
    })



@app.route('/expect/user/<int:userId>')
def getTopXSimilarityUser(userId, num=9):
    user_df: DataFrame = followFileCache['userSimilarity']
    follow_df: DataFrame = followFileCache['followDataset']

    # 排序結果..
    user_df: DataFrame = user_df.loc[userId - 1]
    user_df_sorted = user_df.sort_values(ascending=False)
    top5 = list(user_df_sorted.index[2:5])

    # 找出原本用戶所關注的人
    origin_user_df_row: DataFrame = follow_df.loc[userId - 1]
    origin_user_df_row: Index = origin_user_df_row.replace(0, np.nan).dropna().index
    origin_user_df_row_list: list = origin_user_df_row.tolist()
    origin_user_df_row_list.remove(origin_user_df_row_list[0])

    # 結果集
    # 提取top3相似的人
    # 每個list都取前9位
    res_list = []
    for userIdKey in top5:
        res = OrderedSet()

        # 找出相似用戶所關注的人
        similar_user_df_row: DataFrame = follow_df.loc[int(userIdKey)]
        similar_user_df_row: Index = similar_user_df_row.replace(0, np.nan).dropna().index

        similar_user_df_row_list: list = similar_user_df_row.tolist()
        similar_user_df_row_list.remove(similar_user_df_row_list[0])
        res = res.union(OrderedSet(similar_user_df_row_list))

        # 過濾已關注的人
        res -= OrderedSet(origin_user_df_row_list)

        # 存到數組
        res_list.extend(list(res)[:num])
    # 去重 有可能重覆
    res_list = list(OrderedSet(res_list))
    res_list.remove(res_list[0])

    # 全部轉為int
    res_list = list(map(lambda x: int(x) + 1, res_list[:num]))
    return json.dumps({
        'code': 200,
        'state': 1,
        'message': "OK",
        'userIds': res_list,
    })


@app.route('/expect/room/<int:userId>/<int:page>')
def getItemByTopXSimilarityUser(userId, page):
    page = page - 1
    maxLen = 200
    user_df = cfFileCache['user_based']
    browse_df = cfFileCache['browse_history']
    # 排序結果..
    user_df: DataFrame = user_df.loc[userId - 1]
    user_df_sorted = user_df.sort_values(ascending=False)
    top5 = list(user_df_sorted.index[1:6])

    # 找出原本用戶所關注的人
    origin_user_df_row: DataFrame = browse_df.loc[userId - 1]
    origin_user_df_row: Index = origin_user_df_row.replace(0, np.nan).dropna().index
    origin_user_df_row_list: list = origin_user_df_row.tolist()
    origin_user_df_row_list.remove(origin_user_df_row_list[0])

    # 結果集
    # 提取top3相似的人
    # 每個list都取前9位
    res_list = []

    for userIdKey in top5:
        res = OrderedSet()

        # 找出相似用戶所瀏覽的
        similar_user_df_row: DataFrame = browse_df.loc[int(userIdKey)]
        similar_user_df_row: Index = similar_user_df_row.replace(0, np.nan).dropna().index
        similar_user_df_row_list: list = similar_user_df_row.tolist()
        similar_user_df_row_list.remove(similar_user_df_row_list[0])
        res = res.union(OrderedSet(similar_user_df_row_list))
        # 過濾已瀏覽的
        res -= OrderedSet(origin_user_df_row_list)
        # 存到數組
        res_list.extend(list(res)[:40])
    # 去重 有可能重覆

    res_list = list(OrderedSet(res_list))
    # 全部轉為int
    res_list = list(map(lambda x: int(x)+1, res_list[:maxLen]))
    start = page * 3
    end = (page + 1) * 3
    return json.dumps({
        'code': 200,
        'state': 1,
        'message': "OK",
        'houseIds': res_list[start:end],
    })


def setup():
    db.initConnect()
    RecommendModel.preLoadingAll()
    # scheduler.api_enabled = True
    # scheduler.init_app(app)
    # scheduler.start()


if __name__ == '__main__':
    setup()
    # do sth. right there
    # getItemByTopXSimilarityUser(1,1)
    app.run(port=8086, debug=True)
    # getTopXSimilarityUser(2)
    # print(getTopXSimilarityUser())
    # RecommendModel.trainingCityDataByCity('武汉')
