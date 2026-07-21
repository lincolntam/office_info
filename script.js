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
  els.clock.textContent = new Intl.DateTimeFormat("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  els.clock.dateTime = now.toISOString();
  els.dateText.textContent = new Intl.DateTimeFormat("zh-HK", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(now);
  updateHomeScaleTime();
}

function updateHomeScaleTime() {
  if (!els.clock) return;
  const [hours, minutes] = els.clock.textContent.split(":");
  els.clock.innerHTML = `<span>${hours}</span><span>${minutes}</span>`;
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
  loadMarketData();
  scrollToHash();
  requestAnimationFrame(scrollToHash);
  setTimeout(scrollToHash, 150);
  updateActivePanel();
  setInterval(updateClock, 1000);
  setInterval(refreshSpotifyDisplay, 30000);
  setInterval(updateRadioProgramText, 60 * 1000);
  setInterval(loadHkoWeather, 10 * 60 * 1000);
  setInterval(() => setWeatherVisual(currentWeatherCondition), 60 * 1000);
  setInterval(loadMarketData, 60 * 1000);
  setInterval(rotatePanelIfIdle, 15000);
}

initLoginPage();
initDisplayPage();
