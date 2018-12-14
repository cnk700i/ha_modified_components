## broadlink.py ##

1.原插件地址

https://github.com/home-assistant/home-assistant/blob/0.80.0/homeassistant/components/switch/broadlink.py

2.修改功能
  - 修正开关复位的bug
  - 增加显示不可用状态（mp1类型）
  - 增加配置内置红外码
  - 通过服务方式调用预设内置红外码
  
3.使用说明

  红外功能见[个人blog](https://ljr.im/2018/10/26/ha-plugin-·-change-bolian-rm-and-airconditioning-partner-infrared-function/)
  
  PS：如果是mp1排插用这个插件，建议配置如下：
  ```yaml  
  switch:
    - platform: broadlink
      entity_namespace: strip1  # 不同的排插起名不同，避免同一namespace下多个slots排队更新
      scan_interval: 60  # 影响手动操作插座，HA同步状态的时间，一般一分钟够了
      timeout: 3  # slot通信超时，不设置默认3s，由于一般会重试2次，4个slot最坏情况下会耗时24s，如果scan_interval时间间隔内没完成，会有错误日志，所以scan_interval不宜太小
      type: mp1
      …其它省略…
  ```
