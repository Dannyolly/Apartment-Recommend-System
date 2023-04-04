
function swap(arr:any[],i:number,j:number){
    [arr[i],arr[j]] = [arr[j],arr[i]]
}

function shuffleArray<T extends any[]>(array:T):T {

    for (let i = array.length - 1; i > 0; i--) {

        let randomPos = Math.floor(Math.random() * (i + 1));

        //[array[i], array[randomPos]] = [array[randomPos], array[i]];
        swap(array,i,randomPos)
    }

    return array
}

export{
    shuffleArray
}

