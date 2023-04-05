import { algrithomUrl } from "@/api/config";
import { get, Response } from "@/api/request";
import { UserInfo } from "@/types/serviceEntity/user";

function select(page:number,pageSize:number){
    return get<UserInfo[]>('/user/get',{
        page,
        pageSize
    })
}

function selectById(id:number){
    return get<UserInfo>('/user/getItemById',{
        id
    })
}

function count(){
    return get<number>('/user/count')
}

function add(user:UserInfo){
    return get<UserInfo>('/user/add',{user})
}

function deleteById(id:number){
    return get<number>('/user/delete',{id})
}

function update(user:UserInfo){
    return get<number>('/user/update',{user})
}

const UserService = {
    select,
    selectById,
    add,
    deleteById,
    update,
    count
}

export {
    UserService
}