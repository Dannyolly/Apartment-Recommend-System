
export function objTOParams(obj) {
    const keys = Object.keys(obj)
    const values = Object.values(obj)
    let str = ""
    for (const key in keys) {
        let value = values[key]
        if(values[key] === '' || values[key] === undefined){
            continue
        }
        if(typeof value ==='object'){
            value = JSON.stringify(value);
        }
        
        if (Number(key) + 1 !== keys.length) {
            str += `${keys[key]}=${value}&`
        } else {
            str += `${keys[key]}=${value}`
        }
    }
    return str
}

