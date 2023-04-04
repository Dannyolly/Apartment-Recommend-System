
interface UserInfo {
    id: number,
    name: string,
    avatar: string,
    follow?:number,
    fans?:number,
    likeCount?:number
}

interface Follow {
    id:number,
    userId:number,
    followId:number
}

interface Perference{
    community?:string,
    floor?:string,
    lowestPrice:string,
    highestPrice:string
}

export {
    UserInfo,
    Follow,
    Perference
}