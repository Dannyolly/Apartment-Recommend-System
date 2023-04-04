import { baseUrl } from "@/api/config";

import { AxiosResponse } from 'axios'
import axios from 'axios'

type State = "SUCCESS" | "ERROR"
type Response<T> = {
    result:T,
    state:State,
    code:number,
    message:string
}

export function get<T extends Object>(url:string,data?:Object):Promise<Response<T>>{
    if(!data){
        return new Promise((res,rej)=>{
            uni.request({
                url:baseUrl + url,
                data,
                method:'GET',
                success:({data,statusCode,header,cookies})=>{
                    let realData = data as unknown as Response<T>
                    res(realData)
                },
                fail:({errMsg})=>{
                    rej(errMsg)
                }
            });
        })
    }else{
        return new Promise((res,rej)=>{
            uni.request({
                url:baseUrl + url,
                data,
                method:'GET',
                success:({data,statusCode,header,cookies})=>{
                    let realData = data as unknown as Response<T>
                    res(realData)
                },
                fail:({errMsg})=>{
                    rej(errMsg)
                }
            })
        })
    }
}


type BaseFormData = {
    path:string
}
type IFormData = {[key:string]:any} & BaseFormData

export function uploadImage(filePath:string[],formData?:IFormData,progress?:boolean):Promise<Array<Response<{path:string}>>>{
    let result:Array<Response<string>> = []
    return new Promise((resolve,rej)=>{
        for (const path of filePath) {
            uni.uploadFile({
                name:'file',
                url:baseUrl+'/upload',
                filePath:path,
                formData:formData ?? {},
                success:({data})=>{
            
                    result.push(JSON.parse(data))
                    if(filePath.length === result.length){
                        resolve(result)
                    }
                },
                fail:({errMsg})=>{
                    rej(errMsg)
                }
            })
        }
    })
}

export {
    Response,
    State
}


