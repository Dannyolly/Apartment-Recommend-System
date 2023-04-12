import { get} from "@/api/request";
import { Page } from "@/types/serviceEntity/page";
import { Post ,PostType,PostComment, FormattedPost, PostOption } from "@/types/serviceEntity/post";

function select(params:PostOption & Page){
  return get<Post[]>('/post/get',params)
}

function count(params:PostOption & Page){
  return get<number>('/post/count',params)
}

function deleteById(id:number){
  return get<number>('/post/delete',{id})
}

export const PostSerivce = {
  select,
  count,
  deleteById
    
}
