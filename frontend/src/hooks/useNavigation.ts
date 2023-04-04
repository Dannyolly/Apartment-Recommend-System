import { useState } from "./useState"

export const useNavigation = ()=>{
    const { navigationHeight } = useState({
        navigationHeight:0
    })
    const measuringCb = (height:number)=> navigationHeight.value = height
    return {
        navigationHeight,
        measuringCb
    }
    
}