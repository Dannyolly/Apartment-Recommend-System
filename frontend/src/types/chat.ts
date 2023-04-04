import { UserInfo } from "./serviceEntity/user";

// app format
interface ChatMsg{
    self:boolean
    message:string
    url:string
}

// 數據庫返回的格式
interface FormatChatMsg extends ChatEntity  {
    name:string,
    avatar:string
}

// 實體類
interface ChatEntity{
    id:number,
    user_id:number,
    to_id:number,
    message:string,
    url:string,
    created_at:string
}

export {
    ChatMsg,
    FormatChatMsg,
    ChatEntity
}