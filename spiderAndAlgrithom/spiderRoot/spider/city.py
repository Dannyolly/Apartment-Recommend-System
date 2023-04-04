class City:
    def __init__(self):
        self.cityList = [{'name': '上海', 'url': 'https://sh.zu.anjuke.com'},
                         {'name': '北京', 'url': 'https://bj.zu.anjuke.com'},
                         {'name': '广州', 'url': 'https://gz.zu.anjuke.com'},
                         {'name': '深圳', 'url': 'https://sz.zu.anjuke.com'},
                         {'name': '珠海', 'url': 'https://zh.zu.anjuke.com/'},
                         {'name': '武汉', 'url': 'https://wh.zu.anjuke.com/'}
                         ]

    def getSingleCity(self, index):  # 获取单个城市
        return self.cityList[index]
