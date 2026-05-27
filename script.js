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

const els = {
  clock: document.querySelector("#clock"),
  dateText: document.querySelector("#dateText"),
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
  fullscreenToggle: document.querySelector("#fullscreenToggle"),
  weatherDate: document.querySelector("#weatherDate"),
  weatherLocation: document.querySelector("#weatherLocation"),
  weatherTemp: document.querySelector("#weatherTemp"),
  weatherDesc: document.querySelector("#weatherDesc"),
  weatherHumidity: document.querySelector("#weatherHumidity"),
  weatherRain: document.querySelector("#weatherRain"),
};

const nowPlaying = {
  title: "Good To Be",
  artist: "Mark Ambor",
  albumImage: "./assets/spotify-album.svg",
};

let playing = true;
let spotifyPlayer = null;
let spotifyDeviceId = null;
let currentTrackId = null;
let currentDurationMs = 0;
let currentProgressMs = 0;
let currentProgressUpdatedAt = 0;
let isSpotifyPlaying = false;

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
}

function setActiveDot(index) {
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
    dot.setAttribute("aria-current", dotIndex === index ? "page" : "false");
  });
}

function updateActivePanel() {
  const index = Math.round(stage.scrollTop / stage.clientHeight);
  setActiveDot(Math.max(0, Math.min(index, panels.length - 1)));
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

function describeHkoWeather(forecastText, iconList) {
  if (forecastText?.includes("雨")) return "有雨";
  if (forecastText?.includes("雷暴")) return "雷暴";
  if (forecastText?.includes("多雲")) return "多雲";
  if (forecastText?.includes("天晴")) return "天晴";
  if (iconList?.includes(51)) return "酷熱";
  return "天氣";
}

async function loadHkoWeather() {
  try {
    const [reportResponse, forecastResponse] = await Promise.all([
      fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc"),
      fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc"),
    ]);

    if (!reportResponse.ok || !forecastResponse.ok) {
      throw new Error("HKO request failed");
    }

    const report = await reportResponse.json();
    const forecast = await forecastResponse.json();
    const temp = pickHkoTemperature(report);
    const humidity = report.humidity?.data?.[0];
    const rainfall = report.rainfall?.data?.find((item) => item.place === "中西區") ||
      report.rainfall?.data?.[0];
    const updateTime = new Date(report.updateTime || forecast.updateTime || Date.now());

    els.weatherLocation.textContent = temp?.place || "香港";
    els.weatherTemp.textContent = temp ? `${Math.round(temp.value)}°` : "--°";
    els.weatherHumidity.textContent = humidity ? `${humidity.value}%` : "--%";
    els.weatherRain.textContent =
      rainfall?.max !== undefined ? `${rainfall.max} ${rainfall.unit}` : "-- mm";
    els.weatherDesc.textContent = describeHkoWeather(forecast.forecastDesc, report.icon);
    els.weatherDate.innerHTML = new Intl.DateTimeFormat("zh-HK", {
      month: "long",
      day: "numeric",
    }).format(updateTime) + "<br />" + new Intl.DateTimeFormat("zh-HK", {
      weekday: "long",
    }).format(updateTime);
    els.weatherDate.dateTime = updateTime.toISOString();
  } catch {
    els.weatherDesc.textContent = "未能載入";
  }
}

function scrollToHash() {
  const panelIndex = panels.findIndex((panel) => `#${panel.id}` === window.location.hash);
  if (panelIndex < 0) return;
  stage.scrollTop = panelIndex * stage.clientHeight;
  updateActivePanel();
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const panelIndex = Number(dot.dataset.panel);
    panels[panelIndex].scrollIntoView({ behavior: "smooth", block: "start" });
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

els.fullscreenToggle.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

document.addEventListener("fullscreenchange", () => {
  const isFullscreen = Boolean(document.fullscreenElement);
  els.fullscreenToggle.textContent = isFullscreen ? "離開" : "全螢幕";
  els.fullscreenToggle.setAttribute(
    "aria-label",
    isFullscreen ? "離開全螢幕" : "進入全螢幕",
  );
  resizeStage();
});

stage.addEventListener("scroll", updateActivePanel, { passive: true });
window.addEventListener("resize", resizeStage);

setInterval(updateProgressBar, 1000);

resizeStage();
renderNowPlaying();
updateClock();
setupSpotifyWebPlayback();
handleSpotifyCallback();
refreshSpotifyDisplay();
loadHkoWeather();
scrollToHash();
requestAnimationFrame(scrollToHash);
setTimeout(scrollToHash, 150);
updateActivePanel();
setInterval(updateClock, 1000);
setInterval(refreshSpotifyDisplay, 30000);
setInterval(loadHkoWeather, 10 * 60 * 1000);
