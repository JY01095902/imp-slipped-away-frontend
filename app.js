//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              method: 'GET',
              data: {
                appid: 'wxef0de9490f6aa54e',
                secret: 'e76db206a11881819a31a1ce9547184e',
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              success: function (res) {
                const openId = res.data.openid
                wx.getUserInfo({
                  withCredentials: false,
                  success: function (res) {
                    let userInfo = res.userInfo
                    userInfo.openId = openId
                    if(userInfo.gender === 1){
                      userInfo.gender = 'M'
                    } else if (userInfo.gender === 2) {
                      userInfo.gender = 'F'
                    }else{
                      userInfo.gender = 'U'
                    }
                    that.globalData.userInfo = userInfo
                    that.saveUser(userInfo)
                    typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                })
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },

  saveUser: (user) => {
    wx.request({
      // url: 'http://localhost:9000/users',
      url: 'http://47.94.157.28:9000/users',
      method: 'POST',
      data: {
        open_id: user.openId,
        nick_name: user.nickName,
        gender: user.gender,
        phone_number: null,
        city: user.city,
        province: user.province,
        country: user.country,
        avatar_url: user.avatarUrl,
        source: 'WeChat'
      },
      success: (res) => {
        console.log("已保存用户")
      }
    })
  },

  globalData: {
    userInfo: null
  }
})
