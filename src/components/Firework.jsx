import {useEffect, useRef} from "react";
import "./Firework.css";

export default function Firework() {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const loadScript = (src) => new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = src;
            s.async = true;
            s.onload = () => resolve(s);
            s.onerror = reject;
            document.body.appendChild(s);
        });

        let injectedMainScript = null;
        let cancelled = false;

        (async () => {
            await loadScript("https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/fscreen%401.0.1.js");
            await loadScript("https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/Stage%400.1.4.js");
            await loadScript("https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/MyMath.js");

            if (cancelled) return;

            const main = document.createElement("script");
            main.type = "text/javascript";
            main.text = `"use strict";
console.clear();

const IS_MOBILE = window.innerWidth <= 640;
const IS_DESKTOP = window.innerWidth > 800;
const IS_HEADER = IS_DESKTOP && window.innerHeight < 300;
const IS_HIGH_END_DEVICE = (() => {
  const hwConcurrency = navigator.hardwareConcurrency;
  if (!hwConcurrency) {
    return false;
  }
  const minCount = window.innerWidth <= 1024 ? 4 : 8;
  return hwConcurrency >= minCount;
})();

const MAX_WIDTH = 7680;
const MAX_HEIGHT = 4320;
const GRAVITY = 0.9;
let simSpeed = 1;

function getDefaultScaleFactor() {
  if (IS_MOBILE) return 0.9;
  if (IS_HEADER) return 0.75;
  return 1;
}

let stageW, stageH;

let quality = 1;
let isLowQuality = false;
let isNormalQuality = true;
let isHighQuality = false;

const QUALITY_LOW = 1;
const QUALITY_NORMAL = 2;
const QUALITY_HIGH = 3;

const SKY_LIGHT_NONE = 0;
const SKY_LIGHT_DIM = 1;
const SKY_LIGHT_NORMAL = 2;

const COLOR = {
  Red: "#ff0043",
  Green: "#14fc56",
  Blue: "#1e7fff",
  Purple: "#e60aff",
  Gold: "#ffbf36",
  White: "#ffffff",
};

const INVISIBLE = "_INVISIBLE_";

const PI_2 = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;

const trailsStage = new Stage("trails-canvas");
const mainStage = new Stage("main-canvas");
const stages = [trailsStage, mainStage];

function fullscreenEnabled() {
  return fscreen.fullscreenEnabled;
}

function isFullscreen() {
  return !!fscreen.fullscreenElement;
}

function toggleFullscreen() {
  if (fullscreenEnabled()) {
    if (isFullscreen()) {
      fscreen.exitFullscreen();
    } else {
      fscreen.requestFullscreen(document.documentElement);
    }
  }
}

fscreen.addEventListener("fullscreenchange", () => {
  store.setState({ fullscreen: isFullscreen() });
});

const store = {
  _listeners: new Set(),
  _dispatch(prevState) {
    this._listeners.forEach((listener) => listener(this.state, prevState));
  },

  state: {
    paused: true,
    soundEnabled: false,
    menuOpen: false,
    openHelpTopic: null,
    fullscreen: isFullscreen(),
    config: {
      quality: String(IS_HIGH_END_DEVICE ? QUALITY_HIGH : QUALITY_NORMAL),
      shell: "Random",
      size: IS_DESKTOP ? "3" : IS_HEADER ? "1.2" : "2",
      autoLaunch: true,
      finale: false,
      skyLighting: SKY_LIGHT_NORMAL + "",
      hideControls: IS_HEADER,
      longExposure: false,
      scaleFactor: getDefaultScaleFactor(),
    },
  },

  setState(nextState) {
    const prevState = this.state;
    this.state = Object.assign({}, this.state, nextState);
    this._dispatch(prevState);
    this.persist();
  },

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.remove(listener);
  },

  load() {
    const serializedData = localStorage.getItem("cm_fireworks_data");
    if (serializedData) {
      const { schemaVersion, data } = JSON.parse(serializedData);

      const config = this.state.config;
      switch (schemaVersion) {
        case "1.1":
          config.quality = data.quality;
          config.size = data.size;
          config.skyLighting = data.skyLighting;
          break;
        case "1.2":
          config.quality = data.quality;
          config.size = data.size;
          config.skyLighting = data.skyLighting;
          config.scaleFactor = data.scaleFactor;
          break;
        default:
          throw new Error("version switch should be exhaustive");
      }
      console.log(\`Loaded config (schema version \${schemaVersion})\`);
    } else if (localStorage.getItem("schemaVersion") === "1") {
      let size;
      try {
        const sizeRaw = localStorage.getItem("configSize");
        size = typeof sizeRaw === "string" && JSON.parse(sizeRaw);
      } catch (e) {
        console.log("Recovered from error parsing saved config:");
        console.error(e);
        return;
      }

      const sizeInt = parseInt(size, 10);
      if (sizeInt >= 0 && sizeInt <= 4) {
        this.state.config.size = String(sizeInt);
      }
    }
  },

  persist() {
    const config = this.state.config;
    localStorage.setItem(
      "cm_fireworks_data",
      JSON.stringify({
        schemaVersion: "1.2",
        data: {
          quality: config.quality,
          size: config.size,
          skyLighting: config.skyLighting,
          scaleFactor: config.scaleFactor,
        },
      })
    );
  },
};

if (!IS_HEADER) {
  store.load();
}

function togglePause(toggle) {
  const paused = store.state.paused;
  let newValue;
  if (typeof toggle === "boolean") {
    newValue = toggle;
  } else {
    newValue = !paused;
  }

  if (paused !== newValue) {
    store.setState({ paused: newValue });
  }
}

function toggleSound(toggle) {
  if (typeof toggle === "boolean") {
    store.setState({ soundEnabled: toggle });
  } else {
    store.setState({ soundEnabled: !store.state.soundEnabled });
  }
}

function toggleMenu(toggle) {
  if (typeof toggle === "boolean") {
    store.setState({ menuOpen: toggle });
  } else {
    store.setState({ menuOpen: !store.state.menuOpen });
  }
}

function updateConfig(nextConfig) {
  nextConfig = nextConfig || getConfigFromDOM();
  store.setState({
    config: Object.assign({}, store.state.config, nextConfig),
  });

  configDidUpdate();
}

function configDidUpdate() {
  const config = store.state.config;

  quality = qualitySelector();
  isLowQuality = quality === QUALITY_LOW;
  isNormalQuality = quality === QUALITY_NORMAL;
  isHighQuality = quality === QUALITY_HIGH;

  if (skyLightingSelector() === SKY_LIGHT_NONE) {
    appNodes.canvasContainer.style.backgroundColor = "#000";
  }

  Spark.drawWidth = quality === QUALITY_HIGH ? 0.75 : 1;
}

const isRunning = (state = store.state) => !state.paused && !state.menuOpen;
const soundEnabledSelector = (state = store.state) => state.soundEnabled;
const canPlaySoundSelector = (state = store.state) =>
  isRunning(state) && soundEnabledSelector(state);
const qualitySelector = () => +store.state.config.quality;
const shellNameSelector = () => store.state.config.shell;
const shellSizeSelector = () => +store.state.config.size;
const finaleSelector = () => store.state.config.finale;
const skyLightingSelector = () => +store.state.config.skyLighting;
const scaleFactorSelector = () => store.state.config.scaleFactor;

const helpContent = {
  shellType: {
    header: "Shell Type",
    body: 'The type of firework that will be launched. Select "Random" for a nice assortment!',
  },
  shellSize: {
    header: "Shell Size",
    body: "The size of the fireworks. Modeled after real firework shell sizes, larger shells have bigger bursts with more stars, and sometimes more complex effects. However, larger shells also require more processing power and may cause lag.",
  },
  quality: {
    header: "Quality",
    body: "Overall graphics quality. If the animation is not running smoothly, try lowering the quality. High quality greatly increases the amount of sparks rendered and may cause lag.",
  },
  skyLighting: {
    header: "Sky Lighting",
    body: 'Illuminates the background as fireworks explode. If the background looks too bright on your screen, try setting it to "Dim" or "None".',
  },
  scaleFactor: {
    header: "Scale",
    body: "Allows scaling the size of all fireworks, essentially moving you closer or farther away. For larger shell sizes, it can be convenient to decrease the scale a bit, especially on phones or tablets.",
  },
  autoLaunch: {
    header: "Auto Fire",
    body: "Launches sequences of fireworks automatically. Sit back and enjoy the show, or disable to have full control.",
  },
  finaleMode: {
    header: "Finale Mode",
    body: 'Launches intense bursts of fireworks. May cause lag. Requires "Auto Fire" to be enabled.',
  },
  hideControls: {
    header: "Hide Controls",
    body: "Hides the translucent controls along the top of the screen. Useful for screenshots, or just a more seamless experience. While hidden, you can still tap the top-right corner to re-open this menu.",
  },
  fullscreen: {
    header: "Fullscreen",
    body: "Toggles fullscreen mode.",
  },
  longExposure: {
    header: "Open Shutter",
    body: "Experimental effect that preserves long streaks of light, similar to leaving a camera shutter open.",
  },
};

const nodeKeyToHelpKey = {
  shellTypeLabel: "shellType",
  shellSizeLabel: "shellSize",
  qualityLabel: "quality",
  skyLightingLabel: "skyLighting",
  scaleFactorLabel: "scaleFactor",
  autoLaunchLabel: "autoLaunch",
  finaleModeLabel: "finaleMode",
  hideControlsLabel: "hideControls",
  fullscreenLabel: "fullscreen",
  longExposureLabel: "longExposure",
};

const appNodes = {
  stageContainer: ".stage-container",
  canvasContainer: ".canvas-container",
  controls: ".controls",
  menu: ".menu",
  menuInnerWrap: ".menu__inner-wrap",
  pauseBtn: ".pause-btn",
  pauseBtnSVG: ".pause-btn use",
  soundBtn: ".sound-btn",
  soundBtnSVG: ".sound-btn use",
  shellType: ".shell-type",
  shellTypeLabel: ".shell-type-label",
  shellSize: ".shell-size",
  shellSizeLabel: ".shell-size-label",
  quality: ".quality-ui",
  qualityLabel: ".quality-ui-label",
  skyLighting: ".sky-lighting",
  skyLightingLabel: ".sky-lighting-label",
  scaleFactor: ".scaleFactor",
  scaleFactorLabel: ".scaleFactor-label",
  autoLaunch: ".auto-launch",
  autoLaunchLabel: ".auto-launch-label",
  finaleModeFormOption: ".form-option--finale-mode",
  finaleMode: ".finale-mode",
  finaleModeLabel: ".finale-mode-label",
  hideControls: ".hide-controls",
  hideControlsLabel: ".hide-controls-label",
  fullscreenFormOption: ".form-option--fullscreen",
  fullscreen: ".fullscreen",
  fullscreenLabel: ".fullscreen-label",
  longExposure: ".long-exposure",
  longExposureLabel: ".long-exposure-label",
  helpModal: ".help-modal",
  helpModalOverlay: ".help-modal__overlay",
  helpModalHeader: ".help-modal__header",
  helpModalBody: ".help-modal__body",
  helpModalCloseBtn: ".help-modal__close-btn",
};

Object.keys(appNodes).forEach((key) => {
  appNodes[key] = document.querySelector(appNodes[key]);
});

const closeMenuBtn = document.querySelector(".close-menu-btn");
if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", () => {
    toggleMenu(false);
  });
}

if (!fullscreenEnabled()) {
  appNodes.fullscreenFormOption.classList.add("remove");
}

function renderApp(state) {
  const pauseBtnIcon = \`#icon-\${state.paused ? "play" : "pause"}\`;
  const soundBtnIcon = \`#icon-sound-\${soundEnabledSelector() ? "on" : "off"}\`;
  appNodes.pauseBtnSVG.setAttribute("href", pauseBtnIcon);
  appNodes.pauseBtnSVG.setAttribute("xlink:href", pauseBtnIcon);
  appNodes.soundBtnSVG.setAttribute("href", soundBtnIcon);
  appNodes.soundBtnSVG.setAttribute("xlink:href", soundBtnIcon);
  appNodes.controls.classList.toggle(
    "hide",
    state.menuOpen || state.config.hideControls
  );
  appNodes.canvasContainer.classList.toggle("blur", state.menuOpen);
  appNodes.canvasContainer.style.pointerEvents = state.menuOpen ? "none" : "auto";
  appNodes.menu.classList.toggle("hide", !state.menuOpen);
  appNodes.finaleModeFormOption.style.opacity = state.config.autoLaunch
    ? 1
    : 0.32;

  appNodes.quality.value = state.config.quality;
  appNodes.shellType.value = state.config.shell;
  appNodes.shellSize.value = state.config.size;
  appNodes.autoLaunch.checked = state.config.autoLaunch;
  appNodes.finaleMode.checked = state.config.finale;
  appNodes.skyLighting.value = state.config.skyLighting;
  appNodes.hideControls.checked = state.config.hideControls;
  appNodes.fullscreen.checked = state.fullscreen;
  appNodes.longExposure.checked = state.config.longExposure;
  appNodes.scaleFactor.value = state.config.scaleFactor.toFixed(2);

  appNodes.menuInnerWrap.style.opacity = state.openHelpTopic ? 0.12 : 1;
  appNodes.helpModal.classList.toggle("active", !!state.openHelpTopic);
  if (state.openHelpTopic) {
    const { header, body } = helpContent[state.openHelpTopic];
    appNodes.helpModalHeader.textContent = header;
    appNodes.helpModalBody.textContent = body;
  }
}

store.subscribe(renderApp);

function handleStateChange(state, prevState) {
  const canPlaySound = canPlaySoundSelector(state);
  const canPlaySoundPrev = canPlaySoundSelector(prevState);

  if (canPlaySound !== canPlaySoundPrev) {
    if (canPlaySound) {
      soundManager.resumeAll();
    } else {
      soundManager.pauseAll();
    }
  }
}

store.subscribe(handleStateChange);

function getConfigFromDOM() {
  return {
    quality: appNodes.quality.value,
    shell: appNodes.shellType.value,
    size: appNodes.shellSize.value,
    autoLaunch: appNodes.autoLaunch.checked,
    finale: appNodes.finaleMode.checked,
    skyLighting: appNodes.skyLighting.value,
    longExposure: appNodes.longExposure.checked,
    hideControls: appNodes.hideControls.checked,
    scaleFactor: parseFloat(appNodes.scaleFactor.value),
  };
}

const updateConfigNoEvent = () => updateConfig();
appNodes.quality.addEventListener("input", updateConfigNoEvent);
appNodes.shellType.addEventListener("input", updateConfigNoEvent);
appNodes.shellSize.addEventListener("input", updateConfigNoEvent);
appNodes.autoLaunch.addEventListener("click", () =>
  setTimeout(updateConfig, 0)
);
appNodes.finaleMode.addEventListener("click", () =>
  setTimeout(updateConfig, 0)
);
appNodes.skyLighting.addEventListener("input", updateConfigNoEvent);
appNodes.longExposure.addEventListener("click", () =>
  setTimeout(updateConfig, 0)
);
appNodes.hideControls.addEventListener("click", () =>
  setTimeout(updateConfig, 0)
);
appNodes.fullscreen.addEventListener("click", () =>
  setTimeout(toggleFullscreen, 0)
);
appNodes.scaleFactor.addEventListener("input", () => {
  updateConfig();
  handleResize();
});

Object.keys(nodeKeyToHelpKey).forEach((nodeKey) => {
  const helpKey = nodeKeyToHelpKey[nodeKey];
  appNodes[nodeKey].addEventListener("click", () => {
    store.setState({ openHelpTopic: helpKey });
  });
});

appNodes.helpModalCloseBtn.addEventListener("click", () => {
  store.setState({ openHelpTopic: null });
});

appNodes.helpModalOverlay.addEventListener("click", () => {
  store.setState({ openHelpTopic: null });
});

const COLOR_NAMES = Object.keys(COLOR);
const COLOR_CODES = COLOR_NAMES.map((colorName) => COLOR[colorName]);
const COLOR_CODES_W_INVIS = [...COLOR_CODES, INVISIBLE];
const COLOR_CODE_INDEXES = COLOR_CODES_W_INVIS.reduce((obj, code, i) => {
  obj[code] = i;
  return obj;
}, {});
const COLOR_TUPLES = {};
COLOR_CODES.forEach((hex) => {
  COLOR_TUPLES[hex] = {
    r: parseInt(hex.substr(1, 2), 16),
    g: parseInt(hex.substr(3, 2), 16),
    b: parseInt(hex.substr(5, 2), 16),
  };
});

function randomColorSimple() {
  return COLOR_CODES[(Math.random() * COLOR_CODES.length) | 0];
}

let lastColor;
function randomColor(options) {
  const notSame = options && options.notSame;
  const notColor = options && options.notColor;
  const limitWhite = options && options.limitWhite;
  let color = randomColorSimple();

  if (limitWhite && color === COLOR.White && Math.random() < 0.6) {
    color = randomColorSimple();
  }

  if (notSame) {
    while (color === lastColor) {
      color = randomColorSimple();
    }
  } else if (notColor) {
    while (color === notColor) {
      color = randomColorSimple();
    }
  }

  lastColor = color;
  return color;
}

function whiteOrGold() {
  return Math.random() < 0.5 ? COLOR.Gold : COLOR.White;
}

function makePistilColor(shellColor) {
  return shellColor === COLOR.White || shellColor === COLOR.Gold
    ? randomColor({ notColor: shellColor })
    : whiteOrGold();
}

const crysanthemumShell = (size = 1) => {
  const glitter = Math.random() < 0.25;
  const singleColor = Math.random() < 0.72;
  const color = singleColor
    ? randomColor({ limitWhite: true })
    : [randomColor(), randomColor({ notSame: true })];
  const pistil = singleColor && Math.random() < 0.42;
  const pistilColor = pistil && makePistilColor(color);
  const secondColor =
    singleColor && (Math.random() < 0.2 || color === COLOR.White)
      ? pistilColor || randomColor({ notColor: color, limitWhite: true })
      : null;
  const streamers = !pistil && color !== COLOR.White && Math.random() < 0.42;
  let starDensity = glitter ? 1.1 : 1.25;
  if (isLowQuality) starDensity *= 0.8;
  if (isHighQuality) starDensity = 1.2;
  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starLife: 900 + size * 200,
    starDensity,
    color,
    secondColor,
    glitter: glitter ? "light" : "",
    glitterColor: whiteOrGold(),
    pistil,
    pistilColor,
    streamers,
  };
};

const ghostShell = (size = 1) => {
  const shell = crysanthemumShell(size);
  shell.starLife *= 1.5;
  let ghostColor = randomColor({ notColor: COLOR.White });
  shell.streamers = true;
  const pistil = Math.random() < 0.42;
  const pistilColor = pistil && makePistilColor(ghostColor);
  shell.color = INVISIBLE;
  shell.secondColor = ghostColor;
  shell.glitter = "";
  return shell;
};

const strobeShell = (size = 1) => {
  const color = randomColor({ limitWhite: true });
  return {
    shellSize: size,
    spreadSize: 280 + size * 92,
    starLife: 1100 + size * 200,
    starLifeVariation: 0.4,
    starDensity: 1.1,
    color,
    glitter: "light",
    glitterColor: COLOR.White,
    strobe: true,
    strobeColor: Math.random() < 0.5 ? COLOR.White : null,
    pistil: Math.random() < 0.5,
    pistilColor: makePistilColor(color),
  };
};

const palmShell = (size = 1) => {
  const color = randomColor();
  const thick = Math.random() < 0.5;
  return {
    shellSize: size,
    color,
    spreadSize: 250 + size * 75,
    starDensity: thick ? 0.15 : 0.4,
    starLife: 1800 + size * 200,
    glitter: thick ? "thick" : "heavy",
  };
};

const ringShell = (size = 1) => {
  const color = randomColor();
  const pistil = Math.random() < 0.75;
  return {
    shellSize: size,
    ring: true,
    color,
    spreadSize: 300 + size * 100,
    starLife: 900 + size * 200,
    starCount: 2.2 * PI_2 * (size + 1),
    pistil,
    pistilColor: makePistilColor(color),
    glitter: !pistil ? "light" : "",
    glitterColor: color === COLOR.Gold ? COLOR.Gold : COLOR.White,
    streamers: Math.random() < 0.3,
  };
};

const crossetteShell = (size = 1) => {
  const color = randomColor({ limitWhite: true });
  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starLife: 750 + size * 160,
    starLifeVariation: 0.4,
    starDensity: 0.85,
    color,
    crossette: true,
    pistil: Math.random() < 0.5,
    pistilColor: makePistilColor(color),
  };
};

const floralShell = (size = 1) => ({
  shellSize: size,
  spreadSize: 300 + size * 120,
  starDensity: 0.12,
  starLife: 500 + size * 50,
  starLifeVariation: 0.5,
  color:
    Math.random() < 0.65
      ? "random"
      : Math.random() < 0.15
      ? randomColor()
      : [randomColor(), randomColor({ notSame: true })],
  floral: true,
});

const fallingLeavesShell = (size = 1) => ({
  shellSize: size,
  color: INVISIBLE,
  spreadSize: 300 + size * 120,
  starDensity: 0.12,
  starLife: 500 + size * 50,
  starLifeVariation: 0.5,
  glitter: "medium",
  glitterColor: COLOR.Gold,
  fallingLeaves: true,
});

const willowShell = (size = 1) => ({
  shellSize: size,
  spreadSize: 300 + size * 100,
  starDensity: 0.6,
  starLife: 3000 + size * 300,
  glitter: "willow",
  glitterColor: COLOR.Gold,
  color: INVISIBLE,
});

const crackleShell = (size = 1) => {
  const color = Math.random() < 0.75 ? COLOR.Gold : randomColor();
  return {
    shellSize: size,
    spreadSize: 380 + size * 75,
    starDensity: isLowQuality ? 0.65 : 1,
    starLife: 600 + size * 100,
    starLifeVariation: 0.32,
    glitter: "light",
    glitterColor: COLOR.Gold,
    color,
    crackle: true,
    pistil: Math.random() < 0.65,
    pistilColor: makePistilColor(color),
  };
};

const horsetailShell = (size = 1) => {
  const color = randomColor();
  return {
    shellSize: size,
    horsetail: true,
    color,
    spreadSize: 250 + size * 38,
    starDensity: 0.9,
    starLife: 2500 + size * 300,
    glitter: "medium",
    glitterColor: Math.random() < 0.5 ? whiteOrGold() : color,
    strobe: color === COLOR.White,
  };
};

function randomShellName() {
  return Math.random() < 0.5
    ? "Crysanthemum"
    : shellNames[(Math.random() * (shellNames.length - 1) + 1) | 0];
}

function randomShell(size) {
  if (IS_HEADER) return randomFastShell()(size);
  return shellTypes[randomShellName()](size);
}

function shellFromConfig(size) {
  return shellTypes[shellNameSelector()](size);
}

const fastShellBlacklist = ["Falling Leaves", "Floral", "Willow"];
function randomFastShell() {
  const isRandom = shellNameSelector() === "Random";
  let shellName = isRandom ? randomShellName() : shellNameSelector();
  if (isRandom) {
    while (fastShellBlacklist.includes(shellName)) {
      shellName = randomShellName();
    }
  }
  return shellTypes[shellName];
}

const shellTypes = {
  Random: randomShell,
  Crackle: crackleShell,
  Crossette: crossetteShell,
  Crysanthemum: crysanthemumShell,
  "Falling Leaves": fallingLeavesShell,
  Floral: floralShell,
  Ghost: ghostShell,
  "Horse Tail": horsetailShell,
  Palm: palmShell,
  Ring: ringShell,
  Strobe: strobeShell,
  Willow: willowShell,
};

const shellNames = Object.keys(shellTypes);

function init() {
  document.querySelector(".loading-init").remove();
  appNodes.stageContainer.classList.remove("remove");

  function setOptionsForSelect(node, options) {
    node.innerHTML = options.reduce(
      (acc, opt) =>
        (acc += \`<option value="\${opt.value}">\${opt.label}</option>\`),
      ""
    );
  }

  let options = "";
  shellNames.forEach(
    (opt) => (options += \`<option value="\${opt}">\${opt}</option>\`)
  );
  appNodes.shellType.innerHTML = options;

  options = "";
  ['3"', '4"', '6"', '8"', '12"', '16"'].forEach(
    (opt, i) => (options += \`<option value="\${i}">\${opt}</option>\`)
  );
  appNodes.shellSize.innerHTML = options;

  setOptionsForSelect(appNodes.quality, [
    { label: "Low", value: QUALITY_LOW },
    { label: "Normal", value: QUALITY_NORMAL },
    { label: "High", value: QUALITY_HIGH },
  ]);

  setOptionsForSelect(appNodes.skyLighting, [
    { label: "None", value: SKY_LIGHT_NONE },
    { label: "Dim", value: SKY_LIGHT_DIM },
    { label: "Normal", value: SKY_LIGHT_NORMAL },
  ]);

  setOptionsForSelect(
    appNodes.scaleFactor,
    [0.5, 0.62, 0.75, 0.9, 1.0, 1.5, 2.0].map((value) => ({
      value: value.toFixed(2),
      label: \`\${value * 100}%\`,
    }))
  );

  togglePause(false);
  renderApp(store.state);
  configDidUpdate();
}

function fitShellPositionInBoundsH(position) {
  const edge = 0.18;
  return (1 - edge * 2) * position + edge;
}

function fitShellPositionInBoundsV(position) {
  return position * 0.75;
}

function getRandomShellPositionH() {
  return fitShellPositionInBoundsH(Math.random());
}

function getRandomShellPositionV() {
  return fitShellPositionInBoundsV(Math.random());
}

function getRandomShellSize() {
  const baseSize = shellSizeSelector();
  const maxVariance = Math.min(2.5, baseSize);
  const variance = Math.random() * maxVariance;
  const size = baseSize - variance;
  const height = maxVariance === 0 ? Math.random() : 1 - variance / maxVariance;
  const centerOffset = Math.random() * (1 - height * 0.65) * 0.5;
  const x = Math.random() < 0.5 ? 0.5 - centerOffset : 0.5 + centerOffset;
  return {
    size,
    x: fitShellPositionInBoundsH(x),
    height: fitShellPositionInBoundsV(height),
  };
}

function launchShellFromConfig(event) {
  const shell = new Shell(shellFromConfig(shellSizeSelector()));
  const w = mainStage.width;
  const h = mainStage.height;

  shell.launch(
    event ? event.x / w : getRandomShellPositionH(),
    event ? 1 - event.y / h : getRandomShellPositionV()
  );
}

function seqRandomShell() {
  const size = getRandomShellSize();
  const shell = new Shell(shellFromConfig(size.size));
  shell.launch(size.x, size.height);

  let extraDelay = shell.starLife;
  if (shell.fallingLeaves) {
    extraDelay = 4600;
  }

  return 900 + Math.random() * 600 + extraDelay;
}

function seqRandomFastShell() {
  const shellType = randomFastShell();
  const size = getRandomShellSize();
  const shell = new Shell(shellType(size.size));
  shell.launch(size.x, size.height);

  let extraDelay = shell.starLife;

  return 900 + Math.random() * 600 + extraDelay;
}

function seqTwoRandom() {
  const size1 = getRandomShellSize();
  const size2 = getRandomShellSize();
  const shell1 = new Shell(shellFromConfig(size1.size));
  const shell2 = new Shell(shellFromConfig(size2.size));
  const leftOffset = Math.random() * 0.2 - 0.1;
  const rightOffset = Math.random() * 0.2 - 0.1;
  shell1.launch(0.3 + leftOffset, size1.height);
  setTimeout(() => {
    shell2.launch(0.7 + rightOffset, size2.height);
  }, 100);

  let extraDelay = Math.max(shell1.starLife, shell2.starLife);
  if (shell1.fallingLeaves || shell2.fallingLeaves) {
    extraDelay = 4600;
  }

  return 900 + Math.random() * 600 + extraDelay;
}

function seqTriple() {
  const shellType = randomFastShell();
  const baseSize = shellSizeSelector();
  const smallSize = Math.max(0, baseSize - 1.25);

  const offset = Math.random() * 0.08 - 0.04;
  const shell1 = new Shell(shellType(baseSize));
  shell1.launch(0.5 + offset, 0.7);

  const leftDelay = 1000 + Math.random() * 400;
  const rightDelay = 1000 + Math.random() * 400;

  setTimeout(() => {
    const offset = Math.random() * 0.08 - 0.04;
    const shell2 = new Shell(shellType(smallSize));
    shell2.launch(0.2 + offset, 0.1);
  }, leftDelay);

  setTimeout(() => {
    const offset = Math.random() * 0.08 - 0.04;
    const shell3 = new Shell(shellType(smallSize));
    shell3.launch(0.8 + offset, 0.1);
  }, rightDelay);

  return 4000;
}

function seqPyramid() {
  const barrageCountHalf = IS_DESKTOP ? 7 : 4;
  const largeSize = shellSizeSelector();
  const smallSize = Math.max(0, largeSize - 3);
  const randomMainShell = Math.random() < 0.78 ? crysanthemumShell : ringShell;
  const randomSpecialShell = randomShell;

  function launchShell(x, useSpecial) {
    const isRandom = shellNameSelector() === "Random";
    let shellType = isRandom
      ? useSpecial
        ? randomSpecialShell
        : randomMainShell
      : shellTypes[shellNameSelector()];
    const shell = new Shell(shellType(useSpecial ? largeSize : smallSize));
    const height = x <= 0.5 ? x / 0.5 : (1 - x) / 0.5;
    shell.launch(x, useSpecial ? 0.75 : height * 0.42);
  }

  let count = 0;
  let delay = 0;
  while (count <= barrageCountHalf) {
    if (count === barrageCountHalf) {
      setTimeout(() => {
        launchShell(0.5, true);
      }, delay);
    } else {
      const offset = (count / barrageCountHalf) * 0.5;
      const delayOffset = Math.random() * 30 + 30;
      setTimeout(() => {
        launchShell(offset, false);
      }, delay);
      setTimeout(() => {
        launchShell(1 - offset, false);
      }, delay + delayOffset);
    }

    count++;
    delay += 200;
  }

  return 3400 + barrageCountHalf * 250;
}

function seqSmallBarrage() {
  seqSmallBarrage.lastCalled = Date.now();
  const barrageCount = IS_DESKTOP ? 11 : 5;
  const specialIndex = IS_DESKTOP ? 3 : 1;
  const shellSize = Math.max(0, shellSizeSelector() - 2);
  const randomMainShell = Math.random() < 0.78 ? crysanthemumShell : ringShell;
  const randomSpecialShell = randomFastShell();

  function launchShell(x, useSpecial) {
    const isRandom = shellNameSelector() === "Random";
    let shellType = isRandom
      ? useSpecial
        ? randomSpecialShell
        : randomMainShell
      : shellTypes[shellNameSelector()];
    const shell = new Shell(shellType(shellSize));
    const height = (Math.cos(x * 5 * Math.PI + PI_HALF) + 1) / 2;
    shell.launch(x, height * 0.75);
  }

  let count = 0;
  let delay = 0;
  while (count < barrageCount) {
    if (count === 0) {
      launchShell(0.5, false);
      count += 1;
    } else {
      const offset = (count + 1) / barrageCount / 2;
      const delayOffset = Math.random() * 30 + 30;
      const useSpecial = count === specialIndex;
      setTimeout(() => {
        launchShell(0.5 + offset, useSpecial);
      }, delay);
      setTimeout(() => {
        launchShell(0.5 - offset, useSpecial);
      }, delay + delayOffset);
      count += 2;
    }
    delay += 200;
  }

  return 3400 + barrageCount * 120;
}
seqSmallBarrage.cooldown = 15000;
seqSmallBarrage.lastCalled = Date.now();

const sequences = [
  seqRandomShell,
  seqTwoRandom,
  seqTriple,
  seqPyramid,
  seqSmallBarrage,
];

let isFirstSeq = true;
const finaleCount = 32;
let currentFinaleCount = 0;
function startSequence() {
  if (isFirstSeq) {
    isFirstSeq = false;
    if (IS_HEADER) {
      return seqTwoRandom();
    } else {
      const shell = new Shell(crysanthemumShell(shellSizeSelector()));
      shell.launch(0.5, 0.5);
      return 2400;
    }
  }

  if (finaleSelector()) {
    seqRandomFastShell();
    if (currentFinaleCount < finaleCount) {
      currentFinaleCount++;
      return 170;
    } else {
      currentFinaleCount = 0;
      return 6000;
    }
  }

  const rand = Math.random();

  if (
    rand < 0.08 &&
    Date.now() - seqSmallBarrage.lastCalled > seqSmallBarrage.cooldown
  ) {
    return seqSmallBarrage();
  }

  if (rand < 0.1) {
    return seqPyramid();
  }

  if (rand < 0.6 && !IS_HEADER) {
    return seqRandomShell();
  } else if (rand < 0.8) {
    return seqTwoRandom();
  } else if (rand < 1) {
    return seqTriple();
  }
}

let activePointerCount = 0;
let isUpdatingSpeed = false;

function handlePointerStart(event) {
  activePointerCount++;
  const btnSize = 50;

  if (event.y < btnSize) {
    if (event.x < btnSize) {
      togglePause();
      return;
    }
    if (
      event.x > mainStage.width / 2 - btnSize / 2 &&
      event.x < mainStage.width / 2 + btnSize / 2
    ) {
      toggleSound();
      return;
    }
    if (event.x > mainStage.width - btnSize) {
      toggleMenu();
      return;
    }
  }

  if (!isRunning()) return;

  if (updateSpeedFromEvent(event)) {
    isUpdatingSpeed = true;
  } else if (event.onCanvas) {
    launchShellFromConfig(event);
  }
}

function handlePointerEnd(event) {
  activePointerCount--;
  isUpdatingSpeed = false;
}

function handlePointerMove(event) {
  if (!isRunning()) return;

  if (isUpdatingSpeed) {
    updateSpeedFromEvent(event);
  }
}

function handleKeydown(event) {
  if (event.keyCode === 80) {
    togglePause();
  } else if (event.keyCode === 79) {
    toggleMenu();
  } else if (event.keyCode === 27) {
    toggleMenu(false);
  }
}

mainStage.addEventListener("pointerstart", handlePointerStart);
mainStage.addEventListener("pointerend", handlePointerEnd);
mainStage.addEventListener("pointermove", handlePointerMove);
window.addEventListener("keydown", handleKeydown);

function handleResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const containerW = Math.min(w, MAX_WIDTH);
  const containerH = w <= 420 ? h : Math.min(h, MAX_HEIGHT);
  appNodes.stageContainer.style.width = containerW + "px";
  appNodes.stageContainer.style.height = containerH + "px";
  stages.forEach((stage) => stage.resize(containerW, containerH));
  const scaleFactor = scaleFactorSelector();
  stageW = containerW / scaleFactor;
  stageH = containerH / scaleFactor;
}

handleResize();

window.addEventListener("resize", handleResize);

let currentFrame = 0;
let speedBarOpacity = 0;
let autoLaunchTime = 0;

function updateSpeedFromEvent(event) {
  if (isUpdatingSpeed || event.y >= mainStage.height - 44) {
    const edge = 16;
    const newSpeed = (event.x - edge) / (mainStage.width - edge * 2);
    simSpeed = Math.min(Math.max(newSpeed, 0), 1);
    speedBarOpacity = 1;
    return true;
  }
  return false;
}

function updateGlobals(timeStep, lag) {
  currentFrame++;

  if (!isUpdatingSpeed) {
    speedBarOpacity -= lag / 30;
    if (speedBarOpacity < 0) {
      speedBarOpacity = 0;
    }
  }

  if (store.state.config.autoLaunch) {
    autoLaunchTime -= timeStep;
    if (autoLaunchTime <= 0) {
      autoLaunchTime = startSequence() * 1.25;
    }
  }
}

function update(frameTime, lag) {
  if (!isRunning()) return;

  const width = stageW;
  const height = stageH;
  const timeStep = frameTime * simSpeed;
  const speed = simSpeed * lag;

  updateGlobals(timeStep, lag);

  const starDrag = 1 - (1 - Star.airDrag) * speed;
  const starDragHeavy = 1 - (1 - Star.airDragHeavy) * speed;
  const sparkDrag = 1 - (1 - Spark.airDrag) * speed;
  const gAcc = (timeStep / 1000) * GRAVITY;
  COLOR_CODES_W_INVIS.forEach((color) => {
    const stars = Star.active[color];
    for (let i = stars.length - 1; i >= 0; i = i - 1) {
      const star = stars[i];
      if (star.updateFrame === currentFrame) {
        continue;
      }
      star.updateFrame = currentFrame;

      star.life -= timeStep;
      if (star.life <= 0) {
        stars.splice(i, 1);
        Star.returnInstance(star);
      } else {
        const burnRate = Math.pow(star.life / star.fullLife, 0.5);
        const burnRateInverse = 1 - burnRate;

        star.prevX = star.x;
        star.prevY = star.y;
        star.x += star.speedX * speed;
        star.y += star.speedY * speed;
        if (!star.heavy) {
          star.speedX *= starDrag;
          star.speedY *= starDrag;
        } else {
          star.speedX *= starDragHeavy;
          star.speedY *= starDragHeavy;
        }
        star.speedY += gAcc;

        if (star.spinRadius) {
          star.spinAngle += star.spinSpeed * speed;
          star.x += Math.sin(star.spinAngle) * star.spinRadius * speed;
          star.y += Math.cos(star.spinAngle) * star.spinRadius * speed;
        }

        if (star.sparkFreq) {
          star.sparkTimer -= timeStep;
          while (star.sparkTimer < 0) {
            star.sparkTimer +=
              star.sparkFreq * 0.75 + star.sparkFreq * burnRateInverse * 4;
            Spark.add(
              star.x,
              star.y,
              star.sparkColor,
              Math.random() * PI_2,
              Math.random() * star.sparkSpeed * burnRate,
              star.sparkLife * 0.8 +
                Math.random() * star.sparkLifeVariation * star.sparkLife
            );
          }
        }

        if (star.life < star.transitionTime) {
          if (star.secondColor && !star.colorChanged) {
            star.colorChanged = true;
            star.color = star.secondColor;
            stars.splice(i, 1);
            Star.active[star.secondColor].push(star);
            if (star.secondColor === INVISIBLE) {
              star.sparkFreq = 0;
            }
          }

          if (star.strobe) {
            star.visible = Math.floor(star.life / star.strobeFreq) % 3 === 0;
          }
        }
      }
    }

    const sparks = Spark.active[color];
    for (let i = sparks.length - 1; i >= 0; i = i - 1) {
      const spark = sparks[i];
      spark.life -= timeStep;
      if (spark.life <= 0) {
        sparks.splice(i, 1);
        Spark.returnInstance(spark);
      } else {
        spark.prevX = spark.x;
        spark.prevY = spark.y;
        spark.x += spark.speedX * speed;
        spark.y += spark.speedY * speed;
        spark.speedX *= sparkDrag;
        spark.speedY *= sparkDrag;
        spark.speedY += gAcc;
      }
    }
  });

  render(speed);
}

function render(speed) {
  const { dpr } = mainStage;
  const width = stageW;
  const height = stageH;
  const trailsCtx = trailsStage.ctx;
  const mainCtx = mainStage.ctx;

  if (skyLightingSelector() !== SKY_LIGHT_NONE) {
    colorSky(speed);
  }

  const scaleFactor = scaleFactorSelector();
  trailsCtx.scale(dpr * scaleFactor, dpr * scaleFactor);
  mainCtx.scale(dpr * scaleFactor, dpr * scaleFactor);

  trailsCtx.globalCompositeOperation = "source-over";
  trailsCtx.fillStyle = \`rgba(0, 0, 0, \${
    store.state.config.longExposure ? 0.0025 : 0.175 * speed
  })\`;
  trailsCtx.fillRect(0, 0, width, height);

  mainCtx.clearRect(0, 0, width, height);

  while (BurstFlash.active.length) {
    const bf = BurstFlash.active.pop();

    const burstGradient = trailsCtx.createRadialGradient(
      bf.x,
      bf.y,
      0,
      bf.x,
      bf.y,
      bf.radius
    );
    burstGradient.addColorStop(0.024, "rgba(255, 255, 255, 1)");
    burstGradient.addColorStop(0.125, "rgba(255, 160, 20, 0.2)");
    burstGradient.addColorStop(0.32, "rgba(255, 140, 20, 0.11)");
    burstGradient.addColorStop(1, "rgba(255, 120, 20, 0)");
    trailsCtx.fillStyle = burstGradient;
    trailsCtx.fillRect(
      bf.x - bf.radius,
      bf.y - bf.radius,
      bf.radius * 2,
      bf.radius * 2
    );

    BurstFlash.returnInstance(bf);
  }

  trailsCtx.globalCompositeOperation = "lighten";

  trailsCtx.lineWidth = Star.drawWidth;
  trailsCtx.lineCap = isLowQuality ? "square" : "round";
  mainCtx.strokeStyle = "#fff";
  mainCtx.lineWidth = 1;
  mainCtx.beginPath();
  COLOR_CODES.forEach((color) => {
    const stars = Star.active[color];
    trailsCtx.strokeStyle = color;
    trailsCtx.beginPath();
    stars.forEach((star) => {
      if (star.visible) {
        trailsCtx.moveTo(star.x, star.y);
        trailsCtx.lineTo(star.prevX, star.prevY);
        mainCtx.moveTo(star.x, star.y);
        mainCtx.lineTo(star.x - star.speedX * 1.6, star.y - star.speedY * 1.6);
      }
    });
    trailsCtx.stroke();
  });
  mainCtx.stroke();

  trailsCtx.lineWidth = Spark.drawWidth;
  trailsCtx.lineCap = "butt";
  COLOR_CODES.forEach((color) => {
    const sparks = Spark.active[color];
    trailsCtx.strokeStyle = color;
    trailsCtx.beginPath();
    sparks.forEach((spark) => {
      trailsCtx.moveTo(spark.x, spark.y);
      trailsCtx.lineTo(spark.prevX, spark.prevY);
    });
    trailsCtx.stroke();
  });

  if (speedBarOpacity) {
    const speedBarHeight = 6;
    mainCtx.globalAlpha = speedBarOpacity;
    mainCtx.fillStyle = COLOR.Blue;
    mainCtx.fillRect(0, height - speedBarHeight, width * simSpeed, speedBarHeight);
    mainCtx.globalAlpha = 1;
  }

  trailsCtx.setTransform(1, 0, 0, 1, 0, 0);
  mainCtx.setTransform(1, 0, 0, 1, 0, 0);
}

const currentSkyColor = { r: 0, g: 0, b: 0 };
const targetSkyColor = { r: 0, g: 0, b: 0 };
function colorSky(speed) {
  const maxSkySaturation = skyLightingSelector() * 15;
  const maxStarCount = 500;
  let totalStarCount = 0;
  targetSkyColor.r = 0;
  targetSkyColor.g = 0;
  targetSkyColor.b = 0;
  COLOR_CODES.forEach((color) => {
    const tuple = COLOR_TUPLES[color];
    const count = Star.active[color].length;
    totalStarCount += count;
    targetSkyColor.r += tuple.r * count;
    targetSkyColor.g += tuple.g * count;
    targetSkyColor.b += tuple.b * count;
  });

  const intensity = Math.pow(Math.min(1, totalStarCount / maxStarCount), 0.3);
  const maxColorComponent = Math.max(
    1,
    targetSkyColor.r,
    targetSkyColor.g,
    targetSkyColor.b
  );

  targetSkyColor.r =
    (targetSkyColor.r / maxColorComponent) * maxSkySaturation * intensity;
  targetSkyColor.g =
    (targetSkyColor.g / maxColorComponent) * maxSkySaturation * intensity;
  targetSkyColor.b =
    (targetSkyColor.b / maxColorComponent) * maxSkySaturation * intensity;

  const colorChange = 10;
  currentSkyColor.r += ((targetSkyColor.r - currentSkyColor.r) / colorChange) * speed;
  currentSkyColor.g += ((targetSkyColor.g - currentSkyColor.g) / colorChange) * speed;
  currentSkyColor.b += ((targetSkyColor.b - currentSkyColor.b) / colorChange) * speed;

  appNodes.canvasContainer.style.backgroundColor = \`rgb(\${
    currentSkyColor.r | 0
  }, \${currentSkyColor.g | 0}, \${currentSkyColor.b | 0})\`;
}

mainStage.addEventListener("ticker", update);

function createParticleArc(start, arcLength, count, randomness, particleFactory) {
  const angleDelta = arcLength / count;
  const end = start + arcLength - angleDelta * 0.5;
  if (end > start) {
    for (let angle = start; angle < end; angle = angle + angleDelta) {
      particleFactory(angle + Math.random() * angleDelta * randomness);
    }
  } else {
    for (let angle = start; angle > end; angle = angle + angleDelta) {
      particleFactory(angle + Math.random() * angleDelta * randomness);
    }
  }
}

function createBurst(count, particleFactory, startAngle = 0, arcLength = PI_2) {
  const R = 0.5 * Math.sqrt(count / Math.PI);
  const C = 2 * R * Math.PI;
  const C_HALF = C / 2;
  for (let i = 0; i <= C_HALF; i++) {
    const ringAngle = (i / C_HALF) * PI_HALF;
    const ringSize = Math.cos(ringAngle);
    const partsPerFullRing = C * ringSize;
    const partsPerArc = partsPerFullRing * (arcLength / PI_2);

    const angleInc = PI_2 / partsPerFullRing;
    const angleOffset = Math.random() * angleInc + startAngle;
    const maxRandomAngleOffset = angleInc * 0.33;

    for (let i = 0; i < partsPerArc; i++) {
      const randomAngleOffset = Math.random() * maxRandomAngleOffset;
      let angle = angleInc * i + angleOffset + randomAngleOffset;
      particleFactory(angle, ringSize);
    }
  }
}

function crossetteEffect(star) {
  const startAngle = Math.random() * PI_HALF;
  createParticleArc(startAngle, PI_2, 4, 0.5, (angle) => {
    Star.add(star.x, star.y, star.color, angle, Math.random() * 0.6 + 0.75, 600);
  });
}

function floralEffect(star) {
  const count = 12 + 6 * quality;
  createBurst(count, (angle, speedMult) => {
    Star.add(
      star.x,
      star.y,
      star.color,
      angle,
      speedMult * 2.4,
      1000 + Math.random() * 300,
      star.speedX,
      star.speedY
    );
  });
  BurstFlash.add(star.x, star.y, 46);
  soundManager.playSound("burstSmall");
}

function fallingLeavesEffect(star) {
  createBurst(7, (angle, speedMult) => {
    const newStar = Star.add(
      star.x,
      star.y,
      INVISIBLE,
      angle,
      speedMult * 2.4,
      2400 + Math.random() * 600,
      star.speedX,
      star.speedY
    );

    newStar.sparkColor = COLOR.Gold;
    newStar.sparkFreq = 144 / quality;
    newStar.sparkSpeed = 0.28;
    newStar.sparkLife = 750;
    newStar.sparkLifeVariation = 3.2;
  });
  BurstFlash.add(star.x, star.y, 46);
  soundManager.playSound("burstSmall");
}

function crackleEffect(star) {
  const count = isHighQuality ? 32 : 16;
  createParticleArc(0, PI_2, count, 1.8, (angle) => {
    Spark.add(
      star.x,
      star.y,
      COLOR.Gold,
      angle,
      Math.pow(Math.random(), 0.45) * 2.4,
      300 + Math.random() * 200
    );
  });
}

class Shell {
  constructor(options) {
    Object.assign(this, options);
    this.starLifeVariation = options.starLifeVariation || 0.125;
    this.color = options.color || randomColor();
    this.glitterColor = options.glitterColor || this.color;

    if (!this.starCount) {
      const density = options.starDensity || 1;
      const scaledSize = this.spreadSize / 54;
      this.starCount = Math.max(6, scaledSize * scaledSize * density);
    }
  }

  launch(position, launchHeight) {
    const width = stageW;
    const height = stageH;
    const hpad = 60;
    const vpad = 50;
    const minHeightPercent = 0.45;
    const minHeight = height - height * minHeightPercent;

    const launchX = position * (width - hpad * 2) + hpad;
    const launchY = height;
    const burstY = minHeight - launchHeight * (minHeight - vpad);

    const launchDistance = launchY - burstY;
    const launchVelocity = Math.pow(launchDistance * 0.04, 0.64);

    const comet = (this.comet = Star.add(
      launchX,
      launchY,
      typeof this.color === "string" && this.color !== "random"
        ? this.color
        : COLOR.White,
      Math.PI,
      launchVelocity * (this.horsetail ? 1.2 : 1),
      launchVelocity * (this.horsetail ? 100 : 400)
    ));

    comet.heavy = true;
    comet.spinRadius = MyMath.random(0.32, 0.85);
    comet.sparkFreq = 32 / quality;
    if (isHighQuality) comet.sparkFreq = 8;
    comet.sparkLife = 320;
    comet.sparkLifeVariation = 3;
    if (this.glitter === "willow" || this.fallingLeaves) {
      comet.sparkFreq = 20 / quality;
      comet.sparkSpeed = 0.5;
      comet.sparkLife = 500;
    }
    if (this.color === INVISIBLE) {
      comet.sparkColor = COLOR.Gold;
    }

    if (Math.random() > 0.4 && !this.horsetail) {
      comet.secondColor = INVISIBLE;
      comet.transitionTime = Math.pow(Math.random(), 1.5) * 700 + 500;
    }

    comet.onDeath = (comet) => this.burst(comet.x, comet.y);

    soundManager.playSound("lift");
  }

  burst(x, y) {
    const speed = this.spreadSize / 96;

    let color, onDeath, sparkFreq, sparkSpeed, sparkLife;
    let sparkLifeVariation = 0.25;
    let playedDeathSound = false;

    if (this.crossette)
      onDeath = (star) => {
        if (!playedDeathSound) {
          soundManager.playSound("crackleSmall");
          playedDeathSound = true;
        }
        crossetteEffect(star);
      };
    if (this.crackle)
      onDeath = (star) => {
        if (!playedDeathSound) {
          soundManager.playSound("crackle");
          playedDeathSound = true;
        }
        crackleEffect(star);
      };
    if (this.floral) onDeath = floralEffect;
    if (this.fallingLeaves) onDeath = fallingLeavesEffect;

    if (this.glitter === "light") {
      sparkFreq = 400;
      sparkSpeed = 0.3;
      sparkLife = 300;
      sparkLifeVariation = 2;
    } else if (this.glitter === "medium") {
      sparkFreq = 200;
      sparkSpeed = 0.44;
      sparkLife = 700;
      sparkLifeVariation = 2;
    } else if (this.glitter === "heavy") {
      sparkFreq = 80;
      sparkSpeed = 0.8;
      sparkLife = 1400;
      sparkLifeVariation = 2;
    } else if (this.glitter === "thick") {
      sparkFreq = 16;
      sparkSpeed = isHighQuality ? 1.65 : 1.5;
      sparkLife = 1400;
      sparkLifeVariation = 3;
    } else if (this.glitter === "streamer") {
      sparkFreq = 32;
      sparkSpeed = 1.05;
      sparkLife = 620;
      sparkLifeVariation = 2;
    } else if (this.glitter === "willow") {
      sparkFreq = 120;
      sparkSpeed = 0.34;
      sparkLife = 1400;
      sparkLifeVariation = 3.8;
    }

    sparkFreq = sparkFreq / quality;

    const starFactory = (angle, speedMult) => {
      const standardInitialSpeed = this.spreadSize / 1800;

      const star = Star.add(
        x,
        y,
        color || randomColor(),
        angle,
        speedMult * speed,
        this.starLife + Math.random() * this.starLife * this.starLifeVariation,
        this.horsetail ? this.comet && this.comet.speedX : 0,
        this.horsetail ? this.comet && this.comet.speedY : -standardInitialSpeed
      );

      if (this.secondColor) {
        star.transitionTime = this.starLife * (Math.random() * 0.05 + 0.32);
        star.secondColor = this.secondColor;
      }

      if (this.strobe) {
        star.transitionTime = this.starLife * (Math.random() * 0.08 + 0.46);
        star.strobe = true;
        star.strobeFreq = Math.random() * 20 + 40;
        if (this.strobeColor) {
          star.secondColor = this.strobeColor;
        }
      }

      star.onDeath = onDeath;

      if (this.glitter) {
        star.sparkFreq = sparkFreq;
        star.sparkSpeed = sparkSpeed;
        star.sparkLife = sparkLife;
        star.sparkLifeVariation = sparkLifeVariation;
        star.sparkColor = this.glitterColor;
        star.sparkTimer = Math.random() * star.sparkFreq;
      }
    };

    if (typeof this.color === "string") {
      if (this.color === "random") {
        color = null;
      } else {
        color = this.color;
      }

      if (this.ring) {
        const ringStartAngle = Math.random() * Math.PI;
        const ringSquash = Math.pow(Math.random(), 2) * 0.85 + 0.15;

        createParticleArc(0, PI_2, this.starCount, 0, (angle) => {
          const initSpeedX = Math.sin(angle) * speed * ringSquash;
          const initSpeedY = Math.cos(angle) * speed;
          const newSpeed = MyMath.pointDist(0, 0, initSpeedX, initSpeedY);
          const newAngle =
            MyMath.pointAngle(0, 0, initSpeedX, initSpeedY) + ringStartAngle;
          const star = Star.add(
            x,
            y,
            color,
            newAngle,
            newSpeed,
            this.starLife + Math.random() * this.starLife * this.starLifeVariation
          );

          if (this.glitter) {
            star.sparkFreq = sparkFreq;
            star.sparkSpeed = sparkSpeed;
            star.sparkLife = sparkLife;
            star.sparkLifeVariation = sparkLifeVariation;
            star.sparkColor = this.glitterColor;
            star.sparkTimer = Math.random() * star.sparkFreq;
          }
        });
      } else {
        createBurst(this.starCount, starFactory);
      }
    } else if (Array.isArray(this.color)) {
      if (Math.random() < 0.5) {
        const start = Math.random() * Math.PI;
        const start2 = start + Math.PI;
        const arc = Math.PI;
        color = this.color[0];
        createBurst(this.starCount, starFactory, start, arc);
        color = this.color[1];
        createBurst(this.starCount, starFactory, start2, arc);
      } else {
        color = this.color[0];
        createBurst(this.starCount / 2, starFactory);
        color = this.color[1];
        createBurst(this.starCount / 2, starFactory);
      }
    } else {
      throw new Error(
        "Invalid shell color. Expected string or array of strings, but got: " +
          this.color
      );
    }

    if (this.pistil) {
      const innerShell = new Shell({
        spreadSize: this.spreadSize * 0.5,
        starLife: this.starLife * 0.6,
        starLifeVariation: this.starLifeVariation,
        starDensity: 1.4,
        color: this.pistilColor,
        glitter: "light",
        glitterColor: this.pistilColor === COLOR.Gold ? COLOR.Gold : COLOR.White,
      });
      innerShell.burst(x, y);
    }

    if (this.streamers) {
      const innerShell = new Shell({
        spreadSize: this.spreadSize * 0.9,
        starLife: this.starLife * 0.8,
        starLifeVariation: this.starLifeVariation,
        starCount: Math.floor(Math.max(6, this.spreadSize / 45)),
        color: COLOR.White,
        glitter: "streamer",
      });
      innerShell.burst(x, y);
    }
    BurstFlash.add(x, y, this.spreadSize / 4);
    if (this.comet) {
      const maxDiff = 2;
      const sizeDifferenceFromMaxSize = Math.min(
        maxDiff,
        shellSizeSelector() - this.shellSize
      );
      const soundScale = (1 - sizeDifferenceFromMaxSize / maxDiff) * 0.3 + 0.7;
      soundManager.playSound("burst", soundScale);
    }
  }
}

const BurstFlash = {
  active: [],
  _pool: [],
  _new() {
    return {};
  },
  add(x, y, radius) {
    const instance = this._pool.pop() || this._new();
    instance.x = x;
    instance.y = y;
    instance.radius = radius;
    this.active.push(instance);
    return instance;
  },
  returnInstance(instance) {
    this._pool.push(instance);
  },
};

function createParticleCollection() {
  const collection = {};
  COLOR_CODES_W_INVIS.forEach((color) => {
    collection[color] = [];
  });
  return collection;
}

const Star = {
  drawWidth: 3,
  airDrag: 0.98,
  airDragHeavy: 0.992,
  active: createParticleCollection(),
  _pool: [],
  _new() {
    return {};
  },
  add(x, y, color, angle, speed, life, speedOffX, speedOffY) {
    const instance = this._pool.pop() || this._new();
    instance.visible = true;
    instance.heavy = false;
    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color;
    instance.speedX = Math.sin(angle) * speed + (speedOffX || 0);
    instance.speedY = Math.cos(angle) * speed + (speedOffY || 0);
    instance.life = life;
    instance.fullLife = life;
    instance.spinAngle = Math.random() * PI_2;
    instance.spinSpeed = 0.8;
    instance.spinRadius = 0;
    instance.sparkFreq = 0;
    instance.sparkSpeed = 1;
    instance.sparkTimer = 0;
    instance.sparkColor = color;
    instance.sparkLife = 750;
    instance.sparkLifeVariation = 0.25;
    instance.strobe = false;
    this.active[color].push(instance);
    return instance;
  },
  returnInstance(instance) {
    instance.onDeath && instance.onDeath(instance);
    instance.onDeath = null;
    instance.secondColor = null;
    instance.transitionTime = 0;
    instance.colorChanged = false;
    this._pool.push(instance);
  },
};

const Spark = {
  drawWidth: 0,
  airDrag: 0.9,
  active: createParticleCollection(),
  _pool: [],
  _new() {
    return {};
  },
  add(x, y, color, angle, speed, life) {
    const instance = this._pool.pop() || this._new();
    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color;
    instance.speedX = Math.sin(angle) * speed;
    instance.speedY = Math.cos(angle) * speed;
    instance.life = life;
    this.active[color].push(instance);
    return instance;
  },
  returnInstance(instance) {
    this._pool.push(instance);
  },
};

const soundManager = {
  baseURL: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/",
  ctx: new (window.AudioContext || window.webkitAudioContext)(),
  sources: {
    lift: {
      volume: 1,
      playbackRateMin: 0.85,
      playbackRateMax: 0.95,
      fileNames: ["lift1.mp3", "lift2.mp3", "lift3.mp3"],
    },
    burst: {
      volume: 1,
      playbackRateMin: 0.8,
      playbackRateMax: 0.9,
      fileNames: ["burst1.mp3", "burst2.mp3"],
    },
    burstSmall: {
      volume: 0.25,
      playbackRateMin: 0.8,
      playbackRateMax: 1,
      fileNames: ["burst-sm-1.mp3", "burst-sm-2.mp3"],
    },
    crackle: {
      volume: 0.2,
      playbackRateMin: 1,
      playbackRateMax: 1,
      fileNames: ["crackle1.mp3"],
    },
    crackleSmall: {
      volume: 0.3,
      playbackRateMin: 1,
      playbackRateMax: 1,
      fileNames: ["crackle-sm-1.mp3"],
    },
  },

  preload() {
    const allFilePromises = [];

    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      const customError = new Error(response.statusText);
      customError.response = response;
      throw customError;
    }

    const types = Object.keys(this.sources);
    types.forEach((type) => {
      const source = this.sources[type];
      const { fileNames } = source;
      const filePromises = [];
      fileNames.forEach((fileName) => {
        const fileURL = this.baseURL + fileName;
        const promise = fetch(fileURL)
          .then(checkStatus)
          .then((response) => response.arrayBuffer())
          .then(
            (data) =>
              new Promise((resolve) => {
                this.ctx.decodeAudioData(data, resolve);
              })
          );

        filePromises.push(promise);
        allFilePromises.push(promise);
      });

      Promise.all(filePromises).then((buffers) => {
        source.buffers = buffers;
      });
    });

    return Promise.all(allFilePromises);
  },

  pauseAll() {
    this.ctx.suspend();
  },

  resumeAll() {
    this.playSound("lift", 0);
    setTimeout(() => {
      this.ctx.resume();
    }, 250);
  },

  _lastSmallBurstTime: 0,

  playSound(type, scale = 1) {
    scale = MyMath.clamp(scale, 0, 1);

    if (!canPlaySoundSelector() || simSpeed < 0.95) {
      return;
    }

    if (type === "burstSmall") {
      const now = Date.now();
      if (now - this._lastSmallBurstTime < 20) {
        return;
      }
      this._lastSmallBurstTime = now;
    }

    const source = this.sources[type];

    if (!source) {
      throw new Error(\`Sound of type "\${type}" doesn't exist.\`);
    }

    const initialVolume = source.volume;
    const initialPlaybackRate = MyMath.random(
      source.playbackRateMin,
      source.playbackRateMax
    );

    const scaledVolume = initialVolume * scale;
    const scaledPlaybackRate = initialPlaybackRate * (2 - scale);

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = scaledVolume;

    const buffer = MyMath.randomChoice(source.buffers);
    const bufferSource = this.ctx.createBufferSource();
    bufferSource.playbackRate.value = scaledPlaybackRate;
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    bufferSource.start(0);
  },
};

function setLoadingStatus(status) {
  document.querySelector(".loading-init__status").textContent = status;
}

if (IS_HEADER) {
  init();
} else {
  setLoadingStatus("Lighting Fuses");
  setTimeout(() => {
    soundManager.preload().then(init, (reason) => {
      init();
      return Promise.reject(reason);
    });
  }, 0);
}
`;
            document.body.appendChild(main);
            injectedMainScript = main;
        })();

        return () => {
            cancelled = true;
            if (injectedMainScript && injectedMainScript.parentNode) {
                injectedMainScript.parentNode.removeChild(injectedMainScript);
            }
        };
    }, []);

    return (<div ref={rootRef} className="firework-root">
            <div style={{height: 0, width: 0, position: "absolute", visibility: "hidden"}}>
                <svg xmlns="http://www.w3.org/2000/svg">
                    <symbol id="icon-play" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </symbol>
                    <symbol id="icon-pause" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </symbol>
                    <symbol id="icon-close" viewBox="0 0 24 24">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        />
                    </symbol>
                    <symbol id="icon-settings" viewBox="0 0 24 24">
                        <path
                            d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
                        />
                    </symbol>
                    <symbol id="icon-sound-on" viewBox="0 0 24 24">
                        <path
                            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                        />
                    </symbol>
                    <symbol id="icon-sound-off" viewBox="0 0 24 24">
                        <path
                            d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                        />
                    </symbol>
                </svg>
            </div>

            <div className="container">
                <div className="loading-init">
                    <div className="loading-init__header">Loading</div>
                    <div className="loading-init__status">Assembling Shells</div>
                </div>

                <div className="stage-container remove">
                    <div className="canvas-container">
                        <canvas id="trails-canvas"></canvas>
                        <canvas id="main-canvas"></canvas>
                    </div>

                    <div className="controls">
                        <div className="btn pause-btn">
                            <svg fill="white" width="24" height="24">
                                <use href="#icon-pause" xlinkHref="#icon-pause"></use>
                            </svg>
                        </div>
                        <div className="btn sound-btn">
                            <svg fill="white" width="24" height="24">
                                <use href="#icon-sound-off" xlinkHref="#icon-sound-off"></use>
                            </svg>
                        </div>
                        <div className="btn settings-btn">
                            <svg fill="white" width="24" height="24">
                                <use href="#icon-settings" xlinkHref="#icon-settings"></use>
                            </svg>
                        </div>
                    </div>

                    <div className="menu hide">
                        <div className="menu__inner-wrap">
                            <div className="btn btn--bright close-menu-btn">
                                <svg fill="white" width="24" height="24">
                                    <use href="#icon-close" xlinkHref="#icon-close"></use>
                                </svg>
                            </div>
                            <div className="menu__header">Settings</div>
                            <div className="menu__subheader">For more info, click any label.</div>
                            <form>
                                <div className="form-option form-option--select">
                                    <label className="shell-type-label">Shell Type</label>
                                    <select className="shell-type"></select>
                                </div>
                                <div className="form-option form-option--select">
                                    <label className="shell-size-label">Shell Size</label>
                                    <select className="shell-size"></select>
                                </div>
                                <div className="form-option form-option--select">
                                    <label className="quality-ui-label">Quality</label>
                                    <select className="quality-ui"></select>
                                </div>
                                <div className="form-option form-option--select">
                                    <label className="sky-lighting-label">Sky Lighting</label>
                                    <select className="sky-lighting"></select>
                                </div>
                                <div className="form-option form-option--select">
                                    <label className="scaleFactor-label">Scale</label>
                                    <select className="scaleFactor"></select>
                                </div>
                                <div className="form-option form-option--checkbox">
                                    <label className="auto-launch-label">Auto Fire</label>
                                    <input className="auto-launch" type="checkbox"/>
                                </div>
                                <div className="form-option form-option--checkbox form-option--finale-mode">
                                    <label className="finale-mode-label">Finale Mode</label>
                                    <input className="finale-mode" type="checkbox"/>
                                </div>
                                <div className="form-option form-option--checkbox">
                                    <label className="hide-controls-label">Hide Controls</label>
                                    <input className="hide-controls" type="checkbox"/>
                                </div>
                                <div className="form-option form-option--checkbox form-option--fullscreen">
                                    <label className="fullscreen-label">Fullscreen</label>
                                    <input className="fullscreen" type="checkbox"/>
                                </div>
                                <div className="form-option form-option--checkbox">
                                    <label className="long-exposure-label">Open Shutter</label>
                                    <input className="long-exposure" type="checkbox"/>
                                </div>
                            </form>

                            <div className="credits">
                                Passionately built by{" "}
                                <a href="https://cmiller.tech/" target="_blank" rel="noreferrer">
                                    Caleb Miller
                                </a>
                                .
                            </div>
                        </div>
                    </div>
                </div>

                <div className="help-modal">
                    <div className="help-modal__overlay"></div>
                    <div className="help-modal__dialog">
                        <div className="help-modal__header"></div>
                        <div className="help-modal__body"></div>
                        <button type="button" className="help-modal__close-btn">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>);
}