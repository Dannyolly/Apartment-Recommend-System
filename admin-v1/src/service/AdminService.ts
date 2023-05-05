import { get, Response } from "@/api/request";
import {Admin} from '@/types/serviceEntity/Admin'

function select(page:number,pageSize:number){
    return get<Admin[]>('/admin/get',{
        page,
        pageSize
    })
}

function selectById(id:number){
    return get<Admin>('/admin/getItemById',{
        id
    })
}

function count(){
    return get<number>('/admin/count')
}

function add(admin:Partial<Admin>){
    return get<Admin>('/admin/add',admin)
}

function deleteById(id:number){
    return get<number>('/admin/delete',{id})
}

function update(admin:Admin){
    return get<number>('/admin/update',admin)
}

const AdminService = {
    select,
    selectById,
    add,
    deleteById,
    update,
    count
}

export {
    AdminService
}