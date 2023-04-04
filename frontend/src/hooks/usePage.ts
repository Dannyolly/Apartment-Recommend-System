import { useState } from "./useState";

export function usePage(currentPage=1,pageSize = 5){
    return {
        ...useState({
            currentPage,
            pageSize:pageSize
        })
    }
}