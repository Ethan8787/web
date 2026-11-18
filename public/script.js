(function () {
  "use strict";

  // Word List
  const wordsList = [
    "the", "be", "of", "and", "a", "to", "in", "he", "have", "it",
    "that", "for", "they", "with", "as", "not", "on", "she", "at", "by",
    "this", "we", "you", "do", "but", "from", "or", "which", "one", "would",
    "all", "will", "there", "say", "who", "make", "when", "can", "more", "if",
    "no", "man", "out", "other", "so", "what", "time", "up", "go", "about",
    "than", "into", "could", "state", "only", "new", "year", "some", "take", "come",
    "these", "know", "see", "use", "get", "like", "then", "first", "any", "work",
    "now", "may", "such", "give", "over", "think", "most", "even", "find", "day",
    "also", "after", "way", "many", "must", "look", "before", "great", "back", "through",
    "long", "where", "much", "should", "well", "people", "down", "own", "just", "because",
    "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little",
    "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become",
    "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under",
    "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin",
    "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form",
    "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest",
    "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again",
    "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however",
    "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact",
    "group", "play", "stand", "increase", "early", "course", "change", "help", "line"
  ];

  // Constants & Settings
  const MAX_EXTRA_CHARS = 19;
  const STORAGE_KEY = "offline-typing-test-settings-v1";
  const MODE_STORAGE_KEY = "offline-typing-test-mode-v1";
  const PB_KEY = "offline-typing-test-pb-v1";

  // In time mode, keep at least this many words ahead of the caret
  const WORDS_AHEAD = 40;
  const WORDS_CHUNK = 60;

  const ANIM_MIN = 0;
  const ANIM_MAX = 1000;

  const DEFAULT_SETTINGS = {
    anim: 200,
    bg: "#000000",
    text: "#646669",
    active: "#d1d0c5",
    accent: "#84a4d7",
    error: "#d33c4b"
  };

  const ANIM_PRESETS = [
    { label: "Off", value: 0 },
    { label: "Snappy", value: 100 },
    { label: "Default", value: 200 },
    { label: "Smooth", value: 400 }
  ];

  const MODE_PRESETS = {
    time: [15, 30, 60, 120],
    words: [10, 25, 50, 100]
  };

  const MODE_LIMITS = {
    time: { min: 1, max: 600 },
    words: { min: 1, max: 500 }
  };

  const MODE_LABELS = {
    time: "Custom time in seconds",
    words: "Custom word count"
  };

  const DEFAULT_CONFIG = {
    mode: "words",
    time: 30,
    words: 10,
    customText: "the quick brown fox jumps over the lazy dog"
  };

  const HEX_RE = /^#[0-9a-fA-F]{6}$/;

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  let settings = loadSettings();
  let config = loadConfig();
  let records = loadRecords();

  function loadSettings() {
    const result = Object.assign({}, DEFAULT_SETTINGS);

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);

        if (parsed && typeof parsed === "object") {
          ["bg", "text", "active", "accent", "error"].forEach(function (key) {
            if (typeof parsed[key] === "string" && HEX_RE.test(parsed[key])) {
              result[key] = parsed[key];
            }
          });

          const anim = Number(parsed.anim);

          if (isFinite(anim)) {
            result.anim = clamp(Math.round(anim), ANIM_MIN, ANIM_MAX);
          }
        }
      }
    } catch (err) {
      // Use default settings
    }

    return result;
  }

  function saveSettings() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      // Ignore storage errors
    }
  }

  function loadConfig() {
    const result = Object.assign({}, DEFAULT_CONFIG);

    try {
      const raw = window.localStorage.getItem(MODE_STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);

        if (parsed && typeof parsed === "object") {
          if (["time", "words", "custom"].indexOf(parsed.mode) !== -1) {
            result.mode = parsed.mode;
          }

          ["time", "words"].forEach(function (key) {
            const n = Math.round(Number(parsed[key]));

            if (isFinite(n)) {
              result[key] = clamp(n, MODE_LIMITS[key].min, MODE_LIMITS[key].max);
            }
          });

          if (
            typeof parsed.customText === "string" &&
            parseCustomText(parsed.customText).length > 0
          ) {
            result.customText = parsed.customText.slice(0, 20000);
          }
        }
      }
    } catch (err) {
      // Use default config
    }

    return result;
  }

  function saveConfig() {
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      // Ignore storage errors
    }
  }

  function applySettings() {
    const root = document.documentElement.style;

    root.setProperty("--bg", settings.bg);
    root.setProperty("--text", settings.text);
    root.setProperty("--active", settings.active);
    root.setProperty("--accent", settings.accent);
    root.setProperty("--error", settings.error);
    root.setProperty("--anim", settings.anim + "ms");
  }

  // DOM References
  const testView = document.getElementById("test-view");
  const resultView = document.getElementById("result-view");
  const wordsEl = document.getElementById("words");
  const wordsInner = document.getElementById("words-inner");
  const caretEl = document.getElementById("caret");
  const hiddenInput = document.getElementById("hidden-input");
  const typingArea = document.getElementById("typing-area");
  const liveStats = document.getElementById("live-stats");
  const liveWpm = document.getElementById("live-wpm");
  const liveProgress = document.getElementById("live-progress");
  const resWpm = document.getElementById("res-wpm");
  const resAcc = document.getElementById("res-acc");
  const resTime = document.getElementById("res-time");
  const resMode = document.getElementById("res-mode");
  const resRaw = document.getElementById("res-raw");
  const resChars = document.getElementById("res-chars");
  const resBanner = document.getElementById("res-banner");
  const resBannerTitle = document.getElementById("res-banner-title");
  const resBannerSub = document.getElementById("res-banner-sub");
  const settingsBtn = document.getElementById("settings-btn");

  const modeBar = document.getElementById("mode-bar");
  const modeTabs = document.querySelectorAll("#mode-tabs [data-mode]");
  const modeOptions = document.getElementById("mode-options");

  const modal = document.getElementById("modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const sAnim = document.getElementById("s-anim");
  const sAnimNum = document.getElementById("s-anim-num");
  const animPresetsEl = document.getElementById("anim-presets");
  const animPreview = document.getElementById("anim-preview");
  const sReset = document.getElementById("s-reset");
  const sClose = document.getElementById("s-close");

  const customModal = document.getElementById("custom-modal");
  const customBackdrop = document.getElementById("custom-backdrop");
  const customText = document.getElementById("custom-text");
  const customCount = document.getElementById("custom-count");
  const customCancel = document.getElementById("custom-cancel");
  const customSave = document.getElementById("custom-save");

  const colorInputs = {
    bg: document.getElementById("c-bg"),
    text: document.getElementById("c-text"),
    active: document.getElementById("c-active"),
    accent: document.getElementById("c-accent"),
    error: document.getElementById("c-error")
  };

  // Test State
  let words = [];
  let initialWords = [];
  let typed = [];
  let wordEls = [];
  let idx = 0;
  let started = false;
  let finished = false;
  let startTime = 0;
  let resetting = false;
  let currentView = "test";
  let modalOpen = false;
  let activeModal = null;
  let caretTimer = null;
  let totalMistakes = 0;
  let scrollRows = 0;
  let tickTimer = null;
  let previewTimer = null;
  let amountInput = null;

  // Word Generation & Rendering
  function pickWords(count) {
    if (count > wordsList.length) {
      return randomWords(count, "");
    }

    const pool = wordsList.slice();
    const picked = [];

    for (let i = 0; i < count; i++) {
      const j = i + Math.floor(Math.random() * (pool.length - i));
      const tmp = pool[i];

      pool[i] = pool[j];
      pool[j] = tmp;

      picked.push(pool[i]);
    }

    return picked;
  }

  // Random words that never repeat back-to-back (for long / endless tests)
  function randomWords(count, previous) {
    const out = [];
    let last = previous;

    for (let i = 0; i < count; i++) {
      let w;

      do {
        w = wordsList[Math.floor(Math.random() * wordsList.length)];
      } while (w === last);

      out.push(w);
      last = w;
    }

    return out;
  }

  function parseCustomText(text) {
    return String(text).split(/\s+/).filter(Boolean);
  }

  function isTimeMode() {
    return config.mode === "time";
  }

  function isLastWord() {
    return !isTimeMode() && idx === words.length - 1;
  }

  function createWordEl(i) {
    const el = document.createElement("div");

    el.className = "word";
    wordsInner.appendChild(el);
    wordEls.push(el);

    renderWord(i);
  }

  function buildWords() {
    wordsInner.innerHTML = "";
    wordEls = [];

    for (let i = 0; i < words.length; i++) {
      createWordEl(i);
    }
  }

  // Time mode: keep feeding words so the test never runs dry
  function appendWords(count) {
    const more = randomWords(count, words[words.length - 1] || "");

    more.forEach(function (w) {
      words.push(w);
      typed.push("");
      createWordEl(words.length - 1);
    });
  }

  function renderWord(i) {
    const word = words[i];
    const t = typed[i];
    const el = wordEls[i];
    const frag = document.createDocumentFragment();

    for (let k = 0; k < word.length; k++) {
      const span = document.createElement("span");

      span.className = "letter";

      if (k < t.length) {
        span.className += t.charAt(k) === word.charAt(k)
          ? " correct"
          : " incorrect";
      }

      span.textContent = word.charAt(k);
      frag.appendChild(span);
    }

    for (let k = word.length; k < t.length; k++) {
      const extra = document.createElement("span");

      extra.className = "letter extra";
      extra.textContent = t.charAt(k);

      frag.appendChild(extra);
    }

    el.innerHTML = "";
    el.appendChild(frag);

    if (i < idx && t !== word) {
      el.classList.add("error");
    } else {
      el.classList.remove("error");
    }
  }

  function updateCaret() {
    const el = wordEls[idx];

    if (!el) {
      return;
    }

    // Keep the caret's row inside the 3-row viewport by scrolling whole rows
    const rowH = el.offsetHeight;

    if (rowH > 0) {
      const row = Math.round(el.offsetTop / rowH);
      const visibleRow = row - scrollRows;

      if (visibleRow >= 2) {
        scrollRows = row - 1;
      } else if (visibleRow < 0) {
        scrollRows = row;
      }

      wordsEl.style.height = rowH * 3 + "px";
      wordsInner.style.transform =
        "translateY(" + -scrollRows * rowH + "px)";
    }

    const scrollPx = scrollRows * rowH;
    const letters = el.children;
    const t = typed[idx];

    let x;
    let y;
    let target;

    if (t.length < letters.length) {
      target = letters[t.length];
      x = target.offsetLeft;
    } else {
      target = letters[letters.length - 1];
      x = target.offsetLeft + target.offsetWidth;
    }

    y = target.offsetTop - scrollPx;

    const originalHeight = target.offsetHeight;
    const customHeight = 38;
    const offsetY = (originalHeight - customHeight) / 2;

    caretEl.style.height = customHeight + "px";
    caretEl.style.transform =
      "translate(" + x + "px, " + (y + offsetY) + "px)";
  }

  function pulseCaret() {
    caretEl.classList.add("typing");

    if (caretTimer) {
      clearTimeout(caretTimer);
    }

    caretTimer = setTimeout(function () {
      caretEl.classList.remove("typing");
    }, 600);
  }

  // Calculations
  function computeStats(elapsedMs) {
    let correct = 0;
    let attempted = 0;
    let currentIncorrect = 0;

    for (let i = 0; i <= idx && i < words.length; i++) {
      const t = typed[i];
      const w = words[i];

      for (let k = 0; k < t.length; k++) {
        attempted++;

        if (k < w.length && t.charAt(k) === w.charAt(k)) {
          correct++;
        } else {
          currentIncorrect++;
        }
      }

      if (i < idx) {
        attempted++;

        if (t === w) {
          correct++;
        }
      }
    }

    const erasedMistakes = Math.max(
      0,
      totalMistakes - currentIncorrect
    );

    const accuracyAttempts = attempted + erasedMistakes;
    const minutes = Math.max(elapsedMs, 1) / 60000;
    const wpm = (attempted / 5) / minutes;

    const accuracy = accuracyAttempts > 0
      ? (correct / accuracyAttempts) * 100
      : 100;

    return {
      total: correct,
      correct: correct,
      incorrect: currentIncorrect,
      raw: (attempted / 5) / minutes,
      wpm: wpm,
      accuracy: accuracy
    };
  }

  function updateLiveStats() {
    if (!started) {
      liveWpm.textContent = "0";
      liveProgress.textContent = isTimeMode()
        ? String(config.time)
        : "0/" + words.length;
      return;
    }

    const elapsed = performance.now() - startTime;
    const stats = computeStats(Math.max(elapsed, 1000));

    liveWpm.textContent = String(Math.round(stats.wpm));

    if (isTimeMode()) {
      liveProgress.textContent = String(
        Math.max(0, Math.ceil(config.time - elapsed / 1000))
      );
    } else {
      liveProgress.textContent =
        Math.min(idx, words.length) + "/" + words.length;
    }
  }

  // Timer (drives the countdown in time mode and keeps live WPM fresh)
  function startTimer() {
    stopTimer();
    tickTimer = setInterval(tick, 1000);
  }

  function stopTimer() {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  function tick() {
    if (!started || finished) {
      return;
    }

    if (isTimeMode() && performance.now() - startTime >= config.time * 1000) {
      finishTest();
      return;
    }

    updateLiveStats();
  }

  // Personal bests
  function loadRecords() {
    const out = {};

    try {
      const parsed = JSON.parse(window.localStorage.getItem(PB_KEY) || "{}");

      Object.keys(parsed).forEach(function (k) {
        const r = parsed[k];

        if (r && isFinite(r.wpm) && isFinite(r.acc)) {
          out[k] = {
            wpm: Number(r.wpm),
            acc: Number(r.acc),
            date: Number(r.date) || 0
          };
        }
      });
    } catch (err) {
      // Start with no records
    }

    return out;
  }

  function saveRecords() {
    try {
      window.localStorage.setItem(PB_KEY, JSON.stringify(records));
    } catch (err) {
      // Ignore storage errors
    }
  }

  // One record per mode + value; each custom text gets its own record
  function pbKey() {
    if (config.mode === "custom") {
      const s = parseCustomText(config.customText).join(" ");
      let h = 5381;

      for (let i = 0; i < s.length; i++) {
        h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
      }

      return "custom:" + h;
    }

    return config.mode + ":" + config[config.mode];
  }

  function showResult(stats, elapsed) {
    const wpm = Math.round(stats.wpm * 100) / 100;
    const acc = Math.round(stats.accuracy * 100) / 100;
    const key = pbKey();
    const prev = records[key] || null;
    const isPb = wpm > 0 && (
      !prev ||
      wpm > prev.wpm ||
      (wpm === prev.wpm && acc > prev.acc)
    );

    if (isPb) {
      records[key] = { wpm: wpm, acc: acc, date: Date.now() };
      saveRecords();
    }

    resWpm.textContent = String(Math.round(wpm));
    resWpm.title = wpm + " wpm";
    resWpm.parentNode.classList.toggle("is-pb", isPb);
    resAcc.textContent = Math.round(acc) + "%";
    resAcc.title = acc + "%";
    resRaw.textContent = String(Math.round(stats.raw));
    resChars.textContent = stats.correct + " / " + stats.incorrect;
    resTime.textContent = (elapsed / 1000).toFixed(1) + "s";
    resMode.textContent = modeLabel();

    let title = "";
    let sub = "";

    if (isPb && !prev) {
      title = "first record set";
      sub = "your starting point for " + modeLabel();
    } else if (isPb) {
      title = "new personal best";
      sub = "+" + (wpm - prev.wpm).toFixed(1) +
        " wpm, previous best " + Math.round(prev.wpm);
    } else if (prev && wpm > 0) {
      title = (prev.wpm - wpm).toFixed(1) + " wpm from your best";
      sub = "personal best " + Math.round(prev.wpm) + " wpm, " +
        Math.round(prev.acc) + "% accuracy";
    }

    resBanner.className = "res-banner reveal" +
      (isPb ? " pb" : "") +
      (title ? "" : " hidden");
    resBannerTitle.textContent = title;
    resBannerSub.textContent = sub;

  }

  // Test Lifecycle
  function newTest(reuse) {
    stopTimer();

    if (reuse && initialWords.length) {
      words = initialWords.slice();
    } else if (isTimeMode()) {
      words = randomWords(WORDS_CHUNK + WORDS_AHEAD, "");
    } else if (config.mode === "words") {
      words = pickWords(config.words);
    } else {
      words = parseCustomText(config.customText);

      if (words.length === 0) {
        words = parseCustomText(DEFAULT_CONFIG.customText);
      }
    }

    initialWords = words.slice();

    typed = words.map(function () {
      return "";
    });

    idx = 0;
    scrollRows = 0;
    started = false;
    finished = false;
    startTime = 0;
    totalMistakes = 0;

    wordsInner.style.transform = "translateY(0px)";
    buildWords();

    modeBar.classList.remove("dim");
    liveStats.classList.remove("active");
    updateLiveStats();
    updateCaret();
    focusInput();
  }

  function focusInput() {
    try {
      hiddenInput.focus({ preventScroll: true });
    } catch (err) {
      hiddenInput.focus();
    }
  }

  // reuse = true repeats the same words
  function resetTest(reuse) {
    if (resetting) {
      return;
    }

    resetting = true;
    const delay = settings.anim;

    if (currentView === "result") {
      currentView = "test";
      resultView.classList.remove("show");

      setTimeout(function () {
        resultView.classList.remove("visible");

        newTest(reuse);

        testView.classList.add("visible");
        void testView.offsetWidth;
        testView.classList.add("show");

        wordsEl.classList.remove("fading");
        updateCaret();
        focusInput();

        resetting = false;
      }, delay);

      return;
    }

    stopTimer();
    started = false;
    finished = false;

    wordsEl.classList.add("fading");
    liveStats.classList.remove("active");

    setTimeout(function () {
      newTest(reuse);
      wordsEl.classList.remove("fading");
      resetting = false;
    }, delay);
  }

  // Restart after the mode or its value changed (waits out a running reset)
  function restartForConfig() {
    if (resetting) {
      setTimeout(restartForConfig, 30);
      return;
    }

    resetTest();
  }

  function modeLabel() {
    if (config.mode === "time") {
      return "time " + config.time + "s";
    }

    if (config.mode === "words") {
      return "words " + config.words;
    }

    return "custom, " + words.length + " words";
  }

  function finishTest() {
    if (finished) {
      return;
    }

    finished = true;
    resetting = true;
    stopTimer();

    const elapsed = isTimeMode()
      ? config.time * 1000
      : Math.max(performance.now() - startTime, 1);
    const stats = computeStats(elapsed);

    renderWord(idx);
    updateCaret();

    liveWpm.textContent = String(Math.round(stats.wpm));
    liveProgress.textContent = isTimeMode()
      ? "0"
      : words.length + "/" + words.length;

    showResult(stats, elapsed);

    modeBar.classList.remove("dim");

    currentView = "result";
    testView.classList.remove("show");

    setTimeout(function () {
      testView.classList.remove("visible");

      resultView.classList.add("visible");
      void resultView.offsetWidth;
      resultView.classList.add("show");

      resetting = false;
      focusInput();
    }, settings.anim);
  }

  // Start
  function startIfNeeded() {
    if (!started) {
      started = true;
      startTime = performance.now();
      liveStats.classList.add("active");
      modeBar.classList.add("dim");
      startTimer();
    }
  }

  function afterEdit() {
    updateCaret();
    pulseCaret();
  }

  // Backspace
  function handleBackspace() {
    if (typed[idx].length > 0) {
      typed[idx] = typed[idx].slice(0, -1);

      renderWord(idx);
      afterEdit();

      return;
    }

    if (idx > 0 && typed[idx - 1] !== words[idx - 1]) {
      const leaving = idx;

      idx--;

      renderWord(leaving);
      renderWord(idx);

      afterEdit();
    }
  }

  // Space
  function handleSpace() {
    if (typed[idx].length === 0) {
      return;
    }

    if (isLastWord()) {
      finishTest();
      return;
    }

    const leaving = idx;

    idx++;

    if (isTimeMode() && words.length - idx < WORDS_AHEAD) {
      appendWords(WORDS_CHUNK);
    }

    renderWord(leaving);
    renderWord(idx);

    afterEdit();
  }

  // Character Input
  function handleCharacter(ch) {
    if (typed[idx].length >= words[idx].length + MAX_EXTRA_CHARS) {
      return;
    }

    const position = typed[idx].length;

    if (
      position >= words[idx].length ||
      ch !== words[idx].charAt(position)
    ) {
      
    }

    typed[idx] += ch;

    renderWord(idx);
    afterEdit();

    if (isLastWord() && typed[idx] === words[idx]) {
      finishTest();
    }
  }

  // Keyboard Handling
  document.addEventListener("keydown", function (e) {
    if (modalOpen) {
      if (e.key === "Escape") {
        closeModal();
      }

      return;
    }

    const target = e.target;
    const tag = target && target.tagName ? target.tagName : "";

    if (
      (tag === "INPUT" && target !== hiddenInput) ||
      tag === "SELECT" ||
      tag === "TEXTAREA"
    ) {
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      resetTest();
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    if (currentView === "result") {
      // Let a focused result button handle its own Enter / Space
      if (tag === "BUTTON" && (e.key === "Enter" || e.key === " ")) {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        resetTest();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        resetTest(true);
      }

      return;
    }

    if (resetting || finished) {
      if (e.key === " " || e.key.length === 1) {
        e.preventDefault();
      }

      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();

      if (started) {
        handleBackspace();
      }

      return;
    }

    if (e.key === " ") {
      e.preventDefault();

      if (started) {
        handleSpace();
      }

      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();

      startIfNeeded();
      handleCharacter(e.key);
    }
  });

  hiddenInput.addEventListener("input", function () {
    hiddenInput.value = "";
  });

  typingArea.addEventListener("click", focusInput);

  document.getElementById("btn-next").addEventListener("click", function () {
    resetTest();
  });

  document.getElementById("btn-repeat").addEventListener("click", function () {
    resetTest(true);
  });

  window.addEventListener("resize", function () {
    if (currentView === "test" && wordEls.length) {
      updateCaret();
    }
  });

  // Mode bar
  function makeSegButton(text) {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "seg-btn";
    btn.textContent = text;

    return btn;
  }

  function renderModeOptions() {
    modeOptions.innerHTML = "";
    amountInput = null;

    if (config.mode === "custom") {
      const edit = makeSegButton("edit text");

      edit.addEventListener("click", openCustomModal);

      const note = document.createElement("span");

      note.className = "mode-note";
      note.id = "custom-note";

      modeOptions.appendChild(edit);
      modeOptions.appendChild(note);
    } else {
      const mode = config.mode;

      MODE_PRESETS[mode].forEach(function (value) {
        const btn = makeSegButton(String(value));

        btn.dataset.value = String(value);
        btn.addEventListener("click", function () {
          setAmount(value);
        });

        modeOptions.appendChild(btn);
      });

      amountInput = document.createElement("input");
      amountInput.type = "number";
      amountInput.className = "amount-input";
      amountInput.placeholder = "custom";
      amountInput.min = String(MODE_LIMITS[mode].min);
      amountInput.max = String(MODE_LIMITS[mode].max);
      amountInput.step = "1";
      amountInput.inputMode = "numeric";
      amountInput.title = MODE_LABELS[mode];
      amountInput.setAttribute("aria-label", MODE_LABELS[mode]);

      amountInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          commitAmountInput();
          focusInput();
        } else if (e.key === "Escape") {
          e.preventDefault();
          syncModeUI();
          focusInput();
        }
      });

      amountInput.addEventListener("change", commitAmountInput);

      modeOptions.appendChild(amountInput);
    }

    syncModeUI();
  }

  // Update highlights and values without replacing nodes (keeps clicks intact)
  function syncModeUI() {
    modeTabs.forEach(function (btn) {
      const on = btn.dataset.mode === config.mode;

      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    if (config.mode === "custom") {
      const note = document.getElementById("custom-note");

      if (note) {
        const n = parseCustomText(config.customText).length;

        note.textContent = n + (n === 1 ? " word" : " words");
      }

      return;
    }

    const current = config[config.mode];
    const presets = MODE_PRESETS[config.mode];
    const isPreset = presets.indexOf(current) !== -1;

    Array.prototype.forEach.call(
      modeOptions.querySelectorAll("button"),
      function (btn) {
        const on = Number(btn.dataset.value) === current;

        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      }
    );

    if (amountInput) {
      amountInput.value = isPreset ? "" : String(current);
      amountInput.classList.toggle("active", !isPreset);
    }
  }

  function setAmount(value) {
    const mode = config.mode;
    const limits = MODE_LIMITS[mode];
    const n = clamp(Math.round(Number(value)), limits.min, limits.max);

    config[mode] = n;
    saveConfig();
    syncModeUI();
    restartForConfig();
  }

  function commitAmountInput() {
    if (!amountInput) {
      return;
    }

    const n = Math.round(Number(amountInput.value));

    if (amountInput.value === "" || !isFinite(n)) {
      syncModeUI();
      return;
    }

    setAmount(n);
  }

  function setMode(mode) {
    if (config.mode === mode) {
      return;
    }

    config.mode = mode;
    saveConfig();
    renderModeOptions();
    restartForConfig();

    if (mode === "custom") {
      openCustomModal();
    }
  }

  modeTabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setMode(btn.dataset.mode);
    });
  });

  // Modals
  function showModal(el, focusEl) {
    activeModal = el;
    modalOpen = true;
    el.classList.add("open");

    focusEl.focus();
  }

  function closeModal() {
    if (!activeModal) {
      return;
    }

    activeModal.classList.remove("open");
    activeModal = null;
    modalOpen = false;

    stopPreview();

    if (currentView === "test") {
      focusInput();
      updateCaret();
    }
  }

  // Custom text
  function updateCustomCount() {
    const n = parseCustomText(customText.value).length;

    customCount.textContent = n + (n === 1 ? " word" : " words");
    customSave.disabled = n === 0;
  }

  function openCustomModal() {
    customText.value = config.customText;
    updateCustomCount();

    showModal(customModal, customText);
    customText.select();
  }

  function saveCustomText() {
    if (parseCustomText(customText.value).length === 0) {
      return;
    }

    config.customText = customText.value.slice(0, 20000);
    saveConfig();
    syncModeUI();
    closeModal();
    restartForConfig();
  }

  customText.addEventListener("input", updateCustomCount);

  customText.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveCustomText();
    }
  });

  customSave.addEventListener("click", saveCustomText);
  customCancel.addEventListener("click", closeModal);
  customBackdrop.addEventListener("click", closeModal);

  // Settings
  function buildAnimPresets() {
    ANIM_PRESETS.forEach(function (preset) {
      const btn = document.createElement("button");

      btn.type = "button";
      btn.className = "chip";
      btn.dataset.value = String(preset.value);
      btn.textContent = preset.label + " " + preset.value;
      btn.title = preset.value + " ms";

      btn.addEventListener("click", function () {
        setAnim(preset.value);
        flipPreview();
      });

      animPresetsEl.appendChild(btn);
    });
  }

  function updateAnimUI(fromNumberField) {
    const pct = ((settings.anim - ANIM_MIN) / (ANIM_MAX - ANIM_MIN)) * 100;

    sAnim.value = String(settings.anim);
    sAnim.style.setProperty("--pct", pct + "%");
    sAnim.setAttribute("aria-valuetext", settings.anim + " milliseconds");

    // Don't rewrite the number field while the user is typing in it
    if (!fromNumberField) {
      sAnimNum.value = String(settings.anim);
    }

    Array.prototype.forEach.call(
      animPresetsEl.children,
      function (btn) {
        const on = Number(btn.dataset.value) === settings.anim;

        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      }
    );
  }

  function syncSettingsInputs() {
    updateAnimUI(false);

    Object.keys(colorInputs).forEach(function (key) {
      colorInputs[key].value = settings[key];
    });
  }

  // Looping preview so the speed can be felt, not just read
  function flipPreview() {
    animPreview.classList.toggle("flip");
  }

  function startPreview() {
    stopPreview();

    animPreview.classList.remove("flip");
    previewTimer = setInterval(flipPreview, 1100);
  }

  function stopPreview() {
    if (previewTimer) {
      clearInterval(previewTimer);
      previewTimer = null;
    }
  }

  function openModal() {
    syncSettingsInputs();
    showModal(modal, sClose);
    startPreview();
  }

  function setAnim(value, fromNumberField) {
    const n = Math.round(Number(value));

    if (!isFinite(n)) {
      return;
    }

    settings.anim = clamp(n, ANIM_MIN, ANIM_MAX);

    updateAnimUI(Boolean(fromNumberField));
    applySettings();
    saveSettings();
  }

  settingsBtn.addEventListener("click", openModal);
  sClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  sAnim.addEventListener("input", function () {
    setAnim(sAnim.value);
  });

  // Replay the preview when the slider is released
  sAnim.addEventListener("change", flipPreview);

  sAnimNum.addEventListener("input", function () {
    if (sAnimNum.value !== "") {
      setAnim(sAnimNum.value, true);
    }
  });

  // Normalize the field (clamp, fill if empty) once the user is done typing
  sAnimNum.addEventListener("change", function () {
    setAnim(sAnimNum.value === "" ? settings.anim : sAnimNum.value);
    flipPreview();
  });

  sAnimNum.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sAnimNum.blur();
    }
  });

  Object.keys(colorInputs).forEach(function (key) {
    colorInputs[key].addEventListener("input", function () {
      if (HEX_RE.test(colorInputs[key].value)) {
        settings[key] = colorInputs[key].value;

        applySettings();
        saveSettings();
      }
    });
  });

  sReset.addEventListener("click", function () {
    settings = Object.assign({}, DEFAULT_SETTINGS);

    applySettings();
    saveSettings();
    syncSettingsInputs();
    flipPreview();
  });

  // Init
  buildAnimPresets();
  applySettings();
  renderModeOptions();
  newTest();

  window.addEventListener("load", function () {
    updateCaret();
    focusInput();
  });
})();