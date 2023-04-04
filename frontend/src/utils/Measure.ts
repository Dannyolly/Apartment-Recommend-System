export function measureElHeight(elName:string,el:any):Promise<number>{
    return new Promise((resolve,rej)=>{
        let query = uni.createSelectorQuery().in(el);
        query.select(elName).boundingClientRect();
        query.exec((res) => {
            if (res && res[0]) {
                resolve(res[0].height)
            }else{
                rej('el is null')
            }
        });
    })
}


