// --- GALAXINKO (v3.9.5 - Tikfinity Event API Connected) ---

// 1. PROPOJENÍ S TIKFINITY (EVENT API)
let socket;
const TIKFINITY_URL = "ws://localhost:21213/";

function connectTikfinity() {
  socket = new WebSocket(TIKFINITY_URL);

  socket.onopen = function() {
    console.log("[Tikfinity] Spojení navázáno - Hra naslouchá eventům");
  };

  socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    
    // REAKCE NA LIKE
    if (data.event === "like") {
      let name = data.data.nickname || data.data.uniqueId || "USER";
      spawnBall(name.toUpperCase().substring(0, 12));
    }
    
    // VOLITELNÉ: REAKCE NA FOLLOW (pokud chceš, smaž dvě lomítka níže)
    // if (data.event === "follow") { spawnBall("NEW FOLLOW!"); }
  };

  socket.onerror = function(error) {
    console.log("[Tikfinity] Chyba spojení. Ujisti se, že máš zapnutou aplikaci Tikfinity.");
  };

  socket.onclose = function() {
    console.log("[Tikfinity] Spojení ztraceno, zkouším se znovu připojit za 5s...");
    setTimeout(connectTikfinity, 5000);
  };
}

// 2. KONFIGURACE HRY
const GAME_TITLE = "GALAXINKO"; 
let engine, world;
let balls = [];
let pegs = [];
let zones = [];
let walls = [];
let explosions = []; 
let leaderboard = {}; 
let timer = 40; 
let resultsTimer = 12; 
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

let stars = [];
let dust = []; 
let massivePlanets = []; 
let spaceDebris = []; 
let currentComet = null;
let planetSize = 0;
let currentTravelSpeed = 1.0; 

let blackHole = null; 
let bhSpawnTimes = [];

let chords = [[55, 65.41, 82.41], [48.99, 61.74, 73.42], [65.41, 77.78, 98.00], [43.65, 51.91, 65.41]];
let currentChord = 0;
let synthVoices = [];
let nextChordTime = 0;

const W = 900; 
const H = 950; 
const ZONE_H = 100; 

// POMOCNÉ FUNKCE
function getURLParams() {
  let params = {};
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0]) params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
}

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

let synth, fxSynth, backgroundOsc;
let audioStarted = false;

let allTimeRecords = [
  { name: "NONE", score: 0, color: [255, 215, 0] },
  { name: "NONE", score: 0, color: [192, 192, 192] },
  { name: "NONE", score: 0, color: [205, 127, 50] }
];

function preload() {
  let script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
  script.onload = () => { libraryLoaded = true; };
  document.head.appendChild(script);
  let link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

function setup() {
  createCanvas(W, H);
  noSmooth();
  textFont('Press Start 2P');
  winnerColor = color(0, 0, 128);
  
  synth = new p5.MonoSynth(); 
  fxSynth = new p5.PolySynth(); 
  backgroundOsc = new p5.Oscillator('sine');
  
  for(let i=0; i<3; i++) {
    let osc = new p5.Oscillator('triangle');
    osc.amp(0);
    synthVoices.push(osc);
  }
  
  for(let i=0; i<100; i++) stars.push({ x: random(W), y: random(H), s: random(1, 2.5), speed: random(0.1, 0.4) });
  for(let i=0; i<400; i++) dust.push({ x: random(W), y: random(H), s: random(0.5, 1.5) });
  
  currentDestination = generatePlanetName();
  generateDeepSpaceElements();
  prepareSingularityEvents();

  // INICIALIZACE SPOJENÍ S TIKFINITY
  connectTikfinity();
}

function draw() {
  if (!libraryLoaded) return;
  if (!engine) initGame();

  updateJukebox(); 

  push();
  if (shakeAmount > 0) { 
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount)); 
    shakeAmount *= 0.92; 
  }
  updateWinnerColor();
  updateTravelSpeed(); 
  
  background(2, 2, 8);
  drawGravityDust(); 
  drawGalacticBackground(); 
  
  Matter.Engine.update(engine, 1000 / 60);
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
    if (balls.length === 0 || timeSinceWait > 9) { 
      gameState = "RESULTS"; 
      resultsTimer = 12; 
    }
  }

  drawZones(); 
  drawWalls(); 
  drawPegs(); 
  drawBalls(); 
  drawExplosions();
  drawUI();
  
  if (gameState === "RESULTS") drawResultsOverlay();
  if (flashEffect > 0) { 
    if (flashEffect % 2 === 0) filter(INVERT); 
    flashEffect--; 
  }
  pop();
}

function spawnBall(userName) { 
  if (!libraryLoaded || gameState !== "PLAYING") return; 
  startSpaceAudio(); 
  playSpawnSound(); 
  totalBallsFired++; 
  let ballBody = Matter.Bodies.rectangle(W/2 + random(-15, 15), 80, 10, 10, { 
    restitution: 0.6, 
    friction: 0.01, 
    frictionAir: 0.04, 
    density: 0.001 
  }); 
  
  balls.push({ 
    body: ballBody, 
    name: userName, 
    color: color(random(100,255), random(100,255), random(100,255)), 
    scored: false 
  }); 
  Matter.World.add(world, ballBody); 
}

function drawBalls() {
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i], pos = b.body.position; 
    push(); 
    translate(pos.x, pos.y); 
    rotate(b.body.angle); 
    fill(b.color); 
    stroke(255); 
    strokeWeight(1); 
    rect(-5, -5, 10, 10); 
    
    rotate(-b.body.angle); 
    fill(255);
    noStroke();
    textAlign(CENTER);
    textSize(8);
    text(b.name, 0, -12); 
    pop();
    
    for(let p of pegs) {
      if(abs(pos.x - p.position.x) < 11 && abs(pos.y - p.position.y) < 11) p.glow = 255;
    }

    if (!b.scored && pos.y > H - ZONE_H) {
      let cz = zones.find(z => pos.x >= z.x && pos.x < z.x + z.w);
      if (cz) { 
        b.scored = true; 
        cz.ballsInZone.push(b); 
        updateScore(b.name, cz.score, b.color); 
        cz.flash = 255; 
        cz.flashColor = b.color; 
        if(cz.score >= 5000) { 
            flashEffect = 14; 
            playJackpotSound(); 
        } 
        checkAllTimeRecords(b.name, leaderboard[b.name].score, b.color); 
      }
    }
    
    if (pos.y > H + 50 || pos.x < -50 || pos.x > W + 50) {
        removeBall(b);
    }
  }
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
    case "STARMAN": 
      rect(-s/2, -s/4, s, s/2, 5); fill(255); ellipse(-s/4, -s/4, s/5);
      break;
    case "HAWKING": 
      fill(100); rect(-s/2, 0, s, s/4); fill(d.color); rect(-s/4, -s/2, s/2, s/2);
      noFill(); stroke(0, 255, 255); ellipse(0, -s/4, s*1.5, s/3);
      break;
    case "LAIKA": 
      fill(150, 100); ellipse(0, 0, s, s); fill(d.color); ellipse(0, -s/6, s/2); fill(0); ellipse(-2,-2,2);
      break;
    case "ET": 
      fill(100, 50, 0); rect(-s/2, 0, s, s/2); fill(255); ellipse(0, -s/4, s/2);
      break;
    case "NYAN": 
      fill(255, 200, 150); rect(-s/2, -s/3, s, s/1.5, 3); fill(d.color); rect(-s/2.5, -s/4, s/1.2, s/2);
      for(let j=0; j<3; j++) { fill(255, j*50, 0); rect(-s*1.5, -s/3 + j*(s/4), s, s/4); }
      break;
    case "VOYAGER": 
      fill(180); ellipse(0, 0, s/2); line(0, 0, s, s); fill(212, 175, 55); ellipse(0, 0, s/3);
      break;
    case "OUMUAMUA": 
      fill(60, 40, 30); ellipse(0, 0, s, s/4);
      break;
    case "SHUTTLE": 
      fill(255); triangle(-s/2, s/2, s/2, s/2, 0, -s/2); rect(-s/4, 0, s/2, s/2);
      break;
  }
}

function drawGravityDust() {
  let r = map(currentGravity, 0.1, 2.0, 100, 255);
  let g = map(currentGravity, 0.1, 2.0, 200, 100);
  let b = map(currentGravity, 0.1, 2.0, 255, 50);
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
  if (random() < 0.4) bhSpawnTimes.push(floor(random(5, timer - 5)));
}

function checkSingularitySpawn() {
  if (bhSpawnTimes.includes(timer) && !blackHole) {
    let fromLeft = random() < 0.5;
    blackHole = {
      x: fromLeft ? -150 : W + 150,
      y: random(200, H - 350),
      startY: 0,
      targetX: fromLeft ? W + 200 : -200,
      speed: random(0.5, 1.0),
      size: random(50, 120),
      noiseOffset: random(1000),
      noiseSpeed: random(0.005, 0.015),
      wobbleAmp: random(50, 120)
    };
    blackHole.startY = blackHole.y;
    bhSpawnTimes = bhSpawnTimes.filter(t => t !== timer);
  }
}

function handleBlackHole() {
  if (blackHole) {
    let dir = blackHole.targetX > blackHole.x ? 1 : -1;
    blackHole.x += blackHole.speed * dir;
    let n = noise(frameCount * blackHole.noiseSpeed + blackHole.noiseOffset);
    blackHole.y = blackHole.startY + (n - 0.5) * blackHole.wobbleAmp * 2;
    let jitterSize = blackHole.size * (1 + (n - 0.5) * 0.15);
    
    push(); translate(blackHole.x, blackHole.y); noStroke();
    for(let i=5; i>0; i--) { fill(10 + i*10, 0, 40 + i*20, 25); let s = jitterSize + i * (blackHole.size * 0.1) + (n * 15); ellipse(0, 0, s); }
    fill(0); ellipse(0, 0, jitterSize); pop();

    for (let i = pegs.length - 1; i >= 0; i--) {
      let p = pegs[i];
      if (dist(blackHole.x, blackHole.y, p.position.x, p.position.y) < jitterSize * 0.6) {
        Matter.World.remove(world, p); 
        createExplosion(p.position.x, p.position.y);
        pegs.splice(i, 1);
      }
    }

    for (let i = spaceDebris.length - 1; i >= 0; i--) {
      let dObj = spaceDebris[i];
      let dDist = dist(blackHole.x, blackHole.y, dObj.x, dObj.y);
      if (dDist < jitterSize * 1.25) { 
        let angle = atan2(blackHole.y - dObj.y, blackHole.x - dObj.x); 
        dObj.x += cos(angle) * 2; dObj.y += sin(angle) * 2; 
      }
      if (dDist < jitterSize * 0.55) { 
        createExplosion(dObj.x, dObj.y); 
        spaceDebris.splice(i, 1); 
        shakeAmount = 6; 
        playExplosionSound(); 
      }
    }

    let gravityRange = blackHole.size * 1.5; 
    for (let b of balls) {
      let d = dist(blackHole.x, blackHole.y, b.body.position.x, b.body.position.y);
      if (d < gravityRange) {
        let forceDir = Matter.Vector.sub({x: blackHole.x, y: blackHole.y}, b.body.position);
        let strength = map(d, 0, gravityRange, 0.00012 * (blackHole.size/50), 0.000001);
        Matter.Body.applyForce(b.body, b.body.position, Matter.Vector.mult(forceDir, strength));
      }
    }
    if ((dir === 1 && blackHole.x > blackHole.targetX) || (dir === -1 && blackHole.x < blackHole.targetX)) blackHole = null;
  }
}

function resetGame() {
  currentGravity = random(0.1, 2.0); 
  let gVisual = floor(map(currentGravity, 0.1, 2.0, 1, 99));
  let baseTimer = floor(random(30, 61));
  timer = (gVisual < 30) ? floor(baseTimer * map(gVisual, 1, 30, 5.0, 1.0)) : baseTimer;
  leaderboard = {}; totalBallsFired = 0; roundCount++; gameState = "PLAYING";
  currentDestination = generatePlanetName(); 
  
  if (world) {
    Matter.World.clear(world, false);
    world.gravity.y = currentGravity;
  }
  
  pegs = []; 
  walls = []; 
  balls = []; 
  blackHole = null;
  
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
  
  let rows = 32, spX = 26, spY = 23.5; 
  for (let r = 0; r < rows; r++) {
    let y = 100 + r * spY, dots = r + 3, sX = (W / 2) - ((dots - 1) * spX) / 2;
    for (let c = 0; c < dots; c++) { 
        let peg = Matter.Bodies.circle(sX + c * spX, y, 2, { isStatic: true, restitution: 0.85, friction: 0.05 }); 
        pegs.push(peg); 
        Matter.World.add(world, peg); 
    }
  }
  
  let sV = [5000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000];
  let curX = 0;
  zones = [];
  for (let i = 0; i < 21; i++) {
    let zw = (map(abs(i - 10), 0, 10, 2.5, 1.0) / 36.1) * W;
    zones.push({ x: curX, w: zw, score: sV[i], ballsInZone: [], flash: 0, flashColor: color(255) });
    if (i > 0) { 
        let wall = Matter.Bodies.rectangle(curX, H - (ZONE_H/2), 4, ZONE_H, { isStatic: true }); 
        walls.push(wall); 
        Matter.World.add(world, wall); 
    }
    curX += zw;
  }
  
  Matter.World.add(world, [
    Matter.Bodies.rectangle(-2, H-50, 10, 100, {isStatic:true}), 
    Matter.Bodies.rectangle(W+2, H-50, 10, 100, {isStatic:true}), 
    Matter.Bodies.rectangle(W/2, H-2, W, 4, {isStatic:true})
  ]);
}

function drawPegs() { 
  noStroke(); 
  for (let p of pegs) { 
    p.glow = p.glow || 0; 
    if (p.glow > 0) { 
        fill(0, 255, 255, p.glow); 
        rect(p.position.x - 4, p.position.y - 4, 8, 8); 
        p.glow -= 20; 
    } 
    fill(0, 255, 255); 
    rect(p.position.x - 2, p.position.y - 2, 4, 4); 
  } 
}

function drawUI() {
  push(); fill(0, 0, 40, 255); noStroke(); rect(0, 0, W, 60); stroke(0, 255, 255, 150); strokeWeight(2); line(0, 58, W, 58);
  
  noStroke(); textAlign(LEFT, CENTER); fill(0, 255, 255); textSize(18); text(GAME_TITLE, 25, 30);
  
  let pulse = sin(frameCount * 0.15); 
  let sizeMod = map(pulse, -1, 1, 0, 5); 
  let flashCol = (frameCount % 20 < 10) ? color(255, 255, 0) : color(255, 255, 255); 
  
  push();
  textAlign(CENTER, CENTER);
  translate(W / 2, 30);
  fill(0, 150);
  textSize(14 + sizeMod);
  text("❤ 1 LIKE = 1 DROP", 2, 2); 
  
  textSize(14 + sizeMod);
  let heartGlow = abs(sin(frameCount * 0.1)) * 100;
  let fullTxt = "❤ 1 LIKE = 1 DROP";
  let tw = textWidth(fullTxt);
  fill(255, 50 + heartGlow, 100 + heartGlow); 
  text("❤", -tw/2 + 10, 0);
  fill(flashCol);
  text("1 LIKE = 1 DROP", 15, 0);
  pop();

  fill(0, 255, 255); textAlign(RIGHT); textSize(9); text(`${currentDestination} [R-${nf(roundCount, 2)}]`, W - 25, 22);
  let gDisp = floor(map(currentGravity, 0.1, 2.0, 1, 99)); fill(200); textSize(8); text(`G-FORCE: ${gDisp}`, W - 25, 38); pop();
  
  push(); translate(0, 75); fill(192); rect(10, 0, 240, 110); fill(0, 0, 20, 230); rect(12, 2, 236, 106); fill(255, 215, 0); textAlign(LEFT); textSize(8); text("GALAXINKO RECORDS", 22, 20); 
  allTimeRecords.forEach((rec, i) => { 
    let c = rec.color; fill(c[0], c[1], c[2]); 
    drawResponsiveText(`${i+1}. ${rec.name}`, 22, 45 + i * 22, 150, 7); 
    textAlign(RIGHT); text(rec.score, 240, 45 + i * 22); 
  });
  
  fill(192); rect(10, 120, 240, 70); fill(0, 0, 30, 230); rect(12, 122, 236, 66);
  if (gameState === "PLAYING") { 
    textAlign(LEFT, CENTER); 
    fill(timer < 7 ? color(255,0,0) : color(0,255,255)); 
    text("WARP: " + timer + "s", 22, 145); 
    fill(0, 255, 0); textSize(8); text(`UNITS: ${totalBallsFired}`, 22, 172); 
  }
  else if (gameState === "WAITING") { 
    textAlign(CENTER); fill(255, 150, 0); textSize(14); text("STABILIZING...", 130, 155); 
  }
  
  let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 8); 
  fill(192); rect(W - 250, 0, 240, 210); fill(0, 0, 30, 230); rect(W - 248, 2, 236, 206); fill(255, 255, 0); textAlign(LEFT); textSize(8); text("ELITE DROPPERS", W - 238, 20); 
  sorted.forEach((e, i) => { 
    fill(e[1].color); 
    drawResponsiveText(`${i+1}. ${e[0]}`, W - 238, 50 + i * 18, 150, i === 0 ? 9 : 7); 
    textAlign(RIGHT); text(e[1].score, W - 20, 50 + i * 18); 
  }); 
  pop();
}

function keyPressed() { if ((key === 'l' || key === 'L') && gameState === "PLAYING") spawnBall("PLAYER"); }

function drawZones() { 
  for (let z of zones) { 
    fill(z.flash > 0 ? z.flashColor : color(10, 10, 40, 180)); 
    if (z.flash > 0) z.flash -= 10; 
    noStroke(); 
    rect(z.x, H - ZONE_H, z.w, ZONE_H); 
    push(); 
    translate(z.x + z.w/2, H - 15); 
    rotate(-HALF_PI); 
    textAlign(LEFT, CENTER); 
    let ds = z.w < 30 ? 7 : 10; 
    textSize(ds); 
    fill(z.score >= 5000 ? color(255, 255, 0) : 255); 
    text(z.score, 0, 0); 
    pop(); 
  } 
}

function drawWalls() { 
    fill(100); 
    for (let w of walls) rect(w.position.x - 2, H - ZONE_H, 4, ZONE_H); 
    rect(0, H - 4, W, 4); 
}

function drawResultsOverlay() { 
    fill(0, 235); rect(0, 0, W, H); 
    fill(192); rect(W/2 - 300, H/2 - 220, 600, 440); 
    fill(0, 0, 30); rect(W/2 - 296, H/2 - 216, 592, 432); 
    fill(255, 215, 0); textAlign(CENTER); textSize(24); text("MISSION COMPLETE", W/2, H/2 - 160); 
    
    let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 5); 
    sorted.forEach((e, i) => { 
        fill(e[1].color); 
        drawResponsiveText(`${i+1}. ${e[0].toUpperCase()}: ${e[1].score}`, W/2, H/2 - 60 + i * 55, 550, map(i, 0, 4, 25, 14), CENTER); 
    }); 
    
    let isLastSec = resultsTimer <= 3; 
    fill(isLastSec && frameCount % 10 < 5 ? color(255, 0, 0) : 255); 
    textAlign(CENTER); textSize(12); text("NEXT JUMP IN: " + resultsTimer + "s", W/2, H/2 + 195); 
}

function updateTravelSpeed() { currentTravelSpeed = lerp(currentTravelSpeed, (gameState === "PLAYING" ? 1.0 : 0.2), 0.01); }

function createExplosion(x, y) { 
    for (let i = 0; i < 15; i++) {
        explosions.push({ x: x, y: y, vx: random(-3, 3), vy: random(-3, 3), life: 255, col: color(255, random(100, 255), 0) });
    }
}

function drawExplosions() { 
    for (let i = explosions.length - 1; i >= 0; i--) { 
        let e = explosions[i]; 
        fill(red(e.col), green(e.col), blue(e.col), e.life); 
        rect(e.x, e.y, 3, 3); 
        e.x += e.vx; e.y += e.vy; e.life -= 5; 
        if (e.life <= 0) explosions.splice(i, 1); 
    } 
}

function updateComet() { 
    if (currentComet === null && gameState === "PLAYING" && random() < 0.003) {
        currentComet = { x: random(W), y: -50, targetX: W + 100, targetY: H + 100, progress: 0, speed: random(0.01, 0.03), size: random(4, 8), color: color(255, 255, 200, 200) };
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
    if (idx !== -1) { 
        if (s > allTimeRecords[idx].score) allTimeRecords[idx].score = s; 
    } else {
        allTimeRecords.push({ name: n, score: s, color: [red(col), green(col), blue(col)] }); 
    }
    allTimeRecords.sort((a, b) => b.score - a.score); 
    allTimeRecords = allTimeRecords.slice(0, 3); 
}

function updateWinnerColor() { 
    let s = Object.entries(leaderboard).sort((a,b) => b[1].score - a[1].score); 
    winnerColor = s.length > 0 ? lerpColor(winnerColor, s[0][1].color, 0.005) : color(0,0,128); 
}

function removeBall(b) { 
    Matter.World.remove(world, b.body); 
    let i = balls.indexOf(b); 
    if (i !== -1) balls.splice(i, 1); 
}

function updateScore(n, p, c) { 
    if (!leaderboard[n]) leaderboard[n] = { score: 0, color: c }; 
    leaderboard[n].score += p; 
}

function drawResponsiveText(t, x, y, mw, bs, al = LEFT) { 
    push(); 
    textSize(bs); 
    textAlign(al, CENTER); 
    let tw = textWidth(t); 
    if (tw > mw) textSize(bs * (mw / tw)); 
    text(t, x, y); 
    pop(); 
}

function generateDeepSpaceElements() { 
    massivePlanets = []; 
    for(let i=0; i<3; i++) massivePlanets.push({ x: random(W), y: random(H), size: random(20, 50), color: color(random(30, 80), random(30, 80), random(30, 80), 100), hasRing: random() < 0.8, ringColor: color(random(80, 150), random(80, 150), random(30, 80), 80), speed: random(0.005, 0.015), rot: random(TWO_PI), rotSpeed: random(-0.01, 0.01) }); 
    spaceDebris = []; 
    for(let i=0; i<10; i++) spaceDebris.push({ x: random(W), y: random(H), type: random(["UFO", "SATELLITE", "ASTEROID"]), size: random(10, 25), speed: random(0.3, 1.2) * (random() < 0.5 ? 1 : -1), wobble: random(0.02, 0.05), rot: random(TWO_PI), rotSpeed: random(-0.05, 0.05) }); 
}

function updateJukebox() {
  if (!audioStarted) return;
  
  if (millis() > nextChordTime) {
    currentChord = (currentChord + 1) % chords.length;
    let chordFreqs = chords[currentChord];
    
    for (let i = 0; i < synthVoices.length; i++) {
      synthVoices[i].freq(chordFreqs[i], 2.5);
      synthVoices[i].amp(0.12, 2.0); 
    }
    nextChordTime = millis() + 6000;
  }
} 

function startSpaceAudio() { 
    if (!audioStarted) { 
        userStartAudio(); 
        backgroundOsc.freq(55); 
        backgroundOsc.amp(0.04, 4); 
        backgroundOsc.start();
        
        for(let osc of synthVoices) osc.start();
        
        audioStarted = true; 
    } 
}

function playSpawnSound() { if (audioStarted) fxSynth.play('G3', 0.01, 0, 0.1); }
function playCleanupSound() { if (audioStarted) fxSynth.play('E2', 0.02, 0, 1.0); }
function playJackpotSound() { if (audioStarted) { fxSynth.play('Eb4', 0.03, 0, 1.2); fxSynth.play('Bb4', 0.03, 0.2, 1.2); } }
function playExplosionSound() { if (audioStarted) fxSynth.play('C2', 0.04, 0, 0.3); }
