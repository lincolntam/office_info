const stage = document.querySelector("#stage");
const panels = [...document.querySelectorAll(".stack-panel")];
const dots = [...document.querySelectorAll(".dot")];

const SPOTIFY_CLIENT_ID = "a80e7a713b0d4232b9503300e8f47faf";
const SPOTIFY_SCOPES =
  "streaming user-read-email user-read-private user-read-currently-playing user-read-playback-state user-modify-playback-state user-library-modify";
const SPOTIFY_REDIRECT_URI =
  window.location.origin === "null"
    ? "http://127.0.0.1:5500/index.html"
    : `${window.location.origin}${window.location.pathname}`;
const AUTO_ROTATE_MS = 5 * 60 * 1000;
const DEFAULT_MARKET_SYMBOLS = ["0700.HK", "1810.HK", "9988.HK"];
const DEFAULT_WEATHER_PLACE = "\u6c99\u7530";
const DEFAULT_MUSIC_SOURCE = "spotify";
const DEFAULT_YOUTUBE_URL = "";
const DEFAULT_MUSIC_VOLUME = 0.65;
const MTR_DEFAULT_CONFIG = { station: "FOT", line: "EAL" };
const BUS_MAX_STOPS = 10;
const BUS_DEFAULT_STOPS_VERSION = "2026-08-26-fotan-three-stops";
const BUS_DEFAULT_STOPS = [
  { name: "火炭村", stopId: "72EE8A033E4260A3" },
  { name: "火炭村", stopId: "C458B4A40BFCC4FF" },
  { name: "火炭站", stopId: "12DE49878E7A4ED1" },
];
const BUS_DISPLAY_MODES = {
  all: "所有方向",
  single: "單向",
};
const BUS_DIRECTIONS = {
  O: "往程",
  I: "回程",
};
const MINIBUS_MAX_STOPS = 10;
const MINIBUS_DEFAULT_STOPS_VERSION = "2026-08-31-fotan-minibus-route-picker-v2";
const MINIBUS_DEFAULT_STOPS = [
  { name: "專線小巴 811 · 火炭", stopId: "20015728", routeCode: "811", routeId: "2007761", routeSeq: "2", stopSeq: "5", destTc: "穗禾苑" },
  { name: "專線小巴 69K · 火炭", stopId: "20015751", routeCode: "69K", routeId: "2007766", routeSeq: "1", stopSeq: "2", destTc: "沙田渣甸山花園∕華翠園" },
];
const TRANSPORT_SOURCES = ["mtr", "bus", "minibus"];
const HK_PUBLIC_HOLIDAYS_2026 = [
  { date: "2026-09-26", name: "中秋節翌日" },
  { date: "2026-10-01", name: "國慶日" },
  { date: "2026-10-19", name: "重陽節翌日" },
  { date: "2026-12-25", name: "聖誕節" },
  { date: "2026-12-26", name: "聖誕節後第一個周日" },
];
let transportPublicHolidays = [...HK_PUBLIC_HOLIDAYS_2026];
const RTHK2_STREAM_URLS = [
  "https://stm.rthk.hk/radio2",
  "http://stm.rthk.hk/radio2",
  "https://rthkaudio2-lh.akamaihd.net/i/radio2_1@355866/index_56_a-p.m3u8",
  "https://rthkaudio2-lh.akamaihd.net/i/radio2_1@355866/master.m3u8",
];
const RTHK2_PROGRAMS = [
  { start: "00:00", name: "深夜第二台" },
  { start: "06:00", name: "晨光第一線" },
  { start: "10:00", name: "自在 8 點半" },
  { start: "12:00", name: "音樂情人" },
  { start: "14:00", name: "Made in Hong Kong 李志剛" },
  { start: "16:00", name: "日常 8 點半" },
  { start: "18:00", name: "瘋 Show 快活人" },
  { start: "20:00", name: "騷動音樂" },
  { start: "22:00", name: "夜媽媽" },
];

const MTR_LINES = {
  TWL: {
    zh: "荃灣綫",
    en: "Tsuen Wan Line",
    color: "#e2231a",
    leftDestinations: ["TSW"],
    rightDestinations: ["CEN"],
    destinations: {
      TSW: { zh: "往荃灣", en: "to Tsuen Wan", platform: "1" },
      CEN: { zh: "往中環", en: "to Central", platform: "2" },
    },
  },
  ISL: {
    zh: "港島綫",
    en: "Island Line",
    color: "#0860a8",
    leftDestinations: ["KET"],
    rightDestinations: ["CHW"],
    destinations: {
      KET: { zh: "往堅尼地城", en: "to Kennedy Town", platform: "1" },
      CHW: { zh: "往柴灣", en: "to Chai Wan", platform: "2" },
    },
  },
  KTL: {
    zh: "觀塘綫",
    en: "Kwun Tong Line",
    color: "#00a040",
    leftDestinations: ["WHA"],
    rightDestinations: ["TIK"],
    destinations: {
      WHA: { zh: "往黃埔", en: "to Whampoa", platform: "1" },
      TIK: { zh: "往調景嶺", en: "to Tiu Keng Leng", platform: "2" },
    },
  },
  TKL: {
    zh: "將軍澳綫",
    en: "Tseung Kwan O Line",
    color: "#8d1b8c",
    leftDestinations: ["POA", "LHP"],
    rightDestinations: ["NOP"],
    destinations: {
      POA: { zh: "往寶琳", en: "to Po Lam", platform: "1" },
      LHP: { zh: "往康城", en: "to LOHAS Park", platform: "1" },
      NOP: { zh: "往北角", en: "to North Point", platform: "2" },
    },
  },
  TCL: {
    zh: "東涌綫",
    en: "Tung Chung Line",
    color: "#f58220",
    leftDestinations: ["TUC"],
    rightDestinations: ["HOK"],
    destinations: {
      TUC: { zh: "往東涌", en: "to Tung Chung", platform: "3" },
      HOK: { zh: "往香港", en: "to Hong Kong", platform: "4" },
    },
  },
  EAL: {
    zh: "東鐵綫",
    en: "East Rail Line",
    color: "#53b7e8",
    leftDestinations: ["LOW", "LMC"],
    rightDestinations: ["ADM"],
    destinations: {
      LOW: { zh: "往羅湖", en: "to Lo Wu", platform: "3" },
      LMC: { zh: "往落馬洲", en: "to Lok Ma Chau", platform: "3" },
      ADM: { zh: "往金鐘", en: "to Admiralty", platform: "4" },
    },
  },
  TML: {
    zh: "屯馬綫",
    en: "Tuen Ma Line",
    color: "#9a3b26",
    leftDestinations: ["TUM"],
    rightDestinations: ["WKS"],
    destinations: {
      TUM: { zh: "往屯門", en: "to Tuen Mun", platform: "3" },
      WKS: { zh: "往烏溪沙", en: "to Wu Kai Sha", platform: "4" },
    },
  },
  AEL: {
    zh: "機場快綫",
    en: "Airport Express",
    color: "#00888a",
    leftDestinations: ["AWE"],
    rightDestinations: ["HOK"],
    destinations: {
      AWE: { zh: "往博覽館", en: "to AsiaWorld-Expo", platform: "3" },
      HOK: { zh: "往香港", en: "to Hong Kong", platform: "4" },
    },
  },
  SIL: {
    zh: "南港島綫",
    en: "South Island Line",
    color: "#bac429",
    leftDestinations: ["SOH"],
    rightDestinations: ["ADM"],
    destinations: {
      SOH: { zh: "往海怡半島", en: "to South Horizons", platform: "1" },
      ADM: { zh: "往金鐘", en: "to Admiralty", platform: "2" },
    },
  },
  DRL: {
    zh: "迪士尼綫",
    en: "Disneyland Resort Line",
    color: "#f6a4c9",
    leftDestinations: ["DIS"],
    rightDestinations: ["SUN"],
    destinations: {
      DIS: { zh: "往迪士尼", en: "to Disneyland Resort", platform: "1" },
      SUN: { zh: "往欣澳", en: "to Sunny Bay", platform: "2" },
    },
  },
};

const MTR_STATIONS = {
  TSW: { zh: "荃灣", en: "Tsuen Wan", lines: ["TWL"] },
  TWH: { zh: "大窩口", en: "Tai Wo Hau", lines: ["TWL"] },
  KWH: { zh: "葵興", en: "Kwai Hing", lines: ["TWL"] },
  KWF: { zh: "葵芳", en: "Kwai Fong", lines: ["TWL"] },
  LAK: { zh: "荔景", en: "Lai King", lines: ["TWL", "TCL"] },
  MEF: { zh: "美孚", en: "Mei Foo", lines: ["TWL", "TML"] },
  LCK: { zh: "荔枝角", en: "Lai Chi Kok", lines: ["TWL"] },
  CSW: { zh: "長沙灣", en: "Cheung Sha Wan", lines: ["TWL"] },
  SSP: { zh: "深水埗", en: "Sham Shui Po", lines: ["TWL"] },
  PRE: { zh: "太子", en: "Prince Edward", lines: ["TWL", "KTL"] },
  MOK: { zh: "旺角", en: "Mong Kok", lines: ["TWL", "KTL"] },
  YMT: { zh: "油麻地", en: "Yau Ma Tei", lines: ["TWL", "KTL"] },
  JOR: { zh: "佐敦", en: "Jordan", lines: ["TWL"] },
  TST: { zh: "尖沙咀", en: "Tsim Sha Tsui", lines: ["TWL"] },
  CEN: { zh: "中環", en: "Central", lines: ["TWL", "ISL"] },
  KET: { zh: "堅尼地城", en: "Kennedy Town", lines: ["ISL"] },
  HKU: { zh: "香港大學", en: "HKU", lines: ["ISL"] },
  SYP: { zh: "西營盤", en: "Sai Ying Pun", lines: ["ISL"] },
  SHW: { zh: "上環", en: "Sheung Wan", lines: ["ISL"] },
  WAC: { zh: "灣仔", en: "Wan Chai", lines: ["ISL"] },
  CAB: { zh: "銅鑼灣", en: "Causeway Bay", lines: ["ISL"] },
  TIH: { zh: "天后", en: "Tin Hau", lines: ["ISL"] },
  FOH: { zh: "炮台山", en: "Fortress Hill", lines: ["ISL"] },
  NOP: { zh: "北角", en: "North Point", lines: ["ISL", "TKL"] },
  QUB: { zh: "鰂魚涌", en: "Quarry Bay", lines: ["ISL", "TKL"] },
  TAK: { zh: "太古", en: "Tai Koo", lines: ["ISL"] },
  SWH: { zh: "西灣河", en: "Sai Wan Ho", lines: ["ISL"] },
  SKW: { zh: "筲箕灣", en: "Shau Kei Wan", lines: ["ISL"] },
  HFC: { zh: "杏花邨", en: "Heng Fa Chuen", lines: ["ISL"] },
  CHW: { zh: "柴灣", en: "Chai Wan", lines: ["ISL"] },
  WHA: { zh: "黃埔", en: "Whampoa", lines: ["KTL"] },
  HOM: { zh: "何文田", en: "Ho Man Tin", lines: ["KTL", "TML"] },
  SKM: { zh: "石硤尾", en: "Shek Kip Mei", lines: ["KTL"] },
  LOF: { zh: "樂富", en: "Lok Fu", lines: ["KTL"] },
  WTS: { zh: "黃大仙", en: "Wong Tai Sin", lines: ["KTL"] },
  CHH: { zh: "彩虹", en: "Choi Hung", lines: ["KTL"] },
  KOB: { zh: "九龍灣", en: "Kowloon Bay", lines: ["KTL"] },
  NTK: { zh: "牛頭角", en: "Ngau Tau Kok", lines: ["KTL"] },
  KWT: { zh: "觀塘", en: "Kwun Tong", lines: ["KTL"] },
  LAT: { zh: "藍田", en: "Lam Tin", lines: ["KTL"] },
  YAT: { zh: "油塘", en: "Yau Tong", lines: ["KTL", "TKL"] },
  TIK: { zh: "調景嶺", en: "Tiu Keng Leng", lines: ["KTL", "TKL"] },
  TKO: { zh: "將軍澳", en: "Tseung Kwan O", lines: ["TKL"] },
  LHP: { zh: "康城", en: "LOHAS Park", lines: ["TKL"] },
  HAH: { zh: "坑口", en: "Hang Hau", lines: ["TKL"] },
  POA: { zh: "寶琳", en: "Po Lam", lines: ["TKL"] },
  HOK: { zh: "香港", en: "Hong Kong", lat: 22.2849, lon: 114.1583, lines: ["TCL", "AEL"] },
  KOW: { zh: "九龍", en: "Kowloon", lat: 22.3049, lon: 114.1615, lines: ["TCL", "AEL"] },
  OLY: { zh: "奧運", en: "Olympic", lines: ["TCL"] },
  NAC: { zh: "南昌", en: "Nam Cheong", lines: ["TCL", "TML"] },
  TSY: { zh: "青衣", en: "Tsing Yi", lat: 22.3584, lon: 114.1075, lines: ["TCL", "AEL"] },
  SUN: { zh: "欣澳", en: "Sunny Bay", lines: ["TCL", "DRL"] },
  TUC: { zh: "東涌", en: "Tung Chung", lat: 22.2893, lon: 113.9415, lines: ["TCL"] },
  AIR: { zh: "機場", en: "Airport", lines: ["AEL"] },
  AWE: { zh: "博覽館", en: "AsiaWorld-Expo", lines: ["AEL"] },
  ADM: { zh: "金鐘", en: "Admiralty", lat: 22.2795, lon: 114.1655, lines: ["TWL", "ISL", "EAL", "SIL"] },
  EXC: { zh: "會展", en: "Exhibition Centre", lines: ["EAL"] },
  HUH: { zh: "紅磡", en: "Hung Hom", lines: ["EAL", "TML", "KTL"] },
  MKK: { zh: "旺角東", en: "Mong Kok East", lines: ["EAL"] },
  KOT: { zh: "九龍塘", en: "Kowloon Tong", lines: ["EAL", "KTL"] },
  TAW: { zh: "大圍", en: "Tai Wai", lat: 22.3721, lon: 114.1788, lines: ["EAL", "TML"] },
  SHT: { zh: "沙田", en: "Sha Tin", lat: 22.3828, lon: 114.1879, lines: ["EAL"] },
  FOT: { zh: "火炭", en: "Fo Tan", lat: 22.3953, lon: 114.1987, lines: ["EAL"] },
  RAC: { zh: "馬場", en: "Racecourse", lines: ["EAL"] },
  UNI: { zh: "大學", en: "University", lines: ["EAL"] },
  TAP: { zh: "大埔墟", en: "Tai Po Market", lines: ["EAL"] },
  TWO: { zh: "太和", en: "Tai Wo", lines: ["EAL"] },
  FAN: { zh: "粉嶺", en: "Fanling", lines: ["EAL"] },
  SHS: { zh: "上水", en: "Sheung Shui", lines: ["EAL"] },
  LOW: { zh: "羅湖", en: "Lo Wu", lines: ["EAL"] },
  LMC: { zh: "落馬洲", en: "Lok Ma Chau", lines: ["EAL"] },
  MOS: { zh: "馬鞍山", en: "Ma On Shan", lines: ["TML"] },
  HEO: { zh: "恆安", en: "Heng On", lines: ["TML"] },
  TSH: { zh: "大水坑", en: "Tai Shui Hang", lines: ["TML"] },
  SHM: { zh: "石門", en: "Shek Mun", lines: ["TML"] },
  CIO: { zh: "第一城", en: "City One", lines: ["TML"] },
  STW: { zh: "沙田圍", en: "Sha Tin Wai", lines: ["TML"] },
  CKT: { zh: "車公廟", en: "Che Kung Temple", lines: ["TML"] },
  HIK: { zh: "顯徑", en: "Hin Keng", lines: ["TML"] },
  DIH: { zh: "鑽石山", en: "Diamond Hill", lines: ["KTL", "TML"] },
  KAT: { zh: "啟德", en: "Kai Tak", lines: ["TML"] },
  SUW: { zh: "宋皇臺", en: "Sung Wong Toi", lines: ["TML"] },
  TKW: { zh: "土瓜灣", en: "To Kwa Wan", lines: ["TML"] },
  ETS: { zh: "尖東", en: "East Tsim Sha Tsui", lines: ["TML"] },
  AUS: { zh: "柯士甸", en: "Austin", lines: ["TML"] },
  TWW: { zh: "荃灣西", en: "Tsuen Wan West", lines: ["TML"] },
  KSR: { zh: "錦上路", en: "Kam Sheung Road", lines: ["TML"] },
  YUL: { zh: "元朗", en: "Yuen Long", lines: ["TML"] },
  LOP: { zh: "朗屏", en: "Long Ping", lines: ["TML"] },
  TIS: { zh: "天水圍", en: "Tin Shui Wai", lines: ["TML"] },
  SIH: { zh: "兆康", en: "Siu Hong", lines: ["TML"] },
  TUM: { zh: "屯門", en: "Tuen Mun", lat: 22.3952, lon: 113.9739, lines: ["TML"] },
  WKS: { zh: "烏溪沙", en: "Wu Kai Sha", lat: 22.4293, lon: 114.2436, lines: ["TML"] },
  OCP: { zh: "海洋公園", en: "Ocean Park", lines: ["SIL"] },
  WCH: { zh: "黃竹坑", en: "Wong Chuk Hang", lines: ["SIL"] },
  LET: { zh: "利東", en: "Lei Tung", lines: ["SIL"] },
  SOH: { zh: "海怡半島", en: "South Horizons", lines: ["SIL"] },
  DIS: { zh: "迪士尼", en: "Disneyland Resort", lines: ["DRL"] },
};

const HKO_WEATHER_LOCATIONS = [
  { place: "\u4eac\u58eb\u67cf", lat: 22.312, lon: 114.172 },
  { place: "\u9999\u6e2f\u5929\u6587\u53f0", lat: 22.302, lon: 114.174 },
  { place: "\u9999\u6e2f\u516c\u5712", lat: 22.277, lon: 114.161 },
  { place: "\u9ec3\u7af9\u5751", lat: 22.248, lon: 114.173 },
  { place: "\u6253\u9f13\u5dba", lat: 22.528, lon: 114.156 },
  { place: "\u6d41\u6d6e\u5c71", lat: 22.469, lon: 113.983 },
  { place: "\u5927\u57d4", lat: 22.451, lon: 114.164 },
  { place: "\u5927\u7f8e\u7763", lat: 22.475, lon: 114.237 },
  { place: "\u6c99\u7530", lat: 22.383, lon: 114.189 },
  { place: "\u5c6f\u9580", lat: 22.391, lon: 113.977 },
  { place: "\u5c07\u8ecd\u6fb3", lat: 22.308, lon: 114.259 },
  { place: "\u897f\u8ca2", lat: 22.383, lon: 114.273 },
  { place: "\u9577\u6d32", lat: 22.209, lon: 114.029 },
  { place: "\u8d64\u9c32\u89d2", lat: 22.309, lon: 113.922 },
  { place: "\u9752\u8863", lat: 22.344, lon: 114.109 },
  { place: "\u77f3\u5d17", lat: 22.436, lon: 114.084 },
  { place: "\u8343\u7063\u53ef\u89c0", lat: 22.383, lon: 114.107 },
  { place: "\u8343\u7063\u57ce\u9580\u8c37", lat: 22.375, lon: 114.125 },
  { place: "\u7b72\u7b95\u7063", lat: 22.279, lon: 114.229 },
  { place: "\u4e5d\u9f8d\u57ce", lat: 22.328, lon: 114.191 },
  { place: "\u8dd1\u99ac\u5730", lat: 22.269, lon: 114.186 },
  { place: "\u9ec3\u5927\u4ed9", lat: 22.342, lon: 114.194 },
  { place: "\u8d64\u67f1", lat: 22.219, lon: 114.214 },
  { place: "\u89c0\u5858", lat: 22.313, lon: 114.225 },
  { place: "\u6df1\u6c34\u57d7", lat: 22.331, lon: 114.159 },
  { place: "\u555f\u5fb7\u8dd1\u9053\u516c\u5712", lat: 22.306, lon: 114.214 },
  { place: "\u5143\u6717\u516c\u5712", lat: 22.443, lon: 114.022 },
  { place: "\u4e2d\u897f\u5340", lat: 22.286, lon: 114.154 },
  { place: "\u6771\u5340", lat: 22.282, lon: 114.229 },
  { place: "\u8475\u9752", lat: 22.354, lon: 114.103 },
  { place: "\u96e2\u5cf6\u5340", lat: 22.262, lon: 113.946 },
  { place: "\u5317\u5340", lat: 22.501, lon: 114.128 },
  { place: "\u5357\u5340", lat: 22.247, lon: 114.158 },
  { place: "\u7063\u4ed4", lat: 22.277, lon: 114.176 },
  { place: "\u6cb9\u5c16\u65fa", lat: 22.305, lon: 114.17 },
];

const STOCK_CHINESE_NAMES = {
  "^HSI": "\u6052\u751f\u6307\u6578",
  HSI: "\u6052\u751f\u6307\u6578",
  "0001.HK": "\u9577\u548c",
  "0002.HK": "\u4e2d\u96fb\u63a7\u80a1",
  "0003.HK": "\u9999\u6e2f\u4e2d\u83ef\u7164\u6c23",
  "0005.HK": "\u532f\u8c50\u63a7\u80a1",
  "0011.HK": "\u6052\u751f\u9280\u884c",
  "0016.HK": "\u65b0\u9d3b\u57fa\u5730\u7522",
  "0388.HK": "\u9999\u6e2f\u4ea4\u6613\u6240",
  "0700.HK": "\u9a30\u8a0a\u63a7\u80a1",
  "0823.HK": "\u9818\u5c55\u623f\u7522\u57fa\u91d1",
  "0939.HK": "\u5efa\u8a2d\u9280\u884c",
  "0941.HK": "\u4e2d\u570b\u79fb\u52d5",
  "1299.HK": "\u53cb\u90a6\u4fdd\u96aa",
  "1810.HK": "\u5c0f\u7c73\u96c6\u5718",
  "2318.HK": "\u4e2d\u570b\u5e73\u5b89",
  "2388.HK": "\u4e2d\u9280\u9999\u6e2f",
  "3690.HK": "\u7f8e\u5718",
  "3988.HK": "\u4e2d\u570b\u9280\u884c",
  "9618.HK": "\u4eac\u6771\u96c6\u5718",
  "9888.HK": "\u767e\u5ea6\u96c6\u5718",
  "9988.HK": "\u963f\u91cc\u5df4\u5df4",
};

const els = {
  clock: document.querySelector("#clock"),
  dateText: document.querySelector("#dateText"),
  homeBackdrop: document.querySelector("#homeBackdrop"),
  albumBackdrop: document.querySelector("#albumBackdrop"),
  trackTitle: document.querySelector("#trackTitle"),
  trackArtist: document.querySelector("#trackArtist"),
  playPause: document.querySelector("#playPause"),
  playState: document.querySelector("#playState"),
  progressBar: document.querySelector("#progressBar"),
  seekBar: document.querySelector("#seekBar"),
  musicVolume: document.querySelector("#musicVolume"),
  volumeIcon: document.querySelector("#volumeIcon"),
  volumeToggle: document.querySelector("#volumeToggle"),
  spotifyLogin: document.querySelector("#spotifyLogin"),
  previousTrack: document.querySelector("#previousTrack"),
  nextTrack: document.querySelector("#nextTrack"),
  connectDevice: document.querySelector("#connectDevice"),
  weatherDate: document.querySelector("#weatherDate"),
  weatherCard: document.querySelector("#weatherCard"),
  weatherPhoto: document.querySelector("#weatherPhoto"),
  weatherLocation: document.querySelector("#weatherLocation"),
  weatherTemp: document.querySelector("#weatherTemp"),
  weatherDesc: document.querySelector("#weatherDesc"),
  weatherIconImage: document.querySelector("#weatherIconImage"),
  weatherHumidity: document.querySelector("#weatherHumidity"),
  weatherRain: document.querySelector("#weatherRain"),
  weatherLow: document.querySelector("#weatherLow"),
  weatherHigh: document.querySelector("#weatherHigh"),
  musicCard: document.querySelector("#musicCard"),
  musicSourceButton: document.querySelector("#musicSourceButton"),
  musicBackButton: document.querySelector("#musicBackButton"),
  musicSourcePanel: document.querySelector("#musicSourcePanel"),
  musicSourceOptions: [...document.querySelectorAll("[data-source-option]")],
  youtubeLayer: document.querySelector("#youtubeLayer"),
  youtubePlayer: document.querySelector("#youtubePlayer"),
  youtubeEmpty: document.querySelector("#youtubeEmpty"),
  youtubeSettingsButton: document.querySelector("#youtubeSettingsButton"),
  youtubeForm: document.querySelector("#youtubeForm"),
  youtubeUrlInput: document.querySelector("#youtubeUrlInput"),
  youtubeSourceBackButton: document.querySelector("#youtubeSourceBackButton"),
  marketCard: document.querySelector("#marketCard"),
  marketPortfolioButton: document.querySelector("#marketPortfolioButton"),
  marketFlipButton: document.querySelector("#marketFlipButton"),
  marketManageButton: document.querySelector("#marketManageButton"),
  marketBackButton: document.querySelector("#marketBackButton"),
  marketBackTitle: document.querySelector("#marketBackTitle"),
  marketDisplayPanel: document.querySelector("#marketDisplayPanel"),
  marketDisplayForm: document.querySelector("#marketDisplayForm"),
  marketSettingsPanel: document.querySelector("#marketSettingsPanel"),
  marketPortfolioPanel: document.querySelector("#marketPortfolioPanel"),
  marketHoldingRows: document.querySelector("#marketHoldingRows"),
  marketHkTotal: document.querySelector("#marketHkTotal"),
  marketUsTotal: document.querySelector("#marketUsTotal"),
  portfolioLines: [...document.querySelectorAll("[data-portfolio-line]")],
  marketForm: document.querySelector("#marketForm"),
  marketSymbolInputs: [...document.querySelectorAll("[data-market-symbol-input]")],
  marketHiddenInputs: [...document.querySelectorAll("[data-market-hidden-input]")],
  marketMetrics: [...document.querySelectorAll(".market-metric")],
  marketLines: [...document.querySelectorAll("[data-market-line]")],
  marketStatus: document.querySelector("#marketStatus"),
  mtrCard: document.querySelector("#mtrCard"),
  mtrFlipButton: document.querySelector("#mtrFlipButton"),
  mtrBackTitle: document.querySelector("#mtrBackTitle"),
  mtrBackButton: document.querySelector("#mtrBackButton"),
  mtrTransportButton: document.querySelector("#mtrTransportButton"),
  transportSettingsButton: document.querySelector("#transportSettingsButton"),
  mtrSettingsPanel: document.querySelector("#mtrSettingsPanel"),
  mtrTransportPanel: document.querySelector("#mtrTransportPanel"),
  mtrTransportOptions: [...document.querySelectorAll("[data-transport-option]")],
  mtrForm: document.querySelector("#mtrForm"),
  mtrStationSelect: document.querySelector("#mtrStationSelect"),
  mtrLineSelect: document.querySelector("#mtrLineSelect"),
  mtrLocateButton: document.querySelector("#mtrLocateButton"),
  mtrStationZh: document.querySelector("#mtrStationZh"),
  mtrStationEn: document.querySelector("#mtrStationEn"),
  mtrLineZh: document.querySelector("#mtrLineZh"),
  mtrLineEn: document.querySelector("#mtrLineEn"),
  mtrLeftRows: document.querySelector("#mtrLeftRows"),
  mtrRightRows: document.querySelector("#mtrRightRows"),
  mtrModeLabel: document.querySelector("#mtrModeLabel"),
  mtrUpdated: document.querySelector("#mtrUpdated"),
  mtrDisplay: document.querySelector("#mtrDisplay"),
  busDisplay: document.querySelector("#busDisplay"),
  busClock: document.querySelector("#busClock"),
  busWeatherTemp: document.querySelector("#busWeatherTemp"),
  busWeatherText: document.querySelector("#busWeatherText"),
  busAdText: document.querySelector("#busAdText"),
  busDateText: document.querySelector("#busDateText"),
  busEtaRows: document.querySelector("#busEtaRows"),
  busModeLabel: document.querySelector("#busModeLabel"),
  busUpdated: document.querySelector("#busUpdated"),
  busSettingsPanel: document.querySelector("#busSettingsPanel"),
  busForm: document.querySelector("#busForm"),
  busDisplayMode: document.querySelector("#busDisplayMode"),
  busDirection: document.querySelector("#busDirection"),
  busStopRows: document.querySelector("#busStopRows"),
  busAddStop: document.querySelector("#busAddStop"),
  minibusDisplay: document.querySelector("#minibusDisplay"),
  minibusClock: document.querySelector("#minibusClock"),
  minibusWeatherTemp: document.querySelector("#minibusWeatherTemp"),
  minibusWeatherText: document.querySelector("#minibusWeatherText"),
  minibusAdText: document.querySelector("#minibusAdText"),
  minibusDateText: document.querySelector("#minibusDateText"),
  minibusEtaRows: document.querySelector("#minibusEtaRows"),
  minibusModeLabel: document.querySelector("#minibusModeLabel"),
  minibusUpdated: document.querySelector("#minibusUpdated"),
  minibusSettingsPanel: document.querySelector("#minibusSettingsPanel"),
  minibusForm: document.querySelector("#minibusForm"),
  minibusRouteSearch: document.querySelector("#minibusRouteSearch"),
  minibusRouteSearchButton: document.querySelector("#minibusRouteSearchButton"),
  minibusRouteSelect: document.querySelector("#minibusRouteSelect"),
  minibusRouteDirection: document.querySelector("#minibusRouteDirection"),
  minibusRouteStopSelect: document.querySelector("#minibusRouteStopSelect"),
  minibusStopRows: document.querySelector("#minibusStopRows"),
  minibusAddStop: document.querySelector("#minibusAddStop"),
  loginForm: document.querySelector("#loginForm"),
  loginKicker: document.querySelector("#loginKicker"),
  loginEmail: document.querySelector("#loginEmail"),
  loginPassword: document.querySelector("#loginPassword"),
  loginSubmit: document.querySelector("#loginSubmit"),
  loginMessage: document.querySelector("#loginMessage"),
  signupToggle: document.querySelector("#signupToggle"),
  signupUsernameField: document.querySelector("#signupUsernameField"),
  signupUsername: document.querySelector("#signupUsername"),
  signupCodeField: document.querySelector("#signupCodeField"),
  signupCode: document.querySelector("#signupCode"),
};

const nowPlaying = {
  albumImage: "./assets/taeyeon-four-seasons.jpg",
};

const WEATHER_BACKGROUNDS = {
  SUNNY: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1280&q=80",
  CLOUDY: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1280&q=80",
  RAINING: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1280&q=80",
  STORM: "https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=1280&q=80",
  FOG: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1280&q=80",
};

const WEATHER_TIME_BACKGROUNDS = {
  morning: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1280&q=80",
  afternoon: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80",
  evening: "https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&w=1280&q=80",
  night: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1280&q=80",
};

const WEATHER_BACKGROUND_BY_TIME = {
  SUNNY: {
    morning: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1280&q=80",
    afternoon: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80",
    evening: "https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&w=1280&q=80",
    night: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1280&q=80",
  },
  CLOUDY: {
    morning: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1280&q=80",
    afternoon: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1280&q=80",
    evening: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1280&q=80",
    night: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1280&q=80",
  },
  RAINING: {
    morning: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1280&q=80",
    afternoon: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1280&q=80",
    evening: "https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?auto=format&fit=crop&w=1280&q=80",
    night: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1280&q=80",
  },
  STORM: {
    morning: "https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=1280&q=80",
    afternoon: "https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=1280&q=80",
    evening: "https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=1280&q=80",
    night: "https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=1280&q=80",
  },
  FOG: {
    morning: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1280&q=80",
    afternoon: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1280&q=80",
    evening: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1280&q=80",
    night: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1280&q=80",
  },
};

const WEATHER_TIME_CLASSES = [
  "time-morning",
  "time-afternoon",
  "time-evening",
  "time-night",
];

const WEATHER_LABELS = {
  SUNNY: "SUNNY",
  CLOUDY: "CLOUDY",
  RAINING: "RAINING",
  STORM: "STORM",
  FOG: "FOG",
};

const WEATHER_ICONS = {
  SUNNY: "./assets/weather-sunny.svg",
  CLOUDY: "./assets/weather-cloudy.svg",
  RAINING: "./assets/weather-raining.svg",
  STORM: "./assets/weather-storm.svg",
  FOG: "./assets/weather-fog.svg",
};

let playing = true;
let spotifyPlayer = null;
let spotifyDeviceId = null;
let currentTrackId = null;
let currentDurationMs = 0;
let currentProgressMs = 0;
let currentProgressUpdatedAt = 0;
let isSpotifyPlaying = false;
let isSignupMode = false;
let activePanelIndex = 0;
let lastPanelMoveAt = Date.now();
let currentWeatherCondition = "CLOUDY";
let marketQuotes = [];
let marketQuoteMap = new Map();
let musicSource = DEFAULT_MUSIC_SOURCE;
let radioAudio = null;
let radioHls = null;
let isRadioPlaying = false;
let radioStreamIndex = 0;
let radioRetrying = false;
let musicVolume = DEFAULT_MUSIC_VOLUME;
let previousMusicVolume = DEFAULT_MUSIC_VOLUME;
let isSeeking = false;
let mtrTimeDisplayMode = localStorage.getItem("mtrTimeDisplayMode") === "mins" ? "mins" : "time";
let minibusRouteMatches = [];
let minibusRouteStops = [];

const DEFAULT_PORTFOLIO_ITEMS = [
  { market: "HK", symbol: "0700.HK", lots: 0 },
  { market: "US", symbol: "AAPL", lots: 0 },
];
const MARKET_LOT_SIZE = {
  HK: 1,
  US: 1,
};

function isLocalStatic() {
  return location.protocol === "file:" || location.hostname === "127.0.0.1" || location.hostname === "localhost";
}

async function requireAppLogin() {
  if (!stage || isLocalStatic()) return true;

  try {
    const response = await fetch("/api/me", { credentials: "include" });
    const data = response.ok ? await response.json() : null;
    if (data?.user) return true;
  } catch {
    // If auth check fails on production, prefer the login screen over showing private content.
  }

  const next = `${location.pathname}${location.search}${location.hash}`;
  location.replace(`/login?next=${encodeURIComponent(next)}`);
  return false;
}

function updateClock() {
  const now = new Date();
  const timeText = new Intl.DateTimeFormat("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  els.clock.textContent = timeText;
  els.clock.dateTime = now.toISOString();
  const dateText = new Intl.DateTimeFormat("zh-HK", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(now);
  els.dateText.textContent = dateText;
  if (els.busClock) {
    els.busClock.textContent = timeText;
    els.busClock.dateTime = now.toISOString();
  }
  if (els.minibusClock) {
    els.minibusClock.textContent = timeText;
    els.minibusClock.dateTime = now.toISOString();
  }
  if (els.busDateText) {
    els.busDateText.textContent = new Intl.DateTimeFormat("zh-HK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(now);
  }
  if (els.minibusDateText) {
    els.minibusDateText.textContent = new Intl.DateTimeFormat("zh-HK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(now);
  }
  updateTransportHolidayText(now);
  updateHomeScaleTime();
}

function updateHomeScaleTime() {
  if (!els.clock) return;
  const [hours, minutes] = els.clock.textContent.split(":");
  els.clock.innerHTML = `<span>${hours}</span><span>${minutes}</span>`;
}

function normalizeHolidayDate(value = "") {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length !== 8) return "";
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function normalizeHolidayList(payload = {}) {
  if (Array.isArray(payload.holidays)) {
    return payload.holidays
      .map((holiday) => ({
        date: normalizeHolidayDate(holiday.date),
        name: String(holiday.name || holiday.summary || "").trim(),
      }))
      .filter((holiday) => holiday.date && holiday.name)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  const events = payload.vcalendar?.[0]?.vevent || [];
  return events
    .map((event) => ({
      date: normalizeHolidayDate(Array.isArray(event.dtstart) ? event.dtstart[0] : event.dtstart),
      name: String(event.summary || "").trim(),
    }))
    .filter((holiday) => holiday.date && holiday.name)
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function loadPublicHolidays() {
  const endpoint = isLocalStatic() ? "https://www.1823.gov.hk/common/ical/tc.json" : "/api/holidays";
  try {
    const response = await fetch(endpoint, isLocalStatic() ? {} : { credentials: "include" });
    const raw = await response.text();
    const payload = JSON.parse(raw.replace(/^\uFEFF/, ""));
    const holidays = normalizeHolidayList(payload);
    if (holidays.length) {
      transportPublicHolidays = holidays;
      updateTransportHolidayText();
    }
  } catch {
    updateTransportHolidayText();
  }
}

function getNextPublicHoliday(now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return transportPublicHolidays.find((holiday) => {
    const date = new Date(`${holiday.date}T00:00:00+08:00`);
    return date >= today;
  });
}

function updateTransportHolidayText(now = new Date()) {
  const holiday = getNextPublicHoliday(now);
  if (!holiday) {
    if (els.busAdText) els.busAdText.textContent = "下一個公眾假期：待公布";
    if (els.minibusAdText) els.minibusAdText.textContent = "下一個公眾假期：待公布";
    return;
  }
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const holidayDate = new Date(`${holiday.date}T00:00:00+08:00`);
  const days = Math.max(0, Math.ceil((holidayDate.getTime() - today.getTime()) / 86400000));
  const text = days === 0 ? `今日是${holiday.name}` : `距離下個公眾假期：${holiday.name}還有${days}日`;
  if (els.busAdText) els.busAdText.textContent = text;
  if (els.minibusAdText) els.minibusAdText.textContent = text;
}

function setActiveDot(index) {
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
    dot.setAttribute("aria-current", dotIndex === index ? "page" : "false");
  });
}

function updateActivePanel() {
  const index = Math.round(stage.scrollTop / stage.clientHeight);
  const nextIndex = Math.max(0, Math.min(index, panels.length - 1));
  if (nextIndex !== activePanelIndex) {
    activePanelIndex = nextIndex;
    lastPanelMoveAt = Date.now();
  }
  setActiveDot(nextIndex);
}

function scrollToPanel(index, behavior = "smooth") {
  const panel = panels[index];
  if (!panel) return;
  panel.scrollIntoView({ behavior, block: "start" });
}

function markPanelActivity() {
  lastPanelMoveAt = Date.now();
}

function rotatePanelIfIdle() {
  if (!stage || panels.length < 2) return;
  if (Date.now() - lastPanelMoveAt < AUTO_ROTATE_MS) return;
  const nextIndex = activePanelIndex >= panels.length - 1 ? 0 : activePanelIndex + 1;
  lastPanelMoveAt = Date.now();
  scrollToPanel(nextIndex);
}

function resizeStage() {
  const scale = Math.min(window.innerWidth / 640, window.innerHeight / 480);
  stage.style.setProperty("--stage-scale", scale.toString());
}

function renderEmptySpotifyState() {
  if (!els.albumBackdrop) return;
  els.trackTitle.textContent = "沒有播放內容";
  els.trackArtist.textContent = "請在 Spotify 播放歌曲";
  els.albumBackdrop.src = nowPlaying.albumImage;
  els.progressBar.style.width = "0%";
  if (els.seekBar) els.seekBar.value = "0";
  currentTrackId = null;
  currentDurationMs = 0;
  currentProgressMs = 0;
  isSpotifyPlaying = false;
  els.playPause.classList.add("is-paused");
  els.playState.textContent = "未在播放";
}

async function loadSpotlightHomeImage() {
  if (!els.homeBackdrop) return;

  try {
    if (isLocalStatic()) throw new Error("Spotlight proxy is unavailable locally");
    const response = await fetch("/api/spotlight");
    if (!response.ok) throw new Error("Spotlight image failed");

    const data = await response.json();
    if (data.url) {
      els.homeBackdrop.src = data.url;
      els.homeBackdrop.alt = data.title || "";
    }
  } catch {
    els.homeBackdrop.src = "./assets/space-launch.svg";
  }
}

function formatMtrTime(value) {
  if (!value) return "--:--";
  const text = String(value);
  const timeMatch = text.match(/(\d{2}):(\d{2})(?::\d{2})?/);
  if (timeMatch) return `${timeMatch[1]}:${timeMatch[2]}`;

  const date = new Date(text);
  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("zh-HK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return "--:--";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getMtrLineProfile(lineCode) {
  return MTR_LINES[lineCode] || MTR_LINES[MTR_DEFAULT_CONFIG.line];
}

function getMtrStationProfile(stationCode) {
  return MTR_STATIONS[stationCode] || MTR_STATIONS[MTR_DEFAULT_CONFIG.station];
}

function normalizeMtrConfig(config = {}) {
  const station = MTR_STATIONS[config.station] ? config.station : MTR_DEFAULT_CONFIG.station;
  const stationProfile = getMtrStationProfile(station);
  const requestedLine = MTR_LINES[config.line] ? config.line : stationProfile.lines[0];
  const line = stationProfile.lines.includes(requestedLine) ? requestedLine : stationProfile.lines[0];
  return { station, line };
}

function getSavedMtrConfig() {
  try {
    return normalizeMtrConfig(JSON.parse(localStorage.getItem("mtrConfig") || "{}"));
  } catch {
    return { ...MTR_DEFAULT_CONFIG };
  }
}

function saveMtrConfig(config) {
  const normalized = normalizeMtrConfig(config);
  localStorage.setItem("mtrConfig", JSON.stringify(normalized));
  return normalized;
}

function getNearestMtrConfig(latitude, longitude) {
  let nearestStation = MTR_DEFAULT_CONFIG.station;
  let nearestDistance = Infinity;

  Object.entries(MTR_STATIONS).forEach(([stationCode, station]) => {
    if (!Number.isFinite(station.lat) || !Number.isFinite(station.lon)) return;
    const latDistance = station.lat - latitude;
    const lonDistance = station.lon - longitude;
    const distance = latDistance * latDistance + lonDistance * lonDistance;
    if (distance < nearestDistance) {
      nearestStation = stationCode;
      nearestDistance = distance;
    }
  });

  return normalizeMtrConfig({
    station: nearestStation,
    line: MTR_STATIONS[nearestStation].lines[0],
  });
}

function updateMtrHeader(config = getSavedMtrConfig()) {
  const normalized = normalizeMtrConfig(config);
  const station = getMtrStationProfile(normalized.station);
  const line = getMtrLineProfile(normalized.line);
  if (els.mtrStationZh) els.mtrStationZh.textContent = station.zh;
  if (els.mtrStationEn) els.mtrStationEn.textContent = station.en;
  if (els.mtrLineZh) els.mtrLineZh.textContent = line.zh;
  if (els.mtrLineEn) els.mtrLineEn.textContent = line.en;
  if (els.mtrCard) els.mtrCard.style.setProperty("--mtr-line-color", line.color);
}

function formatMtrMins(train = {}) {
  const rawMins = Number.parseInt(train.ttnt, 10);
  if (Number.isFinite(rawMins)) {
    if (rawMins <= 0) return "Arriving";
    return `${rawMins} min`;
  }

  const arrivalTime = new Date(train.time);
  if (!Number.isNaN(arrivalTime.getTime())) {
    const mins = Math.max(0, Math.round((arrivalTime.getTime() - Date.now()) / 60000));
    if (mins <= 0) return "Arriving";
    return `${mins} min`;
  }

  return "--";
}

function updateMtrTimeDisplay() {
  els.mtrCard?.classList.toggle("is-mins", mtrTimeDisplayMode === "mins");

  document.querySelectorAll(".mtr-time").forEach((timeNode) => {
    timeNode.textContent =
      mtrTimeDisplayMode === "mins" ? timeNode.dataset.minsValue || "--" : timeNode.dataset.timeValue || "--:--";
  });

  if (els.mtrModeLabel) {
    els.mtrModeLabel.textContent =
      mtrTimeDisplayMode === "mins" ? "MTR Next Trains (In Mins)" : "MTR Next Trains (In Time)";
  }
}

function renderMtrRows(container, trains = [], destinationCode, lineCode = MTR_DEFAULT_CONFIG.line) {
  if (!container) return;
  const line = getMtrLineProfile(lineCode);
  const fallback = line.destinations[destinationCode] || Object.values(line.destinations)[0];
  const seen = new Set();
  const rows = [...trains]
    .filter((train) => {
      const key = [train.dest, train.plat, train.time || train.ttnt].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4);

  while (rows.length < 4) {
    rows.push({ dest: destinationCode, plat: fallback.platform, time: "" });
  }

  container.innerHTML = rows
    .map((train) => {
      const info = line.destinations[train.dest] || fallback;
      const platform = train.plat || info.platform || "";
      const timeText = formatMtrTime(train.time);
      const minsText = formatMtrMins(train);
      return `
        <div class="mtr-train-row">
          <span class="mtr-platform">${escapeHtml(platform || "-")}</span>
          <span class="mtr-destination">
            <strong>${escapeHtml(info.zh)}</strong>
            <span>${escapeHtml(info.en)}</span>
          </span>
          <time class="mtr-time" data-time-value="${escapeHtml(timeText)}" data-mins-value="${escapeHtml(minsText)}">${escapeHtml(
            mtrTimeDisplayMode === "mins" ? minsText : timeText,
          )}</time>
        </div>
      `;
    })
    .join("");
  updateMtrTimeDisplay();
}

function splitMtrSchedule(data = {}, config = getSavedMtrConfig()) {
  const line = getMtrLineProfile(config.line);
  const schedule = data.data?.[`${config.line}-${config.station}`] || {};
  const up = Array.isArray(schedule.UP) ? schedule.UP : [];
  const down = Array.isArray(schedule.DOWN) ? schedule.DOWN : [];
  const allTrains = [...up, ...down];
  const left = allTrains.filter((train) => line.leftDestinations.includes(train.dest));
  const right = allTrains.filter((train) => line.rightDestinations.includes(train.dest));

  return {
    left,
    right,
    leftFallback: line.leftDestinations[0],
    rightFallback: line.rightDestinations[0],
  };
}

function setMtrStatus(text) {
  if (els.mtrUpdated) els.mtrUpdated.textContent = text;
}

async function loadMtrTimes() {
  if (!els.mtrCard) return;
  const config = getSavedMtrConfig();
  updateMtrHeader(config);
  const endpoint = isLocalStatic()
    ? `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${config.line}&sta=${config.station}`
    : `/api/mtr?line=${config.line}&station=${config.station}`;

  try {
    const response = await fetch(endpoint, isLocalStatic() ? {} : { credentials: "include" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.status === 0) throw new Error(data.message || "MTR request failed");

    const schedule = splitMtrSchedule(data, config);
    renderMtrRows(els.mtrLeftRows, schedule.left, schedule.leftFallback, config.line);
    renderMtrRows(els.mtrRightRows, schedule.right, schedule.rightFallback, config.line);
    setMtrStatus(`Updated ${formatMtrTime(data.sys_time || new Date().toISOString())}`);
  } catch {
    const line = getMtrLineProfile(config.line);
    renderMtrRows(els.mtrLeftRows, [], line.leftDestinations[0], config.line);
    renderMtrRows(els.mtrRightRows, [], line.rightDestinations[0], config.line);
    setMtrStatus("MTR 暫時未能更新");
  }
}

function renderMtrSettings(config = getSavedMtrConfig()) {
  if (!els.mtrStationSelect || !els.mtrLineSelect) return;
  const normalized = normalizeMtrConfig(config);

  els.mtrStationSelect.innerHTML = Object.entries(MTR_STATIONS)
    .map(([stationCode, station]) => `<option value="${stationCode}">${station.zh} / ${station.en}</option>`)
    .join("");
  els.mtrStationSelect.value = normalized.station;

  const station = getMtrStationProfile(normalized.station);
  els.mtrLineSelect.innerHTML = station.lines
    .map((lineCode) => {
      const line = getMtrLineProfile(lineCode);
      return `<option value="${lineCode}">${line.zh} / ${line.en}</option>`;
    })
    .join("");
  els.mtrLineSelect.value = normalized.line;
}

function normalizeBusStop(stop = {}) {
  return {
    name: String(stop.name || "").trim(),
    stopId: String(stop.stopId || stop.id || "").trim(),
  };
}

function normalizeMinibusStop(stop = {}) {
  return {
    name: String(stop.name || "").trim(),
    stopId: String(stop.stopId || stop.id || "").trim(),
    routeCode: String(stop.routeCode || stop.route || "").trim(),
    routeId: String(stop.routeId || stop.route_id || "").trim(),
    routeSeq: String(stop.routeSeq || stop.route_seq || "").trim(),
    stopSeq: String(stop.stopSeq || stop.stop_seq || "").trim(),
    destTc: String(stop.destTc || stop.dest_tc || "").trim(),
    destEn: String(stop.destEn || stop.dest_en || "").trim(),
  };
}

function getSavedBusStops() {
  try {
    if (localStorage.getItem("busStopsDefaultVersion") !== BUS_DEFAULT_STOPS_VERSION) {
      localStorage.setItem("busStops", JSON.stringify(BUS_DEFAULT_STOPS));
      localStorage.setItem("busStopsDefaultVersion", BUS_DEFAULT_STOPS_VERSION);
      return [...BUS_DEFAULT_STOPS];
    }
    const stops = JSON.parse(localStorage.getItem("busStops") || "[]");
    if (!Array.isArray(stops)) return [...BUS_DEFAULT_STOPS];
    const normalized = stops.map(normalizeBusStop).filter((stop) => stop.stopId).slice(0, BUS_MAX_STOPS);
    return normalized.length ? normalized : [...BUS_DEFAULT_STOPS];
  } catch {
    return [...BUS_DEFAULT_STOPS];
  }
}

function saveBusStops(stops = []) {
  const normalized = stops.map(normalizeBusStop).filter((stop) => stop.stopId).slice(0, BUS_MAX_STOPS);
  localStorage.setItem("busStops", JSON.stringify(normalized));
  localStorage.setItem("busStopsDefaultVersion", BUS_DEFAULT_STOPS_VERSION);
  return normalized;
}

function getSavedMinibusStops() {
  try {
    if (localStorage.getItem("minibusStopsDefaultVersion") !== MINIBUS_DEFAULT_STOPS_VERSION) {
      localStorage.setItem("minibusStops", JSON.stringify(MINIBUS_DEFAULT_STOPS));
      localStorage.setItem("minibusStopsDefaultVersion", MINIBUS_DEFAULT_STOPS_VERSION);
      return [...MINIBUS_DEFAULT_STOPS];
    }
    const stops = JSON.parse(localStorage.getItem("minibusStops") || "[]");
    if (!Array.isArray(stops)) return [...MINIBUS_DEFAULT_STOPS];
    const normalized = stops.map(normalizeMinibusStop).filter((stop) => stop.stopId).slice(0, MINIBUS_MAX_STOPS);
    return normalized.length ? normalized : [...MINIBUS_DEFAULT_STOPS];
  } catch {
    return [...MINIBUS_DEFAULT_STOPS];
  }
}

function saveMinibusStops(stops = []) {
  const normalized = stops.map(normalizeMinibusStop).filter((stop) => stop.stopId).slice(0, MINIBUS_MAX_STOPS);
  localStorage.setItem("minibusStops", JSON.stringify(normalized));
  localStorage.setItem("minibusStopsDefaultVersion", MINIBUS_DEFAULT_STOPS_VERSION);
  return normalized;
}

function getSavedBusMode() {
  return localStorage.getItem("busDisplayMode") === "single" ? "single" : "all";
}

function getSavedBusDirection() {
  return localStorage.getItem("busDirection") === "I" ? "I" : "O";
}

function getSavedMinibusMode() {
  return "all";
}

function getSavedMinibusDirection() {
  return "O";
}

function renderBusSettings(stops = getSavedBusStops()) {
  if (!els.busStopRows) return;
  if (els.busDisplayMode) els.busDisplayMode.value = getSavedBusMode();
  if (els.busDirection) els.busDirection.value = getSavedBusDirection();
  const rows = stops.length ? stops : [{ name: "", stopId: "" }];

  els.busStopRows.innerHTML = rows
    .slice(0, BUS_MAX_STOPS)
    .map(
      (stop, index) => `
        <div class="bus-stop-row" data-bus-stop-row>
          <span>站 ${index + 1}</span>
          <input type="text" value="${escapeHtml(stop.name)}" placeholder="站名，例如：火炭村 FT526" data-bus-stop-name>
          <input type="text" value="${escapeHtml(stop.stopId)}" placeholder="KMB stop ID，例如：C458B4A40BFCC4FF" data-bus-stop-id>
          <button type="button" aria-label="刪除巴士站" data-bus-stop-remove>&times;</button>
        </div>
      `,
    )
    .join("");
}

function renderMinibusSettings(stops = getSavedMinibusStops()) {
  if (!els.minibusStopRows) return;
  const rows = stops.length ? stops : [];
  if (els.minibusRouteSearch && !els.minibusRouteSearch.value) {
    els.minibusRouteSearch.value = rows[0]?.routeCode || MINIBUS_DEFAULT_STOPS[0]?.routeCode || "811";
  }

  els.minibusStopRows.innerHTML = rows.length
    ? rows
    .slice(0, MINIBUS_MAX_STOPS)
    .map(
      (stop, index) => `
        <div class="bus-stop-row" data-minibus-stop-row>
          <span>${index + 1}</span>
          <strong class="minibus-stop-route">${escapeHtml(stop.routeCode || "小巴")}</strong>
          <span class="minibus-stop-summary">${escapeHtml(stop.name || stop.stopId || "--")}${stop.destTc ? ` · 往 ${escapeHtml(stop.destTc)}` : ""}</span>
          <input type="hidden" value="${escapeHtml(stop.name)}" data-minibus-stop-name>
          <input type="hidden" value="${escapeHtml(stop.stopId)}" data-minibus-stop-id>
          <input type="hidden" value="${escapeHtml(stop.routeCode)}" data-minibus-route-code>
          <input type="hidden" value="${escapeHtml(stop.routeId)}" data-minibus-route-id>
          <input type="hidden" value="${escapeHtml(stop.routeSeq)}" data-minibus-route-seq>
          <input type="hidden" value="${escapeHtml(stop.stopSeq)}" data-minibus-stop-seq>
          <input type="hidden" value="${escapeHtml(stop.destTc)}" data-minibus-dest-tc>
          <input type="hidden" value="${escapeHtml(stop.destEn)}" data-minibus-dest-en>
          <button type="button" aria-label="刪除小巴站" data-minibus-stop-remove>&times;</button>
        </div>
      `,
    )
    .join("")
    : `<div class="bus-empty-state minibus-picker-empty"><strong>未有站點</strong><span>搜尋路線後加入小巴站。</span></div>`;
}

function normalizeMinibusRoute(route = {}) {
  return {
    routeId: String(route.route_id || route.routeId || "").trim(),
    routeCode: String(route.route_code || route.routeCode || "").trim(),
    region: String(route.region || "").trim(),
    description: String(route.description_tc || route.description || "").trim(),
    directions: Array.isArray(route.directions)
      ? route.directions.map((direction) => ({
          routeSeq: String(direction.route_seq || "").trim(),
          origTc: String(direction.orig_tc || "").trim(),
          origEn: String(direction.orig_en || "").trim(),
          destTc: String(direction.dest_tc || "").trim(),
          destEn: String(direction.dest_en || "").trim(),
        }))
      : [],
  };
}

function getSelectedMinibusRoute() {
  return minibusRouteMatches.find((route) => route.routeId === els.minibusRouteSelect?.value) || null;
}

function renderMinibusRouteOptions(routes = []) {
  minibusRouteMatches = routes.map(normalizeMinibusRoute).filter((route) => route.routeId && route.routeCode);
  if (!els.minibusRouteSelect) return;
  if (!minibusRouteMatches.length) {
    els.minibusRouteSelect.innerHTML = `<option value="">未找到路線</option>`;
    renderMinibusDirectionOptions(null);
    return;
  }
  els.minibusRouteSelect.innerHTML = minibusRouteMatches
    .map((route) => {
      const label = `${route.routeCode} · ${route.region}${route.description ? ` · ${route.description}` : ""}`;
      return `<option value="${escapeHtml(route.routeId)}">${escapeHtml(label)}</option>`;
    })
    .join("");
  renderMinibusDirectionOptions(minibusRouteMatches[0]);
}

function renderMinibusDirectionOptions(route) {
  if (!els.minibusRouteDirection) return;
  if (!route?.directions?.length) {
    els.minibusRouteDirection.innerHTML = `<option value="">未有方向</option>`;
    renderMinibusStopOptions([]);
    return;
  }
  els.minibusRouteDirection.innerHTML = route.directions
    .map((direction) => {
      const label = `${direction.origTc || direction.origEn || "--"} → ${direction.destTc || direction.destEn || "--"}`;
      return `<option value="${escapeHtml(direction.routeSeq)}">${escapeHtml(label)}</option>`;
    })
    .join("");
}

function renderMinibusStopOptions(stops = []) {
  minibusRouteStops = stops.map((stop) => ({
    stopSeq: String(stop.stop_seq || stop.stopSeq || "").trim(),
    stopId: String(stop.stop_id || stop.stopId || "").trim(),
    nameTc: String(stop.name_tc || stop.name || "").trim(),
    nameEn: String(stop.name_en || "").trim(),
  })).filter((stop) => stop.stopId);
  if (!els.minibusRouteStopSelect) return;
  if (!minibusRouteStops.length) {
    els.minibusRouteStopSelect.innerHTML = `<option value="">未有站點</option>`;
    return;
  }
  els.minibusRouteStopSelect.innerHTML = minibusRouteStops
    .map((stop) => `<option value="${escapeHtml(stop.stopId)}">${escapeHtml(stop.nameTc || stop.nameEn || stop.stopId)}</option>`)
    .join("");
}

async function searchMinibusRoutes() {
  const query = (els.minibusRouteSearch?.value || "").trim();
  if (!query) {
    renderMinibusRouteOptions([]);
    return;
  }
  if (els.minibusRouteSelect) els.minibusRouteSelect.innerHTML = `<option value="">搜尋中...</option>`;
  try {
    let data;
    if (isLocalStatic()) {
      const regions = ["HKI", "KLN", "NT"];
      const results = await Promise.all(
        regions.map(async (region) => {
          const response = await fetch(`https://data.etagmb.gov.hk/route/${region}/${encodeURIComponent(query)}`);
          if (!response.ok) return [];
          const payload = await response.json().catch(() => ({}));
          return Array.isArray(payload.data) ? payload.data : [];
        }),
      );
      data = { data: results.flat() };
    } else {
      const response = await fetch(`/api/minibus?route=${encodeURIComponent(query)}`, { credentials: "include" });
      data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Minibus route search failed");
    }
    renderMinibusRouteOptions(Array.isArray(data.data) ? data.data : []);
    await loadSelectedMinibusStops();
  } catch {
    renderMinibusRouteOptions([]);
  }
}

function prepareMinibusRoutePicker() {
  if (!els.minibusRouteSearch) return;
  if (!els.minibusRouteSearch.value.trim()) {
    const firstStop = getSavedMinibusStops()[0] || MINIBUS_DEFAULT_STOPS[0];
    els.minibusRouteSearch.value = firstStop?.routeCode || "811";
  }
  if (!minibusRouteMatches.length) {
    searchMinibusRoutes();
  }
}

async function loadSelectedMinibusStops() {
  const route = getSelectedMinibusRoute();
  const routeSeq = els.minibusRouteDirection?.value || route?.directions?.[0]?.routeSeq || "";
  if (!route || !routeSeq) {
    renderMinibusStopOptions([]);
    return;
  }
  if (els.minibusRouteStopSelect) els.minibusRouteStopSelect.innerHTML = `<option value="">載入中...</option>`;
  try {
    let data;
    if (isLocalStatic()) {
      const response = await fetch(`https://data.etagmb.gov.hk/route-stop/${encodeURIComponent(route.routeId)}/${encodeURIComponent(routeSeq)}`);
      data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Minibus stops failed");
    } else {
      const response = await fetch(`/api/minibus?routeId=${encodeURIComponent(route.routeId)}&routeSeq=${encodeURIComponent(routeSeq)}`, { credentials: "include" });
      data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Minibus stops failed");
    }
    renderMinibusStopOptions(Array.isArray(data.data?.route_stops) ? data.data.route_stops : []);
  } catch {
    renderMinibusStopOptions([]);
  }
}

function addSelectedMinibusStop() {
  const route = getSelectedMinibusRoute();
  const direction = route?.directions?.find((item) => item.routeSeq === els.minibusRouteDirection?.value);
  const stop = minibusRouteStops.find((item) => item.stopId === els.minibusRouteStopSelect?.value);
  if (!route || !direction || !stop) return;
  const items = readMinibusEditorStops();
  if (items.length >= MINIBUS_MAX_STOPS) return;
  const key = [route.routeId, direction.routeSeq, stop.stopId].join("|");
  if (items.some((item) => [item.routeId, item.routeSeq, item.stopId].join("|") === key)) return;
  items.push(
    normalizeMinibusStop({
      name: stop.nameTc || stop.nameEn || stop.stopId,
      stopId: stop.stopId,
      routeCode: route.routeCode,
      routeId: route.routeId,
      routeSeq: direction.routeSeq,
      stopSeq: stop.stopSeq,
      destTc: direction.destTc,
      destEn: direction.destEn,
    }),
  );
  renderMinibusSettings(items);
}

function readBusEditorStops() {
  return [...document.querySelectorAll("[data-bus-stop-row]")]
    .map((row) =>
      normalizeBusStop({
        name: row.querySelector("[data-bus-stop-name]")?.value,
        stopId: row.querySelector("[data-bus-stop-id]")?.value,
      }),
    )
    .filter((stop) => stop.stopId || stop.name)
    .slice(0, BUS_MAX_STOPS);
}

function readMinibusEditorStops() {
  return [...document.querySelectorAll("[data-minibus-stop-row]")]
    .map((row) =>
      normalizeMinibusStop({
        name: row.querySelector("[data-minibus-stop-name]")?.value,
        stopId: row.querySelector("[data-minibus-stop-id]")?.value,
        routeCode: row.querySelector("[data-minibus-route-code]")?.value,
        routeId: row.querySelector("[data-minibus-route-id]")?.value,
        routeSeq: row.querySelector("[data-minibus-route-seq]")?.value,
        stopSeq: row.querySelector("[data-minibus-stop-seq]")?.value,
        destTc: row.querySelector("[data-minibus-dest-tc]")?.value,
        destEn: row.querySelector("[data-minibus-dest-en]")?.value,
      }),
    )
    .filter((stop) => stop.stopId || stop.name)
    .slice(0, MINIBUS_MAX_STOPS);
}

function setBusStatus(text) {
  if (els.busUpdated) els.busUpdated.textContent = text;
}

function setMinibusStatus(text) {
  if (els.minibusUpdated) els.minibusUpdated.textContent = text;
}

function updateBusWeatherPanel() {
  if (els.busWeatherTemp) els.busWeatherTemp.textContent = els.weatherTemp?.textContent || "--°C";
  if (els.minibusWeatherTemp) els.minibusWeatherTemp.textContent = els.weatherTemp?.textContent || "--°C";
  if (els.busWeatherText) {
    const desc = els.weatherDesc?.textContent || "香港天氣";
    const humidity = els.weatherHumidity?.textContent || "--%";
    els.busWeatherText.textContent = `${desc} · 濕度 ${humidity}`;
    if (els.minibusWeatherText) els.minibusWeatherText.textContent = `${desc} · ${humidity}`;
  }
}

function formatBusEtaTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatBusEtaMins(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  const mins = Math.round((date.getTime() - Date.now()) / 60000);
  if (mins <= 0) return "Arriving";
  return String(mins);
}

function groupEtaRows(rows = []) {
  const groups = new Map();
  rows.forEach((eta) => {
    const key = [eta.route, eta.dest_tc || eta.dest_en].join("|");
    if (!groups.has(key)) {
      groups.set(key, { ...eta, stopNames: new Set(), etas: [] });
    }
    if (eta.stopName) groups.get(key).stopNames.add(eta.stopName);
    groups.get(key).etas.push(eta);
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      etas: group.etas
        .sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime())
        .filter((eta, index, list) => index === 0 || eta.eta !== list[index - 1].eta),
    }))
    .sort((a, b) => new Date(a.etas[0]?.eta || 0).getTime() - new Date(b.etas[0]?.eta || 0).getTime());
}

function renderTransitRows(container, rows = [], emptyText = "請在設定加入站點，或稍後再試。") {
  if (!container) return;
  if (!rows.length) {
    container.innerHTML = `
      <div class="bus-empty-state">
        <strong>未有班次</strong>
        <span>${escapeHtml(emptyText)}</span>
      </div>
    `;
    return;
  }

  container.innerHTML = groupEtaRows(rows)
    .slice(0, 4)
    .map((group) => {
      const first = group.etas[0] || group;
      const second = group.etas[1];
      const mins = formatBusEtaMins(first.eta);
      const nextMins = second ? formatBusEtaMins(second.eta) : "";
      const time = formatBusEtaTime(first.eta);
      const stopNames = [...(group.stopNames || [])].slice(0, 2);
      const stopText = stopNames.length ? ` · ${stopNames.join("/")}` : "";
      return `
        <article class="bus-eta-row">
          <div class="bus-route-block">
            <strong>${escapeHtml(group.route || "--")}</strong>
            <span>往 ${escapeHtml(group.dest_tc || group.dest_en || "--")}${escapeHtml(stopText)}</span>
          </div>
          <div class="bus-minutes">
            <time datetime="${escapeHtml(first.eta || "")}" title="${escapeHtml(time)}">${escapeHtml(mins)}</time>
            ${nextMins ? `<span title="${escapeHtml(formatBusEtaTime(second.eta))}">${escapeHtml(nextMins)}</span>` : ""}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderBusRows(rows = []) {
  renderTransitRows(els.busEtaRows, rows, "請在設定加入 KMB stop ID，或稍後再試。");
}

function renderMinibusRows(rows = []) {
  renderTransitRows(els.minibusEtaRows, rows, "請在設定加入專線小巴站點，或稍後再試。");
}

function normalizeBusEtaPayload(payload = {}, stops = getSavedBusStops()) {
  const stopNameById = new Map(stops.map((stop) => [stop.stopId, stop.name]));
  const mode = getSavedBusMode();
  const direction = getSavedBusDirection();
  const resultSets = Array.isArray(payload.results) ? payload.results : [];
  const directData = Array.isArray(payload.data) ? [{ stopId: stops[0]?.stopId || "", data: payload.data }] : [];
  const seen = new Set();

  return [...resultSets, ...directData]
    .flatMap((result) => {
      const stopId = result.stopId || result.stop || "";
      const data = Array.isArray(result.data) ? result.data : [];
      return data.map((item) => ({ ...item, stopId, stopName: stopNameById.get(stopId) || "" }));
    })
    .filter((item) => item.eta)
    .filter((item) => mode !== "single" || item.dir === direction)
    .filter((item) => {
      const key = [item.route, item.dir, item.service_type, item.dest_tc, item.eta, item.stopId].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime());
}

function normalizeMinibusEtaPayload(payload = {}, stops = getSavedMinibusStops()) {
  const stopConfigById = new Map(stops.map((stop) => [stop.stopId, stop]));
  const resultSets = Array.isArray(payload.results) ? payload.results : [];
  const directData = Array.isArray(payload.data) ? [{ stopId: stops[0]?.stopId || "", data: payload.data }] : [];
  const seen = new Set();

  return [...resultSets, ...directData]
    .flatMap((result) => {
      const stopId = String(result.stopId || result.stop_id || "");
      const config = stopConfigById.get(stopId) || {};
      const data = Array.isArray(result.data) ? result.data : [];
      return data
        .filter((item) => !config.routeId || String(item.route_id || "") === config.routeId)
        .filter((item) => !config.routeSeq || String(item.route_seq || item.routeSeq || "") === config.routeSeq)
        .flatMap((item) => {
        const etaList = Array.isArray(item.eta) ? item.eta : Array.isArray(item.ETA) ? item.ETA : [];
        const routeSeq = String(item.route_seq || item.routeSeq || item.dir || "");
        const normalizedDir = routeSeq === "2" || routeSeq.toUpperCase() === "I" ? "I" : "O";
        return etaList.map((etaItem) => ({
          route: config.routeCode || item.route_code || item.route || item.route_id || "--",
          dest_tc: config.destTc || item.dest_tc || item.destination_tc || item.dest || item.remarks_tc || "--",
          dest_en: config.destEn || item.dest_en || item.destination_en || "",
          dir: normalizedDir,
          eta: etaItem.timestamp || etaItem.eta || etaItem.arrival_time || "",
          stopId,
          stopName: config.name || "",
        }));
      });
    })
    .filter((item) => item.eta)
    .filter((item) => {
      const key = [item.route, item.dir, item.dest_tc, item.eta, item.stopId].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime());
}

async function loadBusTimes() {
  updateBusWeatherPanel();
  const stops = getSavedBusStops();
  if (!stops.length) {
    renderBusRows([]);
    setBusStatus("請先設定巴士站");
    return;
  }

  const stopIds = stops.map((stop) => stop.stopId).join(",");
  const endpoint = isLocalStatic()
    ? null
    : `/api/bus?stops=${encodeURIComponent(stopIds)}`;

  try {
    let data;
    if (isLocalStatic()) {
      const results = await Promise.all(
        stops.map(async (stop) => {
          const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/${encodeURIComponent(stop.stopId)}`);
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(payload.error || "Bus request failed");
          return { stopId: stop.stopId, data: Array.isArray(payload.data) ? payload.data : [] };
        }),
      );
      data = { results };
    } else {
      const response = await fetch(endpoint, { credentials: "include" });
      data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Bus request failed");
    }
    renderBusRows(normalizeBusEtaPayload(data, stops));
    if (els.busModeLabel) {
      const mode = getSavedBusMode();
      els.busModeLabel.textContent = mode === "single" ? `單向 · ${BUS_DIRECTIONS[getSavedBusDirection()]}` : "所有方向";
    }
    setBusStatus(`Updated ${formatMtrTime(new Date().toISOString())}`);
  } catch {
    renderBusRows([]);
    setBusStatus("巴士班次暫時未能更新");
  }
}

async function loadMinibusTimes() {
  updateBusWeatherPanel();
  const stops = getSavedMinibusStops();
  if (!stops.length) {
    renderMinibusRows([]);
    setMinibusStatus("請先設定小巴站");
    return;
  }

  const stopIds = stops.map((stop) => stop.stopId).join(",");
  const endpoint = isLocalStatic() ? null : `/api/minibus?stops=${encodeURIComponent(stopIds)}`;

  try {
    let data;
    if (isLocalStatic()) {
      const results = await Promise.all(
        stops.map(async (stop) => {
          const response = await fetch(`https://data.etagmb.gov.hk/eta/stop/${encodeURIComponent(stop.stopId)}`);
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(payload.error || "Minibus request failed");
          return { stopId: stop.stopId, data: Array.isArray(payload.data) ? payload.data : [] };
        }),
      );
      data = { results };
    } else {
      const response = await fetch(endpoint, { credentials: "include" });
      data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Minibus request failed");
    }
    renderMinibusRows(normalizeMinibusEtaPayload(data, stops));
    if (els.minibusModeLabel) {
      const mode = getSavedMinibusMode();
      els.minibusModeLabel.textContent = mode === "single" ? `單向 · ${BUS_DIRECTIONS[getSavedMinibusDirection()]}` : "所有方向";
    }
    setMinibusStatus(`Updated ${formatMtrTime(new Date().toISOString())}`);
  } catch {
    renderMinibusRows([]);
    setMinibusStatus("小巴班次暫時未能更新");
  }
}

function getSavedTransportSource() {
  const saved = localStorage.getItem("transportSource");
  return TRANSPORT_SOURCES.includes(saved) ? saved : "mtr";
}

function openActiveTransportSettings() {
  const source = getSavedTransportSource();
  if (source === "bus") {
    renderBusSettings();
    setMtrBackMode("bus");
    return;
  }
  if (source === "minibus") {
    renderMinibusSettings();
    prepareMinibusRoutePicker();
    setMtrBackMode("minibus");
    return;
  }
  renderMtrSettings();
  setMtrBackMode("settings");
}

function setMtrBackMode(mode = "settings") {
  const isTransport = mode === "transport";
  const isBus = mode === "bus";
  const isMinibus = mode === "minibus";
  if (els.mtrBackTitle) {
    els.mtrBackTitle.textContent = isTransport
      ? "交通選擇"
      : isBus
        ? "Bus 設定"
        : isMinibus
          ? "Minibus 設定"
          : "Transport 設定";
  }
  els.mtrSettingsPanel?.classList.toggle("is-active", !isTransport && !isBus && !isMinibus);
  els.mtrTransportPanel?.classList.toggle("is-active", isTransport);
  els.busSettingsPanel?.classList.toggle("is-active", isBus);
  els.minibusSettingsPanel?.classList.toggle("is-active", isMinibus);
}

function getPanelIndexById(id) {
  return panels.findIndex((panel) => panel.id === id);
}

function setTransportSource(source, options = {}) {
  const { scroll = true } = options;
  const normalized = TRANSPORT_SOURCES.includes(source) ? source : "mtr";
  localStorage.setItem("transportSource", normalized);
  els.mtrTransportOptions.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.transportOption === normalized);
  });
  els.mtrCard?.setAttribute("data-transport-source", normalized);
  els.mtrCard?.classList.toggle("is-bus", normalized === "bus");
  els.mtrCard?.classList.toggle("is-minibus", normalized === "minibus");
  els.mtrDisplay?.classList.toggle("is-active", normalized === "mtr");
  els.busDisplay?.classList.toggle("is-active", normalized === "bus");
  els.minibusDisplay?.classList.toggle("is-active", normalized === "minibus");
  if (els.mtrFlipButton) {
    const labels = { mtr: "MTR", bus: "Bus", minibus: "Minibus" };
    els.mtrFlipButton.setAttribute("aria-label", `${labels[normalized]} 交通選擇`);
  }

  if (normalized === "mtr") {
    setMtrBackMode("transport");
    updateMtrHeader();
    loadMtrTimes();
    if (scroll) {
      const mtrIndex = getPanelIndexById("mtr");
      if (mtrIndex >= 0) scrollToPanel(mtrIndex);
    }
    return;
  }

  if (normalized === "bus") {
    renderBusSettings();
    loadBusTimes();
  } else {
    renderMinibusSettings();
    prepareMinibusRoutePicker();
    loadMinibusTimes();
  }
  els.mtrCard?.classList.remove("is-flipped");
  if (scroll) {
    const transportIndex = getPanelIndexById("mtr");
    if (transportIndex >= 0) scrollToPanel(transportIndex);
  }
}

function locateNearestMtrStation() {
  if (!navigator.geolocation) {
    setMtrStatus("瀏覽器不支援定位");
    return;
  }

  setMtrStatus("正在尋找最近車站");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const config = saveMtrConfig(getNearestMtrConfig(position.coords.latitude, position.coords.longitude));
      renderMtrSettings(config);
      loadMtrTimes();
    },
    () => {
      setMtrStatus("未能取得定位");
    },
    { enableHighAccuracy: false, maximumAge: 10 * 60 * 1000, timeout: 8000 },
  );
}

function setSpotifyConnectedUi(isConnected) {
  if (!isConnected) {
    els.spotifyLogin.textContent = "連接 Spotify";
  } else if (spotifyDeviceId) {
    els.spotifyLogin.textContent = "網頁播放";
  } else {
    els.spotifyLogin.textContent = "已連接";
  }
  els.spotifyLogin.classList.toggle("is-connected", isConnected);
}

function getSavedMusicSource() {
  const saved = localStorage.getItem("musicSource");
  return ["spotify", "youtube", "radio"].includes(saved) ? saved : DEFAULT_MUSIC_SOURCE;
}

function getSavedYoutubeUrl() {
  return localStorage.getItem("youtubeUrl") || DEFAULT_YOUTUBE_URL;
}

function getSavedMusicVolume() {
  const saved = Number(localStorage.getItem("musicVolume"));
  return Number.isFinite(saved) ? Math.min(Math.max(saved, 0), 1) : DEFAULT_MUSIC_VOLUME;
}

function renderMusicVolume() {
  if (!els.musicVolume) return;
  els.musicVolume.value = String(Math.round(musicVolume * 100));
  els.musicVolume.parentElement?.classList.toggle("is-muted", musicVolume <= 0);
  els.volumeToggle?.setAttribute("aria-label", musicVolume <= 0 ? "取消靜音" : "靜音");
}

async function applyMusicVolume() {
  renderMusicVolume();
  if (radioAudio) radioAudio.volume = musicVolume;
  try {
    if (spotifyPlayer) await spotifyPlayer.setVolume(musicVolume);
  } catch {
    // Spotify can reject volume before the web player is ready.
  }
}

function setMusicVolume(value) {
  const nextVolume = Math.min(Math.max(Number(value), 0), 1);
  if (nextVolume > 0) previousMusicVolume = nextVolume;
  musicVolume = nextVolume;
  localStorage.setItem("musicVolume", String(musicVolume));
  applyMusicVolume();
}

function toggleMusicMute() {
  if (musicVolume > 0) {
    previousMusicVolume = musicVolume;
    setMusicVolume(0);
    return;
  }
  setMusicVolume(previousMusicVolume || DEFAULT_MUSIC_VOLUME);
}

function parseYouTubeVideoId(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
    if (!host.endsWith("youtube.com")) return "";
    if (url.pathname === "/watch") return url.searchParams.get("v") || "";
    const parts = url.pathname.split("/").filter(Boolean);
    if (["embed", "live", "shorts"].includes(parts[0])) return parts[1] || "";
  } catch {
    return "";
  }

  return "";
}

function getYoutubeEmbedUrl(url = getSavedYoutubeUrl()) {
  const videoId = parseYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0` : "";
}

function timeToMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function getRthk2CurrentProgram(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return RTHK2_PROGRAMS.reduce((current, program) => {
    return minutes >= timeToMinutes(program.start) ? program : current;
  }, RTHK2_PROGRAMS[RTHK2_PROGRAMS.length - 1]);
}

function updateRadioProgramText() {
  if (musicSource !== "radio") return;
  const program = getRthk2CurrentProgram();
  els.trackTitle.textContent = program.name;
  els.trackArtist.textContent = "RTHK2 · 香港電台第二台";
}

function destroyRadioHls() {
  if (!radioHls) return;
  radioHls.destroy();
  radioHls = null;
}

function setupRadioStream(url) {
  if (!radioAudio) return;
  destroyRadioHls();
  radioAudio.removeAttribute("src");
  radioAudio.load();

  if (url.endsWith(".m3u8") && window.Hls?.isSupported()) {
    radioHls = new Hls({ lowLatencyMode: true });
    radioHls.on(Hls.Events.ERROR, (_, data) => {
      if (data?.fatal) tryNextRadioStream();
    });
    radioHls.loadSource(url);
    radioHls.attachMedia(radioAudio);
  } else {
    radioAudio.src = url;
  }
}

async function tryNextRadioStream() {
  if (!radioAudio || radioRetrying) return;
  if (radioStreamIndex >= RTHK2_STREAM_URLS.length - 1) {
    isRadioPlaying = false;
    if (musicSource === "radio") {
      els.playPause.classList.add("is-paused");
      els.playState.textContent = "未能播放 RTHK2";
    }
    return;
  }

  radioRetrying = true;
  radioStreamIndex += 1;
  setupRadioStream(RTHK2_STREAM_URLS[radioStreamIndex]);
  try {
    await radioAudio.play();
  } catch {
    radioRetrying = false;
    tryNextRadioStream();
    return;
  }
  radioRetrying = false;
}

function ensureRadioAudio() {
  if (radioAudio) return radioAudio;
  radioAudio = new Audio();
  radioAudio.preload = "none";
  radioAudio.volume = musicVolume;
  setupRadioStream(RTHK2_STREAM_URLS[radioStreamIndex]);
  radioAudio.addEventListener("play", () => {
    isRadioPlaying = true;
    if (musicSource === "radio") {
      updateRadioProgramText();
      els.playPause.classList.remove("is-paused");
      els.playState.textContent = "RTHK2 正在播放";
    }
  });
  radioAudio.addEventListener("pause", () => {
    isRadioPlaying = false;
    if (musicSource === "radio") {
      els.playPause.classList.add("is-paused");
      els.playState.textContent = "RTHK2 已暫停";
    }
  });
  radioAudio.addEventListener("error", () => {
    isRadioPlaying = false;
    tryNextRadioStream();
  });
  return radioAudio;
}

function stopYoutubePlayer() {
  if (els.youtubePlayer) els.youtubePlayer.src = "";
}

async function stopSpotifyPlayback() {
  try {
    if (spotifyPlayer) await spotifyPlayer.pause();
  } catch {
    // Keep source switching responsive even if Spotify refuses a pause call.
  }
}

function stopRadioPlayback() {
  if (!radioAudio) return;
  radioAudio.pause();
}

function stopNonActiveMusic(source) {
  if (source !== "youtube") stopYoutubePlayer();
  if (source !== "radio") stopRadioPlayback();
  if (source !== "spotify") stopSpotifyPlayback();
}

function showMusicBackPanel(panel) {
  els.musicSourcePanel?.classList.toggle("is-active", panel === "source");
  els.youtubeForm?.classList.toggle("is-active", panel === "youtube");
  els.musicCard?.classList.add("is-flipped");
}

function renderYoutubeSource() {
  const embedUrl = getYoutubeEmbedUrl();
  if (els.youtubeUrlInput) els.youtubeUrlInput.value = getSavedYoutubeUrl();
  if (!els.youtubeLayer || !els.youtubePlayer || !els.youtubeEmpty) return;

  els.youtubeLayer.hidden = false;
  els.youtubePlayer.hidden = !embedUrl;
  els.youtubeEmpty.hidden = Boolean(embedUrl);
  els.youtubePlayer.src = embedUrl;
}

function renderRadioSource() {
  els.albumBackdrop.src = "./assets/radio-bg.jpg";
  updateRadioProgramText();
  els.progressBar.style.width = "0%";
  if (els.seekBar) els.seekBar.value = "0";
  els.playPause.classList.toggle("is-paused", !isRadioPlaying);
  els.playPause.setAttribute("aria-label", isRadioPlaying ? "暫停 RTHK2" : "播放 RTHK2");
  els.playState.textContent = isRadioPlaying ? "RTHK2 正在播放" : "目前節目";
}

function renderMusicSource() {
  els.musicCard?.setAttribute("data-music-source", musicSource);
  els.musicSourceOptions.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sourceOption === musicSource);
  });

  if (musicSource !== "youtube" && els.youtubeLayer) {
    els.youtubeLayer.hidden = true;
  }

  if (musicSource === "spotify") {
    els.playPause.setAttribute("aria-label", playing ? "暫停" : "播放");
    refreshSpotifyDisplay();
  } else if (musicSource === "youtube") {
    renderYoutubeSource();
  } else if (musicSource === "radio") {
    renderRadioSource();
  }
}

function setMusicSource(source) {
  if (!["spotify", "youtube", "radio"].includes(source)) return;
  musicSource = source;
  localStorage.setItem("musicSource", source);
  stopNonActiveMusic(source);
  renderMusicSource();
  els.musicCard?.classList.remove("is-flipped");
}

function renderSpotifyTrack(track) {
  if (musicSource !== "spotify") return;
  if (!track?.item) {
    setSpotifyConnectedUi(true);
    renderEmptySpotifyState();
    return;
  }

  const item = track.item;
  const image = item.album?.images?.[0]?.url || nowPlaying.albumImage;
  const duration = item.duration_ms || 1;
  const progressMs = track.progress_ms || 0;

  currentTrackId = item.id || null;
  currentDurationMs = duration;
  currentProgressMs = progressMs;
  currentProgressUpdatedAt = Date.now();
  isSpotifyPlaying = Boolean(track.is_playing);

  els.trackTitle.textContent = item.name || "未知歌曲";
  els.trackArtist.textContent =
    item.artists?.map((artist) => artist.name).join(", ") || "未知藝人";
  els.albumBackdrop.src = image;
  updateProgressBar();
  els.playState.textContent = track.is_playing ? "正在播放" : "已暫停";
  els.playPause.classList.toggle("is-paused", !track.is_playing);
  setSpotifyConnectedUi(true);
}

function getCurrentSpotifyProgressMs() {
  if (!currentDurationMs) return 0;
  const elapsed = isSpotifyPlaying ? Date.now() - currentProgressUpdatedAt : 0;
  return Math.min(currentProgressMs + elapsed, currentDurationMs);
}

function setProgressUi(progressMs) {
  if (!currentDurationMs) {
    els.progressBar.style.width = "0%";
    if (els.seekBar) els.seekBar.value = "0";
    return;
  }

  const percent = Math.min(Math.max(progressMs / currentDurationMs, 0), 1);
  els.progressBar.style.width = `${percent * 100}%`;
  if (els.seekBar && !isSeeking) {
    els.seekBar.value = String(Math.round(percent * Number(els.seekBar.max || 1000)));
  }
}

function updateProgressBar() {
  setProgressUi(getCurrentSpotifyProgressMs());
}

async function seekSpotifyTrack() {
  if (!currentDurationMs || !els.seekBar) return;
  if (!(await ensureSpotifyPlaybackReady())) return;

  const ratio = Number(els.seekBar.value) / Number(els.seekBar.max || 1000);
  const positionMs = Math.round(currentDurationMs * ratio);
  try {
    if (spotifyPlayer?.seek) {
      await spotifyPlayer.seek(positionMs);
    } else {
      await spotifyApi(`/me/player/seek?position_ms=${positionMs}`, { method: "PUT" });
    }
    currentProgressMs = positionMs;
    currentProgressUpdatedAt = Date.now();
    setProgressUi(positionMs);
    els.playState.textContent = "已移動播放位置";
  } catch {
    els.playState.textContent = "未能移動播放位置";
  }
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  return crypto.subtle.digest("SHA-256", data);
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return [...values].map((value) => chars[value % chars.length]).join("");
}

async function loginSpotify() {
  if (SPOTIFY_CLIENT_ID === "PASTE_YOUR_SPOTIFY_CLIENT_ID") {
    els.playState.textContent = "請先填入 Spotify Client ID";
    return;
  }

  if (window.location.origin === "null") {
    els.playState.textContent = "請用 localhost 開啟以登入 Spotify";
    return;
  }

  const verifier = randomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));
  localStorage.setItem("spotify_code_verifier", verifier);

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge,
    redirect_uri: SPOTIFY_REDIRECT_URI,
  }).toString();

  window.location.href = authUrl.toString();
}

async function exchangeSpotifyCode(code) {
  const verifier = localStorage.getItem("spotify_code_verifier");
  if (!verifier) return null;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: verifier,
    }),
  });

  if (!response.ok) throw new Error("Spotify token exchange failed");
  const token = await response.json();
  localStorage.setItem("spotify_access_token", token.access_token);
  localStorage.setItem("spotify_refresh_token", token.refresh_token || "");
  localStorage.setItem(
    "spotify_expires_at",
    String(Date.now() + token.expires_in * 1000 - 60000),
  );
  localStorage.removeItem("spotify_code_verifier");
  return token.access_token;
}

async function refreshSpotifyToken() {
  const refreshToken = localStorage.getItem("spotify_refresh_token");
  if (!refreshToken) return null;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID,
    }),
  });

  if (!response.ok) return null;
  const token = await response.json();
  localStorage.setItem("spotify_access_token", token.access_token);
  localStorage.setItem(
    "spotify_expires_at",
    String(Date.now() + token.expires_in * 1000 - 60000),
  );
  if (token.refresh_token) {
    localStorage.setItem("spotify_refresh_token", token.refresh_token);
  }
  return token.access_token;
}

async function getSpotifyToken() {
  const existing = localStorage.getItem("spotify_access_token");
  const expiresAt = Number(localStorage.getItem("spotify_expires_at") || 0);
  if (existing && Date.now() < expiresAt) return existing;
  return refreshSpotifyToken();
}

async function transferPlaybackToBrowser(shouldPlay = true) {
  const token = await getSpotifyToken();
  if (!token || !spotifyDeviceId) return;

  await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_ids: [spotifyDeviceId],
      play: shouldPlay,
    }),
  });
  setSpotifyConnectedUi(true);
}

function waitForSpotifyDevice(timeoutMs = 3500) {
  if (spotifyDeviceId) return Promise.resolve(true);
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      if (spotifyDeviceId) {
        clearInterval(timer);
        resolve(true);
      } else if (Date.now() - startedAt >= timeoutMs) {
        clearInterval(timer);
        resolve(false);
      }
    }, 100);
  });
}

async function ensureSpotifyPlaybackReady() {
  const token = await getSpotifyToken();
  if (!token) {
    await loginSpotify();
    return false;
  }

  setupSpotifyWebPlayback();
  if (!spotifyPlayer && window.Spotify?.Player && window.onSpotifyWebPlaybackSDKReady) {
    await window.onSpotifyWebPlaybackSDKReady();
  }

  const hasDevice = await waitForSpotifyDevice();
  if (!hasDevice) {
    els.playState.textContent = "Spotify 播放器未準備好";
    return false;
  }

  return true;
}

async function spotifyApi(path, options = {}) {
  const token = await getSpotifyToken();
  if (!token) throw new Error("Missing Spotify token");

  return fetch(`https://api.spotify.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function saveCurrentTrack() {
  if (!currentTrackId) {
    els.playState.textContent = "沒有可加入的歌曲";
    return;
  }

  try {
    const response = await spotifyApi(`/me/tracks?ids=${encodeURIComponent(currentTrackId)}`, {
      method: "PUT",
    });
    els.playState.textContent = response.ok ? "已加入你的音樂庫" : "加入失敗";
  } catch {
    els.playState.textContent = "加入失敗";
  }
}

async function previousSpotifyTrack() {
  try {
    if (spotifyPlayer?.previousTrack) {
      await spotifyPlayer.previousTrack();
    } else {
      await spotifyApi("/me/player/previous", { method: "POST" });
    }
    els.playState.textContent = "上一首";
    setTimeout(refreshSpotifyDisplay, 700);
  } catch {
    els.playState.textContent = "未能切換上一首";
  }
}

async function nextSpotifyTrack() {
  try {
    if (spotifyPlayer?.nextTrack) {
      await spotifyPlayer.nextTrack();
    } else {
      await spotifyApi("/me/player/next", { method: "POST" });
    }
    els.playState.textContent = "下一首";
    setTimeout(refreshSpotifyDisplay, 700);
  } catch {
    els.playState.textContent = "未能切換下一首";
  }
}

async function showSpotifyQueue() {
  try {
    const response = await spotifyApi("/me/player/queue");
    if (!response.ok) throw new Error("Queue failed");
    const data = await response.json();
    const next = data.queue?.[0];
    els.playState.textContent = next ? `下一首：${next.name}` : "播放佇列沒有歌曲";
  } catch {
    els.playState.textContent = "無法讀取播放佇列";
  }
}

function setupSpotifyWebPlayback() {
  window.onSpotifyWebPlaybackSDKReady = async () => {
    const token = await getSpotifyToken();
    if (!token || spotifyPlayer) return;

    spotifyPlayer = new Spotify.Player({
      name: "Office Info Display",
      getOAuthToken: async (callback) => {
        callback(await getSpotifyToken());
      },
      volume: musicVolume,
    });

    spotifyPlayer.addListener("ready", ({ device_id }) => {
      spotifyDeviceId = device_id;
      setSpotifyConnectedUi(true);
      if (musicSource === "spotify") {
        els.playState.textContent = "網頁播放已準備";
      }
    });

    spotifyPlayer.addListener("not_ready", () => {
      spotifyDeviceId = null;
      setSpotifyConnectedUi(true);
      if (musicSource === "spotify") {
        els.playState.textContent = "網頁播放已離線";
      }
    });

    spotifyPlayer.addListener("player_state_changed", (state) => {
      if (!state) return;
      renderSpotifyTrack({
        item: state.track_window.current_track,
        progress_ms: state.position,
        is_playing: !state.paused,
      });
    });

    spotifyPlayer.addListener("initialization_error", ({ message }) => {
      if (musicSource === "spotify") {
        els.playState.textContent = "播放器初始化失敗";
      }
      console.error(message);
    });

    spotifyPlayer.addListener("authentication_error", ({ message }) => {
      if (musicSource === "spotify") {
        els.playState.textContent = "Spotify 認證失敗";
      }
      console.error(message);
    });

    spotifyPlayer.addListener("account_error", ({ message }) => {
      if (musicSource === "spotify") {
        els.playState.textContent = "需要 Spotify Premium";
      }
      console.error(message);
    });

    spotifyPlayer.addListener("playback_error", ({ message }) => {
      if (musicSource === "spotify") {
        els.playState.textContent = "播放失敗";
      }
      console.error(message);
    });

    await spotifyPlayer.connect();
    applyMusicVolume();
  };
}

async function loadSpotifyNowPlaying() {
  try {
    const token = await getSpotifyToken();
    if (!token) return;
    setSpotifyConnectedUi(true);

    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      await loadSpotifyPlaybackState(token);
      return;
    }

    if (response.status === 401) {
      localStorage.removeItem("spotify_access_token");
      setSpotifyConnectedUi(false);
      els.playState.textContent = "請重新連接";
      return;
    }

    if (!response.ok) throw new Error("Spotify currently playing failed");
    renderSpotifyTrack(await response.json());
  } catch {
    els.playState.textContent = "Spotify 讀取失敗";
  }
}

async function loadSpotifyPlaybackState(token) {
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 204) {
    setSpotifyConnectedUi(true);
    renderEmptySpotifyState();
    return;
  }

  if (response.status === 401) {
    localStorage.removeItem("spotify_access_token");
    setSpotifyConnectedUi(false);
    els.playState.textContent = "請重新連接";
    return;
  }

  if (!response.ok) throw new Error("Spotify playback state failed");
  renderSpotifyTrack(await response.json());
}

async function refreshSpotifyDisplay() {
  if (musicSource !== "spotify") return;
  try {
    const token = await getSpotifyToken();
    if (!token) {
      setSpotifyConnectedUi(false);
      return;
    }
    setSpotifyConnectedUi(true);
    await loadSpotifyNowPlaying();
  } catch {
    els.playState.textContent = "Spotify 讀取失敗";
  }
}

async function handleSpotifyCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return;

  try {
    const token = await exchangeSpotifyCode(code);
    window.history.replaceState({}, document.title, `${location.pathname}#spotify`);
    scrollToHash();
    requestAnimationFrame(scrollToHash);
    setTimeout(scrollToHash, 150);
    if (token) await loadSpotifyNowPlaying();
  } catch {
    els.playState.textContent = "Spotify 登入失敗";
  }
}

function getSavedWeatherPlace() {
  return (localStorage.getItem("weatherPlace") || DEFAULT_WEATHER_PLACE).trim();
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 10 * 60 * 1000,
      timeout: 5000,
    });
  });
}

function getDistanceKm(latA, lonA, latB, lonB) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(latB - latA);
  const dLon = toRadians(lonB - lonA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getPreferredWeatherPlaces() {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    return HKO_WEATHER_LOCATIONS
      .map((location) => ({
        ...location,
        distance: getDistanceKm(latitude, longitude, location.lat, location.lon),
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((location) => location.place);
  } catch {
    return [getSavedWeatherPlace()];
  }
}

function pickHkoReading(readings, preferredPlaces = [getSavedWeatherPlace()]) {
  const data = readings || [];
  const places = Array.isArray(preferredPlaces) ? preferredPlaces : [preferredPlaces];
  const matched = places.map((place) => data.find((item) => item.place === place)).find(Boolean);
  return (
    matched ||
    data.find((item) => item.place === "\u9999\u6e2f\u5929\u6587\u53f0") ||
    data.find((item) => item.place === "\u9999\u6e2f\u516c\u5712") ||
    data[0]
  );
}

function pickHkoTemperature(report, preferredPlaces = [getSavedWeatherPlace()]) {
  return pickHkoReading(report.temperature?.data, preferredPlaces);
}

function describeHkoWeather(forecastText, iconList, report) {
  const text = forecastText || "";
  const icons = Array.isArray(iconList) ? iconList : [];
  const rainfall = report?.rainfall?.data || [];
  const hasRainNow = rainfall.some((item) => Number(item.max || 0) > 0);
  const hasIcon = (codes) => icons.some((icon) => codes.includes(icon));

  if (icons.length > 0) {
    if (icons.includes(65)) return "STORM";
    if (hasIcon([53, 54, 62, 63, 64]) || hasRainNow) return "RAINING";
    if (hasIcon([83, 84, 85])) return "FOG";
    if (hasIcon([52, 60, 61, 76, 80, 82, 92, 93])) return "CLOUDY";
    if (hasIcon([50, 51, 70, 71, 72, 73, 74, 75, 77, 81, 90, 91])) return "SUNNY";
  }

  if (hasRainNow) return text.includes("\u96f7") ? "STORM" : "RAINING";
  if (text.includes("\u9727") || text.includes("\u973e")) return "FOG";
  if (text.includes("\u6674")) return "SUNNY";
  if (text.includes("\u96f2") || text.includes("\u9670")) return "CLOUDY";

  return "CLOUDY";
}

function setWeatherVisual(condition) {
  const normalized = WEATHER_BACKGROUNDS[condition] ? condition : "CLOUDY";
  const period = getWeatherTimePeriod();
  const background =
    WEATHER_BACKGROUND_BY_TIME[normalized]?.[period] ||
    WEATHER_BACKGROUNDS[normalized] ||
    WEATHER_TIME_BACKGROUNDS[period];
  currentWeatherCondition = normalized;
  els.weatherCard?.classList.remove(
    "is-sunny",
    "is-cloudy",
    "is-raining",
    "is-storm",
    "is-fog",
    ...WEATHER_TIME_CLASSES,
  );
  Object.keys(WEATHER_BACKGROUNDS).forEach((key) => {
    els.weatherCard?.classList.toggle(`is-${key.toLowerCase()}`, key === normalized);
  });
  els.weatherCard?.classList.add(`time-${period}`);

  if (els.weatherPhoto && els.weatherPhoto.src !== background) {
    els.weatherPhoto.src = background;
  }
  if (els.weatherIconImage) {
    els.weatherIconImage.src = WEATHER_ICONS[normalized] || WEATHER_ICONS.CLOUDY;
  }
}

function getWeatherTimePeriod(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

async function fetchHkoWeather() {
  if (!isLocalStatic()) {
    const response = await fetch("/api/weather", { credentials: "include" });
    if (!response.ok) throw new Error("Weather API failed");
    return response.json();
  }

  const [reportResponse, forecastResponse] = await Promise.all([
    fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc"),
    fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc"),
  ]);

  if (!reportResponse.ok || !forecastResponse.ok) {
    throw new Error("HKO request failed");
  }

  return {
    report: await reportResponse.json(),
    forecast: await forecastResponse.json(),
  };
}

async function loadHkoWeather() {
  try {
    const { report, forecast } = await fetchHkoWeather();
    const preferredPlaces = await getPreferredWeatherPlaces();
    const temp = pickHkoTemperature(report, preferredPlaces);
    const humidity = report.humidity?.data?.[0];
    const rainfall = pickHkoReading(report.rainfall?.data, preferredPlaces);
    const updateTime = new Date(report.updateTime || forecast.updateTime || Date.now());

    const condition = describeHkoWeather(forecast.forecastDesc, report.icon, report);
    const value = temp ? Math.round(temp.value) : null;
    setWeatherVisual(condition);
    els.weatherLocation.textContent = temp?.place || "香港";
    els.weatherTemp.textContent = value !== null ? `${value}°` : "--°";
    els.weatherHumidity.textContent = humidity ? `濕度 ${humidity.value}%` : "濕度 --%";
    els.weatherRain.textContent =
      rainfall?.max !== undefined ? `雨量 ${rainfall.max} ${rainfall.unit}` : "雨量 -- mm";
    els.weatherLow.textContent = value !== null ? `最低 ${Math.max(value - 3, 0)}°` : "最低 --°";
    els.weatherHigh.textContent = value !== null ? `最高 ${value + 4}°` : "最高 --°";
    els.weatherDesc.textContent = WEATHER_LABELS[condition] || "CLOUDY";
  } catch {
    setWeatherVisual("CLOUDY");
    els.weatherDesc.textContent = "CLOUDY";
  }
}

function formatMarketNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "--";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

function formatMarketPercent(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "--%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function normalizeMarketSymbol(value) {
  const symbol = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9.^=-]/g, "")
    .slice(0, 24);
  if (/^\d{1,4}$/.test(symbol)) return `${symbol.padStart(4, "0")}.HK`;
  if (/^\d{5}$/.test(symbol)) return `${symbol}.HK`;
  return symbol || "0700.HK";
}

function normalizePortfolioSymbol(value, market = "HK") {
  const symbol = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9.^=-]/g, "")
    .slice(0, 24);
  if (market === "HK") {
    if (/^\d{1,4}$/.test(symbol)) return `${symbol.padStart(4, "0")}.HK`;
    if (/^\d{5}$/.test(symbol)) return `${symbol}.HK`;
  }
  if (market === "US") return symbol.replace(/\.US$/i, "") || "AAPL";
  return symbol || (market === "US" ? "AAPL" : "0700.HK");
}

function getPortfolioSymbolInput(symbol, market) {
  if (market !== "HK") return symbol || "";
  return String(symbol || "").replace(/\.HK$/i, "");
}

function normalizePortfolioItem(item = {}) {
  const market = item.market === "US" ? "US" : "HK";
  const lots = Number(item.lots);
  return {
    market,
    symbol: normalizePortfolioSymbol(item.symbol, market),
    lots: Number.isFinite(lots) && lots > 0 ? lots : 0,
  };
}

function getSavedPortfolioItems() {
  try {
    const stored = JSON.parse(localStorage.getItem("marketPortfolioItems") || "[]");
    if (Array.isArray(stored) && stored.length) {
      return stored.map(normalizePortfolioItem).filter((item) => item.symbol);
    }
  } catch {
    // Ignore invalid local settings.
  }
  return DEFAULT_PORTFOLIO_ITEMS.map(normalizePortfolioItem);
}

function savePortfolioItems(items) {
  localStorage.setItem("marketPortfolioItems", JSON.stringify(items.map(normalizePortfolioItem)));
}

function getPortfolioSymbols(items = getSavedPortfolioItems()) {
  return [...new Set(items.map((item) => normalizePortfolioItem(item).symbol).filter(Boolean))];
}

function getSavedMarketSymbols() {
  try {
    const stored = JSON.parse(localStorage.getItem("marketSymbols") || "[]");
    if (Array.isArray(stored) && stored.length) {
      return stored.slice(0, 3).map(normalizeMarketSymbol);
    }
  } catch {
    // Ignore invalid local settings.
  }

  const legacy = localStorage.getItem("marketSymbol");
  if (legacy) return [normalizeMarketSymbol(legacy), ...DEFAULT_MARKET_SYMBOLS].slice(0, 3);
  return [...DEFAULT_MARKET_SYMBOLS];
}

function getSavedMarketHidden() {
  try {
    const stored = JSON.parse(localStorage.getItem("marketHidden") || "[]");
    if (Array.isArray(stored)) return stored.slice(0, 3).map(Boolean);
  } catch {
    // Ignore invalid local settings.
  }
  return [false, false, false];
}

function getMarketDisplayName(quote) {
  const symbol = quote?.symbol || "";
  return STOCK_CHINESE_NAMES[symbol] || quote?.name || symbol || "--";
}

function formatMarketCurrency(value, currency = "HKD") {
  const number = Number(value);
  if (!Number.isFinite(number)) return `${currency} --`;
  return new Intl.NumberFormat("zh-HK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(number);
}

function getMarketRelativeValues(quote) {
  const rawValues = quote?.series?.map((point) => point.value).filter((value) => typeof value === "number") || [];
  const base = Number(quote?.previousClose || rawValues[0] || 1);
  if (!rawValues.length) return [];
  return [0, ...rawValues.map((value) => ((value - base) / base) * 100)];
}

function buildMarketPath(quote, allValues) {
  const values = getMarketRelativeValues(quote);
  if (values.length < 2 || allValues.length < 2) return "";

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;
  const width = 512;
  const height = 94;
  const xStart = 24;
  const yStart = 24;

  return values
    .map((value, index) => {
      const x = xStart + (index / Math.max(values.length - 1, 1)) * width;
      const y = yStart + height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function renderMarketMetric(quote, metricElement) {
  const nameEl = metricElement?.querySelector("[data-market-name]");
  const changeEl = metricElement?.querySelector("[data-market-change]");
  const valueEl = metricElement?.querySelector("[data-market-value]");
  if (nameEl) nameEl.textContent = getMarketDisplayName(quote);
  if (changeEl) changeEl.textContent = formatMarketPercent(quote?.changePercent);
  if (valueEl) valueEl.textContent = formatMarketNumber(quote?.price);
  metricElement?.classList.toggle("is-down", Number(quote?.changePercent || 0) < 0);
}

function buildMarketQuoteMap(quotes = []) {
  const map = new Map();
  quotes.forEach((quote) => {
    [quote?.symbol, quote?.requestedSymbol].filter(Boolean).forEach((rawKey) => {
      [
        rawKey,
        normalizeMarketSymbol(rawKey),
        normalizePortfolioSymbol(rawKey, "HK"),
        normalizePortfolioSymbol(rawKey, "US"),
      ].forEach((key) => map.set(key, quote));
    });
  });
  return map;
}

function mergeQuoteMaps(...maps) {
  const merged = new Map();
  maps.forEach((map) => {
    if (!(map instanceof Map)) return;
    map.forEach((quote, key) => merged.set(key, quote));
  });
  return merged;
}

function calculatePortfolioTotals(items = getSavedPortfolioItems(), quoteMap = marketQuoteMap) {
  return items.reduce(
    (totals, item) => {
      const normalized = normalizePortfolioItem(item);
      const quote = quoteMap.get(normalized.symbol);
      const price = Number(quote?.price || 0);
      const quantity = normalized.lots * (MARKET_LOT_SIZE[normalized.market] || 1);
      if (Number.isFinite(price) && Number.isFinite(quantity)) {
        totals[normalized.market] += price * quantity;
      }
      return totals;
    },
    { HK: 0, US: 0 },
  );
}

function getPortfolioSeries(items = getSavedPortfolioItems(), quoteMap = marketQuoteMap) {
  const grouped = { HK: new Map(), US: new Map() };

  items.map(normalizePortfolioItem).forEach((item) => {
    const quote = quoteMap.get(item.symbol);
    const quantity = item.lots * (MARKET_LOT_SIZE[item.market] || 1);
    if (!quote?.series?.length || !quantity) return;

    quote.series.forEach((point) => {
      const value = Number(point.value);
      if (!Number.isFinite(value)) return;
      const time = Number(point.time || 0);
      const key = String(time);
      grouped[item.market].set(key, (grouped[item.market].get(key) || 0) + value * quantity);
    });
  });

  return {
    HK: [...grouped.HK.entries()]
      .map(([time, value]) => ({ time: Number(time), value }))
      .sort((a, b) => a.time - b.time)
      .slice(-30),
    US: [...grouped.US.entries()]
      .map(([time, value]) => ({ time: Number(time), value }))
      .sort((a, b) => a.time - b.time)
      .slice(-30),
  };
}

function getRelativePortfolioSeries(values = []) {
  const base = Number(values.find((point) => Number.isFinite(point.value))?.value || 0);
  if (!base) return [];
  return values.map((point) => ({
    time: point.time,
    value: ((point.value - base) / base) * 100,
  }));
}

function buildValuePath(values, allValues) {
  if (values.length < 2 || allValues.length < 2) return "";
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;
  const width = 512;
  const height = 94;
  const xStart = 24;
  const yStart = 24;

  return values
    .map((point, index) => {
      const x = xStart + (index / Math.max(values.length - 1, 1)) * width;
      const y = yStart + height - ((point.value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function renderMarketPortfolio(seriesQuoteMap = marketQuoteMap) {
  const quoteMap = seriesQuoteMap === marketQuoteMap ? marketQuoteMap : mergeQuoteMaps(marketQuoteMap, seriesQuoteMap);
  const totals = calculatePortfolioTotals(getSavedPortfolioItems(), quoteMap);
  if (els.marketHkTotal) els.marketHkTotal.textContent = formatMarketCurrency(totals.HK, "HKD");
  if (els.marketUsTotal) els.marketUsTotal.textContent = formatMarketCurrency(totals.US, "USD");
  const series = getPortfolioSeries(getSavedPortfolioItems(), quoteMap);
  const relativeSeries = {
    HK: getRelativePortfolioSeries(series.HK),
    US: getRelativePortfolioSeries(series.US),
  };
  const allValues = [...relativeSeries.HK, ...relativeSeries.US].map((point) => point.value);
  els.portfolioLines.forEach((line) => {
    const market = line.dataset.portfolioLine;
    line.setAttribute("d", buildValuePath(relativeSeries[market] || [], allValues));
  });
}

async function loadPortfolioTrendData(portfolioSymbols = getPortfolioSymbols()) {
  if (!portfolioSymbols.length) {
    renderMarketPortfolio();
    return;
  }

  try {
    const response = await fetch(
      `/api/market?symbols=${encodeURIComponent(portfolioSymbols.join(","))}&range=1mo`,
      { credentials: "include" },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Portfolio trend request failed");
    const quoteMap = buildMarketQuoteMap(data.quotes || []);
    quoteMap.forEach((quote, key) => marketQuoteMap.set(key, quote));
    renderMarketPortfolio(marketQuoteMap);
  } catch {
    renderMarketPortfolio();
  }
}

function getHoldingDisplayName(symbol, market) {
  const normalizedSymbol = normalizePortfolioSymbol(symbol, market);
  const quote = marketQuoteMap.get(normalizedSymbol);
  return STOCK_CHINESE_NAMES[normalizedSymbol] || quote?.name || normalizedSymbol || "--";
}

function updateHoldingRowName(row) {
  const market = row.querySelector("[data-holding-market]")?.value === "US" ? "US" : "HK";
  const symbol = row.querySelector("[data-holding-symbol]")?.value;
  const nameElement = row.querySelector("[data-holding-name]");
  if (nameElement) nameElement.value = getHoldingDisplayName(symbol, market);
}

function renderPortfolioEditor(items = getSavedPortfolioItems()) {
  if (!els.marketHoldingRows) return;
  els.marketHoldingRows.innerHTML = "";

  items.map(normalizePortfolioItem).forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "market-holding-row";
    row.innerHTML = `
      <select data-holding-market aria-label="market">
        <option value="HK">港股</option>
        <option value="US">美股</option>
      </select>
      <input data-holding-symbol type="text" aria-label="stock code" spellcheck="false" />
      <input class="holding-stock-name" data-holding-name type="text" aria-label="stock name" readonly value="--" />
      <input data-holding-lots type="number" min="0" step="1" inputmode="numeric" aria-label="shares" />
      <button class="market-delete-holding" type="button" data-delete-holding aria-label="delete">×</button>
    `;
    const marketSelect = row.querySelector("[data-holding-market]");
    const symbolInput = row.querySelector("[data-holding-symbol]");
    marketSelect.value = item.market;
    symbolInput.value = getPortfolioSymbolInput(item.symbol, item.market);
    row.querySelector("[data-holding-lots]").value = String(item.lots || 0);
    marketSelect.addEventListener("change", () => updateHoldingRowName(row));
    symbolInput.addEventListener("input", () => updateHoldingRowName(row));
    row.querySelector("[data-delete-holding]").addEventListener("click", () => {
      const nextItems = readPortfolioEditorItems();
      nextItems.splice(index, 1);
      renderPortfolioEditor(nextItems.length ? nextItems : [normalizePortfolioItem({ market: "HK", symbol: "0700.HK", lots: 0 })]);
    });
    updateHoldingRowName(row);
    els.marketHoldingRows.append(row);
  });
}

function readPortfolioEditorItems() {
  if (!els.marketHoldingRows) return [];
  return [...els.marketHoldingRows.querySelectorAll(".market-holding-row")]
    .map((row) => {
      const market = row.querySelector("[data-holding-market]")?.value === "US" ? "US" : "HK";
      const symbol = row.querySelector("[data-holding-symbol]")?.value;
      const lots = Number(row.querySelector("[data-holding-lots]")?.value || 0);
      return normalizePortfolioItem({ market, symbol, lots });
    })
    .filter((item) => item.symbol);
}

function setMarketBackMode(mode) {
  const isMarketSettings = mode === "market";
  const isHoldings = mode === "holdings";
  const isPortfolio = mode === "portfolio";
  els.marketBackTitle.textContent = isMarketSettings ? "市場設定" : isHoldings ? "持倉設定" : "持倉總值";
  if (els.marketManageButton) els.marketManageButton.hidden = !isPortfolio;
  els.marketDisplayPanel?.classList.toggle("is-active", isMarketSettings);
  els.marketSettingsPanel?.classList.toggle("is-active", isHoldings);
  els.marketPortfolioPanel?.classList.toggle("is-active", isPortfolio);
  if (isHoldings) renderPortfolioEditor();
  if (isPortfolio) renderMarketPortfolio();
  els.marketCard?.classList.add("is-flipped");
}

function getMarketUpdateTimeLabel(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Hong_Kong",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
  const marketOpen = 9 * 60;
  const marketClose = 16 * 60 + 15;
  const clampedMinutes = Math.min(Math.max(hour * 60 + minute, marketOpen), marketClose);
  const displayHour = Math.floor(clampedMinutes / 60);
  const displayMinute = clampedMinutes % 60;
  return `${String(displayHour).padStart(2, "0")}:${String(displayMinute).padStart(2, "0")}`;
}

async function loadMarketData(symbols = getSavedMarketSymbols(), hidden = getSavedMarketHidden()) {
  if (!els.marketForm) return;
  const cleanSymbols = symbols.slice(0, 3).map(normalizeMarketSymbol);
  const portfolioItems = getSavedPortfolioItems();
  const portfolioSymbols = getPortfolioSymbols(portfolioItems);
  const requestSymbols = [...new Set([...cleanSymbols, ...portfolioSymbols])];
  els.marketSymbolInputs.forEach((input, index) => {
    input.value = cleanSymbols[index] || DEFAULT_MARKET_SYMBOLS[index];
  });
  els.marketHiddenInputs.forEach((input, index) => {
    input.checked = Boolean(hidden[index]);
  });
  els.marketStatus.textContent = "更新市場資料中...";

  try {
    const response = await fetch(`/api/market?symbols=${encodeURIComponent(requestSymbols.join(","))}`, {
      credentials: "include",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Market request failed");

    const customQuotes = data.quotes || [];
    marketQuoteMap = buildMarketQuoteMap(customQuotes);
    const quotes = [data.hsi, ...cleanSymbols.map((symbol) => marketQuoteMap.get(symbol))].filter(Boolean).slice(0, 4);
    marketQuotes = quotes;
    const visibleQuotes = quotes.filter((_, index) => index === 0 || !hidden[index - 1]);
    const allValues = visibleQuotes.flatMap(getMarketRelativeValues).filter((value) => typeof value === "number");
    const hsiChange = Number(data.hsi?.changePercent || 0);

    els.marketMetrics.forEach((metric, index) => {
      const isHidden = index > 0 && Boolean(hidden[index - 1]);
      metric.classList.toggle("is-hidden", isHidden);
      renderMarketMetric(quotes[index], metric);
    });
    els.marketLines.forEach((line, index) => {
      line.classList.toggle("is-hidden", index > 0 && Boolean(hidden[index - 1]));
      line.setAttribute("d", buildMarketPath(quotes[index], allValues));
    });
    els.marketCard?.classList.toggle("is-up", hsiChange >= 0);
    els.marketCard?.classList.toggle("is-down", hsiChange < 0);
    els.marketStatus.textContent = `${data.hsi?.currency || "HKD"} · 今日走勢 · 更新 ${getMarketUpdateTimeLabel()}`;
    renderMarketPortfolio();
    loadPortfolioTrendData(portfolioSymbols);
    localStorage.setItem("marketSymbols", JSON.stringify(cleanSymbols));
    localStorage.setItem("marketHidden", JSON.stringify(hidden.slice(0, 3).map(Boolean)));
  } catch {
    els.marketStatus.textContent = "暫時無法讀取市場資料";
  }
}

function scrollToHash() {
  const panelIndex = panels.findIndex((panel) => `#${panel.id}` === window.location.hash);
  if (panelIndex < 0) return;
  stage.scrollTop = panelIndex * stage.clientHeight;
  updateActivePanel();
}

function initLoginPage() {
  if (!els.loginForm) return;

  function setSignupMode(enabled) {
    isSignupMode = enabled;
    els.loginForm.classList.toggle("is-signup", enabled);
    els.loginKicker.textContent = enabled ? "CREATE YOUR ACCOUNT" : "LOGIN TO YOUR ACCOUNT";
    els.loginSubmit.textContent = enabled ? "CREATE" : "LOGIN";
    els.signupToggle.textContent = enabled ? "BACK TO LOGIN" : "CREATE ACCOUNT";
    els.loginEmail.placeholder = enabled ? "Email" : "User name / Email";
    els.signupUsernameField.hidden = !enabled;
    els.signupCodeField.hidden = !enabled;
    els.signupUsername.required = enabled;
    els.signupCode.required = enabled;
    els.loginPassword.autocomplete = enabled ? "new-password" : "current-password";
    els.loginMessage.textContent = enabled ? "請輸入邀請碼建立帳戶" : "請輸入帳戶資料";
  }

  fetch("/api/me", { credentials: "include" })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (data?.user) {
        els.loginMessage.textContent = `已登入：${data.user.email}`;
      }
    })
    .catch(() => {
      els.loginMessage.textContent =
        "本地或 GitHub Pages 不能連接 D1，請在 Cloudflare 開啟登入。";
    });

  els.signupToggle.addEventListener("click", () => setSignupMode(!isSignupMode));

  els.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    els.loginSubmit.disabled = true;
    els.loginMessage.textContent = isSignupMode ? "建立帳戶中..." : "登入中...";

    try {
      const endpoint = isSignupMode ? "/api/signup" : "/api/login";
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: els.loginEmail.value,
          username: els.signupUsername.value,
          password: els.loginPassword.value,
          code: els.signupCode.value,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "登入失敗");
      }

      if (isSignupMode) {
        els.loginMessage.textContent = data.message || "帳戶已建立，請登入。";
        els.loginPassword.value = "";
        setSignupMode(false);
        return;
      }

      els.loginMessage.textContent = `登入成功：${data.user.email}`;
      setTimeout(() => {
        const next = new URLSearchParams(location.search).get("next");
        window.location.href = next || "/index.html";
      }, 650);
    } catch (error) {
      els.loginMessage.textContent = error.message || "登入失敗";
    } finally {
      els.loginSubmit.disabled = false;
    }
  });
}

async function initDisplayPage() {
  if (!stage || !els.clock) return;
  if (!(await requireAppLogin())) return;

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      markPanelActivity();
      const panelIndex = Number(dot.dataset.panel);
      scrollToPanel(panelIndex);
    });
  });

  els.playPause.addEventListener("click", async () => {
    if (musicSource === "radio") {
      const audio = ensureRadioAudio();
      if (audio.paused) {
        audio.play().catch(() => {
          els.playState.textContent = "未能播放 RTHK2";
          els.playPause.classList.add("is-paused");
        });
      } else {
        audio.pause();
      }
      return;
    }

    if (musicSource !== "spotify") return;

    if (!(await ensureSpotifyPlaybackReady())) return;

    if (isSpotifyPlaying) {
      await spotifyPlayer.pause();
      isSpotifyPlaying = false;
      playing = false;
      els.playPause.classList.add("is-paused");
      els.playPause.setAttribute("aria-label", "播放");
      els.playState.textContent = "已暫停";
    } else {
      await transferPlaybackToBrowser(true);
      await spotifyPlayer.resume();
      isSpotifyPlaying = true;
      playing = true;
      els.playPause.classList.remove("is-paused");
      els.playPause.setAttribute("aria-label", "暫停");
      els.playState.textContent = "正在播放";
      refreshSpotifyDisplay();
    }
  });

  els.previousTrack?.addEventListener("click", previousSpotifyTrack);
  els.nextTrack.addEventListener("click", nextSpotifyTrack);
  els.connectDevice.addEventListener("click", () => transferPlaybackToBrowser(true));
  els.volumeToggle?.addEventListener("click", () => {
    markPanelActivity();
    toggleMusicMute();
  });
  els.musicVolume?.addEventListener("input", () => {
    markPanelActivity();
    setMusicVolume(Number(els.musicVolume.value) / 100);
  });
  els.seekBar?.addEventListener("input", () => {
    markPanelActivity();
    if (!currentDurationMs) return;
    isSeeking = true;
    const ratio = Number(els.seekBar.value) / Number(els.seekBar.max || 1000);
    setProgressUi(currentDurationMs * ratio);
  });
  els.seekBar?.addEventListener("change", async () => {
    markPanelActivity();
    await seekSpotifyTrack();
    isSeeking = false;
  });
  els.musicSourceButton?.addEventListener("click", () => {
    markPanelActivity();
    showMusicBackPanel("source");
  });
  els.youtubeSettingsButton?.addEventListener("click", () => {
    markPanelActivity();
    showMusicBackPanel("youtube");
  });
  els.musicBackButton?.addEventListener("click", () => {
    markPanelActivity();
    els.musicCard?.classList.remove("is-flipped");
  });
  els.musicSourceOptions.forEach((button) => {
    button.addEventListener("click", () => {
      markPanelActivity();
      setMusicSource(button.dataset.sourceOption);
    });
  });
  els.youtubeSourceBackButton?.addEventListener("click", () => {
    markPanelActivity();
    showMusicBackPanel("source");
  });
  els.youtubeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    markPanelActivity();
    const value = els.youtubeUrlInput?.value || "";
    if (!parseYouTubeVideoId(value)) {
      els.playState.textContent = "YouTube link 不正確";
      return;
    }
    localStorage.setItem("youtubeUrl", value.trim());
    setMusicSource("youtube");
  });
  els.marketPortfolioButton?.addEventListener("click", () => {
    markPanelActivity();
    setMarketBackMode("portfolio");
  });
  els.marketFlipButton?.addEventListener("click", () => {
    markPanelActivity();
    setMarketBackMode("market");
  });
  els.marketManageButton?.addEventListener("click", () => {
    markPanelActivity();
    setMarketBackMode("holdings");
  });
  els.marketBackButton?.addEventListener("click", () => {
    markPanelActivity();
    els.marketCard?.classList.remove("is-flipped");
  });
  els.marketDisplayForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    markPanelActivity();
    const symbols = els.marketSymbolInputs.map((input) => normalizeMarketSymbol(input.value));
    const hidden = els.marketHiddenInputs.map((input) => input.checked);
    localStorage.setItem("marketSymbols", JSON.stringify(symbols));
    localStorage.setItem("marketHidden", JSON.stringify(hidden));
    els.marketCard?.classList.remove("is-flipped");
    loadMarketData(symbols, hidden);
  });
  els.marketForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    markPanelActivity();
    const items = readPortfolioEditorItems();
    savePortfolioItems(items.length ? items : DEFAULT_PORTFOLIO_ITEMS);
    setMarketBackMode("portfolio");
    loadMarketData();
  });
  document.querySelector("#marketAddHolding")?.addEventListener("click", () => {
    markPanelActivity();
    const items = readPortfolioEditorItems();
    items.push(normalizePortfolioItem({ market: "HK", symbol: "0700.HK", lots: 0 }));
    renderPortfolioEditor(items);
  });
  els.mtrFlipButton?.addEventListener("click", () => {
    markPanelActivity();
    setMtrBackMode("transport");
    els.mtrCard?.classList.add("is-flipped");
  });
  els.mtrTransportButton?.addEventListener("click", () => {
    markPanelActivity();
    setMtrBackMode("transport");
  });
  els.transportSettingsButton?.addEventListener("click", () => {
    markPanelActivity();
    openActiveTransportSettings();
  });
  els.mtrBackButton?.addEventListener("click", () => {
    markPanelActivity();
    els.mtrCard?.classList.remove("is-flipped");
  });
  els.mtrCard?.addEventListener("click", (event) => {
    if (!event.target.closest(".mtr-time")) return;
    markPanelActivity();
    mtrTimeDisplayMode = mtrTimeDisplayMode === "mins" ? "time" : "mins";
    localStorage.setItem("mtrTimeDisplayMode", mtrTimeDisplayMode);
    updateMtrTimeDisplay();
  });
  els.mtrTransportOptions.forEach((button) => {
    button.addEventListener("click", () => {
      markPanelActivity();
      setTransportSource(button.dataset.transportOption);
      els.mtrCard?.classList.remove("is-flipped");
    });
  });
  els.mtrStationSelect?.addEventListener("change", () => {
    const station = els.mtrStationSelect.value;
    const line = getMtrStationProfile(station).lines[0];
    renderMtrSettings({ station, line });
  });
  els.mtrLocateButton?.addEventListener("click", () => {
    markPanelActivity();
    locateNearestMtrStation();
  });
  els.mtrForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    markPanelActivity();
    const config = saveMtrConfig({
      station: els.mtrStationSelect?.value,
      line: els.mtrLineSelect?.value,
    });
    updateMtrHeader(config);
    els.mtrCard?.classList.remove("is-flipped");
    loadMtrTimes();
  });
  els.busStopRows?.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-bus-stop-remove]");
    if (!removeButton) return;
    markPanelActivity();
    const items = readBusEditorStops();
    const row = removeButton.closest("[data-bus-stop-row]");
    const index = [...document.querySelectorAll("[data-bus-stop-row]")].indexOf(row);
    items.splice(index, 1);
    renderBusSettings(items);
  });
  els.busAddStop?.addEventListener("click", () => {
    markPanelActivity();
    const items = readBusEditorStops();
    if (items.length >= BUS_MAX_STOPS) return;
    items.push({ name: "", stopId: "" });
    renderBusSettings(items);
  });
  els.busForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    markPanelActivity();
    localStorage.setItem("busDisplayMode", els.busDisplayMode?.value === "single" ? "single" : "all");
    localStorage.setItem("busDirection", els.busDirection?.value === "I" ? "I" : "O");
    saveBusStops(readBusEditorStops());
    setTransportSource("bus");
    els.mtrCard?.classList.remove("is-flipped");
    loadBusTimes();
  });
  els.minibusStopRows?.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-minibus-stop-remove]");
    if (!removeButton) return;
    markPanelActivity();
    const items = readMinibusEditorStops();
    const row = removeButton.closest("[data-minibus-stop-row]");
    const index = [...document.querySelectorAll("[data-minibus-stop-row]")].indexOf(row);
    items.splice(index, 1);
    renderMinibusSettings(items);
  });
  els.minibusAddStop?.addEventListener("click", () => {
    markPanelActivity();
    addSelectedMinibusStop();
  });
  els.minibusRouteSearchButton?.addEventListener("click", () => {
    markPanelActivity();
    searchMinibusRoutes();
  });
  els.minibusRouteSearch?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    markPanelActivity();
    searchMinibusRoutes();
  });
  els.minibusRouteSelect?.addEventListener("change", async () => {
    markPanelActivity();
    renderMinibusDirectionOptions(getSelectedMinibusRoute());
    await loadSelectedMinibusStops();
  });
  els.minibusRouteDirection?.addEventListener("change", async () => {
    markPanelActivity();
    await loadSelectedMinibusStops();
  });
  els.minibusForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    markPanelActivity();
    saveMinibusStops(readMinibusEditorStops());
    setTransportSource("minibus");
    els.mtrCard?.classList.remove("is-flipped");
    loadMinibusTimes();
  });

  els.spotifyLogin.addEventListener("click", async () => {
    if (musicSource !== "spotify") return;
    const token = await getSpotifyToken();
    if (!token) {
      await loginSpotify();
      return;
    }

    if (!spotifyDeviceId) {
      els.playState.textContent = "準備播放器";
      setupSpotifyWebPlayback();
      if (window.Spotify?.Player && window.onSpotifyWebPlaybackSDKReady) {
        await window.onSpotifyWebPlaybackSDKReady();
      }
      return;
    }

    await transferPlaybackToBrowser(true);
  });

  stage.addEventListener("scroll", updateActivePanel, { passive: true });
  stage.addEventListener("wheel", markPanelActivity, { passive: true });
  stage.addEventListener("touchstart", markPanelActivity, { passive: true });
  stage.addEventListener("pointerdown", markPanelActivity);
  window.addEventListener("keydown", markPanelActivity);
  window.addEventListener("resize", resizeStage);

  setInterval(updateProgressBar, 1000);

  resizeStage();
  renderEmptySpotifyState();
  musicSource = getSavedMusicSource();
  musicVolume = getSavedMusicVolume();
  previousMusicVolume = musicVolume || DEFAULT_MUSIC_VOLUME;
  if (els.youtubeUrlInput) els.youtubeUrlInput.value = getSavedYoutubeUrl();
  renderMusicVolume();
  renderMusicSource();
  loadSpotlightHomeImage();
  updateClock();
  setupSpotifyWebPlayback();
  handleSpotifyCallback();
  refreshSpotifyDisplay();
  loadHkoWeather();
  loadPublicHolidays();
  loadMarketData();
  renderMtrSettings();
  setMtrBackMode("settings");
  const initialTransportSource = getSavedTransportSource();
  setTransportSource(initialTransportSource, { scroll: false });
  updateMtrHeader();
  renderBusSettings();
  renderMinibusSettings();
  prepareMinibusRoutePicker();
  if (!localStorage.getItem("mtrConfig") && navigator.geolocation) {
    locateNearestMtrStation();
  }
  scrollToHash();
  requestAnimationFrame(scrollToHash);
  setTimeout(scrollToHash, 150);
  updateActivePanel();
  setInterval(updateClock, 1000);
  setInterval(refreshSpotifyDisplay, 30000);
  setInterval(updateRadioProgramText, 60 * 1000);
  setInterval(loadHkoWeather, 10 * 60 * 1000);
  setInterval(loadPublicHolidays, 12 * 60 * 60 * 1000);
  setInterval(() => setWeatherVisual(currentWeatherCondition), 60 * 1000);
  setInterval(loadMarketData, 60 * 1000);
  setInterval(() => {
    if (getSavedTransportSource() === "mtr") loadMtrTimes();
  }, 10 * 1000);
  setInterval(() => {
    const source = getSavedTransportSource();
    if (source === "bus") loadBusTimes();
    if (source === "minibus") loadMinibusTimes();
  }, 60 * 1000);
  setInterval(rotatePanelIfIdle, 15000);
}

initLoginPage();
initDisplayPage();
