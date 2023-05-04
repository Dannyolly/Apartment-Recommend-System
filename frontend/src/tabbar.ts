type TabBar = {
    pagePath:string,
    iconPath:string,
    selectedIconPath:string,
    text:string
}

const tenant:TabBar[] = [{
    "pagePath": "/pages/tabbar/HomeContainer",
    "iconPath": "/static/tabbar/home.png",
    "selectedIconPath": "/static/tabbar/home-filling.png",
    "text": "首页"
}, {
    "pagePath": "/pages/tabbar/appointment",
    "iconPath": "/static/tabbar/appointment.png",
    "selectedIconPath": "/static/tabbar/appointment-clicked.png",
    "text": "看客单"
}, {
    "pagePath": "/pages/tabbar/Service",
    "iconPath": "/static/tabbar/service.png",
    "selectedIconPath": "/static/tabbar/service_fill.png",
    "text": "服务"
}, {

    "pagePath": "/pages/tabbar/Community",
    "iconPath": "/static/tabbar/community.png",
    "selectedIconPath": "/static/tabbar/community_fill.png",
    "text": "社区"
}, {
    "pagePath": "/pages/tabbar/UserInfoContainer",
    "iconPath": "/static/tabbar/app.png",
    "selectedIconPath": "/static/tabbar/app.png",
    "text": "我的"
}]

const owner:TabBar[] = [{
    "pagePath": "/pages/tabbar/HomeContainer",
    "iconPath": "/static/tabbar/home.png",
    "selectedIconPath": "/static/tabbar/home-filling.png",
    "text": "首页"
},{
    "pagePath": "/pages/tabbar/UserInfoContainer",
    "iconPath": "/static/tabbar/app.png",
    "selectedIconPath": "/static/tabbar/app.png",
    "text": "我的"
}]

export {
    tenant,
    owner 

}