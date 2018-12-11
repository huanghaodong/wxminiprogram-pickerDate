![avatar](http://thyrsi.com/t6/628/1544253510x2890171534.gif)

* 支持自定义样式
* 支持自定义起止日期,且ios和android效果一致（原生小程序picker日期选择如果设置了起止日期，在ios和android上效果不一致）
* 支持自定义默认显示日期
* 支持闰年识别

## 使用

* 直接将picker文件夹拖入工程
	
* 在某page的json文件中配置

```js
{
  "usingComponents": {
    "picker": picker.js的相对路径
  }
}
```
* 在page的wxml文件中使用

```xml
<picker
	isShowPicker="{{isShow_01}}"
	bindsure="sureCallBack_01"
	bindcancle="cancleCallBack_01"
	startDate="1993-9-27"
	endDate="2093-11-12"
	defaultDate="2018-2-22"
	indicatorStyle="height:80px"
  maskStyle=""
  titleStyle=""
  sureStyle="color:blue;font-size:16px;"
  cancelStyle="color:red;font-size:16px;"
  chooseItemTextStyle="color:green;"
  pickerHeaderStyle="background:#eee;"
  titleText="自定义标题"
  cancelText="cancle"
  sureText="sure"
></picker>

```
* 更多使用方式，可自行参考demo

## 参数说明

| name | type | required | default | Description |
| ------ | ------ | ------ | ------ |------ |
| isShowPicker | Boolean | ✓ | false | 显示隐藏pickerDate，需要在bindsure和bindcancle中手动设为false |
| defaultDate | String | ✗ | '' | 设置pickerDate第一次打开时默认选择,格式为'2018-2-1'或'2018-02-01' |
| startDate | String | ✗ | '' | 设置pickerDate最早日期,格式为'2018-2-1'或'2018-02-01' |
| endDate | String | ✗ | '' | 设置pickerDate最晚日期,格式为'2018-2-1'或'2018-02-01' |
| indicatorStyle | String | ✗ | '' | 设置选择器中间选中框的样式（详见[picker-view](https://developers.weixin.qq.com/miniprogram/dev/component/picker-view.html)）如，每一行的高度 view |
| maskStyle | String | ✗ | '' | 设置蒙层的样式（详见[picker-view](https://developers.weixin.qq.com/miniprogram/dev/component/picker-view.html)） view |
| titleStyle | String | ✗ | '' | 标题栏标题样式  view |
| sureStyle | String | ✗ | '' | 标题栏确定样式  text |
| cancelStyle | String | ✗ | '' | 标题栏取消样式 text |
| chooseItemTextStyle | Array | ✗ | '' | 设置picker列表文案样式 text |
| pickerHeaderStyle | String | ✗ | '' | 标题栏样式 view |
| titleText | String | ✗ | '' | 标题文案 |
| cancelText | String | ✗ | '' | 取消按钮文案 |
| sureText | String | ✗ | '' | 确定按钮文案 |
| bindsure | EventHandle | ✗ | 无 | 点击确定触发的事件，event.detail = value,value格式为'2018-2-1' |
| bindcancle | EventHandle | ✗ | 无 | 点击取消触发的事件 |


## 注意
 - **因优化性能，限制了startDate不得早于'1970-1-1'，endDate不得晚于'2169-12-31'。如需拓展，可修改picker.js中：**
 
 ![avatar](http://thyrsi.com/t6/629/1544280401x2890186194.jpg)
 
 **YEARLENGTH为年份长度，STARTYEAR为开始年份。**

 - 必须在bindsure和bindcancle中将isShowPicker设为false。
 
## 如果觉得有用，请给个start，谢谢
# wxminiprogram-pickerDate
