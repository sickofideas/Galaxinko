// --- GALAXINKO (v5.1.0 - PROCEDURAL BOUNCE EDITION) ---

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

// --- NEW ANTI-BOT VARIABLES ---
let camOffset = { x: 0, y: 0, z: 1.0 };
let glitchTimer = 0;
let targetFPS = 60;

// --- SIMULATION DATA ---
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
    
    if (data.event === "like") {
      let count = data.data.likeCount || 1;
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

// --- THE HOLE (SINGULARITY) ---
let blackHole = null; 
let bhSpawnTimes = [];

// --- PROCEDURAL RELAX JUKEBOX ---
let musicScale = [48, 52, 55, 57, 60, 64, 67, 72]; // Pentatonika pro relax
let nextNoteTime = 0;
let bhOsc; 

const W = 900; 
const H = 950; 
const ZONE_H = 100; 

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
  bhOsc = new p5.Oscillator('sawtooth');
  
  for(let i=0; i<100; i++) stars.push({ x: random(W), y: random(H), s: random(1, 2.5), speed: random(0.1, 0.4) });
  for(let i=0; i<400; i++) dust.push({ x: random(W), y: random(H), s: random(0.5, 1.5) });
  
  currentGravity = random(0.05, 1.95);
  currentBounce = floor(random(1, 100));
  
  // NASTAVENÍ NÁHODNÉ DÉLKY (40s - 180s)
  timer = floor(random(40, 181));
  
  currentDestination = generatePlanetName();
  generateDeepSpaceElements();
  prepareSingularityEvents();
  connectTikfinity();
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
  if (typeof scale === "function") {
    scale(camOffset.z);
  } else {
    p5.prototype.scale(camOffset.z);
  }
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
  
  try {
    Matter.Engine.update(engine, 1000 / 60);
  } catch (e) {
    console.error("Matter.js Engine Error - Auto-recovering...");
  }
  
  handleBlackHole();

  if (millis() - lastTick > 1000) {
    if (gameState === "PLAYING") {
      timer--;
      checkSingularitySpawn();
      if (random() < 0.11) spawnRareLegend();
      
      if (timer <= 0) { 
        gameState = "WAITING"; 
        waitStartTime = millis(); 
        shakeAmount = 2; 
        playCleanupSound(); 
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
    if (flashEffect % 2 === 0) filter(INVERT); 
    flashEffect--; 
  }
  pop();
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

  let ballBody = Matter.Bodies.rectangle(W/2 + random(-15, 15), 90, 10, 10, { 
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

    if (pos.y > H - ZONE_H - 10) {
      Matter.Body.set(b.body, { friction: 0.6, frictionAir: 0.1 });
      
      if (!b.scored) {
        let cz = zones.find(z => pos.x >= z.x && pos.x < z.x + z.w);
        if (cz) { 
          b.scored = true; 
          updateScore(b.name, cz.score, b.color); 
          cz.flash = 255; 
          cz.flashColor = b.color; 
          
          if(cz.score >= 5000) { 
              flashEffect = 20;
              shakeAmount = 15;
              playJackpotSound(); 
          } 
          checkAllTimeRecords(b.name, leaderboard[b.name].score, b.color); 
        }
      }
    }
    
    if (pos.y > H + 150 || pos.x < -150 || pos.x > W + 150) {
        removeBall(b);
    }
  }
}

function drawZones() { 
  for (let z of zones) { 
    let isJackpot = (z.score >= 5000);
    
    if (z.flash > 0) {
      fill(z.flashColor);
      z.flash -= 10;
    } else {
      fill(isJackpot ? color(40, 30, 0, 200) : color(10, 10, 40, 180));
    }
    
    noStroke(); 
    rect(z.x, H - ZONE_H, z.w, ZONE_H); 
    
    push(); 
    translate(z.x + z.w/2, H - 15); 
    rotate(-HALF_PI); 
    textAlign(LEFT, CENTER); 
    
    if (isJackpot) {
      let blinkCol = (frameCount % 30 < 15) ? color(255, 215, 0) : color(255, 255, 255);
      fill(blinkCol);
      textSize(13);
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
    rect(50, 50, W - 100, H - 100, 20);
    stroke(0, 255, 255, 150);
    strokeWeight(3);
    noFill();
    rect(60, 60, W - 120, H - 120, 15);

    noStroke();
    fill(0, 255, 255);
    textAlign(CENTER);
    textSize(28);
    text("ROUND COMPLETE", W/2, 140);
    
    fill(255, 215, 0);
    textSize(16);
    text(`SECTOR: ${currentDestination}`, W/2, 180);

    let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 7); 
    
    for (let i = 0; i < sorted.length; i++) {
        let entry = sorted[i];
        let yPos = 260 + i * 65;
        fill(255, 255, 255, 20);
        rect(100, yPos - 35, W - 200, 55, 5);
        textAlign(LEFT);
        fill(entry[1].color);
        textSize(22);
        text(`${i + 1}. ${entry[0]}`, 130, yPos);
        textAlign(RIGHT);
        fill(255);
        text(entry[1].score.toLocaleString(), W - 130, yPos);
    }

    textAlign(CENTER);
    fill(255, 50, 50);
    textSize(14);
    let barWidth = map(resultsTimer, 0, 10, 0, 300);
    rect(W/2 - 150, H - 150, barWidth, 10);
    fill(255);
    text(`NEXT JUMP IN: ${resultsTimer}s`, W/2, H - 110);
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
      stroke(200, 200, 255, 120); strokeWeight(1); noFill(); rect(-d.size/4, -d.size/4, d.size/2, d.size/2); line(-d.size, 0, d.size, 0); rect(-d.size, -d.size/6, d.size/2, d.size/3); rect(d.size/2, -d.size/6, d.size/2, d.size/3); 
    } else { 
      fill(80, 150); noStroke(); rect(-d.size/2, -d.size/2, d.size, d.size, 3); 
    }
    pop();

    if (currentComet) {
      let cometX = lerp(currentComet.x, currentComet.targetX, currentComet.progress);
      let cometY = lerp(currentComet.y, currentComet.targetY, currentComet.progress);
      if (dist(d.x, d.y, cometX, cometY) < d.size + currentComet.size) {
        createExplosion(d.x, d.y);
        playExplosionSound();
        shakeAmount = 10;
        spaceDebris.splice(i, 1);
        currentComet = null;
        continue;
      }
    }

    if (d.y > H + 150) {
      if (d.isRare) spaceDebris.splice(i, 1);
      else { d.y = -100; d.x = random(W); }
    }
  }
  
  if (gameState === "PLAYING") planetSize = lerp(planetSize, 120 + map(timer, 40, 0, 0, 1) * 350, 0.05);
  else if (gameState === "WAITING") planetSize = lerp(planetSize, 450, 0.01);
  
  if (planetSize > 10) { 
    for(let r = 4; r > 0; r--) { 
      fill(red(winnerColor), green(winnerColor), blue(winnerColor), 4); 
      ellipse(W/2, H + 60, planetSize * (r * 0.6), planetSize * 0.4); 
    } 
  }
}

function drawLegendShape(d) {
  noStroke(); fill(d.color);
  let s = d.size;
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
  let r = map(currentGravity, 0.05, 1.95, 100, 255);
  let g = map(currentGravity, 0.05, 1.95, 200, 100);
  let b = map(currentGravity, 0.05, 1.95, 255, 50);
  fill(r, g, b, 150);
  noStroke();
  let dustSpeed = currentGravity * 3 * currentTravelSpeed;
  for (let d of dust) {
    if (blackHole) {
      let distToBH = dist(d.x, d.y, blackHole.x, blackHole.y);
      if (distToBH < 120) {
        let angle = atan2(blackHole.y - d.y, blackHole.x - d.x);
        d.x += cos(angle) * 4; d.y += sin(angle) * 4;
      }
    }
    d.y += dustSpeed;
    if (d.y > H) { d.y = 0; d.x = random(W); }
    rect(d.x, d.y, d.s, d.s);
  }
}

function prepareSingularityEvents() {
  bhSpawnTimes = [];
  // Upraveno, aby se černé díry spouštěly dříve v kratších kolech
  if (random() < 0.4) bhSpawnTimes.push(floor(random(5, timer * 0.8)));
}

function checkSingularitySpawn() {
  if (bhSpawnTimes.includes(timer) && !blackHole) {
    let fromLeft = random() < 0.5;
    blackHole = {
      x: fromLeft ? -150 : W + 150,
      y: random(200, H - 350),
      startY: 0,
      targetX: fromLeft ? W + 250 : -250,
      speed: random(0.8, 1.5),
      size: random(60, 110),
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
    let vol = map(centerDist, W, 0, 0, 0.12);
    bhOsc.amp(vol, 0.1);
    bhOsc.freq(35 + n * 15);
  }

  push(); translate(blackHole.x, blackHole.y); noStroke();
  for(let i=5; i>0; i--) { 
    fill(10 + i*10, 0, 40 + i*20, 25); 
    let s = jitterSize + i * (blackHole.size * 0.15) + (n * 10); 
    ellipse(0, 0, s); 
  }
  fill(0); ellipse(0, 0, jitterSize); pop();

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
    
    if (d < blackHole.size * 2.8) { 
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
  
  // RESET S NÁHODNOU DÉLKOU (40s - 180s)
  timer = floor(random(40, 181)); 
  
  leaderboard = {}; 
  totalBallsFired = 0; 
  roundCount++; 
  gameState = "PLAYING";
  resultsTimer = 10;
  currentDestination = generatePlanetName(); 
  if (world) Matter.World.clear(world, false);
  pegs = []; walls = []; balls = []; blackHole = null;
  initGame(); 
  generateDeepSpaceElements(); 
  prepareSingularityEvents();
}

function generatePlanetName() {
  const names = ["XERON", "KEPLER", "ZENON", "AETHER", "NIBIRU", "PANDORA", "CYGNUS", "TITAN", "VULCAN", "ARRAKIS"];
  const types = ["PRIME", "STATION", "SYSTEM", "REACH", "BETA", "MAJOR", "MINOR", "VOID"];
  return random(names) + " " + random(types);
}

function initGame() {
  if(!engine) { 
    engine = Matter.Engine.create(); 
    world = engine.world; 
  }
  world.gravity.y = currentGravity;

  const patterns = ["SPIRAL", "WAVES", "HOURGLASS", "CHAOS", "FIELDS", "GALAXY", "DIAMOND"];
  const mode = random(patterns);
  console.log("Generating Pattern: " + mode + " | Bounce: " + currentBounce);

  let numPegs = floor(random(250, 450));
  let pegRestitution = map(currentBounce, 1, 99, 0.1, 1.8);

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
          py = 150 + i * 1.8;
          break;
        case "WAVES":
          px = map(i % 20, 0, 20, 50, W-50);
          py = 150 + floor(i/20) * 40 + sin(i * 0.5) * 30;
          break;
        case "HOURGLASS":
          let row = floor(i / 15);
          let col = i % 15;
          let shrink = abs(row - 15) * 12;
          px = map(col, 0, 15, 100 + shrink, W - 100 - shrink);
          py = 150 + row * 25;
          break;
        case "GALAXY":
          let a = random(TWO_PI);
          let rad = pow(random(), 0.5) * 350;
          px = W/2 + cos(a) * rad;
          py = 450 + sin(a) * rad * 0.8;
          break;
        case "DIAMOND":
          let dRow = floor(i/18);
          let dCol = i % 18;
          let dOffset = abs(dRow - 15) * 15;
          px = map(dCol, 0, 18, 50 + dOffset, W - 50 - dOffset);
          py = 150 + dRow * 25;
          break;
        default: 
          px = random(60, W - 60);
          py = random(120, H - 250);
          break;
      }

      if (py > 110 && py < H - 180 && px > 40 && px < W - 40) {
        let tooClose = false;
        for(let other of pegs) {
          if(dist(px, py, other.position.x, other.position.y) < 22) { tooClose = true; break; }
        }
        if(!tooClose) valid = true;
      } else if (mode === "CHAOS" || mode === "GALAXY") {
      } else {
          valid = true; 
      }
    }

    if (valid) {
      let peg = Matter.Bodies.circle(px, py, 2.5, { 
          isStatic: true, 
          restitution: pegRestitution 
      });
      pegs.push(peg);
      Matter.World.add(world, peg);
    }
  }

  let sV = [5000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000];
  let curX = 0;
  zones = [];
  for (let i = 0; i < 21; i++) {
    let zw = (map(abs(i - 10), 0, 10, 2.5, 1.0) / 36.1) * W;
    zones.push({ x: curX, w: zw, score: sV[i], flash: 0, flashColor: color(255) });
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
  text("STABLE SINGULARITY SIMULATION v5.1.0", logoX + 2, logoY + 34);
  
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
  fill(0, 255, 255); textAlign(CENTER); textSize(9); 
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
    text("CLEANUP PHASE...", 22, 18);
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

function updateTravelSpeed() { currentTravelSpeed = lerp(currentTravelSpeed, (gameState === "PLAYING" ? 1.0 : 0.2), 0.01); }

function createExplosion(x, y) { for (let i = 0; i < 25; i++) explosions.push({ x: x, y: y, vx: random(-5, 5), vy: random(-5, 5), life: 255, col: color(255, random(100, 255), 0) }); }

function drawExplosions() { 
    for (let i = explosions.length - 1; i >= 0; i--) { 
        let e = explosions[i]; fill(red(e.col), green(e.col), blue(e.col), e.life); rect(e.x, e.y, 4, 4); e.x += e.vx; e.y += e.vy; e.life -= 5; 
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
    if (idx !== -1) { if (s > allTimeRecords[idx].score) allTimeRecords[idx].score = s; } 
    else allTimeRecords.push({ name: n, score: s, color: [red(col), green(col), blue(col)] }); 
    allTimeRecords.sort((a, b) => b.score - a.score); allTimeRecords = allTimeRecords.slice(0, 8); 
    localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords));
}

function updateWinnerColor() { 
    let s = Object.entries(leaderboard).sort((a,b) => b[1].score - a[1].score); 
    winnerColor = s.length > 0 ? lerpColor(winnerColor, s[0][1].color, 0.005) : color(0,0,128); 
}

function removeBall(b) { 
  if (b.body) {
    Matter.World.remove(world, b.body); 
    b.body = null;
  }
  let i = balls.indexOf(b); 
  if (i !== -1) balls.splice(i, 1); 
}

function updateScore(n, p, c) { if (!leaderboard[n]) leaderboard[n] = { score: 0, color: c }; leaderboard[n].score += p; }

function generateDeepSpaceElements() { 
    massivePlanets = []; for(let i=0; i<3; i++) massivePlanets.push({ x: random(W), y: random(H), size: random(20, 50), color: color(random(30, 80), 100), hasRing: random() < 0.8, ringColor: color(random(80, 150), 80), speed: random(0.005, 0.015), rot: random(TWO_PI), rotSpeed: random(-0.01, 0.01) }); 
    spaceDebris = []; for(let i=0; i<10; i++) spaceDebris.push({ x: random(W), y: random(H), type: random(["UFO", "SATELLITE", "ASTEROID"]), size: random(10, 25), speed: random(0.3, 1.2), wobble: random(0.02, 0.05), rot: random(TWO_PI), rotSpeed: random(-0.05, 0.05) }); 
}

function updateJukebox() {
  if (!audioStarted) return;
  // Procedurální melodie - náhodné tóny z relaxační stupnice
  if (millis() > nextNoteTime) {
    let note = random(musicScale); 
    // Velmi jemný tón s dlouhým dozvukem
    synth.play(midiToFreq(note), 0.04, 0, 5); 
    nextNoteTime = millis() + random(2000, 6000); 
  }
  
  // Mírná modulace pozadí pro pocit pohybu vesmírem
  let mod = noise(frameCount * 0.005);
  backgroundOsc.freq(55 + mod * 2);
  backgroundOsc2.freq(55.5 - mod * 2); // Interference tvoří jemné vlnění
} 

function startSpaceAudio() { 
    if (!audioStarted) { 
        userStartAudio(); 
        backgroundOsc.freq(55); backgroundOsc.amp(0.015, 4); backgroundOsc.start();
        backgroundOsc2.freq(55.5); backgroundOsc2.amp(0.015, 4); backgroundOsc2.start();
        bhOsc.freq(30); bhOsc.amp(0); bhOsc.start(); 
        audioStarted = true; 
    } 
}

function playSpawnSound() { if (audioStarted) fxSynth.play(midiToFreq(72), 0.01, 0, 0.5); }
function playCleanupSound() { if (audioStarted) fxSynth.play(midiToFreq(48), 0.02, 0, 2.0); }
function playJackpotSound() { if (audioStarted) { fxSynth.play(midiToFreq(67), 0.03, 0, 2.0); fxSynth.play(midiToFreq(72), 0.03, 0.5, 2.0); } }
function playExplosionSound() { if (audioStarted) fxSynth.play(midiToFreq(36), 0.04, 0, 1.0); }
