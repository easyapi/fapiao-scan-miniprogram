// pages/contents/contents.js
const {
  request
} = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrTxt: 'https://github.com/liuxdi/wx-qr',
    money: '',
    content: '',
  },

  //获取token

  getToken() {
    var _that = this;
    wx.request({
      url: 'https://fapiao-api.easyapi.com/api/authenticate',
      data: {
        username: "13656171020",
        password: "123123",
        rememberMe: true
      },
      method: 'POST',
      success: function (res) {
        _that.setData({
          header: res.data.id_token
        })
        console.log(res.data);
        if (res.statusCode === 200) {
          _that.getCategories(res.data.id_token);
        }
      }
    })
  },
  //1.获取开票分类
  getCategories(head) {
    var _that = this;
    wx.request({
      url: 'https://fapiao-api.easyapi.com/custom-categories',
      header: {
        Authorization: 'Bearer ' + head
      },
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res.data.content);
        if (res.statusCode === 200) {
          _that.setData({
            tabs: res.data.content,
            no: res.data.content[0].taxCode.no,
            rate: res.data.content[0].taxCode.rate,
            name: res.data.content[0].name
          })
        }
      }
    })
  },
  // 点击获取点击类别的信息
  getItemImfor(e) {
    console.log(e);
    this.setData({
      no: e.target.dataset.item.taxCode.no,
      rate: e.target.dataset.item.taxCode.rate,
      name: e.target.dataset.item.name,
      active: e.target.dataset.index
    });
    console.log(this.data.no + "/" + this.data.rate + "/" + this.data.name);
  },
  // 获取input值
  getInputVal(e) {
    console.log(e);
    this.setData({
      inputVal: e.detail.value
    });
  },

  seeQRcode() {
    var _that = this;
    var taxRate = Number(_that.data.rate) / 100;
    console.log(taxRate);
    var obj = {
      shopNo: "",
      remark: "",
      items: [{
        outOrderNo: "",
        outOrderTime: "",
        no: _that.data.no,
        name: _that.data.name,
        price: _that.data.inputVal,
        taxRate: taxRate,
        number: 1
      }]
    };

    wx.request({
      url: 'https://fapiao-api.easyapi.com/scan/print',
      header: {
        Authorization: 'Bearer ' + _that.data.header
      },
      data: obj,
      method: 'POST',
      success: function (res) {
        if (res.statusCode === 200) {
          console.log(res.data.content);
          wx.request({
            url: 'https://api2.easyapi.com/api/qrCode',
            header: {
              Authorization: 'Bearer ' + _that.data.header
            },
            data: {
              appKey: "f4f33c07e706eaf1",
              appSecret: "46ad7599c926f20c",
              bg: "FFFFFF",
              fg: "000000",
              text: "https://fapiao-scan.easyapi.com/mobile.html?code=" + res.data.content
            },
            method: 'POST',
            success: function (res) {
              if (res.statusCode === 200) {
                console.log(res.data.content);
                wx.navigateTo({
                  url: '/pages/webViewPage/webViewPage?url=' + res.data.content.img,
                })
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var options = currentPage.options //如果要获取url中所带的参数可以查看options
    this.setData({
      money: options.id //这里的options.表示获取参数，contactid表示参数名称
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})