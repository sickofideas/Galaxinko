// --- GALAXINKO (v5.4.1 - DENSE SHAPE SHIFTER EDITION) s hromaděním kuliček + pomalé mizení při přeplnění ---

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

// --- VIEWER INTERACTION ---
let viewerSpaceObjects = [];

// --- COLLISION ELEMENT ---
let cosmicEvent = null;
let eventOccurredThisRound = false;

// --- ANTI-BOT VARIABLES ---
let camOffset = { x: 0, y: 0, z: 1.0 };
let targetFPS = 60;

const TEST_BOTS = ["ALFA_PRO", "CYBER_PUNK", "GALAXY_KID", "NEBULA", "STAR_LORD", "COMET_99", "VOID_WALKER", "ORBITAL", "Z-AXIS", "QUASAR", "METEOR", "SOLARIS", "NOVA", "ECLIPSE", "ZENITH", "COSMOS"];

// --- TIKFINITY WEBSOCKET ---
let socket;
const TIKFINITY_URL = "ws://localhost:21213/";

function connectTikfinity() {
  socket = new WebSocket(TIKFINITY_URL);
  
  socket.onopen = () => {
    console.log("[Tikfinity] Connection established - Lab is online");
  };

  socket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    let name = (data.data.nickname || data.data.uniqueId || "USER").toUpperCase().substring(0, 12);
    
    if (data.event === "join") {
      onUserJoin(name, data.data.profilePictureUrl);
    }
    if (data.event === "leave" || data.event === "quit") {
      onUserQuit(name);
    }
    
    if (data.event === "like") {
      let count = data.data.likeCount || 1;
      updateUserLikes(name, count);
      for (let i = 0; i < count; i++) {
        setTimeout(() => spawnBall(name), i * 120);
      }
    }
  };

  socket.onclose = () => {
    console.log("[Tikfinity] Reconnecting...");
    setTimeout(connectTikfinity, 5000);
  };
}

// --- GALAXY ELEMENTS ---
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

const W = 900; 
const H = 950; 
const ZONE_H = 80;

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

// --- DENSER PEG SHAPE TEMPLATES ---
const SHAPES = {
  "HEART": [
    "  ***** ***** ",
    " ******* ******* ",
    "*****************",
    "*****************",
    " *************** ",
    "  ************* ",
    "   *********** ",
    "    ********* ",
    "      ***** ",
    "       *** ",
    "        * "
  ],
  "APPLE": [
    "       *** ",
    "      **** ",
    "        ** ",
    "    ********** ",
    "  ************** ",
    " ****************",
    " ****************",
    " ****************",
    "  ************** ",
    "    ********** "
  ],
  "ALIEN": [
    "      ******* ",
    "   *********** ",
    " *************** ",
    " *** ***** *** ",
    " *** ***** *** ",
    " *************** ",
    "  ************* ",
    "    *** *** "
  ],
  "HOUSE": [
    "        * ",
    "       *** ",
    "      ***** ",
    "     ******* ",
    "    ********* ",
    "   *********** ",
    "   *********** ",
    "   *** *** *** ",
    "   *** *** *** ",
    "   *********** "
  ],
  "SWORD": [
    "        * ",
    "       *** ",
    "       *** ",
    "       *** ",
    "       *** ",
    "       *** ",
    "  ************* ",
    "  ************* ",
    "       *** ",
    "       *** ",
    "        * "
  ],
  "MUSHROOM": [
    "      ***** ",
    "    ********* ",
    "  ************* ",
    " *************** ",
    " *************** ",
    "    *** *** ",
    "    ********* ",
    "    ********* "
  ]
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
  for(let i=0; i<100; i++) stars.push({ x: random(W), y: random(H), s: random(1, 2.5), speed: random(0.1, 0.4) });
  for(let i=0; i<400; i++) dust.push({ x: random(W), y: random(H), s: random(0.5, 1.5) });
  
  currentGravity = random(0.05, 1.95);
  currentBounce = floor(random(1, 100));
  
  timer = floor(random(40, 181));
  
  currentDestination = generatePlanetName();
  generateDeepSpaceElements();
  prepareSingularityEvents();
  connectTikfinity();
}

function startSpaceAudio() {
  if (audioStarted) return;
  userStartAudio();
  backgroundOsc.start();
  backgroundOsc.amp(0.02, 2);
  backgroundOsc.freq(55);
  backgroundOsc2.start();
  backgroundOsc2.amp(0.01, 2);
  backgroundOsc2.freq(110);
  bhOsc.start();
  bhOsc.amp(0);
  audioStarted = true;
}

function playSpawnSound() {
  if (!audioStarted) return;
  let scale = [440, 493.88, 554.37, 659.25, 739.99, 880];
  let baseNote = random(scale) + random(-5, 5); 
  let vol = random(0.02, 0.05);
  let dur = random(0.05, 0.15);
  fxSynth.play(baseNote, vol, 0, dur); 
}

function playJackpotSound() {
  if (!audioStarted) return;
  synth.play('C5', 0.1, 0, 0.1);
  setTimeout(() => synth.play('E5', 0.1, 0, 0.1), 100);
  setTimeout(() => synth.play('G5', 0.1, 0, 0.2), 200);
  setTimeout(() => synth.play('C6', 0.2, 0, 0.5), 300);
}

function playExplosionSound() {
  if (!audioStarted) return;
  fxSynth.play(random(50, 150), 0.1, 0, 0.2);
}

function playCleanupSound() {
  if (!audioStarted) return;
  fxSynth.play(100, 0.05, 0, 1.0);
}

function playTimerEndSequence() {
  if (!audioStarted) return;
  let endNotes = [600, 400, 250, 100]; 
  for(let i=0; i < endNotes.length; i++) {
    setTimeout(() => {
      if (gameState === "WAITING") {
        let f = endNotes[i] + random(-20, 20); 
        fxSynth.play(f, 0.08, 0, 0.4);
        shakeAmount = random(2, 4); 
      }
    }, i * 400);
  }
  flashEffect = 60; 
}

function updateJukebox() {
  if (!audioStarted || gameState !== "PLAYING") return;
  if (millis() > nextNoteTime) {
    let note = random(musicScale);
    let freq = pow(2, (note - 69) / 12) * 440;
    synth.play(freq, 0.01, 0, 1.5);
    nextNoteTime = millis() + random(2000, 5000);
  }
}

function draw() {
  if (!libraryLoaded) return;
  if (!engine) initGame();
  if (frameCount % 60 === 0) targetFPS = random(57, 60);
  frameRate(targetFPS);
  
  updateJukebox(); 

  push();
  let camSpeed = 0.005;
  camOffset.x = (noise(frameCount * camSpeed) - 0.5) * 40;
  camOffset.y = (noise(frameCount * camSpeed + 100) - 0.5) * 40;
  camOffset.z = 1.0 + (noise(frameCount * 0.002) - 0.5) * 0.05;

  translate(W/2, H/2);
  scale(camOffset.z);
  translate(-W/2 + camOffset.x, -H/2 + camOffset.y);
  if (shakeAmount > 0) { 
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount)); 
    shakeAmount *= 0.92; 
  }

  updateWinnerColor();
  updateTravelSpeed();
  background(2, 2, 8);
  drawGravityDust(); 
  drawGalacticBackground(); 
  
  drawViewerObjects();
  
  try {
    Matter.Engine.update(engine, 1000 / 60);
  } catch (e) {
    console.error("Matter.js Engine Error - Auto-recovering...");
  }
  
  handleBlackHole();
  handleCosmicEvent();
  if (millis() - lastTick > 1000) {
    if (gameState === "PLAYING") {
      timer--;
      checkSingularitySpawn();
      
      if (!eventOccurredThisRound && timer < (timer * 0.7) && random() < 0.17) {
          triggerCosmicEvent();
      }

      if (random() < 0.11) spawnRareLegend();
      if (timer <= 0) { 
        gameState = "WAITING"; 
        waitStartTime = millis();
        shakeAmount = 6; 
        playCleanupSound(); 
        playTimerEndSequence();
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

  if (flashEffect > 0) { 
    noStroke();
    fill(20, 40, 100, map(flashEffect, 0, 60, 0, 100)); 
    rect(0, 0, W, H);
    flashEffect--; 
  }

  // HLAVNÍ ZMĚNA – správa přeplnění zón (hromadění + pomalé mizení)
  manageZoneOverflow();

  pop();
}

// NOVÁ FUNKCE – správa přeplnění chlívků (hromadění + pomalé mizení)
function manageZoneOverflow() {
  zones.forEach(z => {
    let currentCount = z.ballsInZone.length;
    // Hrubý odhad maximálního počtu kuliček (uprav 80 podle velikosti kuliček a chlívku)
    let maxBalls = Math.floor((z.w * (ZONE_H * 0.95)) / 80); // 95 % výšky, 80 = přibližná plocha jedné kuličky

    if (currentCount > maxBalls) {
      let toRemove = Math.max(1, Math.floor((currentCount - maxBalls) * 0.05)); // 5 % přebytku za frame
      for (let k = 0; k < toRemove && z.ballsInZone.length > 0; k++) {
        let oldest = z.ballsInZone.shift(); // mažeme nejstarší
        if (oldest && oldest.body) {
          removeBall(oldest);
        }
      }
    }
  });
}

// Upravené drawBalls – kuličky se hromadí, ne mizí hned
function drawBalls() {
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

    push(); 
    translate(pos.x, pos.y);
    rotate(b.body.angle); 
    fill(b.color); 
    stroke(255); 
    strokeWeight(1); 
    rect(-5, -5, 10, 10); 
    
    rotate(-b.body.angle); 
    fill(b.color);
    noStroke();
    textAlign(CENTER);
    textSize(8);
    text(b.name, 0, -12); 
    pop();
    for(let p of pegs) {
      if(abs(pos.x - p.position.x) < 11 && abs(pos.y - p.position.y) < 11) p.glow = 255;
    }

    // BODOVÁNÍ + přidání do zóny (bez mazání)
    if (pos.y > H - ZONE_H - 5 && !b.scored) {
      let cz = zones.find(z => pos.x >= z.x && pos.x < z.x + z.w);
      if (cz) { 
        b.scored = true; 
        updateScore(b.name, cz.score, b.color);
        cz.flash = 255; 
        cz.flashColor = b.color; 
        
        if(cz.score >= 5000) { 
            shakeAmount = 8;
            playJackpotSound(); 
        } 
        checkAllTimeRecords(b.name, leaderboard[b.name].score, b.color);
        
        // Přidáme kuličku do seznamu zóny – bude se hromadit
        cz.ballsInZone.push(b);
      }
    }
    
    if (pos.y > H + 150 || pos.x < -150 || pos.x > W + 150) {
        removeBall(b);
    }
  }
}

// --- NOVÉ FUNKCE PRO DIVÁKY NA POZADÍ (s kolizemi + jiskrami) ---
function onUserJoin(username, imgUrl) {
    if (viewerSpaceObjects.find(o => o.name === username)) return;
    let obj = {
        name: username,
        x: random(100, W-100),
        y: random(100, H-300),
        vx: random(-0.3, 0.3),
        vy: random(-0.3, 0.3),
        baseSize: 40,
        extraSize: 0,
        color: [random(100, 255), random(100, 255), random(255)],
        img: null,
        angle: random(TWO_PI)
    };
    if (imgUrl) loadImage(imgUrl, loaded => { obj.img = loaded; });
    viewerSpaceObjects.push(obj);
}

function updateUserLikes(username, count) {
    let obj = viewerSpaceObjects.find(o => o.name === username);
    if (obj) {
        obj.extraSize += count * 2; 
        if (obj.extraSize > 150) obj.extraSize = 150; 
    } else {
        onUserJoin(username, null);
        setTimeout(() => updateUserLikes(username, count), 500);
    }
}

function onUserQuit(username) {
    viewerSpaceObjects = viewerSpaceObjects.filter(o => o.name !== username);
}

function drawViewerObjects() {
    for (let i = 0; i < viewerSpaceObjects.length; i++) {
        let obj = viewerSpaceObjects[i];
        obj.x += obj.vx + sin(frameCount * 0.01) * 0.1;
        obj.y += obj.vy + cos(frameCount * 0.01) * 0.1;
        obj.angle += 0.005;

        if (obj.x < 50 || obj.x > W-50) obj.vx *= -1;
        if (obj.y < 50 || obj.y > H-250) obj.vy *= -1;

        // KOLIZE + JISKRY
        for (let j = i + 1; j < viewerSpaceObjects.length; j++) {
            let other = viewerSpaceObjects[j];
            let dx = obj.x - other.x;
            let dy = obj.y - other.y;
            let distAB = sqrt(dx * dx + dy * dy);
            let minDist = (obj.baseSize + obj.extraSize + other.baseSize + other.extraSize) / 2 + 10;

            if (distAB < minDist && distAB > 5) {
                let nx = dx / distAB;
                let ny = dy / distAB;
                let overlap = minDist - distAB;

                obj.x += nx * overlap * 0.6;
                obj.y += ny * overlap * 0.6;
                other.x -= nx * overlap * 0.6;
                other.y -= ny * overlap * 0.6;

                let tempVx = obj.vx;
                let tempVy = obj.vy;
                obj.vx = other.vx * 0.8;
                obj.vy = other.vy * 0.8;
                other.vx = tempVx * 0.8;
                other.vy = tempVy * 0.8;

                // Jiskry
                for (let k = 0; k < 8; k++) {
                    let ang = random(TWO_PI);
                    let sp = random(1.5, 4);
                    explosions.push({
                        x: (obj.x + other.x) / 2,
                        y: (obj.y + other.y) / 2,
                        vx: cos(ang) * sp,
                        vy: sin(ang) * sp,
                        life: 160,
                        col: color(255, random(180, 255), random(80, 220))
                    });
                }
            }
        }

        push();
        translate(obj.x, obj.y);
        rotate(obj.angle);
        
        let totalS = obj.baseSize + obj.extraSize;
        
        noStroke();
        fill(obj.color[0], obj.color[1], obj.color[2], 40);
        ellipse(0, 0, totalS + 20);

        if (obj.img) {
            imageMode(CENTER);
            image(obj.img, 0, 0, totalS, totalS);
        } else {
            fill(obj.color);
            ellipse(0, 0, totalS);
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(totalS * 0.3);
            text(obj.name[0], 0, 0);
        }
        
        rotate(-obj.angle);
        fill(255, 200);
        textSize(10);
        textAlign(CENTER);
        text(obj.name, 0, totalS/2 + 15);
        pop();
    }
}

// ────────────────────────────────────────────────
// ZBYTEK PŮVODNÍHO KÓDU – BEZ ZMĚN
// ────────────────────────────────────────────────

function triggerCosmicEvent() {
    if (cosmicEvent) return;
    eventOccurredThisRound = true;
    
    let fromLeft = random() < 0.5;
    let size = random(25, 45);
    let startX = fromLeft ? -100 : W + 100;
    let targetY = H - ZONE_H - random(20, 120); 
    
    let body = Matter.Bodies.circle(startX, targetY, size/2, {
        isStatic: false,
        isSensor: false,
        density: 0.1,
        frictionAir: 0,
        collisionFilter: { mask: 1 }
    });
    let isComet = random() < 0.5;
    cosmicEvent = {
        body: body,
        type: isComet ? "COMET" : "METEOR",
        size: size,
        color: isComet ? color(150, 200, 255) : color(255, 100, 50),
        trail: []
    };
    Matter.World.add(world, body);
    Matter.Body.setVelocity(body, { x: fromLeft ? random(12, 18) : random(-12, -18), y: random(-1, 1) });
    if (audioStarted) {
        let osc = new p5.Oscillator('sine');
        osc.start();
        osc.freq(random(100, 400));
        osc.freq(random(800, 1200), 1.5);
        osc.amp(0.1);
        osc.amp(0, 1.5);
        setTimeout(() => osc.stop(), 1600);
    }
}

function handleCosmicEvent() {
    if (!cosmicEvent) return;
    let pos = cosmicEvent.body.position;
    
    cosmicEvent.trail.push({x: pos.x, y: pos.y, life: 255});
    if (cosmicEvent.trail.length > 20) cosmicEvent.trail.shift();
    
    push();
    noStroke();
    for(let i=0; i<cosmicEvent.trail.length; i++) {
        let alpha = map(i, 0, cosmicEvent.trail.length, 0, 150);
        fill(red(cosmicEvent.color), green(cosmicEvent.color), blue(cosmicEvent.color), alpha);
        ellipse(cosmicEvent.trail[i].x, cosmicEvent.trail[i].y, cosmicEvent.size * (i/cosmicEvent.trail.length));
    }
    
    fill(255);
    ellipse(pos.x, pos.y, cosmicEvent.size);
    fill(cosmicEvent.color);
    ellipse(pos.x, pos.y, cosmicEvent.size * 0.8);
    pop();
    if (pos.x < -300 || pos.x > W + 300) {
        Matter.World.remove(world, cosmicEvent.body);
        cosmicEvent = null;
    }
}

function drawProceduralHUD() {
  push();
  stroke(255, 10);
  strokeWeight(1);
  for(let i=0; i<H; i+=4) {
    line(0, i + (frameCount % 4), W, i + (frameCount % 4));
  }
  fill(0, 255, 0, 150);
  textSize(8);
  textAlign(LEFT);
  text(`POS_X: ${camOffset.x.toFixed(4)}`, 20, H - 40);
  text(`POS_Y: ${camOffset.y.toFixed(4)}`, 20, H - 30);
  text(`ZOOM: ${camOffset.z.toFixed(4)}`, 20, H - 20);
  
  textAlign(RIGHT);
  text(`SENS_TEMP: ${(24 + noise(frameCount*0.01)*5).toFixed(1)}°C`, W - 20, H - 30);
  text(`BUFFER_LOAD: ${balls.length * 2}%`, W - 20, H - 20);
  pop();
}

function drawAntiBotOverlay() {
  push();
  if (random() < 0.1) {
    fill(255, 150);
    noStroke();
    circle(random(W), random(H), random(1, 3));
  }
  if (random() < 0.02) {
    fill(0, 255, 255, 100);
    rect(0, random(H), W, random(1, 10));
  }
  if (random() < 0.05) {
    fill(255, 0, 0, 50);
    rect(random(W), random(H), 20, 20);
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
    restitution: ballRestitution, 
    friction: 0.2, 
    frictionAir: 0.04, 
    density: 0.001 
  });
  if (!leaderboard[userName]) {
    leaderboard[userName] = { score: 0, color: color(random(100,255), random(100,255), random(100,255)) };
  }

  balls.push({ 
    body: ballBody, 
    name: userName, 
    color: leaderboard[userName].color, 
    scored: false 
  });
  Matter.World.add(world, ballBody); 
}

function removeBall(b) {
  Matter.World.remove(world, b.body);
  let idx = balls.indexOf(b);
  if (idx !== -1) balls.splice(idx, 1);
  // Odstranit i ze seznamu zóny, pokud tam je
  zones.forEach(z => {
    z.ballsInZone = z.ballsInZone.filter(ball => ball !== b);
  });
}

function drawZones() { 
  for (let z of zones) { 
    let isJackpot = (z.score >= 5000);
    let baseCol = isJackpot ? color(50, 45, 15, 180) : color(10, 10, 40, 180);
    if (z.flash > 0) {
      fill(z.flashColor);
      z.flash -= 10;
    } else {
      fill(baseCol);
    }
    
    noStroke();
    rect(z.x, H - ZONE_H, z.w, ZONE_H); 
    
    push(); 
    translate(z.x + z.w/2, H - 15); 
    rotate(-HALF_PI); 
    textAlign(LEFT, CENTER);
    if (isJackpot) {
      fill(255, 230, 100); 
      textSize(12);
      text(z.score, 0, 0);
    } else {
      fill(255);
      textSize(z.w < 30 ? 7 : 10); 
      text(z.score, 0, 0);
    }
    pop(); 
  } 
}

function drawWaitingMessage() {
  let alpha = map(sin(frameCount * 0.15), -1, 1, 100, 255);
  push();
  fill(255, 50, 50, alpha);
  textAlign(CENTER, CENTER);
  textSize(30);
  stroke(0);
  strokeWeight(4);
  text("WARNING: CLEANUP", W/2, H/2 - 50);
  textSize(14);
  noStroke();
  fill(255, 200, 0, alpha);
  text("REMAINING UNITS RETURNING TO BASE...", W/2, H/2);
  pop();
}

function drawResultsOverlay() { 
    fill(0, 0, 20, 230); 
    rect(20, 50, W - 40, H - 100, 20);
    stroke(0, 255, 255, 150);
    strokeWeight(4);
    noFill();
    rect(30, 60, W - 60, H - 120, 15);

    noStroke();
    fill(0, 255, 255);
    textAlign(CENTER);
    textSize(45); 
    text("ROUND COMPLETE", W/2, 140);
    
    fill(255, 215, 0);
    textSize(22); 
    text(`SECTOR: ${currentDestination}`, W/2, 190);
    let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 5);
    for (let i = 0; i < sorted.length; i++) {
        let entry = sorted[i];
        let yPos = 300 + i * 90; 
        
        fill(255, 255, 255, 20);
        rect(60, yPos - 55, W - 120, 80, 10);
        
        textAlign(LEFT, CENTER);
        fill(entry[1].color);
        textSize(35);
        text(`${i + 1}. ${entry[0]}`, 90, yPos - 15);
        
        textAlign(RIGHT, CENTER);
        fill(255);
        textSize(38); 
        text(entry[1].score.toLocaleString(), W - 90, yPos - 15);
    }

    textAlign(CENTER);
    fill(255, 50, 50);
    textSize(20);
    text(`NEXT ROUND IN: ${resultsTimer}s`, W/2, H - 60);
}

function spawnRareLegend() {
  let legend = random(RARE_POOL);
  spaceDebris.push({
    x: random(50, W - 50),
    y: -100,
    type: "LEGEND",
    legendId: legend.id,
    size: legend.size,
    color: color(legend.col[0], legend.col[1], legend.col[2]),
    speed: random(0.8, 1.8),
    rot: random(TWO_PI),
    rotSpeed: random(-0.06, 0.06),
    wobble: random(0.02, 0.08),
    isRare: true
  });
}

function drawGalacticBackground() {
  fill(255, 120); noStroke();
  for(let s of stars) { 
    ellipse(s.x, s.y, s.s);
    s.y += s.speed * currentTravelSpeed * 5; 
    if (s.y > H) { s.y = 0; s.x = random(W); }
  }
  
  for(let p of massivePlanets) {
    push(); translate(p.x, p.y);
    p.y += p.speed * currentTravelSpeed * 5;
    p.rot += p.rotSpeed * currentTravelSpeed; 
    rotate(p.rot);
    if (p.hasRing) { 
      noFill(); stroke(p.ringColor); strokeWeight(p.size * 0.1);
      ellipse(0, 0, p.size * 2.2, p.size * 0.6); 
    }
    noStroke(); fill(p.color); ellipse(0, 0, p.size); 
    pop();
    if (p.y > H + p.size * 2) { p.y = -p.size * 2; p.x = random(W); }
  }
  
  updateComet();
  
  for(let i = spaceDebris.length - 1; i >= 0; i--) {
    let d = spaceDebris[i];
    push(); 
    translate(d.x, d.y); 
    d.y += d.speed * currentTravelSpeed * 2;
    d.rot += d.rotSpeed * currentTravelSpeed;
    rotate(d.rot);
    if (d.type === "LEGEND") {
      drawLegendShape(d);
    } else if (d.type === "UFO") { 
      d.x += sin(frameCount * d.wobble) * 2;
      fill(0, 255, 100, 150); rect(-d.size/2, -d.size/6, d.size, d.size/3, 2); ellipse(0, -d.size/6, d.size/2, d.size/2);
    } else if (d.type === "SATELLITE") { 
      stroke(200, 200, 255, 120); strokeWeight(1); noFill();
      rect(-d.size/4, -d.size/4, d.size/2, d.size/2); line(-d.size, 0, d.size, 0); rect(-d.size, -d.size/6, d.size/2, d.size/3); rect(d.size/2, -d.size/6, d.size/2, d.size/3);
    } else { 
      fill(80, 150); noStroke(); rect(-d.size/2, -d.size/2, d.size, d.size, 3);
    }
    pop();

    if (d.y > H + 150) {
      if (d.isRare) spaceDebris.splice(i, 1);
      else { d.y = -100; d.x = random(W); }
    }
  }
}

function drawLegendShape(d) {
  noStroke();
  fill(d.color);
  let s = d.size;
  switch(d.legendId) {
    case "STARMAN": rect(-s/2, -s/4, s, s/2, 5); fill(255);
      ellipse(-s/4, -s/4, s/5); break;
    case "HAWKING": fill(100); rect(-s/2, 0, s, s/4); fill(d.color); rect(-s/4, -s/2, s/2, s/2); break;
    case "LAIKA": fill(150, 100); ellipse(0, 0, s, s); fill(d.color); ellipse(0, -s/6, s/2); break;
    case "ET": fill(100, 50, 0);
      rect(-s/2, 0, s, s/2); fill(255); ellipse(0, -s/4, s/2); break;
    case "NYAN": fill(255, 200, 150); rect(-s/2, -s/3, s, s/1.5, 3); break;
    case "VOYAGER": fill(180); ellipse(0, 0, s/2); fill(212, 175, 55); ellipse(0, 0, s/3); break;
    case "OUMUAMUA": fill(60, 40, 30);
      ellipse(0, 0, s, s/4); break;
    case "SHUTTLE": fill(255); triangle(-s/2, s/2, s/2, s/2, 0, -s/2); break;
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
    if (d.y > H) { d.y = 0; d.x = random(W); }
    rect(d.x, d.y, d.s, d.s);
  }
}

function prepareSingularityEvents() {
  bhSpawnTimes = [];
  if (random() < 0.4) bhSpawnTimes.push(floor(random(5, timer * 0.8)));
}

function checkSingularitySpawn() {
  if (bhSpawnTimes.includes(timer) && !blackHole) {
    let fromLeft = random() < 0.5;
    blackHole = {
      x: fromLeft ? -150 : W + 150,
      y: random(200, H - 450), 
      startY: 0,
      targetX: fromLeft ? W + 250 : -250,
      speed: random(0.8, 1.5),
      size: random(12, 18), 
      noiseOffset: random(1000),
      noiseSpeed: random(0.01, 0.02),
      wobbleAmp: random(40, 90)
    };
    blackHole.startY = blackHole.y;
    bhSpawnTimes = bhSpawnTimes.filter(t => t !== timer);
  }
}

function handleBlackHole() {
  if (!blackHole) return;
  let dir = blackHole.targetX > blackHole.x ? 1 : -1;
  blackHole.x += blackHole.speed * dir;
  let n = noise(frameCount * blackHole.noiseSpeed + blackHole.noiseOffset);
  blackHole.y = blackHole.startY + (n - 0.5) * blackHole.wobbleAmp * 2;
  let jitterSize = blackHole.size * (1 + (n - 0.5) * 0.15);
  if (audioStarted) {
    let centerDist = abs(W/2 - blackHole.x);
    let tremolo = map(sin(frameCount * 0.2), -1, 1, 0.8, 1.0);
    let vol = map(centerDist, W, 0, 0, 0.08) * tremolo;
    bhOsc.amp(vol, 0.1);
    bhOsc.freq(32 + n * 12);
  }

  push(); translate(blackHole.x, blackHole.y); noStroke();
  for(let i=5; i>0; i--) { 
    fill(10 + i*10, 0, 40 + i*20, 25);
    let s = jitterSize + i * (blackHole.size * 0.15) + (n * 10); 
    ellipse(0, 0, s); 
  }
  fill(0);
  ellipse(0, 0, jitterSize); pop();

  for (let i = pegs.length - 1; i >= 0; i--) {
    let p = pegs[i];
    let d = dist(blackHole.x, blackHole.y, p.position.x, p.position.y);
    if (d < jitterSize * 0.55 && random() < 0.23) { 
      Matter.Composite.remove(world, p);
      createExplosion(p.position.x, p.position.y);
      playExplosionSound(); 
      pegs.splice(i, 1);
    }
  }

  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    if (!b.body) continue;
    let d = dist(blackHole.x, blackHole.y, b.body.position.x, b.body.position.y);
    if (d < jitterSize * 0.5) {
      removeBall(b);
      continue;
    }
    
    if (d < blackHole.size * 1.87) { 
      let safeDist = Math.max(d, 30);
      let forceDir = Matter.Vector.sub({x: blackHole.x, y: blackHole.y}, b.body.position);
      let strength = (blackHole.size * 0.00018) / (safeDist / 80);
      let force = Matter.Vector.mult(Matter.Vector.normalise(forceDir), strength);
      Matter.Body.applyForce(b.body, b.body.position, force);
    }
  }

  if ((dir === 1 && blackHole.x > blackHole.targetX) || (dir === -1 && blackHole.x < blackHole.targetX)) {
      blackHole = null;
      if (audioStarted) bhOsc.amp(0, 0.5);
  }
}

function resetGame() {
  currentGravity = random(0.05, 1.95); 
  currentBounce = floor(random(1, 100));
  timer = floor(random(40, 181));
  leaderboard = {}; 
  totalBallsFired = 0; 
  roundCount++; 
  gameState = "PLAYING";
  resultsTimer = 10;
  eventOccurredThisRound = false; 
  currentDestination = generatePlanetName();
  if (world) Matter.World.clear(world, false);
  pegs = []; walls = []; balls = []; blackHole = null; cosmicEvent = null;
  zones.forEach(z => z.ballsInZone = []); // vymazat hromady
  initGame();
  generateDeepSpaceElements(); 
  prepareSingularityEvents();
}

function generatePlanetName() {
  const names = ["XERON", "KEPLER", "ZENON", "AETHER", "NIBIRU", "PANDORA", "CYGNUS", "TITAN", "VULCAN", "ARRAKIS", "SOLARIS", "ZION", "EDEN"];
  const types = ["PRIME", "STATION", "SYSTEM", "REACH", "BETA", "MAJOR", "MINOR", "VOID", "CLUSTER", "GATE"];
  return random(names) + " " + random(types);
}

function initGame() {
  if(!engine) { 
    engine = Matter.Engine.create(); 
    world = engine.world;
  }
  world.gravity.y = currentGravity;

  const patterns = ["SPIRAL", "WAVES", "HOURGLASS", "CHAOS", "FIELDS", "GALAXY", "DIAMOND", "HYPERCUBE", "DNA_HELIX", "SATURN_RINGS", "FRACTAL_TREE", "HEXAGON_GRID", "SHAPE_HEART", "SHAPE_APPLE", "SHAPE_ALIEN", "SHAPE_HOUSE", "SHAPE_SWORD", "SHAPE_MUSHROOM"];
  const mode = random(patterns);

  let numPegs = floor(random(300, 500));
  let pegRestitution = map(currentBounce, 1, 99, 0.1, 1.8);
  let blocker = Matter.Bodies.circle(W/2, 130, 4, { isStatic: true, restitution: pegRestitution });
  pegs.push(blocker);
  Matter.World.add(world, blocker);
  if (mode.startsWith("SHAPE_")) {
    let shapeName = mode.split("_")[1];
    let shape = SHAPES[shapeName] || SHAPES["HEART"];
    let rows = shape.length;
    let cols = shape[0].length;
    
    let spacing = 26; 
    let startX = (W - (cols * spacing)) / 2;
    let startY = 220; 
    
    for(let i=0; i<15; i++) {
        let pxL = map(i, 0, 14, 50, startX - 30);
        let pyL = map(i, 0, 14, 150, startY + 50);
        let pL = Matter.Bodies.circle(pxL, pyL, 2.5, { isStatic:true, restitution: pegRestitution, collisionFilter: { category: 2 } });
        pegs.push(pL); Matter.World.add(world, pL);
        let pxR = map(i, 0, 14, W-50, startX + (cols*spacing) + 30);
        let pR = Matter.Bodies.circle(pxR, pyL, 2.5, { isStatic:true, restitution: pegRestitution, collisionFilter: { category: 2 } });
        pegs.push(pR); Matter.World.add(world, pR);
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (shape[r][c] === '*') {
                let px = startX + c * spacing + random(-1, 1);
                let py = startY + r * spacing + random(-1, 1);
                let peg = Matter.Bodies.circle(px, py, 2.5, { 
                    isStatic: true, 
                    restitution: pegRestitution,
                    collisionFilter: { category: 2 } 
                });
                pegs.push(peg);
                Matter.World.add(world, peg);
            }
        }
    }
  } else {
    for (let i = 0; i < numPegs; i++) {
      let px, py;
      let valid = false;
      let attempts = 0;

      while (!valid && attempts < 50) {
        attempts++;
        switch(mode) {
          case "SPIRAL":
            let angle = i * 0.15;
            let r = 15 + i * 1.5;
            px = W/2 + cos(angle) * r;
            py = 180 + i * 1.8;
            break;
          case "WAVES":
            px = map(i % 20, 0, 20, 50, W-50);
            py = 160 + floor(i/20) * 40 + sin(i * 0.5) * 30;
            break;
          case "HOURGLASS":
            let rowH = floor(i / 15);
            let colH = i % 15;
            let shrink = abs(rowH - 15) * 12;
            px = map(colH, 0, 15, 100 + shrink, W - 100 - shrink);
            py = 160 + rowH * 25;
            break;
          case "GALAXY":
            let aG = random(TWO_PI);
            let radG = pow(random(), 0.5) * 350;
            px = W/2 + cos(aG) * radG;
            py = 450 + sin(aG) * radG * 0.8;
            break;
          case "HYPERCUBE":
            let side = 300;
            let ix = i % 10;
            let iy = floor(i / 10) % 10;
            let iz = floor(i / 100);
            px = W/2 - side/2 + ix * 30 + iz * 15;
            py = 200 + iy * 30 + iz * 15;
            break;
          case "DNA_HELIX":
            let t = i * 0.1;
            let sideDNA = (i % 2 === 0) ? 1 : -1;
            px = W/2 + sideDNA * cos(t) * 100;
            py = 160 + i * 4;
            break;
          case "SATURN_RINGS":
            let angleS = random(TWO_PI);
            let distS = (i < numPegs/2) ? random(80, 120) : random(200, 250);
            px = W/2 + cos(angleS) * distS;
            py = 400 + sin(angleS) * distS * 0.4;
            break;
          case "FRACTAL_TREE":
            let level = floor(log(i + 1) / log(2));
            px = W/2 + (i % pow(2, level) - pow(2, level)/2) * (W / pow(2, level));
            py = 160 + level * 60;
            break;
          case "HEXAGON_GRID":
            let hRow = floor(i / 12);
            let hCol = i % 12;
            px = 100 + hCol * 60 + (hRow % 2) * 30;
            py = 180 + hRow * 50;
            break;
          default: 
            px = random(60, W - 60);
            py = random(140, H - 300);
            break;
        }

        if (py > 115 && py < H - 280 && px > 40 && px < W - 40) {
          let tooClose = false;
          for(let other of pegs) {
            if(dist(px, py, other.position.x, other.position.y) < 22) { tooClose = true;
            break; }
          }
          if(!tooClose) valid = true;
        } else if (attempts > 45) {
            break;
        }
      }

      if (valid) {
        let peg = Matter.Bodies.circle(px, py, 2.5, { 
            isStatic: true, 
            restitution: pegRestitution,
            collisionFilter: { category: 2 } 
        });
        pegs.push(peg);
        Matter.World.add(world, peg);
      }
    }
  }

  let sV = [5000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000];
  let curX = 0;
  zones = [];
  for (let i = 0; i < 21; i++) {
    let zw = (map(abs(i - 10), 0, 10, 2.5, 1.0) / 36.1) * W;
    zones.push({ 
      x: curX, 
      w: zw, 
      score: sV[i], 
      flash: 0, 
      flashColor: color(255),
      ballsInZone: []  // ← přidáno – seznam kuliček v zóně
    });
    if (i > 0) { 
        let wall = Matter.Bodies.rectangle(curX, H - (ZONE_H/2), 6, ZONE_H, { isStatic: true, friction: 0.5 });
        walls.push(wall); Matter.World.add(world, wall); 
    }
    curX += zw;
  }
  Matter.World.add(world, [Matter.Bodies.rectangle(W/2, H + 48, W, 100, {isStatic:true, friction: 1})]);
}

function drawPegs() { 
  noStroke();
  let pegR = map(currentGravity, 0.05, 1.95, 0, 255);
  let pegG = map(currentGravity, 0.05, 1.95, 255, 100);
  let pegB = map(currentGravity, 0.05, 1.95, 255, 0);
  let pegBaseCol = color(pegR, pegG, pegB);
  for (let p of pegs) { 
    p.glow = p.glow || 0;
    if (p.glow > 0) { 
      fill(pegR, pegG + 50, pegB + 50, p.glow);
      rect(p.position.x - 4, p.position.y - 4, 8, 8); 
      p.glow -= 20; 
    } 
    fill(pegBaseCol);
    rect(p.position.x - 2, p.position.y - 2, 4, 4); 
  } 
}

function drawUI() {
  push(); 
  fill(0, 0, 30, 255); 
  noStroke();
  rect(0, 0, W, 85); 
  stroke(0, 255, 255, 100); 
  strokeWeight(2); 
  line(0, 83, W, 83);

  let logoX = 20;
  let logoY = 40;
  textAlign(LEFT, CENTER);
  fill(0, 255, 255, 20);
  textSize(64); 
  text(GAME_TITLE, logoX + 4, logoY + 4); 
  fill(255);
  textSize(64);
  text(GAME_TITLE, logoX, logoY);
  fill(0, 255, 255);
  textSize(10);
  text("STABLE SINGULARITY SIMULATION v5.4.1", logoX + 2, logoY + 34);
  let dropZoneW = 400;
  let dropZoneX = W/2 - (dropZoneW / 2);
  let pulse = sin(frameCount * 0.1) * 3;
  fill(0, 255, 255, 10 + pulse);
  rect(dropZoneX - 10, 6, dropZoneW + 20, 72, 15);
  fill(5, 5, 20, 250);
  stroke(0, 255, 255, 120 + pulse * 10);
  strokeWeight(2);
  rect(dropZoneX, 10, dropZoneW, 64, 12);
  
  noStroke();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(16);
  text("SYSTEM STATUS: ONLINE", dropZoneX + dropZoneW/2, 32);
  fill(0, 255, 255);
  textSize(10);
  text("GEOMETRY: PROCEDURAL | DATA: SYNCED", dropZoneX + dropZoneW/2, 55);
  fill(0, 255, 255); textAlign(RIGHT); textSize(9); 
  text(`${currentDestination}`, W - 25, 25);
  
  let gDisp = floor(map(currentGravity, 0.05, 1.95, 1, 99)); 
  fill(200); textSize(8);
  text(`G-FORCE: ${gDisp} [R-${roundCount}]`, W - 25, 45); 
  
  fill(255, 150, 0); 
  text(`BOUNCE-X: ${currentBounce}`, W - 25, 60);
  pop();
  
  push(); translate(0, 100);
  fill(100, 100, 150, 100); rect(10, 0, 250, 225); 
  fill(0, 0, 20, 245); rect(12, 2, 246, 221); 
  fill(0, 255, 255); textAlign(CENTER);
  textSize(9); 
  text("MISSION MILESTONES", 130, 20); 
  textAlign(LEFT);
  allTimeRecords.forEach((rec, i) => { 
    let tSize = (i === 0) ? 12 : (i === 1) ? 10 : 9;
    textSize(tSize);
    fill(rec.color[0], rec.color[1], rec.color[2]); 
    text(`${i+1}. ${rec.name}`, 22, 48 + i * 22); 
    textAlign(RIGHT);
    fill(255, 180);
    text(rec.score, 248, 48 + i * 22);
    textAlign(LEFT);
  });
  translate(0, 235);
  fill(100, 100, 150, 100); rect(10, 0, 250, 60); 
  fill(0, 0, 30, 245); rect(12, 2, 246, 56);
  textSize(8);
  if (gameState === "PLAYING") { 
    textAlign(LEFT, CENTER); 
    fill(timer < 10 ? color(255,0,0) : color(0,255,255));
    text("WARP-DRIVE: " + timer + "s", 22, 18); 
    fill(0, 255, 0); 
    text(`ACTIVE UNITS: ${totalBallsFired}`, 22, 42);
  } else if (gameState === "WAITING") {
    textAlign(LEFT, CENTER); fill(255, 200, 0);
    text("COOLING DOWN...", 22, 18);
    fill(0, 255, 0); text(`TOTAL UNITS: ${totalBallsFired}`, 22, 42);
  }
  pop();
  
  push(); translate(W - 260, 100);
  let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 12); 
  fill(100, 100, 150, 100); rect(0, 0, 250, 285);
  fill(0, 0, 20, 240); rect(2, 2, 246, 281); 
  fill(0, 255, 255); 
  textAlign(CENTER); textSize(10); text("TOP CONTRIBUTORS", 125, 20); 
  textAlign(LEFT); textSize(8);
  sorted.forEach((e, i) => { 
    fill(e[1].color); 
    text(`${nf(i+1, 2)}. ${e[0]}`, 15, 50 + i * 19); 
    textAlign(RIGHT); fill(255); text(e[1].score, 235, 50 + i * 19); 
    textAlign(LEFT);
  });
  pop();
}

function mouseClicked() {
  if (mouseX > 10 && mouseX < 260 && mouseY > 100 && mouseY < 130) {
    allTimeRecords = Array(8).fill({ name: "NONE", score: 0, color: [100, 100, 100] });
    localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords));
    shakeAmount = 5; 
    return;
  }
  if (mouseY > 0 && mouseY < 85) {
    spawnBall(random(TEST_BOTS));
    shakeAmount = 2;
  }
}

function drawWalls() { 
  stroke(100); 
  strokeWeight(2);
  for (let w of walls) line(w.position.x, H - ZONE_H, w.position.x, H);
}

function updateTravelSpeed() { currentTravelSpeed = lerp(currentTravelSpeed, (gameState === "PLAYING" ? 1.0 : 0.2), 0.01);
}

function createExplosion(x, y) { for (let i = 0; i < 25; i++) explosions.push({ x: x, y: y, vx: random(-5, 5), vy: random(-5, 5), life: 255, col: color(255, random(100, 255), 0) });
}

function drawExplosions() { 
    for (let i = explosions.length - 1; i >= 0; i--) { 
        let e = explosions[i];
        fill(red(e.col), green(e.col), blue(e.col), e.life); rect(e.x, e.y, 4, 4); e.x += e.vx; e.y += e.vy; e.life -= 5;
        if (e.life <= 0) explosions.splice(i, 1); 
    } 
}

function updateComet() { 
    if (currentComet === null && gameState === "PLAYING" && random() < 0.003) {
        currentComet = { x: random(W), y: -50, targetX: W + 100, targetY: H + 100, progress: 0, speed: random(0.01, 0.03), size: random(6, 10), color: color(255, 255, 200, 200) };
    }
    if (currentComet) { 
        currentComet.progress += currentComet.speed;
        let curX = lerp(currentComet.x, currentComet.targetX, currentComet.progress), curY = lerp(currentComet.y, currentComet.targetY, currentComet.progress); 
        fill(currentComet.color); ellipse(curX, curY, currentComet.size);
        if (currentComet.progress > 1.2) currentComet = null; 
    } 
}

function checkAllTimeRecords(n, s, col) { 
    let idx = allTimeRecords.findIndex(r => r.name === n);
    if (idx !== -1) { if (s > allTimeRecords[idx].score) allTimeRecords[idx].score = s;
    } 
    else allTimeRecords.push({ name: n, score: s, color: [red(col), green(col), blue(col)] });
    allTimeRecords.sort((a, b) => b.score - a.score); allTimeRecords = allTimeRecords.slice(0, 8); 
    localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords));
}

function updateWinnerColor() { 
    let s = Object.entries(leaderboard).sort((a,b) => b[1].score - a[1].score);
    winnerColor = s.length > 0 ? lerpColor(winnerColor, s[0][1].color, 0.005) : color(0,0,128);
}

function updateScore(n, p, c) { if (!leaderboard[n]) leaderboard[n] = { score: 0, color: c }; leaderboard[n].score += p;
}

function generateDeepSpaceElements() { 
    massivePlanets = [];
    for(let i=0; i<3; i++) massivePlanets.push({ x: random(W), y: random(H), size: random(20, 50), color: color(random(30, 80), 100), hasRing: random() < 0.8, ringColor: color(random(80, 150), 80), speed: random(0.005, 0.015), rot: random(TWO_PI), rotSpeed: random(-0.01, 0.01) });
    spaceDebris = []; for(let i=0; i<10; i++) spaceDebris.push({ x: random(W), y: random(H), type: random(["UFO", "SATELLITE", "ASTEROID"]), size: random(10, 25), speed: random(0.3, 1.2), wobble: random(0.02, 0.05), rot: random(TWO_PI), rotSpeed: random(-0.05, 0.05) });
}

function onUserJoin(username, imgUrl) {
    if (viewerSpaceObjects.find(o => o.name === username)) return;
    let obj = {
        name: username,
        x: random(100, W-100),
        y: random(100, H-300),
        vx: random(-0.3, 0.3),
        vy: random(-0.3, 0.3),
        baseSize: 40,
        extraSize: 0,
        color: [random(100, 255), random(100, 255), random(255)],
        img: null,
        angle: random(TWO_PI)
    };
    if (imgUrl) loadImage(imgUrl, loaded => { obj.img = loaded; });
    viewerSpaceObjects.push(obj);
}

function updateUserLikes(username, count) {
    let obj = viewerSpaceObjects.find(o => o.name === username);
    if (obj) {
        obj.extraSize += count * 2; 
        if (obj.extraSize > 150) obj.extraSize = 150; 
    } else {
        onUserJoin(username, null);
        setTimeout(() => updateUserLikes(username, count), 500);
    }
}

function onUserQuit(username) {
    viewerSpaceObjects = viewerSpaceObjects.filter(o => o.name !== username);
}
