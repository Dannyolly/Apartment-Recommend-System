
enum InformType {
    CHAT = 1,
    CHATROOM = 2,
    SIGNATURE = 3,
    INIT = 4,
    COMMENT = 6,
    ADD_FRIENDS = 7,
    LIKE = 8,
    // SUBSCRIBE = 9;
    PUBLISH_POST = 10
}



// websocket entity 
interface Message<T extends Object> {
    user_id: number,
    to_id: number,
    message: string,
    mode: number,
    pic?: string,
    post_id?: number,
    extendField?: T
}
// 信息 --- post ...
interface PostNotification {
    comment_content: string;
    post_id: number;
    post_content: string;
    images: string;
    user_id: number;
    name: string;
    avatar: string;
    created_at: string;
    comments: number,
    id: number
}

export {
    InformType,
    Message,
    PostNotification
}