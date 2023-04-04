type FilePath = string

export function downloadImage( filePath:string ):Promise<FilePath>{
    return new Promise((res,rej)=>{
        uni.saveFile({
            tempFilePath:filePath, //仅为示例，并非真实的资源
            success: ({savedFilePath}) => {
                res(savedFilePath)
            },
            fail(reason) {
                rej(reason)
            },
        });
    })
}