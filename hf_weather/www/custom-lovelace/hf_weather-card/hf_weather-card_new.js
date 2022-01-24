const locale = {
  "zh-Hans": {
    tempHi: "最高温度",
    tempLo: "最低温度",
    precip: "降水量",
    pop: "降水概率",
    uPress: "百帕",
    uSpeed: "米/秒",
    uPrecip: "毫米",
    cardinalDirections: [
      "北",
      "北-东北",
      "东北",
      "东-东北",
      "东",
      "东-东南",
      "东南",
      "南-东南",
      "南",
      "南-西南",
      "西南",
      "西-西南",
      "西",
      "西-西北",
      "西北",
      "北-西北",
      "北",
    ],
    aqiLevels: ["优", "良", "轻度污染", "中度污染", "重度污染", "严重污染"],
  },
  da: {
    tempHi: "Temperatur",
    tempLo: "Temperatur nat",
    precip: "Nedbør",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      "N",
      "N-NØ",
      "NØ",
      "Ø-NØ",
      "Ø",
      "Ø-SØ",
      "SØ",
      "S-SØ",
      "S",
      "S-SV",
      "SV",
      "V-SV",
      "V",
      "V-NV",
      "NV",
      "N-NV",
      "N",
    ],
  },
  en: {
    tempHi: "Temperature",
    tempLo: "Temperature night",
    precip: "Precipitations",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      "N",
      "N-NE",
      "NE",
      "E-NE",
      "E",
      "E-SE",
      "SE",
      "S-SE",
      "S",
      "S-SW",
      "SW",
      "W-SW",
      "W",
      "W-NW",
      "NW",
      "N-NW",
      "N",
    ],
  },
  fr: {
    tempHi: "Température",
    tempLo: "Température nuit",
    precip: "Précipitations",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      "N",
      "N-NE",
      "NE",
      "E-NE",
      "E",
      "E-SE",
      "SE",
      "S-SE",
      "S",
      "S-SO",
      "SO",
      "O-SO",
      "O",
      "O-NO",
      "NO",
      "N-NO",
      "N",
    ],
  },
  nl: {
    tempHi: "Maximum temperatuur",
    tempLo: "Minimum temperatuur",
    precip: "Neerslag",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      "N",
      "N-NO",
      "NO",
      "O-NO",
      "O",
      "O-ZO",
      "ZO",
      "Z-ZO",
      "Z",
      "Z-ZW",
      "ZW",
      "W-ZW",
      "W",
      "W-NW",
      "NW",
      "N-NW",
      "N",
    ],
  },
  ru: {
    tempHi: "Температура",
    tempLo: "Температура ночью",
    precip: "Осадки",
    uPress: "гПа",
    uSpeed: "м/с",
    uPrecip: "мм",
    cardinalDirections: [
      "С",
      "С-СВ",
      "СВ",
      "В-СВ",
      "В",
      "В-ЮВ",
      "ЮВ",
      "Ю-ЮВ",
      "Ю",
      "Ю-ЮЗ",
      "ЮЗ",
      "З-ЮЗ",
      "З",
      "З-СЗ",
      "СЗ",
      "С-СЗ",
      "С",
    ],
  },
  sv: {
    tempHi: "Temperatur",
    tempLo: "Temperatur natt",
    precip: "Nederbörd",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      "N",
      "N-NO",
      "NO",
      "O-NO",
      "O",
      "O-SO",
      "SO",
      "S-SO",
      "S",
      "S-SV",
      "SV",
      "V-SV",
      "V",
      "V-NV",
      "NV",
      "N-NV",
      "N",
    ],
  },
};

class WeatherCardChart extends Polymer.Element {
  static get template() {
    return Polymer.html`
      <style>
        ha-icon {
          color: var(--paper-item-icon-color);
        }
        .card {
          padding: 0 18px 18px 18px;
        }
        .header {
          font-family: var(--paper-font-headline_-_font-family);
          -webkit-font-smoothing: var(
            --paper-font-headline_-_-webkit-font-smoothing
          );
          font-size: var(--paper-font-headline_-_font-size);
          font-weight: var(--paper-font-headline_-_font-weight);
          letter-spacing: var(--paper-font-headline_-_letter-spacing);
          line-height: var(--paper-font-headline_-_line-height);
          text-rendering: var(
            --paper-font-common-expensive-kerning_-_text-rendering
          );
          opacity: var(--dark-primary-opacity);
          padding: 24px 16px 5px;
          display: flex;
          justify-content: space-between;
        }
        .header div {
          display: flex;
        }
        .title {
          margin-left: 16px;
          font-size: 16px;
          color: var(--secondary-text-color);
        }
        .time {
          font-size: 16px;
          color: var(--secondary-text-color);
          align-items: center;
        }
        .now {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        .main {
          display: flex;
          font-size: 3.5em;
          align-items: center;
          line-height: 1em;
          width: 50%;
        }
        .main ha-icon {
          --iron-icon-height: 72px;
          --iron-icon-width: 72px;
          margin-right: 8px;
        }
        .main div {
          cursor: pointer;
          margin-top: -11px;
        }
        .main sup {
          font-size: 24px;
        }
        .suggestion {
          width:100%;
          cursor: pointer;
          display: flex;
          font-size: 1em;
          color: var(--secondary-text-color);
          justify-content: space-between;
          margin: 5px 0px 5px 0px;
        }
        .attributes {
          width: 50%;
          cursor: pointer;
          justify-content: space-between;
          align-items: center;
          margin: 5px 0px 5px 0px;
        }
        .attributes div{
          display: flex;
        }
        .attributes div div{
          width: 50%;
          margin: 5px 5px 0px 5px;
          align-items: center;
        }
        .chart-title {
          font-size: 16px;
          margin: 15px 0px 5px 0px;
          text-align: center;
          font-weight: 600; 
        }
        .conditions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 7% 0 7%;
        }
        .conditions div {
          width: 13%;
        }
        .aqi,
        .alarm {
          font-size: 16px;
          border-radius: 3px;
          color: #fff;
          line-height: 20px;
          padding: 2px 5px 2px 5px;
          margin: 0px 0px 0px 10px;
          height: 20px;
        }
        .aqi_level_0_bg {
          background-color: #40c057;
        }
        .aqi_level_1_bg{
          background-color: #82c91e;
        }
        .aqi_level_2_bg {
          background-color: #f76707;
        }
        .aqi_level_3_bg {
          background-color: #e03131;
        }
        .aqi_level_4_bg {
          background-color: #841c3c;
        }
        .aqi_level_5_bg{
          background-color: #540822;
        }
        .alarm {
          background-color: rgb(21, 123, 255)
        }
        .icon.bigger {
          width: 2em;
          height: 2em;
          left: 0em;
          padding-top: 0%;
        }

        .icon {
          width: 100%;
          padding-top: 100%;
          display: inline-block;
          vertical-align: middle;
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
          text-indent: -9999px;
        }
      </style>
      <ha-card>
        <div class="header">
          <div style="align-items: baseline;">
            <div style="align-items: center;">
              [[weatherObj.attributes.condition_cn]]
              <template is="dom-if" if="[[weatherObj.attributes.aqi]]">
                <div class$ = "aqi [[aqiLevel(weatherObj.attributes.aqi.aqi)]]">[[roundNumber(weatherObj.attributes.aqi.aqi)]]</div>
              </template>
            </div>
            <div class="title">[[title]]</div>
          </div>
          <div class="time">
            <ha-icon icon="mdi:update"></ha-icon>
            <div style="margin: 0 0 0 5px">[[weatherObj.attributes.update_time]]</div>
          </div>
        </div>
        <div class="card">
          <div class="now">
            <div class="main">
              <i class="icon bigger" style="background: none, url([[getWeatherIcon(weatherObj.state)]]) no-repeat; background-size: contain;"></i>
              <template is="dom-if" if="[[tempObj]]">
                <div on-click="_tempAttr">[[roundNumber(tempObj.state)]]<sup>[[getUnit('temperature')]]</sup></div>
              </template>
              <template is="dom-if" if="[[!tempObj]]">
                <div on-click="_weatherAttr">[[roundNumber(weatherObj.attributes.temperature)]]<sup>[[getUnit('temperature')]]</sup></div>
              </template>
            </div>

            <div class="attributes">
              <template is="dom-if" if="[[sunObj]]">
              <div on-click="_sunAttr">
                <div>
                  <ha-icon icon="mdi:weather-sunset-up"></ha-icon>&nbsp;[[computeTime(sunObj.attributes.next_rising)]]
                </div>
                <div>
                  <ha-icon icon="mdi:weather-sunset-down"></ha-icon>&nbsp;[[computeTime(sunObj.attributes.next_setting)]]
                </div>
              </div>
              </template>
              <div on-click="_weatherAttr">
                <div>
                  <ha-icon icon="hass:water-percent"></ha-icon>&nbsp;[[roundNumber(weatherObj.attributes.humidity)]] %
                </div>
                <div>
                  <ha-icon icon="hass:gauge"></ha-icon>&nbsp;[[roundNumber(weatherObj.attributes.pressure)]] [[ll('uPress')]]
                </div>
              </div>
              <div on-click="_weatherAttr">
                <div>
                  <ha-icon icon="hass:[[getWindDirIcon(windBearing)]]"></ha-icon>&nbsp;[[getWindDir(windBearing)]]
                </div>
                <div>
                  <ha-icon icon="hass:weather-windy"></ha-icon>&nbsp;[[computeWind(weatherObj.attributes.wind_speed)]] [[ll('uSpeed')]]
                </div>
              </div>
            </div>
            
            <template is="dom-if" if="[[weatherObj.attributes.alarm]]">
            <div class="alarm" on-click="_weatherAttr">
              台风预警
            </div>
            </template>
            <div class="suggestion" on-click="_weatherAttr">
              <div>
                <span> 空气：[[getSuggestion("air")]]</span><br>
                <span> 舒适：[[getSuggestion("comf")]]</span>

              </div>
              <div>

                <span> 感冒：[[getSuggestion("flu")]]</span><br>
                <span> 穿衣：[[getSuggestion("drsg")]]</span>
              </div>
              <div>
                <span> 紫外：[[getSuggestion("uv")]]</span><br>
                <span> 运动：[[getSuggestion("sport")]]</span>	
              </div>
              <div>
                <span> 旅游：[[getSuggestion("trav")]]</span><br>
                <span> 洗车：[[getSuggestion("cw")]]</span>
              </div>
            </div>
          </div>

          <template is="dom-if" if="[[hourlyForecast]]">
          <div class="chart-title">天气预报-小时</div>
            <ha-chart-base hass="[[_hass]]" data="[[HourlyForecastChartData]]" options="[[HourlyForecastChartData.options]]" ></ha-chart-base>
            <div class="conditions">
              <template is="dom-repeat" items="[[hourlyForecast]]">
                <div>
                  <i class="icon" style="background: none, url([[getWeatherIcon(item.condition)]]) no-repeat; background-size: contain;"></i>
                </div>
              </template>
            </div>
          </template>
          <template is="dom-if" if="[[dailyForecast]]">
            <div class="chart-title">天气预报-天</div>
            <ha-chart-base hass="[[_hass]]" data="[[DailyForecastChartData]]" options="[[DailyForecastChartData.options]]" ></ha-chart-base>
            <div class="conditions">
              <template is="dom-repeat" items="[[dailyForecast]]">
                <div>
                  <i class="icon" style="background: none, url([[getWeatherIcon(item.condition)]]) no-repeat; background-size: contain;"></i>
                </div>
              </template>
            </div>
          </template>
        </div>
      </ha-card>
    `;
  }

  static get properties() {
    return {
      config: Object,
      sunObj: Object,
      tempObj: Object,
      mode: String,
      weatherObj: {
        type: Object,
        observer: "dataChanged",
      },
    };
  }

  constructor() {
    super();
    this.weatherIcons = {
      "clear-night": "hass:weather-night",
      cloudy: "hass:weather-cloudy",
      fog: "hass:weather-fog",
      hail: "hass:weather-hail",
      lightning: "hass:weather-lightning",
      "lightning-rainy": "hass:weather-lightning-rainy",
      partlycloudy: "hass:weather-partlycloudy",
      pouring: "hass:weather-pouring",
      rainy: "hass:weather-rainy",
      snowy: "hass:weather-snowy",
      "snowy-rainy": "hass:weather-snowy-rainy",
      sunny: "hass:weather-sunny",
      windy: "hass:weather-windy",
      "windy-variant": "hass:weather-windy-variant",
    };
    this.cardinalDirectionsIcon = [
      "mdi:arrow-down",
      "mdi:arrow-bottom-left",
      "mdi:arrow-left",
      "mdi:arrow-top-left",
      "mdi:arrow-up",
      "mdi:arrow-top-right",
      "mdi:arrow-right",
      "mdi:arrow-bottom-right",
      "mdi:arrow-down",
    ];
    this.weatherIconsDay = {
      clear: "day",
      "clear-night": "night",
      cloudy: "cloudy",
      fog: "cloudy",
      hail: "rainy-7",
      lightning: "thunder",
      "lightning-rainy": "thunder",
      partlycloudy: "cloudy-day-3",
      pouring: "rainy-6",
      rainy: "rainy-5",
      snowy: "snowy-6",
      "snowy-rainy": "rainy-7",
      sunny: "day",
      windy: "cloudy",
      "windy-variant": "cloudy-day-3",
      exceptional: "!!",
    };
    this.weatherIconsNight = {
      ...this.weatherIconsDay,
      clear: "night",
      sunny: "night",
      partlycloudy: "cloudy-night-3",
      "windy-variant": "cloudy-night-3",
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define "weather" entity in the card config');
    }
    this.config = config;
    this.mode = config.mode ? config.mode : "both";
  }

  set hass(hass) {
    this._hass = hass;
    // this.lang = this._hass.selectedLanguage || this._hass.language;
    this.lang = "zh-Hans";
    this.weatherObj =
      this.config.entity in hass.states
        ? hass.states[this.config.entity]
        : null;
    this.sunObj = "sun.sun" in hass.states ? hass.states["sun.sun"] : null;
    this.tempObj =
      this.config.temp in hass.states ? hass.states[this.config.temp] : null;
    this.dailyForecast =
      this.mode == "hourly"
        ? null
        : this.weatherObj.attributes.forecast.slice(0, 9);
    this.hourlyForecast =
      this.mode == "daily"
        ? null
        : this.weatherObj.attributes.hourly_forecast.slice(0, 9);
    this.windBearing = this.weatherObj.attributes.wind_bearing;
    this.suggestion = this.weatherObj.attributes.suggestion;
    this.title = this.config.title
      ? this.config.title
      : this.weatherObj.attributes.friendly_name;
  }

  dataChanged() {
    this.HourlyForecastChartData = this.drawChart(
      "hourly",
      this.hourlyForecast
    );
    this.DailyForecastChartData = this.drawChart("daily", this.dailyForecast);
  }

  roundNumber(number) {
    var rounded = Math.round(number);
    return rounded;
  }

  aqiLevel(aqi) {
    return "aqi_level_" + parseInt(aqi / 50.0) + "_bg";
  }

  getSuggestion(type) {
    for (var i = 0; i < this.suggestion.length; i++) {
      if (this.suggestion[i].title == type) {
        return this.suggestion[i].brf;
      }
    }
  }
  ll(str) {
    if (locale[this.lang] === undefined) return locale.en[str];
    return locale[this.lang][str];
  }

  computeTime(time) {
    const date = new Date(time);
    return date.toLocaleTimeString(this.lang, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  computeWind(speed) {
    var calcSpeed = Math.round((speed * 1000) / 3600);
    return calcSpeed;
  }

  computeProbablePrecipitation(probability) {
    return probability / 100;
  }

  getCardSize() {
    return 4;
  }

  getUnit(unit) {
    return this._hass.config.unit_system[unit] || "";
  }

  getWeatherIcon(condition) {
    return `${
      this.config.icons
        ? this.config.icons
        : "https://cdn.jsdelivr.net/gh/bramkragten/custom-ui@master/weather-card/icons/animated/"
    }${
      this.sunObj.state && this.sunObj.state == "below_horizon"
        ? this.weatherIconsNight[condition]
        : this.weatherIconsDay[condition]
    }.svg`;
  }

  getWindDirIcon(degree) {
    return this.cardinalDirectionsIcon[parseInt((degree + 22.5) / 45.0)];
  }

  getWindDir(deg) {
    if (locale[this.lang] === undefined)
      return locale.en.cardinalDirections[parseInt((deg + 11.25) / 22.5)];
    return locale[this.lang]["cardinalDirections"][
      parseInt((deg + 11.25) / 22.5)
    ];
  }

  getAqiLevel(aqi) {
    return locale[this.lang]["aqiLevels"][parseInt(aqi / 50.0)];
  }

  drawChart(mode, forecastData) {
    if (!forecastData) {
      return [];
    }
    var data = forecastData.slice(0, 9);
    const locale = this._hass.language;
    const lengthUnit = this._hass.config.unit_system.length;
    const unitMap = {
      TempAxis: this._hass.config.unit_system.temperature,
      PopAxis: "%",
      PrecipAxis: lengthUnit === "km" ? this.ll("uPrecip") : "in"
    };
    var i;

    var dateTime = [];
    var tempHigh = [];
    var tempLow = [];
    var precip = [];
    var pop = [];
    for (i = 0; i < data.length; i++) {
      var d = data[i];
      dateTime.push(new Date(Date.parse(d.datetime.replace(/-/g, "/"))));
      tempHigh.push(d.temperature);
      tempLow.push(d.templow);
      precip.push(d.precipitation);
      pop.push(d.probable_precipitation);
    }
    var style = getComputedStyle(document.body);
    var textColor = style.getPropertyValue("--primary-text-color");
    var dividerColor = style.getPropertyValue("--divider-color");
    const chartOptions = {
      type: "bar",
      datasets: [
        {
          label: this.ll("tempHi"),
          type: "line",
          borderColor: "#b3051f",
          data: tempHigh,
          yAxisID: "TempAxis",
          borderWidth: 1.5,
          lineTension: 0.4,
          pointRadius: 0.0,
          pointHitRadius: 5.0,
          fill: false,
        },
        {
          label: this.ll("tempLo"),
          type: "line",
          borderColor: "#0539b3",
          data: tempLow,
          yAxisID: "TempAxis",
          borderWidth: 1.5,
          lineTension: 0.4,
          pointRadius: 0.0,
          pointHitRadius: 5.0,
          fill: false,
        },
        {
          label: this.ll("pop"),
          type: "bar",
          backgroundColor: "#b5af0e",
          data: pop,
          yAxisID: "PopAxis",
          maxBarThickness: 15,
        },
        {
          label: this.ll("precip"),
          type: "bar",
          borderColor: "#0a8062",
          backgroundColor: "#0a8062",
          data: precip,
          yAxisID: "PrecipAxis",
          maxBarThickness: 15,
        },
      ],
      labels: dateTime,
      options: {
        // animation: {
        //   duration: 300,
        //   easing: 'linear',
        //   onComplete: function () {
        //     var chartInstance = this.chart,
        //       ctx = chartInstance.ctx;
        //     ctx.fillStyle = textColor;
        //     var fontSize = 10;
        //     var fontStyle = 'normal';
        //     var fontFamily = 'Roboto';
        //     ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
        //     ctx.textAlign = 'center';
        //     ctx.textBaseline = 'bottom';
        //     var meta = chartInstance.controller.getDatasetMeta(3);
        //     meta.data.forEach(function (bar, index) {
        //       var data = (Math.round((chartInstance.data.datasets[3].data[index]) * 10) / 10).toFixed(1);
        //       ctx.fillText(data, bar._model.x, bar._model.y - 5);
        //     });
        //     var meta2 = chartInstance.controller.getDatasetMeta(2);
        //     meta2.data.forEach(function (bar, index) {
        //       var data = chartInstance.data.datasets[2].data[index] + '%';
        //       ctx.fillText(data, bar._model.x, bar._model.y - 5);
        //     });
        //   },
        // },
        legend: {
          display: false,
        },
        scales: {
          x: {
            offset: true,
            position: "top",
            grid: {
              color: textColor,
              display: true,
              offset: true,
              borderDash: [1, 5],
              drawBorder: false,
              drawOnChartArea: true,
              drawTicks: false,
            },
            ticks: {
              display: true,
              source: "labels",
              autoSkip: true,
              color: textColor,
              maxRotation: 0,
              callback: function (value, index, values) {
                if (mode == "hourly") {
                  var time = new Date(dateTime[value]).toLocaleTimeString(
                    "en",
                    {
                      hour: "numeric",
                    }
                  );
                  return time;
                } else {
                  return new Date(dateTime[value]).toLocaleDateString(locale, {
                    weekday: "short",
                  });
                }
              },
            },
          },
          TempAxis: {
            id: "TempAxis",
            position: "left",
            grid: {
              display: true,
              drawBorder: true,
              drawOnChartArea: true,
              drawTicks: true,
              borderDash: [1, 8],
            },
            ticks: {
              stepSize: 2,
              display: true,
              color: textColor,
            },
            afterFit: function (scaleInstance) {
              scaleInstance.width = 28;
            },
          },
          PrecipAxis: {
            id: "PrecipAxis",
            position: "right",
            grid: {
              display: false,
              drawBorder: false,
              drawOnChartArea: false,
              drawTicks: true,
            },
            ticks: {
              display: false,
              min: 0,
              suggestedMax: 20,
              fontColor: textColor,
            },
            afterFit: function (scaleInstance) {
              scaleInstance.width = 15;
            },
          },
          PopAxis: {
            id: "PopAxis",
            position: "right",
            grid: {
              display: false,
              drawBorder: false,
              drawOnChartArea: false,
              drawTicks: true,
            },
            ticks: {
              display: false,
              min: 0,
              // max: 100,
              suggestedMax: 110,
              fontColor: textColor,
            },
            afterFit: function (scaleInstance) {
              scaleInstance.width = 15;
            },
          },
        },
        plugins: {
          tooltip: {
            mode: "index",
            callbacks: {
              title: function (items) {
                const item = items[0];
                const date = item.label;
                return new Date(date).toLocaleDateString(locale, {
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                  hour: "numeric",
                });
              },
              label: function (context) {
                var label = context.dataset.label || "";
                return label + ": " + context.parsed.y + " " + unitMap[context.dataset.yAxisID];
              },
            },
          },
        },
      },
    };
    return chartOptions;
  }

  _fire(type, detail, options) {
    const node = this.shadowRoot;
    options = options || {};
    detail = detail === null || detail === undefined ? {} : detail;
    const e = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed,
    });
    e.detail = detail;
    node.dispatchEvent(e);
    return e;
  }

  _tempAttr() {
    this._fire("hass-more-info", { entityId: this.config.temp });
  }

  _weatherAttr() {
    this._fire("hass-more-info", { entityId: this.config.entity });
  }

  _sunAttr() {
    this._fire("hass-more-info", { entityId: this.sunObj.entity_id });
  }

  _suggestionAttr() {}
}

customElements.define("hf_weather-card", WeatherCardChart);
