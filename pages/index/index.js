// pages/index/index.js
import { citys } from './city.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start:'',
    isShow_01: false,
    listData_01:[['太阳', '月亮', '星星']],
    picker_01_data:[],

    isShow_02: false,
    listData_02:[['太阳', '月亮', '星星']],
    picker_02_data:[],

    temp:'2018-12-12'
  },
  onLoad () {
    setTimeout(()=>{
      this.setData({
        temp: '2018-11-11'
      })
    },5000)
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