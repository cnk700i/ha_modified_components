const locale = {
  'zh-Hans':{
    tempHi: "最高温度",
    tempLo: "最低温度",
    precip: "降水量",
    pop: "降水概率",
    uPress: "百帕",
    uSpeed: "米/秒",
    uPrecip: "毫米",
    cardinalDirections: [
      '北', '北-东北', '东北', '东-东北', '东', '东-东南', '东南', '南-东南',
      '南', '南-西南', '西南', '西-西南', '西', '西-西北', '西北', '北-西北', '北'
    ],
    aqiLevels: [
      '优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'
    ]
  },
  da: {
    tempHi: "Temperatur",
    tempLo: "Temperatur nat",
    precip: "Nedbør",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      'N', 'N-NØ', 'NØ', 'Ø-NØ', 'Ø', 'Ø-SØ', 'SØ', 'S-SØ',
      'S', 'S-SV', 'SV', 'V-SV', 'V', 'V-NV', 'NV', 'N-NV', 'N'
    ]
  },
  en: {
    tempHi: "Temperature",
    tempLo: "Temperature night",
    precip: "Precipitations",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      'N', 'N-NE', 'NE', 'E-NE', 'E', 'E-SE', 'SE', 'S-SE',
      'S', 'S-SW', 'SW', 'W-SW', 'W', 'W-NW', 'NW', 'N-NW', 'N'
    ]
  },
  fr: {
    tempHi: "Température",
    tempLo: "Température nuit",
    precip: "Précipitations",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      'N', 'N-NE', 'NE', 'E-NE', 'E', 'E-SE', 'SE', 'S-SE',
      'S', 'S-SO', 'SO', 'O-SO', 'O', 'O-NO', 'NO', 'N-NO', 'N'
    ]
  },
  nl: {
    tempHi: "Maximum temperatuur",
    tempLo: "Minimum temperatuur",
    precip: "Neerslag",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      'N', 'N-NO', 'NO', 'O-NO', 'O', 'O-ZO', 'ZO', 'Z-ZO',
      'Z', 'Z-ZW', 'ZW', 'W-ZW', 'W', 'W-NW', 'NW', 'N-NW', 'N'
    ]
  },
  ru: {
    tempHi: "Температура",
    tempLo: "Температура ночью",
    precip: "Осадки",
    uPress: "гПа",
    uSpeed: "м/с",
    uPrecip: "мм",
    cardinalDirections: [
      'С', 'С-СВ', 'СВ', 'В-СВ', 'В', 'В-ЮВ', 'ЮВ', 'Ю-ЮВ',
      'Ю', 'Ю-ЮЗ', 'ЮЗ', 'З-ЮЗ', 'З', 'З-СЗ', 'СЗ', 'С-СЗ', 'С'
    ]
  },
  sv: {
    tempHi: "Temperatur",
    tempLo: "Temperatur natt",
    precip: "Nederbörd",
    uPress: "hPa",
    uSpeed: "m/s",
    uPrecip: "mm",
    cardinalDirections: [
      'N', 'N-NO', 'NO', 'O-NO', 'O', 'O-SO', 'SO', 'S-SO',
      'S', 'S-SV', 'SV', 'V-SV', 'V', 'V-NV', 'NV', 'N-NV', 'N'
    ]
  }
};
class MoreInfoWeather extends Polymer.Element {
  static get template() {
    return Polymer.html`
      <style>
        iron-icon {
          color: var(--paper-item-icon-color);
        }
        .section {
          margin: 16px 0 8px 0;
          font-size: 1.2em;
        }

        .flex {
          display: flex;
          height: 32px;
          align-items: center;
        }
        .suggestion_brf {
          color: #44739e;
          justify-content: space-between;
          display: flex;
          align-items: center;
          margin-top: 5px;
        }
        .suggestion_txt {
          margin-left:10px;
        }
        .main {
          flex: 1;
          margin-left: 24px;
        }

        .temp,
        .templow {
          min-width: 48px;
          text-align: right;
        }

        .templow {
          margin: 0 16px;
          color: var(--secondary-text-color);
        }

        .attribution {
          color: var(--secondary-text-color);
          text-align: center;
        }
      </style>

      <div class="flex">
        <iron-icon icon="hass:thermometer"></iron-icon>
        <div class="main">
          温度
        </div>
        <div>
          [[stateObj.attributes.temperature]] [[getUnit('temperature')]]
        </div>
      </div>
      <template is="dom-if" if="[[_showValue(stateObj.attributes.pressure)]]">
        <div class="flex">
          <iron-icon icon="hass:gauge"></iron-icon>
          <div class="main">
            气压
          </div>
          <div>
            [[stateObj.attributes.pressure]] [[getUnit('air_pressure')]]
          </div>
        </div>
      </template>
      <template is="dom-if" if="[[_showValue(stateObj.attributes.humidity)]]">
        <div class="flex">
          <iron-icon icon="hass:water-percent"></iron-icon>
          <div class="main">
            湿度
          </div>
          <div>[[stateObj.attributes.humidity]] %</div>
        </div>
      </template>
      <template is="dom-if" if="[[_showValue(stateObj.attributes.wind_speed)]]">
        <div class="flex">
          <iron-icon icon="hass:weather-windy"></iron-icon>
          <div class="main">
            风速
          </div>
          <div>
            [[computeWind(stateObj.attributes.wind_speed)]] [[ll('uSpeed')]]
          </div>
        </div>
      </template>
      <template is="dom-if" if="[[_showValue(stateObj.attributes.visibility)]]">
        <div class="flex">
          <iron-icon icon="hass:eye"></iron-icon>
          <div class="main">
            能见度
          </div>
          <div>[[stateObj.attributes.visibility]] [[getUnit('length')]]</div>
        </div>
      </template>

      <template is="dom-if" if="[[stateObj.attributes.suggestion]]">
      <div class="section">生活指数:</div>
      <template is="dom-repeat" items="[[stateObj.attributes.suggestion]]">
        <div class="suggestion_brf">
          <div>-&nbsp;&nbsp;[[item.title_cn]]</div>
          <div>[[item.brf]]</div>
        </div>
        <div class="suggestion_txt">[[item.txt]]</div>
      </template>

      <template is="dom-if" if="[[stateObj.attributes.forecast]]">
        <div class="section">天气预报:</div>
        <template is="dom-repeat" items="[[stateObj.attributes.forecast]]">
          <div class="flex">
            <template is="dom-if" if="[[_showValue(item.condition)]]">
              <iron-icon icon="[[getWeatherIcon(item.condition)]]"></iron-icon>
            </template>
            <template is="dom-if" if="[[!_showValue(item.templow)]]">
              <div class="main">[[computeDateTime(item.datetime)]]</div>
            </template>
            <template is="dom-if" if="[[_showValue(item.templow)]]">
              <div class="main">[[computeDate(item.datetime)]]</div>
              <div class="templow">
                [[item.templow]] [[getUnit('temperature')]]
              </div>
            </template>
            <div class="temp">
              [[item.temperature]] [[getUnit('temperature')]]
            </div>
          </div>
        </template>
      </template>

      <template is="dom-if" if="stateObj.attributes.attribution">
        <div class="attribution">[[stateObj.attributes.attribution]]</div>
      </template>
    `;
  }

  static get properties() {
    return {
      hass: Object,
      stateObj: Object,
    };
  }

  constructor() {
    super();
    this.cardinalDirections = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
      "N",
    ];
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
  }
  ll(str) {
    if (locale[this.lang] === undefined)
      return locale.en[str];
    return locale[this.lang][str];
  }
  computeDate(data) {
    const date = new Date(data);
    return date.toLocaleDateString(this.hass.language, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  computeDateTime(data) {
    const date = new Date(data);
    return date.toLocaleDateString(this.hass.language, {
      weekday: "long",
      hour: "numeric",
    });
  }
  computeWind(speed) {
    var calcSpeed = Math.round(speed * 1000 / 3600);
    return calcSpeed;
  }
  getUnit(measure) {
    const lengthUnit = this.hass.config.unit_system.length || "";
    switch (measure) {
      case "air_pressure":
        return lengthUnit === "km" ? "hPa" : "inHg";
      case "length":
        return lengthUnit;
      case "precipitation":
        return lengthUnit === "km" ? "mm" : "in";
      default:
        return this.hass.config.unit_system[measure] || "";
    }
  }

  windBearingToText(degree) {
    const degreenum = parseInt(degree);
    if (isFinite(degreenum)) {
      return this.cardinalDirections[(((degreenum + 11.25) / 22.5) | 0) % 16];
    }
    return degree;
  }

  getWind(speed, bearing, localize) {
    if (bearing != null) {
      const cardinalDirection = this.windBearingToText(bearing);
      return `${speed} ${this.getUnit("length")}/h (${localize(
        `ui.card.weather.cardinal_direction.${cardinalDirection.toLowerCase()}`
      ) || cardinalDirection})`;
    }
    return `${speed} ${this.getUnit("length")}/h`;
  }

  getWeatherIcon(condition) {
    return this.weatherIcons[condition];
  }

  _showValue(item) {
    return typeof item !== "undefined" && item !== null;
  }
}

customElements.define("hf_weather-more-info", MoreInfoWeather);
