// pages/index/index.js
import { citys } from './city.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow_01: false,
    listData_01:[['太阳', '月亮', '星星']],
    picker_01_data:[],

  },
  showPicker_01: function () {
    this.setData({
      isShow_01: true
    })
  },
  sureCallBack_01 (e) {
    let data = e.detail
    this.setData({
      isShow_01: false,
      picker_01_data: e.detail
    })
  },
  cancleCallBack_01 () {
    this.setData({
      isShow_01: false,
    })
  },


})