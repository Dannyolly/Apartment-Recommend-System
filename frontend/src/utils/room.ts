import { Room } from "@/types/serviceEntity/Room";

export function toCorrectForm(room:Room){
    let pics = room.pic
    room.correctPic =  pics.substring(0,pics.length-1).split(',').map(v=>v.substring(2,v.length-2))
}