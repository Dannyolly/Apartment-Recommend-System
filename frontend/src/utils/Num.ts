function Random(bottom:number , top:number){
    return Math.floor((Math.random() * (top-bottom + 1))+bottom)
}


export {
    Random
}