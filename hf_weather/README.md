### 更新日志 ###
- 2023-09-07  
1. 修改 api 为和风天气官方 （原京东万象api停止运营）
2. 修复小时视图，降水量为空的Bug
- 2022-01-24
1. 适配 chart.js v3+ 支持 core-2021.7.1 后续版本
- 2019-08-23
1. 增加一个新样式，降水概率以柱形图显示，优化图形、文字排版，将`hf_weather-card_new.js`改名后覆盖`hf_weather-card.js`即可使用。注意这个样式建议使用PC版chrome浏览器观看，在手机浏览器上横坐标过窄会导致图形位置有偏差（应该chart.js的锅）。

### 简介 ###
基于和风天气的lovelace天气卡片，主要功能：
- 支持生成多个天气Entity
- 天气数据统一存储
- 天气卡片增加空气质量、小时预报、生活建议、数据更新时间
- 天气卡片更多信息增加生活建议详细数据
- 天气卡片图表增加下雨概率
- 天气卡片使用动态图标

### 使用说明 ###
见[个人blog](https://ljr.im/articles/plugin-%C2%B7-change-lovelace-weather-card-based-on-windy/) 

#### UI配置
```yaml
type: custom:hf_weather-card
entity: weather.air
mode: daily
title: 天气
icons: /local/hf_weather-card/icons/animated/
``` 

#### Configuration 

```yaml
weather:
  - platform: hf_weather
    name: air              # 必填，自定义实体名称，生成实体的entityId为weather.{{test}}，后续配置需要用到
    city: 101110101    # 必填，城市代码，支持城市中英文名称、ID和IP地址，例如city=北京，city=beijing，city=CN101010100，city= 60.194.130.1，建议使用ID
    appkey: xxxxx    # 必填，和风天气api平台申请的key
```

### 参考 ###
- [和风天气插件组][1]
- [lovelace-weather-card-chart][2]
- [weather-card][3]

[1]: https://bbs.hassbian.com/thread-3971-1-1.html "和风天气插件组(天气预报+生活提示+小时预报+空气质量)"
[2]: https://github.com/sgttrs/lovelace-weather-card-chart "lovelace-weather-card-chart"
[3]: https://github.com/bramkragten/custom-ui/tree/master/weather-card "weather-card"

