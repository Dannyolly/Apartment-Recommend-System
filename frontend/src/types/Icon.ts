type IconBtn = Array<{
    pic:string,
    title:string,
    onClick?:()=>void
}>

type ImageBtn = Array<{
    pic:string,
    onClick?:()=>void
}>

type Swiper = Array<{
    url:string,
    onClick?:()=>void    
}>
export {
    IconBtn,
    ImageBtn,
    Swiper
}