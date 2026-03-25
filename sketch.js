const GAME_TITLE = "GALAXINKO";
const GAME_VERSION = "v13.3";

let engine;
let world;
let balls = [];
let pegs = [];
let zones = [];
let walls = [];
let explosions = [];
let leaderboard = {};

let timer = 40;
let resultsTimer = 10;
let lastTick = 0;
let waitStartTime = 0;
let totalBallsFired = 0;
let roundCount = 1;

let gameState = "PLAYING";
let libraryLoaded = false;
let winnerColor;
let flashEffect = 0;
let shakeAmount = 0;

let currentDestination = "";
let currentGravity = 0.6;
let currentBounce = 80;
let spawnPerEvent = 1;
let currentShipChance = 30;

let spawnQueue = [];
let portals = [];
let floatingTexts = [];
let shockwaves = [];
let joinPopupQueue = [];
let activeJoinPopup = null;

const UI_THEMES = [
  [0, 255, 255], [255, 50, 255], [50, 255, 50], 
  [255, 200, 0], [255, 100, 50], [150, 100, 255]
];
let currentTheme = UI_THEMES[0];

let starship = null;
let shipPlanned = false;
let shipSpawnAt = -1;
let viewerSpaceObjects = [];

let cosmicEvent = null;
let eventOccurredThisRound = false;
let followEvents = [];
let availableVoices = [];
let lastSpokeTime = 0;

let nextMeteorShowerTime = 0;
let backgroundMeteors = [];

let boss = null;
let bossPlanned = false;
let bossSpawnAt = -1;
let userAvatars = {}; 

const badWordsRegex = /(n[i1l]gg[e3]r|n[i1l]gg[a4]|f[u4]ck|sh[i1]t|b[i1]tch|c[u4]nt|wh[o0]re|sl[u4]t|f[a4]g|d[i1]ck|c[o0]ck|p[u4]ssy|r[e3]t[a4]rd|r[a4]p[e3]|s[u4]ck|k[i1]ll|n[a4]z[i1]|j[e3]w|h[i1]tl[e3]r)/gi;

let camOffset = { x: 0, y: 0, z: 1.0 };
let targetFPS = 60;
let socket;
const TEST_BOTS = ["ALFA", "CYBER", "GALAXY", "NEBULA", "STAR", "COMET", "VOID", "ORBITAL"];
const TIKFINITY_URL = "ws://localhost:21213/";

let settingsPanelVisible = false;
let isAutoMode = false;
let isMothershipMode = true;

let gravitySlider, bounceSlider, spawnPerEventSlider, shipChanceSlider, volumeSlider;
let autoButton, keyButton, mothershipSlider;

let stars = [];
let dust = [];
let massivePlanets = [];
let spaceDebris = [];
let nebulas = [];
let shootingStars = [];
let ambientComets = [];

let planetSize = 0;
let currentTravelSpeed = 1.0;
let blackHole = null;
let bhSpawnTimes = [];
let fxSynth;
let audioStarted = false;

let lastSpawnSnd = 0;
let lastExpSnd = 0;
let lastSpawnTime = 0;
let doorOpen = 0;

const W = 900;
const H = 1000;
const ZONE_H = 80;

const RARE_POOL = [
  { id: "STARMAN", name: "ELON'S TESLA", col: [200, 0, 0], size: 28 },
  { id: "HAWKING", name: "S. HAWKING", col: [50, 50, 255], size: 22 },
  { id: "LAIKA", name: "LAIKA DOG", col: [200, 180, 150], size: 18 },
  { id: "ET", name: "E.T.", col: [150, 120, 80], size: 24 },
  { id: "NYAN", name: "NYAN CAT", col: [255, 100, 200], size: 25 }
];
let allTimeRecords = [];

const SHAPES = {
  "HEART": [
    " ***** ***** ", " ******* ******* ", "*****************", "*****************", 
    " *************** ", " ************* ", " *********** ", " ********* ", 
    " ***** ", " *** ", " * "
  ],
  "APPLE": [
    " *** ", " **** ", " ** ", " ********** ", " ************** ", 
    " ****************", " ****************", " ****************", 
    " ************** ", " ********** "
  ]
};

function preload() {
  let s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
  s.onload = () => { libraryLoaded = true; };
  document.head.appendChild(s);
  
  let l = document.createElement('link');
  l.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  l.rel = 'stylesheet';
  document.head.appendChild(l);
  
  let d = localStorage.getItem('galaxinko_records');
  if (d) {
    allTimeRecords = JSON.parse(d).filter(r => r.name !== "NONE");
  }
}

function setup() {
  createCanvas(W, H);
  smooth();
  textFont('Press Start 2P');
  winnerColor = color(0, 0, 128);
  fxSynth = new p5.PolySynth();
  
  for (let i = 0; i < 100; i++) {
    stars.push({ x: random(W), y: random(H), s: random(1, 2.5), speed: random(0.1, 0.4) });
  }
  for (let i = 0; i < 300; i++) {
    dust.push({ x: random(W), y: random(H), s: random(0.5, 1.5) });
  }
  
  currentGravity = random(0.05, 1.95);
  currentBounce = floor(random(60, 100));
  timer = floor(random(50, 181));
  currentDestination = generatePlanetName();
  currentTheme = random(UI_THEMES);
  
  generateDeepSpaceElements();
  prepareSingularityEvents();
  planSpaceshipForRound();
  planBossForRound();
  initTTS();
  connectTikfinity();
  
  nextMeteorShowerTime = millis() + 66000;
  
  keyButton = createButton('🔑');
  keyButton.position(W + 20, 20);
  keyButton.style('font-size', '24px');
  keyButton.style('background', 'transparent');
  keyButton.style('border', 'none');
  keyButton.style('cursor', 'pointer');
  keyButton.mousePressed(toggleSettings);
  
  let sX = W - 320;
  
  gravitySlider = createSlider(0.01, 5.0, currentGravity, 0.01); 
  gravitySlider.position(sX, 200); 
  gravitySlider.hide();
  
  bounceSlider = createSlider(1, 200, currentBounce, 1); 
  bounceSlider.position(sX, 250); 
  bounceSlider.hide();
  
  spawnPerEventSlider = createSlider(1, 50, spawnPerEvent, 1); 
  spawnPerEventSlider.position(sX, 300); 
  spawnPerEventSlider.hide();
  
  shipChanceSlider = createSlider(0, 100, currentShipChance, 1); 
  shipChanceSlider.position(sX, 350); 
  shipChanceSlider.hide();
  
  volumeSlider = createSlider(0, 1, 0.5, 0.05); 
  volumeSlider.position(sX, 400); 
  volumeSlider.hide();
  
  autoButton = createButton('AUTO: OFF'); 
  autoButton.position(sX, 440); 
  autoButton.hide(); 
  autoButton.mousePressed(toggleAutoMode);
  
  mothershipSlider = createSlider(0, 30, 5, 1); 
  mothershipSlider.position(sX, 490); 
  mothershipSlider.hide();
}

function generatePlanetName() {
  const n = ["XERON", "KEPLER", "ZENON", "AETHER", "NIBIRU", "PANDORA", "CYGNUS", "TITAN", "SOLARIS", "ZION"];
  const t = ["PRIME", "STATION", "SYSTEM", "REACH", "BETA", "MAJOR", "MINOR", "VOID"];
  return random(n) + " " + random(t);
}

function initTTS() {
  if ('speechSynthesis' in window) {
    let setV = () => { 
      availableVoices = window.speechSynthesis.getVoices(); 
    };
    window.speechSynthesis.onvoiceschanged = setV;
    setV();
  }
}

function sanitizeText(t) {
  if (!t) return "Commander";
  let s = t.replace(badWordsRegex, "Bleep");
  s = s.replace(/[^\p{L}\p{N} ]/gu, "");
  s = s.trim();
  s = s.substring(0, 15);
  return s || "Commander";
}

function getHoustonStory(p) {
  const i = ["Houston here. ", "Command center. "];
  const a = [`Energy surge from `, `Maneuvers by `];
  return random(i) + random(a);
}

function speakAnnouncer(p, pri = 0) {
  if (!audioStarted) return;
  if (!('speechSynthesis' in window)) return;
  if (window.speechSynthesis.speaking && pri < 1) return;
  
  let u = new SpeechSynthesisUtterance(p);
  let env = availableVoices.filter(v => v.lang && v.lang.includes('en'));
  if (env.length > 0) {
    u.voice = random(env);
  }
  u.pitch = random(0.8, 1.1);
  u.rate = 1.05;
  u.volume = volumeSlider ? volumeSlider.value() : 1.0;
  window.speechSynthesis.speak(u);
}

function speakName(n) {
  if (!audioStarted) return;
  if (!('speechSynthesis' in window)) return;
  
  let u = new SpeechSynthesisUtterance(n);
  let v = null;
  if (/[ěščřžýáíéůúťďň]/i.test(n)) { 
    v = availableVoices.find(x => x.lang && x.lang.includes('cs')); 
  } else if (/[äöüß]/i.test(n)) { 
    v = availableVoices.find(x => x.lang && x.lang.includes('de')); 
  } else if (/[ñáéíóú¿¡]/i.test(n)) { 
    v = availableVoices.find(x => x.lang && x.lang.includes('es')); 
  } else if (/[ąęłńóśźż]/i.test(n)) { 
    v = availableVoices.find(x => x.lang && x.lang.includes('pl')); 
  }
  
  if (v) {
    u.voice = v;
    u.lang = v.lang;
  } else {
    let env = availableVoices.filter(x => x.lang && x.lang.includes('en'));
    if (env.length > 0) {
      u.voice = random(env);
    }
  }
  
  u.volume = volumeSlider ? volumeSlider.value() : 1.0;
  u.rate = 0.85; 
  u.pitch = 1.0; 
  window.speechSynthesis.speak(u);
}

function connectTikfinity() {
  socket = new WebSocket(TIKFINITY_URL);
  
  socket.onopen = () => {
    console.log("[Tikfinity] Connected");
  };
  
  socket.onmessage = (e) => {
    try {
      let d = JSON.parse(e.data);
      let evt = d?.event || d?.type || "";
      let n = d?.data?.nickname || d?.data?.uniqueId || "Anonym";
      
      if (n && n !== "Anonym") {
        let u = n.toUpperCase().substring(0, 15);
        let s = sanitizeText(u);
        onUserJoin(u, d?.data?.profilePictureUrl || d?.profilePictureUrl || "");
        
        if (evt === "follow") {
          triggerFollowEvent(s);
        } else if (evt === "chat") {
          let c = Math.min((d?.data?.comment || "").length, 15);
          for (let i = 0; i < c; i++) {
            setTimeout(() => { spawnBall(u); }, i * 150);
          }
          if (millis() - lastSpokeTime > 8000) {
            speakAnnouncer(getHoustonStory(s), 0);
            speakName(s);
            lastSpokeTime = millis();
          }
        } else if (evt !== "like") {
          for (let j = 0; j < spawnPerEvent; j++) {
            spawnBall(u);
          }
        }
        
        if (evt === "like") {
          let c = d.data?.likeCount || 1;
          updateUserLikes(u, c);
          if (millis() - lastSpokeTime > 9000) {
            speakAnnouncer("Power up from ", 0);
            speakName(s);
            lastSpokeTime = millis();
          }
          for (let i = 0; i < c; i++) {
            setTimeout(() => {
              for (let j = 0; j < spawnPerEvent; j++) {
                spawnBall(u);
              }
            }, i * 120);
          }
        }
      }
    } catch (err) {}
  };
  
  socket.onclose = () => {
    setTimeout(connectTikfinity, 5000);
  };
}

function startSpaceAudio() {
  audioStarted = true;
  userStartAudio();
}

function playSpawnSound() {
  if (audioStarted && millis() - lastSpawnSnd > 50) {
    try { fxSynth.play(random([440, 493, 554, 659, 739, 880]) + random(-5, 5), random(0.02, 0.05), 0, random(0.05, 0.15)); } catch(e) {}
    lastSpawnSnd = millis();
  }
}

function playRainbowSound() {
  if (audioStarted && millis() - lastSpawnSnd > 50) {
    let r = random([500, 600, 700, 800]);
    try {
      fxSynth.play(r, 0.1, 0, 0.1);
      setTimeout(() => { try { fxSynth.play(r * 1.25, 0.1, 0, 0.1); } catch(e){} }, 100);
      setTimeout(() => { try { fxSynth.play(r * 1.5, 0.1, 0, 0.3); } catch(e){} }, 200);
    } catch(e) {}
    lastSpawnSnd = millis();
  }
}

function playJackpotSound() {
  if (audioStarted) {
    try {
      fxSynth.play('C5', 0.1, 0, 0.1);
      setTimeout(() => { try { fxSynth.play('E5', 0.1, 0, 0.1); } catch(e){} }, 100);
      setTimeout(() => { try { fxSynth.play('G5', 0.1, 0, 0.2); } catch(e){} }, 200);
      setTimeout(() => { try { fxSynth.play('C6', 0.2, 0, 0.5); } catch(e){} }, 300);
    } catch(e) {}
  }
}

function playExplosionSound() {
  if (audioStarted && millis() - lastExpSnd > 50) {
    try { fxSynth.play(random(50, 150), 0.1, 0, 0.2); } catch(e) {}
    lastExpSnd = millis();
  }
}

function playCleanupSound() {
  if (audioStarted) {
    try { fxSynth.play(100, 0.05, 0, 1.0); } catch(e) {}
  }
}

function playTimerEndSequence() {
  if (!audioStarted) return;
  let e = [600, 400, 250, 100];
  for (let i = 0; i < e.length; i++) {
    setTimeout(() => {
      if (gameState === "WAITING") {
        try { fxSynth.play(e[i] + random(-20, 20), 0.08, 0, 0.4); } catch(err) {}
        shakeAmount = random(2, 4);
      }
    }, i * 400);
  }
  flashEffect = 60;
}

function toggleSettings() { 
  settingsPanelVisible = !settingsPanelVisible; 
  if (settingsPanelVisible) {
    gravitySlider.show();
    bounceSlider.show();
    spawnPerEventSlider.show();
    shipChanceSlider.show();
    volumeSlider.show();
    autoButton.show();
    mothershipSlider.show();
  } else {
    gravitySlider.hide();
    bounceSlider.hide();
    spawnPerEventSlider.hide();
    shipChanceSlider.hide();
    volumeSlider.hide();
    autoButton.hide();
    mothershipSlider.hide();
  } 
}

function toggleAutoMode() {
  isAutoMode = !isAutoMode;
  if (isAutoMode) {
    autoButton.html('AUTO: ON');
    autoButton.style('background-color', '#4CAF50');
    autoRandomSettings();
  } else {
    autoButton.html('AUTO: OFF');
    autoButton.style('background-color', '');
  }
}

function autoRandomSettings() {
  currentGravity = random(0.05, 1.95);
  currentBounce = floor(random(60, 100));
  spawnPerEvent = floor(random(1, 4));
  currentShipChance = floor(random(0, 101));
  gravitySlider.value(currentGravity);
  bounceSlider.value(currentBounce);
  spawnPerEventSlider.value(spawnPerEvent);
  shipChanceSlider.value(currentShipChance);
  if (world) {
    world.gravity.y = currentGravity;
  }
}

function drawTxt(t, x, y, c, s, a = CENTER) {
  push();
  noStroke();
  textAlign(a, CENTER);
  textSize(s);
  fill(0, 150);
  text(t, x + 2, y + 2);
  fill(c);
  text(t, x, y);
  pop();
}

function updateWinnerColor() {
  let s = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score);
  if (s.length > 0) {
    winnerColor = lerpColor(winnerColor, s[0][1].color, 0.005);
  } else {
    winnerColor = color(0, 0, 128);
  }
}

function updateTravelSpeed() {
  let target = (gameState === "PLAYING" ? 1.0 : 0.2);
  currentTravelSpeed = lerp(currentTravelSpeed, target, 0.01);
}

function draw() {
  if (!libraryLoaded) return;
  if (!engine) initGame();
  
  if (settingsPanelVisible) {
    let diff = (gravitySlider.value() !== currentGravity) || 
               (bounceSlider.value() !== currentBounce) || 
               (spawnPerEventSlider.value() !== spawnPerEvent) || 
               (shipChanceSlider.value() !== currentShipChance);
               
    if (diff) {
      if (isAutoMode) {
        toggleAutoMode();
      }
      currentGravity = gravitySlider.value();
      currentBounce = bounceSlider.value();
      spawnPerEvent = spawnPerEventSlider.value();
      currentShipChance = shipChanceSlider.value();
      if (world) {
        world.gravity.y = currentGravity;
      }
    }
  }
  
  if (frameCount % 60 === 0) {
    targetFPS = random(57, 60);
  }
  frameRate(targetFPS);
  
  if (audioStarted) {
    outputVolume(volumeSlider.value());
  }

  push();
  camOffset.x = (noise(frameCount * 0.005) - 0.5) * 40;
  camOffset.y = (noise(frameCount * 0.005 + 100) - 0.5) * 40;
  camOffset.z = 1.0 + (noise(frameCount * 0.002) - 0.5) * 0.05;
  
  translate(W / 2, H / 2);
  scale(camOffset.z);
  translate(-W / 2 + camOffset.x, -H / 2 + camOffset.y);
  
  if (shakeAmount > 0) {
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
    shakeAmount *= 0.92;
  }
  
  let driftX = sin(frameCount * 0.013) * 2.5;
  let driftY = cos(frameCount * 0.017) * 2.5;
  translate(driftX, driftY);

  updateWinnerColor();
  updateTravelSpeed();
  
  let bgR = 2 + sin(frameCount * 0.01) * 2;
  let bgG = 2 + cos(frameCount * 0.015) * 2;
  let bgB = 12 + sin(frameCount * 0.005) * 4;
  background(bgR, bgG, bgB);
  
  drawGravityDust();
  drawGalacticBackground();
  drawViewerObjects();
  handleBackgroundMeteors();

  try {
    Matter.Engine.update(engine, 1000 / 60);
  } catch (e) {}
  
  handleBlackHole();
  handleCosmicEvent();
  handleSpaceship();
  handleBoss();

  if (gameState === "PLAYING") {
    if (millis() > nextMeteorShowerTime) {
      triggerMeteorShower();
      nextMeteorShowerTime = millis() + 66000;
    }
    
    if (random() < 0.015) {
      let side = floor(random(3));
      let mx, my, mvx, mvy;
      if (side === 0) { 
        mx = random(W); my = -50; mvx = random(-4, 4); mvy = random(15, 25); 
      } else if (side === 1) { 
        mx = -50; my = random(H/2); mvx = random(15, 25); mvy = random(5, 15); 
      } else { 
        mx = W + 50; my = random(H/2); mvx = random(-25, -15); mvy = random(5, 15); 
      }
      backgroundMeteors.push({ x: mx, y: my, vx: mvx, vy: mvy, size: random(4, 12), c: color(255, random(100, 200), 0), trail: [] });
    }
    
    let msRate = mothershipSlider ? mothershipSlider.value() : 0;
    if (isMothershipMode && msRate > 0 && balls.length < 3000) {
      if (random() < (msRate / targetFPS)) {
        spawnBall("MOTHERSHIP");
      }
    }
  }

  if (millis() - lastTick > 1000) {
    if (gameState === "PLAYING") {
      timer--;
      checkSingularitySpawn();
      if (shipPlanned && !starship && timer === shipSpawnAt) {
        spawnSpaceship();
      }
      if (bossPlanned && !boss && timer === bossSpawnAt) {
        spawnBoss();
      }
      if (!eventOccurredThisRound && timer < (timer * 0.7) && random() < 0.17) {
        triggerCosmicEvent();
      }
      if (random() < 0.11) {
        spawnRareLegend();
      }
      if (timer === 10) {
        speakAnnouncer("10 seconds remaining.", 1);
      }
      if (timer <= 0) {
        gameState = "WAITING";
        waitStartTime = millis();
        shakeAmount = 6;
        playCleanupSound();
        playTimerEndSequence();
        speakAnnouncer("Sector operations complete.", 2);
      }
    } else if (gameState === "RESULTS") {
      resultsTimer--;
      if (resultsTimer <= 0) {
        resetGame();
      }
    }
    lastTick = millis();
  }

  if (gameState === "WAITING") {
    if (balls.length === 0 || (millis() - waitStartTime) / 1000 > 10) {
      gameState = "RESULTS";
      resultsTimer = 10;
      let s = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score);
      if (s.length > 0) {
        speakAnnouncer(`Round over! The ultimate commander is `, 2);
        speakName(s[0][0]);
      }
    }
  }

  drawPortals();
  drawZones();
  drawWalls();
  drawPegs();
  drawBalls();
  drawExplosions();
  handleFollowEvents();
  handleShockwaves();
  handleFloatingTexts();
  drawUI();
  handleJoinPopups();
  
  if (gameState === "WAITING") {
    drawWaitingMessage();
  }
  if (gameState === "RESULTS") {
    drawResultsOverlay();
  }
  
  drawProceduralHUD();
  drawAntiBotOverlay();

  if (settingsPanelVisible) {
    let pX = W - 340;
    push();
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0);
    fill(15, 15, 25, 240);
    stroke(currentTheme[0], currentTheme[1], currentTheme[2], 100);
    strokeWeight(2);
    rect(pX, 120, 320, 420, 15);
    drawingContext.shadowBlur = 0;
    
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(16);
    let tX = pX + 20;
    fill(0, 150); text("⚙️ ADMIN PANEL", tX + 2, 155 + 2);
    fill(currentTheme[0], currentTheme[1], currentTheme[2]); text("⚙️ ADMIN PANEL", tX, 155);
    
    stroke(255, 50);
    line(tX, 175, pX + 300, 175);
    noStroke();
    textSize(11);
    
    fill(0, 150); text(`GRAVITY: ${currentGravity.toFixed(2)}`, tX + 2, 205 + 2);
    fill(200); text(`GRAVITY: ${currentGravity.toFixed(2)}`, tX, 205);
    
    fill(0, 150); text(`BOUNCE: ${currentBounce}`, tX + 2, 255 + 2);
    fill(200); text(`BOUNCE: ${currentBounce}`, tX, 255);
    
    fill(0, 150); text(`SPAWN LIMIT: ${spawnPerEvent}`, tX + 2, 305 + 2);
    fill(200); text(`SPAWN LIMIT: ${spawnPerEvent}`, tX, 305);
    
    fill(0, 150); text(`BOSS/SHIP CHANCE: ${currentShipChance}%`, tX + 2, 355 + 2);
    fill(200); text(`BOSS/SHIP CHANCE: ${currentShipChance}%`, tX, 355);
    
    fill(0, 150); text(`SFX VOL: ${floor(volumeSlider.value() * 100)}%`, tX + 2, 405 + 2);
    fill(200); text(`SFX VOL: ${floor(volumeSlider.value() * 100)}%`, tX, 405);
    
    fill(0, 150); text(`MOTHERSHIP RATE: ${mothershipSlider.value()}/s`, tX + 2, 475 + 2);
    fill(200); text(`MOTHERSHIP RATE: ${mothershipSlider.value()}/s`, tX, 475);
    pop();
  }
  
  if (flashEffect > 0) {
    noStroke();
    fill(20, 40, 100, map(flashEffect, 0, 60, 0, 100));
    rect(0, 0, W, H);
    flashEffect--;
  }
  pop();
}

function spawnBall(userName) {
  if (!libraryLoaded) return;
  if (gameState !== "PLAYING") {
    if (spawnQueue.length < 500) {
      spawnQueue.push(userName);
    }
    return;
  }
  
  if (balls.length > 3000) return;
  
  if (!audioStarted) {
    startSpaceAudio();
  }
  
  let isR = random() < 0.03;
  if (isR) {
    playRainbowSound();
  } else {
    playSpawnSound();
  }
  
  totalBallsFired++;
  lastSpawnTime = millis();
  
  let ballRestitution = map(currentBounce, 1, 99, 0.65, 1.05);
  let spawnX = W / 2 + random(-30, 30);
  
  let ballBody = Matter.Bodies.rectangle(spawnX, 40, 14, 14, { 
    restitution: ballRestitution, 
    friction: 0.2, 
    frictionAir: 0.04, 
    density: 0.001 
  });
  
  let ballColor;
  if (userName === "MOTHERSHIP") {
    ballColor = color(120, 120, 130);
  } else {
    if (!leaderboard[userName]) {
      leaderboard[userName] = { score: 0, color: color(random(100, 255), random(100, 255), random(100, 255)) };
    }
    ballColor = leaderboard[userName].color;
  }
  
  let newBall = { 
    body: ballBody, 
    name: userName, 
    color: ballColor, 
    scored: false, 
    combo: 0, 
    lastHitTime: 0, 
    lastShipHit: 0, 
    lastBossHit: 0, 
    spawnTime: millis(), 
    isRainbow: isR, 
    trail: [], 
    rainbowExplodeTime: null, 
    portalCooldown: 0,
    scoreTime: null,
    zoneIndex: -1 
  };
  
  balls.push(newBall);
  Matter.World.add(world, ballBody);
}

function drawBalls() {
  for (let zi = 0; zi < zones.length; zi++) {
    let zBalls = balls.filter(b => b.scored && b.zoneIndex === zi);
    let limit = Math.max(1, Math.floor(zones[zi].capacity * 0.95));
    
    if (zBalls.length > limit) {
      zBalls.sort((a, b) => a.scoreTime - b.scoreTime);
      let toRemove = zBalls.length - limit;
      for (let k = 0; k < toRemove; k++) {
        removeBall(zBalls[k]);
      }
    }
  }

  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    if (!b.body) {
      balls.splice(i, 1);
      continue;
    }
    
    let pos = b.body.position;
    if (isNaN(pos.x) || isNaN(pos.y)) {
      removeBall(b);
      continue;
    }
    
    if (b.scored && b.body.velocity.y < -2 && pos.y < H - ZONE_H - 50) {
      b.scored = false;
    }
    
    if (b.portalCooldown > 0) {
      b.portalCooldown--;
    }
    
    if (portals.length === 2 && b.portalCooldown <= 0) {
      if (dist(pos.x, pos.y, portals[0].x, portals[0].y) < 30) {
        Matter.Body.setPosition(b.body, { x: portals[1].x, y: portals[1].y });
        Matter.Body.setVelocity(b.body, { x: random(-5, 5), y: random(2, 5) });
        b.portalCooldown = 60;
        playSpawnSound();
      }
    }
    
    push();
    translate(pos.x, pos.y);
    rotate(b.body.angle);
    
    if (b.combo > 2) {
      fill(255);
      noStroke();
      rect(-9, -9, 18, 18);
    }
    
    if (b.isRainbow) {
      colorMode(HSB);
      fill((frameCount * 10) % 360, 255, 255);
      colorMode(RGB);
    } else {
      fill(b.color);
    }
    
    stroke(255);
    strokeWeight(1);
    rect(-7, -7, 14, 14);
    rotate(-b.body.angle);
    
    if (b.name !== "MOTHERSHIP") {
      let age = millis() - b.spawnTime;
      if (age < 3000 || b.scored) { 
        noStroke();
        textAlign(CENTER);
        textSize(12);
        fill(0, 150);
        text(b.name, 1 + 2, -16 + 2);
        fill(b.isRainbow ? color(255) : b.color);
        text(b.name, 1, -16); 
      }
      if (b.combo > 0) { 
        noStroke();
        textSize(14);
        fill(0, 150);
        text("x" + b.combo, 1 + 2, -30 + 2);
        fill(255, 200, 0);
        text("x" + b.combo, 1, -30); 
      }
    }
    pop();
    
    if (b.combo > 0 && millis() - b.lastHitTime > 2000) {
      b.combo = 0;
    }
    
    if (starship && starship.state === "ACTIVE") {
      let sDistX = abs(pos.x - starship.body.position.x);
      let sDistY = abs(pos.y - starship.y);
      if (sDistX < starship.w / 2 + 10 && sDistY < starship.h / 2 + 10) {
        if (millis() - (b.lastShipHit || 0) > 500) {
          b.lastShipHit = millis();
          b.combo += 2;
          b.lastHitTime = millis();
          if (b.name !== "MOTHERSHIP") {
            updateScore(b.name, 100, b.color);
          }
          createExplosion(pos.x, pos.y, b.color);
          playExplosionSound();
          Matter.Body.applyForce(b.body, pos, { x: (pos.x - starship.body.position.x) * 0.0001, y: -0.025 });
          addFloatingText("+100", pos.x, pos.y, b.color);
        }
      }
    }
    
    if (boss && boss.state === "ACTIVE") {
      let bDistX = abs(pos.x - boss.x);
      let bDistY = abs(pos.y - boss.y);
      if (bDistX < boss.w / 2 + 10 && bDistY < boss.h / 2 + 10) {
        if (millis() - (b.lastBossHit || 0) > 200) {
          b.lastBossHit = millis();
          let dmg = 50 + b.combo * 10;
          boss.hp -= dmg;
          boss.hitFlash = 5;
          if (b.name !== "MOTHERSHIP") {
            updateScore(b.name, dmg * 5, b.color);
          }
          addFloatingText("-" + dmg, pos.x, pos.y, color(255, 50, 50), true);
          createExplosion(pos.x, pos.y, b.color);
          playExplosionSound();
          Matter.Body.applyForce(b.body, pos, { x: (pos.x - boss.x) * 0.0002, y: -0.03 });
        }
      }
    }

    for (let j = pegs.length - 1; j >= 0; j--) {
      let p = pegs[j];
      if (dist(pos.x, pos.y, p.position.x, p.position.y) < 18) {
        p.glow = 255;
        b.combo += 1;
        b.lastHitTime = millis();
        if (p.isExplosive) {
          createExplosion(p.position.x, p.position.y, color(255, 150, 0));
          playExplosionSound();
          let forceDir = Matter.Vector.sub(pos, p.position);
          Matter.Body.applyForce(b.body, pos, Matter.Vector.mult(Matter.Vector.normalise(forceDir), 0.025));
          Matter.World.remove(world, p);
          pegs.splice(j, 1);
        } else if (p.isRepulsor) {
          b.body.velocity.y = 0;
          Matter.Body.applyForce(b.body, pos, { x: (pos.x - p.position.x) * 0.002, y: -0.04 });
          createExplosion(p.position.x, p.position.y, color(255, 50, 200));
          playSpawnSound();
        }
      }
    }
    
    if (pos.y > H - ZONE_H - 10 && !b.scored) {
      let cz = null;
      for (let z of zones) {
        if (pos.x >= z.x && pos.x < z.x + z.w) {
          cz = z;
          break;
        }
      }
      
      if (cz) {
        b.scored = true; 
        b.scoreTime = millis();
        b.zoneIndex = zones.indexOf(cz);
        let fs = cz.score; 
        if (b.isRainbow) {
          fs *= 2;
          b.rainbowExplodeTime = millis() + 2500;
        }
        if (b.name !== "MOTHERSHIP") {
          updateScore(b.name, fs, b.color); 
        }
        cz.flash = 255;
        cz.flashColor = b.isRainbow ? color(255, 255, 255) : b.color;
        let isJp = fs >= 5000; 
        if (b.name !== "MOTHERSHIP") {
          addFloatingText("+" + fs.toLocaleString(), pos.x, pos.y, isJp ? color(255, 215, 0) : color(100, 255, 100), isJp);
        }
        if (isJp) {
          shakeAmount = 8;
          playJackpotSound();
        }
      }
    }
    
    if (b.isRainbow && b.rainbowExplodeTime && millis() > b.rainbowExplodeTime) {
      createShockwave(pos.x, pos.y);
      playExplosionSound();
      shakeAmount = 6;
      for (let ex = 0; ex < 10; ex++) {
        explosions.push({ x: pos.x, y: pos.y, vx: random(-3, 3), vy: random(-3, 3), life: 255, col: color(255) });
      }
      for (let ob of balls) {
        if (ob === b) continue;
        if (dist(pos.x, pos.y, ob.body.position.x, ob.body.position.y) < 180) {
          ob.scored = false;
          let forceDir = Matter.Vector.normalise({ x: ob.body.position.x - pos.x, y: ob.body.position.y - pos.y - 40 });
          Matter.Body.applyForce(ob.body, ob.body.position, Matter.Vector.mult(forceDir, 0.015));
        }
      }
      b.rainbowExplodeTime = null;
      removeBall(b);
      continue;
    }
    
    if (b.scored && b.scoreTime && b.name === "MOTHERSHIP" && millis() - b.scoreTime > 5000) {
      removeBall(b);
      continue;
    }
    
    if (pos.y > H + 150 || pos.x < -150 || pos.x > W + 150) {
      removeBall(b);
    }
  }
}

function removeBall(b) {
  if (!b) return;
  Matter.World.remove(world, b.body);
  let i = balls.indexOf(b);
  if (i !== -1) {
    balls.splice(i, 1);
  }
}

function updateScore(n, p, c) {
  if (n === "METEOR" || n === "ROCK" || n === "DEBRIS" || n === "COMET" || n === "ASTEROID" || n === "MOTHERSHIP") {
    return;
  }
  if (!leaderboard[n]) {
    leaderboard[n] = { score: 0, color: c };
  }
  leaderboard[n].score += p;
  checkAllTimeRecords(n, leaderboard[n].score, c);
}

function checkAllTimeRecords(n, s, c) {
  let i = allTimeRecords.findIndex(r => r.name === n);
  if (i !== -1) {
    if (s > allTimeRecords[i].score) {
      allTimeRecords[i].score = s;
    }
  } else {
    allTimeRecords.push({ name: n, score: s, color: [red(c), green(c), blue(c)] });
  }
  allTimeRecords.sort((a, b) => b.score - a.score);
  allTimeRecords = allTimeRecords.slice(0, 5);
  localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords));
}

function drawUI() {
  push();
  fill(5, 5, 15, 240);
  noStroke();
  rect(0, 0, W, 70);
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 120);
  strokeWeight(2);
  line(0, 70, W, 70);
  
  let lX = 15;
  let lY = 30;
  textAlign(LEFT, CENTER);
  fill(0, 150);
  textSize(45);
  text(GAME_TITLE, lX + 2, lY + 2);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]);
  text(GAME_TITLE, lX, lY);
  
  textSize(9);
  fill(0, 150);
  text(GAME_VERSION, lX + 2, 54 + 2);
  fill(255);
  text(GAME_VERSION, lX, 54);
  
  let dW = 360;
  let dX = W / 2 - (dW / 2);
  let p = sin(frameCount * 0.1) * 3;
  
  fill(currentTheme[0], currentTheme[1], currentTheme[2], 10 + p);
  rect(dX, 8, dW, 54, 8);
  fill(5, 5, 20, 250);
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 120 + p * 10);
  strokeWeight(2);
  rect(dX, 8, dW, 54, 8);
  
  let lT = new Intl.DateTimeFormat('cs-CZ', { timeStyle: 'medium' }).format(new Date());
  noStroke();
  fill(0, 150);
  textSize(12);
  text("🔴 LIVE " + lT, dX + 15 + 2, 24 + 2);
  fill(255, 60, 60);
  text("🔴 LIVE " + lT, dX + 15, 24);
  
  textAlign(RIGHT, CENTER);
  fill(0, 150);
  text("SYSTEM: ONLINE", dX + dW - 15 + 2, 24 + 2);
  fill(50, 255, 50);
  text("SYSTEM: ONLINE", dX + dW - 15, 24);
  
  textAlign(CENTER, CENTER);
  fill(0, 150);
  textSize(10);
  text("GEOMETRY: PROCEDURAL | DATA: SYNCED", dX + dW / 2 + 2, 45 + 2);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]);
  text("GEOMETRY: PROCEDURAL | DATA: SYNCED", dX + dW / 2, 45);
  
  textAlign(RIGHT, CENTER);
  fill(0, 150);
  textSize(12);
  text(`${currentDestination}`, W - 15 + 2, 20 + 2);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]);
  text(`${currentDestination}`, W - 15, 20);
  
  let gDisp = floor(map(currentGravity, 0.05, 1.95, 1, 99));
  fill(0, 150);
  textSize(10);
  text(`G-FORCE: ${gDisp} [R-${roundCount}]`, W - 15 + 2, 38 + 2);
  fill(200);
  text(`G-FORCE: ${gDisp} [R-${roundCount}]`, W - 15, 38);
  
  fill(0, 150);
  text(`BOUNCE-X: ${currentBounce}`, W - 15 + 2, 56 + 2);
  fill(255, 150, 0);
  text(`BOUNCE-X: ${currentBounce}`, W - 15, 56);
  pop();
  
  push();
  translate(10, 85);
  let ml = allTimeRecords.slice(0, 5);
  let lH = 45 + max(1, ml.length) * 26;
  
  fill(0, 0, 15, 245);
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 150);
  strokeWeight(2);
  rect(0, 0, 240, lH, 8);
  
  noStroke();
  textAlign(CENTER);
  textSize(12);
  fill(0, 150);
  text("MISSION MILESTONES", 122, 27);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]);
  text("MISSION MILESTONES", 120, 25);
  
  stroke(255, 30);
  strokeWeight(1);
  line(10, 40, 230, 40);
  
  noStroke();
  textAlign(LEFT);
  ml.forEach((r, i) => {
    let y = 65 + i * 26;
    let txt = `${i === 0 ? '👑 ' : ''}${i + 1}. ${r.name}`;
    if (userAvatars[r.name]) {
      push();
      imageMode(CENTER);
      tint(255);
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.arc(-5, y - 2, 16, 0, TWO_PI);
      drawingContext.clip();
      image(userAvatars[r.name], -5, y - 2, 32, 32);
      drawingContext.restore();
      pop();
      drawTxt(txt, 25, y, color(r.color[0], r.color[1], r.color[2]), i < 3 ? 10 : 9, LEFT);
    } else {
      drawTxt(txt, 15, y, color(r.color[0], r.color[1], r.color[2]), i < 3 ? 10 : 9, LEFT);
    }
    drawTxt(r.score.toLocaleString(), 225, y, color(255), i < 3 ? 10 : 9, RIGHT);
  });
  
  translate(0, lH + 15);
  fill(0, 0, 15, 245);
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 150);
  strokeWeight(2);
  rect(0, 0, 240, 60, 8);
  noStroke();
  textSize(11);
  
  if (gameState === "PLAYING") {
    textAlign(LEFT, CENTER);
    fill(0, 150);
    text("WARP-DRIVE: " + timer + "s", 15 + 2, 20 + 2);
    fill(timer < 10 ? color(255, 50, 50) : color(currentTheme[0], currentTheme[1], currentTheme[2]));
    text("WARP-DRIVE: " + timer + "s", 15, 20);
    
    fill(0, 150);
    text(`ACTIVE UNITS: ${balls.length}`, 15 + 2, 40 + 2);
    fill(50, 255, 50);
    text(`ACTIVE UNITS: ${balls.length}`, 15, 40);
  } else {
    textAlign(LEFT, CENTER);
    fill(0, 150);
    text("COOLING DOWN...", 15 + 2, 20 + 2);
    fill(255, 200, 0);
    text("COOLING DOWN...", 15, 20);
    
    fill(0, 150);
    text(`TOTAL UNITS: ${balls.length}`, 15 + 2, 40 + 2);
    fill(50, 255, 50);
    text(`TOTAL UNITS: ${balls.length}`, 15, 40);
  }
  pop();
  
  push();
  translate(W - 250, 85);
  let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 30);
  let rH = 45 + max(1, sorted.length) * 22;
  
  fill(0, 0, 15, 245);
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 150);
  strokeWeight(2);
  rect(0, 0, 240, rH, 8);
  
  noStroke();
  fill(0, 150);
  textAlign(CENTER);
  textSize(12);
  text("TOP CONTRIBUTORS", 122, 27);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]);
  text("TOP CONTRIBUTORS", 120, 25);
  
  stroke(255, 30);
  strokeWeight(1);
  line(10, 40, 230, 40);
  
  noStroke();
  textAlign(LEFT);
  sorted.forEach((e, i) => {
    let y = 65 + i * 22;
    let txt = `${i === 0 ? '👑 ' : ''}${nf(i + 1, 2)}. ${e[0]}`;
    if (userAvatars[e[0]]) {
      push();
      imageMode(CENTER);
      tint(255);
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.arc(-5, y - 2, 16, 0, TWO_PI);
      drawingContext.clip();
      image(userAvatars[e[0]], -5, y - 2, 32, 32);
      drawingContext.restore();
      pop();
      drawTxt(txt, 25, y, color(e[1].color), i < 3 ? 10 : 9, LEFT);
    } else {
      drawTxt(txt, 15, y, color(e[1].color), i < 3 ? 10 : 9, LEFT);
    }
    drawTxt(e[1].score.toLocaleString(), 225, y, color(255), i < 3 ? 10 : 9, RIGHT);
  });
  pop();
}

function drawZones() {
  for (let z of zones) {
    if (z.flash > 0) {
      fill(z.flashColor);
      z.flash -= 10;
    } else {
      fill(z.baseColor);
    }
    noStroke();
    rect(z.x, H - ZONE_H, z.w, ZONE_H);
    
    push();
    translate(z.x + z.w / 2, H - 20);
    rotate(-HALF_PI);
    let sCol = z.score >= 5000 ? color(255, 230, 100) : color(255);
    let sSize = z.score >= 5000 ? 18 : (z.w < 30 ? 10 : 15);
    drawTxt(z.score.toLocaleString(), 0, 0, sCol, sSize, CENTER);
    pop();
  }
}

function drawWaitingMessage() {
  let a = map(sin(frameCount * 0.15), -1, 1, 100, 255);
  drawTxt("WARNING: CLEANUP", W / 2, H / 2 - 50, color(255, 50, 50, a), 30, CENTER);
  drawTxt("REMAINING UNITS RETURNING TO BASE...", W / 2, H / 2, color(255, 200, 0, a), 14, CENTER);
}

function drawResultsOverlay() {
  fill(0, 0, 20, 230);
  rect(20, 50, W - 40, H - 100, 20);
  
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(currentTheme[0], currentTheme[1], currentTheme[2]);
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 255);
  strokeWeight(4);
  fill(10, 10, 30, 240);
  rect(40, 80, W - 80, H - 160, 15);
  drawingContext.shadowBlur = 0;
  
  drawTxt("ROUND COMPLETE", W / 2, 160, color(currentTheme), 50, CENTER);
  drawTxt(`SECTOR: ${currentDestination}`, W / 2, 210, color(255, 215, 0), 22, CENTER);
  
  let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 5);
  for (let i = 0; i < sorted.length; i++) {
    let entry = sorted[i];
    let yPos = 320 + i * 90;
    
    fill(i % 2 === 0 ? color(255, 255, 255, 20) : color(255, 255, 255, 5));
    noStroke();
    rect(80, yPos - 45, W - 160, 80, 10);
    
    let txt = `${i === 0 ? "👑 " : i + 1 + ". "}${entry[0]}`;
    
    if (userAvatars[entry[0]]) {
      push();
      imageMode(CENTER);
      tint(255);
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.arc(100, yPos - 5, 30, 0, TWO_PI);
      drawingContext.clip();
      image(userAvatars[entry[0]], 100, yPos - 5, 60, 60);
      drawingContext.restore();
      pop();
      drawTxt(txt, 145, yPos - 5, color(entry[1].color), i === 0 ? 35 : 25, LEFT);
    } else {
      drawTxt(txt, 100, yPos - 5, color(entry[1].color), i === 0 ? 35 : 25, LEFT);
    }
    drawTxt(entry[1].score.toLocaleString(), W - 100, yPos - 5, color(255), i === 0 ? 45 : 38, RIGHT);
  }
  
  drawTxt(`NEXT ROUND IN: ${resultsTimer}s`, W / 2, H - 120, color(255, 50, 50), 24, CENTER);
}

function planBossForRound() {
  bossPlanned = (random(100) < currentShipChance);
  bossSpawnAt = bossPlanned ? floor(random(15, timer - 15)) : -1;
}

function spawnBoss() {
  speakAnnouncer("VOID LEVIATHAN DETECTED. ENCOUNTER COMMENCING.", 2);
  let w = 240;
  let h = 80;
  let startY = -150;
  
  let b = Matter.Bodies.rectangle(W/2, startY, w, h, { isStatic: true, restitution: 1.2, friction: 0 });
  Matter.World.add(world, b);
  
  boss = { 
    body: b, w: w, h: h, x: W/2, y: startY, targetX: W/2, targetY: 200, 
    maxHp: 10000, hp: 10000, state: "ENTERING", activeFrames: 0, hitFlash: 0 
  };
  shakeAmount = 20;
  flashEffect = 30;
}

function handleBoss() {
  if (!boss) return;
  boss.activeFrames++;
  let pos = boss.body.position;
  boss.x = pos.x;
  boss.y = pos.y;
  
  if (boss.state === "ENTERING") {
    let dy = boss.targetY - boss.y;
    Matter.Body.setPosition(boss.body, { x: boss.x, y: boss.y + dy * 0.05 });
    if (abs(dy) < 2) {
      boss.state = "ACTIVE";
    }
  } else if (boss.state === "ACTIVE") {
    if (frameCount % 120 === 0) {
      boss.targetX = random(200, W - 200);
      boss.targetY = random(150, H / 2 - 50);
    }
    boss.x = lerp(boss.x, boss.targetX, 0.02);
    boss.y = lerp(boss.y, boss.targetY, 0.02);
    Matter.Body.setPosition(boss.body, { x: boss.x, y: boss.y });
    
    if (boss.hp <= 0) {
      boss.state = "DEFEATED";
      speakAnnouncer("Leviathan destroyed! Massive bonus awarded!", 2);
      shakeAmount = 30;
      playJackpotSound();
      for(let player in leaderboard) {
        updateScore(player, 20000, leaderboard[player].color);
        addFloatingText("+20000 BOSS SLAYER", W/2 + random(-150, 150), boss.y + random(-50, 50), color(255, 215, 0), true);
      }
      Matter.World.remove(world, boss.body);
    }
  } else if (boss.state === "DEFEATED") {
    if (boss.activeFrames % 5 === 0) {
      createExplosion(boss.x + random(-120, 120), boss.y + random(-60, 60), color(255, 100, 255));
      playExplosionSound();
    }
    if (boss.activeFrames > 120) {
      boss = null;
    }
    return;
  }
  
  push();
  translate(boss.x, boss.y);
  if (boss.hitFlash > 0) {
    boss.hitFlash--;
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color(255);
  }
  
  fill(15, 5, 25);
  stroke(120, 50, 255);
  strokeWeight(3);
  triangle(-boss.w/2, 0, -boss.w/2 - 60, -40, -boss.w/2 - 20, 40);
  triangle(boss.w/2, 0, boss.w/2 + 60, -40, boss.w/2 + 20, 40);
  
  fill(25, 10, 45);
  stroke(160, 60, 255);
  strokeWeight(4);
  ellipse(0, 0, boss.w, boss.h);
  
  fill(100, 50, 255, 150);
  noStroke();
  ellipse(0, 0, boss.w * 0.7, boss.h * 0.5);
  
  fill(255, 50, 50);
  ellipse(0, 0, 50 + sin(frameCount * 0.2) * 10, 50 + cos(frameCount * 0.2) * 10);
  
  fill(255, 255, 0);
  ellipse(0, 0, 15, 35 + sin(frameCount * 0.3) * 5);
  pop();
  
  let barW = 400;
  let barH = 20;
  let barX = W/2 - barW/2;
  let barY = 90;
  
  push();
  fill(0, 150);
  noStroke();
  rect(barX, barY, barW, barH, 5);
  fill(255, 50, 50);
  rect(barX, barY, barW * (max(0, boss.hp) / boss.maxHp), barH, 5);
  drawTxt("VOID LEVIATHAN HP", W/2, barY + 10, color(255), 10, CENTER);
  pop();
}

function planSpaceshipForRound() {
  shipPlanned = (random(100) < currentShipChance);
  shipSpawnAt = shipPlanned ? floor(random(10, timer - 10)) : -1;
}

function spawnSpaceship() {
  let w = 160;
  let h = 30;
  let y = H - ZONE_H - 150;
  let b = Matter.Bodies.rectangle(-200, y, w, h, { isStatic: true, restitution: 1.5, friction: 0 });
  Matter.World.add(world, b);
  starship = { body: b, w: w, h: h, y: y, targetX: W / 2, speed: 8, activeFrames: 0, maxFrames: 1500, state: "ENTERING" };
  speakAnnouncer("Defense unit deployed.", 1);
}

function handleSpaceship() {
  if (!starship) return;
  starship.activeFrames++;
  
  if (frameCount % 5 === 0 && starship.state === "ACTIVE") {
    let tgt = null;
    let maxY = 0;
    for (let b of balls) {
      let py = b.body.position.y;
      if (py > maxY && py < starship.y - 10 && b.body.velocity.y > 0) {
        maxY = py;
        tgt = b;
      }
    }
    starship.targetX = tgt ? tgt.body.position.x : W / 2 + sin(frameCount * 0.02) * 200;
  }
  
  if (starship.state === "ENTERING") {
    starship.targetX = W / 2;
    if (abs(starship.body.position.x - W / 2) < 20) {
      starship.state = "ACTIVE";
    }
  } else if (starship.state === "ACTIVE" && starship.activeFrames > starship.maxFrames) {
    starship.state = "LEAVING";
  } else if (starship.state === "LEAVING") {
    starship.targetX = W + 300;
    if (starship.body.position.x > W + 150) {
      Matter.World.remove(world, starship.body);
      starship = null;
      return;
    }
  }
  
  let pos = starship.body.position;
  let dx = starship.targetX - pos.x;
  let moveX = abs(dx) > starship.speed ? (dx > 0 ? starship.speed : -starship.speed) : 0;
  Matter.Body.setPosition(starship.body, { x: pos.x + moveX, y: starship.y });
  
  push();
  translate(pos.x, starship.y);
  noStroke();
  
  fill(0, 255, 255, random(150, 255));
  ellipse(0, starship.h / 2 + 5, starship.w * 0.6, 25);
  
  fill(255);
  ellipse(0, starship.h / 2 + 5, starship.w * 0.2, 10);
  
  fill(80);
  ellipse(0, 0, starship.w, starship.h * 1.2);
  
  fill(120);
  ellipse(0, -starship.h * 0.2, starship.w * 0.8, starship.h * 0.8);
  
  fill(40);
  ellipse(0, starship.h * 0.2, starship.w * 0.7, starship.h * 0.6);
  
  fill(0, 200, 255, 120);
  arc(0, -starship.h * 0.2, starship.w * 0.5, starship.h * 2, PI, 0);
  
  fill(50, 255, 50);
  ellipse(0, -starship.h * 0.6, 15, 20);
  
  fill(0);
  ellipse(-4, -starship.h * 0.65, 5, 8);
  ellipse(4, -starship.h * 0.65, 5, 8);
  
  for (let l = 0; l < 5; l++) {
    let lx = map(l, 0, 4, -starship.w / 2.2, starship.w / 2.2);
    fill((frameCount + l * 10) % 20 < 10 ? color(255, 50, 50) : color(50, 255, 50));
    ellipse(lx, 0, 6);
  }
  pop();
}

function onUserJoin(u, img) {
  let isNew = !viewerSpaceObjects.find(o => o.name === u);
  if (img && !userAvatars[u]) {
    loadImage(img, l => {
      userAvatars[u] = l;
      if (isNew) {
        let obj = { name: u, x: random(100, W - 100), y: random(150, H - 300), vx: random(-0.3, 0.3), vy: random(-0.3, 0.3), baseSize: 60, extraSize: 0, color: [random(100, 255), random(100, 255), random(255)], img: l, angle: random(TWO_PI), lastActiveTime: millis(), alpha: 255 };
        viewerSpaceObjects.push(obj);
        joinPopupQueue.push({ name: u, img: l });
      }
    }, () => {});
  } else if (isNew) {
    let obj = { name: u, x: random(100, W - 100), y: random(150, H - 300), vx: random(-0.3, 0.3), vy: random(-0.3, 0.3), baseSize: 60, extraSize: 0, color: [random(100, 255), random(100, 255), random(255)], img: userAvatars[u] || null, angle: random(TWO_PI), lastActiveTime: millis(), alpha: 255 };
    viewerSpaceObjects.push(obj);
    joinPopupQueue.push({ name: u, img: userAvatars[u] || null });
  }
}

function updateUserLikes(u, c) {
  let o = viewerSpaceObjects.find(ob => ob.name === u);
  if (o) {
    o.extraSize = min(150, o.extraSize + c * 2);
    o.lastActiveTime = millis();
    o.alpha = 255;
  } else {
    onUserJoin(u, null);
    setTimeout(() => updateUserLikes(u, c), 500);
  }
}

function onUserQuit(username) {
  viewerSpaceObjects = viewerSpaceObjects.filter(o => o.name !== username);
}

function triggerFollowEvent(name, silent = false) {
  let s = floor(random(3));
  let sx, sy;
  if (s === 0) { sx = random(100, W - 100); sy = -50; } 
  else if (s === 1) { sx = W + 50; sy = random(100, H / 3); } 
  else { sx = -50; sy = random(100, H / 3); }
  
  let tx = W / 2 + random(-200, 200);
  let ty = H / 2 + random(-250, 50);
  let a = atan2(ty - sy, tx - sx);
  let sp = random(18, 28);
  let c = color(random(150, 255), random(100, 255), random(150, 255));
  
  followEvents.push({ name: name, x: sx, y: sy, vx: cos(a) * sp, vy: sin(a) * sp, targetX: tx, targetY: ty, color: c, exploded: false, timer: 100, trail: [] });
  if (!silent && random() < 0.3) {
    speakAnnouncer("Incoming vessel from ", 0);
    speakName(name);
  }
}

function handleFollowEvents() {
  for (let i = followEvents.length - 1; i >= 0; i--) {
    let f = followEvents[i];
    if (!f.exploded) {
      f.trail.push({ x: f.x, y: f.y });
      if (f.trail.length > 15) {
        f.trail.shift();
      }
      noStroke();
      for (let t = 0; t < f.trail.length; t++) {
        fill(red(f.color), green(f.color), blue(f.color), map(t, 0, f.trail.length, 0, 150));
        ellipse(f.trail[t].x, f.trail[t].y, map(t, 0, f.trail.length, 5, 25));
      }
      fill(255);
      ellipse(f.x, f.y, 25);
      fill(f.color);
      ellipse(f.x, f.y, 18);
      f.x += f.vx;
      f.y += f.vy;
      
      if (dist(f.x, f.y, f.targetX, f.targetY) < 30) {
        f.exploded = true;
        playExplosionSound();
        shakeAmount = 5;
        for (let e = 0; e < 50; e++) {
          explosions.push({ x: f.x, y: f.y, vx: random(-12, 12), vy: random(-12, 12), life: 255, col: f.color });
        }
      }
    } else {
      push();
      translate(f.targetX, f.targetY);
      scale(map(f.timer, 100, 0, 1, 4.5));
      textAlign(CENTER, CENTER);
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = f.color;
      fill(0, 150);
      text(f.name, 2, 2);
      fill(255, map(f.timer, 100, 0, 300, -50));
      text(f.name, 0, 0);
      drawingContext.shadowBlur = 0;
      if (f.timer % 4 === 0) {
        noStroke();
        fill(f.color);
        ellipse(random(-40, 40), random(-40, 40), random(2, 5));
      }
      pop();
      f.timer--;
      if (f.timer <= 0) {
        followEvents.splice(i, 1);
      }
    }
  }
}

function handleJoinPopups() {
  if (!activeJoinPopup && joinPopupQueue.length > 0) {
    activeJoinPopup = joinPopupQueue.shift();
    activeJoinPopup.timer = 180;
    if (audioStarted && millis() - lastExpSnd > 50) {
      try {
        fxSynth.play(random([800, 1000, 1200]), 0.1, 0, 0.5);
      } catch(e) {}
      lastExpSnd = millis();
    }
    
    // Vyčištění jména a spojení do jedné spolehlivé hlášky
    let safeName = sanitizeText(activeJoinPopup.name);
    speakAnnouncer("Welcome new commander " + safeName, 2);
  }
  
  if (activeJoinPopup) {
    let p = activeJoinPopup;
    p.timer--;
    let progress = p.timer / 180;
    let sc = 1;
    if (progress > 0.9) sc = map(progress, 1, 0.9, 0, 1);
    if (progress < 0.1) sc = map(progress, 0.1, 0, 1, 0);
    
    push();
    translate(W / 2, H / 2 - 80);
    scale(sc);
    let pulse = sin(frameCount * 0.2) * 15;
    
    drawingContext.shadowBlur = 30 + pulse;
    drawingContext.shadowColor = color(currentTheme[0], currentTheme[1], currentTheme[2]);
    fill(10, 10, 30, 240);
    stroke(currentTheme[0], currentTheme[1], currentTheme[2]);
    strokeWeight(4);
    rectMode(CENTER);
    rect(0, 0, 500 + pulse, 120 + pulse, 15);
    rectMode(CORNER);
    drawingContext.shadowBlur = 0;
    
    if (p.img) {
      imageMode(CENTER);
      image(p.img, -180, 0, 80, 80);
    } else {
      fill(100);
      noStroke();
      ellipse(-180, 0, 80, 80);
      fill(0, 150);
      textAlign(CENTER, CENTER);
      textSize(30);
      text(p.name[0], -180 + 2, 2);
      fill(255);
      text(p.name[0], -180, 0);
    }
    
    textAlign(LEFT, CENTER);
    noStroke();
    textSize(16);
    fill(0, 150);
    text("🔥 NEW COMMANDER! 🔥", -120 + 2, -25 + 2);
    fill(currentTheme[0], currentTheme[1], currentTheme[2]);
    text("🔥 NEW COMMANDER! 🔥", -120, -25);
    textSize(35);
    fill(0, 150);
    text(p.name, -120 + 2, 15 + 2);
    fill(255);
    text(p.name, -120, 15);
    pop();
    
    if (p.timer <= 0) {
      activeJoinPopup = null;
    }
  }
}

function addFloatingText(txt, x, y, col, isJackpot = false) {
  floatingTexts.push({ text: txt, x: x, y: y, life: 255, color: col, scale: isJackpot ? 1.5 : 1, vy: isJackpot ? -2 : -1 });
}

function handleFloatingTexts() {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    let ft = floatingTexts[i];
    push();
    translate(ft.x, ft.y);
    drawTxt(ft.text, 0, 0, color(red(ft.color), green(ft.color), blue(ft.color), ft.life), 14 * ft.scale, CENTER);
    pop();
    ft.y += ft.vy;
    ft.life -= 4;
    if (ft.life <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
}

function createShockwave(x, y) {
  shockwaves.push({ x: x, y: y, radius: 0, maxRadius: 300, life: 255 });
}

function handleShockwaves() {
  noFill();
  strokeWeight(4);
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    let sw = shockwaves[i];
    stroke(255, 255, 255, sw.life);
    ellipse(sw.x, sw.y, sw.radius * 2);
    sw.radius += 10;
    sw.life -= 8;
    if (sw.life <= 0) {
      shockwaves.splice(i, 1);
    }
  }
}

function drawPortals() {
  if (portals.length < 2) return;
  for (let i = 0; i < portals.length; i++) {
    let pt = portals[i];
    push();
    translate(pt.x, pt.y);
    rotate(frameCount * 0.05 * (i === 0 ? 1 : -1));
    fill(i === 0 ? color(0, 150, 255, 150) : color(255, 150, 0, 150));
    noStroke();
    ellipse(0, 0, 50 + sin(frameCount * 0.1) * 10);
    fill(0);
    ellipse(0, 0, 25);
    pop();
  }
}

function drawViewerObjects() {
  for (let i = viewerSpaceObjects.length - 1; i >= 0; i--) {
    let o = viewerSpaceObjects[i];
    let ia = millis() - o.lastActiveTime;
    if (ia > 60000) {
      viewerSpaceObjects.splice(i, 1);
      continue;
    }
    o.alpha = ia > 50000 ? map(ia, 50000, 60000, 255, 0) : 255;
  }
  
  for (let o of viewerSpaceObjects) {
    o.x += o.vx + sin(frameCount * 0.01) * 0.1;
    o.y += o.vy + cos(frameCount * 0.01) * 0.1;
    o.angle += 0.005;
    
    if (o.x < 50 || o.x > W - 50) o.vx *= -1;
    if (o.y < 100 || o.y > H - 250) o.vy *= -1;
    
    push();
    translate(o.x, o.y);
    rotate(o.angle);
    let tS = o.baseSize + o.extraSize;
    noStroke();
    fill(o.color[0], o.color[1], o.color[2], 40 * (o.alpha / 255));
    ellipse(0, 0, tS + 20);
    
    if (o.img) {
      imageMode(CENTER);
      tint(255, o.alpha);
      image(o.img, 0, 0, tS, tS);
    } else {
      fill(o.color[0], o.color[1], o.color[2], o.alpha);
      ellipse(0, 0, tS);
      drawTxt(o.name[0], 0, 0, color(255, o.alpha), tS * 0.3, CENTER);
    }
    
    rotate(-o.angle);
    drawTxt(o.name, 0, tS / 2 + 15, color(255, o.alpha), 10, CENTER);
    pop();
  }
}

function drawWalls() {
  stroke(100);
  strokeWeight(2);
  for (let w of walls) {
    line(w.position.x, H - ZONE_H, w.position.x, H);
  }
}

function createExplosion(x, y, c) {
  let col = c || color(255, random(100, 255), 0);
  for (let i = 0; i < 25; i++) {
    explosions.push({ x: x, y: y, vx: random(-5, 5), vy: random(-5, 5), life: 255, col: col });
  }
}

function drawExplosions() {
  noStroke();
  for (let i = explosions.length - 1; i >= 0; i--) {
    let e = explosions[i];
    fill(red(e.col), green(e.col), blue(e.col), e.life);
    rect(e.x, e.y, 6, 6);
    e.x += e.vx;
    e.y += e.vy;
    e.life -= 5;
    if (e.life <= 0) {
      explosions.splice(i, 1);
    }
  }
}

function drawLegendShape(d) {
  noStroke();
  fill(d.color);
  let s = d.size;
  switch (d.legendId) {
    case "STARMAN": rect(-s / 2, -s / 4, s, s / 2, 5); fill(255); ellipse(-s / 4, -s / 4, s / 5); break;
    case "HAWKING": fill(100); rect(-s / 2, 0, s, s / 4); fill(d.color); rect(-s / 4, -s / 2, s / 2, s / 2); break;
    case "LAIKA": fill(150, 100); ellipse(0, 0, s, s); fill(d.color); ellipse(0, -s / 6, s / 2); break;
    case "ET": fill(100, 50, 0); rect(-s / 2, 0, s, s / 2); fill(255); ellipse(0, -s / 4, s / 2); break;
    case "NYAN": fill(255, 200, 150); rect(-s / 2, -s / 3, s, s / 1.5, 3); break;
    case "VOYAGER": fill(180); ellipse(0, 0, s / 2); fill(212, 175, 55); ellipse(0, 0, s / 3); break;
  }
}

function drawProceduralHUD() {
  push();
  stroke(255, 10);
  strokeWeight(1);
  for (let i = 0; i < H; i += 4) {
    line(0, i + (frameCount % 4), W, i + (frameCount % 4));
  }
  fill(0, 255, 0, 150);
  textSize(8);
  textAlign(LEFT);
  text(`POS_X: ${camOffset.x.toFixed(4)}`, 20, H - 40);
  text(`POS_Y: ${camOffset.y.toFixed(4)}`, 20, H - 30);
  text(`ZOOM: ${camOffset.z.toFixed(4)}`, 20, H - 20);
  
  textAlign(RIGHT);
  text(`SENS_TEMP: ${(24 + noise(frameCount * 0.01) * 5).toFixed(1)}°C`, W - 20, H - 30);
  text(`BUFFER_LOAD: ${balls.length * 2}%`, W - 20, H - 20);
  pop();
}

function drawPixelAvatar(x, y, w, h) {
  push();
  translate(x, y);
  noStroke();
  let vlasy = color(240, 220, 110), kuze = color(245, 200, 170), triko = color(currentTheme[0], currentTheme[1], currentTheme[2]), stin = color(0, 0, 0, 50), oci = color(40);
  let pw = w / 20, ph = h / 15, sway = sin(frameCount * 0.05) * 2, handMove = sin(frameCount * 0.2) * 4, eyesOpen = (frameCount % 120 > 5);
  
  fill(triko); rect(pw * 5 + sway, ph * 7, pw * 10, ph * 8, 2);
  fill(stin); rect(pw * 7 + sway, ph * 7, pw * 6, ph * 1);
  let headSway = sway * 0.5;
  fill(kuze); rect(pw * 6 + headSway, ph * 2, pw * 8, ph * 6, 3);
  fill(vlasy); rect(pw * 5 + headSway, ph * 1, pw * 10, ph * 3, 2); rect(pw * 5 + headSway, ph * 3, pw * 2, ph * 7, 2); rect(pw * 13 + headSway, ph * 3, pw * 2, ph * 7, 2);
  
  if (eyesOpen) {
    fill(oci); rect(pw * 8 + headSway, ph * 4, pw * 1, ph * 2); rect(pw * 11 + headSway, ph * 4, pw * 1, ph * 2);
  } else {
    fill(stin); rect(pw * 8 + headSway, ph * 5, pw * 1, ph * 1); rect(pw * 11 + headSway, ph * 5, pw * 1, ph * 1);
  }
  
  fill(color(200, 100, 100)); rect(pw * 9 + headSway, ph * 7, pw * 2, ph * 1);
  fill(kuze); rect(pw * 3, ph * 8 + handMove, pw * 3, ph * 4, 2); rect(pw * 14, ph * 8 - handMove, pw * 3, ph * 4, 2);
  pop();
}

function drawAntiBotOverlay() {
  push();
  stroke(0, 15);
  strokeWeight(1);
  let offset = frameCount % 4;
  for (let i = 0; i < H; i += 4) {
    line(0, i + offset, W, i + offset);
  }
  noStroke();
  for (let i = 0; i < 20; i++) {
    fill(255, random(5, 25));
    rect(random(W), random(H), random(1, 3), random(1, 3));
  }
  for (let i = 0; i < 10; i++) {
    fill(currentTheme[0], currentTheme[1], currentTheme[2], random(5, 15));
    rect(random(W), random(H), random(1, 4), random(1, 4));
  }
  if (random() < 0.08) {
    fill(currentTheme[0], currentTheme[1], currentTheme[2], 30);
    rect(0, random(H), W, random(1, 6));
  }
  let camX = W - 110, camY = H - 185;
  fill(10, 10, 10, 200);
  stroke(50);
  strokeWeight(2);
  rect(camX, camY, 100, 75, 5);
  drawPixelAvatar(camX + 5, camY + 5, 90, 65);
  noStroke();
  for (let cx = 0; cx < 100; cx += 5) {
    for (let cy = 0; cy < 75; cy += 5) {
      let n = noise(cx * 0.1, cy * 0.1, frameCount * 0.1);
      if (n > 0.6) {
        fill(255, 255, 255, 30);
        rect(camX + cx, camY + cy, 5, 5);
      }
    }
  }
  fill(255, 50, 50);
  textFont('Courier New');
  textStyle(BOLD);
  textSize(10);
  textAlign(LEFT, TOP);
  text("LIVE_PLAYER", camX + 5, camY + 5);
  
  if (frameCount % 60 < 30) {
    fill(255, 0, 0);
    noStroke();
    ellipse(camX + 90, camY + 10, 6, 6);
  }
  
  textFont('Press Start 2P');
  textStyle(NORMAL);
  let marqueeText = `🚀 LIVE SECTOR: ${currentDestination} --- ACTIVE UNITS: ${balls.length} --- SEND LIKES TO POWER UP Shields! --- `;
  let scrollX = W - ((frameCount * 3) % (textWidth(marqueeText) + W));
  fill(5, 5, 15, 230);
  noStroke();
  rect(0, H - 25, W, 25);
  drawTxt(marqueeText + marqueeText, scrollX, H - 12, color(currentTheme), 11, LEFT);
  pop();
}

function drawPegs() {
  noStroke();
  let pR = map(currentGravity, 0.05, 1.95, 0, 255);
  let pG = map(currentGravity, 0.05, 1.95, 255, 100);
  let pB = map(currentGravity, 0.05, 1.95, 255, 0);
  let pC = color(pR, pG, pB);
  
  for (let p of pegs) {
    p.glow = p.glow || 0;
    if (p.glow > 0) {
      fill(pR, pG + 50, pB + 50, p.glow);
      rect(p.position.x - 6, p.position.y - 6, 12, 12);
      p.glow -= 20;
    }
    if (p.isExplosive) {
      fill(255, 100, 0);
      rect(p.position.x - 4, p.position.y - 4, 8, 8);
    } else if (p.isRepulsor) {
      fill(255, 50, 200);
      ellipse(p.position.x, p.position.y, 12 + sin(frameCount * 0.2) * 3);
    } else {
      fill(pC);
      rect(p.position.x - 4, p.position.y - 4, 8, 8);
    }
  }
}

function prepareSingularityEvents() {
  bhSpawnTimes = [];
  if (random() < 0.4) {
    bhSpawnTimes.push(floor(random(5, timer * 0.8)));
  }
}

function checkSingularitySpawn() {
  if (bhSpawnTimes.includes(timer) && !blackHole) {
    let fL = random() < 0.5;
    blackHole = { 
      x: fL ? -150 : W + 150, 
      y: random(200, H - 450), 
      startY: 0, 
      targetX: fL ? W + 250 : -250, 
      speed: random(0.8, 1.5), 
      size: random(12, 18), 
      noiseOffset: random(1000), 
      noiseSpeed: random(0.01, 0.02), 
      wobbleAmp: random(40, 90) 
    };
    blackHole.startY = blackHole.y;
    bhSpawnTimes = bhSpawnTimes.filter(t => t !== timer);
    speakAnnouncer("Warning! Black hole singularity forming!", 1);
  }
}

function handleBlackHole() {
  if (!blackHole) return;
  let d = blackHole.targetX > blackHole.x ? 1 : -1;
  blackHole.x += blackHole.speed * d;
  let n = noise(frameCount * blackHole.noiseSpeed + blackHole.noiseOffset);
  blackHole.y = blackHole.startY + (n - 0.5) * blackHole.wobbleAmp * 2;
  let jS = blackHole.size * (1 + (n - 0.5) * 0.15);
  
  push();
  translate(blackHole.x, blackHole.y);
  noStroke();
  push();
  rotate(frameCount * 0.05);
  for (let i = 0; i < 4; i++) {
    fill(150, 50, 255, 20);
    ellipse(0, 0, jS * 2.5 + i * 15, jS * 0.8 + i * 5);
  }
  pop();
  
  for (let i = 5; i > 0; i--) {
    fill(10 + i * 10, 0, 40 + i * 20, 25);
    ellipse(0, 0, jS + i * (blackHole.size * 0.15) + (n * 10));
  }
  fill(0);
  ellipse(0, 0, jS);
  pop();
  
  for (let i = pegs.length - 1; i >= 0; i--) {
    let p = pegs[i];
    if (dist(blackHole.x, blackHole.y, p.position.x, p.position.y) < jS * 0.55 && random() < 0.23) {
      Matter.Composite.remove(world, p);
      createExplosion(p.position.x, p.position.y);
      playExplosionSound();
      pegs.splice(i, 1);
    }
  }
  
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    if (!b.body) continue;
    let ds = dist(blackHole.x, blackHole.y, b.body.position.x, b.body.position.y);
    if (ds < jS * 0.5) {
      removeBall(b);
      continue;
    }
    if (ds < blackHole.size * 1.87) {
      let sD = Math.max(ds, 30);
      let forceDir = Matter.Vector.normalise(Matter.Vector.sub({ x: blackHole.x, y: blackHole.y }, b.body.position));
      Matter.Body.applyForce(b.body, b.body.position, Matter.Vector.mult(forceDir, (blackHole.size * 0.00018) / (sD / 80)));
    }
  }
  
  if ((d === 1 && blackHole.x > blackHole.targetX) || (d === -1 && blackHole.x < blackHole.targetX)) {
    blackHole = null;
  }
}

function triggerCosmicEvent() {
  if (cosmicEvent) return;
  eventOccurredThisRound = true;
  let fL = random() < 0.5;
  let s = random(25, 45);
  let sx = fL ? -100 : W + 100;
  let ty = H - ZONE_H - random(20, 120);
  
  let b = Matter.Bodies.circle(sx, ty, s / 2, { 
    isStatic: false, isSensor: false, density: 0.1, frictionAir: 0, collisionFilter: { mask: 1 } 
  });
  
  let iC = random() < 0.5;
  cosmicEvent = { body: b, type: iC ? "COMET" : "METEOR", size: s, color: iC ? color(150, 200, 255) : color(255, 100, 50), trail: [] };
  Matter.World.add(world, b);
  Matter.Body.setVelocity(b, { x: fL ? random(12, 18) : random(-12, -18), y: random(-1, 1) });
  
  if (audioStarted && millis() - lastExpSnd > 50) {
    try {
      fxSynth.play(200, 0.1, 0, 0.5);
    } catch(e) {}
    lastExpSnd = millis();
  }
  speakAnnouncer("Warning! Cosmic anomaly detected.", 1);
}

function handleCosmicEvent() {
  if (!cosmicEvent) return;
  let p = cosmicEvent.body.position;
  cosmicEvent.trail.push({ x: p.x, y: p.y, life: 255 });
  if (cosmicEvent.trail.length > 20) {
    cosmicEvent.trail.shift();
  }
  
  push();
  noStroke();
  for (let i = 0; i < cosmicEvent.trail.length; i++) {
    let alpha = map(i, 0, cosmicEvent.trail.length, 0, 150);
    fill(red(cosmicEvent.color), green(cosmicEvent.color), blue(cosmicEvent.color), alpha);
    ellipse(cosmicEvent.trail[i].x, cosmicEvent.trail[i].y, cosmicEvent.size * (i / cosmicEvent.trail.length));
  }
  fill(255);
  ellipse(p.x, p.y, cosmicEvent.size);
  fill(cosmicEvent.color);
  ellipse(p.x, p.y, cosmicEvent.size * 0.8);
  pop();
  
  if (p.x < -300 || p.x > W + 300) {
    Matter.World.remove(world, cosmicEvent.body);
    cosmicEvent = null;
  }
}

function spawnRareLegend() {
  let l = random(RARE_POOL);
  spaceDebris.push({ 
    x: random(50, W - 50), 
    y: -100, 
    type: "LEGEND", 
    legendId: l.id, 
    size: l.size, 
    color: color(l.col[0], l.col[1], l.col[2]), 
    speed: random(0.8, 1.8), 
    vx: random(-0.5, 0.5), 
    rot: random(TWO_PI), 
    rotSpeed: random(-0.06, 0.06), 
    wobble: random(0.02, 0.08), 
    isRare: true 
  });
}

function generateDeepSpaceElements() {
  nebulas = [];
  for (let i = 0; i < 8; i++) {
    let isGalaxy = random() < 0.3;
    nebulas.push({ 
      x: random(W), 
      y: random(H), 
      s: random(isGalaxy ? 150 : 200, isGalaxy ? 300 : 600), 
      col: color(random(50, 255), random(50, 150), random(200, 255), isGalaxy ? 30 : 15), 
      type: isGalaxy ? 'SPIRAL_GALAXY' : 'NEBULA', 
      rotDir: random([-1, 1]) 
    });
  }
  
  massivePlanets = [];
  for (let i = 0; i < 5; i++) {
    let isSun = i === 0 || random() < 0.15;
    let pSize = random(isSun ? 40 : 20, isSun ? 80 : 50);
    let moons = [];
    if (!isSun) {
      let numMoons = floor(random(1, 5));
      for (let m = 0; m < numMoons; m++) {
        moons.push({ dist: random(pSize * 0.7, pSize * 2.5), size: random(3, 12), speed: random(0.01, 0.04), phase: random(TWO_PI), col: color(random(150, 255)) });
      }
    }
    massivePlanets.push({ 
      x: random(W), y: random(H), size: pSize, 
      color: isSun ? color(255, random(200, 255), 150) : color(random(30, 150), random(30, 150), random(30, 150), 200), 
      type: isSun ? 'SUN' : 'PLANET', 
      hasRing: !isSun && random() < 0.5, 
      ringColor: color(random(100, 200), random(100, 200), random(100, 200), 150), 
      speed: random(0.005, 0.015), rot: random(TWO_PI), rotSpeed: random(-0.01, 0.01), moons: moons 
    });
  }
  
  spaceDebris = [];
  for (let i = 0; i < 12; i++) {
    spaceDebris.push({ 
      x: random(W), y: random(H), 
      type: random(["UFO", "SATELLITE", "ASTEROID"]), 
      size: random(10, 25), speed: random(0.3, 1.2), vx: random(-0.5, 0.5), 
      wobble: random(0.02, 0.05), rot: random(TWO_PI), rotSpeed: random(-0.05, 0.05) 
    });
  }
}

function drawGalacticBackground() {
  noStroke();
  for (let n of nebulas) {
    n.y += 0.2 * currentTravelSpeed;
    if (n.y > H + n.s) {
      n.y = -n.s;
    }
    fill(n.col);
    if (n.type === 'SPIRAL_GALAXY') {
      push();
      translate(n.x, n.y);
      rotate(frameCount * 0.001 * n.rotDir);
      for (let i = 0; i < 5; i++) {
        rotate(TWO_PI / 5);
        ellipse(n.s * 0.3, 0, n.s * 0.8, n.s * 0.2);
      }
      pop();
    } else {
      ellipse(n.x, n.y, n.s, n.s * 0.6);
    }
  }
  
  fill(255, 120);
  for (let s of stars) {
    s.y += s.speed * currentTravelSpeed * 5;
    if (s.y > H) {
      s.y = 0;
      s.x = random(W);
    }
    ellipse(s.x, s.y, s.s);
  }
  
  for (let p of massivePlanets) {
    push();
    translate(p.x, p.y);
    p.y += p.speed * currentTravelSpeed * 5;
    p.rot += p.rotSpeed * currentTravelSpeed;
    
    if (p.type === 'SUN') {
      for (let i = 5; i > 0; i--) {
        fill(red(p.color), green(p.color), 100, 25 / i);
        ellipse(0, 0, p.size * (1 + i * 0.6));
      }
      fill(255, 255, 220, 150);
      ellipse(0, 0, p.size * 0.6);
    } else {
      rotate(p.rot);
      if (p.hasRing) {
        noFill();
        stroke(p.ringColor);
        strokeWeight(p.size * 0.1);
        ellipse(0, 0, p.size * 2.2, p.size * 0.6);
        noFill();
        stroke(red(p.ringColor), green(p.ringColor), blue(p.ringColor), 60);
        strokeWeight(p.size * 0.05);
        ellipse(0, 0, p.size * 2.4, p.size * 0.7);
      }
      noStroke();
      fill(p.color);
      ellipse(0, 0, p.size);
      fill(0, 100);
      arc(0, 0, p.size, p.size, HALF_PI, -HALF_PI);
      rotate(-p.rot);
      for (let m of p.moons) {
        let mx = cos(frameCount * m.speed + m.phase) * m.dist;
        let my = sin(frameCount * m.speed + m.phase) * m.dist * 0.5;
        fill(m.col);
        noStroke();
        ellipse(mx, my, m.size);
      }
    }
    pop();
    if (p.y > H + p.size * 3) {
      p.y = -p.size * 3;
      p.x = random(W);
    }
  }
  
  if (gameState === "PLAYING" && random() < 0.08) {
    shootingStars.push({ x: random(W), y: random(-50, H / 2), vx: random(10, 25), vy: random(10, 25), life: 255, len: random(20, 100) });
  }
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];
    stroke(255, s.life);
    strokeWeight(1.5);
    line(s.x, s.y, s.x - s.vx * (s.len / 20), s.y - s.vy * (s.len / 20));
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 10;
    if (s.life <= 0) shootingStars.splice(i, 1);
    noStroke();
  }
  
  if (gameState === "PLAYING" && random() < 0.06) {
    let fL = random() < 0.5;
    ambientComets.push({ x: fL ? -50 : W + 50, y: random(-100, H / 2), vx: fL ? random(2, 5) : random(-5, -2), vy: random(2, 4), s: random(4, 8), life: 255, col: color(random(150, 255), random(200, 255), 255) });
  }
  for (let i = ambientComets.length - 1; i >= 0; i--) {
    let c = ambientComets[i];
    c.x += c.vx * currentTravelSpeed;
    c.y += c.vy * currentTravelSpeed;
    c.life -= 1.5;
    fill(c.col);
    ellipse(c.x, c.y, c.s);
    fill(red(c.col), green(c.col), blue(c.col), 80);
    ellipse(c.x - c.vx * 3, c.y - c.vy * 3, c.s * 1.5);
    if (c.y > H + 50 || c.life <= 0) ambientComets.splice(i, 1);
  }
  
  for (let i = 0; i < spaceDebris.length; i++) {
    for (let j = i + 1; j < spaceDebris.length; j++) {
      let d1 = spaceDebris[i], d2 = spaceDebris[j];
      let ds = (d1.x - d2.x) ** 2 + (d1.y - d2.y) ** 2;
      let md = (d1.size + d2.size) / 2;
      if (ds < md * md) {
        let tVx = d1.vx; d1.vx = d2.vx; d2.vx = tVx;
        let tVy = d1.speed; d1.speed = d2.speed; d2.speed = tVy;
        d1.x += d1.vx * 2; d1.y += d1.speed * 2;
        createExplosion(d1.x, d1.y, color(255, 200, 100));
      }
    }
  }
  
  for (let i = spaceDebris.length - 1; i >= 0; i--) {
    let d = spaceDebris[i];
    push();
    translate(d.x, d.y);
    d.x += d.vx * currentTravelSpeed;
    d.y += d.speed * currentTravelSpeed * 2;
    d.rot += d.rotSpeed * currentTravelSpeed;
    rotate(d.rot);
    if (d.type === "LEGEND") {
      drawLegendShape(d);
    } else if (d.type === "UFO") {
      d.x += sin(frameCount * d.wobble) * 2;
      fill(0, 255, 100, 150);
      rect(-d.size / 2, -d.size / 6, d.size, d.size / 3, 2);
      ellipse(0, -d.size / 6, d.size / 2, d.size / 2);
    } else if (d.type === "SATELLITE") {
      stroke(200, 200, 255, 120); strokeWeight(1); noFill();
      rect(-d.size / 4, -d.size / 4, d.size / 2, d.size / 2);
      line(-d.size, 0, d.size, 0);
      rect(-d.size, -d.size / 6, d.size / 2, d.size / 3);
      rect(d.size / 2, -d.size / 6, d.size / 2, d.size / 3);
    } else {
      fill(80, 150); noStroke();
      rect(-d.size / 2, -d.size / 2, d.size, d.size, 3);
    }
    pop();
    if (d.y > H + 150) {
      if (d.isRare) {
        spaceDebris.splice(i, 1);
      } else {
        d.y = -100;
        d.x = random(W);
      }
    }
  }
  
  if (gameState === "PLAYING") {
    planetSize = lerp(planetSize, 120 + map(timer, 40, 0, 0, 1) * 350, 0.05);
  } else if (gameState === "WAITING") {
    planetSize = lerp(planetSize, 450, 0.01);
  }
  
  if (planetSize > 10) {
    for (let r = 4; r > 0; r--) {
      fill(red(winnerColor), green(winnerColor), blue(winnerColor), 4);
      ellipse(W / 2, H + 60, planetSize * (r * 0.6), planetSize * 0.4);
    }
  }
}

function drawGravityDust() {
  let r = map(currentGravity, 0.05, 1.95, 100, 255);
  let g = map(currentGravity, 0.05, 1.95, 200, 100);
  let b = map(currentGravity, 0.05, 1.95, 255, 50);
  fill(r, g, b, 150);
  noStroke();
  let dustSpeed = currentGravity * 3 * currentTravelSpeed;
  for (let d of dust) {
    d.y += dustSpeed;
    if (d.y > H) {
      d.y = 0;
      d.x = random(W);
    }
    rect(d.x, d.y, d.s, d.s);
  }
}

function triggerMeteorShower() {
  speakAnnouncer("Warning! Incoming meteor shower!", 2);
  shakeAmount = 15;
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      let side = floor(random(3));
      let mx, my, mvx, mvy;
      if (side === 0) { 
        mx = random(W); my = -50; mvx = random(-4, 4); mvy = random(15, 25); 
      } else if (side === 1) { 
        mx = -50; my = random(H/2); mvx = random(15, 25); mvy = random(5, 15); 
      } else { 
        mx = W + 50; my = random(H/2); mvx = random(-25, -15); mvy = random(5, 15); 
      }
      backgroundMeteors.push({ x: mx, y: my, vx: mvx, vy: mvy, size: random(4, 12), c: color(255, random(100, 200), 0), trail: [] });
      if (audioStarted && millis() - lastExpSnd > 100) {
        try { fxSynth.play(random(100, 200), 0.05, 0, 0.1); } catch(e){}
        lastExpSnd = millis();
      }
    }, i * 200);
  }
}

function handleBackgroundMeteors() {
  noStroke();
  for (let i = backgroundMeteors.length - 1; i >= 0; i--) {
    let m = backgroundMeteors[i];
    m.trail.push({ x: m.x, y: m.y });
    if (m.trail.length > 10) {
      m.trail.shift();
    }
    for (let t = 0; t < m.trail.length; t++) {
      fill(red(m.c), green(m.c), blue(m.c), map(t, 0, m.trail.length, 0, 255));
      ellipse(m.trail[t].x, m.trail[t].y, m.size * (t / m.trail.length));
    }
    fill(255);
    ellipse(m.x, m.y, m.size);
    m.x += m.vx;
    m.y += m.vy;
    if (m.y > H + 100 || m.x < -100 || m.x > W + 100) {
      backgroundMeteors.splice(i, 1);
    }
  }
}

function initGame() {
  engine = Matter.Engine.create();
  world = engine.world;
  let opts = { isStatic: true, restitution: 2.2, friction: 0 };
  Matter.World.add(world, [
    Matter.Bodies.rectangle(-25, H / 2, 50, H * 2, opts),
    Matter.Bodies.rectangle(W + 25, H / 2, 50, H * 2, opts)
  ]);
  Matter.World.add(world, [
    Matter.Bodies.rectangle(W / 2, H + 48, W, 100, { isStatic: true, friction: 1 })
  ]);
  
  const p = [
    "SPIRAL", "WAVES", "HOURGLASS", "GALAXY", "DIAMOND", "HYPERCUBE", 
    "DNA_HELIX", "SATURN_RINGS", "HEXAGON_GRID", "PYRAMID", "FRACTAL_TREE", 
    "SHAPE_HEART", "SHAPE_APPLE", "SHAPE_ALIEN"
  ];
  const mode = random(p);
  let nP = floor(random(300, 450));
  let pR = map(currentBounce, 1, 99, 0.1, 1.8);
  
  let blocker = Matter.Bodies.circle(W / 2, 130, 4, { isStatic: true, restitution: pR });
  pegs.push(blocker);
  Matter.World.add(world, blocker);
  
  if (random() < 0.2) {
    portals = [
      { x: random(100, W - 100), y: random(200, H / 2 - 100) },
      { x: random(100, W - 100), y: random(H / 2 + 100, H - 250) }
    ];
  }
  
  if (mode.startsWith("SHAPE_")) {
    let sh = SHAPES[mode.split("_")[1]] || SHAPES["HEART"];
    let rws = sh.length, cls = sh[0].length, sp = 38, sx = (W - (cls * sp)) / 2, sy = 250;
    for (let i = 0; i < 20; i++) {
      pegs.push(Matter.Bodies.circle(map(i, 0, 19, 40, sx - 40), map(i, 0, 19, 150, 800), 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } }));
      Matter.World.add(world, pegs[pegs.length - 1]);
      pegs.push(Matter.Bodies.circle(map(i, 0, 19, W - 40, sx + (cls * sp) + 40), map(i, 0, 19, 150, 800), 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } }));
      Matter.World.add(world, pegs[pegs.length - 1]);
    }
    for (let r = 0; r < rws; r++) {
      for (let c = 0; c < cls; c++) {
        if (sh[r][c] === '*') {
          let pg = Matter.Bodies.circle(sx + c * sp + random(-1, 1), sy + r * sp + random(-1, 1), 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } });
          pg.isExplosive = random() < 0.04;
          pg.isRepulsor = !pg.isExplosive && random() < 0.04;
          pegs.push(pg);
          Matter.World.add(world, pg);
        }
      }
    }
  } else {
    for (let i = 0; i < nP; i++) {
      let px, py, v = false, a = 0;
      while (!v && a < 50) {
        a++;
        switch (mode) {
          case "SPIRAL": let an = i * 0.15, r = 15 + i * 2.0; px = W / 2 + cos(an) * r; py = 200 + i * 2.5; break;
          case "WAVES": px = map(i % 20, 0, 20, 50, W - 50); py = 220 + floor(i / 20) * 60 + sin(i * 0.5) * 40; break;
          case "HOURGLASS": let rH = floor(i / 15), cH = i % 15, shk = abs(rH - 15) * 12; px = map(cH, 0, 15, 100 + shk, W - 100 - shk); py = 200 + rH * 40; break;
          case "GALAXY": let aG = random(TWO_PI), rd = pow(random(), 0.5) * 400; px = W / 2 + cos(aG) * rd; py = 500 + sin(aG) * rd; break;
          case "DIAMOND": let rD = floor(i / 18), cD = i % 18; px = W / 2 + (cD - 9) * 22; py = 200 + rD * 40 + abs(cD - 9) * 12; break;
          case "PYRAMID": let lP = floor(i / 20), pL = i % 20; px = W / 2 + (pL - 10) * (22 - lP * 1.5); py = 200 + lP * 40; break;
          case "HYPERCUBE": let ix = i % 10, iy = floor(i / 10) % 10, iz = floor(i / 100); px = W / 2 - 200 + ix * 40 + iz * 20; py = 250 + iy * 40 + iz * 20; break;
          case "DNA_HELIX": let t = i * 0.1, sD = (i % 2 === 0) ? 1 : -1; px = W / 2 + sD * cos(t) * 150; py = 200 + i * 6; break;
          case "SATURN_RINGS": let aS = random(TWO_PI), dS = (i < nP / 2) ? random(80, 150) : random(250, 350); px = W / 2 + cos(aS) * dS; py = 500 + sin(aS) * dS * 0.4; break;
          case "HEXAGON_GRID": let hR = floor(i / 12), hC = i % 12; px = 100 + hC * 60 + (hR % 2) * 30; py = 200 + hR * 60; break;
          case "FRACTAL_TREE": let lv = floor(log(i + 1) / log(2)); px = W / 2 + (i % pow(2, lv) - pow(2, lv) / 2) * (W / pow(2, lv)); py = 200 + lv * 80; break;
          default: px = random(60, W - 60); py = random(180, H - 220); break;
        }
        if (py > 150 && py < H - 150 && px > 40 && px < W - 40) {
          let tc = false;
          for (let ot of pegs) {
            if (dist(px, py, ot.position.x, ot.position.y) < 35) {
              tc = true;
              break;
            }
          }
          if (!tc) v = true;
        } else if (a > 45) {
          break;
        }
      }
      if (v) {
        let pg = Matter.Bodies.circle(px, py, 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } });
        pg.isExplosive = random() < 0.04;
        pg.isRepulsor = !pg.isExplosive && random() < 0.04;
        pegs.push(pg);
        Matter.World.add(world, pg);
      }
    }
  }
  
  for (let i = 0; i < 150; i++) {
    let px = random(60, W - 60);
    let py = random(180, H - 200);
    let v = true;
    for (let ot of pegs) {
      if (dist(px, py, ot.position.x, ot.position.y) < 35) {
        v = false;
        break;
      }
    }
    if (v) {
      let pg = Matter.Bodies.circle(px, py, 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } });
      pg.isExplosive = random() < 0.04;
      pg.isRepulsor = !pg.isExplosive && random() < 0.04;
      pegs.push(pg);
      Matter.World.add(world, pg);
    }
  }
  
  let sV = [5000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000];
  let cX = 0;
  zones = [];
  for (let i = 0; i < 21; i++) {
    let zW = (map(abs(i - 10), 0, 10, 2.5, 1.0) / 36.1) * W;
    let val = sV[i];
    zones.push({ 
      x: cX, w: zW, score: val, flash: 0, flashColor: color(255), 
      baseColor: val >= 5000 ? color(50, 45, 15, 180) : color(10, 10, 40, 180),
      capacity: Math.max(5, Math.floor((zW * ZONE_H) / 200)) 
    });
    if (i > 0) {
      let wl = Matter.Bodies.rectangle(cX, H - (ZONE_H / 2), 6, ZONE_H, { isStatic: true, friction: 0.5 });
      walls.push(wl);
      Matter.World.add(world, wl);
    }
    cX += zW;
  }
}

function resetGame() {
  leaderboard = {};
  totalBallsFired = 0;
  roundCount++;
  gameState = "PLAYING";
  resultsTimer = 10;
  eventOccurredThisRound = false;
  currentDestination = generatePlanetName();
  timer = floor(random(40, 181));
  currentTheme = random(UI_THEMES);
  
  if (isAutoMode) {
    autoRandomSettings();
  }
  if (world) {
    Matter.World.clear(world, false);
  }
  
  pegs = [];
  walls = [];
  balls = [];
  blackHole = null;
  cosmicEvent = null;
  shootingStars = [];
  ambientComets = [];
  portals = [];
  floatingTexts = [];
  shockwaves = [];
  boss = null;
  backgroundMeteors = [];
  followEvents = [];
  
  initGame();
  generateDeepSpaceElements();
  prepareSingularityEvents();
  planSpaceshipForRound();
  planBossForRound();
  nextMeteorShowerTime = millis() + 66000;
  
  let delay = 0;
  while (spawnQueue.length > 0) {
    let u = spawnQueue.shift();
    setTimeout(() => spawnBall(u), delay * 100);
    delay++;
  }
  speakAnnouncer(`Welcome to sector ${currentDestination}.`, 1);
}

function mouseClicked() { 
  if (!audioStarted) {
    startSpaceAudio(); 
  }
  
  if (mouseY <= 75) { 
    if (mouseX < 100) { 
      triggerFollowEvent(random(TEST_BOTS)); 
    } else { 
      spawnBall(random(TEST_BOTS)); 
      shakeAmount = 2; 
    }
    return; 
  } 
  
  if (mouseX > W - 280 && mouseX < W && mouseY > 85 && mouseY < 405) { 
    leaderboard = {}; 
    shakeAmount = 4; 
    return; 
  } 
  
  if (mouseX > 10 && mouseX < 280 && mouseY > 85 && mouseY < 345) { 
    allTimeRecords = []; 
    localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords)); 
    shakeAmount = 5; 
    return; 
  } 
}
