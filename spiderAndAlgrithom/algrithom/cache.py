"""
@author:dannyolly
@Time: 2023/4/11
@desc: cache all data recommend function need .. user-simi matrix

"""
roomFileCache = {
    '上海': {
        'ids': None,
        'trainedData': None
    },
    '珠海': {
        'ids': None,
        'trainedData': None
    },
    '广州': {
        'ids': None,
        'trainedData': None
    },
    '深圳': {
        'ids': None,
        'trainedData': None
    },
    '武汉': {
        'ids': None,
        'trainedData': None
    }
}

followFileCache = {
    'userSimilarity': None,
    'followDataset': None
}

cfFileCache = {
    'browse_history': None,
    'user_based': None
}