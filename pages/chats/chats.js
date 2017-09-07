// pages/chats/chats.js
var _socketOpen = false
var _socketMsgQueue = []
var _app = getApp()

function sendSocketMessage(username, msg) {
  if (_socketOpen) {
    wx.sendSocketMessage({
      data: JSON.stringify({
        username: username,
        message: msg
      })
    })
  } else {
    _socketMsgQueue.push(msg)
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "CHATS",
    inputValue: "sss",
    myNickName: null,
    messages: [
      { username: 'YUAN', message: "AAA" },
      { username: 'YUAN', message: "BBB" },
      { username: '史妍珣', message: "CCC" }]

  },
  sendMessage: function (e) {
    const nickName = _app.globalData.userInfo.nickName
    sendSocketMessage(nickName, this.data.inputValue)
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      myNickName: _app.globalData.userInfo.nickName
    })
    wx.connectSocket({
      url: 'ws://47.94.157.28:9000/ws'
      // url: 'ws://localhost:9000/ws'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      _socketOpen = true
      for (var i = 0; i < _socketMsgQueue.length; i++) {
        sendSocketMessage(_socketMsgQueue[i])
      }
      _socketMsgQueue = []
    })
    let messages = this.data.messages
    const ref = this
    wx.onSocketMessage(function (res) {
      if (messages) {
        messages.push(JSON.parse(res.data))
        ref.setData({
          messages: messages
        })
        console.log('11：' + messages)
      }
      console.log('收到服务器内容：' + res.data)
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})