import { useState } from "./useState";

export function usePicker(cols:string[]){
    const state = useState({
        show:false,
        columns: [
            cols
        ],
        cur:cols[0]
    })

    return {
        ...state
    }

}