// picker/picker.js
import { formatTime } from './tool';

const YEARLENGTH = 200;
const STARTYEAR = 1970;
const MONTHLENGTH = 12;
const STARTMONTH = 1;
const DAYLENGTH = 30;
const STARTDAY = 1;

let defaultColumnsData  = createColumnsData({
  yearLength: YEARLENGTH,
  startYear: STARTYEAR,
  monthLength: MONTHLENGTH,
  startMonth: STARTMONTH,
  dayLength: DAYLENGTH,
  startDay: STARTDAY
});


const bigMonth = ['1月', '3月', '5月', '7月', '8月', '10月', '12月'];
const smallMonth = ['4月', '6月', '9月', '11月'];


function createColumnsData ({yearLength, startYear, monthLength, startMonth, dayLength, startDay}) {
  let tempColumnsData  = [[],[],[]];
  tempColumnsData[0] = yearLength ? [...new Array(yearLength).keys()].map((v, i) => `${i + startYear}年`) : `${startYear}年`
  tempColumnsData[1] = monthLength ? [...new Array(monthLength).keys()].map((v, i) => `${i + startMonth}月`) : `${startMonth}月`
  tempColumnsData[2] = dayLength ? [...new Array(dayLength).keys()].map((v, i) => `${i + startDay}日`) : `${startDay}日`
  return tempColumnsData;
}
function createStartYearColumnsData ({yearLength, startYear}) {
  let startYearColumnsData = yearLength ? [...new Array(yearLength + 1).keys()].map((v, i) => `${i + startYear}年`) : [`${startYear}年`]
  return startYearColumnsData;
}
function createStartMonthColumnsData ({startMonth}) {
  let startMonthColumnsData = startMonth === 12 ?  [`${startMonth}月`] : [...new Array(12 - startMonth + 1).keys()].map((v, i) => `${i + startMonth }月`)
  return startMonthColumnsData;
}
function createEndMonthColumnsData ({endMonth}) {
  let endMonthColumnsData = endMonth === 1 ?  [`${endMonth}月`] : [...new Array(endMonth).keys()].map((v, i) => `${i + 1}月`)
  return endMonthColumnsData;
}
function createStartDayColumnsData ({startYear,startMonth, startDay}) {
  let tempTotalDay = 0;
  if(bigMonth.find((v) => parseInt(v) == startMonth)){
    tempTotalDay = 31;
  }else if(smallMonth.find((v) => parseInt(v) == startMonth)){
    tempTotalDay = 30;
  }else{
    if(isLeapYear(startYear)){
      tempTotalDay = 29;
    }
    tempTotalDay = 28;
  }
  let startDayColumnsData = startDay === tempTotalDay ? [`${startDay}日`] : [...new Array(tempTotalDay - startDay + 1).keys()].map((v, i) => `${i + startDay}日`)
  return startDayColumnsData;
}
function createEndDayColumnsData ({endDay}) {
  let endDayColumnsData = endDay === 1 ? [`${endDay}日`] : [...new Array(endDay).keys()].map((v, i) => `${i + 1}日`)
  return endDayColumnsData;
}
function createStartColumnsData ({yearLength, startYear, startMonth, startDay}) {
  let tempStartColumnsData = [[], [], []];
  tempStartColumnsData[0] = createStartYearColumnsData({yearLength, startYear})
  tempStartColumnsData[1] = createStartMonthColumnsData ({startMonth});
  tempStartColumnsData[2] =  createStartDayColumnsData ({startYear, startMonth, startDay});
  return tempStartColumnsData;
}
function isLeapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 ==0;
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    defaultDate:{
      type: String,
      value: '',
      observer: function (newVal) {
        if (this._compareDate()) return;
        this._setTempData();
        this._setDefault()
      }
    },
    startDate:{
      type: String,
      value: '',
      observer: function (startDate) {
          if (this._compareDate()) return;
          this._setTempData();
          this._setDefault()

      }
    },
    endDate:{
      type: String,
      value: '',
      observer: function (endDate) {
          if (this._compareDate()) return;
          this._setTempData();
          this._setDefault()
      }
    },
    isShowPicker:{
      type: Boolean,
      value: false,
      observer: function(newVal) {
        if (newVal) {
          this._openPicker()
        }else{
          this._closePicker()
        }
      }
    },
    titleText: {//标题文案
      type: String,
      value: "标题"
    },
    cancelText:{//取消按钮文案
      type: String,
      value: "取消"
    },
    sureText:{//确定按钮文案
      type: String,
      value: "确定"
    },
    pickerHeaderStyle: String,//标题栏样式 view
    sureStyle: String, //标题栏确定样式  text
    cancelStyle: String,//标题栏取消样式 text
    titleStyle: String,//标题栏标题样式  view
    maskStyle: String,//设置蒙层的样式（详见picker-view） view
    indicatorStyle: String,//设置选择器中间选中框的样式（详见picker-view） view
    chooseItemTextStyle: String//设置picker列表文案样式 text
  },

  /**
   * 组件的初始数据
   */
  data: {
    columnsData: defaultColumnsData.concat(),
    value:[],
    backData:'',
    isOpen: false,
    scrollEnd : true,//滚动是否结束
    lastValue : [0, 0, 0],
    isFirstOpen : true,
    tempValue : [0, 0, 0],
    defaultDateTemp:'',
    startDateTemp: '',
    endDateTemp:'',
  },
  /**
   * 组件的方法列表
   */

  methods: {
    tapModal () {
      this.properties.isShowPicker = false;
      this._closePicker()
    },
    cancle () {
      this.triggerEvent('cancle')
      this._closePicker()
    },
    sure () {
      let { scrollEnd, tempValue} = this.data;
      if(!scrollEnd) return;
      let backData = this._getBackDataFromValue(tempValue);
      this.setData({
        backData
      })
      this.triggerEvent('sure', backData);
      this._closePicker()
    },
    _bindChange (e) {
      let { columnsData,lastValue } = this.data;
      let val = e.detail.value;
      let { startDate, endDate } = this.properties;

        let compareIndex = this._getScrollCompareIndex(lastValue, val);
        if(compareIndex === 0){//如果在滚年
          if(startDate){//如果有起止
            let tempStartArr = this._formateDateStrToArr(startDate);
            let tempEndArr = this._formateDateStrToArr(endDate);
            if(parseInt(columnsData[0][val[0]]) == parseInt(tempStartArr[0]) ){//如果滚到startYear
              this.setData({
                'columnsData[1]': createStartMonthColumnsData({startMonth:tempStartArr[1]}),
                'columnsData[2]': createStartDayColumnsData({startYear:tempStartArr[0],startMonth:tempStartArr[1], startDay:tempStartArr[2]})
              })
            }else if(parseInt(columnsData[0][val[0]]) == parseInt(tempEndArr[0]) ){//如果滚到endYear
              this.setData({
                'columnsData[1]': createEndMonthColumnsData({endMonth:tempEndArr[1]}),
                'columnsData[2]': createEndDayColumnsData({endDay:tempEndArr[2]})
              })
            }
            else{
              // if(parseInt(columnsData[1][val[1]]) == 2){
              //   if (isLeapYear(parseInt(columnsData[0][val[0]]))) {
              //     this.setData({
              //       'columnsData[1]': defaultColumnsData[1],
              //       'columnsData[2]': defaultColumnsData[2].slice(0, -1)
              //     })
              //   } else {
              //     this.setData({
              //       'columnsData[1]': defaultColumnsData[1],
              //       'columnsData[2]': defaultColumnsData[2].slice(0, -2)
              //     })
              //   }
              //
              // }else{
              //   this.setData({
              //     'columnsData[1]': defaultColumnsData[1],
              //     'columnsData[2]': defaultColumnsData[2]
              //   })
              // }
              if(bigMonth.find((v) => parseInt(v) == parseInt(columnsData[1][val[1]]))){
                this.setData({
                  'columnsData[1]': defaultColumnsData[1],
                  'columnsData[2]': defaultColumnsData[2].concat('31日')
                })
              }else if(smallMonth.find((v) => parseInt(v) == parseInt(columnsData[1][val[1]]))){
                this.setData({
                  'columnsData[1]': defaultColumnsData[1],
                  'columnsData[2]': defaultColumnsData[2]
                })
              } else if(columnsData[1][val[1]] === '2月' ) {
                if (isLeapYear(parseInt(columnsData[0][val[0]]))) {
                  this.setData({
                    'columnsData[2]': defaultColumnsData[2].slice(0, -1)
                  })
                } else {
                  this.setData({
                    'columnsData[2]': defaultColumnsData[2].slice(0, -2)
                  })
                }
              }
            }
          }
        }else if(compareIndex === 1){//如果在滚月
          if(startDate){//如果有起止
            let tempStartArr = this._formateDateStrToArr(startDate);
            let tempEndArr = this._formateDateStrToArr(endDate);
            if(parseInt(columnsData[1][val[1]]) == parseInt(tempStartArr[1])  &&  parseInt(columnsData[0][val[0]]) == parseInt(tempStartArr[0]) ){//如果滚到startMonth
              this.setData({
                'columnsData[2]': createStartDayColumnsData({startYear:tempStartArr[0],startMonth:tempStartArr[1], startDay:tempStartArr[2]})
              })
            }else if(parseInt(columnsData[1][val[1]]) == parseInt(tempEndArr[1]) && parseInt(columnsData[0][val[0]]) == parseInt(tempEndArr[0]) ){//如果滚到endMonth
              this.setData({
                'columnsData[2]': createEndDayColumnsData({endDay:tempEndArr[2]})
              })
            }
            else{
              if(bigMonth.find((v) => parseInt(v) == parseInt(columnsData[1][val[1]]))){
                this.setData({
                  'columnsData[2]': defaultColumnsData[2].concat('31日')
                })
              }else if(smallMonth.find((v) => parseInt(v) == parseInt(columnsData[1][val[1]]))){
                this.setData({
                  'columnsData[2]': defaultColumnsData[2]
                })
              } else if(columnsData[1][val[1]] === '2月' ) {
                if (isLeapYear(parseInt(columnsData[0][val[0]]))) {
                  this.setData({
                    'columnsData[2]': defaultColumnsData[2].slice(0, -1)
                  })
                } else {
                  this.setData({
                    'columnsData[2]': defaultColumnsData[2].slice(0, -2)
                  })
                }
              }
            }
          }else{
            if(bigMonth.find((v) => parseInt(v) == parseInt(columnsData[1][val[1]]))){
              this.setData({
                'columnsData[2]': defaultColumnsData[2].concat('31日')
              })
            }else if(smallMonth.find((v) => parseInt(v) == parseInt(columnsData[1][val[1]]))){
              this.setData({
                'columnsData[2]': defaultColumnsData[2]
              })
            } else if(columnsData[1][val[1]] === '2月' ) {
              if (isLeapYear(parseInt(columnsData[0][val[0]]))) {
                this.setData({
                  'columnsData[2]': defaultColumnsData[2].slice(0, -1)
                })
              } else {
                this.setData({
                  'columnsData[2]': defaultColumnsData[2].slice(0, -2)
                })
              }
            }
          }

        }
      //验证
      val = this._validate(val);
      this.data.lastValue = val;
      this.data.tempValue = val;
    },
    _validate (val) {
      let { columnsData } = this.data;
      columnsData.forEach((v, i) => {
        if(columnsData[i].length - 1 < val[i]){
          val[i] = columnsData[i].length - 1;
        }
      })
      this.setData({
        value: val
      })
      return val;
    },
    _bindpickend(){
      this.data.scrollEnd = true;
    },
    _bindpickstart(){
      this.data.scrollEnd = false;
    },
    _openPicker () {
      if(!this.data.isFirstOpen){
        this._setDefault(this.data.backData)
      }
      this.data.isFirstOpen = false;
      this.setData({
        isOpen: true,
      })

    },
    _closePicker () {
      this.setData({
        isOpen: false
      })
    },

    //参数 '2018-1-1'或'2018-01-01'
    //返回 '[48, 0, 0]'
    _getValueFromDefaultDate (defaultStr) {
      let { columnsData } = this.data;
      let tempArr = this._formateDateStrToArr(defaultStr)
      return tempArr.map((v, i, arr) => columnsData[i].findIndex((u, j) => parseInt(u) == v))
    },
    //参数 [1, 2, 3]
    //返回 '1971-3-4'
    _getBackDataFromValue (val) {
      let tempStr = this.data.columnsData.reduce((t, v, i) => {
        return t + v[val[i]]
      }, '')
      return this._filterChinese(tempStr)
    },
    //过滤中文并添加'-'
    _filterChinese (includesChineseStr) {
      return includesChineseStr.replace(/[\u4e00-\u9fa5]/g,'-').replace(/\-$/,'')
    },
    //参数 start: '2017-01-11'  end: '2018-10-12'
    //返回columnsData 数组
    _getColumnsDataFromStartAndEnd (start, end) {
      let tempStartArr = this._formateDateStrToArr(start);
      let tempEndArr = this._formateDateStrToArr(end);
      try{
        if(tempStartArr[0] > tempEndArr[0] || tempEndArr[0] > (STARTYEAR + YEARLENGTH - 1) || tempStartArr[0] < STARTYEAR){
          throw "开始或者结束年份错误"
        }
      }catch (e) {
        console.error(e);
        return;
      }
      return createStartColumnsData({
        yearLength: tempEndArr[0] - tempStartArr[0],
        startYear: tempStartArr[0],
        startMonth: tempStartArr[1],
        startDay: tempStartArr[2],
      })
    },
    //格式化日期字符串为数组
    //参数 '2018-01-11'
    //返回 [2018, 1, 11]
    _formateDateStrToArr (dateStr) {
      return dateStr.split('-').map((v) => +v.replace(/^0/, ''))
    },
    _getScrollCompareIndex (arr1, arr2)  {
      let tempIndex = -1;
      for(let i = 0, len = arr1.length; i<len; i++){
        if(arr1[i] !== arr2[i]){
          tempIndex = i;
          break;
        }
      }
      return tempIndex;
    },
    _setDefault (inBackData) {
      let {startDate, endDate ,defaultDate} = this.properties;
      this.setData({
        columnsData: this._getColumnsDataFromStartAndEnd(startDate, endDate)
      })
      if(inBackData){
        defaultDate = inBackData;
      }
      let tempArr = this._formateDateStrToArr(defaultDate)
      if(startDate && endDate && tempArr.length === 3){//如果有起止
        let tempStartArr = this._formateDateStrToArr(startDate);
        let tempEndArr = this._formateDateStrToArr(endDate);
        if(tempArr[0] === tempStartArr[0]){//默认如果跟start同年
          this.setData({
            'columnsData[1]': createStartMonthColumnsData({startMonth:tempStartArr[1]}),
          })
          if(tempArr[1] === tempStartArr[1]){//默认同年并且跟start同月
            this.setData({
              'columnsData[2]': createStartDayColumnsData({startYear:tempStartArr[0],startMonth:tempStartArr[1], startDay:tempStartArr[2]})
            })
          }else{//同年并且跟start不同月
            if(tempArr[1] === 2){
              if(isLeapYear(tempArr[0])){
                this.setData({
                  'columnsData[2]':createEndDayColumnsData({endDay: 29})
                })
              }else{
                this.setData({
                  'columnsData[2]':createEndDayColumnsData({endDay: 28})
                })
              }
            }else if(bigMonth.find((v) => parseInt(v) == parseInt(tempArr[1]))){
              this.setData({
                'columnsData[2]': defaultColumnsData[2].concat('31日')
              })
            }else if(smallMonth.find((v) => parseInt(v) == parseInt(tempArr[1]))){
              this.setData({
                'columnsData[2]': defaultColumnsData[2]
              })
            }
          }
        }
        if(tempArr[0] === tempEndArr[0]){//默认如果跟end同年
          this.setData({
            'columnsData[1]': createEndMonthColumnsData({endMonth:tempEndArr[1]}),
          })
          if(tempArr[1] === tempStartArr[1]){//同年并且跟end同月
            this.setData({
              'columnsData[2]': createEndDayColumnsData({endDay:tempEndArr[2]})
            })
          }else{//同年并且跟end不同月
            if(tempArr[1] === 2){
              if(isLeapYear(tempArr[0])){
                this.setData({
                  'columnsData[2]':createEndDayColumnsData({endDay: 29})
                })
              }else{
                this.setData({
                  'columnsData[2]':createEndDayColumnsData({endDay: 28})
                })
              }
            }else if(bigMonth.find((v) => parseInt(v) == parseInt(tempArr[1]))){
              this.setData({
                'columnsData[2]': defaultColumnsData[2].concat('31日')
              })
            }else if(smallMonth.find((v) => parseInt(v) == parseInt(tempArr[1]))){
              this.setData({
                'columnsData[2]': defaultColumnsData[2]
              })
            }
          }
        }
        if(tempArr[0] !== tempEndArr[0] && tempArr[0] === tempStartArr[0]){
          if(tempArr[1] === 2){
            if(isLeapYear(tempArr[0])){
              this.setData({
                'columnsData[1]': defaultColumnsData[1],
                'columnsData[2]':createEndDayColumnsData({endDay: 29})
              })
            }else{
              this.setData({
                'columnsData[1]': defaultColumnsData[1],
                'columnsData[2]':createEndDayColumnsData({endDay: 28})
              })
            }
          }else{
            this.setData({
              'columnsData[1]': defaultColumnsData[1],
              'columnsData[2]': defaultColumnsData[2]
            })
          }
        }
      }else if(!startDate && !endDate){
        if(tempArr[1] === 2){
          if(isLeapYear(tempArr[0])){
            this.setData({
              'columnsData[1]': defaultColumnsData[1],
              'columnsData[2]':createEndDayColumnsData({endDay: 29})
            })
          }else{
            this.setData({
              'columnsData[1]': defaultColumnsData[1],
              'columnsData[2]':createEndDayColumnsData({endDay: 28})
            })
          }
        }else{
          this.setData({
            'columnsData[1]': defaultColumnsData[1],
            'columnsData[2]': defaultColumnsData[2]
          })
        }
      }
      let value = defaultDate === '' ? [0,0,0] : this._getValueFromDefaultDate(defaultDate);
      let backData = this._getBackDataFromValue(value);
      this.data.tempValue = value;
      this.data.lastValue = value;
      this.setData({
        value,
        backData
      })
    },
    _compareDate () { //完全相等返回true
      let {defaultDateTemp, startDateTemp, endDateTemp} = this.data;
      let {defaultDate, startDate, endDate}  = this.properties

      return defaultDateTemp === defaultDate && startDateTemp === startDate && endDateTemp === endDate
    },
    _setTempData () {
      let {defaultDate, startDate, endDate}  = this.properties;
      this.data.defaultDateTemp = defaultDate;
      this.data.startDateTemp = startDate;
      this.data.endDateTemp = endDate;
    }
  }
})
