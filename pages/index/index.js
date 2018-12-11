// pages/index/index.js
import { citys } from './city.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temp:'',
    temp1:''
  },
  onLoad () {
      this.setData({
        temp: '2018-11-11',
        temp1: '2018-6-28'
      })
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

  showPicker_02: function () {
    this.setData({
      isShow_02: true
    })
  },
  sureCallBack_02 (e) {
    this.setData({
      isShow_02: false,
      picker_02_data: e.detail
    })
  },
  cancleCallBack_02 () {
    this.setData({
      isShow_02: false,
    })
  },
})