import { watch } from "vue"
import { useState } from "../useState"

export const useMapState = (latitude =0,longitude=0)=>{
    const state = useState({
        id:0, // 使用 marker点击事件 需要填写id
        title: 'map',
        latitude,
        longitude,
        covers: [{
            id:99,
            title:'1111',
            latitude,
            longitude,
            iconPath: '/static/booking/location.png',
            width:'30',
            height:'30'
        }]
    })
    watch(state.latitude,(val,olaVal)=>{
        state.covers.value[0].latitude = state.latitude.value
        state.covers.value[0].longitude = state.longitude.value
    })
    return {
        ...state
    }
}