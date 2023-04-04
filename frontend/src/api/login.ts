function getUserInfo():Promise<UniApp.GetUserProfileRes> {
    return new Promise((resolve,reject)=>{
        uni.getUserProfile({
          desc: '获取你的昵称、头像、地区及性别',
          success: res => {
            resolve(res)
          },
          fail: res => {
            //拒绝授权
            uni.showToast({
              title: '您拒绝了请求,不能正常使用小程序',
              icon: 'error',
              duration: 2000
            });
            reject(res)
          }
        });
              
    })
}

function login():Promise<string>{
  return new Promise((resolve,rej)=>{
    uni.login({
      provider: "weixin",
      success: function (res) {
        let appid = "wx594114b5e12ae9b5";
        let secret = "1093cd21440e5d4c49910d054baa0d48";
        let url =
          "https://api.weixin.qq.com/sns/jscode2session?appid=" +
          appid +
          "&secret=" +
          secret +
          "&js_code=" +
          res.code +
          "&grant_type=authorization_code";
        uni.request({
          url: url, // 请求路径
          success: (r) => {
            //@ts-ignore
            resolve(r.data.openid as unknown as string)
          },
        });
      },
    });
  })
}

export {
    getUserInfo,
    login
}