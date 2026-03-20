// --- GALAXINKO (v5.7.0 – TUNE sliders + clear leaderboard + STARSHIP + SCOREBOARD+ + LIVE + SHAPE/WORD + RICH SKY PACK + VISIBLE PETS) ---
// Changelog:
// - v5.7.0: Změna chování diváků na pozadí (Pets) – 100% viditelný profilový obrázek a jméno, konec zašedlých bublin. 
//           Při připojení na live stream se okamžitě spawne 1 kulička a pet zůstane aktivní 60 vteřin. Pokud nedá like, zmizí.
// - v5.6.2: TUNE panel (Gravity, Peg Bounce) – toggle klávesou 'T' nebo klikem na ikonu "⚙" vpravo nahoře.
// - v5.6.1: RICH SKY PACK – rozmanité pozadí.
// - v5.6.0: 8bit STARSHIP, přestavěný RESULTS scoreboard, LIVE badge uprostřed, SHAPES+WORD.

const GAME_TITLE = "GALAXINKO";
const VERSION_TAG = "v5.7.0";

let engine, world;
let balls = [];
let pegs = [];
let zones = [];
let walls = [];
let explosions = [];
let sparkles = []; 
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
let roundInitialTime = 40;
let isAutoMode = true;

// --- VIEWER INTERACTION ---
let viewerSpaceObjects = [];

// --- COLLISION / EVENTS ---
let cosmicEvent = null;
let eventOccurredThisRound = false;

// --- CAMERA/ANTI-BOT ---
let camOffset = { x: 0, y: 0, z: 1.0 };
let targetFPS = 60;

const TEST_BOTS = ["ALFA_PRO","CYBER_PUNK","GALAXY_KID","NEBULA","STAR_LORD","COMET_99","VOID_WALKER","ORBITAL","Z-AXIS","QUASAR","METEOR","SOLARIS","NOVA","ECLIPSE","ZENITH","COSMOS"];

// --- TIKFINITY WEBSOCKET ---
let socket;
const TIKFINITY_URL = "ws://localhost:21213/";
function connectTikfinity() {
  socket = new WebSocket(TIKFINITY_URL);

  socket.onopen = () => { console.log("[Tikfinity] Připojeno – čekám na události"); };
  socket.onmessage = (event) => {
	try {
  	const msg = JSON.parse(event.data);
  	const evt = msg?.event || msg?.type || "";
  	const payload = msg?.data || msg;
  	const rawName = payload?.nickname || payload?.uniqueId || msg?.nickname || msg?.user?.nickname || msg?.uniqueId;
  	const hasName = !!rawName && typeof rawName === "string";
  	const name = hasName ? rawName.toUpperCase().substring(0, 12) : "ANON";
  	
    if (evt === "roomUser" && hasName) {
        // Připojení diváka - spawne objekt a spawne 1 kuličku
    	onUserJoin(name, payload?.profilePictureUrl || msg?.profilePictureUrl || "");
    	setTimeout(() => spawnBall(name), 120);
    	console.log("→ JOIN SPAWN:", name);
  	}

  	if (evt === "like" && hasName) {
    	const count = Math.max(1, Number(payload?.likeCount || 1));
    	updateUserLikes(name, count);
    	for (let i = 0; i < count; i++) setTimeout(() => spawnBall(name), i * 120);
  	}
	} catch (_) {}
  };

  socket.onerror = (err) => { console.error("[Tikfinity WS error]", err); };
  socket.onclose = () => { console.log("[Tikfinity] Odpojeno – reconnect za 5s..."); setTimeout(connectTikfinity, 5000); };
}

// --- Safe localStorage ---
function safeGet(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback;
} catch { return fallback; } }
function safeSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value));
} catch {} }

// --- BACKGROUND / AUDIO / CONSTS ---
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
  {id:"STARMAN",name:"ELON'S TESLA",col:[200,0,0],size:28},
  {id:"HAWKING",name:"S. HAWKING",col:[50,50,255],size:22},
  {id:"LAIKA",name:"LAIKA DOG",col:[200,180,150],size:18},
  {id:"ET",name:"E.T. PHONE HOME",col:[150,120,80],size:24},
  {id:"NYAN",name:"NYAN CAT",col:[255,100,200],size:25},
  {id:"VOYAGER",name:"VOYAGER 1",col:[180,180,180],size:30},
  {id:"OUMUAMUA",name:"OUMUAMUA",col:[60,40,30],size:45},
  {id:"SHUTTLE",name:"NASA SHUTTLE",col:[255,255,255],size:35}
];
let synth, fxSynth, backgroundOsc, backgroundOsc2;
let audioStarted = false;

let allTimeRecords = Array(8).fill({ name: "NONE", score: 0, color: [100, 100, 100] });
// --- SHAPES & WORDS ---
const SHAPES = { 
  "HEART":[
	"  ***** ***** ",
	" ******* ******* ",
	"*****************",
	"*****************",
	" *************** ",
	"  ************* ",
	"   *********** ",
	"	********* ",
	"  	***** ",
	"   	*** ",
	"    	* "
  ],
  "APPLE":[
	"   	*** ",
	"  	**** ",
	"    	** ",
	"	********** ",
	"  ************** ",
	" ****************",
	" ****************",
	" ****************",
	"  ************** ",
	"	********** "
  ],
  "ALIEN":[
	"  	******* ",
	"   *********** ",
	" *************** ",
	" *** ***** *** ",
	" *** ***** *** ",
	" *************** ",
	"  ************* ",
	"	*** *** "
  ],
  "HOUSE":[
	"    	* ",
	"   	*** ",
	"  	***** ",
	" 	******* ",
	"	********* ",
	"   *********** ",
	"   *********** ",
	"   *** *** *** ",
	"   *** *** *** ",
	"   *********** "
  ],
  "SWORD":[
	"    	* ",
	"   	*** ",
	"   	*** ",
	"   	*** ",
	"   	*** ",
	"   	*** ",
	"  ************* ",
	"  ************* ",
	"   	*** ",
	"   	*** ",
	"    	* "
  ],
  "MUSHROOM":[
	"  	***** ",
	"	********* ",
	"  ************* ",
	" *************** ",
	" *************** ",
	"	*** *** ",
	"	********* ",
	"	********* "
  ],
  "SMILEY":[
	" 	******* ",
	"   *********** ",
	"  *** *** *** ",
	"  *** *** ",
	"  *** \\___/ *** ",
	"   *********** ",
	" 	******* "
  ],
  "STAR":[
	"    	* ",
	"    	* ",
	"   * ******* * ",
	"   ************* ",
	"*****************",
	"   ************* ",
	"   * ******* * ",
	"    	* ",
	"    	* "
  ],
  "CAT":[
	"  ** ** ",
	" **** **** ",
	" ****** ****** ",
	" ****************",
	" *** ** ** *** ",
	" *** *** *** ",
	" *** ***** *** ",
	"  *** *** ",
	"   *********** "
  ],
  "DOG":[
	"  ***** ",
	" ******* **	",
	" ******** **** ",
	" *** ***** *** ",
	" *** *** *** ",
	" *** ***** *** ",
	"  *** ***	",
	"   ********* "
  ],
  "MUSIC":[
	" 	***** ",
	"	******* ",
	"	*** ** ",
	"	*** ** ",
	"	*** ** *** ",
	"	*** ****** ",
	"	*** **** "
  ],
  "GAMEPAD":[
	" 	********* ",
	"   *** ***	",
	"  ** ** ** ** ",
	" ** ** ** ** ",
	" ** +++++ +++  ** ",
	" ** ** ** ** ",
	"  ** O   O   ** ",
	"   *** ***	",
	" 	********* "
  ],
  "COFFEE":[
	"	***********	",
	"   ** ** ",
	"   ** ** ",
	"   ** ** ",
	"	***********	",
	"   	***** ",
	"  	* * ",
	"  	* * ",
	"   	***** "
  ],
  "GHOST":[
	"	*********	",
	"   *********** ",
	"  *** *** *** ",
	"  *** *** ",
	"  ************* ",
	"  ** ** ** ** ** ",
	"  ** ** ** ** ** "
  ],
  "BIRD":[
	" 	***** ",
	"  **** *** ",
	" *** *** ",
	" *** **** **	",
	"  *** ** *** ",
	"   ***** ** "
  ],
  "FISH":[
	" 	***** ",
	"   ********* ",
	" *** *** ***	",
	"**** * **** ",
	" *** *** ***	",
	"   ********* ",
	" 	***** "
  ],
  "CAMERA":[
	"   ************* ",
	"  ** ******* ** ",
	" ** ** ** ** ",
	" ** ******* ** ",
	" ** ** ** ** ",
	"  ** ******* ** ",
	"   ************* "
  ]
};
const LETTERS5x7 = {
  "A":[" *** ","* *","* *","*****","* *","* *","* *"],
  "B":["**** ","* *","**** ","* *","* *","* *","**** "],
  "C":[" *** ","* *","*	","*	","*	","* *"," *** "],
  "D":["**** ","* *","* *","* *","* *","* *","**** "],
  "E":["*****","*	","**** ","*	","*	","*	","*****"],
  "F":["*****","*	","**** ","*	","*	","*	","*	"],
  "G":[" *** ","* *","*	","* **","* *","* *"," *** "],
  "H":["* *","* *","*****","* *","* *","* *","* *"],
  "I":["*****","  * ","  * ","  * ","  * ","  * ","*****"],
  "J":["  ***","   * ","   * ","   * ","* * ","* * "," ** "],
  "K":["* *","* * ","*** ","** ","*** ","* * ","* *"],
  "L":["*	","*	","*	","*	","*	","*	","*****"],
  "M":["* *","** **","* * *","* *","* *","* *","* *"],
  "N":["* *","** *","* * *","* **","* *","* *","* *"],
  "O":[" *** ","* *","* *","* *","* *","* *"," *** "],
  "P":["**** ","* *","* *","**** ","*	","*	","*	"],
  "Q":[" *** ","* *","* *","* *","* * *","* **"," ****"],
  "R":["**** ","* *","* *","**** ","*** ","* * ","* *"],
  "S":[" ****","*	","*	"," *** ","	*","	*","**** "],
  "T":["*****","  * ","  * ","  * ","  * ","  * ","  * "],
  "U":["* *","* *","* *","* *","* *","* *"," *** "],
  "V":["* *","* *","* *","* *"," * * "," * * ","  * "],
  "W":["* *","* *","* *","* * *","* * *","** **","* *"],
  "X":["* *"," * * ","  * ","  * ","  * "," * * ","* *"],
  "Y":["* *"," * * ","  * ","  * ","  * ","  * ","  * "],
  "Z":["*****","   * ","  * ","  * "," * ","*	","*****"]
};
function buildWordShape(word) {
  word = word.replace(/\s+/g, "");
  const rows = 7;
  let out = Array(rows).fill("").map(()=> "");
  for (let i = 0; i < word.length; i++) {
	const ch = word[i].toUpperCase();
	const glyph = LETTERS5x7[ch];
	if (!glyph) continue;
	for (let r = 0; r < rows; r++) out[r] += glyph[r] + " ";
  }
  return out;
}

function preload() {
  let script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
  script.onload = () => { libraryLoaded = true; };
  document.head.appendChild(script);

  let link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  let saved = safeGet('galaxinko_records', null);
  if (saved) allTimeRecords = saved;
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
  for(let i = 0; i < 100; i++) stars.push({ x: random(W), y: random(H), s: random(1, 2.5), speed: random(0.1, 0.4) });
  for(let i = 0; i < 400; i++) dust.push({ x: random(W), y: random(H), s: random(0.5, 1.5) });
  
  if(isAutoMode) {
      currentGravity = random(0.05, 1.95);
      currentBounce = floor(random(1, 100));
  }

  timer = floor(random(40, 181));
  roundInitialTime = timer;

  currentDestination = generatePlanetName();
  generateDeepSpaceElements();
  prepareSingularityEvents();
  planSpaceshipForRound();
  connectTikfinity();
}

function startSpaceAudio() {
  if (audioStarted) return;
  userStartAudio();
  backgroundOsc.start(); backgroundOsc.amp(0.02, 2); backgroundOsc.freq(55);
  backgroundOsc2.start(); backgroundOsc2.amp(0.01, 2); backgroundOsc2.freq(110);
  bhOsc.start(); bhOsc.amp(0);
  audioStarted = true;
}

function mousePressed() { startSpaceAudio(); handleTuneMousePressed(); }
function touchStarted() { startSpaceAudio(); }

function playSpawnSound() {
  if (!audioStarted) return;
  let scale = [440, 493.88, 554.37, 659.25, 739.99, 880];
  fxSynth.play(random(scale) + random(-5, 5), random(0.02, 0.05), 0, random(0.05, 0.15));
}
function playJackpotSound() {
  if (!audioStarted) return;
  synth.play('C5',0.1,0,0.1); setTimeout(()=>synth.play('E5',0.1,0,0.1),100);
  setTimeout(()=>synth.play('G5',0.1,0,0.2),200); setTimeout(()=>synth.play('C6',0.2,0,0.5),300);
}
function playExplosionSound() { if (audioStarted) fxSynth.play(random(50,150), 0.1, 0, 0.2); }
function playCleanupSound() { if (audioStarted) fxSynth.play(100, 0.05, 0, 1.0); }

function playTimerEndSequence() {
  if (!audioStarted) return;
  let endNotes = [600, 400, 250, 100];
  for (let i=0;i<endNotes.length;i++){
	setTimeout(()=>{ if(gameState==="WAITING"){ fxSynth.play(endNotes[i]+random(-20,20), 0.08, 0, 0.4); shakeAmount=random(2,4);} }, i*400);
  }
  flashEffect = 60;
}
function updateJukebox() {
  if (!audioStarted || gameState!=="PLAYING") return;
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

  translate(W/2, H/2); scale(camOffset.z); translate(-W/2 + camOffset.x, -H/2 + camOffset.y);
  if (shakeAmount > 0) { translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount)); shakeAmount *= 0.92; }

  updateWinnerColor();
  updateTravelSpeed();
  background(2, 2, 8);
  drawGravityDust();
  drawGalacticBackground();

  drawViewerObjects();
  drawSparkles();

  try { Matter.Engine.update(engine, 1000/60); } catch(e) { console.error("Matter.js Engine Error - Auto-recovering..."); }

  handleBlackHole();
  handleCosmicEvent();
  handleSpaceship();
  if (millis() - lastTick > 1000) {
	if (gameState === "PLAYING") {
  	timer--;
  	checkSingularitySpawn();
  	if (!eventOccurredThisRound && timer <= Math.floor(roundInitialTime * 0.7) && random() < 0.17) triggerCosmicEvent();
  	if (shipPlanned && !spaceship && timer === shipSpawnAt) spawnSpaceship();

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
	if (balls.length === 0 || timeSinceWait > 10) { gameState = "RESULTS"; resultsTimer = 10; }
  }

  drawZones();
  drawWalls();
  drawPegs();
  drawBalls();
  drawExplosions();
  drawUI();

  drawTuneToggleButton();
  if (debugPanelVisible) drawTunePanel();

  if (gameState === "WAITING") drawWaitingMessage();
  if (gameState === "RESULTS") drawResultsOverlay();

  drawProceduralHUD();
  drawAntiBotOverlay();

  if (flashEffect > 0) { noStroke();
  fill(20, 40, 100, map(flashEffect, 0, 60, 0, 100)); rect(0, 0, W, H); flashEffect--; }

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
  if (!leaderboard[userName]) leaderboard[userName] = { score: 0, color: color(random(100,255), random(100,255), random(100,255)) };

  const obj = viewerSpaceObjects.find(o => o.name === userName);
  if (obj) pushViewerPulse(obj, color(0, 255, 255), 0.9);

  balls.push({ body: ballBody, name: userName, color: leaderboard[userName].color, scored: false });
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
	fill(b.color); stroke(255); strokeWeight(1); rect(-5, -5, 10, 10);
	rotate(-b.body.angle); fill(b.color); noStroke(); textAlign(CENTER); textSize(8); text(b.name, 0, -12);
	pop();
	for (let p of pegs) if (abs(pos.x - p.position.x) < 11 && abs(pos.y - p.position.y) < 11) p.glow = 255;
	
    if (pos.y > H - ZONE_H - 10) {
  	Matter.Body.set(b.body, { friction: 0.6, frictionAir: 0.1 });
  	if (!b.scored) {
    	let cz = zones.find(z => pos.x >= z.x && pos.x < z.x + z.w);
    	if (cz) {
      	b.scored = true;
      	updateScore(b.name, cz.score, b.color);
      	cz.flash = 255;
      	cz.flashColor = b.color;
      	if (cz.score >= 5000) { shakeAmount = 8; playJackpotSound(); }
      	checkAllTimeRecords(b.name, leaderboard[b.name].score, b.color);
    	}
  	}
	}

	if (pos.y > H + 150 || pos.x < -150 || pos.x > W + 150) removeBall(b);
  }
}

function removeBall(b) { Matter.World.remove(world, b.body); const idx = balls.indexOf(b); if (idx !== -1) balls.splice(idx, 1); }

function onUserJoin(username, imgUrl) {
  if (viewerSpaceObjects.find(o => o.name === username)) return;
  let now = millis();
  let obj = {
	name: username,
	x: random(100, W-100), y: random(100, H-300),
	vx: random(-0.5, 0.5), vy: random(-0.5, 0.5),
	baseSize: 50, extraSize: 0, // Zvětšeno pro lepší viditelnost
	color: [random(100,255), random(100,255), random(255)],
	img: null, angle: random(TWO_PI),
	fadeAlpha: 0.0, state: "fadingIn", lastActive: now, inactivityLimit: 60, // 60 sekund limit
	pulses: [], popups: [], combo: 0, comboTTL: 0, haloPhase: random(TWO_PI),
    hitFlash: 0
  };
  if (imgUrl) loadImage(imgUrl, loaded => { obj.img = loaded; });
  viewerSpaceObjects.push(obj);
}

function updateUserLikes(username, count) {
  let obj = viewerSpaceObjects.find(o => o.name === username);
  if (!obj) { onUserJoin(username, null);
  setTimeout(() => updateUserLikes(username, count), 300); return; }
  obj.lastActive = millis(); obj.state = "active";
  obj.extraSize = min(150, obj.extraSize + count * 2);
  pushViewerPulse(obj, color(255, 180, 0), 1.0);
  pushViewerPopup(obj, `+${count}`, color(255, 200, 0));
  obj.combo += count; obj.comboTTL = 120;
}

function onUserQuit(username) { let o = viewerSpaceObjects.find(v=>v.name===username); if (o) o.state = "fadingOut"; }

function pushViewerPulse(obj, col, strength=1.0) { obj.pulses.push({ r:(obj.baseSize+obj.extraSize)*0.6, maxR:(obj.baseSize+obj.extraSize)*(1.8+0.4*strength), alpha:160*strength, col }); }

function pushViewerPopup(obj, text, col) { obj.popups.push({ text, x:0, y:-(obj.baseSize+obj.extraSize)/2 - 8, vy:-0.35, alpha:220, col }); }

function addViewerScorePopup(username, points, col) {
  const o = viewerSpaceObjects.find(v => v.name === username); if (!o) return;
  pushViewerPopup(o, `+${points}`, col || color(0,255,255));
  pushViewerPulse(o, col || color(0,255,255), 1.1);
  o.lastActive = millis(); o.state = "active";
}

function drawViewerObjects() {
  for (let i = viewerSpaceObjects.length - 1; i >= 0; i--) {
	const obj = viewerSpaceObjects[i];
	const inactiveSec = (millis() - obj.lastActive) / 1000;
    
    // Zmizí po 60 vteřinách neaktivity
	if (obj.state !== "fadingOut" && inactiveSec > obj.inactivityLimit) obj.state = "fadingOut";
	
    if (obj.state === "fadingIn") { obj.fadeAlpha = min(1, obj.fadeAlpha + 0.02); if (obj.fadeAlpha >= 0.999) obj.state = "active"; }
	else if (obj.state === "fadingOut") { obj.fadeAlpha = max(0, obj.fadeAlpha - 0.01); if (obj.fadeAlpha <= 0.001) { viewerSpaceObjects.splice(i,1); continue; } }
	else { obj.haloPhase += 0.02; }
	obj.x += obj.vx + sin(frameCount*0.01)*0.1; obj.y += obj.vy + cos(frameCount*0.01)*0.1; obj.angle += 0.003;
    
    let r1 = (obj.baseSize + obj.extraSize) / 2;
	if (obj.x < r1 || obj.x > W-r1) { obj.vx *= -1; obj.x = constrain(obj.x, r1, W-r1); }
	if (obj.y < r1 || obj.y > H-250) { obj.vy *= -1; obj.y = constrain(obj.y, r1, H-250); }
    
    for (let j = i - 1; j >= 0; j--) {
        let other = viewerSpaceObjects[j];
        if (other.state === "fadingOut" || obj.state === "fadingOut") continue;
        let r2 = (other.baseSize + other.extraSize) / 2;
        let dx = other.x - obj.x;
        let dy = other.y - obj.y;
        let distSq = dx*dx + dy*dy;
        let minDist = r1 + r2;

        if (distSq < minDist * minDist && distSq > 0) {
            let distance = sqrt(distSq);
            let overlap = minDist - distance;
            let nx = dx / distance;
            let ny = dy / distance;

            obj.x -= nx * overlap * 0.5;
            obj.y -= ny * overlap * 0.5;
            other.x += nx * overlap * 0.5;
            other.y += ny * overlap * 0.5;

            let tx = obj.vx; let ty = obj.vy;
            obj.vx = other.vx; obj.vy = other.vy;
            other.vx = tx; other.vy = ty;

            obj.hitFlash = 255;
            other.hitFlash = 255;
            createSparkle((obj.x + other.x)/2, (obj.y + other.y)/2, obj.color);
        }
    }

	obj.extraSize *= 0.995;
	if (obj.extraSize < 0.05) obj.extraSize = 0; if (obj.comboTTL>0) obj.comboTTL--; else obj.combo = max(0, obj.combo - 0.3);
    
    // Plná viditelnost profilů, ignorujeme tmavnutí na pozadí
	const alphaVal = 255 * obj.fadeAlpha; 

	push(); translate(obj.x, obj.y); rotate(obj.angle);
	const totalS = obj.baseSize + obj.extraSize;
	const haloPulse = (sin(obj.haloPhase)*0.5 + 0.5); const comboBoost = min(1, obj.combo/50);
	noStroke();
    
    // Výraznější pozadí okolo profilovky
	fill(obj.color[0], obj.color[1], obj.color[2], (50 + 40*comboBoost + 20*haloPulse) * obj.fadeAlpha);
	ellipse(0,0, totalS + 15 + comboBoost*10);
    
    if (obj.hitFlash > 0) {
        fill(255, obj.hitFlash * obj.fadeAlpha);
        ellipse(0, 0, totalS + 10);
        obj.hitFlash = max(0, obj.hitFlash - 15);
    }

	for (let k=obj.pulses.length-1; k>=0; k--) {
  	const p = obj.pulses[k]; noFill();
  	stroke(red(p.col), green(p.col), blue(p.col), p.alpha * obj.fadeAlpha);
  	strokeWeight(2); ellipse(0,0,p.r);
  	p.r += 3.2; p.alpha -= 6; if (p.r > p.maxR || p.alpha <= 0) obj.pulses.splice(k,1);
	}
	const sparks = min(10, 1 + floor(obj.combo/8));
	for (let s=0;s<sparks;s++) {
  	const a = (frameCount*0.05 + s*(TWO_PI/sparks));
  	const rr = totalS*0.6 + 6 + s*0.6;
  	noStroke(); fill(255,180,0, (80+80*comboBoost)*obj.fadeAlpha); ellipse(cos(a)*rr, sin(a*1.1)*rr*0.6, 3,3);
	}
    
    // Vykreslení 100% viditelného profilového obrázku
	if (obj.img) { 
        push(); 
        imageMode(CENTER); 
        tint(255, alphaVal); 
        image(obj.img, 0,0, totalS, totalS); 
        pop(); 
    } else { 
        fill(obj.color[0],obj.color[1],obj.color[2], alphaVal); 
        ellipse(0,0,totalS); 
        fill(255, alphaVal); 
        textAlign(CENTER,CENTER); 
        textSize(totalS*0.4); 
        text(obj.name[0],0,0); 
    }
	pop();
    
    // Jméno nad objektem (nerotuje s objektem)
	fill(255, alphaVal); 
    textSize(11); 
    textAlign(CENTER);
	text(obj.name, obj.x, obj.y + totalS/2 + 18);
    
	for (let b=obj.popups.length-1; b>=0; b--) {
  	const bb = obj.popups[b]; push(); translate(obj.x + bb.x, obj.y + bb.y);
  	noStroke();
  	fill(red(bb.col), green(bb.col), blue(bb.col), bb.alpha * obj.fadeAlpha); textAlign(CENTER,CENTER); textSize(12); text(bb.text,0,0);
  	pop(); bb.y += bb.vy; bb.alpha -= 4;
  	if (bb.alpha <= 0) obj.popups.splice(b,1);
	}
  }
}

function createSparkle(x, y, col) {
  for(let i=0; i<6; i++) {
    sparkles.push({
      x: x, y: y,
      vx: random(-3, 3), vy: random(-3, 3),
      life: 255, c: col
    });
  }
}

function drawSparkles() {
  for(let i=sparkles.length-1; i>=0; i--) {
    let s = sparkles[i];
    noStroke(); fill(red(s.c), green(s.c), blue(s.c), s.life);
    ellipse(s.x, s.y, 4);
    s.x += s.vx; s.y += s.vy; s.life -= 15;
    if(s.life <= 0) sparkles.splice(i, 1);
  }
}

function drawLiveClockBadge(centerX, y) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2,'0'); const mm = String(now.getMonth()+1).padStart(2,'0'); const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2,'0'); const mi = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  const timeStr = `${dd}.${mm}.${yyyy} ${hh}:${mi}:${ss}`;
  const label = "LIVE";
  textAlign(LEFT, CENTER); textSize(11);
  const wLabel = textWidth(label), wTime = textWidth(timeStr), pad = 18, gap = 10;
  const totalW = wLabel + gap + wTime + pad*2; const rx = centerX - totalW/2;
  const ry = y - 12; const rh = 24;
  noStroke(); fill(5,5,20,220); rect(rx, ry, totalW, rh, 12);
  fill(255,60,60);
  circle(rx + pad - 6, y, 6);
  fill(255,60,60); text(label, rx + pad, y);
  fill(220);
  text(timeStr, rx + pad + wLabel + gap, y);
}

function drawUI() {
  push();
  fill(0, 0, 30, 255); noStroke();
  rect(0, 0, W, 85);
  stroke(0,255,255,100); strokeWeight(2); line(0,83, W,83);

  let logoX = 20, logoY = 40;
  textAlign(LEFT, CENTER); fill(0,255,255,20); textSize(64);
  text(GAME_TITLE, logoX+4, logoY+4);
  fill(255); textSize(64); text(GAME_TITLE, logoX, logoY);
  fill(0,255,255); textSize(10); text(`STABLE SINGULARITY SIMULATION ${VERSION_TAG}`, logoX+2, logoY+34);
  let dropZoneW = 400, dropZoneX = W/2 - (dropZoneW/2);
  let pulse = sin(frameCount*0.1)*3;
  fill(0,255,255,10 + pulse);
  rect(dropZoneX - 10, 6, dropZoneW + 20, 72, 15);
  fill(5,5,20,250); stroke(0,255,255, 120 + pulse*10); strokeWeight(2); rect(dropZoneX, 10, dropZoneW, 64, 12);
  noStroke(); textAlign(CENTER, CENTER); fill(255); textSize(16); text("SYSTEM STATUS: ONLINE", dropZoneX + dropZoneW/2, 32);
  fill(0,255,255); textSize(10);
  text("GEOMETRY: PROCEDURAL | DATA: SYNCED", dropZoneX + dropZoneW/2, 55);

  drawLiveClockBadge(W/2, 74);

  fill(0,255,255); textAlign(RIGHT); textSize(9); text(`${currentDestination}`, W - 25, 25);
  let gDisp = floor(map(currentGravity, 0.05, 1.95, 1, 99)); fill(200); textSize(8); text(`G-FORCE: ${gDisp} [R-${roundCount}]`, W - 25, 45);
  fill(255,150,0);
  text(`BOUNCE-X: ${currentBounce}`, W - 25, 60);
  pop();

  push(); translate(0, 100);
  fill(100,100,150,100); rect(10, 0, 250, 225);
  fill(0,0,20,245);
  rect(12, 2, 246, 221);
  fill(0,255,255); textAlign(CENTER); textSize(9); text("MISSION MILESTONES", 130, 20);
  textAlign(LEFT);
  allTimeRecords.forEach((rec, i) => {
	let tSize = (i===0)?12:(i===1)?10:9; textSize(tSize);
	fill(rec.color[0],rec.color[1],rec.color[2]); text(`${i+1}. ${rec.name}`, 22, 48 + i*22);
	textAlign(RIGHT); fill(255,180); text(rec.score, 248, 48 + i*22); textAlign(LEFT);
  });
  translate(0, 235);
  fill(100,100,150,100); rect(10, 0, 250, 60);
  fill(0,0,30,245); rect(12, 2, 246, 56);
  textSize(8);
  if (gameState === "PLAYING") { textAlign(LEFT, CENTER);
  fill(timer<10?color(255,0,0):color(0,255,255)); text("WARP-DRIVE: " + timer + "s", 22, 18); fill(0,255,0); text(`ACTIVE UNITS: ${totalBallsFired}`, 22, 42);
  }
  else if (gameState === "WAITING") { textAlign(LEFT, CENTER); fill(255,200,0); text("COOLING DOWN...", 22, 18); fill(0,255,0);
  text(`TOTAL UNITS: ${totalBallsFired}`, 22, 42); }
  pop();

  push(); translate(W - 260, 100);
  let sorted = Object.entries(leaderboard).sort((a,b)=>b[1].score - a[1].score).slice(0, 12);
  fill(100,100,150,100); rect(0, 0, 250, 285);
  fill(0,0,20,240); rect(2, 2, 246, 281);
  fill(0,255,255);
  textAlign(CENTER); textSize(10);
  text("TOP CONTRIBUTORS", 125, 20); 
  textAlign(LEFT); textSize(8);
  sorted.forEach((e, i) => {
	fill(e[1].color); text(`${nf(i+1, 2)}. ${e[0]}`, 15, 50 + i*19);
	textAlign(RIGHT); fill(255); text(e[1].score, 235, 50 + i*19);
	textAlign(LEFT);
  });
  pop();
}

function mouseClicked() {
  if (mouseX>10 && mouseX<260 && mouseY>100 && mouseY<130) {
	allTimeRecords = Array(8).fill({ name:"NONE", score:0, color:[100,100,100] });
	safeSet('galaxinko_records', allTimeRecords);
	shakeAmount = 5; return;
  }
  if (mouseY>0 && mouseY<85) { spawnBall(random(TEST_BOTS));
  shakeAmount = 2; }

  const tx = W - 260, ty = 100;
  const titleX1 = tx, titleX2 = tx + 250;
  const titleY1 = ty + 8, titleY2 = ty + 32;
  if (mouseX >= titleX1 && mouseX <= titleX2 && mouseY >= titleY1 && mouseY <= titleY2) {
	leaderboard = {};
	shakeAmount = 3;
	playCleanupSound();
	return;
  }

  if (isMouseOverTuneToggle()) { debugPanelVisible = !debugPanelVisible; return; }
}

function drawWalls() { stroke(100); strokeWeight(2); for (let w of walls) line(w.position.x, H - ZONE_H, w.position.x, H); }
function updateTravelSpeed() { currentTravelSpeed = lerp(currentTravelSpeed, (gameState==="PLAYING"?1.0:0.2), 0.01); }
function createExplosion(x,y){ for(let i=0;i<25;i++) explosions.push({x,y,vx:random(-5,5),vy:random(-5,5),life:255,col:color(255,random(100,255),0)}); }
function drawExplosions(){
  for(let i=explosions.length-1;i>=0;i--){
	let e = explosions[i]; fill(red(e.col),green(e.col),blue(e.col), e.life); rect(e.x,e.y,4,4);
	e.x+=e.vx; e.y+=e.vy; e.life-=5; if(e.life<=0) explosions.splice(i,1);
  }
}
function updateComet(){ if(currentComet===null && gameState==="PLAYING" && random()<0.003){ currentComet={x:random(W),y:-50,targetX:W+100,targetY:H+100,progress:0,speed:random(0.01,0.03),size:random(6,10),color:color(255,255,200,200)}; }
  if(currentComet){ currentComet.progress+=currentComet.speed; let curX=lerp(currentComet.x,currentComet.targetX,currentComet.progress); let curY=lerp(currentComet.y,currentComet.targetY,currentComet.progress);
	fill(currentComet.color); ellipse(curX,curY,currentComet.size); if(currentComet.progress>1.2) currentComet=null;
  } }

function checkAllTimeRecords(n,s,col){
  let idx = allTimeRecords.findIndex(r=>r.name===n);
  if(idx!==-1){ if(s>allTimeRecords[idx].score) allTimeRecords[idx].score = s; }
  else { allTimeRecords.push({ name:n, score:s, color:[red(col),green(col),blue(col)] }); }
  allTimeRecords.sort((a,b)=>b.score - a.score); allTimeRecords = allTimeRecords.slice(0,8); safeSet('galaxinko_records', allTimeRecords);
}

function updateWinnerColor() {
  let s = Object.entries(leaderboard).sort((a,b)=>b[1].score - a[1].score);
  winnerColor = s.length>0 ? lerpColor(winnerColor, s[0][1].color, 0.005) : color(0,0,128);
}
function updateScore(n,p,c){ if(!leaderboard[n]) leaderboard[n]={score:0,color:c}; leaderboard[n].score += p; addViewerScorePopup(n,p,c); }

function generateDeepSpaceElements(){
  massivePlanets = [];
  for(let i=0;i<3;i++) massivePlanets.push({ x:random(W), y:random(H), size:random(20, 50), color:color(random(30,80), 100), hasRing:random()<0.8, ringColor:color(random(80,150), 80), speed:random(0.005,0.015), rot:random(TWO_PI), rotSpeed:random(-0.01,0.01) });

  spaceDebris = [];
  const TYPES = ["UFO","SATELLITE","ASTEROID","ROCKET","SPACE_STATION","DRONE","PROBE"];
  const layers = [0.6, 0.85, 1.1, 1.3];
  const total = 28;
  for (let i=0;i<total;i++){
	const t = random(TYPES);
	const lay = random(layers);
	const colA = color(random(120,255), random(120,255), random(120,255), 200);
  	const colB = color(red(colA)*0.6, green(colA)*0.6, blue(colA)*0.9, 200);
	spaceDebris.push({
  	x: random(W), y: random(H),
  	type: t,
  	size: random(12, 28) * (0.7 + lay*0.3),
  	speed: random(0.25, 1.25) * lay,
  	wobble: random(0.01, 0.05),
  	rot: random(TWO_PI),
  	rotSpeed: random(-0.03, 0.03),
  	layer: lay,
  	colA, colB,
  	blink: random(TWO_PI)
	});
  }

  for (let n=0;n<3;n++){
	spaceDebris.push({
  	x: random(W), y: random(H),
  	type: "NEBULA",
  	size: random(120, 220),
  	speed: random(0.05, 0.12),
  	wobble: random(0.005, 0.012),
  	rot: 0, rotSpeed: 0,
  	layer: random([0.5,0.7]),
  	colA: color(random(50,120), random(20,80), random(120,220), 28 + random(14)),
  	colB: color(random(20,60), random(0,40), random(80,160), 20 + random(10)),
  	blink: 0
	});
  }
}
function generatePlanetName(){
  const names = ["XERON","KEPLER","ZENON","AETHER","NIBIRU","PANDORA","CYGNUS","TITAN","VULCAN","ARRAKIS","SOLARIS","ZION","EDEN"];
  const types = ["PRIME","STATION","SYSTEM","REACH","BETA","MAJOR","MINOR","VOID","CLUSTER","GATE"];
  return random(names)+" "+random(types);
}

function initGame() {
  if(!engine){ engine = Matter.Engine.create(); world = engine.world; }
  world.gravity.y = currentGravity;

  const patterns = ["SPIRAL","WAVES","HOURGLASS","CHAOS","FIELDS","GALAXY","DIAMOND","HYPERCUBE","DNA_HELIX","SATURN_RINGS","FRACTAL_TREE","HEXAGON_GRID",
	"SHAPE_HEART","SHAPE_APPLE","SHAPE_ALIEN","SHAPE_HOUSE","SHAPE_SWORD","SHAPE_MUSHROOM","SHAPE_SMILEY","SHAPE_STAR","SHAPE_CAT","SHAPE_DOG","SHAPE_MUSIC","SHAPE_GAMEPAD","SHAPE_COFFEE","SHAPE_GHOST","SHAPE_BIRD","SHAPE_FISH","SHAPE_CAMERA",
	"WORD"];
  const mode = random(patterns);

  let numPegs = floor(random(300, 500));
  let pegRestitution = map(currentBounce, 1, 99, 0.1, 1.8);
  let blocker = Matter.Bodies.circle(W/2, 130, 4, { isStatic: true, restitution: pegRestitution });
  pegs.push(blocker); Matter.World.add(world, blocker);
  if (mode.startsWith("SHAPE_") || mode === "WORD") {
	let shape = null, spacing = 26;
  	if (mode === "WORD") { const words = ["LIKE","TAP","HELLO","WOW","GG","SENCO","GALAXY","STAR","LETSGO"]; shape = buildWordShape(words[floor(random(words.length))]); spacing = 22; }
	else { const shapeName = mode.split("_")[1]; shape = SHAPES[shapeName] || SHAPES["HEART"]; }
	let rows = shape.length, cols = shape[0].length;
  	let startX = (W - (cols * spacing)) / 2, startY = 220;
  	for(let i=0;i<15;i++){
  	let pxL = map(i,0,14,50, startX-30), pyL = map(i,0,14,150, startY+50);
  	let pL = Matter.Bodies.circle(pxL, pyL, 2.5, { isStatic:true, restitution:pegRestitution, collisionFilter:{category:2} });
  	pegs.push(pL); Matter.World.add(world, pL);
  	let pxR = map(i,0,14, W-50, startX+(cols*spacing)+30);
  	let pR = Matter.Bodies.circle(pxR, pyL, 2.5, { isStatic:true, restitution:pegRestitution, collisionFilter:{category:2} });
  	pegs.push(pR); Matter.World.add(world, pR);
  	}
	for (let r=0;r<rows;r++){
  	for (let c=0;c<cols;c++){
    	if (shape[r][c] === '*') {
      	let px = startX + c*spacing + random(-1,1), py = startY + r*spacing + random(-1,1);
      	let peg = Matter.Bodies.circle(px, py, 2.5, { isStatic:true, restitution:pegRestitution, collisionFilter:{category:2} });
      	pegs.push(peg); Matter.World.add(world, peg);
  		}
  	}
	}
  } else {
	for (let i=0;i<numPegs;i++){
  	let px, py, valid=false, attempts=0;
  	while(!valid && attempts<50){
    	attempts++;
    	switch(mode){
      	case "SPIRAL": { let angle=i*0.15, r=15+i*1.5; px=W/2+cos(angle)*r; py=180+i*1.8; break; }
      	case "WAVES": { px=map(i%20,0,20,50,W-50); py=160+floor(i/20)*40+sin(i*0.5)*30; break; }
      	case "HOURGLASS": { let rowH=floor(i/15), colH=i%15, shrink=abs(rowH-15)*12; px=map(colH,0,15,100+shrink, W-100-shrink); py=160+rowH*25; break; }
      	case "GALAXY": { let aG=random(TWO_PI), radG=pow(random(),0.5)*350; px=W/2+cos(aG)*radG; py=450+sin(aG)*radG*0.8; break; }
      	case "HYPERCUBE": { let side=300, ix=i%10, iy=floor(i/10)%10, iz=floor(i/100); px=W/2-side/2+ix*30+iz*15; py=200+iy*30+iz*15; break; }
      	case "DNA_HELIX": { let t=i*0.1, sideDNA=(i%2===0)?1:-1; px=W/2+sideDNA*cos(t)*100; py=160+i*4; break; }
      	case "SATURN_RINGS": { let angleS=random(TWO_PI), distS=(i<numPegs/2)?random(80,120):random(200,250); px=W/2+cos(angleS)*distS; py=400+sin(angleS)*distS*0.4; break; }
      	case "FRACTAL_TREE": { let level=floor(log(i+1)/log(2)); px=W/2+(i%pow(2,level)-pow(2,level)/2)*(W/pow(2,level)); py=160+level*60; break; }
      	case "HEXAGON_GRID": { let hRow=floor(i/12), hCol=i%12; px=100+hCol*60+(hRow%2)*30; py=180+hRow*50; break; }
      	default: { px=random(60, W-60); py=random(140, H-300); }
    	}
    	if (py>115 && py<H-280 && px>40 && px<W-40) {
      	let tooClose=false;
  		for(let other of pegs){ if(dist(px,py,other.position.x,other.position.y)<22){ tooClose=true; break; } }
      	if(!tooClose) valid=true;
  		} else if (attempts>45) break;
  	}
  	if(valid){ let peg=Matter.Bodies.circle(px,py,2.5,{isStatic:true,restitution:pegRestitution,collisionFilter:{category:2}});
    	pegs.push(peg); Matter.World.add(world, peg);
  		}
	}
  }

  let sV = [5000,1000,500,200,100,50,20,10,5,2,1,2,5,10,20,50,100,200,500,1000,5000];
  let curX = 0; zones = [];
  for (let i=0;i<21;i++){
	let zw = (map(abs(i-10),0,10,2.5,1.0)/36.1)*W;
	zones.push({ x:curX, w:zw, score:sV[i], flash:0, flashColor:color(255) });
  	if (i>0){ let wall=Matter.Bodies.rectangle(curX, H-(ZONE_H/2), 6, ZONE_H, { isStatic:true, friction:0.5 }); walls.push(wall); Matter.World.add(world, wall); }
	curX += zw;
  }
  Matter.World.add(world, [Matter.Bodies.rectangle(W/2, H+48, W, 100, {isStatic:true, friction:1})]);
}

function drawPegs() {
  noStroke();
  let pegR = map(currentGravity, 0.05, 1.95, 0, 255);
  let pegG = map(currentGravity, 0.05, 1.95, 255, 100);
  let pegB = map(currentGravity, 0.05, 1.95, 255, 0);
  let pegBaseCol = color(pegR, pegG, pegB);
  for (let p of pegs) {
	p.glow = p.glow || 0;
  	if (p.glow > 0) { fill(pegR, pegG + 50, pegB + 50, p.glow);
  	rect(p.position.x - 4, p.position.y - 4, 8, 8); p.glow -= 20; }
	fill(pegBaseCol); rect(p.position.x - 2, p.position.y - 2, 4, 4);
  }
}
function drawZones(){
  for (let z of zones) {
	let isJackpot = (z.score >= 5000);
	let baseCol = isJackpot ? color(50,45,15,180) : color(10,10,40,180);
	if (z.flash > 0) { fill(z.flashColor); z.flash -= 10; } else fill(baseCol);
	noStroke();
  	rect(z.x, H - ZONE_H, z.w, ZONE_H);
	push(); translate(z.x + z.w/2, H - 15); rotate(-HALF_PI); textAlign(LEFT, CENTER);
	if (isJackpot) { fill(255,230,100); textSize(12); text(z.score, 0, 0); }
	else { fill(255); textSize(z.w<30?7:10); text(z.score, 0, 0); }
	pop();
  }
}
function drawWaitingMessage(){
  let alpha = map(sin(frameCount*0.15), -1, 1, 100, 255);
  push(); fill(255,50,50,alpha); textAlign(CENTER,CENTER); textSize(30); stroke(0); strokeWeight(4);
  text("WARNING: CLEANUP", W/2, H/2 - 50);
  textSize(14); noStroke(); fill(255,200,0,alpha); text("REMAINING UNITS RETURNING TO BASE...", W/2, H/2); pop();
}

function drawResultsOverlay() {
  fill(0, 0, 20, 235);
  rect(20, 50, W - 40, H - 100, 20);
  noFill(); stroke(0, 255, 255, 160); strokeWeight(3);
  rect(30, 60, W - 60, H - 120, 16);

  noStroke(); textAlign(CENTER);
  fill(0,255,255); textSize(44); text("ROUND COMPLETE", W/2, 135);
  fill(255, 215, 0);
  textSize(22); text(`SECTOR: ${currentDestination}`, W/2, 175);

  let sorted = Object.entries(leaderboard).sort((a,b)=>b[1].score - a[1].score).slice(0, 5);
  if (sorted.length > 0) {
	const maxScore = sorted[0][1].score || 1;
	const startY = 230;
	const rowH = 90;
  	for (let i=0;i<sorted.length;i++){
  	let entry = sorted[i];
  	let y = startY + i*rowH;

  	fill(255,255,255,18); noStroke();
  	rect(60, y-40, W-120, 76, 10);

  	let medalCol = i===0? color(255,215,0): i===1? color(192,192,192): i===2? color(205,127,50): color(0,200,255);
  	fill(medalCol); noStroke();
  	ellipse(95, y-2, 26, 26);
  	fill(0,30,50,180); ellipse(95, y-2, 20, 20);
  	fill(255); textSize(12); textAlign(CENTER,CENTER); text(i+1, 95, y-2);

  	textAlign(LEFT, CENTER); textSize(28); fill(entry[1].color);
  	text(`${entry[0]}`, 130, y-10);
  	textAlign(RIGHT, CENTER); fill(255); textSize(30); text(entry[1].score.toLocaleString(), W - 90, y-10);
  	let barMax = (W - 240), barW = map(entry[1].score, 0, maxScore, 0, barMax);
  	let bx = 130, by = y + 18, bh = 10;
  	noStroke(); fill(0,60,90,120); rect(bx, by, barMax, bh, 6);
  	fill(0,255,255,180);
  	rect(bx, by, barW, bh, 6);
  	fill(255,255,255,60); rect(bx, by, barW, 3, 6);
	}
  }

  textAlign(CENTER); fill(255, 80, 80); textSize(20);
  text(`NEXT ROUND IN: ${resultsTimer}s`, W/2, H - 60);
}

function spawnRareLegend() {
  let legend = random(RARE_POOL);
  spaceDebris.push({
	x:random(50,W-50), y:-100, type:"LEGEND", legendId:legend.id, size:legend.size,
	color:color(legend.col[0], legend.col[1], legend.col[2]),
	speed:random(0.8,1.8), rot:random(TWO_PI), rotSpeed:random(-0.06,0.06),
	wobble:random(0.02,0.08), isRare:true, layer:1.0, colA:null, colB:null, blink:0
  });
}

function drawGalacticBackground() {
  fill(255,120); noStroke();
  for(let s of stars){ ellipse(s.x,s.y,s.s); s.y += s.speed * currentTravelSpeed * 5;
  	if (s.y>H){ s.y=0; s.x=random(W);} }

  for(let p of massivePlanets){
	push(); translate(p.x,p.y);
	p.y += p.speed * currentTravelSpeed * 5;
  	p.rot += p.rotSpeed * currentTravelSpeed;
	rotate(p.rot);
	if (p.hasRing){ noFill(); stroke(p.ringColor); strokeWeight(p.size*0.1); ellipse(0,0, p.size*2.2, p.size*0.6); }
	noStroke(); fill(p.color); ellipse(0,0, p.size);
	pop();
  	if (p.y>H+p.size*2){ p.y=-p.size*2; p.x=random(W); }
  }

  updateComet();

  for(let i=spaceDebris.length-1;i>=0;i--){
	let d = spaceDebris[i];
  	d.y += d.speed * currentTravelSpeed * (0.9 + d.layer*0.4);
	let drift = sin(frameCount * d.wobble + i)* (0.6 + d.layer*0.2);
  	d.x += drift * 0.2;
	d.rot += d.rotSpeed * currentTravelSpeed;

	push(); translate(d.x, d.y); rotate(d.rot);
	switch(d.type){
  	case "LEGEND": drawLegendShape(d); break;
  	case "UFO": drawDebrisUFO(d); break;
  	case "SATELLITE": drawDebrisSatellite(d); break;
  	case "ASTEROID": drawDebrisAsteroid(d); break;
  	case "ROCKET": drawDebrisRocket(d); break;
  	case "SPACE_STATION": drawDebrisStation(d); break;
  	case "DRONE": drawDebrisDrone(d); break;
  	case "PROBE": drawDebrisProbe(d); break;
  	case "NEBULA": drawDebrisNebula(d); break;
  	default: drawDebrisAsteroid(d);
	}
	pop();
  	if (d.y > H + 160) {
  	if (d.isRare) spaceDebris.splice(i,1);
  	else { d.y = -random(40, 200); d.x = random(W); d.rotSpeed = random(-0.03, 0.03); }
	}
  }

  if (gameState==="PLAYING") planetSize = lerp(planetSize, 120 + map(timer, 40, 0, 0, 1)*350, 0.05);
  else if (gameState==="WAITING") planetSize = lerp(planetSize, 450, 0.01);
  if (planetSize>10) for(let r=4;r>0;r--){ fill(red(winnerColor),green(winnerColor),blue(winnerColor),4); ellipse(W/2, H+60, planetSize*(r*0.6), planetSize*0.4); }
}

function drawDebrisUFO(d){
  let s = d.size; noStroke();
  fill(0, 255, 120, 160); rect(-s/2, -s/6, s, s/3, 2); fill(180, 220); ellipse(0, -s/6, s*0.55, s*0.55);
  fill(255, 220); for (let k=-2;k<=2;k++) circle(k*(s*0.18), s*0.02, 3);
}
function drawDebrisSatellite(d){
  let s = d.size; stroke(200, 200, 255, 150); strokeWeight(1); noFill();
  rect(-s/4, -s/4, s/2, s/2); line(-s, 0, s, 0); rect(-s, -s/6, s/2, s/3); rect(s/2, -s/6, s/2, s/3);
}
function drawDebrisAsteroid(d){
  let s = d.size; noStroke(); fill(120, 120, 140, 180);
  rect(-s/2, -s/2, s*0.6, s*0.6, 2); rect(-s*0.1, -s*0.3, s*0.4, s*0.4, 2);
  fill(160, 160, 180, 120); rect(0, 0, s*0.3, s*0.3, 2);
}
function drawDebrisRocket(d){
  let s = d.size; noStroke();
  fill(d.colA); rect(-s*0.25, -s*0.5, s*0.5, s, 3); fill(255, 255, 255, 200); triangle(0, -s*0.65, -s*0.18, -s*0.45, s*0.18, -s*0.45);
  fill(d.colB); rect(-s*0.4, s*0.1, s*0.25, s*0.18); rect(s*0.15, s*0.1, s*0.25, s*0.18);
  let fl = 4 + sin(frameCount*0.4)*2; fill(255,160,0, 220); rect(-s*0.12, s*0.5, s*0.24, fl, 2);
  fill(255,220,0, 180); rect(-s*0.08, s*0.5, s*0.16, fl*0.8, 2);
}
function drawDebrisStation(d){
  let s = d.size; noFill(); stroke(d.colA); strokeWeight(2);
  ellipse(0, 0, s*1.6, s*0.7); ellipse(0, 0, s*0.9, s*0.4);
  noStroke(); fill(d.colB); rect(-s*0.25, -s*0.15, s*0.5, s*0.3, 3);
  fill(200, 220); rect(-s*0.6, -s*0.08, s*0.2, s*0.16); rect(s*0.4, -s*0.08, s*0.2, s*0.16);
}
function drawDebrisDrone(d){
  let s = d.size; let blink = (sin(frameCount*0.2 + d.blink) * 0.5 + 0.5); noStroke();
  fill(180, 200); rect(-s*0.25, -s*0.12, s*0.5, s*0.24, 2);
  fill(0, 255, 180, 120 + blink*80); circle(-s*0.15, 0, 4); circle(0, 0, 4); circle(s*0.15, 0, 4);
}
function drawDebrisProbe(d){
  let s = d.size; noStroke(); fill(200, 220); rect(-s*0.2, -s*0.2, s*0.4, s*0.4, 2);
  fill(150, 200); triangle(-s*0.25, -s*0.3, s*0.25, -s*0.3, 0, -s*0.6); fill(0, 255, 255, 160); circle(0, -s*0.38, 4);
}
function drawDebrisNebula(d){
  noStroke(); let s = d.size; fill(red(d.colA), green(d.colA), blue(d.colA), alpha(d.colA)); ellipse(0, 0, s*1.1, s*0.6);
  fill(red(d.colB), green(d.colB), blue(d.colB), alpha(d.colB)); ellipse(-s*0.2, -s*0.1, s*0.7, s*0.4); ellipse(s*0.25,  s*0.05, s*0.6, s*0.35);
}
function drawLegendShape(d){
  noStroke(); fill(d.color); let s=d.size;
  switch(d.legendId){
	case "STARMAN": rect(-s/2,-s/4,s,s/2,5); fill(255); ellipse(-s/4,-s/4,s/5); break;
  	case "HAWKING": fill(100); rect(-s/2,0,s,s/4); fill(d.color); rect(-s/4,-s/2,s/2,s/2); break;
	case "LAIKA": fill(150,100); ellipse(0,0,s,s); fill(d.color); ellipse(0,-s/6,s/2); break;
	case "ET": fill(100,50,0); rect(-s/2,0,s,s/2); fill(255); ellipse(0,-s/4,s/2); break;
	case "NYAN": fill(255,200,150); rect(-s/2,-s/3,s,s/1.5,3); break;
	case "VOYAGER": fill(180); ellipse(0,0,s/2); fill(212,175,55); ellipse(0,0,s/3); break;
	case "OUMUAMUA": fill(60,40,30); ellipse(0,0,s,s/4); break;
  	case "SHUTTLE": fill(255); triangle(-s/2,s/2, s/2,s/2, 0,-s/2); break;
  }
}
function drawGravityDust(){
  let r=map(currentGravity,0.05,1.95,100,255), g=map(currentGravity,0.05,1.95,200,100), b=map(currentGravity,0.05,1.95,255,50);
  fill(r,g,b,150); noStroke(); let dustSpeed=currentGravity*3*currentTravelSpeed;
  for(let d of dust){ d.y+=dustSpeed; if(d.y>H){ d.y=0; d.x=random(W);} rect(d.x,d.y,d.s,d.s); }
}

function prepareSingularityEvents(){ bhSpawnTimes=[]; if(random()<0.4) bhSpawnTimes.push(floor(random(5, timer*0.8))); }
function checkSingularitySpawn(){
  if (bhSpawnTimes.includes(timer) && !blackHole) {
	let fromLeft = random()<0.5;
  	blackHole = { x:fromLeft?-150:W+150, y:random(200, H-450), startY:0, targetX:fromLeft?W+250:-250, speed:random(0.8,1.5), size:random(12,18), noiseOffset:random(1000), noiseSpeed:random(0.01,0.02), wobbleAmp:random(40,90) };
	blackHole.startY = blackHole.y; bhSpawnTimes = bhSpawnTimes.filter(t=>t!==timer);
  }
}
function handleBlackHole(){
  if (!blackHole) return;
  let dir = blackHole.targetX>blackHole.x?1:-1; blackHole.x += blackHole.speed*dir;
  let n=noise(frameCount*blackHole.noiseSpeed+blackHole.noiseOffset); blackHole.y = blackHole.startY + (n-0.5)*blackHole.wobbleAmp*2;
  let jitterSize = blackHole.size*(1+(n-0.5)*0.15);
  if (audioStarted){ let centerDist=abs(W/2 - blackHole.x); let tremolo=map(sin(frameCount*0.2),-1,1,0.8,1.0); let vol=map(centerDist,W,0,0,0.08)*tremolo; bhOsc.amp(vol,0.1); bhOsc.freq(32+n*12); }
  push(); translate(blackHole.x,blackHole.y); noStroke();
  for(let i=5;i>0;i--){ fill(10+i*10,0,40+i*20,25); let s=jitterSize+i*(blackHole.size*0.15)+(n*10); ellipse(0,0,s); }
  fill(0); ellipse(0,0,jitterSize); pop();

  for(let i=pegs.length-1;i>=0;i--){
	let p=pegs[i]; let d=dist(blackHole.x,blackHole.y,p.position.x,p.position.y);
  	if (d<jitterSize*0.55 && random()<0.23){ Matter.Composite.remove(world,p); createExplosion(p.position.x,p.position.y); playExplosionSound(); pegs.splice(i,1); }
  }
  for(let i=balls.length-1;i>=0;i--){
	let b=balls[i]; if(!b.body) continue; let d=dist(blackHole.x,blackHole.y,b.body.position.x,b.body.position.y);
  	if (d<jitterSize*0.5){ removeBall(b); continue; }
	if (d<blackHole.size*1.87){ let safeDist=Math.max(d,30); let forceDir=Matter.Vector.sub({x:blackHole.x,y:blackHole.y}, b.body.position);
  	let strength=(blackHole.size*0.00018)/(safeDist/80); let force=Matter.Vector.mult(Matter.Vector.normalise(forceDir), strength); Matter.Body.applyForce(b.body,b.body.position, force);
  	}
  }
  if ((dir===1 && blackHole.x>blackHole.targetX) || (dir===-1 && blackHole.x<blackHole.targetX)) { blackHole=null; if(audioStarted) bhOsc.amp(0,0.5); }
}

let spaceship = null, shipPlanned = false, shipSpawnAt = -1;
function planSpaceshipForRound() {
  shipPlanned = (random() < 0.09);
  shipSpawnAt = shipPlanned ? floor(random(max(3, floor(roundInitialTime*0.3)), max(5, floor(roundInitialTime*0.8)))) : -1;
}
function spawnSpaceship() {
  const leftToRight = random() < 0.5; const y = random(H - ZONE_H - 220, H - ZONE_H - 110);
  const startX = leftToRight ? -120 : W + 120;
  const shipW = 82, shipH = 26;
  const body = Matter.Bodies.rectangle(startX, y, shipW, shipH, { isStatic: true, restitution: 0.9, friction: 0.2, frictionAir: 0, collisionFilter: { category: 4, mask: 1 } });
  Matter.World.add(world, body);
  const base = color(random(80,200), random(80,200), random(200,255));
  const accent = color(red(base)*0.6, green(base)*0.6, blue(base)*0.9);
  spaceship = { body, dir: leftToRight ? 1 : -1, speed: random(1.0, 2.2), w: shipW, h: shipH, colA: base, colB: accent, y };
}
function handleSpaceship() {
  if (!spaceship) return;
  const pos = spaceship.body.position; const nx = pos.x + spaceship.speed * spaceship.dir;
  Matter.Body.setPosition(spaceship.body, { x: nx, y: spaceship.y });
  push(); translate(nx, spaceship.y); noStroke(); fill(spaceship.colA); rect(-34, -8, 68, 16, 2);
  fill(spaceship.colB); rect(-6, -10, 20, 10, 2); fill(255, 255, 255, 160); rect(-42, -4, 10, 8); rect(32, -4, 10, 8);
  fill(255,140,0, 200); rect(-32, 6, 8, 4); rect(24, 6, 8, 4);
  const flame = 3 + sin(frameCount*0.3)*2; fill(255,200,0, 180); rect(-32, 10, 8, flame); rect(24, 10, 8, flame); pop();
  if (nx < -150 || nx > W + 150) { Matter.World.remove(world, spaceship.body); spaceship = null; }
}

function resetGame() {
  timer = floor(random(40, 181));
  roundInitialTime = timer;
  leaderboard = {}; totalBallsFired = 0; roundCount++;
  gameState = "PLAYING"; resultsTimer = 10;
  eventOccurredThisRound = false;
  currentDestination = generatePlanetName();
  if (world) Matter.World.clear(world, false);
  pegs=[]; walls=[]; balls=[]; blackHole=null; cosmicEvent=null;
  spaceship = null; shipPlanned = false; shipSpawnAt = -1;

  if (isAutoMode) {
      currentGravity = random(0.05, 1.95);
      currentBounce = floor(random(1, 100));
  }

  initGame(); generateDeepSpaceElements(); prepareSingularityEvents(); planSpaceshipForRound();
}

function drawProceduralHUD(){
  push(); stroke(255,10); strokeWeight(1);
  for(let i=0;i<H;i+=4) line(0, i+(frameCount%4), W, i+(frameCount%4));
  fill(0,255,0,150); textSize(8); textAlign(LEFT);
  text(`POS_X: ${camOffset.x.toFixed(4)}`, 20, H-40); text(`POS_Y: ${camOffset.y.toFixed(4)}`, 20, H-30); text(`ZOOM: ${camOffset.z.toFixed(4)}`, 20, H-20);
  textAlign(RIGHT); text(`SENS_TEMP: ${(24 + noise(frameCount*0.01)*5).toFixed(1)}°C`, W-20, H-30); text(`BUFFER_LOAD: ${balls.length * 2}%`, W-20, H-20);
  pop();
}
function drawAntiBotOverlay(){
  push();
  if (random()<0.1){ fill(255,150); noStroke(); circle(random(W),random(H),random(1,3)); }
  if (random()<0.02){ fill(0,255,255,100); rect(0, random(H), W, random(1,10)); }
  if (random()<0.05){ fill(255,0,0,50); rect(random(W),random(H),20,20); }
  pop();
}

function triggerCosmicEvent(){
  if (cosmicEvent) return; eventOccurredThisRound = true;
  let fromLeft = random()<0.5; let size=random(25,45); let startX = fromLeft? -100 : W+100;
  let targetY = H - ZONE_H - random(20,120);
  let body = Matter.Bodies.circle(startX, targetY, size/2, { isStatic:false, isSensor:false, density:0.1, frictionAir:0, collisionFilter:{mask:1} });
  let isComet = random()<0.5;
  cosmicEvent = { body, type:isComet?"COMET":"METEOR", size, color:isComet?color(150,200,255):color(255,100,50), trail:[] };
  Matter.World.add(world, body); Matter.Body.setVelocity(body, { x: fromLeft? random(12,18):random(-18,-12), y: random(-1,1) });
  if (audioStarted){ let osc=new p5.Oscillator('sine'); osc.start(); osc.freq(random(100,400)); osc.freq(random(800,1200),1.5); osc.amp(0.1); osc.amp(0,1.5); setTimeout(()=>osc.stop(),1600); }
}
function handleCosmicEvent(){
  if (!cosmicEvent) return; let pos = cosmicEvent.body.position;
  cosmicEvent.trail.push({x:pos.x,y:pos.y,life:255}); if (cosmicEvent.trail.length>20) cosmicEvent.trail.shift();
  push(); noStroke();
  for(let i=0;i<cosmicEvent.trail.length;i++){
	let a = map(i, 0, cosmicEvent.trail.length, 0, 150); fill(red(cosmicEvent.color),green(cosmicEvent.color),blue(cosmicEvent.color),a);
	ellipse(cosmicEvent.trail[i].x, cosmicEvent.trail[i].y, cosmicEvent.size * (i/cosmicEvent.trail.length));
  }
  fill(255); ellipse(pos.x,pos.y,cosmicEvent.size); fill(cosmicEvent.color); ellipse(pos.x,pos.y,cosmicEvent.size*0.8); pop();
  if (pos.x<-300 || pos.x>W+300) { Matter.World.remove(world, cosmicEvent.body); cosmicEvent = null; }
}

let debugPanelVisible = false;
let draggingSlider = null;

function keyPressed() { if (key === 't' || key === 'T') debugPanelVisible = !debugPanelVisible; }

function isMouseOverTuneToggle() {
  const w = 40, h = 40;
  const x = W - w - 10, y = 10;
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}
function drawTuneToggleButton() {
  const w = 40, h = 40;
  const x = W - w - 10, y = 10;
  const hov = isMouseOverTuneToggle();
  noStroke();
  fill(5, 30, 40, hov ? 220 : 180);
  rect(x, y, w, h, 8);
  stroke(0, 255, 255, hov ? 255 : 100);
  strokeWeight(2);
  noFill();
  rect(x, y, w, h, 8);
  noStroke();
  fill(debugPanelVisible ? color(0,255,200) : color(255));
  textAlign(CENTER, CENTER);
  textSize(24);
  text("⚙", x + w / 2, y + h / 2);
}

function drawTunePanel() {
  const x = W - 260, y = 60, w = 250, h = 140;
  noStroke();
  fill(0, 20, 30, 240);
  rect(x, y, w, h, 12);
  stroke(0, 255, 255, 120); strokeWeight(2);
  noFill();
  rect(x+1, y+1, w-2, h-2, 12);

  noStroke();
  fill(0, 255, 255);
  textAlign(LEFT, CENTER);
  textSize(12);
  text("TUNE PANEL", x + 12, y + 18);
  textSize(9);
  fill(180);
  text("T - toggle", x + w - 70, y + 18);

  const trackX = x + 16;
  let lineY = y + 44;

  drawSlider("Gravity", trackX, lineY, 210, currentGravity, 0.05, 1.95, (val)=>{
	currentGravity = val;
	if (world) world.gravity.y = currentGravity;
    isAutoMode = false;
  });
  lineY += 40;

  drawSlider("Peg Bounce", trackX, lineY, 210, currentBounce, 1, 99, (val)=>{
	currentBounce = Math.round(val);
	const pegRest = map(currentBounce, 1, 99, 0.1, 1.8);
	for (let p of pegs) p.restitution = pegRest;
	const ballRest = map(currentBounce, 1, 99, 0.4, 0.9);
	for (let b of balls) if (b?.body) b.body.restitution = ballRest;
    isAutoMode = false;
  });

  let btnX = x + 25, btnY = y + h - 35, btnW = 200, btnH = 25;
  fill(isAutoMode ? color(0, 150, 0) : color(150, 0, 0));
  rect(btnX, btnY, btnW, btnH, 5);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(10);
  text(isAutoMode ? "MODE: AUTO" : "MODE: MANUAL", btnX + btnW/2, btnY + btnH/2);
}

function drawSlider(label, sx, sy, w, value, minV, maxV, onChange) {
  noStroke(); fill(200); textAlign(LEFT, CENTER); textSize(10); text(label, sx, sy - 10);
  textAlign(RIGHT, CENTER); text(nf(value, 1, 2), sx + w, sy - 10);
  stroke(0, 255, 255, 140); strokeWeight(3); line(sx, sy, sx + w, sy);
  const t = map(value, minV, maxV, 0, 1, true); const kx = sx + t * w;
  noStroke(); fill(0, 255, 255, 220); circle(kx, sy, 10);

  if (draggingSlider && draggingSlider.name === label) {
	const nt = constrain((mouseX - sx) / w, 0, 1);
  	const newVal = minV + nt * (maxV - minV);
	draggingSlider.val = newVal;
	onChange(newVal);
  }
}

function handleTuneMousePressed() {
  if (!debugPanelVisible) return;

  const px = W - 260, py = 60, pw = 250, ph = 140;
  if (mouseX < px || mouseX > px+pw || mouseY < py || mouseY > py+ph) { draggingSlider = null; return; }

  let btnX = px + 25, btnY = py + ph - 35, btnW = 200, btnH = 25;
  if (mouseX >= btnX && mouseX <= btnX+btnW && mouseY >= btnY && mouseY <= btnY+btnH) {
      isAutoMode = !isAutoMode;
      return;
  }

  const sx = px + 16, w = 210;
  const gravY = py + 44;
  const bounceY = py + 84;
  const rad = 8;
  
  let tG = map(currentGravity, 0.05, 1.95, 0, 1, true); let kG = sx + tG * w;
  if (dist(mouseX, mouseY, kG, gravY) <= rad + 6) { draggingSlider = { name: "Gravity", val: currentGravity }; return; }

  let tB = map(currentBounce, 1, 99, 0, 1, true); let kB = sx + tB * w;
  if (dist(mouseX, mouseY, kB, bounceY) <= rad + 6) { draggingSlider = { name: "Peg Bounce", val: currentBounce }; return; }
  draggingSlider = null;
}

function mouseDragged() { }
function mouseReleased() { draggingSlider = null; }

