// --- GALAXINKO (v7.0.0 - VERTICAL TIKTOK & CLEAN UI) ---
const GAME_TITLE = "GALAXINKO";
let engine, world;
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
let currentBounce = 50;
let spawnPerEvent = 1;
let currentShipChance = 30;

// --- ROZLIŠENÍ & TIKTOK SAFE ZONE ---
const W = 900;
const H = 1600; // 9:16 vertikální rozlišení
const SAFE_ZONE_H = 350; // Spodní prostor vyhrazený pro TikTok chat
const ZONE_H = 100;

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

// --- AI ANNOUNCER ---
let availableVoices = [];
let lastSpokeTime = 0;

const badWordsRegex = /(n[i1l]gg[e3]r|n[i1l]gg[a4]|f[u4]ck|sh[i1]t|b[i1]tch|c[u4]nt|wh[o0]re|sl[u4]t|f[a4]g|d[i1]ck|c[o0]ck|p[u4]ssy|r[e3]t[a4]rd|r[a4]p[e3]|s[u4]ck|k[i1]ll|n[a4]z[i1]|j[e3]w|h[i1]tl[e3]r)/gi;

function initTTS() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.includes('en'));
    };
  }
}

function sanitizeText(text) {
  if(!text) return "Commander";
  let s = text.replace(badWordsRegex, "Bleep");
  s = s.replace(/[^a-zA-Z0-9 ]/g, ""); 
  s = s.replace(/(.)\1{3,}/g, "$1$1"); 
  return s.trim() || "Commander";
}

function getHoustonStory(playerName) {
  const intros = [
    "Houston here. ", "Command center to live feed. ", "Galactic broadcast is online. ", 
    "Telemetry update. ", "Attention space crew! ", "Live observation deck reporting. "
  ];
  const actions = [
    `Astronaut Dave just spilled zero-G coffee on the main console because of ${playerName}. `,
    `We are detecting a massive energy surge from ${playerName}'s coordinates. `,
    `Someone left the airlock open again, please check your live feed. `,
    `Captain, ${playerName} is single-handedly carrying this live operation. `,
    `The alien lifeforms are requesting more dropping units from ${playerName}. `,
    `Oxygen levels are stable, but the fun meter on this stream is off the charts. `,
    `Our radars show ${playerName} is doing some crazy unauthorized maneuvers. `,
    `Warning, we have a rogue space-cat in the engine room, but ${playerName} is handling it. `
  ];
  const outros = [
    "Keep it up on the live stream!", "Awaiting further instructions.", "Over and out.", 
    "Let's see what happens next.", "May the space force be with you.", "Continuing observation."
  ];
  return random(intros) + random(actions) + random(outros);
}

function speakAnnouncer(phrase, priority = 0) {
  if (!audioStarted || !('speechSynthesis' in window)) return;
  if (window.speechSynthesis.speaking && priority < 1) return;
  if (window.speechSynthesis.pending && priority < 2) return;

  let utter = new SpeechSynthesisUtterance(phrase);
  utter.lang = 'en-US';
  if (availableVoices.length > 0) utter.voice = random(availableVoices);
  utter.pitch = random(0.5, 0.8); 
  utter.rate = random(0.9, 1.1);  
  utter.volume = random(0.7, 1.0);
  
  window.speechSynthesis.speak(utter);
}

// --- ANTI-BOT VARIABLES ---
let camOffset = { x: 0, y: 0, z: 1.0 };
let targetFPS = 60;
const TEST_BOTS = ["ALFA", "CYBER", "GALAXY", "NEBULA", "STAR", "COMET", "VOID", "ORBITAL"];

// --- TIKFINITY WEBSOCKET ---
let socket;
const TIKFINITY_URL = "ws://localhost:21213/";

let settingsPanelVisible = false;
let isAutoMode = false;
let gravitySlider, bounceSlider, spawnPerEventSlider, shipChanceSlider, autoButton, keyButton;

function connectTikfinity() {
  socket = new WebSocket(TIKFINITY_URL);
  socket.onopen = () => { console.log("[Tikfinity] Připojeno – čekám na události"); };
  socket.onmessage = (event) => {
    try {
      let data = JSON.parse(event.data);
      let evt = data?.event || data?.type || "";
      let possibleName = data?.data?.nickname || data?.data?.uniqueId || data?.nickname || data?.user?.nickname || data?.uniqueId || "Anonym";
      
      if (possibleName && possibleName !== "Anonym") {
        let name = possibleName.toUpperCase().substring(0, 12);
        let safeName = sanitizeText(name);
        
        onUserJoin(name, data?.data?.profilePictureUrl || data?.profilePictureUrl || "");
        
        if (evt === "chat") {
            let comment = data?.data?.comment || "";
            let chars = comment.length;
            let ballCount = Math.min(chars, 15);
            
            for (let i = 0; i < ballCount; i++) {
                setTimeout(() => spawnBall(name), i * 150);
            }
            
            if (millis() - lastSpokeTime > 8000) {
                speakAnnouncer(getHoustonStory(safeName), 0);
                lastSpokeTime = millis();
            }
        }
        else if (evt !== "like" && evt !== "chat") {
          for (let s = 0; s < spawnPerEvent; s++) { spawnBall(name); }
        }
        
        if (evt === "like") {
          let count = data.data?.likeCount || 1;
          updateUserLikes(name, count);
          
          if (millis() - lastSpokeTime > 9000) {
             speakAnnouncer(random([`Houston to ${safeName}, energy shields are boosted thanks to your transmission!`, `Live feed confirms power up from ${safeName}.`]), 0);
             lastSpokeTime = millis();
          }
          
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              for (let s = 0; s < spawnPerEvent; s++) { spawnBall(name); }
            }, i * 120);
          }
        }
      }
    } catch (err) {}
  };
  socket.onerror = (err) => { console.error("[Tikfinity WS error]", err); };
  socket.onclose = () => {
    console.log("[Tikfinity] Odpojeno – reconnect za 5s...");
    setTimeout(connectTikfinity, 5000);
  };
}

let stars = [];
let dust = [];
let massivePlanets = [];
let spaceDebris = [];
let currentComet = null;
let planetSize = 0;
let currentTravelSpeed = 1.0;
let blackHole = null;
let bhSpawnTimes = [];
let musicScale = [48, 52, 55, 57, 60, 64, 67, 72];
let nextNoteTime = 0;
let bhOsc;

const RARE_POOL = [
  {id: "STARMAN", name: "ELON'S TESLA", col: [200, 0, 0], size: 28},
  {id: "HAWKING", name: "S. HAWKING", col: [50, 50, 255], size: 22},
  {id: "LAIKA", name: "LAIKA DOG", col: [200, 180, 150], size: 18},
  {id: "ET", name: "E.T. PHONE HOME", col: [150, 120, 80], size: 24},
  {id: "NYAN", name: "NYAN CAT", col: [255, 100, 200], size: 25},
  {id: "VOYAGER", name: "VOYAGER 1", col: [180, 180, 180], size: 30},
  {id: "OUMUAMUA", name: "OUMUAMUA", col: [60, 40, 30], size: 45},
  {id: "SHUTTLE", name: "NASA SHUTTLE", col: [255, 255, 255], size: 35}
];

let synth, fxSynth, backgroundOsc, backgroundOsc2;
let audioStarted = false;
let allTimeRecords = Array(8).fill({ name: "NONE", score: 0, color: [100, 100, 100] });

const SHAPES = {
  "HEART": [" ***** ***** ", " ******* ******* ", "*****************", "*****************", " *************** ", " ************* ", " *********** ", " ********* ", " ***** ", " *** ", " * "],
  "APPLE": [" *** ", " **** ", " ** ", " ********** ", " ************** ", " ****************", " ****************", " ****************", " ************** ", " ********** "],
  "ALIEN": [" ******* ", " *********** ", " *************** ", " *** ***** *** ", " *** ***** *** ", " *************** ", " ************* ", " *** *** "],
  "HOUSE": [" * ", " *** ", " ***** ", " ******* ", " ********* ", " *********** ", " *********** ", " *** *** *** ", " *** *** *** ", " *********** "],
  "SWORD": [" * ", " *** ", " *** ", " *** ", " *** ", " *** ", " ************* ", " ************* ", " *** ", " *** ", " * "],
  "MUSHROOM": [" ***** ", " ********* ", " ************* ", " *************** ", " *************** ", " *** *** ", " ********* ", " ********* "]
};

function preload() {
  let script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
  script.onload = () => { libraryLoaded = true; };
  document.head.appendChild(script);
  let link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  let saved = localStorage.getItem('galaxinko_records');
  if (saved) allTimeRecords = JSON.parse(saved);
}

function setup() {
  createCanvas(W, H);
  noSmooth();
  textFont('Press Start 2P');
  winnerColor = color(0, 0, 128);
  synth = new p5.PolySynth();
  fxSynth = new p5.PolySynth();
  backgroundOsc = new p5.Oscillator('sine');
  backgroundOsc2 = new p5.Oscillator('sine');
  bhOsc = new p5.Oscillator('triangle');
  for(let i = 0; i < 150; i++) stars.push({ x: random(W), y: random(H), s: random(1, 2.5), speed: random(0.1, 0.4) });
  for(let i = 0; i < 500; i++) dust.push({ x: random(W), y: random(H), s: random(0.5, 1.5) });
  currentGravity = random(0.05, 1.95);
  currentBounce = floor(random(1, 100));
  timer = floor(random(40, 181));
  currentDestination = generatePlanetName();
  currentTheme = random(UI_THEMES); 

  generateDeepSpaceElements();
  prepareSingularityEvents();
  planSpaceshipForRound();
  initTTS();
  connectTikfinity();
  
  keyButton = createButton('🔑');
  keyButton.position(15, 15);
  keyButton.style('font-size', '28px');
  keyButton.style('background', 'transparent');
  keyButton.style('border', 'none');
  keyButton.style('color', 'rgba(255,255,255,0.15)');
  keyButton.style('cursor', 'pointer');
  keyButton.mousePressed(toggleSettings);
  gravitySlider = createSlider(0.01, 5.0, currentGravity, 0.01);
  gravitySlider.position(40, 60);
  gravitySlider.style('width', '220px');
  gravitySlider.hide();

  bounceSlider = createSlider(1, 200, currentBounce, 1);
  bounceSlider.position(40, 110);
  bounceSlider.style('width', '220px');
  bounceSlider.hide();

  spawnPerEventSlider = createSlider(1, 50, spawnPerEvent, 1);
  spawnPerEventSlider.position(40, 160);
  spawnPerEventSlider.style('width', '220px');
  spawnPerEventSlider.hide();
  
  shipChanceSlider = createSlider(0, 100, currentShipChance, 1);
  shipChanceSlider.position(40, 210);
  shipChanceSlider.style('width', '220px');
  shipChanceSlider.hide();

  autoButton = createButton('AUTO RANDOM: OFF');
  autoButton.position(40, 260);
  autoButton.style('width', '220px');
  autoButton.hide();
  autoButton.mousePressed(toggleAutoMode);
}

function toggleSettings() {
  settingsPanelVisible = !settingsPanelVisible;
  if (settingsPanelVisible) {
    gravitySlider.show(); bounceSlider.show(); spawnPerEventSlider.show(); shipChanceSlider.show(); autoButton.show();
  } else {
    gravitySlider.hide(); bounceSlider.hide(); spawnPerEventSlider.hide(); shipChanceSlider.hide(); autoButton.hide();
  }
}

function toggleAutoMode() {
  isAutoMode = !isAutoMode;
  if (isAutoMode) {
    autoButton.html('AUTO RANDOM: ON'); autoButton.style('background-color', '#4CAF50'); autoRandomSettings();
  } else {
    autoButton.html('AUTO RANDOM: OFF'); autoButton.style('background-color', '');
  }
}

function autoRandomSettings() {
  currentGravity = random(0.05, 1.95);
  currentBounce = floor(random(1, 100));
  spawnPerEvent = floor(random(1, 4)); 
  currentShipChance = floor(random(0, 101));
  
  gravitySlider.value(currentGravity); bounceSlider.value(currentBounce);
  spawnPerEventSlider.value(spawnPerEvent); shipChanceSlider.value(currentShipChance);
  if (world) world.gravity.y = currentGravity;
}

function planSpaceshipForRound() {
    if (random(100) < currentShipChance) {
        shipPlanned = true;
        shipSpawnAt = floor(random(10, timer - 10)); 
    } else {
        shipPlanned = false;
        shipSpawnAt = -1;
    }
}

function spawnSpaceship() {
    let shipW = 140; let shipH = 25; let shipY = H - SAFE_ZONE_H - ZONE_H - 150;
    let body = Matter.Bodies.rectangle(-200, shipY, shipW, shipH, { isStatic: true, restitution: 1.5, friction: 0 });
    Matter.World.add(world, body);
    starship = { body: body, w: shipW, h: shipH, y: shipY, targetX: W/2, speed: 6, activeFrames: 0, maxFrames: 60 * 25, state: "ENTERING" };
    speakAnnouncer(random(["Houston, unidentified Starship is entering the live broadcast area.", "Radar picks up a vessel on the live feed!"]), 1);
}

function handleSpaceship() {
    if (!starship) return;
    starship.activeFrames++;

    if (starship.state === "ENTERING") {
        starship.targetX = W/2;
        if (abs(starship.body.position.x - W/2) < 20) starship.state = "ACTIVE";
    } else if (starship.state === "ACTIVE") {
        if (frameCount % 45 === 0) starship.targetX = random(100, W - 100);
        if (starship.activeFrames > starship.maxFrames) starship.state = "LEAVING";
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
    let moveX = 0;
    if (abs(dx) > starship.speed) moveX = dx > 0 ? starship.speed : -starship.speed;
    
    Matter.Body.setPosition(starship.body, { x: pos.x + moveX, y: starship.y });

    push();
    translate(pos.x, starship.y);
    noStroke();
    fill(20, 20, 50);
    rect(-starship.w/2, -starship.h/2, starship.w, starship.h, 12);
    
    stroke(currentTheme[0], currentTheme[1], currentTheme[2], 200 + sin(frameCount * 0.2) * 55);
    strokeWeight(3); noFill();
    rect(-starship.w/2, -starship.h/2, starship.w, starship.h, 12);
    
    noStroke();
    fill(255, 50, 200, 180 + sin(frameCount * 0.4) * 75);
    ellipse(0, 0, starship.w * 0.4, starship.h * 0.4);
    
    fill(currentTheme[0], currentTheme[1], currentTheme[2], 150);
    triangle(-starship.w/2 + 10, starship.h/2, -starship.w/2 + 25, starship.h/2 + 20, -starship.w/2 + 40, starship.h/2);
    triangle(starship.w/2 - 40, starship.h/2, starship.w/2 - 25, starship.h/2 + 20, starship.w/2 - 10, starship.h/2);
    pop();
}

function startSpaceAudio() {
  if (audioStarted) return;
  userStartAudio();
  backgroundOsc.start(); backgroundOsc.amp(0.02, 2); backgroundOsc.freq(55);
  backgroundOsc2.start(); backgroundOsc2.amp(0.01, 2); backgroundOsc2.freq(110);
  bhOsc.start(); bhOsc.amp(0);
  audioStarted = true;
  speakAnnouncer("Houston to ground control. We are live and systems are fully operational.", 2);
}

function playSpawnSound() {
  if (!audioStarted) return;
  let scale = [440, 493.88, 554.37, 659.25, 739.99, 880];
  fxSynth.play(random(scale) + random(-5, 5), random(0.02, 0.05), 0, random(0.05, 0.15));
}
function playJackpotSound() {
  if (!audioStarted) return;
  synth.play('C5', 0.1, 0, 0.1); setTimeout(() => synth.play('E5', 0.1, 0, 0.1), 100);
  setTimeout(() => synth.play('G5', 0.1, 0, 0.2), 200); setTimeout(() => synth.play('C6', 0.2, 0, 0.5), 300);
}
function playExplosionSound() { if (!audioStarted) return; fxSynth.play(random(50, 150), 0.1, 0, 0.2); }
function playCleanupSound() { if (!audioStarted) return; fxSynth.play(100, 0.05, 0, 1.0); }
function playTimerEndSequence() {
  if (!audioStarted) return;
  let endNotes = [600, 400, 250, 100];
  for (let i = 0; i < endNotes.length; i++) {
    setTimeout(() => {
      if (gameState === "WAITING") {
        fxSynth.play(endNotes[i] + random(-20, 20), 0.08, 0, 0.4); shakeAmount = random(2, 4);
      }
    }, i * 400);
  }
  flashEffect = 60;
}
function updateJukebox() {
  if (!audioStarted || gameState !== "PLAYING") return;
  if (millis() > nextNoteTime) {
    let note = random(musicScale);
    synth.play(pow(2, (note - 69) / 12) * 440, 0.01, 0, 1.5); nextNoteTime = millis() + random(2000, 5000);
  }
}

function draw() {
  if (!libraryLoaded) return;
  if (!engine) initGame();
  
  if (settingsPanelVisible) {
    if (gravitySlider.value() !== currentGravity || bounceSlider.value() !== currentBounce || spawnPerEventSlider.value() !== spawnPerEvent || shipChanceSlider.value() !== currentShipChance) {
       if (isAutoMode) toggleAutoMode();
       currentGravity = gravitySlider.value(); currentBounce = bounceSlider.value();
       spawnPerEvent = spawnPerEventSlider.value(); currentShipChance = shipChanceSlider.value();
       if (world) world.gravity.y = currentGravity;
    }
  }

  if (frameCount % 60 === 0) targetFPS = random(57, 60);
  frameRate(targetFPS);
  updateJukebox();
  push();
  
  camOffset.x = (noise(frameCount * 0.005) - 0.5) * 40;
  camOffset.y = (noise(frameCount * 0.005 + 100) - 0.5) * 40;
  camOffset.z = 1.0 + (noise(frameCount * 0.002) - 0.5) * 0.05;
  
  translate(W/2, H/2);
  scale(camOffset.z);
  translate(-W/2 + camOffset.x, -H/2 + camOffset.y);
  
  if (shakeAmount > 0) {
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount)); shakeAmount *= 0.92;
  }
  
  updateWinnerColor();
  updateTravelSpeed();
  background(2, 2, 8);
  drawGravityDust();
  drawGalacticBackground();
  
  // Ztmavení plochy pro lepší kontrast
  fill(0, 150);
  rect(0, 0, W, H);
  
  drawViewerObjects();
  
  try { Matter.Engine.update(engine, 1000 / 60); } catch (e) { console.error("Engine Error"); }
  
  handleBlackHole();
  handleCosmicEvent();
  handleSpaceship();
  
  if (millis() - lastTick > 1000) {
    if (gameState === "PLAYING") {
      timer--;
      checkSingularitySpawn();
      
      if (shipPlanned && !starship && timer === shipSpawnAt) spawnSpaceship();

      if (!eventOccurredThisRound && timer < (timer * 0.7) && random() < 0.17) triggerCosmicEvent();
      if (random() < 0.11) spawnRareLegend();
      
      if (timer === 10) speakAnnouncer("Houston, we have 10 seconds remaining on the live feed.", 1);
      
      if (timer <= 0) {
        gameState = "WAITING";
        waitStartTime = millis();
        shakeAmount = 6;
        playCleanupSound();
        playTimerEndSequence();
        speakAnnouncer("Sector operations complete. Returning units to base.", 2);
      }
    } else if (gameState === "RESULTS") {
      resultsTimer--;
      if (resultsTimer <= 0) resetGame();
    }
    lastTick = millis();
  }
  
  if (gameState === "WAITING") {
    let timeSinceWait = (millis() - waitStartTime) / 1000;
    if (balls.length === 0 || timeSinceWait > 10) {
      gameState = "RESULTS";
      resultsTimer = 10;
      
      let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score);
      if (sorted.length > 0) {
          let winnerName = sanitizeText(sorted[0][0]);
          speakAnnouncer(`Round over! The ultimate commander of this sector is ${winnerName}. Great job!`, 2);
      } else {
          speakAnnouncer(`Round over. No active commanders this time.`, 2);
      }
    }
  }
  
  drawZones();
  drawWalls();
  drawPegs();
  drawBalls();
  drawExplosions();
  drawUI();
  
  if (gameState === "WAITING") drawWaitingMessage();
  if (gameState === "RESULTS") drawResultsOverlay();
  
  drawProceduralHUD();
  drawAntiBotOverlay();
  
  if (settingsPanelVisible) {
    push();
    fill(0, 0, 30, 220); rect(20, 80, 300, 290, 12);
    fill(currentTheme[0], currentTheme[1], currentTheme[2]); textSize(14); text("TEST SETTINGS 🔧", 40, 105);
    textSize(11); fill(255);
    text(`GRAVITY (${currentGravity.toFixed(2)})`, 40, 145);
    text(`BOUNCE (${currentBounce})`, 40, 195);
    text(`SPAWN PER JOIN (${spawnPerEvent})`, 40, 245);
    text(`SHIP SPAWN % (${currentShipChance})`, 40, 295);
    pop();
  }
  
  if (flashEffect > 0) {
    noStroke(); fill(20, 40, 100, map(flashEffect, 0, 60, 0, 100));
    rect(0, 0, W, H); flashEffect--;
  }

  pop();
}

function spawnBall(userName) {
  if (!libraryLoaded || gameState !== "PLAYING") return;
  if (!audioStarted) startSpaceAudio();
  playSpawnSound();
  totalBallsFired++;
  let ballRestitution = map(currentBounce, 1, 99, 0.4, 0.9);
  let spawnX = W/2 + random(-15, 15);
  let ballBody = Matter.Bodies.rectangle(spawnX, 90, 10, 10, {
    restitution: ballRestitution, friction: 0.2, frictionAir: 0.04, density: 0.001
  });
  if (!leaderboard[userName]) {
    leaderboard[userName] = { score: 0, color: color(random(100,255), random(100,255), random(100,255)) };
  }
  balls.push({
    body: ballBody, name: userName, color: leaderboard[userName].color, scored: false, combo: 0, lastHitTime: 0, lastShipHit: 0, spawnTime: millis()
  });
  Matter.World.add(world, ballBody);
}

function drawBalls() {
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    if (!b.body) { balls.splice(i, 1); continue; }
    let pos = b.body.position;
    if (isNaN(pos.x) || isNaN(pos.y)) { removeBall(b); continue; }
    
    push();
    translate(pos.x, pos.y);
    rotate(b.body.angle);
    
    if (b.combo > 2) { fill(255); noStroke(); rect(-7, -7, 14, 14); }
    fill(b.color); stroke(255); strokeWeight(1); rect(-5, -5, 10, 10);
    rotate(-b.body.angle);
    
    // OMEZENÍ TEXTOVÉHO SMOGU (zmizí po 3 sec, objeví se dole u skórování)
    let age = millis() - b.spawnTime;
    let showName = age < 3000 || b.scored;

    if (showName) {
        fill(0, 150); noStroke(); textAlign(CENTER); textSize(11); text(b.name, 1, -13);
        fill(b.color); text(b.name, 0, -14);
    }
    
    if (b.combo > 0) { 
        fill(0, 150); textSize(13); text("x" + b.combo, 1, -25);
        fill(255, 200, 0); text("x" + b.combo, 0, -26); 
    }
    pop();
    
    if (b.combo > 0 && millis() - b.lastHitTime > 2000) b.combo = 0;

    if (starship && starship.state === "ACTIVE") {
        if (abs(pos.x - starship.body.position.x) < starship.w/2 + 10 && abs(pos.y - starship.y) < starship.h/2 + 10) {
            if (millis() - (b.lastShipHit || 0) > 500) {
                b.lastShipHit = millis(); b.combo += 2; b.lastHitTime = millis();
                updateScore(b.name, 100, b.color);
                createExplosion(pos.x, pos.y, b.color); playExplosionSound();
                let force = { x: (pos.x - starship.body.position.x) * 0.0001, y: -0.015 };
                Matter.Body.applyForce(b.body, pos, force);
                
                if (random() < 0.2) speakAnnouncer(random([`A live collision recorded from ${sanitizeText(b.name)}!`, `Vessel hit by ${sanitizeText(b.name)}!`, `Houston, ship has been impacted by ${sanitizeText(b.name)}.`]), 0);
            }
        }
    }

    for (let j = pegs.length - 1; j >= 0; j--) {
      let p = pegs[j];
      if (dist(pos.x, pos.y, p.position.x, p.position.y) < 14) {
          p.glow = 255; b.combo += 1; b.lastHitTime = millis();
          if (p.isExplosive) {
              createExplosion(p.position.x, p.position.y, color(255, 150, 0));
              playExplosionSound();
              let forceDir = Matter.Vector.sub(pos, p.position);
              let force = Matter.Vector.mult(Matter.Vector.normalise(forceDir), 0.02);
              Matter.Body.applyForce(b.body, pos, force);
              Matter.World.remove(world, p); pegs.splice(j, 1);
          }
      }
    }
    
    if (pos.y > H - SAFE_ZONE_H - ZONE_H - 10) {
      Matter.Body.set(b.body, { friction: 0.6, frictionAir: 0.1 });
      if (!b.scored) {
        let cz = zones.find(z => pos.x >= z.x && pos.x < z.x + z.w);
        if (cz) {
          b.scored = true;
          let multiplier = 1 + (b.combo * 0.1);
          let finalScore = floor(cz.score * multiplier);
          
          updateScore(b.name, finalScore, b.color);
          cz.flash = 255; cz.flashColor = b.color;
          if (finalScore >= 5000) { 
              shakeAmount = 8; playJackpotSound(); 
              speakAnnouncer(random([`Incredible! ${sanitizeText(b.name)} just hit the planetary core!`, `Houston, we are reading a massive supernova from ${sanitizeText(b.name)}!`, `Live feed confirms an epic landing by ${sanitizeText(b.name)}!`]), 2);
          }
          checkAllTimeRecords(b.name, leaderboard[b.name].score, b.color);
        }
      }
    }
    if (pos.y > H + 150 || pos.x < -150 || pos.x > W + 150) removeBall(b);
  }
}

function removeBall(b) { Matter.World.remove(world, b.body); let idx = balls.indexOf(b); if (idx !== -1) balls.splice(idx, 1); }

function onUserJoin(username, imgUrl) {
  if (viewerSpaceObjects.find(o => o.name === username)) return;
  let obj = {
    name: username, x: random(100, W-100), y: random(100, H-SAFE_ZONE_H-300), vx: random(-0.3, 0.3), vy: random(-0.3, 0.3),
    baseSize: 40, extraSize: 0, color: [random(100, 255), random(100, 255), random(255)], img: null,
    angle: random(TWO_PI), lastActiveTime: millis(), alpha: 255
  };
  if (imgUrl) loadImage(imgUrl, loaded => { obj.img = loaded; });
  viewerSpaceObjects.push(obj);
}

function updateUserLikes(username, count) {
  let obj = viewerSpaceObjects.find(o => o.name === username);
  if (obj) { obj.extraSize = min(150, obj.extraSize + count * 2); obj.lastActiveTime = millis(); obj.alpha = 255; }
  else { onUserJoin(username, null); setTimeout(() => updateUserLikes(username, count), 500); }
}

function onUserQuit(username) { viewerSpaceObjects = viewerSpaceObjects.filter(o => o.name !== username); }

function drawViewerObjects() {
  for (let i = viewerSpaceObjects.length - 1; i >= 0; i--) {
    let obj = viewerSpaceObjects[i]; let inactive = millis() - obj.lastActiveTime;
    if (inactive > 60000) { viewerSpaceObjects.splice(i, 1); continue; }
    if (inactive > 50000) obj.alpha = map(inactive, 50000, 60000, 255, 0); else obj.alpha = 255;
  }
  for (let obj of viewerSpaceObjects) {
    obj.x += obj.vx + sin(frameCount * 0.01) * 0.1; obj.y += obj.vy + cos(frameCount * 0.01) * 0.1; obj.angle += 0.005;
    if (obj.x < 50 || obj.x > W-50) obj.vx *= -1; if (obj.y < 50 || obj.y > H-SAFE_ZONE_H-250) obj.vy *= -1;
    push(); translate(obj.x, obj.y); rotate(obj.angle);
    let totalS = obj.baseSize + obj.extraSize;
    noStroke(); fill(obj.color[0], obj.color[1], obj.color[2], 40 * (obj.alpha/255)); ellipse(0, 0, totalS + 20);
    if (obj.img) { imageMode(CENTER); tint(255, obj.alpha); image(obj.img, 0, 0, totalS, totalS); }
    else { fill(obj.color[0], obj.color[1], obj.color[2], obj.alpha); ellipse(0, 0, totalS); fill(255, obj.alpha); textAlign(CENTER, CENTER); textSize(totalS * 0.3); text(obj.name[0], 0, 0); }
    rotate(-obj.angle); fill(255, obj.alpha); textSize(10); textAlign(CENTER); text(obj.name, 0, totalS/2 + 15);
    pop();
  }
}

function drawUI() {
  // PŘEDĚLANÝ HORNÍ HUD
  push();
  let dropZoneW = 460, dropZoneX = W/2 - (dropZoneW / 2);
  let pulse = sin(frameCount * 0.1) * 3;
  
  fill(currentTheme[0], currentTheme[1], currentTheme[2], 10 + pulse); 
  rect(dropZoneX, 10, dropZoneW, 90, 15);
  fill(5, 5, 20, 230); 
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 150 + pulse * 10); 
  strokeWeight(2); 
  rect(dropZoneX, 10, dropZoneW, 90, 15);
  
  noStroke(); textAlign(CENTER, CENTER); 
  fill(255); textSize(20); text("GALACTIC TELEMETRY", W/2, 35);
  
  fill(currentTheme[0], currentTheme[1], currentTheme[2]); 
  textSize(12); text("STATUS: ONLINE | GEOMETRY: PROCEDURAL", W/2, 60);

  let liveTime = new Intl.DateTimeFormat('cs-CZ', { timeZone: 'Europe/Prague', dateStyle: 'short', timeStyle: 'medium' }).format(new Date());
  fill(255, 50, 50); textSize(14);
  text("🔴 LIVE " + liveTime, W/2, 80);
  pop();
  
  // LEVÝ PANEL
  push(); translate(0, 115);
  fill(100, 100, 150, 100); rect(10, 0, 280, 260); fill(0, 0, 20, 245); rect(12, 2, 276, 256);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]); textAlign(CENTER); textSize(12); text("MISSION MILESTONES", 150, 22);
  textAlign(LEFT);
  allTimeRecords.forEach((rec, i) => {
    let tSize = (i === 0) ? 14 : (i === 1) ? 12 : 11; textSize(tSize);
    fill(rec.color[0], rec.color[1], rec.color[2]); text(`${i+1}. ${rec.name}`, 22, 55 + i * 25);
    textAlign(RIGHT); fill(255, 180); text(rec.score, 278, 55 + i * 25); textAlign(LEFT);
  });
  translate(0, 270);
  fill(100, 100, 150, 100); rect(10, 0, 280, 70); fill(0, 0, 30, 245); rect(12, 2, 276, 66); textSize(10);
  if (gameState === "PLAYING") {
    textAlign(LEFT, CENTER); fill(timer < 10 ? color(255,0,0) : color(currentTheme[0], currentTheme[1], currentTheme[2]));
    text("WARP-DRIVE: " + timer + "s", 22, 22); fill(0, 255, 0); text(`ACTIVE UNITS: ${totalBallsFired}`, 22, 48);
  } else if (gameState === "WAITING") {
    textAlign(LEFT, CENTER); fill(255, 200, 0); text("COOLING DOWN...", 22, 22); fill(0, 255, 0); text(`TOTAL UNITS: ${totalBallsFired}`, 22, 48);
  }
  pop();
  
  // PRAVÝ PANEL
  push(); translate(W - 290, 115);
  let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 12);
  fill(100, 100, 150, 100); rect(0, 0, 280, 320); fill(0, 0, 20, 240); rect(2, 2, 276, 316);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]); textAlign(CENTER); textSize(12); text("TOP CONTRIBUTORS", 140, 22);
  textAlign(LEFT); textSize(11);
  sorted.forEach((e, i) => {
    fill(e[1].color); text(`${nf(i+1, 2)}. ${e[0]}`, 15, 55 + i * 22);
    textAlign(RIGHT); fill(255); text(e[1].score, 265, 55 + i * 22); textAlign(LEFT);
  });
  pop();
  
  // NÁPIS PRO SAFE ZONU
  push();
  fill(10, 10, 15, 200);
  rect(0, H - SAFE_ZONE_H, W, SAFE_ZONE_H);
  fill(255, 50); textAlign(CENTER, CENTER); textSize(20);
  text("TIKTOK CHAT SAFE ZONE", W/2, H - SAFE_ZONE_H / 2);
  pop();
}

function mouseClicked() {
  if (!audioStarted) startSpaceAudio();
  if (mouseX > W-260 && mouseX < W && mouseY > 100 && mouseY < 385) { leaderboard = {}; shakeAmount = 4; return; }
  if (mouseX > 10 && mouseX < 260 && mouseY > 100 && mouseY < 130) {
    allTimeRecords = Array(8).fill({ name: "NONE", score: 0, color: [100, 100, 100] });
    localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords)); shakeAmount = 5; return;
  }
  if (mouseY > 0 && mouseY < 85) { spawnBall(random(TEST_BOTS)); shakeAmount = 2; }
}

function drawWalls() { stroke(100); strokeWeight(2); for (let w of walls) line(w.position.x, H - SAFE_ZONE_H - ZONE_H, w.position.x, H - SAFE_ZONE_H); }
function updateTravelSpeed() { currentTravelSpeed = lerp(currentTravelSpeed, (gameState === "PLAYING" ? 1.0 : 0.2), 0.01); }

function createExplosion(x, y, c) {
  let col = c || color(255, random(100, 255), 0);
  for (let i = 0; i < 25; i++) explosions.push({ x: x, y: y, vx: random(-5, 5), vy: random(-5, 5), life: 255, col: col });
}

function drawExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    let e = explosions[i]; fill(red(e.col), green(e.col), blue(e.col), e.life); rect(e.x, e.y, 4, 4);
    e.x += e.vx; e.y += e.vy; e.life -= 5; if (e.life <= 0) explosions.splice(i, 1);
  }
}

function updateComet() {
  if (currentComet === null && gameState === "PLAYING" && random() < 0.003) {
    currentComet = { x: random(W), y: -50, targetX: W + 100, targetY: H + 100, progress: 0, speed: random(0.01, 0.03), size: random(6, 10), color: color(255, 255, 200, 200) };
  }
  if (currentComet) {
    currentComet.progress += currentComet.speed; let curX = lerp(currentComet.x, currentComet.targetX, currentComet.progress);
    let curY = lerp(currentComet.y, currentComet.targetY, currentComet.progress);
    fill(currentComet.color); ellipse(curX, curY, currentComet.size); if (currentComet.progress > 1.2) currentComet = null;
  }
}

function checkAllTimeRecords(n, s, col) {
  let idx = allTimeRecords.findIndex(r => r.name === n);
  if (idx !== -1) { if (s > allTimeRecords[idx].score) allTimeRecords[idx].score = s; }
  else { allTimeRecords.push({ name: n, score: s, color: [red(col), green(col), blue(col)] }); }
  allTimeRecords.sort((a, b) => b.score - a.score); allTimeRecords = allTimeRecords.slice(0, 8);
  localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords));
}

function updateWinnerColor() {
  let s = Object.entries(leaderboard).sort((a,b) => b[1].score - a[1].score);
  winnerColor = s.length > 0 ? lerpColor(winnerColor, s[0][1].color, 0.005) : color(0,0,128);
}

function updateScore(n, p, c) { if (!leaderboard[n]) leaderboard[n] = { score: 0, color: c }; leaderboard[n].score += p; }

function generateDeepSpaceElements() {
  massivePlanets = [];
  for(let i = 0; i < 3; i++) massivePlanets.push({ x: random(W), y: random(H), size: random(20, 50), color: color(random(30, 80), 100), hasRing: random() < 0.8, ringColor: color(random(80, 150), 80), speed: random(0.005, 0.015), rot: random(TWO_PI), rotSpeed: random(-0.01, 0.01) });
  spaceDebris = [];
  for(let i = 0; i < 10; i++) spaceDebris.push({ x: random(W), y: random(H), type: random(["UFO", "SATELLITE", "ASTEROID"]), size: random(10, 25), speed: random(0.3, 1.2), wobble: random(0.02, 0.05), rot: random(TWO_PI), rotSpeed: random(-0.05, 0.05) });
}

function generatePlanetName() {
  const names = ["XERON", "KEPLER", "ZENON", "AETHER", "NIBIRU", "PANDORA", "CYGNUS", "TITAN", "VULCAN", "ARRAKIS", "SOLARIS", "ZION", "EDEN"];
  const types = ["PRIME", "STATION", "SYSTEM", "REACH", "BETA", "MAJOR", "MINOR", "VOID", "CLUSTER", "GATE"];
  return random(names) + " " + random(types);
}

function initGame() {
  if(!engine) { engine = Matter.Engine.create(); world = engine.world; }
  world.gravity.y = currentGravity;
  
  let wallOptions = { isStatic: true, restitution: 2.2, friction: 0 };
  Matter.World.add(world, [
    Matter.Bodies.rectangle(-25, H/2, 50, H*2, wallOptions),
    Matter.Bodies.rectangle(W + 25, H/2, 50, H*2, wallOptions)
  ]);
  
  const patterns = ["SPIRAL", "WAVES", "HOURGLASS", "GALAXY", "DIAMOND", "HYPERCUBE", "DNA_HELIX", "SATURN_RINGS", "HEXAGON_GRID", "PYRAMID", "FRACTAL_TREE", "SHAPE_HEART", "SHAPE_APPLE", "SHAPE_ALIEN", "SHAPE_HOUSE", "SHAPE_SWORD", "SHAPE_MUSHROOM"];
  const mode = random(patterns);
  let numPegs = floor(random(450, 650));
  let pegRestitution = map(currentBounce, 1, 99, 0.1, 1.8);
  let blocker = Matter.Bodies.circle(W/2, 130, 4, { isStatic: true, restitution: pegRestitution });
  pegs.push(blocker); Matter.World.add(world, blocker);
  
  if (mode.startsWith("SHAPE_")) {
    let shapeName = mode.split("_")[1]; let shape = SHAPES[shapeName] || SHAPES["HEART"];
    let rows = shape.length; let cols = shape[0].length; let spacing = 26;
    let startX = (W - (cols * spacing)) / 2; let startY = 220;
    for(let i = 0; i < 15; i++) {
      let pxL = map(i, 0, 14, 50, startX - 30); let pyL = map(i, 0, 14, 150, startY + 50);
      let pL = Matter.Bodies.circle(pxL, pyL, 2.5, { isStatic: true, restitution: pegRestitution, collisionFilter: { category: 2 } });
      pegs.push(pL); Matter.World.add(world, pL);
      let pxR = map(i, 0, 14, W-50, startX + (cols*spacing) + 30);
      let pR = Matter.Bodies.circle(pxR, pyL, 2.5, { isStatic: true, restitution: pegRestitution, collisionFilter: { category: 2 } });
      pegs.push(pR); Matter.World.add(world, pR);
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (shape[r][c] === '*') {
          let px = startX + c * spacing + random(-1, 1); let py = startY + r * spacing + random(-1, 1);
          let isExplosive = random() < 0.05;
          let peg = Matter.Bodies.circle(px, py, 2.5, { isStatic: true, restitution: pegRestitution, collisionFilter: { category: 2 } });
          peg.isExplosive = isExplosive; pegs.push(peg); Matter.World.add(world, peg);
        }
      }
    }
    
    for (let i = 0; i < 200; i++) {
      let px = random(60, W - 60); let py = random(140, H - SAFE_ZONE_H - 300); let valid = true;
      for (let other of pegs) { if (dist(px, py, other.position.x, other.position.y) < 22) { valid = false; break; } }
      if (valid) {
        let isExplosive = random() < 0.05;
        let peg = Matter.Bodies.circle(px, py, 2.5, { isStatic: true, restitution: pegRestitution, collisionFilter: { category: 2 } });
        peg.isExplosive = isExplosive; pegs.push(peg); Matter.World.add(world, peg);
      }
    }
    
  } else {
    for (let i = 0; i < numPegs; i++) {
      let px, py; let valid = false; let attempts = 0;
      while (!valid && attempts < 50) {
        attempts++;
        switch(mode) {
          case "SPIRAL": let angle = i * 0.15; let r = 15 + i * 1.5; px = W/2 + cos(angle) * r; py = 180 + i * 1.8; break;
          case "WAVES": px = map(i % 20, 0, 20, 50, W-50); py = 160 + floor(i/20) * 40 + sin(i * 0.5) * 30; break;
          case "HOURGLASS": let rowH = floor(i / 15); let colH = i % 15; let shrink = abs(rowH - 15) * 12; px = map(colH, 0, 15, 100 + shrink, W - 100 - shrink); py = 160 + rowH * 25; break;
          case "GALAXY": let aG = random(TWO_PI); let radG = pow(random(), 0.5) * 350; px = W/2 + cos(aG) * radG; py = 450 + sin(aG) * radG * 0.8; break;
          case "DIAMOND": let rowD = floor(i / 18); let colD = i % 18; px = W/2 + (colD - 9) * 22; py = 180 + rowD * 28 + abs(colD-9)*8; break;
          case "PYRAMID": let levelP = floor(i / 20); let posInLevel = i % 20; px = W/2 + (posInLevel - 10) * (22 - levelP*1.5); py = 160 + levelP * 26; break;
          case "HYPERCUBE": let side = 300; let ix = i % 10; let iy = floor(i / 10) % 10; let iz = floor(i / 100); px = W/2 - side/2 + ix * 30 + iz * 15; py = 200 + iy * 30 + iz * 15; break;
          case "DNA_HELIX": let t = i * 0.1; let sideDNA = (i % 2 === 0) ? 1 : -1; px = W/2 + sideDNA * cos(t) * 100; py = 160 + i * 4; break;
          case "SATURN_RINGS": let angleS = random(TWO_PI); let distS = (i < numPegs/2) ? random(80, 120) : random(200, 250); px = W/2 + cos(angleS) * distS; py = 400 + sin(angleS) * distS * 0.4; break;
          case "HEXAGON_GRID": let hRow = floor(i / 12); let hCol = i % 12; px = 100 + hCol * 60 + (hRow % 2) * 30; py = 180 + hRow * 50; break;
          case "FRACTAL_TREE": let level = floor(log(i + 1) / log(2)); px = W/2 + (i % pow(2, level) - pow(2, level)/2) * (W / pow(2, level)); py = 160 + level * 60; break;
          default: px = random(60, W - 60); py = random(140, H - SAFE_ZONE_H - 300); break;
        }
        if (py > 115 && py < H - SAFE_ZONE_H - 250 && px > 40 && px < W - 40) {
          let tooClose = false;
          for(let other of pegs) { if(dist(px, py, other.position.x, other.position.y) < 22) { tooClose = true; break; } }
          if(!tooClose) valid = true;
        } else if (attempts > 45) { break; }
      }
      if (valid) {
        let isExplosive = random() < 0.05;
        let peg = Matter.Bodies.circle(px, py, 2.5, { isStatic: true, restitution: pegRestitution, collisionFilter: { category: 2 } });
        peg.isExplosive = isExplosive; pegs.push(peg); Matter.World.add(world, peg);
      }
    }
  }
  
  let sV = [5000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000];
  let curX = 0; zones = [];
  for (let i = 0; i < 21; i++) {
    let zw = (map(abs(i - 10), 0, 10, 2.5, 1.0) / 36.1) * W;
    
    // BAREVNÉ ODLIŠENÍ ZÓN
    let val = sV[i];
    let zColor;
    if (val === 5000) zColor = color(255, 215, 0, 200); // Gold
    else if (val >= 500) zColor = color(255, 140, 0, 200); // Orange
    else if (val >= 50) zColor = color(0, 150, 255, 200); // Blue
    else if (val >= 10) zColor = color(0, 255, 100, 200); // Green
    else zColor = color(100, 100, 100, 200); // Grey
    
    zones.push({ x: curX, w: zw, score: val, flash: 0, flashColor: color(255), baseColor: zColor });
    if (i > 0) {
      let wall = Matter.Bodies.rectangle(curX, H - SAFE_ZONE_H - (ZONE_H/2), 6, ZONE_H, { isStatic: true, friction: 0.5 });
      walls.push(wall); Matter.World.add(world, wall);
    }
    curX += zw;
  }
  Matter.World.add(world, [Matter.Bodies.rectangle(W/2, H - SAFE_ZONE_H + 48, W, 100, {isStatic:true, friction: 1})]);
}

function drawPegs() {
  noStroke();
  let pegR = map(currentGravity, 0.05, 1.95, 0, 255);
  let pegG = map(currentGravity, 0.05, 1.95, 255, 100);
  let pegB = map(currentGravity, 0.05, 1.95, 255, 0);
  let pegBaseCol = color(pegR, pegG, pegB);
  for (let p of pegs) {
    p.glow = p.glow || 0;
    if (p.glow > 0) { fill(pegR, pegG + 50, pegB + 50, p.glow); rect(p.position.x - 4, p.position.y - 4, 8, 8); p.glow -= 20; }
    if (p.isExplosive) { fill(255, 100, 0); rect(p.position.x - 3, p.position.y - 3, 6, 6); } 
    else { fill(pegBaseCol); rect(p.position.x - 2, p.position.y - 2, 4, 4); }
  }
}

function drawZones() {
  for (let z of zones) {
    if (z.flash > 0) { fill(z.flashColor); z.flash -= 10; } 
    else { fill(z.baseColor); }
    noStroke(); rect(z.x, H - SAFE_ZONE_H - ZONE_H, z.w, ZONE_H);
    push(); translate(z.x + z.w/2, H - SAFE_ZONE_H - 20); rotate(-HALF_PI); textAlign(LEFT, CENTER);
    
    if (z.score === 5000) { fill(255, 255, 0); textSize(18); }
    else { fill(255); textSize(z.w < 30 ? 10 : 14); }
    
    text(z.score, 0, 0);
    pop();
  }
}

function drawWaitingMessage() {
  let alpha = map(sin(frameCount * 0.15), -1, 1, 100, 255);
  push(); fill(255, 50, 50, alpha); textAlign(CENTER, CENTER); textSize(30); stroke(0); strokeWeight(4); text("WARNING: CLEANUP", W/2, H/2 - 100);
  textSize(14); noStroke(); fill(255, 200, 0, alpha); text("REMAINING UNITS RETURNING TO BASE...", W/2, H/2 - 50); pop();
}

function drawResultsOverlay() {
  fill(0, 0, 20, 230); rect(20, 50, W - 40, H - SAFE_ZONE_H - 100, 20);
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 150); strokeWeight(4); noFill(); rect(30, 60, W - 60, H - SAFE_ZONE_H - 120, 15);
  noStroke(); fill(currentTheme[0], currentTheme[1], currentTheme[2]); textAlign(CENTER); textSize(55); text("ROUND COMPLETE", W/2, 140);
  fill(255, 215, 0); textSize(26); text(`SECTOR: ${currentDestination}`, W/2, 200);
  let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 5);
  for (let i = 0; i < sorted.length; i++) {
    let entry = sorted[i]; let yPos = 310 + i * 90;
    fill(255, 255, 255, 20); rect(60, yPos - 55, W - 120, 80, 10);
    textAlign(LEFT, CENTER); fill(entry[1].color); textSize(40); text(`${i + 1}. ${entry[0]}`, 90, yPos - 15);
    textAlign(RIGHT, CENTER); fill(255); textSize(42); text(entry[1].score.toLocaleString(), W - 90, yPos - 15);
  }
  textAlign(CENTER); fill(255, 50, 50); textSize(24); text(`NEXT ROUND IN: ${resultsTimer}s`, W/2, H - SAFE_ZONE_H - 60);
}

function drawProceduralHUD() {
  push(); stroke(255, 10); strokeWeight(1);
  for(let i = 0; i < H; i += 4) { line(0, i + (frameCount % 4), W, i + (frameCount % 4)); }
  fill(0, 255, 0, 150); textSize(8); textAlign(LEFT);
  text(`POS_X: ${camOffset.x.toFixed(4)}`, 20, H - SAFE_ZONE_H - 40); text(`POS_Y: ${camOffset.y.toFixed(4)}`, 20, H - SAFE_ZONE_H - 30); text(`ZOOM: ${camOffset.z.toFixed(4)}`, 20, H - SAFE_ZONE_H - 20);
  textAlign(RIGHT); text(`SENS_TEMP: ${(24 + noise(frameCount*0.01)*5).toFixed(1)}°C`, W - 20, H - SAFE_ZONE_H - 30); text(`BUFFER_LOAD: ${balls.length * 2}%`, W - 20, H - SAFE_ZONE_H - 20);
  pop();
}

function drawAntiBotOverlay() {
  push();
  if (random() < 0.1) { fill(255, 150); noStroke(); circle(random(W), random(H), random(1, 3)); }
  if (random() < 0.02) { fill(currentTheme[0], currentTheme[1], currentTheme[2], 100); rect(0, random(H), W, random(1, 10)); }
  if (random() < 0.05) { fill(255, 0, 0, 50); rect(random(W), random(H), 20, 20); }
  pop();
}

function triggerCosmicEvent() {
  if (cosmicEvent) return;
  eventOccurredThisRound = true; let fromLeft = random() < 0.5;
  let size = random(25, 45); let startX = fromLeft ? -100 : W + 100; let targetY = H - SAFE_ZONE_H - ZONE_H - random(20, 120);
  let body = Matter.Bodies.circle(startX, targetY, size/2, { isStatic: false, isSensor: false, density: 0.1, frictionAir: 0, collisionFilter: { mask: 1 } });
  let isComet = random() < 0.5;
  cosmicEvent = { body: body, type: isComet ? "COMET" : "METEOR", size: size, color: isComet ? color(150, 200, 255) : color(255, 100, 50), trail: [] };
  Matter.World.add(world, body); Matter.Body.setVelocity(body, { x: fromLeft ? random(12, 18) : random(-12, -18), y: random(-1, 1) });
  if (audioStarted) { let osc = new p5.Oscillator('sine'); osc.start(); osc.freq(random(100, 400)); osc.freq(random(800, 1200), 1.5); osc.amp(0.1); osc.amp(0, 1.5); setTimeout(() => osc.stop(), 1600); }
  speakAnnouncer("Warning! Cosmic anomaly detected in the sector.", 1);
}

function handleCosmicEvent() {
  if (!cosmicEvent) return;
  let pos = cosmicEvent.body.position; cosmicEvent.trail.push({x: pos.x, y: pos.y, life: 255});
  if (cosmicEvent.trail.length > 20) cosmicEvent.trail.shift();
  push(); noStroke();
  for(let i = 0; i < cosmicEvent.trail.length; i++) {
    let alpha = map(i, 0, cosmicEvent.trail.length, 0, 150);
    fill(red(cosmicEvent.color), green(cosmicEvent.color), blue(cosmicEvent.color), alpha);
    ellipse(cosmicEvent.trail[i].x, cosmicEvent.trail[i].y, cosmicEvent.size * (i/cosmicEvent.trail.length));
  }
  fill(255); ellipse(pos.x, pos.y, cosmicEvent.size); fill(cosmicEvent.color); ellipse(pos.x, pos.y, cosmicEvent.size * 0.8); pop();
  if (pos.x < -300 || pos.x > W + 300) { Matter.World.remove(world, cosmicEvent.body); cosmicEvent = null; }
}

function spawnRareLegend() {
  let legend = random(RARE_POOL);
  spaceDebris.push({ x: random(50, W - 50), y: -100, type: "LEGEND", legendId: legend.id, size: legend.size, color: color(legend.col[0], legend.col[1], legend.col[2]), speed: random(0.8, 1.8), rot: random(TWO_PI), rotSpeed: random(-0.06, 0.06), wobble: random(0.02, 0.08), isRare: true });
}

function drawGalacticBackground() {
  fill(255, 120); noStroke();
  for(let s of stars) { s.y += s.speed * currentTravelSpeed * 5; if (s.y > H) { s.y = 0; s.x = random(W); } ellipse(s.x, s.y, s.s); }
  for(let p of massivePlanets) {
    push(); translate(p.x, p.y); p.y += p.speed * currentTravelSpeed * 5; p.rot += p.rotSpeed * currentTravelSpeed; rotate(p.rot);
    if (p.hasRing) { noFill(); stroke(p.ringColor); strokeWeight(p.size * 0.1); ellipse(0, 0, p.size * 2.2, p.size * 0.6); }
    noStroke(); fill(p.color); ellipse(0, 0, p.size); pop();
    if (p.y > H + p.size * 2) { p.y = -p.size * 2; p.x = random(W); }
  }
  updateComet();
  for(let i = spaceDebris.length - 1; i >= 0; i--) {
    let d = spaceDebris[i];
    push(); translate(d.x, d.y); d.y += d.speed * currentTravelSpeed * 2; d.rot += d.rotSpeed * currentTravelSpeed; rotate(d.rot);
    if (d.type === "LEGEND") { drawLegendShape(d); }
    else if (d.type === "UFO") { d.x += sin(frameCount * d.wobble) * 2; fill(0, 255, 100, 150); rect(-d.size/2, -d.size/6, d.size, d.size/3, 2); ellipse(0, -d.size/6, d.size/2, d.size/2); }
    else if (d.type === "SATELLITE") { stroke(200, 200, 255, 120); strokeWeight(1); noFill(); rect(-d.size/4, -d.size/4, d.size/2, d.size/2); line(-d.size, 0, d.size, 0); rect(-d.size, -d.size/6, d.size/2, d.size/3); rect(d.size/2, -d.size/6, d.size/2, d.size/3); }
    else { fill(80, 150); noStroke(); rect(-d.size/2, -d.size/2, d.size, d.size, 3); }
    pop();
    if (d.y > H + 150) { if (d.isRare) spaceDebris.splice(i, 1); else { d.y = -100; d.x = random(W); } }
  }
  if (gameState === "PLAYING") planetSize = lerp(planetSize, 120 + map(timer, 40, 0, 0, 1) * 350, 0.05);
  else if (gameState === "WAITING") planetSize = lerp(planetSize, 450, 0.01);
  if (planetSize > 10) { for(let r = 4; r > 0; r--) { fill(red(winnerColor), green(winnerColor), blue(winnerColor), 4); ellipse(W/2, H - SAFE_ZONE_H + 60, planetSize * (r * 0.6), planetSize * 0.4); } }
}

function drawLegendShape(d) {
  noStroke(); fill(d.color); let s = d.size;
  switch(d.legendId) {
    case "STARMAN": rect(-s/2, -s/4, s, s/2, 5); fill(255); ellipse(-s/4, -s/4, s/5); break;
    case "HAWKING": fill(100); rect(-s/2, 0, s, s/4); fill(d.color); rect(-s/4, -s/2, s/2, s/2); break;
    case "LAIKA": fill(150, 100); ellipse(0, 0, s, s); fill(d.color); ellipse(0, -s/6, s/2); break;
    case "ET": fill(100, 50, 0); rect(-s/2, 0, s, s/2); fill(255); ellipse(0, -s/4, s/2); break;
    case "NYAN": fill(255, 200, 150); rect(-s/2, -s/3, s, s/1.5, 3); break;
    case "VOYAGER": fill(180); ellipse(0, 0, s/2); fill(212, 175, 55); ellipse(0, 0, s/3); break;
    case "OUMUAMUA": fill(60, 40, 30); ellipse(0, 0, s, s/4); break;
    case "SHUTTLE": fill(255); triangle(-s/2, s/2, s/2, s/2, 0, -s/2); break;
  }
}

function drawGravityDust() {
  let r = map(currentGravity, 0.05, 1.95, 100, 255); let g = map(currentGravity, 0.05, 1.95, 200, 100); let b = map(currentGravity, 0.05, 1.95, 255, 50);
  fill(r, g, b, 150); noStroke();
  let dustSpeed = currentGravity * 3 * currentTravelSpeed;
  for (let d of dust) { d.y += dustSpeed; if (d.y > H) { d.y = 0; d.x = random(W); } rect(d.x, d.y, d.s, d.s); }
}

function prepareSingularityEvents() {
  bhSpawnTimes = [];
  if (random() < 0.4) bhSpawnTimes.push(floor(random(5, timer * 0.8)));
}

function checkSingularitySpawn() {
  if (bhSpawnTimes.includes(timer) && !blackHole) {
    let fromLeft = random() < 0.5;
    blackHole = {
      x: fromLeft ? -150 : W + 150, y: random(200, H - SAFE_ZONE_H - 450), startY: 0, targetX: fromLeft ? W + 250 : -250,
      speed: random(0.8, 1.5), size: random(12, 18), noiseOffset: random(1000), noiseSpeed: random(0.01, 0.02), wobbleAmp: random(40, 90)
    };
    blackHole.startY = blackHole.y; bhSpawnTimes = bhSpawnTimes.filter(t => t !== timer);
    speakAnnouncer("Warning! Black hole singularity forming on the live feed!", 1);
  }
}

function handleBlackHole() {
  if (!blackHole) return;
  let dir = blackHole.targetX > blackHole.x ? 1 : -1; blackHole.x += blackHole.speed * dir;
  let n = noise(frameCount * blackHole.noiseSpeed + blackHole.noiseOffset);
  blackHole.y = blackHole.startY + (n - 0.5) * blackHole.wobbleAmp * 2;
  let jitterSize = blackHole.size * (1 + (n - 0.5) * 0.15);
  
  if (audioStarted) {
    let centerDist = abs(W/2 - blackHole.x);
    let tremolo = map(sin(frameCount * 0.2), -1, 1, 0.8, 1.0);
    let vol = map(centerDist, W, 0, 0, 0.08) * tremolo;
    bhOsc.amp(vol, 0.1); bhOsc.freq(32 + n * 12);
  }
  push(); translate(blackHole.x, blackHole.y); noStroke();
  for(let i = 5; i > 0; i--) { fill(10 + i*10, 0, 40 + i*20, 25); let s = jitterSize + i * (blackHole.size * 0.15) + (n * 10); ellipse(0, 0, s); }
  fill(0); ellipse(0, 0, jitterSize); pop();
  
  for (let i = pegs.length - 1; i >= 0; i--) {
    let p = pegs[i];
    let d = dist(blackHole.x, blackHole.y, p.position.x, p.position.y);
    if (d < jitterSize * 0.55 && random() < 0.23) { Matter.Composite.remove(world, p); createExplosion(p.position.x, p.position.y); playExplosionSound(); pegs.splice(i, 1); }
  }
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    if (!b.body) continue; let d = dist(blackHole.x, blackHole.y, b.body.position.x, b.body.position.y);
    if (d < jitterSize * 0.5) { removeBall(b); continue; }
    if (d < blackHole.size * 1.87) {
      let safeDist = Math.max(d, 30);
      let forceDir = Matter.Vector.sub({x: blackHole.x, y: blackHole.y}, b.body.position);
      let strength = (blackHole.size * 0.00018) / (safeDist / 80);
      let force = Matter.Vector.mult(Matter.Vector.normalise(forceDir), strength);
      Matter.Body.applyForce(b.body, b.body.position, force);
    }
  }
  if ((dir === 1 && blackHole.x > blackHole.targetX) || (dir === -1 && blackHole.x < blackHole.targetX)) { blackHole = null; if (audioStarted) bhOsc.amp(0, 0.5); }
}

function resetGame() {
  leaderboard = {}; totalBallsFired = 0; roundCount++; gameState = "PLAYING";
  resultsTimer = 10; eventOccurredThisRound = false;
  currentDestination = generatePlanetName();
  timer = floor(random(40, 181));
  currentTheme = random(UI_THEMES); 
  if (isAutoMode) { autoRandomSettings(); }
  
  if (world) Matter.World.clear(world, false);
  pegs = []; walls = []; balls = []; blackHole = null; cosmicEvent = null;
  initGame(); generateDeepSpaceElements(); prepareSingularityEvents();
  planSpaceshipForRound();
  
  speakAnnouncer(`Welcome to sector ${currentDestination}. The live dropping phase has started.`, 1);
}
