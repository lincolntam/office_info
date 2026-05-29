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
const FALLBACK_SPOTIFY_TRACK_URL =
  "https://open.spotify.com/track/3R8iyJpmhI9ABDmTpetV2D?si=45c7c6dc3ad540bb";
const AUTO_ROTATE_MS = 5 * 60 * 1000;

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
  spotifyLogin: document.querySelector("#spotifyLogin"),
  saveTrack: document.querySelector("#saveTrack"),
  nextTrack: document.querySelector("#nextTrack"),
  connectDevice: document.querySelector("#connectDevice"),
  showQueue: document.querySelector("#showQueue"),
  weatherDate: document.querySelector("#weatherDate"),
  weatherCard: document.querySelector("#weatherCard"),
  weatherPhoto: document.querySelector("#weatherPhoto"),
  weatherLocation: document.querySelector("#weatherLocation"),
  weatherTemp: document.querySelector("#weatherTemp"),
  weatherDesc: document.querySelector("#weatherDesc"),
  weatherHumidity: document.querySelector("#weatherHumidity"),
  weatherRain: document.querySelector("#weatherRain"),
  weatherLow: document.querySelector("#weatherLow"),
  weatherHigh: document.querySelector("#weatherHigh"),
  marketForm: document.querySelector("#marketForm"),
  marketSymbolInput: document.querySelector("#marketSymbolInput"),
  hsiName: document.querySelector("#hsiName"),
  hsiChange: document.querySelector("#hsiChange"),
  hsiValue: document.querySelector("#hsiValue"),
  customName: document.querySelector("#customName"),
  customChange: document.querySelector("#customChange"),
  customValue: document.querySelector("#customValue"),
  hsiLine: document.querySelector("#hsiLine"),
  customLine: document.querySelector("#customLine"),
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
  title: "Good To Be",
  artist: "Mark Ambor",
  albumImage: "./assets/spotify-album.svg",
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

function renderNowPlaying() {
  els.trackTitle.textContent = nowPlaying.title;
  els.trackArtist.textContent = nowPlaying.artist;
  els.albumBackdrop.src = nowPlaying.albumImage;
}

async function loadFallbackSpotifyAlbum() {
  if (!els.albumBackdrop) return;

  try {
    const response = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(FALLBACK_SPOTIFY_TRACK_URL)}`,
    );
    if (!response.ok) throw new Error("Spotify oEmbed failed");

    const data = await response.json();
    if (data.thumbnail_url) {
      nowPlaying.albumImage = data.thumbnail_url;
      els.albumBackdrop.src = data.thumbnail_url;
    }
  } catch {
    els.albumBackdrop.src = nowPlaying.albumImage;
  }
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

function renderSpotifyTrack(track) {
  if (!track?.item) {
    setSpotifyConnectedUi(true);
    els.playState.textContent = "未在播放";
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

function updateProgressBar() {
  if (!currentDurationMs) {
    els.progressBar.style.width = "0%";
    return;
  }

  const elapsed = isSpotifyPlaying ? Date.now() - currentProgressUpdatedAt : 0;
  const progressNow = Math.min(currentProgressMs + elapsed, currentDurationMs);
  els.progressBar.style.width = `${(progressNow / currentDurationMs) * 100}%`;
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
    els.playState.textContent = "沒有可加入歌曲";
    return;
  }

  try {
    const response = await spotifyApi(`/me/tracks?ids=${encodeURIComponent(currentTrackId)}`, {
      method: "PUT",
    });
    els.playState.textContent = response.ok ? "已加入音樂庫" : "加入失敗";
  } catch {
    els.playState.textContent = "加入失敗";
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
    els.playState.textContent = "未能跳到下一首";
  }
}

async function showSpotifyQueue() {
  try {
    const response = await spotifyApi("/me/player/queue");
    if (!response.ok) throw new Error("Queue failed");
    const data = await response.json();
    const next = data.queue?.[0];
    els.playState.textContent = next ? `下一首：${next.name}` : "佇列是空的";
  } catch {
    els.playState.textContent = "無法讀取佇列";
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
      volume: 0.65,
    });

    spotifyPlayer.addListener("ready", ({ device_id }) => {
      spotifyDeviceId = device_id;
      setSpotifyConnectedUi(true);
      els.playState.textContent = "網頁播放器已就緒";
    });

    spotifyPlayer.addListener("not_ready", () => {
      spotifyDeviceId = null;
      setSpotifyConnectedUi(true);
      els.playState.textContent = "網頁播放器離線";
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
      els.playState.textContent = `播放器初始化失敗`;
      console.error(message);
    });

    spotifyPlayer.addListener("authentication_error", ({ message }) => {
      els.playState.textContent = `Spotify 認證失敗`;
      console.error(message);
    });

    spotifyPlayer.addListener("account_error", ({ message }) => {
      els.playState.textContent = "需要 Spotify Premium";
      console.error(message);
    });

    spotifyPlayer.addListener("playback_error", ({ message }) => {
      els.playState.textContent = "播放失敗";
      console.error(message);
    });

    await spotifyPlayer.connect();
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
    els.playState.textContent = "Spotify 連線失敗";
  }
}

async function loadSpotifyPlaybackState(token) {
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 204) {
    setSpotifyConnectedUi(true);
    els.trackTitle.textContent = "沒有播放內容";
    els.trackArtist.textContent = "開啟 Spotify 播放歌曲";
    els.albumBackdrop.src = nowPlaying.albumImage;
    els.progressBar.style.width = "0%";
    currentTrackId = null;
    currentDurationMs = 0;
    currentProgressMs = 0;
    isSpotifyPlaying = false;
    els.playPause.classList.add("is-paused");
    els.playState.textContent = "未在播放";
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
  try {
    const token = await getSpotifyToken();
    if (!token) {
      setSpotifyConnectedUi(false);
      return;
    }
    setSpotifyConnectedUi(true);
    await loadSpotifyNowPlaying();
  } catch {
    els.playState.textContent = "Spotify 連線失敗";
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

function pickHkoTemperature(report) {
  const readings = report.temperature?.data || [];
  return (
    readings.find((item) => item.place === "香港天文台") ||
    readings.find((item) => item.place === "香港公園") ||
    readings[0]
  );
}

function describeHkoWeather(forecastText, iconList, report) {
  const text = forecastText || "";
  const icons = Array.isArray(iconList) ? iconList : [];
  const rainfall = report?.rainfall?.data || [];
  const hasRainNow = rainfall.some((item) => Number(item.max || 0) > 0);

  if (icons.length > 0) {
    if (icons.includes(65)) return "STORM";
    if (icons.some((icon) => [53, 54, 62, 63, 64].includes(icon)) || hasRainNow) return "RAINING";
    if (icons.some((icon) => [50, 51].includes(icon))) return "SUNNY";
    if (icons.some((icon) => [52, 60, 61].includes(icon))) return "CLOUDY";
  }

  if (hasRainNow) return /雷暴|狂風雷暴|暴雨/.test(text) ? "STORM" : "RAINING";

  if (/霧|薄霧|煙霞/.test(text)) return "FOG";
  if (/天晴|陽光/.test(text) || icons.includes(50) || icons.includes(51)) return "SUNNY";
  if (/多雲|天陰|密雲/.test(text) || icons.some((icon) => icon >= 52 && icon <= 54)) return "CLOUDY";

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
    const temp = pickHkoTemperature(report);
    const humidity = report.humidity?.data?.[0];
    const rainfall = report.rainfall?.data?.find((item) => item.place === "中西區") ||
      report.rainfall?.data?.[0];
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

function getMarketRelativeValues(quote) {
  const rawValues = quote?.series?.map((point) => point.value).filter((value) => typeof value === "number") || [];
  const base = Number(quote?.previousClose || rawValues[0] || 1);
  return rawValues.map((value) => ((value - base) / base) * 100);
}

function buildMarketPath(quote, allValues) {
  const values = getMarketRelativeValues(quote);
  if (values.length < 2 || allValues.length < 2) return "";

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;
  const width = 480;
  const height = 132;
  const xStart = 20;
  const yStart = 30;

  return values
    .map((value, index) => {
      const x = xStart + (index / Math.max(values.length - 1, 1)) * width;
      const y = yStart + height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function renderMarketMetric(prefix, quote, metricElement) {
  const name = quote?.symbol || "--";
  els[`${prefix}Name`].textContent = prefix === "hsi" ? "HSI" : name;
  els[`${prefix}Change`].textContent = formatMarketPercent(quote?.changePercent);
  els[`${prefix}Value`].textContent = formatMarketNumber(quote?.price);
  metricElement?.classList.toggle("is-down", Number(quote?.changePercent || 0) < 0);
}

async function loadMarketData(symbol = localStorage.getItem("marketSymbol") || "0700.HK") {
  if (!els.marketForm) return;
  const cleanSymbol = String(symbol || "0700.HK").trim().toUpperCase() || "0700.HK";
  els.marketSymbolInput.value = cleanSymbol;
  els.marketStatus.textContent = "更新市場資料中...";

  try {
    const response = await fetch(`/api/market?symbol=${encodeURIComponent(cleanSymbol)}`, {
      credentials: "include",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Market request failed");

    const hsiValues = getMarketRelativeValues(data.hsi);
    const customValues = getMarketRelativeValues(data.custom);
    const allValues = [...hsiValues, ...customValues].filter((value) => typeof value === "number");
    const hsiChange = Number(data.hsi?.changePercent || 0);
    const marketCard = document.querySelector(".market-card");

    renderMarketMetric("hsi", data.hsi, document.querySelector(".market-metric.is-hsi"));
    renderMarketMetric("custom", data.custom, document.querySelector(".market-metric.is-custom"));
    marketCard?.classList.toggle("is-up", hsiChange >= 0);
    marketCard?.classList.toggle("is-down", hsiChange < 0);
    els.hsiLine.setAttribute("d", buildMarketPath(data.hsi, allValues));
    els.customLine.setAttribute("d", buildMarketPath(data.custom, allValues));
    els.marketStatus.textContent = `${data.hsi?.currency || "HKD"} · 今日走勢`;
    localStorage.setItem("marketSymbol", data.custom?.symbol || cleanSymbol);
    els.marketSymbolInput.value = data.custom?.symbol || cleanSymbol;
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
    els.loginMessage.textContent = enabled ? "請輸入邀請碼建立帳戶。" : "請輸入帳戶資料。";
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
        "本機或 GitHub Pages 不會連接 D1，部署到 Cloudflare 後可登入。";
    });

  els.signupToggle.addEventListener("click", () => setSignupMode(!isSignupMode));

  els.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    els.loginSubmit.disabled = true;
    els.loginMessage.textContent = isSignupMode ? "建立中..." : "登入中...";

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
        throw new Error(data.error || "登入失敗。");
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
      els.loginMessage.textContent = error.message || "登入失敗。";
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

  els.playPause.addEventListener("click", () => {
    playing = !playing;
    els.playPause.classList.toggle("is-paused", !playing);
    els.playPause.setAttribute("aria-label", playing ? "暫停" : "播放");
    els.playState.textContent = playing ? "正在播放" : "已暫停";
    if (spotifyPlayer) {
      spotifyPlayer.togglePlay();
    }
  });

  els.saveTrack.addEventListener("click", saveCurrentTrack);
  els.nextTrack.addEventListener("click", nextSpotifyTrack);
  els.connectDevice.addEventListener("click", () => transferPlaybackToBrowser(true));
  els.showQueue.addEventListener("click", showSpotifyQueue);
  els.marketForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    markPanelActivity();
    loadMarketData(els.marketSymbolInput.value);
  });

  els.spotifyLogin.addEventListener("click", async () => {
    const token = await getSpotifyToken();
    if (!token) {
      await loginSpotify();
      return;
    }

    if (!spotifyDeviceId) {
      els.playState.textContent = "播放器啟動中";
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
  renderNowPlaying();
  loadSpotlightHomeImage();
  loadFallbackSpotifyAlbum();
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
  setInterval(loadHkoWeather, 10 * 60 * 1000);
  setInterval(() => setWeatherVisual(currentWeatherCondition), 60 * 1000);
  setInterval(loadMarketData, 60 * 1000);
  setInterval(rotatePanelIfIdle, 15000);
}

initLoginPage();
initDisplayPage();
