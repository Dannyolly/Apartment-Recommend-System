import { uploadImage ,get} from "@/api/request";
import { Post ,PostType,PostComment, FormattedPost } from "@/types/serviceEntity/post";

async function uploadPost(
    files:string[],
    userId:number,
    title:string,
    desc:string,
    isQAndA:boolean
){
   let paths = [] as string[]
   if(!isQAndA){
    paths = (await uploadImage(files,{
        path:'post'
    })).map(v=>v.result.path)
   }
   console.log(paths);
   
   const query = {files:paths.join(','),userId,title,desc,isQAndA}
   return await get<Post>('/uploadPost',query)
}

function getAllPosts(params:{
    userId:number,
    type:PostType,
    page:number,
    pageSize:number
}){
    return get<FormattedPost[]>('/getAllPosts',params)
}
// -------------------- like 
function likeAdd(params:{
    postId:number,
    userId:number
}){
    return get<string>('/like/add',params)
}

function likeCancel(params:{
    postId:number,
    userId:number
}){
    return get<string>('/like/cancel',params)
}

function likeCheck(params:{
    postId:number,
    userId:number
}){
    return get< "liked" |"haven't liked yet">('/like/check',params)
}

// ------------------- comment
function comments(params:{postId:number,page:number,pageSize:number}){
    return get<PostComment[]>('/getComments',params)
}

function addComment(params:{
    userId:number,
    postId:number,
    title:string,
    desc:string,
    toUserId?:number
}){
    return get<string>('/comment/add',params)
}
function commentCount(postId:number){
    return get<number>('/comment/count',{postId})
}


export const PostSerivce = {
    uploadPost,
    getAllPosts,
    likeAdd,
    likeCancel,
    likeCheck,
    comments,
    addComment,
    commentCount
}
