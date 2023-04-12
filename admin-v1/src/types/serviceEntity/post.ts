
enum PostType {
  NORMAL =1,
  QANDA
}
interface Post {
  id: number;
  userId: number;
  title: string;
  desc: string;
  date: string;
  pic: string;
  like: number;
  type: PostType;
}

interface PostComment {
  id: number;
  userId: number;
  postId:number,
  title: string;
  desc: string;
  date: string;
  like: number;
  toUserId: number;
  user?:UserInfo
}

interface CollectPost extends Post {
  collect_time:string
}
interface FormattedPost extends Post {
  user:UserInfo,
  picArr?:string[]
}

interface PostLikeRel {
  id: number;
  postId: number;
  userId: number;
}

interface PostOption{
  id?:number,
  userId?:number,
  type?:number
}

export {
    Post,
    PostType,
    PostComment,
    PostLikeRel,
    CollectPost,
    FormattedPost,
    PostOption
}