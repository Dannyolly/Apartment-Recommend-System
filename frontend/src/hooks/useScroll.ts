import { onPageScroll } from "@dcloudio/uni-app"
import { useState } from "./useState"

export const useNavigationScroll = (scrollTopMax:number = 70)=>{
    const { opacity , navigationHeight } = useState({
        opacity:0,
        navigationHeight:0
    })
    onPageScroll(({scrollTop})=>{
        if(scrollTop>scrollTopMax+100){
            return 
        }
        opacity.value = Math.min(scrollTop / scrollTopMax,1)
    }) 
    const measuringCb = (height:number)=> navigationHeight.value = height
      
    return {
        opacity,
        navigationHeight,
        measuringCb
    }
}