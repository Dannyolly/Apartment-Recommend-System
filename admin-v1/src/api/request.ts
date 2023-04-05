import { baseUrl } from "@/api/config";
import {objTOParams} from "@/utils/requestTransform";
import { AxiosResponse } from 'axios'
import axios from 'axios'

export type Response<T> = AxiosResponse<T>
const http = axios.create({
    baseURL: baseUrl,
    timeout: 6000
})
export function get<T extends Object>(url:string,data?:Object):Promise<Response<T>>{
    if(!data){
        return http.get(url);
    }
    return http.get(url+'?'+objTOParams(data))
}

export function post<T>(url:string,data:object):Promise<Response<T>>{
    return axios.post(url,data)
}




