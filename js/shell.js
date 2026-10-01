const SOUND_KEY = "glhf-hub-sound";

let enabled = false;
let audioReady = false;
let clickAudio;
let successAudio;
let pressAudio;
let themeAudio;
let wantTheme = false;

function safePlay(audio) {
  if (!audio) return;
  const pending = audio.play();
  if (pending && typeof pending.catch === "function") pending.catch(() => {});
}

function ensureAudio() {
  if (audioReady) return;
  audioReady = true;
  clickAudio = new Audio("assets/sounds/Click.mp3");
  successAudio = new Audio("assets/sounds/Success.mp3");
  pressAudio = new Audio("assets/sounds/Press_Start.mp3");
  themeAudio = new Audio("assets/sounds/GLHFers_Theme.mp3");
  clickAudio.preload = "auto";
  successAudio.preload = "auto";
  pressAudio.preload = "auto";
  themeAudio.preload = "auto";
  clickAudio.volume = 0.45;
  successAudio.volume = 0.55;
  pressAudio.volume = 0.4;
  themeAudio.volume = 0.28;
  themeAudio.loop = true;
}

function startTheme() {
  ensureAudio();
  if (!enabled || !wantTheme) return;
  if (!themeAudio.paused) return;
  safePlay(themeAudio);
}

export function playClick() {
  if (!enabled) return;
  ensureAudio();
  clickAudio.currentTime = 0;
  safePlay(clickAudio);
}

export function playSuccess() {
  if (!enabled) return;
  ensureAudio();
  successAudio.currentTime = 0;
  safePlay(successAudio);
}

function updateSoundButton() {
  const button = document.getElementById("sound-toggle");
  if (!button) return;
  button.setAttribute("aria-pressed", enabled ? "true" : "false");
  button.textContent = enabled ? "Sound on" : "Sound off";
}

function enableSound() {
  enabled = true;
  wantTheme = true;
  try {
    localStorage.setItem(SOUND_KEY, "on");
  } catch {
    /* ignore */
  }
  updateSoundButton();
  ensureAudio();
  pressAudio.currentTime = 0;
  safePlay(pressAudio);
  pressAudio.onended = () => startTheme();
  setTimeout(startTheme, 1200);
}

function disableSound() {
  enabled = false;
  wantTheme = false;
  try {
    localStorage.setItem(SOUND_KEY, "off");
  } catch {
    /* ignore */
  }
  updateSoundButton();
  if (themeAudio) {
    themeAudio.pause();
    themeAudio.currentTime = 0;
  }
  if (pressAudio) {
    pressAudio.pause();
    pressAudio.onended = null;
  }
}

export function initShell() {
  if (document.body.dataset.shell === "on") return;
  document.body.dataset.shell = "on";

  const page = document.body.dataset.page;
  document.querySelectorAll("#site-nav a").forEach((link) => {
    if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const moreBtn = document.querySelector(".nav-more-btn");
  const moreMenu = document.getElementById("more-menu");

  function closeMore() {
    if (!moreMenu || moreMenu.hidden) return;
    moreMenu.hidden = true;
    moreBtn?.setAttribute("aria-expanded", "false");
  }

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) closeMore();
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest(".nav-more-btn")) return;
    if (!event.target.closest("a")) return;
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    closeMore();
  });
  moreBtn?.addEventListener("click", () => {
    const open = moreMenu.hidden;
    moreMenu.hidden = !open;
    moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  if (moreMenu?.querySelector("a[aria-current='page']")) moreBtn?.classList.add("is-here");
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-more")) closeMore();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMore();
  });

  try {
    enabled = localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    enabled = false;
  }
  updateSoundButton();
  if (enabled) {
    const resume = () => {
      wantTheme = true;
      startTheme();
      document.removeEventListener("pointerdown", resume);
    };
    document.addEventListener("pointerdown", resume);
  }

  document.getElementById("sound-toggle")?.addEventListener("click", () => {
    if (enabled) disableSound();
    else enableSound();
  });

  document.addEventListener("click", (event) => {
    if (!enabled) return;
    const hit = event.target.closest("a, button, [data-click]");
    if (!hit || hit.id === "sound-toggle") return;
    playClick();
  });
}

initShell();
