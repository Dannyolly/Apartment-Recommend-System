
import {toRefs, reactive, Ref, ToRefs} from 'vue'




function useState<T extends Object>(state:T){
    return toRefs(reactive({
        ...state
    }))
}



export {
    useState,
 
}
