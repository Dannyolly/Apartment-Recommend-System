import json
from datetime import datetime

import numpy as np
import pandas as pd
from flask import Flask
from flask_apscheduler import APScheduler
from numpy import ndarray
from ordered_set import OrderedSet
from pandas import DataFrame, Index
from sklearn.feature_selection import VarianceThreshold, SelectFromModel
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import pairwise_distances
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder, LabelEncoder
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from cache import cfFileCache, roomFileCache, followFileCache
from constant import cities, DataMapKey, DataMap
from spiderRoot.database.sqldb import DataBase
from sklearn.decomposition import PCA

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


@scheduler.task('cron', id='data_collection_stage', day='*', hour='5', minute='50', second='0')
def dataCollection():
    RecommendModel.DataLoader.loadInfoFromMysql(
        fileName=DataMap.BROWSEHISTORY[DataMapKey['fileName']],
        tableName=DataMap.BROWSEHISTORY[DataMapKey['tableName']]
    )

    RecommendModel.DataLoader.loadInfoFromMysql(
        fileName=DataMap.ROOM[DataMapKey['fileName']],
        tableName=DataMap.ROOM[DataMapKey['tableName']]
    )

    RecommendModel.DataLoader.loadInfoFromMysql(
        fileName=DataMap.FOLLOW[DataMapKey['fileName']],
        tableName=DataMap.FOLLOW[DataMapKey['tableName']]
    )


@scheduler.task('cron', id='preprocessing_stage', day='*', hour='5', minute='55', second='0')
def preprocessing():
    # 基于内容
    RecommendModel.PreProcessor.transformRoomToDataSet()

    # 基于用户的协同过滤
    RecommendModel.PreProcessor.transformFollowsToDataSet()
    RecommendModel.PreProcessor.transformBrowseHistoryToDataSet()


@scheduler.task('cron', id='train_stage', day='*', hour='6', minute='0', second='0')
def Training():
    RecommendModel.trainingCityDataByCity(city='武汉')
    RecommendModel.trainingBrowseHistoryData()
    RecommendModel.trainingFollowData()


class RecommendModel:
    # 加载数据库资料变为csv
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
            df_dealed.to_csv(f"../dataset/{fileName}_data.csv", index=None, encoding='utf_8')

            # if fileName == DataMap.ROOM[DataMapKey['fileName']]:
            #     df_dealed.to_csv(f"../dataset/{fileName}_dataset.csv", index=None, encoding='utf_8')
            # else:
            #     df_dealed.to_csv(f"../dataset/{fileName}_data.csv", index=None, encoding='utf_8')

        @staticmethod
        def preLoadingByCity(cityName):
            startTime = datetime.now()
            city = cities[cityName]
            roomFileCache[cityName]['ids'] = pd.read_csv(f'../trainedData/{city}_cosineIds.csv')
            roomFileCache[cityName]['trainedData'] = pd.read_csv(f'../trainedData/{city}_cosineRes.csv')
            endTime = datetime.now()
            print((endTime - startTime))
            print('Loaded city ')

        # 加载用户推荐
        @staticmethod
        def preLoadingUserSimilarity():
            startTime = datetime.now()
            followFileCache['userSimilarity'] = pd.read_csv('../trainedData/user_similarity.csv')
            followFileCache['followDataset'] = pd.read_csv('../dataset/follow_dataset.csv')
            endTime = datetime.now()
            print((endTime - startTime))
            print('Loaded user similarity metrics ')

        # 加载基于协同过滤的公寓推荐
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
            RecommendModel.DataLoader.preLoadingUserSimilarity()
            RecommendModel.DataLoader.preLoadingByCity('武汉')
            RecommendModel.DataLoader.preLoadingUserBasedCF()
            endTime = datetime.now()
            print((endTime - startTime))
            print('Loaded all trainedData ')

    # 预处理
    class PreProcessor:
        # 下面两个方法把矩阵压成1 对 多
        """
        userid  action                          2   3
        1       2                   userid 1    1   1
        1       3           ===>
        """

        # 针对follows 作处理
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

        # 针对history 作处理
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

        # 这里是对room 做一些预处理
        @staticmethod
        def transformRoomToDataSet():
            # 读取文件
            data = pd.read_csv('../dataset/room_data.csv')
            # 重置索引
            data.reset_index(inplace=True, drop=True)
            # ids
            ids = data['id']
            # 把idList 转为 dataFrame 并保存
            idListDf = pd.DataFrame(ids)
            idListDf.to_csv(f'../trainedData/Wuhan_cosineIds_1.csv')
            # one - hot
            one_hot = RecommendModel.FeatureEngineering.onehot(data)
            # 列标签
            ori_columns = one_hot.columns
            # 归一化
            standardizedNdarray = RecommendModel.FeatureEngineering.minMaxStandardization(one_hot)
            dataframe = pd.DataFrame(data=standardizedNdarray[0:, 0:])
            dataframe.columns = ori_columns
            # 选取向量
            filter_df = RecommendModel.FeatureEngineering.featureSelectionByFilter(dataframe)
            # embedding
            # RecommendModel.FeatureEngineering.embedding(dataframe)
            # 保存到dataset
            filter_df.to_csv('../dataset/room_dataset_1.csv')

    # 数值转换
    class FeatureEngineering:
        @staticmethod
        def onehot(dataFrame: DataFrame):
            """
            one - hot
            :param dataFrame: 任意df
            :return:
            """
            return pd.get_dummies(dataFrame)

        @staticmethod
        def minMaxStandardization(codeResult: DataFrame) -> ndarray:
            """
            归一化
            :param codeResult: 经过one-hot 转化的
            :return: ndarray
            """
            return MinMaxScaler().fit_transform(codeResult)

        @staticmethod
        def featureSelectionByFilter(df: DataFrame):
            # 创建 VarianceThreshold

            selector = VarianceThreshold()
            # selector = VarianceThreshold()
            selector.fit_transform(df)
            # 开始过滤方差为x的
            # 首先获取列ids并根据列ids获取列标签
            # 最后过滤
            mask = selector.get_support()
            maskPd = pd.DataFrame(mask)
            ori_columns = df.columns

            ori_columns_pd = pd.DataFrame(ori_columns)
            filterDf = maskPd[maskPd[0] == False]
            print(f'before_feature_length: {len(df.columns)}')
            print(f'after_feature_length: {len(filterDf)}')

            filterIds = filterDf.index.tolist()
            title_list = ori_columns_pd.loc[filterIds].values.tolist()
            filter_title_list = list(map(lambda x: x[0], title_list))
            filter_df = df.drop(labels=filter_title_list, axis=1)
            return filter_df

        @staticmethod
        def embedding(df: DataFrame):
            pass
            # selector = SelectFromModel(LogisticRegression(penalty="l1", C=0.1, solver='liblinear'))
            # selector.fit_transform(df)
            # mask = selector.get_support()
            # maskPd = pd.DataFrame(mask)
            # maskPd.to_csv('./mask.csv')
            #
            # ori_columns = df.columns
            # ori_columns_pd = pd.DataFrame(ori_columns)
            # ori_columns_pd.to_csv('./mask_col.csv')
            #
            # embeddedDf = maskPd[maskPd[0] == False]
            # embeddedIds = embeddedDf.index.tolist()
            # title_list = ori_columns_pd.loc[embeddedIds].values.tolist()
            # embedded_title_list = list(map(lambda x: x[0], title_list))
            # embedded_df = df.drop(labels=embedded_title_list, axis=1)
            # return embedded_df

    @staticmethod
    def trainingCityDataByCity(city):
        RecommendModel.cosineSimilarityRoomRes(city)

    @staticmethod
    def trainingFollowData():
        RecommendModel.calculateFollowSimilarity()

    @staticmethod
    def trainingBrowseHistoryData():
        RecommendModel.calculateBrowseHistorySimilarity()

    @staticmethod
    def setup():
        db.initConnect()
        RecommendModel.DataLoader.preLoadingAll()
        # scheduler.api_enabled = True
        # scheduler.init_app(app)
        # scheduler.start()

    @staticmethod
    def calculateFollowSimilarity():
        data: DataFrame = pd.read_csv('../dataset/follow_dataset.csv')
        userSimilarity: ndarray = 1 - pairwise_distances(data.values.astype(bool), metric='jaccard')
        df = pd.DataFrame(data=userSimilarity)
        df.to_csv('../trainedData/user_similarity.csv')

    @staticmethod
    def calculateBrowseHistorySimilarity():
        data: DataFrame = pd.read_csv('../dataset/browse_history_dataset.csv')
        userSimilarity: ndarray = 1 - pairwise_distances(data.values.astype(bool), metric='jaccard')
        df = pd.DataFrame(data=userSimilarity)
        df.to_csv('../trainedData/user_based_room_similarity.csv')

    @staticmethod
    def cosineSimilarityRoomRes(city: str, isSave=True):
        # 读取文件
        data = pd.read_csv('../dataset/room_dataset_2.csv')
        # 选择城市
        # city_room: DataFrame = data[data['city'] == city]
        # 重置索引
        # city_room.reset_index(inplace=True, drop=True)

        # ids = data['id']
        # one - hot
        # codeResult = pd.get_dummies(city_room)
        # 归一化
        # standardResult = MinMaxScaler().fit_transform(codeResult)
        # cosine 相似度
        itemSimilarity: ndarray = cosine_similarity(data)

        dataframe = pd.DataFrame(data=itemSimilarity[0:, 0:])

        # idListDf = pd.DataFrame(ids)
        # print(dataframe)
        if isSave:
            # idListDf.to_csv(f'../trainedData/{cities[city]}_cosineIds_1.csv')
            dataframe.to_csv(f'../trainedData/{cities[city]}_cosineRes_1.csv')
            print(f'the calculation of {cities[city]} has done')


@app.route('/expect/<city>/<int:houseId>/<int:num>')
def getTopXSimilarityItems(city: str, houseId: int, num=5):
    # 读取矩阵 和 对应的id
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
    # 把id转为list
    realIds = roomFileCache[city]['ids']['id'].tolist()
    # 获取对应行的index
    houseIdIndex = realIds.index(houseId)
    # 获取对应的行
    firstRow: ndarray = resDF.values[houseIdIndex]
    # 把对应的行转为list
    res: list = firstRow.tolist()
    # 删除首列 -- 序号
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

    # 排序结果..
    user_df: DataFrame = user_df.loc[userId - 1]
    user_df_sorted = user_df.sort_values(ascending=False)
    top5 = list(user_df_sorted.index[2:5])

    # 找出原本用户所关注的人
    origin_user_df_row: DataFrame = follow_df.loc[userId - 1]
    origin_user_df_row: Index = origin_user_df_row.replace(0, np.nan).dropna().index
    origin_user_df_row_list: list = origin_user_df_row.tolist()
    origin_user_df_row_list.remove(origin_user_df_row_list[0])

    # 结果集
    # 提取top3相似的人
    # 每个list都取前9位
    res_list = []
    for userIdKey in top5:
        res = OrderedSet()

        # 找出相似用户所关注的人
        similar_user_df_row: DataFrame = follow_df.loc[int(userIdKey)]
        similar_user_df_row: Index = similar_user_df_row.replace(0, np.nan).dropna().index

        similar_user_df_row_list: list = similar_user_df_row.tolist()
        similar_user_df_row_list.remove(similar_user_df_row_list[0])
        res = res.union(OrderedSet(similar_user_df_row_list))

        # 过滤已关注的人
        res -= OrderedSet(origin_user_df_row_list)

        # 存到数组
        res_list.extend(list(res)[:num])
    # 去重 有可能重复
    res_list = list(OrderedSet(res_list))
    res_list.remove(res_list[0])

    # 全部转为int
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
    # 排序结果..
    user_df: DataFrame = user_df.loc[userId - 1]
    user_df_sorted = user_df.sort_values(ascending=False)
    top5 = list(user_df_sorted.index[1:6])

    # 找出原本用户所关注的人
    origin_user_df_row: DataFrame = browse_df.loc[userId - 1]
    origin_user_df_row: Index = origin_user_df_row.replace(0, np.nan).dropna().index
    origin_user_df_row_list: list = origin_user_df_row.tolist()
    origin_user_df_row_list.remove(origin_user_df_row_list[0])

    # 结果集
    # 提取top3相似的人
    # 每个list都取前9位
    res_list = []

    for userIdKey in top5:
        res = OrderedSet()

        # 找出相似用户所浏览的
        similar_user_df_row: DataFrame = browse_df.loc[int(userIdKey)]
        # 过滤空值
        similar_user_df_row: Index = similar_user_df_row.replace(0, np.nan).dropna().index
        similar_user_df_row_list: list = similar_user_df_row.tolist()
        # 删除首列
        similar_user_df_row_list.remove(similar_user_df_row_list[0])
        res = res.union(OrderedSet(similar_user_df_row_list))
        # 过滤已浏览的
        res -= OrderedSet(origin_user_df_row_list)
        # 存到数组
        res_list.extend(list(res)[:40])
    # 去重 有可能重复

    res_list = list(OrderedSet(res_list))
    # 全部转为int
    res_list = list(map(lambda x: int(x) + 1, res_list[:maxLen]))
    start = page * 3
    end = (page + 1) * 3
    return json.dumps({
        'code': 200,
        'state': 1,
        'message': "OK",
        'houseIds': res_list[start:end],
    })


def evaluate():
    pass


if __name__ == '__main__':
    RecommendModel.setup()
    # RecommendModel.PreProcessor.transformRoomToDataSet()
    # RecommendModel.cosineSimilarityRoomRes('武汉')
    # 31, 1153, 120, 1836, 12, 30, 1719, 863, 751, 1694, 26, 1462, 1466, 643, 677, 848, 934, 1716, 93, 20
    # 31, 1153, 120, 1836, 12, 30, 1719, 863, 751, 1694, 26, 1462, 1466, 643, 677, 848, 934, 1716, 93, 20
    # print(getTopXSimilarityItems('武汉', 1, 20))
    # df = pd.read_csv('../dataset/room_dataset_1.csv')
    # selector = PCA(n_components=700)
    # res = selector.fit_transform(df.values)
    # resDf = pd.DataFrame(res)
    # resDf.to_csv('../dataset/room_dataset_2.csv')
    # RecommendModel.trainingCityDataByCity('武汉')
    app.run(port=8088, debug=True)
    # dataFrame = pd.read_csv('../dataset/room_dataset_1.csv', encoding='utf-8')
