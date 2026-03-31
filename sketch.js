const GAME_TITLE = "GALAXINKO";
const GAME_VERSION = "v14.6.0";

let currentLang = "CZ";

const T = {
  EN: {
    GRAV: "Gravity:", BOUNCE: "Bounce:", SPAWN: "Spawn Limit:", CHANCE: "Boss/Ship%:",
    SFX: "SFX Vol:", TTS_VOL: "Voice Vol:", RATE: "Mothership/s:", LIVE: "🔴 LIVE ",
    SYS_ON: "SYSTEM: ONLINE", SYNC: "GEOMETRY: PROCEDURAL | DATA: SYNCED",
    GFORCE: "G-FORCE:", BOUNCEX: "BOUNCE-X:", REC: "ALL TIME RECORDS",
    WARP_CORE: "WARP CORE:", ACT_UNITS: "DROPPED UNITS:", TOT_UNITS: "TOTAL UNITS:",
    COOL: "COOLING DOWN...", TOP: "TOP CONTRIBUTORS", WARN: "WARNING: CLEANUP",
    RET: "REMAINING UNITS RETURNING TO BASE...", COMPL: "ROUND COMPLETE",
    SECTOR: "SECTOR:", NEXT: "NEXT ROUND IN:", LEVI: "VOID LEVIATHAN HP",
    SLAY: " BOSS SLAYER", NEW_C: "🔥 NEW COMMANDER! 🔥", L_PL: "LIVE_PLAYER",
    MARQ: "🚀 LIVE SECTOR: {0} --- ACTIVE UNITS: {1} --- SEND LIKES TO POWER UP Shields! --- ",
    TTS_INC: "Incoming vessel from ", TTS_POW: "Power up from ", TTS_MET: "Warning! Incoming meteor shower!",
    TTS_BH: "Warning! Black hole singularity forming!", TTS_COS: "Warning! Cosmic anomaly detected.",
    TTS_B_ENT: "VOID LEVIATHAN DETECTED. ENCOUNTER COMMENCING.", TTS_B_DEF: "Leviathan destroyed! Massive bonus awarded!",
    TTS_DEF: "Defense unit deployed.", TTS_10S: "10 seconds remaining.",
    TTS_SEC_C: "Sector operations complete.", TTS_SEC_W: "Welcome to sector ",
    TTS_R_O: "Round over! The ultimate commander is ", TTS_WELC: "Welcome commander ",
    TTS_RIMMER_ON: "Warning! Rimmer Mode Activated!", TTS_RIMMER_OFF: "Rimmer Mode Deactivated.", RIM_MODE: "RIMMER MODE",
    ANOMALY: "TEMPORAL ANOMALY", PHYS_ALT: "Physics altered!",
    TTS_DEV_ENT: "WARNING! TIME DEVOURER DETECTED!", TTS_DEV_DEF: "DEVOURER DESTROYED! TIME SAVED!",
    TTS_DEV_FAIL: "TIME CONSUMED! ROUND SHORTENED!", DEVOURER: "TIME DEVOURER",
    TTS_STARBUG_ENT: "Starbug inbound to repair obstacles!"
  },
  CZ: {
    GRAV: "Gravitace:", BOUNCE: "Odraz:", SPAWN: "Limit spawnu:", CHANCE: "Šance Boss/Loď%:",
    SFX: "Hlasitost SFX:", TTS_VOL: "Hlasitost robota:", RATE: "Mothership/s:", LIVE: "🔴 ŽIVĚ ",
    SYS_ON: "SYSTÉM: ONLINE", SYNC: "GEOMETRIE: PROCEDURÁLNÍ | DATA: SYNCHRO",
    GFORCE: "G-SÍLA:", BOUNCEX: "ODRAZ-X:", REC: "ALL TIME REKORDY",
    WARP_CORE: "WARP JÁDRO:", ACT_UNITS: "SPADLÉ KULIČKY:", TOT_UNITS: "CELKEM KULIČEK:",
    COOL: "CHLAZENÍ...", TOP: "NEJLEPŠÍ HRÁČI", WARN: "VAROVÁNÍ: ÚKLID",
    RET: "ZBYLÉ JEDNOTKY SE VRACÍ NA ZÁKLADNU...", COMPL: "KOLO DOKONČENO",
    SECTOR: "SEKTOR:", NEXT: "DALŠÍ KOLO ZA:", LEVI: "ZDRAVÍ LEVIATHANA",
    SLAY: " ZABIJÁK BOSSE", NEW_C: "🔥 NOVÝ VELITEL! 🔥", L_PL: "ŽIVÝ_HRÁČ",
    MARQ: "🚀 ŽIVÝ SEKTOR: {0} --- AKTIVNÍ JEDNOTKY: {1} --- POŠLI LIKY PRO POSÍLENÍ ŠTÍTŮ! --- ",
    TTS_INC: "Přilétá loď od ", TTS_POW: "Vylepšení od ", TTS_MET: "Varování! Blíží se meteorický roj!",
    TTS_BH: "Varování! Formuje se singularita černé díry!", TTS_COS: "Varování! Detekována vesmírná anomálie.",
    TTS_B_ENT: "VOID LEVIATHAN DETEKOVÁN. ZAHÁJENÍ STŘETU.", TTS_B_DEF: "Leviathan zničen! Udělen obrovský bonus!",
    TTS_DEF: "Obranná jednotka nasazena.", TTS_10S: "Zbývá 10 sekund.",
    TTS_SEC_C: "Operace v sektoru dokončeny.", TTS_SEC_W: "Vítejte v sektoru ",
    TTS_R_O: "Kolo skončilo! Ultimátním velitelem je ", TTS_WELC: "Vítej veliteli ",
    TTS_RIMMER_ON: "Varování! Rimmer Mód Aktivován!", TTS_RIMMER_OFF: "Rimmer Mód Deaktivován.", RIM_MODE: "RIMMER MÓD",
    ANOMALY: "ČASOVÁ ANOMÁLIE", PHYS_ALT: "Fyzika změněna!",
    TTS_DEV_ENT: "VAROVÁNÍ! POŽÍRAČ ČASU DETEKOVÁN!", TTS_DEV_DEF: "POŽÍRAČ ZNIČEN! ČAS ZACHRÁNĚN!",
    TTS_DEV_FAIL: "ČAS ZKONZUMOVÁN! KOLO ZKRÁCENO!", DEVOURER: "POŽÍRAČ ČASU",
    TTS_STARBUG_ENT: "Kosmik přilétá obnovit překážky!"
  }
};

const SPAM_MSGS = {
  CZ: [
    "{0} si pálí prst o displej!",
    "Pozor, {0} to tam sází jako o život!",
    "Velitel {0} má asi křeč v prstu!",
    "{0} žhaví obrazovku na maximum!",
    "Zastavte někdo hráče {0}, nebo nám praskne sklo!"
  ],
  EN: [
    "{0} is burning their finger on the screen!",
    "Watch out, {0} is tapping like crazy!",
    "Commander {0} must have a finger cramp!",
    "{0} is heating up the display to the max!",
    "Someone stop {0} before the glass breaks!"
  ]
};

const JOKES = {
  CZ: [
    "Všichni jsou mrtví, Dave.",
    "Peterson je mrtvý, Dave.",
    "Kochanská je mrtvá, Dave.",
    "A co kapitán Hollister?",
    "Všichni. Jsou. Mrtví. Dave.",
    "Polívka gazpacho! Kdybych věděl, že se podává studená...",
    "Uďte uzenáče, k snídani jsem zpátky.",
    "Křemíkové nebe neexistuje? A kam by potom přišly všechny ty kalkulačky?",
    "„Kouříš?“ – „Jen po sexu.“ – „Takže vůbec.“",
    "Jsem naprosto spolehlivý! To jen okolnosti jsou proti mně!",
    "To není katastrofa, to je totální smeg!",
    "Rimmere, ty jsi takový trouba, že bys ztratil i vlastní stín.",
    "Krytone, přestaň být tak zatraceně poslušný!",
    "Jsem poslední člověk naživu… a jsem to zrovna já.",
    "Tohle je plán? To je spíš zoufalý pokus neumřít.",
    "Když se něco může pokazit, Rimmer to pokazí.",
    "Tohle je nejhorší situace, v jaké jsem kdy byl… a to jsem byl Rimmerův spolubydlící.",
    "Já nejsem zbabělec! Jen mám vysoce vyvinutý pud sebezáchovy.",
    "Kocoure, ty jsi úplně k ničemu. – Ale vypadám u toho skvěle.",
    "To není problém. To je naprostá katastrofa.",
    "Rimmere, ty jsi chodící důkaz, že evoluce může jít i pozpátku.",
    "Já mám plán. A je dokonce lepší než žádný plán.",
    "Jsme ztraceni ve vesmíru, bez šance na návrat… dá si někdo curry?",
    "Já jsem tak skvělý, až je to skoro nespravedlivé.",
    "Rimmere, ty jsi úplně k ničemu… a ještě k tomu pomalý.",
    "Tohle je přesně ten typ plánu, který končí explozí.",
    "Krytone, někdy bys mohl být méně dokonalý, víš?",
    "Neříkám, že je to špatný nápad… ale ano, je to špatný nápad.",
    "Jsem génius! Jen to zatím nikdo nepoznal.",
    "Tohle je tak špatné, že už to ani nemůže být horší… že?",
    "Rimmere, ty bys nedokázal zorganizovat ani vlastní snídani.",
    "Já nemám problém. Já mám spoustu menších katastrof.",
    "Kocoure, ty myslíš někdy i na něco jiného než na sebe?",
    "Tohle je přesně chvíle, kdy bych měl být někde úplně jinde.",
    "Já to zvládnu! …Dobře, nezvládnu, ale zkusím to.",
    "Rimmere, kdybys byl ještě o trochu víc neschopný, zmizíš.",
    "To není panika. To je jen velmi rychlé přemýšlení.",
    "Vesmír je nebezpečné místo. A já jsem v něm s vámi.",
    "Jmenuju se Rimmer. Arnold Rimmer. A jsem naprosto nepostradatelný.",
    "Krytone, tohle je rozkaz! Přestaň poslouchat rozkazy!",
    "To není moje chyba! Já jsem hlasoval proti!",
    "Já jsem hrdina! Jen jsem měl smůlu na okolnosti.",
    "Listere, ty jsi naprostý barbar!",
    "Tohle není zbabělost. To je strategický ústup.",
    "Kocoure, ty nemáš ani špetku sebekontroly.",
    "Já mám vždycky pravdu. Jen se to občas ukáže později.",
    "Tohle je naprosto bezpečné… myslím.",
    "Krytone, analyzuj situaci! – Situace: jsme v koncích, pane.",
    "Já se nevzdávám! Jen… měním plán.",
    "Tohle je typická ukázka totální neschopnosti.",
    "Listere, ty jsi největší prasák v celé galaxii.",
    "Já bych to zvládl lépe… kdybych to dělal já.",
    "Tohle není konec. To je jen velmi špatný začátek.",
    "Smeg.",
    "Vypadá to jako něco, co zbylo po výbuchu v továrně na lepidlo.",
    "Dáme si toast?",
    "Nechci žádný smradlavý toast!",
    "A co takhle vafli?",
    "Jsi tak tupý, že by sis uřízl ruku o lžíci.",
    "Jaká je šance? Asi jako najít pannu v bordelu.",
    "Pravidlo vesmírného sboru 196156: Kdokoli, kdo zachrání lodní majetek, má právo na pivo.",
    "My nikoho nezachraňujeme, my utíkáme.",
    "Měl jsem krásný sen. Všichni jste v něm zemřeli.",
    "Listere, jsi odporný. Je to vědecký fakt.",
    "To byl můj nejlepší oblek!",
    "Moje IQ má stejnou hodnotu jako počet učitelů tělocviku v galaxii.",
    "Krytone, já chci své slipy.",
    "Tohle se mi nelíbí. A když se mi něco nelíbí, obvykle to vybuchne.",
    "Tenhle dopis je od Výboru pro odškodnění.",
    "Dneska je ryba. Pstruh a la creme.",
    "Zemřeme. Všichni zemřeme.",
    "Bílá díra? Takže z ní vychází čas?",
    "Co to je? Bílá díra!",
    "Dám si na to trochu pálivé omáčky.",
    "Máš mozek z bramborové kaše.",
    "A co mimozemšťani? Třeba jsou to mimozemšťani!",
    "Změňte žárovku na červenou!",
    "Ty jsi muž bez špetky cti.",
    "Proč mě všichni tak nenávidí?",
    "To jsi celý ty, Rimmere.",
    "A co takhle malý kompromis: já přežiju a vy ne.",
    "Je to horší než špatné. Je to katastrofální.",
    "Kdo uvařil to kari? Dá se s tím řezat kov.",
    "Tři miliony let... to je zatraceně dlouhá doba.",
    "Moje noha má větší mozek než ty.",
    "Nechci tě znervózňovat, ale jsme naprosto v háji.",
    "Listere, proč je v mém lůžku kari?",
    "Protože v lednici už nebylo místo.",
    "Já jsem Holly, lodní počítač s IQ 6000.",
    "Zavři klapačku, Holly!",
    "Hej vy tam! Potřebujeme kuličky! Nejsme tady na vesmírném pikniku!",
    "Klikejte na tu obrazovku! Moje babička by klikala rychleji a to je už mrtvá!",
    "Ztrácíme energii! Pošlete okamžitě kuličky, nebo nás to vcucne do černé díry!",
    "Vesmírná anomálie? Ne, to je jen vaše lenost! Klikat, klikat, klikat!",
    "Potřebujeme energii na štíty! Posádko, do boje!",
    "Nepanikařte! Já panikařím za nás za všechny!",
    "Slyšíte tu hudbu? To je ticho z prázdných chlívků!",
    "Klikat! Víc kuliček rovná se víc naděje pro lidstvo!",
    "Kdo nekliká, jako by nežil. Dave, klikej!",
    "Můj účes právě ztratil tvar z nedostatku kuliček na obrazovce!",
    "Rimmere, i tahle obrazovka má víc charizmatu než ty.",
    "Štíty na 20 procent! Přidat kuličky, vy smegheadi!",
    "Krytone, co dělají naši diváci? Nudí se!",
    "Jestli nepošlete kuličku, začnu zpívat. A vy víte, co to znamená.",
    "Lajky, lidi, lajky! To je palivo budoucnosti!",
    "Pamatujte na pravidlo sboru: pokud něco bliká, klikejte na to!",
    "Zírám do propasti a propast zírá na mě.",
    "Navrhuji, abychom zalezli pod stůl a brečeli.",
    "Ty jsi absolutní, naprostý, stoprocentní magor.",
    "Jediná věc, která nás dělí od jisté smrti, je tenhle kus plechu.",
    "Víš, co se stane, když zmáčkneš tohle tlačítko? Vymažeš nás z existence.",
    "To je úžasné, on to fakt dokázal zkazit ještě víc.",
    "Listere, máš tolik šarmu jako přejetý jezevec.",
    "Vesmír je obrovský, chladný a my v něm nemáme žádný smysl. Dáme si párek?",
    "Zemřeme. Všichni zemřeme. Ale aspoň u toho budeme dobře vypadat!",
    "Nikdo mě nemá rád. Všichni mě nenávidí. Půjdu na zahradu a sním žížalu.",
    "Nejsem zbabělec, jsem jen extrémně opatrný.",
    "Víš, co je tvůj problém? Jsi úplně k ničemu.",
    "Mám nápad! Můžeme se vzdát.",
    "Jestli tohle přežijeme, slibuju, že už nikdy nebudu jíst Listerovo kari.",
    "Byl to jen takový malý výbuch. Nic vážného.",
    "Takže my tu prostě sedíme a čekáme na smrt?",
    "Když jsem byl malý, chtěl jsem být pes.",
    "Budeme žít navždy... nebo aspoň do úterý.",
    "Co budeme dělat? Panikařit?",
    "Nouzový protokol zahájen: Všichni běhejte v kruzích a mávejte rukama.",
    "Krytone, sundej si ten převlek. - Tohle není převlek, to je moje tvář.",
    "Jsi tak blbej, že by sis zapomněl dýchat.",
    "Tohle je horší než hrát Scrabble s hologramem.",
    "Jsem naštvaný, unavený a chci svoje kuře vindaloo!",
    "Může někdo vypnout toho zatraceného Toustovače?!"
  ],
  EN: [
    "Everybody's dead, Dave.",
    "Watch out, {0} is tapping like crazy!",
    "Commander {0} must have a finger cramp!",
    "{0} is heating up the display to the max!",
    "Someone stop {0} before the glass breaks!"
  ]
};

let engine, world;
let balls = [], pegs = [], zones = [], walls = [], explosions = [], leaderboard = {};
let timer = 40, resultsTimer = 10, lastTick = 0, waitStartTime = 0, totalBallsFired = 0, roundTotalBalls = 0, roundCount = 1;
let gameState = "PLAYING", libraryLoaded = false, winnerColor, flashEffect = 0, shakeAmount = 0;
let currentDestination = "", currentGravity = 0.6, currentBounce = 80, spawnPerEvent = 1, currentShipChance = 30;
let spawnQueue = [], portals = [], floatingTexts = [], shockwaves = [], joinPopupQueue = [], activeJoinPopup = null;
const UI_THEMES = [[0, 255, 255], [255, 50, 255], [50, 255, 50], [255, 200, 0], [255, 100, 50], [150, 100, 255]];
let currentTheme = UI_THEMES[0];

let starship = null, shipPlanned = false, shipSpawnAt = -1, viewerSpaceObjects = [];
let cosmicEvent = null, eventOccurredThisRound = false, followEvents = [], availableVoices = [], lastSpokeTime = 0;
let nextMeteorShowerTime = 0, nextJokeTime = 0, meteorWarningTimer = 0, backgroundMeteors = [];
let boss = null, bossPlanned = false, bossSpawnAt = -1, userAvatars = {}; 

let rimmerModeActive = false, rimmerModeTimer = 0, rimmerModePlanned = false, rimmerModeTriggerTime = -1, originalGravity = 0.6, originalBounce = 80;

let spamBuffer = {};

let fakeChat = [];
const FAKE_CHAT_NAMES = ["Dave", "Arnold", "Kryten", "Cat", "Kochanski", "Holly", "Petersen", "Todhunter", "user88", "gamer_boy", "pepa_z_depa", "alien99"];
const FAKE_CHAT_MSGS = {
  CZ: ["další", "spam", "kuličky", "w", "nice", "posilam", "epic", "gooo", "lol", "gg", "šílený", "boss?", "vic odrazu"],
  EN: ["more", "spam", "balls", "w", "nice", "sending", "epic", "gooo", "lol", "gg", "crazy", "boss?", "more bounce"]
};

// Premenné pre mechaniku pridávania času a anomálie
let bonusTime = 0.0;
let roundStartTimeReal = 0;
let nextAnomalyTime = 60; 
let anomalyState = 0; 
let anomalyTimer = 0;
let anomG = 0, anomB = 0, dispG = 0, dispB = 0, anomalyAngle = 0;

// Novy Boss - Pozirac Casu
let devourer = null;
let devourerSpawnedThisRound = false;

const badWordsRegex = /(n[i1l]gg[e3]r|n[i1l]gg[a4]|f[u4]ck|sh[i1]t|b[i1]tch|c[u4]nt|wh[o0]re|sl[u4]t|f[a4]g|d[i1]ck|c[o0]ck|p[u4]ssy|r[e3]t[a4]rd|r[a4]p[e3]|s[u4]ck|k[i1]ll|n[a4]z[i1]|j[e3]w|h[i1]tl[e3]r)/gi;

let camOffset = { x: 0, y: 0, z: 1.0 }, targetFPS = 60, socket;
const TEST_BOTS = ["LISTER", "RIMMER", "KRYTON", "KOCUR", "HOLLY", "KOCHANSKA", "ALFA", "CYBER"];
const TIKFINITY_URL = "ws://localhost:21213/";

let isAutoMode = true, isMothershipMode = true;
let gravitySlider, bounceSlider, spawnPerEventSlider, shipChanceSlider, volumeSlider, ttsSlider, mothershipSlider;
let autoButton, langButton;
let lblGrav, lblBounce, lblSpawn, lblBoss, lblVol, lblTTS, lblMother;

let stars = [], dust = [], massivePlanets = [], spaceDebris = [], nebulas = [], shootingStars = [], ambientComets = [];
let planetSize = 0, currentTravelSpeed = 1.0, blackHole = null, bhSpawnTimes = [], fxSynth, audioStarted = false;
let lastSpawnSnd = 0, lastExpSnd = 0, lastSpawnTime = 0, doorOpen = 0;

const W = 900, H = 1000, ZONE_H = 80;

const RARE_POOL = [
  { id: "STARMAN", name: "ELON'S TESLA", col: [200, 0, 0], size: 28 },
  { id: "HAWKING", name: "S. HAWKING", col: [50, 50, 255], size: 22 },
  { id: "LAIKA", name: "LAIKA DOG", col: [200, 180, 150], size: 18 },
  { id: "ET", name: "E.T.", col: [150, 120, 80], size: 24 },
  { id: "NYAN", name: "NYAN CAT", col: [255, 100, 200], size: 25 },
  { id: "STARBUG", name: "KOSMIK", col: [50, 200, 50], size: 30 },
  { id: "RED_DWARF", name: "CERVENY TRPASLIK", col: [220, 50, 50], size: 45 }
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
  let adminBar = createDiv('');
  adminBar.style('width', W + 'px');
  adminBar.style('background', '#15151a');
  adminBar.style('color', '#fff');
  adminBar.style('padding', '10px');
  adminBar.style('display', 'flex');
  adminBar.style('flex-wrap', 'wrap');
  adminBar.style('gap', '10px');
  adminBar.style('align-items', 'center');
  adminBar.style('font-family', 'sans-serif');
  adminBar.style('font-size', '12px');
  adminBar.style('box-sizing', 'border-box');

  langButton = createButton('LANG: ' + currentLang);
  langButton.parent(adminBar);
  langButton.style('background', '#4CAF50');
  langButton.style('color', 'white');
  langButton.style('border', 'none');
  langButton.style('padding', '5px 10px');
  langButton.style('cursor', 'pointer');
  langButton.mousePressed(toggleLang);

  let randG = random() < 0.8 ? random(50, 255) : random(1, 50);
  currentGravity = map(randG, 1, 255, 0.01, 5.0);
  currentBounce = floor(random() < 0.8 ? random(50, 255) : random(1, 50));

  lblGrav = createSpan(T[currentLang].GRAV); lblGrav.parent(adminBar);
  gravitySlider = createSlider(0.01, 5.0, currentGravity, 0.01); gravitySlider.parent(adminBar);

  lblBounce = createSpan(T[currentLang].BOUNCE); lblBounce.parent(adminBar);
  bounceSlider = createSlider(1, 255, currentBounce, 1); bounceSlider.parent(adminBar);

  lblSpawn = createSpan(T[currentLang].SPAWN); lblSpawn.parent(adminBar);
  spawnPerEventSlider = createSlider(1, 50, spawnPerEvent, 1); spawnPerEventSlider.parent(adminBar);

  lblBoss = createSpan(T[currentLang].CHANCE); lblBoss.parent(adminBar);
  shipChanceSlider = createSlider(0, 100, currentShipChance, 1); shipChanceSlider.parent(adminBar);

  lblVol = createSpan(T[currentLang].SFX); lblVol.parent(adminBar);
  volumeSlider = createSlider(0, 1, 0.5, 0.05); volumeSlider.parent(adminBar);

  lblTTS = createSpan(T[currentLang].TTS_VOL); lblTTS.parent(adminBar);
  ttsSlider = createSlider(0, 1, 1.0, 0.01); ttsSlider.parent(adminBar);

  autoButton = createButton('AUTO: ON'); autoButton.parent(adminBar);
  autoButton.style('background-color', '#4CAF50');
  autoButton.mousePressed(toggleAutoMode);

  lblMother = createSpan(T[currentLang].RATE); lblMother.parent(adminBar);
  mothershipSlider = createSlider(0, 30, 5, 1); mothershipSlider.parent(adminBar);

  let cvs = createCanvas(W, H);
  cvs.style('display', 'block');

  smooth();
  textFont('Press Start 2P');
  winnerColor = color(0, 0, 128);
  fxSynth = new p5.PolySynth();
  
  for (let i = 0; i < 100; i++) stars.push({ x: random(W), y: random(H), s: random(1, 2.5), speed: random(0.1, 0.4) });
  for (let i = 0; i < 300; i++) dust.push({ x: random(W), y: random(H), s: random(0.5, 1.5) });
  
  timer = floor(random(50, 181));
  currentDestination = generatePlanetName();
  currentTheme = random(UI_THEMES);
  
  roundStartTimeReal = millis(); 
  
  generateDeepSpaceElements();
  prepareSingularityEvents();
  planSpaceshipForRound();
  planBossForRound();
  initTTS();
  connectTikfinity();
  
  nextMeteorShowerTime = millis() + 66000;
  nextJokeTime = millis() + random(10000, 20000);
}

function toggleLang() {
  currentLang = currentLang === "EN" ? "CZ" : "EN";
  langButton.html('LANG: ' + currentLang);
  lblGrav.html(T[currentLang].GRAV);
  lblBounce.html(T[currentLang].BOUNCE);
  lblSpawn.html(T[currentLang].SPAWN);
  lblBoss.html(T[currentLang].CHANCE);
  lblVol.html(T[currentLang].SFX);
  lblTTS.html(T[currentLang].TTS_VOL);
  lblMother.html(T[currentLang].RATE);
}

function generatePlanetName() {
  const n = ["XERON", "KEPLER", "ZENON", "AETHER", "NIBIRU", "PANDORA", "CYGNUS", "TITAN", "SOLARIS", "ZION"];
  const t = ["PRIME", "STATION", "SYSTEM", "REACH", "BETA", "MAJOR", "MINOR", "VOID"];
  return random(n) + " " + random(t);
}

function initTTS() {
  if ('speechSynthesis' in window) {
    let setV = () => { availableVoices = window.speechSynthesis.getVoices(); };
    window.speechSynthesis.onvoiceschanged = setV;
    setV();
  }
}

function sanitizeText(t) {
  if (!t) return "Commander";
  let s = t.replace(badWordsRegex, "Bleep").replace(/[^\p{L}\p{N} ]/gu, "").trim().substring(0, 15);
  return s || "Commander";
}

function getHoustonStory(p) {
  const i = currentLang === "CZ" ? ["Tady Houston. ", "Řídící centrum. "] : ["Houston here. ", "Command center. "];
  const a = currentLang === "CZ" ? [`Energetický impuls od `, `Manévry od `] : [`Energy surge from `, `Maneuvers by `];
  return random(i) + random(a);
}

function speakAnnouncer(p, pri = 0) {
  if (!audioStarted || !('speechSynthesis' in window)) return;
  if (window.speechSynthesis.speaking && pri < 1) return;
  let u = new SpeechSynthesisUtterance(p);
  let langCode = currentLang === "CZ" ? "cs" : "en";
  let env = availableVoices.filter(v => v.lang && v.lang.includes(langCode));
  if (env.length > 0) u.voice = random(env);
  
  let voiceType = random(["ROBOT", "WOMAN", "MAN", "ALIEN", "NORMAL"]);
  if (voiceType === "ROBOT") {
    u.pitch = 0.3; u.rate = 0.8;
  } else if (voiceType === "WOMAN") {
    u.pitch = 1.7; u.rate = 1.1;
  } else if (voiceType === "ALIEN") {
    u.pitch = 0.1; u.rate = 0.6;
  } else if (voiceType === "MAN") {
    u.pitch = 0.7; u.rate = 0.9;
  } else {
    u.pitch = 1.0; u.rate = 1.0;
  }
  
  u.volume = ttsSlider ? parseFloat(ttsSlider.value()) : 1.0;
  window.speechSynthesis.speak(u);
}

function speakName(n) {
  if (!audioStarted || !('speechSynthesis' in window)) return;
  let u = new SpeechSynthesisUtterance(n.toLowerCase());
  let v = null;
  
  if (/[\u0400-\u04FF]/.test(n)) v = availableVoices.find(x => x.lang && x.lang.includes('ru'));
  else if (/[\u0600-\u06FF]/.test(n)) v = availableVoices.find(x => x.lang && x.lang.includes('ar'));
  else if (/[ěščřžýáíéůúťďň]/i.test(n)) v = availableVoices.find(x => x.lang && x.lang.includes('cs')); 
  else if (/[äöüß]/i.test(n)) v = availableVoices.find(x => x.lang && x.lang.includes('de')); 
  else if (/[ñáéíóú¿¡]/i.test(n)) v = availableVoices.find(x => x.lang && x.lang.includes('es')); 
  else if (/[ąęłńóśźż]/i.test(n)) v = availableVoices.find(x => x.lang && x.lang.includes('pl')); 
  
  if (v) { u.voice = v; u.lang = v.lang; } 
  else {
    let fallbackLang = currentLang === "CZ" ? "cs" : "en";
    let env = availableVoices.filter(x => x.lang && x.lang.includes(fallbackLang));
    if (env.length > 0) u.voice = random(env);
  }
  
  let voiceType = random(["ROBOT", "WOMAN", "MAN", "ALIEN", "NORMAL"]);
  if (voiceType === "ROBOT") {
    u.pitch = 0.3; u.rate = 0.8;
  } else if (voiceType === "WOMAN") {
    u.pitch = 1.7; u.rate = 1.1;
  } else if (voiceType === "ALIEN") {
    u.pitch = 0.1; u.rate = 0.6;
  } else if (voiceType === "MAN") {
    u.pitch = 0.7; u.rate = 0.9;
  } else {
    u.pitch = 1.0; u.rate = 1.0;
  }

  u.volume = ttsSlider ? parseFloat(ttsSlider.value()) : 1.0; 
  window.speechSynthesis.speak(u);
}

function connectTikfinity() {
  socket = new WebSocket(TIKFINITY_URL);
  socket.onopen = () => console.log("[Tikfinity] Connected");
  socket.onmessage = (e) => {
    try {
      let d = JSON.parse(e.data);
      let evt = d?.event || d?.type || "";
      let n = d?.data?.nickname || d?.data?.uniqueId || "Anonym";
      
      if (n && n !== "Anonym") {
        let u = n.substring(0, 15); let s = sanitizeText(u);
        onUserJoin(u, d?.data?.profilePictureUrl || d?.profilePictureUrl || "");
        
        if (evt === "follow") {
          triggerFollowEvent(s);
        } else if (evt === "chat") {
          let c = Math.min((d?.data?.comment || "").length, 15);
          for (let i = 0; i < c; i++) setTimeout(() => { spawnBall(u); }, i * 150);
          if (millis() - lastSpokeTime > 8000) {
            speakAnnouncer(getHoustonStory(s), 0); speakName(s); lastSpokeTime = millis();
          }
        } else if (evt !== "like") {
          for (let j = 0; j < spawnPerEvent; j++) spawnBall(u);
        }
        
        if (evt === "like") {
          let c = d.data?.likeCount || 1;
          updateUserLikes(u, c);
          
          if (!spamBuffer[u]) {
              spamBuffer[u] = { total: 0, buffered: 0, lastUpdate: millis(), state: 'CHARGING', fade: 255, announced: false };
          }
          let sp = spamBuffer[u];
          sp.lastUpdate = millis();
          sp.state = 'CHARGING';
          sp.fade = 255;
          
          if (sp.total < 4 && c < 5) {
              for (let i = 0; i < c; i++) {
                 setTimeout(() => { for (let j = 0; j < spawnPerEvent; j++) spawnBall(u); }, i * 120);
              }
              sp.total += c;
          } else {
              sp.total += c;
              sp.buffered += c;
          }

          if (sp.total >= 5 && !sp.announced) {
              sp.announced = true;
              if (millis() - lastSpokeTime > 6000) {
                  let msgTemplate = random(SPAM_MSGS[currentLang]);
                  speakAnnouncer(msgTemplate.replace("{0}", s), 1);
                  lastSpokeTime = millis();
              }
          }

          if (millis() - lastSpokeTime > 9000 && sp.total < 5) {
            speakAnnouncer(T[currentLang].TTS_POW, 0); speakName(s); lastSpokeTime = millis();
          }
        }
      }
    } catch (err) {}
  };
  socket.onclose = () => setTimeout(connectTikfinity, 5000);
}

function startSpaceAudio() { audioStarted = true; userStartAudio(); }

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
  if (audioStarted) try { fxSynth.play(100, 0.05, 0, 1.0); } catch(e) {}
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

function toggleAutoMode() {
  isAutoMode = !isAutoMode;
  if (isAutoMode) {
    autoButton.html('AUTO: ON'); autoButton.style('background-color', '#4CAF50'); autoRandomSettings();
  } else {
    autoButton.html('AUTO: OFF'); autoButton.style('background-color', '');
  }
}

function autoRandomSettings() {
  let randG = random() < 0.8 ? random(50, 255) : random(1, 50);
  currentGravity = map(randG, 1, 255, 0.01, 5.0);
  currentBounce = floor(random() < 0.8 ? random(50, 255) : random(1, 50));
  spawnPerEvent = floor(random(1, 4)); currentShipChance = floor(random(0, 101));
  gravitySlider.value(currentGravity); bounceSlider.value(currentBounce);
  spawnPerEventSlider.value(spawnPerEvent); shipChanceSlider.value(currentShipChance);
  if (mothershipSlider) mothershipSlider.value(floor(random(0, 31)));
  if (world) world.gravity.y = currentGravity;
}

function drawTxt(t, x, y, c, s, a = CENTER) {
  push(); noStroke(); textAlign(a, CENTER); textSize(s);
  fill(0, 150); text(t, x + 2, y + 2);
  fill(c); text(t, x, y); pop();
}

function updateWinnerColor() {
  let s = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score);
  winnerColor = (s.length > 0) ? lerpColor(winnerColor, s[0][1].color, 0.005) : color(0, 0, 128);
}

function updateTravelSpeed() {
  let target = (gameState === "PLAYING" ? 1.0 : 0.2);
  currentTravelSpeed = lerp(currentTravelSpeed, target, 0.01);
}

function draw() {
  if (!libraryLoaded) return;
  if (!engine) initGame();
  
  let diff = (!rimmerModeActive && (gravitySlider.value() !== currentGravity)) || 
             (!rimmerModeActive && (bounceSlider.value() !== currentBounce)) || 
             (spawnPerEventSlider.value() !== spawnPerEvent) || 
             (shipChanceSlider.value() !== currentShipChance);
             
  if (diff) {
    if (isAutoMode) toggleAutoMode();
    currentGravity = gravitySlider.value(); currentBounce = bounceSlider.value();
    spawnPerEvent = spawnPerEventSlider.value(); currentShipChance = shipChanceSlider.value();
    if (world) world.gravity.y = currentGravity;
  }
  
  if (frameCount % 60 === 0) targetFPS = random(57, 60);
  frameRate(targetFPS);
  
  if (audioStarted) outputVolume(volumeSlider.value() * 0.3);

  push();
  camOffset.x = (noise(frameCount * 0.005) - 0.5) * 40;
  camOffset.y = (noise(frameCount * 0.005 + 100) - 0.5) * 40;
  camOffset.z = 1.0 + (noise(frameCount * 0.002) - 0.5) * 0.05;
  
  translate(W / 2, H / 2); scale(camOffset.z); translate(-W / 2 + camOffset.x, -H / 2 + camOffset.y);
  
  if (shakeAmount > 0) {
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
    shakeAmount *= 0.92;
  }
  
  translate(sin(frameCount * 0.013) * 2.5, cos(frameCount * 0.017) * 2.5);

  updateWinnerColor(); updateTravelSpeed();
  
  let bgTime = frameCount * 0.002;
  let bgR = 5 + sin(bgTime) * 10, bgG = 5 + cos(bgTime * 1.3) * 10, bgB = 15 + sin(bgTime * 0.8) * 15;
  if (rimmerModeActive) {
    bgR = 60 + sin(frameCount * 0.2) * 40;
    bgG = 10;
    bgB = 10;
  }
  background(bgR, bgG, bgB);
  
  drawGalacticBackground(); 
  drawViewerObjects(); 
  handleBackgroundMeteors();

  let dimAlpha = map(min(balls.length, 800), 0, 800, 0, 90);
  if (dimAlpha > 0) {
    fill(0, 0, 0, dimAlpha);
    noStroke();
    rect(-W, -H, W * 3, H * 3);
  }

  try { Matter.Engine.update(engine, 1000 / 60); } catch (e) {}
  
  handleBlackHole(); handleCosmicEvent(); handleSpaceship(); handleBoss(); handleDevourer();

  if (gameState === "PLAYING") {
    if (millis() > nextMeteorShowerTime) {
      triggerMeteorShower(); nextMeteorShowerTime = millis() + 66000;
    }
    
    if (!rimmerModeActive && millis() > nextJokeTime) {
      speakAnnouncer(random(JOKES[currentLang]), 0);
      nextJokeTime = millis() + random(10000, 20000);
    }
    
    if (random() < 0.045) {
      let side = floor(random(3)); let mx, my, mvx, mvy;
      if (side === 0) { mx = random(W); my = -50; mvx = random(-4, 4); mvy = random(15, 25); } 
      else if (side === 1) { mx = -50; my = random(H/2); mvx = random(15, 25); mvy = random(5, 15); } 
      else { mx = W + 50; my = random(H/2); mvx = random(-25, -15); mvy = random(5, 15); }
      backgroundMeteors.push({ x: mx, y: my, vx: mvx, vy: mvy, size: random(4, 12), c: color(255, random(100, 200), 0), trail: [] });
    }
    
    let msRate = mothershipSlider ? mothershipSlider.value() : 0;
    if (isMothershipMode && msRate > 0 && balls.length < 3000) {
      if (random() < (msRate / targetFPS)) spawnBall("MOTHERSHIP");
    }
  }

  if (millis() - lastTick > 1000) {
    if (gameState === "PLAYING") {
      if (anomalyState === 0) { 
          
          if (timer <= 10 && bonusTime >= 1.0) {
              let toTransfer = Math.floor(bonusTime);
              timer += toTransfer;
              bonusTime -= toTransfer;
          } else {
              timer--;
          }
          
          checkSingularitySpawn();

          if (rimmerModePlanned && !rimmerModeActive && timer === rimmerModeTriggerTime) {
            rimmerModeActive = true;
            rimmerModeTimer = 10;
            originalGravity = currentGravity; originalBounce = currentBounce;
            currentGravity = random(3.0, 5.0); currentBounce = floor(random(200, 255));
            gravitySlider.value(currentGravity); bounceSlider.value(currentBounce);
            if (world) world.gravity.y = currentGravity;
            speakAnnouncer(T[currentLang].TTS_RIMMER_ON, 2);
            shakeAmount = 30; flashEffect = 40;
          }
          
          if (rimmerModeActive) {
            rimmerModeTimer--;
            if (rimmerModeTimer === 5) speakAnnouncer(random(JOKES[currentLang]), 1);
            if (rimmerModeTimer <= 0) {
              rimmerModeActive = false;
              currentGravity = originalGravity; currentBounce = originalBounce;
              gravitySlider.value(currentGravity); bounceSlider.value(currentBounce);
              if (world) world.gravity.y = currentGravity;
              speakAnnouncer(T[currentLang].TTS_RIMMER_OFF, 1);
            }
          }

          if (shipPlanned && !starship && timer === shipSpawnAt) spawnSpaceship();
          if (bossPlanned && !boss && timer === bossSpawnAt) spawnBoss();
          
          if (!eventOccurredThisRound && timer < (timer * 0.7) && random() < 0.17) triggerCosmicEvent();
          if (random() < 0.11) spawnRareLegend();
          if (timer === 10) speakAnnouncer(T[currentLang].TTS_10S, 1);
          if (timer <= 0) {
            gameState = "WAITING"; waitStartTime = millis(); shakeAmount = 6;
            playCleanupSound(); playTimerEndSequence(); 
            speakAnnouncer(T[currentLang].TTS_SEC_C, 2);
          }
          
      }
    } else if (gameState === "RESULTS") {
      resultsTimer--;
      if (resultsTimer <= 0) resetGame();
    }
    lastTick = millis();
  }

  if (gameState === "WAITING") {
    if (balls.length === 0 || (millis() - waitStartTime) / 1000 > 10) {
      gameState = "RESULTS"; resultsTimer = 10;
      let s = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score);
      if (s.length > 0) { speakAnnouncer(T[currentLang].TTS_R_O, 2); speakName(s[0][0]); }
    }
  }

  if (frameCount % 15 === 0) {
      let zC = new Array(zones.length).fill(0);
      for (let i = balls.length - 1; i >= 0; i--) {
          let b = balls[i];
          if (b.scored && b.zoneIndex >= 0) {
              zC[b.zoneIndex]++;
              let lim = Math.max(2, Math.floor(zones[b.zoneIndex].capacity * 0.8));
              if (zC[b.zoneIndex] > lim || (millis() - b.scoreTime > 7000)) {
                  removeBall(b);
              }
          }
      }
  }

  drawPortals(); drawZones(); drawWalls(); drawPegs(); drawBalls(); drawExplosions();
  handleFollowEvents(); handleShockwaves(); handleFloatingTexts(); drawUI(); handleJoinPopups();
  
  if (gameState === "WAITING") drawWaitingMessage();
  if (gameState === "RESULTS") drawResultsOverlay();
  
  if (rimmerModeActive) {
    let f = (frameCount % 10 < 5) ? 255 : 100;
    drawTxt(typeof T !== 'undefined' ? `${T[currentLang].RIM_MODE} ${rimmerModeTimer}s` : `RIMMER MODE ${rimmerModeTimer}s`, 0, 150, color(255, 50, 50, f), 45, CENTER);
  }

  if (meteorWarningTimer > 0) {
    meteorWarningTimer--;
    let flash = (frameCount % 20 < 10) ? 150 : 50;
    fill(255, 0, 0, flash * 0.3);
    noStroke();
    rect(-W, -H, W * 3, H * 3);
    let warningText = currentLang === "CZ" ? "!!! METEORICKÝ ROJ !!!" : "!!! METEOR SHOWER !!!";
    drawTxt(warningText, 0, -150, color(255, 50, 50, flash + 100), 40, CENTER);
    if (audioStarted && meteorWarningTimer % 15 === 0) {
      try { fxSynth.play((meteorWarningTimer % 30 === 0) ? 600 : 400, 0.1, 0, 0.2); } catch(e){}
    }
  }

  handleSpamBuffer();
  handleFakeChat();
  drawProceduralHUD(); drawAntiBotOverlay();
  
  while (balls.length > 350) {
      let idx = balls.findIndex(b => b.scored);
      removeBall(balls[idx !== -1 ? idx : 0]);
  }
  
  if (flashEffect > 0) {
    noStroke(); fill(20, 40, 100, map(flashEffect, 0, 60, 0, 100)); rect(-W, -H, W*3, H*3);
    flashEffect--;
  }
  pop();
}

function handleFakeChat() {
  if (random() < 0.05) {
    fakeChat.push({ name: random(FAKE_CHAT_NAMES), msg: random(FAKE_CHAT_MSGS[currentLang]), life: 255 });
    if (fakeChat.length > 5) fakeChat.shift();
  }
  push();
  textAlign(LEFT, BOTTOM);
  textSize(11);
  for(let i = 0; i < fakeChat.length; i++) {
    let c = fakeChat[i];
    fill(255, 200, 0, c.life);
    text(c.name + ": ", 15, H - 35 - ((fakeChat.length - 1 - i) * 16));
    fill(255, c.life);
    text(c.msg, 15 + textWidth(c.name + ": "), H - 35 - ((fakeChat.length - 1 - i) * 16));
    c.life -= 1.5;
  }
  pop();
}

function handleSpamBuffer() {
  let activeSpammers = Object.keys(spamBuffer).filter(u => spamBuffer[u].state === 'CHARGING' || spamBuffer[u].state === 'RELEASING');
  let numSpammers = activeSpammers.length;
  
  if (numSpammers === 0) return;

  let spacing = 50; 
  let startX = (W / 2) - ((numSpammers - 1) * spacing) / 2;

  for (let i = 0; i < numSpammers; i++) {
    let u = activeSpammers[i];
    let sp = spamBuffer[u];
    
    let bx = startX + i * spacing;
    let by = 70;
    
    if (!leaderboard[u]) leaderboard[u] = { score: 0, color: color(random(100, 255), random(100, 255), random(100, 255)) };
    let uCol = leaderboard[u].color;
    
    push();
    translate(bx, by);
    let a = sp.fade;
    
    let scaleVal = sp.state === 'CHARGING' ? 1 + sin(millis() * 0.007) * 0.3 : 1;
    scale(scaleVal);
    
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(red(uCol), green(uCol), blue(uCol), a);
    stroke(uCol);
    strokeWeight(2);
    
    if (userAvatars[u]) {
      drawingContext.save(); 
      drawingContext.beginPath();
      drawingContext.arc(0, 0, 20, 0, TWO_PI); 
      drawingContext.clip();
      tint(255, a); 
      imageMode(CENTER); 
      image(userAvatars[u], 0, 0, 40, 40);
      drawingContext.restore();
      
      noFill();
      ellipse(0, 0, 40, 40);
    } else {
      fill(100, a); 
      ellipse(0, 0, 40, 40);
    }
    
    drawingContext.shadowBlur = 0;
    noStroke();
    
    if (sp.total >= 5) {
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = color(255, 200, 0, a);
      drawTxt("+" + sp.total + (currentLang === "CZ" ? " LAJKŮ" : " LIKES"), 0, 35, color(255, 200, 0, a), 14, CENTER);
      drawingContext.shadowBlur = 0;
    }
    
    drawTxt(u.substring(0, 8), 0, -30, color(red(uCol), green(uCol), blue(uCol), a), 10, CENTER);
    pop();
    
    if (sp.state === 'CHARGING' && millis() - sp.lastUpdate > 1500) {
      sp.state = 'RELEASING';
      if (sp.buffered > 0) {
        let count = Math.min(sp.buffered, 5); 
        let baseMult = Math.floor(sp.buffered / count);
        let remainder = sp.buffered % count;

        for (let j = 0; j < count; j++) {
           let vx = random(-8, 8);
           let vy = random(2, 9);
           let ballMult = baseMult + (j < remainder ? 1 : 0);
           spawnBall(u, ballMult, bx + random(-15, 15), by + random(0, 15), vx, vy);
        }
        createShockwave(bx, by);
        playJackpotSound();
      }
    }
    
    if (sp.state === 'RELEASING') {
      sp.fade -= 5;
      if (sp.fade <= 0) delete spamBuffer[u];
    }
  }
}

function spawnBall(userName, mult = 1, startX = null, startY = null, velX = null, velY = null) {
  if (!libraryLoaded) return;
  if (gameState !== "PLAYING") { if (spawnQueue.length < 500) spawnQueue.push(userName); return; }
  if (balls.length > 700) return;
  if (userName !== "MOTHERSHIP") { totalBallsFired++; roundTotalBalls++; }
  if (!audioStarted) startSpaceAudio();
  
  let isR = random() < 0.03;
  if (isR) playRainbowSound(); else playSpawnSound();
  lastSpawnTime = millis();
  
  let ballRestitution = map(currentBounce, 1, 255, 0.5, 1.5);
  let spawnX = startX !== null ? startX : W / 2 + random(-30, 30);
  let spawnY = startY !== null ? startY : 40;
  
  let isMega = mult >= 2; 
  let bSize = isMega ? constrain(14 + mult, 16, 24) : 14; 
  
  let ballBody = Matter.Bodies.rectangle(spawnX, spawnY, bSize, bSize, { restitution: ballRestitution, friction: 0.2, frictionAir: 0.04, density: isMega ? 0.005 : 0.001, sleepThreshold: 30 });
  if (velX !== null && velY !== null) {
    Matter.Body.setVelocity(ballBody, { x: velX, y: velY });
  }
  let ballColor = (userName === "MOTHERSHIP") ? color(120, 120, 130) : (leaderboard[userName] || (leaderboard[userName] = { score: 0, color: color(random(100, 255), random(100, 255), random(100, 255)) })).color;
  
  balls.push({ body: ballBody, name: userName, color: ballColor, scored: false, combo: 0, lastHitTime: 0, lastShipHit: 0, lastBossHit: 0, spawnTime: millis(), isRainbow: isR, trail: [], rainbowExplodeTime: null, portalCooldown: 0, scoreTime: null, zoneIndex: -1, multiplier: mult, size: bSize });
  Matter.World.add(world, ballBody);
}

function drawBalls() {
  let zCounts = new Array(zones.length).fill(0);
  let ballsToRemove = [];

  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    if (b.scored && b.zoneIndex !== -1 && b.zoneIndex < zones.length) {
       zCounts[b.zoneIndex]++;
       let limit = Math.max(1, Math.floor(zones[b.zoneIndex].capacity * 0.95));
       if (zCounts[b.zoneIndex] > limit) {
          ballsToRemove.push(b);
          zCounts[b.zoneIndex]--; 
       }
    }
  }
  
  for(let i=0; i<ballsToRemove.length; i++) removeBall(ballsToRemove[i]);

  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    if (!b.body || isNaN(b.body.position.x) || isNaN(b.body.position.y)) { removeBall(b); continue; }
    
    let pos = b.body.position;
    if (b.scored && b.body.velocity.y < -2 && pos.y < H - ZONE_H - 50) b.scored = false;
    if (b.portalCooldown > 0) b.portalCooldown--;
    
    if (portals.length === 2 && b.portalCooldown <= 0) {
      let d0 = dist(pos.x, pos.y, portals[0].x, portals[0].y);
      let d1 = dist(pos.x, pos.y, portals[1].x, portals[1].y);
      if (d0 < 45) {
        Matter.Body.setPosition(b.body, { x: portals[1].x, y: portals[1].y });
        Matter.Body.setVelocity(b.body, { x: random(-5, 5), y: random(-2, 5) });
        b.portalCooldown = 60; playSpawnSound();
      } else if (d1 < 45) {
        Matter.Body.setPosition(b.body, { x: portals[0].x, y: portals[0].y });
        Matter.Body.setVelocity(b.body, { x: random(-5, 5), y: random(-2, 5) });
        b.portalCooldown = 60; playSpawnSound();
      }
    }
    
    push(); translate(pos.x, pos.y); rotate(b.body.angle);
    if (b.combo > 2) { fill(255); noStroke(); rect(-9, -9, 18, 18); }
    
    let drawCol = b.isRainbow ? (colorMode(HSB), color((frameCount * 10) % 360, 255, 255)) : b.color;
    if (b.isRainbow) colorMode(RGB);
    
    let isPlayer = b.name !== "MOTHERSHIP";
    if (isPlayer) {
      if (b.multiplier >= 2) {
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = drawCol;
      }
      noStroke(); fill(red(drawCol), green(drawCol), blue(drawCol), 120); rect(-b.size/2 - 5, -b.size/2 - 5, b.size + 10, b.size + 10, 6);
      fill(drawCol); stroke(255); strokeWeight(2); rect(-b.size/2, -b.size/2, b.size, b.size, 4);
      noStroke(); fill(255, 220); ellipse(0, 0, b.size * 0.4, b.size * 0.4);
      drawingContext.shadowBlur = 0;
      
      if (b.multiplier >= 2) {
         fill(255, 200, 0); textAlign(CENTER, CENTER); textSize(10);
         text("x" + b.multiplier, 0, 0);
      }
    } else {
      fill(drawCol); stroke(150); strokeWeight(1); rect(-b.size/2, -b.size/2, b.size, b.size);
    }
    
    rotate(-b.body.angle);
    if (isPlayer) {
      let age = millis() - b.spawnTime;
      let renderText = balls.length < 150 || age < 2000 || b.multiplier >= 2;
      
      if (renderText && (age < 3000 || b.scored)) { 
        noStroke(); textAlign(CENTER); textSize(12);
        fill(0, 150); text(b.name, 1 + 2, -b.size/2 - 9 + 2);
        fill(b.isRainbow ? color(255) : b.color); text(b.name, 1, -b.size/2 - 9); 
      }
      if (b.combo > 0) { 
        noStroke(); textSize(14);
        fill(0, 150); text("x" + b.combo, 1 + 2, -b.size/2 - 23 + 2);
        fill(255, 200, 0); text("x" + b.combo, 1, -b.size/2 - 23); 
      }
    }
    pop();
    
    if (b.combo > 0 && millis() - b.lastHitTime > 2000) b.combo = 0;
    
    if (starship && starship.state === "ACTIVE" && abs(pos.x - starship.body.position.x) < starship.w / 2 + 10 && abs(pos.y - starship.y) < starship.h / 2 + 10) {
      if (millis() - (b.lastShipHit || 0) > 500) {
        b.lastShipHit = millis(); b.combo += 2; b.lastHitTime = millis();
        if (b.name !== "MOTHERSHIP") updateScore(b.name, 100 * b.multiplier, b.color);
        createExplosion(pos.x, pos.y, b.color); playExplosionSound();
        Matter.Body.applyForce(b.body, pos, { x: (pos.x - starship.body.position.x) * 0.0001, y: -0.025 });
        addFloatingText("+" + (100 * b.multiplier), pos.x, pos.y, b.color);
      }
    }
    
    if (boss && boss.state === "ACTIVE" && abs(pos.x - boss.x) < boss.w / 2 + 10 && abs(pos.y - boss.y) < boss.h / 2 + 10) {
      if (millis() - (b.lastBossHit || 0) > 200) {
        b.lastBossHit = millis(); 
        
        if (b.name !== "MOTHERSHIP") {
          let dmg = (50 + b.combo * 10) * b.multiplier; 
          boss.hp -= dmg; 
          boss.hitFlash = 5;
          updateScore(b.name, dmg * 5, b.color);
          addFloatingText("-" + dmg, pos.x, pos.y, color(255, 50, 50), true);
        }
        
        createExplosion(pos.x, pos.y, b.color); playExplosionSound();
        Matter.Body.applyForce(b.body, pos, { x: (pos.x - boss.x) * 0.0002, y: -0.03 });
      }
    }
    
    if (devourer && devourer.state === "ACTIVE" && abs(pos.x - devourer.x) < devourer.w / 2 + 20 && abs(pos.y - devourer.y) < devourer.h / 2 + 20) {
        if (millis() - (b.lastDevHit || 0) > 200) {
            b.lastDevHit = millis(); 
            if (b.name !== "MOTHERSHIP") {
                let dmg = (150 + b.combo * 20) * b.multiplier; 
                devourer.hp -= dmg; 
                devourer.hitFlash = 5;
                updateScore(b.name, dmg * 5, b.color);
                addFloatingText("-" + dmg, pos.x, pos.y, color(200, 0, 255), true);
            }
            createExplosion(pos.x, pos.y, b.color); playExplosionSound();
            Matter.Body.applyForce(b.body, pos, { x: (pos.x - devourer.x) * 0.0003, y: -0.04 });
        }
    }

    if (pos.y < H - 100) {
        for (let j = pegs.length - 1; j >= 0; j--) {
          let p = pegs[j];
          let dx = pos.x - p.position.x;
          let dy = pos.y - p.position.y;
          let colDistSq = p.isBonus ? 400 : 324;
          if (dx * dx + dy * dy < colDistSq) {
            p.glow = 255; b.combo += 1; b.lastHitTime = millis();
            if (p.isBonus) {
              b.combo += 2;
              if (b.name !== "MOTHERSHIP") {
                let pts = 250 * b.multiplier;
                updateScore(b.name, pts, b.color);
                addFloatingText("+" + pts, p.position.x, p.position.y, color(50, 255, 100));
              }
              Matter.Body.applyForce(b.body, pos, Matter.Vector.mult(Matter.Vector.normalise({x: dx, y: dy}), 0.035));
              createExplosion(p.position.x, p.position.y, color(50, 255, 100));
              if (audioStarted) playSpawnSound();
            } else if (p.isExplosive) {
              createExplosion(p.position.x, p.position.y, color(255, 150, 0)); playExplosionSound();
              Matter.Body.applyForce(b.body, pos, Matter.Vector.mult(Matter.Vector.normalise({x: dx, y: dy}), 0.025));
              Matter.World.remove(world, p); pegs.splice(j, 1);
            } else if (p.isRepulsor) {
              b.body.velocity.y = 0;
              Matter.Body.applyForce(b.body, pos, { x: dx * 0.002, y: -0.04 });
              createExplosion(p.position.x, p.position.y, color(255, 50, 200)); playSpawnSound();
            }
          }
        }
    }
    
    let isStuckInPile = pos.y > H - 250 && b.body.isSleeping;
    if ((pos.y > H - ZONE_H - 40 || isStuckInPile) && !b.scored) {
      let czIndex = -1;
      for(let z=0; z<zones.length; z++) {
          if (pos.x >= zones[z].x && pos.x < zones[z].x + zones[z].w) { czIndex = z; break; }
      }
      if (czIndex !== -1) {
        let cz = zones[czIndex];
        b.scored = true; b.scoreTime = millis(); b.zoneIndex = czIndex;
        let fs = cz.score * b.multiplier; 
        if (b.isRainbow) { fs *= 2; b.rainbowExplodeTime = millis() + 2500; }
        
        let isJp = fs >= (5000 * b.multiplier); 
        
        if (b.name !== "MOTHERSHIP") {
            let timeFactor = Math.max(0, (timer + bonusTime - 40));
            let addedTime = (0.2 * b.multiplier) / (1 + (timeFactor / 50));
            
            if (bonusTime > 220) {
                addedTime *= 0.2; 
            }
            
            if (bonusTime + addedTime > 420) {
                addedTime = Math.max(0, 420 - bonusTime);
            }

            bonusTime += addedTime;
            let timeText = addedTime > 0 ? " | +" + addedTime.toFixed(2) + "s" : "";
            addFloatingText("+" + fs.toLocaleString() + timeText, pos.x, pos.y, isJp ? color(255, 215, 0) : color(100, 255, 100), isJp);
            updateScore(b.name, fs, b.color); 
        }
        
        cz.flash = 255; cz.flashColor = b.isRainbow ? color(255, 255, 255) : b.color;
        if (isJp) { shakeAmount = 8; playJackpotSound(); }
      }
    }
    
    if (b.isRainbow && b.rainbowExplodeTime && millis() > b.rainbowExplodeTime) {
      createShockwave(pos.x, pos.y); playExplosionSound(); shakeAmount = 6;
      for (let ex = 0; ex < 10; ex++) explosions.push({ x: pos.x, y: pos.y, vx: random(-3, 3), vy: random(-3, 3), life: 255, col: color(255) });
      for (let ob of balls) {
        if (ob === b) continue;
        let dx = ob.body.position.x - pos.x;
        let dy = ob.body.position.y - pos.y;
        if (dx * dx + dy * dy < 32400) {
          ob.scored = false;
          Matter.Body.applyForce(ob.body, ob.body.position, Matter.Vector.mult(Matter.Vector.normalise({ x: dx, y: dy - 40 }), 0.015));
        }
      }
      b.rainbowExplodeTime = null; removeBall(b); continue;
    }
    
    if (b.scored && b.scoreTime && b.name === "MOTHERSHIP" && millis() - b.scoreTime > 5000) { removeBall(b); continue; }
    if (pos.y > H + 150 || pos.x < -150 || pos.x > W + 150) removeBall(b);
  }
}

function removeBall(b) {
  if (!b) return;
  Matter.World.remove(world, b.body);
  let i = balls.indexOf(b);
  if (i !== -1) balls.splice(i, 1);
}

function updateScore(n, p, c) {
  if (n === "METEOR" || n === "ROCK" || n === "DEBRIS" || n === "COMET" || n === "ASTEROID" || n === "MOTHERSHIP") return;
  if (!leaderboard[n]) leaderboard[n] = { score: 0, color: c };
  leaderboard[n].score += p; checkAllTimeRecords(n, leaderboard[n].score, c);
}

function checkAllTimeRecords(n, s, c) {
  let i = allTimeRecords.findIndex(r => r.name === n);
  if (i !== -1) { if (s > allTimeRecords[i].score) allTimeRecords[i].score = s; } 
  else { allTimeRecords.push({ name: n, score: s, color: [red(c), green(c), blue(c)] }); }
  allTimeRecords.sort((a, b) => b.score - a.score);
  allTimeRecords = allTimeRecords.slice(0, 12);
  localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords));
}

function drawUI() {
  push();
  fill(5, 5, 15, 240); noStroke(); rect(0, 0, W, 70);
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 120); strokeWeight(2); line(0, 70, W, 70);
  
  let lX = 15, lY = 30;
  textAlign(LEFT, CENTER); fill(0, 150); textSize(45); text(GAME_TITLE, lX + 2, lY + 2);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]); text(GAME_TITLE, lX, lY);
  
  textSize(9); fill(0, 150); text(GAME_VERSION, lX + 2, 54 + 2); fill(255); text(GAME_VERSION, lX, 54);
  
  let dW = 360, dX = W / 2 - (dW / 2), p = sin(frameCount * 0.1) * 3;
  fill(currentTheme[0], currentTheme[1], currentTheme[2], 10 + p); rect(dX, 8, dW, 54, 8);
  fill(5, 5, 20, 250); stroke(currentTheme[0], currentTheme[1], currentTheme[2], 120 + p * 10);
  strokeWeight(2); rect(dX, 8, dW, 54, 8);
  
  let lT = new Intl.DateTimeFormat('cs-CZ', { timeStyle: 'medium' }).format(new Date());
  noStroke(); fill(0, 150); textSize(12); text(typeof T !== 'undefined' ? T[currentLang].LIVE + lT : "🔴 LIVE " + lT, dX + 15 + 2, 24 + 2);
  fill(255, 60, 60); text(typeof T !== 'undefined' ? T[currentLang].LIVE + lT : "🔴 LIVE " + lT, dX + 15, 24);
  
  textAlign(RIGHT, CENTER); fill(0, 150); text(typeof T !== 'undefined' ? T[currentLang].SYS_ON : "SYSTEM: ONLINE", dX + dW - 15 + 2, 24 + 2);
  fill(50, 255, 50); text(typeof T !== 'undefined' ? T[currentLang].SYS_ON : "SYSTEM: ONLINE", dX + dW - 15, 24);
  
  textAlign(CENTER, CENTER); fill(0, 150); textSize(10); text(typeof T !== 'undefined' ? T[currentLang].SYNC : "SYNC", dX + dW / 2 + 2, 45 + 2);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]); text(typeof T !== 'undefined' ? T[currentLang].SYNC : "SYNC", dX + dW / 2, 45);
  
  textAlign(RIGHT, CENTER); fill(0, 150); textSize(12); text(typeof T !== 'undefined' ? `${T[currentLang].SECTOR} ${currentDestination}` : currentDestination, W - 15 + 2, 20 + 2);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]); text(typeof T !== 'undefined' ? `${T[currentLang].SECTOR} ${currentDestination}` : currentDestination, W - 15, 20);
  
  let gDisp = floor(map(currentGravity, 0.01, 5.0, 1, 255));
  fill(0, 150); textSize(10); text(typeof T !== 'undefined' ? `${T[currentLang].GFORCE} ${gDisp} [R-${roundCount}]` : `G: ${gDisp}`, W - 15 + 2, 38 + 2);
  fill(200); text(typeof T !== 'undefined' ? `${T[currentLang].GFORCE} ${gDisp} [R-${roundCount}]` : `G: ${gDisp}`, W - 15, 38);
  
  fill(0, 150); text(typeof T !== 'undefined' ? `${T[currentLang].BOUNCEX} ${currentBounce}` : `B: ${currentBounce}`, W - 15 + 2, 56 + 2);
  fill(255, 150, 0); text(typeof T !== 'undefined' ? `${T[currentLang].BOUNCEX} ${currentBounce}` : `B: ${currentBounce}`, W - 15, 56);
  pop();
  
  push(); translate(10, 85);
  let ml = allTimeRecords.slice(0, 12); let lH = 45 + max(1, ml.length) * 26;
  
  fill(0, 0, 15, 245); stroke(currentTheme[0], currentTheme[1], currentTheme[2], 150); strokeWeight(2); rect(0, 0, 240, lH, 8);
  noStroke(); textAlign(CENTER); textSize(12); fill(0, 150); text(typeof T !== 'undefined' ? T[currentLang].REC : "RECORDS", 122, 27);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]); text(typeof T !== 'undefined' ? T[currentLang].REC : "RECORDS", 120, 25);
  stroke(255, 30); strokeWeight(1); line(10, 40, 230, 40);
  
  noStroke(); textAlign(LEFT);
  ml.forEach((r, i) => {
    let y = 65 + i * 26; let txt = `${i === 0 ? '👑 ' : ''}${i + 1}. ${r.name}`;
    if (userAvatars[r.name]) {
      push(); imageMode(CENTER); tint(255); drawingContext.save(); drawingContext.beginPath();
      drawingContext.arc(245, y - 2, 16, 0, TWO_PI); drawingContext.clip();
      image(userAvatars[r.name], 245, y - 2, 32, 32); drawingContext.restore(); pop();
      drawTxt(txt, 15, y, color(r.color[0], r.color[1], r.color[2]), i < 3 ? 10 : 9, LEFT);
      drawTxt(r.score.toLocaleString(), 220, y, color(255), i < 3 ? 10 : 9, RIGHT);
    } else {
      drawTxt(txt, 15, y, color(r.color[0], r.color[1], r.color[2]), i < 3 ? 10 : 9, LEFT);
      drawTxt(r.score.toLocaleString(), 225, y, color(255), i < 3 ? 10 : 9, RIGHT);
    }
  });
  
  translate(0, lH + 15);
  fill(0, 0, 15, 245); stroke(currentTheme[0], currentTheme[1], currentTheme[2], 150); strokeWeight(2); rect(0, 0, 240, 60, 8);
  noStroke(); textSize(11);
  
  if (gameState === "PLAYING") {
    textAlign(LEFT, CENTER); fill(0, 150); text(typeof T !== 'undefined' ? `${T[currentLang].WARP_CORE} ${timer}s` : `TIME: ${timer}s`, 15 + 2, 20 + 2);
    fill(timer < 10 ? color(255, 50, 50) : color(currentTheme[0], currentTheme[1], currentTheme[2])); 
    text(typeof T !== 'undefined' ? `${T[currentLang].WARP_CORE} ${timer}s` : `TIME: ${timer}s`, 15, 20);
    
    if (bonusTime > 0) {
      let tW = textWidth(typeof T !== 'undefined' ? `${T[currentLang].WARP_CORE} ${timer}s ` : `TIME: ${timer}s `);
      fill(0, 150); text(`[+${bonusTime.toFixed(1)}s]`, 15 + tW + 2, 20 + 2);
      fill(50, 255, 50); text(`[+${bonusTime.toFixed(1)}s]`, 15 + tW, 20);
    }
    
    fill(0, 150); text(typeof T !== 'undefined' ? `${T[currentLang].ACT_UNITS} ${roundTotalBalls}` : `UNITS: ${roundTotalBalls}`, 15 + 2, 40 + 2);
    fill(50, 255, 50); text(typeof T !== 'undefined' ? `${T[currentLang].ACT_UNITS} ${roundTotalBalls}` : `UNITS: ${roundTotalBalls}`, 15, 40);
  } else {
    textAlign(LEFT, CENTER); fill(0, 150); text(typeof T !== 'undefined' ? T[currentLang].COOL : "COOLING DOWN", 15 + 2, 20 + 2);
    fill(255, 200, 0); text(typeof T !== 'undefined' ? T[currentLang].COOL : "COOLING DOWN", 15, 20);
    fill(0, 150); text(typeof T !== 'undefined' ? `${T[currentLang].TOT_UNITS} ${roundTotalBalls}` : `UNITS: ${roundTotalBalls}`, 15 + 2, 40 + 2);
    fill(50, 255, 50); text(typeof T !== 'undefined' ? `${T[currentLang].TOT_UNITS} ${roundTotalBalls}` : `UNITS: ${roundTotalBalls}`, 15, 40);
  }
  pop();
  
  push(); translate(W - 250, 85);
  let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 25);
  let rH = 45 + max(1, sorted.length) * 22;
  
  fill(0, 0, 15, 245); stroke(currentTheme[0], currentTheme[1], currentTheme[2], 150); strokeWeight(2); rect(0, 0, 240, rH, 8);
  noStroke(); fill(0, 150); textAlign(CENTER); textSize(12); text(typeof T !== 'undefined' ? T[currentLang].TOP : "TOP", 122, 27);
  fill(currentTheme[0], currentTheme[1], currentTheme[2]); text(typeof T !== 'undefined' ? T[currentLang].TOP : "TOP", 120, 25);
  stroke(255, 30); strokeWeight(1); line(10, 40, 230, 40);
  
  noStroke(); textAlign(LEFT);
  sorted.forEach((e, i) => {
    let y = 65 + i * 22; let txt = `${i === 0 ? '👑 ' : ''}${nf(i + 1, 2)}. ${e[0]}`;
    if (userAvatars[e[0]]) {
      push(); imageMode(CENTER); tint(255); drawingContext.save(); drawingContext.beginPath();
      drawingContext.arc(-5, y - 2, 16, 0, TWO_PI); drawingContext.clip();
      image(userAvatars[e[0]], -5, y - 2, 32, 32); drawingContext.restore(); pop();
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
    if (z.flash > 0) { fill(z.flashColor); z.flash -= 10; } else fill(z.baseColor);
    noStroke(); rect(z.x, H - ZONE_H, z.w, ZONE_H);
    push(); translate(z.x + z.w / 2, H - 30); rotate(-HALF_PI);
    drawTxt(z.score.toLocaleString(), 0, 0, z.score >= 5000 ? color(255, 230, 100) : color(255), z.score >= 5000 ? 18 : (z.w < 30 ? 10 : 15), CENTER);
    pop();
  }
}

function drawWaitingMessage() {
  let a = map(sin(frameCount * 0.15), -1, 1, 100, 255);
  drawTxt(typeof T !== 'undefined' ? T[currentLang].WARN : "WARNING", W / 2, H / 2 - 50, color(255, 50, 50, a), 30, CENTER);
  drawTxt(typeof T !== 'undefined' ? T[currentLang].RET : "RETURNING", W / 2, H / 2, color(255, 200, 0, a), 14, CENTER);
}

function drawResultsOverlay() {
  fill(0, 0, 20, 230); rect(20, 50, W - 40, H - 100, 20);
  drawingContext.shadowBlur = 20; drawingContext.shadowColor = color(currentTheme[0], currentTheme[1], currentTheme[2]);
  stroke(currentTheme[0], currentTheme[1], currentTheme[2], 255); strokeWeight(4); fill(10, 10, 30, 240);
  rect(40, 80, W - 80, H - 160, 15); drawingContext.shadowBlur = 0;
  
  drawTxt(typeof T !== 'undefined' ? T[currentLang].COMPL : "COMPLETE", W / 2, 160, color(currentTheme), 50, CENTER);
  drawTxt(typeof T !== 'undefined' ? `${T[currentLang].SECTOR} ${currentDestination}` : currentDestination, W / 2, 210, color(255, 215, 0), 22, CENTER);
  
  let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 5);
  for (let i = 0; i < sorted.length; i++) {
    let entry = sorted[i]; let yPos = 320 + i * 90;
    fill(i % 2 === 0 ? color(255, 255, 255, 20) : color(255, 255, 255, 5));
    noStroke(); rect(80, yPos - 45, W - 160, 80, 10);
    
    let txt = `${i === 0 ? "👑 " : i + 1 + ". "}${entry[0]}`;
    if (userAvatars[entry[0]]) {
      push(); imageMode(CENTER); tint(255); drawingContext.save(); drawingContext.beginPath();
      drawingContext.arc(100, yPos - 5, 30, 0, TWO_PI); drawingContext.clip();
      image(userAvatars[entry[0]], 100, yPos - 5, 60, 60); drawingContext.restore(); pop();
      drawTxt(txt, 145, yPos - 5, color(entry[1].color), i === 0 ? 35 : 25, LEFT);
    } else {
      drawTxt(txt, 100, yPos - 5, color(entry[1].color), i === 0 ? 35 : 25, LEFT);
    }
    drawTxt(entry[1].score.toLocaleString(), W - 100, yPos - 5, color(255), i === 0 ? 45 : 38, RIGHT);
  }
  drawTxt(typeof T !== 'undefined' ? `${T[currentLang].NEXT} ${resultsTimer}s` : `NEXT: ${resultsTimer}s`, W / 2, H - 120, color(255, 50, 50), 24, CENTER);
}

function planBossForRound() {
  bossPlanned = (random(100) < currentShipChance); bossSpawnAt = bossPlanned ? floor(random(15, timer - 15)) : -1;
}

function spawnBoss() {
  if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_B_ENT, 2);
  let w = 240, h = 80, startY = -150;
  let b = Matter.Bodies.rectangle(W/2, startY, w, h, { isStatic: true, restitution: 1.2, friction: 0 });
  Matter.World.add(world, b);
  boss = { body: b, w: w, h: h, x: W/2, y: startY, targetX: W/2, targetY: 200, maxHp: 10000, hp: 10000, state: "ENTERING", activeFrames: 0, hitFlash: 0 };
  shakeAmount = 20; flashEffect = 30;
}

function handleBoss() {
  if (!boss) return;
  boss.activeFrames++; let pos = boss.body.position; boss.x = pos.x; boss.y = pos.y;
  
  if (boss.state === "ENTERING") {
    let dy = boss.targetY - boss.y; Matter.Body.setPosition(boss.body, { x: boss.x, y: boss.y + dy * 0.05 });
    if (abs(dy) < 2) boss.state = "ACTIVE";
  } else if (boss.state === "ACTIVE") {
    
    if (frameCount % 90 === 0) { 
        boss.targetX = random(100, W - 100); 
        boss.targetY = random(100, H - 250); 
    }
    
    let closestBallDist = Infinity;
    let closestBall = null;
    for (let b of balls) {
       if (b.body.position.y < boss.y && b.body.velocity.y > 0 && abs(b.body.position.x - boss.x) < boss.w) {
           let distY = boss.y - b.body.position.y;
           if (distY < 300 && distY < closestBallDist) {
               closestBallDist = distY;
               closestBall = b;
           }
       }
    }
    
    if (closestBall) {
       if (closestBall.body.position.x > boss.x) {
           boss.targetX -= 15;
       } else {
           boss.targetX += 15;
       }
       boss.targetX = constrain(boss.targetX, 100, W - 100);
    }
    
    boss.x = lerp(boss.x, boss.targetX, 0.04); 
    boss.y = lerp(boss.y, boss.targetY, 0.03);
    Matter.Body.setPosition(boss.body, { x: boss.x, y: boss.y });
    
    if (boss.hp <= 0) {
      boss.state = "DEFEATED"; if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_B_DEF, 2); shakeAmount = 30; playJackpotSound();
      for(let player in leaderboard) {
        updateScore(player, 20000, leaderboard[player].color);
        addFloatingText(typeof T !== 'undefined' ? "+20000" + T[currentLang].SLAY : "+20000", W/2 + random(-150, 150), boss.y + random(-50, 50), color(255, 215, 0), true);
      }
      Matter.World.remove(world, boss.body);
    }
  } else if (boss.state === "DEFEATED") {
    if (boss.activeFrames % 5 === 0) { createExplosion(boss.x + random(-120, 120), boss.y + random(-60, 60), color(255, 100, 255)); playExplosionSound(); }
    if (boss.activeFrames > 120) boss = null;
    return;
  }
  
  push(); translate(boss.x, boss.y);
  if (boss.hitFlash > 0) { boss.hitFlash--; drawingContext.shadowBlur = 40; drawingContext.shadowColor = color(255); }
  else { drawingContext.shadowBlur = 20; drawingContext.shadowColor = color(100, 0, 255); }
  
  let wave = sin(frameCount * 0.1) * 20;
  fill(20, 5, 40); stroke(150, 50, 255); strokeWeight(3);
  
  beginShape();
  vertex(-boss.w/3, 0);
  quadraticVertex(-boss.w/1.5, -50 + wave, -boss.w/2 - 40, 40 + wave);
  quadraticVertex(-boss.w/2, 20, -boss.w/3, 20);
  endShape();
  
  beginShape();
  vertex(boss.w/3, 0);
  quadraticVertex(boss.w/1.5, -50 - wave, boss.w/2 + 40, 40 - wave);
  quadraticVertex(boss.w/2, 20, boss.w/3, 20);
  endShape();

  fill(30, 10, 50); stroke(200, 80, 255); strokeWeight(4);
  ellipse(0, 0, boss.w * 0.8, boss.h);
  
  fill(150, 50, 255, 150); noStroke();
  ellipse(0, 0, boss.w * 0.5, boss.h * 0.6);
  
  fill(255, 50, 50);
  let eyeSize = 40 + sin(frameCount * 0.2) * 15;
  ellipse(0, 0, eyeSize, eyeSize * 0.5);
  fill(255, 255, 0);
  ellipse(0, 0, 10, eyeSize * 0.8);
  
  fill(0, 255, 255);
  ellipse(-boss.w * 0.25, 0, 15, 15);
  ellipse(boss.w * 0.25, 0, 15, 15);
  pop();
  
  let barW = 400, barH = 20, barX = W/2 - barW/2, barY = 90;
  push(); fill(0, 150); noStroke(); rect(barX, barY, barW, barH, 5);
  fill(255, 50, 50); rect(barX, barY, barW * (max(0, boss.hp) / boss.maxHp), barH, 5);
  drawTxt(typeof T !== 'undefined' ? T[currentLang].LEVI : "BOSS HP", W/2, barY + 10, color(255), 10, CENTER);
  pop();
}

function spawnDevourer() {
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_DEV_ENT, 2);
    let w = 300, h = 100, y = H - ZONE_H - 120;
    let b = Matter.Bodies.rectangle(W/2, y, w, h, { isStatic: true, restitution: 0.2, friction: 0.5 });
    Matter.World.add(world, b);
    
    let bossHp = 50000 + (roundTotalBalls * 50);
    devourer = { body: b, w: w, h: h, x: W/2, y: y, maxHp: bossHp, hp: bossHp, timer: 60 * targetFPS, state: "ACTIVE", hitFlash: 0 };
    shakeAmount = 25; flashEffect = 40;
}

function handleDevourer() {
    if (!devourer) return;
    let pos = devourer.body.position;
    devourer.x = pos.x;
    devourer.y = pos.y;
    
    if (devourer.state === "ACTIVE") {
        devourer.timer--;
        
        Matter.Body.setPosition(devourer.body, { x: W/2 + sin(frameCount * 0.05) * 50, y: (H - ZONE_H - 120) + sin(frameCount * 0.1) * 20 });
        
        if (devourer.hp <= 0) {
            devourer.state = "DEFEATED";
            if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_DEV_DEF, 2);
            shakeAmount = 40; playJackpotSound();
            triggerMeteorShower();
            for(let player in leaderboard) {
                updateScore(player, 50000, leaderboard[player].color);
            }
            Matter.World.remove(world, devourer.body);
        } else if (devourer.timer <= 0) {
            devourer.state = "FAILED";
            if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_DEV_FAIL, 2);
            shakeAmount = 50; flashEffect = 100; playExplosionSound();
            
            timer = Math.floor(timer / 2);
            bonusTime = bonusTime / 2;
            let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 10);
            for(let i=0; i<sorted.length; i++) {
                leaderboard[sorted[i][0]].score = Math.floor(leaderboard[sorted[i][0]].score * 0.8);
            }
            Matter.World.remove(world, devourer.body);
        }
    } else if (devourer.state === "DEFEATED" || devourer.state === "FAILED") {
        createExplosion(devourer.x + random(-150, 150), devourer.y + random(-50, 50), color(200, 0, 255));
        if (frameCount % 5 === 0) devourer = null; 
        return;
    }

    push(); translate(devourer.x, devourer.y);
    if (devourer.hitFlash > 0) { devourer.hitFlash--; drawingContext.shadowBlur = 40; drawingContext.shadowColor = color(255); }
    else { drawingContext.shadowBlur = 30; drawingContext.shadowColor = color(0, 0, 0); }
    
    fill(10, 0, 20); stroke(150, 0, 255); strokeWeight(4);
    ellipse(0, 0, devourer.w, devourer.h);
    
    let pulse = sin(frameCount * 0.2) * 10;
    fill(0); noStroke();
    ellipse(0, 0, devourer.w * 0.8 + pulse, devourer.h * 0.6 + pulse);
    
    fill(255, 0, 0);
    for(let i=0; i<5; i++) {
        ellipse(random(-50, 50), random(-10, 10), 8, 8);
    }
    
    pop();
    
    let barW = 400, barH = 15, barX = W/2 - barW/2, barY = H - ZONE_H - 180;
    push(); fill(0, 150); noStroke(); rect(barX, barY, barW, barH, 5);
    fill(150, 0, 255); rect(barX, barY, barW * (max(0, devourer.hp) / devourer.maxHp), barH, 5);
    drawTxt(typeof T !== 'undefined' ? T[currentLang].DEVOURER : "TIME DEVOURER", W/2, barY - 10, color(255), 10, CENTER);
    drawTxt(Math.ceil(devourer.timer / targetFPS) + "s", W/2, barY + 7, color(255), 10, CENTER);
    pop();
}

function drawAnomalyRoulette() {
    push();
    fill(0, 0, 10, 220); 
    rect(-W, -H, W*3, H*3);
    
    translate(W/2, H/2);
    
    let t = anomalyTimer; 
    let p = map(t, 300, 60, 0, 1); 
    p = constrain(p, 0, 1);
    let easeOut = 1 - Math.pow(1 - p, 4); 

    let targetAngleG = map(anomG, 1, 255, 0, TWO_PI);
    let targetAngleB = map(anomB, 1, 255, 0, TWO_PI);

    let spinsG = 15; 
    let spinsB = 22; 

    let currentAngleG = (targetAngleG - spinsG * TWO_PI) + (spinsG * TWO_PI) * easeOut;
    let currentAngleB = (targetAngleB - spinsB * TWO_PI) + (spinsB * TWO_PI) * easeOut;

    let normG = currentAngleG % TWO_PI;
    if (normG < 0) normG += TWO_PI;
    let currentValG = constrain(round(map(normG, 0, TWO_PI, 1, 255)), 1, 255);

    let normB = currentAngleB % TWO_PI;
    if (normB < 0) normB += TWO_PI;
    let currentValB = constrain(round(map(normB, 0, TWO_PI, 1, 255)), 1, 255);

    if (t <= 60) {
        currentAngleG = targetAngleG;
        currentAngleB = targetAngleB;
        currentValG = anomG;
        currentValB = anomB;
    } else if (frameCount % 4 === 0 && audioStarted) {
        try { fxSynth.play(random(600, 900), 0.02, 0, 0.05); } catch(e){}
    }

    push();
    rotate(frameCount * 0.01);
    stroke(0, 150, 255, 80);
    strokeWeight(2);
    noFill();
    ellipse(0, 0, 390, 390);
    for(let i=0; i<36; i++) {
        line(0, -195, 0, -205);
        rotate(TWO_PI/36);
    }
    pop();

    push();
    rotate(-HALF_PI); 
    
    textAlign(CENTER, CENTER);
    for(let i = 1; i <= 255; i++) {
        let isMajor = (i === 1 || i % 25 === 0 || i === 255);
        let isMid = (i % 5 === 0);
        
        if (isMajor || isMid) {
            let ang = map(i, 1, 255, 0, TWO_PI);
            let rInner = isMajor ? 140 : 150;
            let rOuter = 160;
            
            stroke(isMajor ? color(255) : color(0, 255, 255, 120));
            strokeWeight(isMajor ? 2 : 1);
            line(cos(ang)*rInner, sin(ang)*rInner, cos(ang)*rOuter, sin(ang)*rOuter);
            
            if (isMajor) {
                noStroke();
                fill(200, 255, 255);
                let rText = 175;
                textSize(10);
                push();
                translate(cos(ang)*rText, sin(ang)*rText);
                rotate(ang + HALF_PI);
                text(i, 0, 0);
                pop();
            }
        }
    }
    
    push();
    rotate(currentAngleG);
    stroke(255, 50, 50);
    strokeWeight(3);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 50, 50);
    line(0, 0, 135, 0);
    fill(255, 50, 50);
    noStroke();
    triangle(135, -6, 135, 6, 150, 0);
    pop();

    push();
    rotate(currentAngleB);
    stroke(50, 255, 50);
    strokeWeight(3);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(50, 255, 50);
    line(0, 0, 115, 0);
    fill(50, 255, 50);
    noStroke();
    triangle(115, -6, 115, 6, 130, 0);
    pop();
    
    pop(); 

    fill(10, 10, 30, 230);
    stroke(0, 255, 255, 100);
    strokeWeight(2);
    ellipse(0, 0, 140, 140);
    
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    
    textSize(12);
    fill(255, 100, 100);
    text(typeof T !== 'undefined' ? T[currentLang].GRAV : "GRAVITY", 0, -45);
    textSize(24);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(255, 50, 50);
    text(currentValG, 0, -25);
    
    textSize(12);
    fill(100, 255, 100);
    drawingContext.shadowBlur = 0;
    text(typeof T !== 'undefined' ? T[currentLang].BOUNCE : "BOUNCE", 0, 15);
    textSize(24);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(50, 255, 50);
    text(currentValB, 0, 35);
    drawingContext.shadowBlur = 0;
    
    textSize(26);
    fill(255, 200, 0, 150 + sin(frameCount * 0.2) * 100);
    text(typeof T !== 'undefined' ? T[currentLang].ANOMALY : "ANOMALY", 0, -230);
    pop();
}

function triggerAnomaly() {
    anomalyState = 1;
    anomalyTimer = 300;
    nextAnomalyTime += 60;
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].ANOMALY, 2);
    anomG = floor(random() < 0.8 ? random(50, 255) : random(1, 50));
    anomB = floor(random() < 0.8 ? random(50, 255) : random(1, 50));
    anomalyAngle = 0;
}

function applyAnomaly() {
    currentGravity = map(anomG, 1, 255, 0.01, 5.0);
    currentBounce = anomB;
    gravitySlider.value(currentGravity);
    bounceSlider.value(currentBounce);
    if (world) world.gravity.y = currentGravity;
    shakeAmount = 30;
    flashEffect = 80;
    playJackpotSound();
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].PHYS_ALT, 2);
}

function spawnStarbugObj() {
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_STARBUG_ENT, 1);
    starbugObj = { x: -100, y: random(150, H/2 - 100), speed: 3, activeFrames: 0 };
}

function handleStarbugObj() {
    if (!starbugObj) return;
    starbugObj.x += starbugObj.speed;
    starbugObj.activeFrames++;

    push();
    translate(starbugObj.x, starbugObj.y);
    let s = 50;
    noStroke();
    fill(50, 200, 50); ellipse(s*0.3, 0, s*0.6, s*0.4); 
    ellipse(-s*0.1, 0, s*0.8, s*0.6); 
    ellipse(-s*0.6, 0, s*0.4, s*0.5);
    fill(150, 255, 255, 150); ellipse(s*0.4, -s*0.05, s*0.2, s*0.1);
    
    fill(255, 150, 0, 150 + sin(frameCount * 0.5) * 100);
    ellipse(-s*0.85, 0, s*0.3, s*0.2);
    pop();

    if (starbugObj.activeFrames % 20 === 0 && random() < 0.7 && starbugObj.x > 100 && starbugObj.x < W - 100) {
        let py = starbugObj.y + random(80, 300);
        let valid = true;
        for (let pg of pegs) {
            if (dist(starbugObj.x, py, pg.position.x, pg.position.y) < 35) { valid = false; break; }
        }
        if (valid) {
            let pg = Matter.Bodies.circle(starbugObj.x, py, 6, { isStatic: true, restitution: map(currentBounce, 1, 255, 0.1, 2.0), collisionFilter: { category: 2 } });
            pg.isBonus = true;
            pg.glow = 255;
            pegs.push(pg);
            Matter.World.add(world, pg);
            createExplosion(starbugObj.x, starbugObj.y + 10, color(50, 255, 50));
            if (audioStarted) { try { fxSynth.play(800, 0.05, 0, 0.1); } catch(e){} }
        }
    }

    if (starbugObj.x > W + 150) starbugObj = null;
}

function planSpaceshipForRound() {
  shipPlanned = (random(100) < currentShipChance); shipSpawnAt = shipPlanned ? floor(random(10, timer - 10)) : -1;
}

function spawnSpaceship() {
  let w = 160, h = 30, y = H - ZONE_H - 150;
  let b = Matter.Bodies.rectangle(-200, y, w, h, { isStatic: true, restitution: 1.5, friction: 0 });
  Matter.World.add(world, b);
  starship = { body: b, w: w, h: h, y: y, targetX: W / 2, speed: 8, activeFrames: 0, maxFrames: 1500, state: "ENTERING" };
  if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_DEF, 1);
}

function handleSpaceship() {
  if (!starship) return;
  starship.activeFrames++;
  
  if (frameCount % 5 === 0 && starship.state === "ACTIVE") {
    let tgt = null, maxY = 0;
    for (let b of balls) {
      if (b.body.position.y > maxY && b.body.position.y < starship.y - 10 && b.body.velocity.y > 0) { maxY = b.body.position.y; tgt = b; }
    }
    starship.targetX = tgt ? tgt.body.position.x : W / 2 + sin(frameCount * 0.02) * 200;
  }
  
  if (starship.state === "ENTERING") {
    starship.targetX = W / 2; if (abs(starship.body.position.x - W / 2) < 20) starship.state = "ACTIVE";
  } else if (starship.state === "ACTIVE" && starship.activeFrames > starship.maxFrames) {
    starship.state = "LEAVING";
  } else if (starship.state === "LEAVING") {
    starship.targetX = W + 300;
    if (starship.body.position.x > W + 150) { Matter.World.remove(world, starship.body); starship = null; return; }
  }
  
  let dx = starship.targetX - starship.body.position.x;
  Matter.Body.setPosition(starship.body, { x: starship.body.position.x + (abs(dx) > starship.speed ? (dx > 0 ? starship.speed : -starship.speed) : 0), y: starship.y });
  
  push(); translate(starship.body.position.x, starship.y); noStroke();
  fill(0, 255, 255, random(150, 255)); ellipse(0, starship.h / 2 + 5, starship.w * 0.6, 25);
  fill(255); ellipse(0, starship.h / 2 + 5, starship.w * 0.2, 10);
  fill(80); ellipse(0, 0, starship.w, starship.h * 1.2);
  fill(120); ellipse(0, -starship.h * 0.2, starship.w * 0.8, starship.h * 0.8);
  fill(40); ellipse(0, starship.h * 0.2, starship.w * 0.7, starship.h * 0.6);
  fill(0, 200, 255, 120); arc(0, -starship.h * 0.2, starship.w * 0.5, starship.h * 2, PI, 0);
  fill(50, 255, 50); ellipse(0, -starship.h * 0.6, 15, 20);
  fill(0); ellipse(-4, -starship.h * 0.65, 5, 8); ellipse(4, -starship.h * 0.65, 5, 8);
  for (let l = 0; l < 5; l++) {
    fill((frameCount + l * 10) % 20 < 10 ? color(255, 50, 50) : color(50, 255, 50));
    ellipse(map(l, 0, 4, -starship.w / 2.2, starship.w / 2.2), 0, 6);
  }
  pop();
}

function onUserJoin(u, img) {
  let isNew = !viewerSpaceObjects.find(o => o.name === u);
  if (img && !userAvatars[u]) {
    loadImage(img, l => {
      userAvatars[u] = l;
      if (isNew) {
        viewerSpaceObjects.push({ name: u, x: random(100, W - 100), y: random(150, H - 300), vx: random(-0.3, 0.3), vy: random(-0.3, 0.3), baseSize: 60, extraSize: 0, color: [random(100, 255), random(100, 255), random(255)], img: l, angle: random(TWO_PI), lastActiveTime: millis(), alpha: 255 });
        joinPopupQueue.push({ name: u, img: l });
      }
    }, () => {});
  } else if (isNew) {
    viewerSpaceObjects.push({ name: u, x: random(100, W - 100), y: random(150, H - 300), vx: random(-0.3, 0.3), vy: random(-0.3, 0.3), baseSize: 60, extraSize: 0, color: [random(100, 255), random(100, 255), random(255)], img: userAvatars[u] || null, angle: random(TWO_PI), lastActiveTime: millis(), alpha: 255 });
    joinPopupQueue.push({ name: u, img: userAvatars[u] || null });
  }
}

function updateUserLikes(u, c) {
  let o = viewerSpaceObjects.find(ob => ob.name === u);
  if (o) { o.extraSize = min(150, o.extraSize + c * 2); o.lastActiveTime = millis(); o.alpha = 255; } 
  else { onUserJoin(u, null); setTimeout(() => updateUserLikes(u, c), 500); }
}

function onUserQuit(username) { viewerSpaceObjects = viewerSpaceObjects.filter(o => o.name !== username); }

function triggerFollowEvent(name, silent = false) {
  let s = floor(random(3)), sx, sy;
  if (s === 0) { sx = random(100, W - 100); sy = -50; } 
  else if (s === 1) { sx = W + 50; sy = random(100, H / 3); } 
  else { sx = -50; sy = random(100, H / 3); }
  
  let tx = W / 2 + random(-200, 200), ty = H / 2 + random(-250, 50), a = atan2(ty - sy, tx - sx), sp = random(18, 28);
  followEvents.push({ name: name, x: sx, y: sy, vx: cos(a) * sp, vy: sin(a) * sp, targetX: tx, targetY: ty, color: color(random(150, 255), random(100, 255), random(150, 255)), exploded: false, timer: 100, trail: [] });
  if (!silent && random() < 0.3 && typeof T !== 'undefined') { speakAnnouncer(T[currentLang].TTS_INC, 0); speakName(name); }
}

function handleFollowEvents() {
  for (let i = followEvents.length - 1; i >= 0; i--) {
    let f = followEvents[i];
    if (!f.exploded) {
      f.trail.push({ x: f.x, y: f.y }); if (f.trail.length > 15) f.trail.shift();
      noStroke();
      for (let t = 0; t < f.trail.length; t++) {
        fill(red(f.color), green(f.color), blue(f.color), map(t, 0, f.trail.length, 0, 150));
        ellipse(f.trail[t].x, f.trail[t].y, map(t, 0, f.trail.length, 5, 25));
      }
      fill(255); ellipse(f.x, f.y, 25); fill(f.color); ellipse(f.x, f.y, 18);
      f.x += f.vx; f.y += f.vy;
      if (dist(f.x, f.y, f.targetX, f.targetY) < 30) {
        f.exploded = true; playExplosionSound(); shakeAmount = 5;
        for (let e = 0; e < 50; e++) explosions.push({ x: f.x, y: f.y, vx: random(-12, 12), vy: random(-12, 12), life: 255, col: f.color });
      }
    } else {
      push(); translate(f.targetX, f.targetY); scale(map(f.timer, 100, 0, 1, 4.5)); textAlign(CENTER, CENTER);
      drawingContext.shadowBlur = 20; drawingContext.shadowColor = f.color;
      fill(0, 150); text(f.name, 2, 2); fill(255, map(f.timer, 100, 0, 300, -50)); text(f.name, 0, 0);
      drawingContext.shadowBlur = 0;
      if (f.timer % 4 === 0) { noStroke(); fill(f.color); ellipse(random(-40, 40), random(-40, 40), random(2, 5)); }
      pop();
      f.timer--; if (f.timer <= 0) followEvents.splice(i, 1);
    }
  }
}

function handleJoinPopups() {
  if (!activeJoinPopup && joinPopupQueue.length > 0) {
    activeJoinPopup = joinPopupQueue.shift(); activeJoinPopup.timer = 180;
    if (audioStarted && millis() - lastExpSnd > 50) { try { fxSynth.play(random([800, 1000, 1200]), 0.1, 0, 0.5); } catch(e) {} lastExpSnd = millis(); }
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_WELC + sanitizeText(activeJoinPopup.name), 2);
  }
  
  if (activeJoinPopup) {
    let p = activeJoinPopup; p.timer--; let progress = p.timer / 180, sc = 1;
    if (progress > 0.9) sc = map(progress, 1, 0.9, 0, 1);
    if (progress < 0.1) sc = map(progress, 0.1, 0, 1, 0);
    
    push(); translate(W / 2, H / 2 - 80); scale(sc); let pulse = sin(frameCount * 0.2) * 15;
    drawingContext.shadowBlur = 30 + pulse; drawingContext.shadowColor = color(currentTheme[0], currentTheme[1], currentTheme[2]);
    fill(10, 10, 30, 240); stroke(currentTheme[0], currentTheme[1], currentTheme[2]); strokeWeight(4);
    rectMode(CENTER); rect(0, 0, 500 + pulse, 120 + pulse, 15); rectMode(CORNER); drawingContext.shadowBlur = 0;
    
    if (p.img) { imageMode(CENTER); image(p.img, -180, 0, 80, 80); } 
    else {
      fill(100); noStroke(); ellipse(-180, 0, 80, 80); fill(0, 150); textAlign(CENTER, CENTER); textSize(30);
      text(p.name[0], -180 + 2, 2); fill(255); text(p.name[0], -180, 0);
    }
    
    textAlign(LEFT, CENTER); noStroke(); textSize(16); fill(0, 150); text(typeof T !== 'undefined' ? T[currentLang].NEW_C : "NEW COMMANDER", -120 + 2, -25 + 2);
    fill(currentTheme[0], currentTheme[1], currentTheme[2]); text(typeof T !== 'undefined' ? T[currentLang].NEW_C : "NEW COMMANDER", -120, -25);
    textSize(35); fill(0, 150); text(p.name, -120 + 2, 15 + 2); fill(255); text(p.name, -120, 15);
    pop();
    if (p.timer <= 0) activeJoinPopup = null;
  }
}

function addFloatingText(txt, x, y, col, isJackpot = false) {
  floatingTexts.push({ text: txt, x: x, y: y, life: 255, color: col, scale: isJackpot ? 1.5 : 1, vy: isJackpot ? -2 : -1 });
}

function handleFloatingTexts() {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    let ft = floatingTexts[i];
    push(); translate(ft.x, ft.y); drawTxt(ft.text, 0, 0, color(red(ft.color), green(ft.color), blue(ft.color), ft.life), 14 * ft.scale, CENTER); pop();
    ft.y += ft.vy; ft.life -= 4; if (ft.life <= 0) floatingTexts.splice(i, 1);
  }
}

function createShockwave(x, y) { shockwaves.push({ x: x, y: y, radius: 0, maxRadius: 300, life: 255 }); }

function handleShockwaves() {
  noFill(); strokeWeight(4);
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    let sw = shockwaves[i]; stroke(255, 255, 255, sw.life); ellipse(sw.x, sw.y, sw.radius * 2);
    sw.radius += 10; sw.life -= 8; if (sw.life <= 0) shockwaves.splice(i, 1);
  }
}

function drawPortals() {
  if (portals.length < 2) return;
  for (let i = 0; i < portals.length; i++) {
    let pt = portals[i];
    push(); 
    let wobbleX = sin(frameCount * 0.2 + i * 10) * 3;
    let wobbleY = cos(frameCount * 0.15 + i * 10) * 3;
    translate(pt.x + wobbleX, pt.y + wobbleY); 
    rotate(frameCount * 0.05 * (i === 0 ? 1 : -1));
    
    let baseCol = i === 0 ? color(0, 150, 255) : color(255, 150, 0);
    let pulse = sin(frameCount * 0.1) * 15;
    
    noStroke();
    for(let j = 4; j > 0; j--) {
      fill(red(baseCol), green(baseCol), blue(baseCol), 40);
      ellipse(0, 0, 70 + pulse + j * 15);
    }
    
    fill(red(baseCol), green(baseCol), blue(baseCol), 200); 
    ellipse(0, 0, 50 + pulse * 0.5);
    fill(0); 
    ellipse(0, 0, 30); 
    pop();
  }
}

function drawViewerObjects() {
  for (let i = viewerSpaceObjects.length - 1; i >= 0; i--) {
    let o = viewerSpaceObjects[i], ia = millis() - o.lastActiveTime;
    if (ia > 60000) { viewerSpaceObjects.splice(i, 1); continue; }
    o.alpha = ia > 50000 ? map(ia, 50000, 60000, 255, 0) : 255;
  }
  for (let o of viewerSpaceObjects) {
    o.x += o.vx + sin(frameCount * 0.01) * 0.1; o.y += o.vy + cos(frameCount * 0.01) * 0.1; o.angle += 0.005;
    if (o.x < 50 || o.x > W - 50) o.vx *= -1; if (o.y < 100 || o.y > H - 250) o.vy *= -1;
    push(); translate(o.x, o.y); rotate(o.angle);
    let tS = o.baseSize + o.extraSize; noStroke(); fill(o.color[0], o.color[1], o.color[2], 40 * (o.alpha / 255)); ellipse(0, 0, tS + 20);
    if (o.img) { imageMode(CENTER); tint(255, o.alpha); image(o.img, 0, 0, tS, tS); } 
    else { fill(o.color[0], o.color[1], o.color[2], o.alpha); ellipse(0, 0, tS); drawTxt(o.name[0], 0, 0, color(255, o.alpha), tS * 0.3, CENTER); }
    rotate(-o.angle); drawTxt(o.name, 0, tS / 2 + 15, color(255, o.alpha), 10, CENTER); pop();
  }
}

function drawWalls() { stroke(100); strokeWeight(2); for (let w of walls) line(w.position.x, H - ZONE_H, w.position.x, H); }

function createExplosion(x, y, c) {
  let col = c || color(255, random(100, 255), 0);
  for (let i = 0; i < 25; i++) explosions.push({ x: x, y: y, vx: random(-5, 5), vy: random(-5, 5), life: 255, col: col });
}

function drawExplosions() {
  noStroke();
  for (let i = explosions.length - 1; i >= 0; i--) {
    let e = explosions[i]; fill(red(e.col), green(e.col), blue(e.col), e.life); rect(e.x, e.y, 6, 6);
    e.x += e.vx; e.y += e.vy; e.life -= 5; if (e.life <= 0) explosions.splice(i, 1);
  }
}

function drawLegendShape(d) {
  noStroke(); fill(d.color); let s = d.size;
  switch (d.legendId) {
    case "STARMAN": rect(-s / 2, -s / 4, s, s / 2, 5); fill(255); ellipse(-s / 4, -s / 4, s / 5); break;
    case "HAWKING": fill(100); rect(-s / 2, 0, s, s / 4); fill(d.color); rect(-s / 4, -s / 2, s / 2, s / 2); break;
    case "LAIKA": fill(150, 100); ellipse(0, 0, s, s); fill(d.color); ellipse(0, -s / 6, s / 2); break;
    case "ET": fill(100, 50, 0); rect(-s / 2, 0, s, s / 2); fill(255); ellipse(0, -s / 4, s / 2); break;
    case "NYAN": fill(255, 200, 150); rect(-s / 2, -s / 3, s, s / 1.5, 3); break;
    case "VOYAGER": fill(180); ellipse(0, 0, s / 2); fill(212, 175, 55); ellipse(0, 0, s / 3); break;
    case "STARBUG": fill(50, 200, 50); ellipse(s*0.3, 0, s*0.6, s*0.4); ellipse(-s*0.1, 0, s*0.8, s*0.6); ellipse(-s*0.6, 0, s*0.4, s*0.5); break;
    case "RED_DWARF": fill(200, 50, 50); rect(-s, -s/4, s*2, s/2, 2); fill(150, 30, 30); rect(-s/2, -s/3, s, s/1.5, 2); fill(100); rect(s*0.8, -s/8, s/2, s/4); break;
  }
}

function drawProceduralHUD() {
  push(); stroke(255, 10); strokeWeight(1); for (let i = 0; i < H; i += 4) line(0, i + (frameCount % 4), W, i + (frameCount % 4));
  fill(0, 255, 0, 150); textSize(8); textAlign(LEFT);
  text(`POS_X: ${camOffset.x.toFixed(4)}`, 20, H - 40); text(`POS_Y: ${camOffset.y.toFixed(4)}`, 20, H - 30); text(`ZOOM: ${camOffset.z.toFixed(4)}`, 20, H - 20);
  textAlign(RIGHT); text(`SENS_TEMP: ${(24 + noise(frameCount * 0.01) * 5).toFixed(1)}°C`, W - 20, H - 30); text(`BUFFER_LOAD: ${balls.length * 2}%`, W - 20, H - 20); pop();
}

function drawPixelAvatar(x, y, w, h) {
  push(); translate(x, y); noStroke();
  let vlasy = color(240, 220, 110), kuze = color(245, 200, 170), triko = color(currentTheme[0], currentTheme[1], currentTheme[2]), stin = color(0, 0, 0, 50), oci = color(40);
  let pw = w / 20, ph = h / 15, sway = sin(frameCount * 0.05) * 2, handMove = sin(frameCount * 0.2) * 4, eyesOpen = (frameCount % 120 > 5);
  
  fill(triko); rect(pw * 5 + sway, ph * 7, pw * 10, ph * 8, 2); fill(stin); rect(pw * 7 + sway, ph * 7, pw * 6, ph * 1);
  let headSway = sway * 0.5; fill(kuze); rect(pw * 6 + headSway, ph * 2, pw * 8, ph * 6, 3);
  fill(vlasy); rect(pw * 5 + headSway, ph * 1, pw * 10, ph * 3, 2); rect(pw * 5 + headSway, ph * 3, pw * 2, ph * 7, 2); rect(pw * 13 + headSway, ph * 3, pw * 2, ph * 7, 2);
  
  if (eyesOpen) { fill(oci); rect(pw * 8 + headSway, ph * 4, pw * 1, ph * 2); rect(pw * 11 + headSway, ph * 4, pw * 1, ph * 2); } 
  else { fill(stin); rect(pw * 8 + headSway, ph * 5, pw * 1, ph * 1); rect(pw * 11 + headSway, ph * 5, pw * 1, ph * 1); }
  
  fill(color(200, 100, 100)); rect(pw * 9 + headSway, ph * 7, pw * 2, ph * 1);
  fill(kuze); rect(pw * 3, ph * 8 + handMove, pw * 3, ph * 4, 2); rect(pw * 14, ph * 8 - handMove, pw * 3, ph * 4, 2); pop();
}

function drawAntiBotOverlay() {
  push(); stroke(0, 15); strokeWeight(1); let offset = frameCount % 4; for (let i = 0; i < H; i += 4) line(0, i + offset, W, i + offset);
  noStroke(); for (let i = 0; i < 20; i++) { fill(255, random(5, 25)); rect(random(W), random(H), random(1, 3), random(1, 3)); }
  for (let i = 0; i < 10; i++) { fill(currentTheme[0], currentTheme[1], currentTheme[2], random(5, 15)); rect(random(W), random(H), random(1, 4), random(1, 4)); }
  if (random() < 0.08) { fill(currentTheme[0], currentTheme[1], currentTheme[2], 30); rect(0, random(H), W, random(1, 6)); }
  let camX = W - 110, camY = H - 185;
  fill(10, 10, 10, 200); stroke(50); strokeWeight(2); rect(camX, camY, 100, 75, 5); drawPixelAvatar(camX + 5, camY + 5, 90, 65); noStroke();
  for (let cx = 0; cx < 100; cx += 5) for (let cy = 0; cy < 75; cy += 5) { if (noise(cx * 0.1, cy * 0.1, frameCount * 0.1) > 0.6) { fill(255, 255, 255, 30); rect(camX + cx, camY + cy, 5, 5); } }
  fill(255, 50, 50); textFont('Courier New'); textStyle(BOLD); textSize(10); textAlign(LEFT, TOP); text(typeof T !== 'undefined' ? T[currentLang].L_PL : "PLAYER", camX + 5, camY + 5);
  if (frameCount % 60 < 30) { fill(255, 0, 0); noStroke(); ellipse(camX + 90, camY + 10, 6, 6); }
  textFont('Press Start 2P'); textStyle(NORMAL);
  let marqueeText = typeof T !== 'undefined' ? T[currentLang].MARQ.replace("{0}", currentDestination).replace("{1}", roundTotalBalls) : currentDestination;
  let scrollX = W - ((frameCount * 3) % (textWidth(marqueeText) + W));
  fill(5, 5, 15, 230); noStroke(); rect(0, H - 12, W, 12);
  drawTxt(marqueeText + marqueeText, scrollX, H - 6, color(currentTheme), 8, LEFT); pop();
}

function drawPegs() {
  noStroke(); let pR = map(currentGravity, 0.01, 5.0, 0, 255), pG = map(currentGravity, 0.01, 5.0, 255, 100), pB = map(currentGravity, 0.01, 5.0, 255, 0), pC = color(pR, pG, pB);
  for (let p of pegs) {
    p.glow = p.glow || 0;
    if (p.glow > 0) { fill(pR, pG + 50, pB + 50, p.glow); rect(p.position.x - 6, p.position.y - 6, 12, 12); p.glow -= 20; }
    if (p.isExplosive) { fill(255, 100, 0); rect(p.position.x - 4, p.position.y - 4, 8, 8); } 
    else if (p.isRepulsor) { fill(255, 50, 200); ellipse(p.position.x, p.position.y, 12 + sin(frameCount * 0.2) * 3); } 
    else if (p.isBonus) { fill(50, 255, 50); ellipse(p.position.x, p.position.y, 12 + sin(frameCount * 0.3) * 4); }
    else { fill(pC); rect(p.position.x - 4, p.position.y - 4, 8, 8); }
  }
}

function prepareSingularityEvents() { bhSpawnTimes = []; if (random() < 0.4) bhSpawnTimes.push(floor(random(5, timer * 0.8))); }

function checkSingularitySpawn() {
  if (bhSpawnTimes.includes(timer) && !blackHole) {
    let fL = random() < 0.5;
    blackHole = { 
        x: fL ? -200 : W + 200, 
        y: random(200, H - 450), 
        startY: 0, 
        targetX: fL ? W + 300 : -300, 
        speed: random(0.4, 0.9), 
        size: random(45, 80), 
        noiseOffset: random(1000), 
        noiseSpeed: random(0.01, 0.02), 
        wobbleAmp: random(40, 90) 
    };
    blackHole.startY = blackHole.y; 
    bhSpawnTimes = bhSpawnTimes.filter(t => t !== timer); 
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_BH, 1);
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
  rotate(frameCount * 0.1);
  for (let i = 0; i < 6; i++) {
    fill(150, 50, 255, 15);
    ellipse(0, 0, jS * 3.5 + i * 20, jS * 1.2 + i * 8);
  }
  pop();
  
  for (let i = 8; i > 0; i--) {
    fill(10 + i * 5, 0, 40 + i * 15, 30);
    ellipse(0, 0, jS + i * (blackHole.size * 0.3) + (n * 10));
  }
  
  fill(0);
  ellipse(0, 0, jS);
  
  stroke(255, 100);
  strokeWeight(2);
  for(let i=0; i<5; i++) {
    let ang = random(TWO_PI);
    let distR = random(jS*0.5, jS*2);
    line(cos(ang)*distR, sin(ang)*distR, cos(ang)*(distR-10), sin(ang)*(distR-10));
  }
  pop();

  let jS_sq25 = (jS * 2.5) * (jS * 2.5);
  let jS_sq06 = (jS * 0.6) * (jS * 0.6);
  let jS_sq5 = (jS * 5) * (jS * 5);
  let jS_sq8 = (jS * 8) * (jS * 8);
  let jS_sq15 = (jS * 1.5) * (jS * 1.5);
  let jS_sq6 = (jS * 6) * (jS * 6);

  for (let i = pegs.length - 1; i >= 0; i--) {
    let p = pegs[i];
    let dx = blackHole.x - p.position.x;
    let dy = blackHole.y - p.position.y;
    if (dx * dx + dy * dy < jS_sq25 && random() < 0.02) {
       Matter.Composite.remove(world, p);
       createExplosion(p.position.x, p.position.y, color(150, 50, 255));
       pegs.splice(i, 1);
    }
  }

  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    if (!b.body) continue;
    let dx = blackHole.x - b.body.position.x;
    let dy = blackHole.y - b.body.position.y;
    let distSq = dx * dx + dy * dy;
    if (distSq < jS_sq06) {
       removeBall(b);
       continue;
    }
    if (distSq < jS_sq5) {
       let ds = Math.sqrt(distSq);
       let sD = Math.max(ds, 20);
       let forceMag = (blackHole.size * 0.0006) / (sD / 100);
       Matter.Body.applyForce(b.body, b.body.position, { x: (dx / ds) * forceMag, y: (dy / ds) * forceMag });
    }
  }

  for (let i = massivePlanets.length - 1; i >= 0; i--) {
    let p = massivePlanets[i];
    let pxReal = p.x - camOffset.x * 0.6;
    let pyReal = p.y - camOffset.y * 0.6;
    let dx = blackHole.x - pxReal;
    let dy = blackHole.y - pyReal;
    let distSq = dx * dx + dy * dy;
    
    if (distSq < jS_sq8) {
      p.x += dx * 0.005;
      p.y += dy * 0.005;
      p.size *= 0.99; 
      if (distSq < jS_sq15 || p.size < 5) {
        massivePlanets.splice(i, 1);
        shakeAmount = 15; 
        if(audioStarted) playExplosionSound();
      }
    }
  }

  for (let i = spaceDebris.length - 1; i >= 0; i--) {
    let p = spaceDebris[i];
    let pxReal = p.x - camOffset.x * 0.3;
    let pyReal = p.y - camOffset.y * 0.3;
    let dx = blackHole.x - pxReal;
    let dy = blackHole.y - pyReal;
    let distSq = dx * dx + dy * dy;
    if (distSq < jS_sq6) {
      p.vx += dx * 0.003;
      p.vy += dy * 0.003;
      if (distSq < jS_sq15) {
        spaceDebris.splice(i, 1);
      }
    }
  }

  if ((d === 1 && blackHole.x > blackHole.targetX) || (d === -1 && blackHole.x < blackHole.targetX)) {
    blackHole = null;
  } else {
    shakeAmount = max(shakeAmount, jS * 0.02);
  }
}

function triggerCosmicEvent() {
  if (cosmicEvent) return; eventOccurredThisRound = true;
  let fL = random() < 0.5, s = random(25, 45), sx = fL ? -100 : W + 100, ty = H - ZONE_H - random(20, 120);
  let b = Matter.Bodies.circle(sx, ty, s / 2, { isStatic: false, isSensor: false, density: 0.1, frictionAir: 0, collisionFilter: { mask: 1 } });
  let iC = random() < 0.5; cosmicEvent = { body: b, type: iC ? "COMET" : "METEOR", size: s, color: iC ? color(150, 200, 255) : color(255, 100, 50), trail: [] };
  Matter.World.add(world, b); Matter.Body.setVelocity(b, { x: fL ? random(12, 18) : random(-12, -18), y: random(-1, 1) });
  if (audioStarted && millis() - lastExpSnd > 50) { try { fxSynth.play(200, 0.1, 0, 0.5); } catch(e) {} lastExpSnd = millis(); }
  if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_COS, 1);
}

function handleCosmicEvent() {
  if (!cosmicEvent) return; let p = cosmicEvent.body.position; cosmicEvent.trail.push({ x: p.x, y: p.y, life: 255 });
  if (cosmicEvent.trail.length > 20) cosmicEvent.trail.shift();
  push(); noStroke();
  for (let i = 0; i < cosmicEvent.trail.length; i++) { fill(red(cosmicEvent.color), green(cosmicEvent.color), blue(cosmicEvent.color), map(i, 0, cosmicEvent.trail.length, 0, 150)); ellipse(cosmicEvent.trail[i].x, cosmicEvent.trail[i].y, cosmicEvent.size * (i / cosmicEvent.trail.length)); }
  fill(255); ellipse(p.x, p.y, cosmicEvent.size); fill(cosmicEvent.color); ellipse(p.x, p.y, cosmicEvent.size * 0.8); pop();
  if (p.x < -300 || p.x > W + 300) { Matter.World.remove(world, cosmicEvent.body); cosmicEvent = null; }
}

function spawnRareLegend() {
  let l = random(RARE_POOL);
  spaceDebris.push({ x: random(50, W - 50), y: -100, type: "LEGEND", legendId: l.id, size: l.size, color: color(l.col[0], l.col[1], l.col[2]), vy: random(1, 3), vx: random(-0.5, 0.5), rot: random(TWO_PI), rotSpeed: random(-0.06, 0.06), wobble: random(0.02, 0.08), isRare: true });
}

function generateDeepSpaceElements() {
  nebulas = [{ x: W/2, y: H/2, s: 1500, col: color(100, 50, 200, 10), type: 'MILKY_WAY', rotDir: 0 }];
  for (let i = 0; i < 12; i++) { let isGalaxy = random() < 0.4; nebulas.push({ x: random(W), y: random(H), s: random(isGalaxy ? 200 : 300, isGalaxy ? 400 : 800), col: color(random(50, 255), random(50, 150), random(200, 255), isGalaxy ? 40 : 20), type: isGalaxy ? 'SPIRAL_GALAXY' : 'NEBULA', rotDir: random([-1, 1]) }); }
  
  massivePlanets = [];
  for (let i = 0; i < 8; i++) {
    let typeRnd = random(), pType = 'PLANET', pSize = random(40, 100), pCol = color(random(30, 200), random(30, 200), random(30, 200), 220), hasR = random() < 0.3, numMoons = floor(random(0, 3));
    if (i === 0) { pType = 'SUN'; pSize = random(100, 200); pCol = color(255, 230, 150); hasR = false; numMoons = 0; } 
    else if (i === 1) { pType = 'JUPITER'; pSize = random(250, 400); pCol = color(180, 140, 100, 230); hasR = false; numMoons = floor(random(4, 8)); } 
    else if (i === 2) { pType = 'SATURN'; pSize = random(200, 350); pCol = color(220, 200, 150, 230); hasR = true; numMoons = floor(random(3, 7)); } 
    else if (typeRnd < 0.25) { pType = 'MARS'; pSize = random(80, 180); pCol = color(200, 60, 40, 220); hasR = false; numMoons = floor(random(1, 3)); } 
    else if (typeRnd < 0.45) { pType = 'ICE_GIANT'; pSize = random(150, 300); pCol = color(60, 180, 255, 220); hasR = true; numMoons = floor(random(2, 5)); } 
    else if (typeRnd < 0.55) { pType = 'DEATH_STAR'; pSize = random(120, 250); pCol = color(120); hasR = false; numMoons = 0; }
    
    let moons = []; for (let m = 0; m < numMoons; m++) moons.push({ dist: random(pSize * 0.6, pSize * 2.5), size: random(4, 15), speed: random(0.005, 0.03) * random([-1, 1]), phase: random(TWO_PI), col: color(random(150, 255)) });
    massivePlanets.push({ x: random(W), y: random(H), size: pSize, color: pCol, type: pType, hasRing: hasR, ringColor: color(random(150, 255), random(150, 255), random(150, 255), 180), speed: random(0.001, 0.008), rot: random(TWO_PI), rotSpeed: random(-0.005, 0.005), moons: moons });
  }
  
  spaceDebris = [];
  for (let i = 0; i < 20; i++) spaceDebris.push({ x: random(W), y: random(H), type: random(["UFO", "SATELLITE", "ASTEROID", "CRUISER", "FIGHTER", "CROSS_FIGHTER", "TWIN_ION", "EXPLORER_SHIP"]), size: random(15, 50), vy: random(-2, 2), vx: random(-2, 2), wobble: random(0.01, 0.05), rot: random(TWO_PI), rotSpeed: random(-0.03, 0.03) });
}

function drawGalacticBackground() {
  push();
  translate(-camOffset.x * 0.6, -camOffset.y * 0.6);
  drawingContext.globalAlpha = 0.3;
  noStroke();
  for (let n of nebulas) {
    n.y += 0.2 * currentTravelSpeed; if (n.y > H + n.s) n.y = -n.s;
    if (n.type === 'MILKY_WAY') { fill(n.col); ellipse(n.x, n.y, n.s * 2, n.s * 0.5); fill(50, 100, 255, 10); ellipse(n.x, n.y, n.s * 1.5, n.s * 0.3); continue; }
    fill(n.col);
    if (n.type === 'SPIRAL_GALAXY') { push(); translate(n.x, n.y); rotate(frameCount * 0.001 * n.rotDir); for (let i = 0; i < 5; i++) { rotate(TWO_PI / 5); ellipse(n.s * 0.3, 0, n.s * 0.8, n.s * 0.2); } pop(); } 
    else { ellipse(n.x, n.y, n.s, n.s * 0.6); }
  }
  for (let p of massivePlanets) {
    push(); translate(p.x, p.y); p.y += p.speed * currentTravelSpeed * (p.size > 100 ? 1.5 : 5); p.rot += p.rotSpeed * currentTravelSpeed;
    if (p.type === 'SUN') {
      for (let i = 5; i > 0; i--) { fill(red(p.color), green(p.color), 100, 25 / i); ellipse(0, 0, p.size * (1 + i * 0.6)); }
      fill(255, 255, 220, 150); ellipse(0, 0, p.size * 0.6);
    } else {
      rotate(p.rot); noStroke(); fill(p.color); ellipse(0, 0, p.size);
      if (p.type === 'MARS') { fill(100, 20, 10, 150); ellipse(-p.size*0.2, p.size*0.1, p.size*0.3); ellipse(p.size*0.1, -p.size*0.2, p.size*0.2); } 
      else if (p.type === 'ICE_GIANT') { fill(255, 50); rect(-p.size/2, -p.size*0.1, p.size, p.size*0.2); } 
      else if (p.type === 'JUPITER') { fill(140, 90, 60, 150); ellipse(0, -p.size*0.2, p.size*0.95, p.size*0.15); fill(200, 180, 140, 150); ellipse(0, p.size*0.1, p.size*0.98, p.size*0.2); fill(160, 110, 70, 150); ellipse(0, p.size*0.35, p.size*0.8, p.size*0.1); fill(180, 60, 40, 200); ellipse(-p.size*0.15, p.size*0.1, p.size*0.25, p.size*0.12); } 
      else if (p.type === 'DEATH_STAR') { stroke(80); strokeWeight(p.size*0.02); line(-p.size/2, 0, p.size/2, 0); noStroke(); fill(50); ellipse(p.size*0.15, -p.size*0.2, p.size*0.25); fill(100, 255, 100, 150); ellipse(p.size*0.15, -p.size*0.2, p.size*0.1); }
      fill(0, 120); arc(0, 0, p.size, p.size, HALF_PI, -HALF_PI);
      if (p.hasRing) { let rW = p.type === 'SATURN' ? 2.8 : 2.2, rH = p.type === 'SATURN' ? 0.6 : 0.4; noFill(); stroke(p.ringColor); strokeWeight(p.size * 0.12); ellipse(0, 0, p.size * rW, p.size * rH); stroke(255, 100); strokeWeight(p.size * 0.03); ellipse(0, 0, p.size * (rW - 0.2), p.size * (rH - 0.05)); }
      rotate(-p.rot); 
      for (let m of p.moons) { let mx = cos(frameCount * m.speed + m.phase) * m.dist, my = sin(frameCount * m.speed + m.phase) * m.dist * 0.4; fill(m.col); noStroke(); ellipse(mx, my, m.size); fill(0, 150); arc(mx, my, m.size, m.size, HALF_PI, -HALF_PI); }
    }
    pop(); if (p.y > H + p.size * 3) { p.y = -p.size * 3; p.x = random(W); }
  }
  pop();

  push();
  translate(-camOffset.x * 0.3, -camOffset.y * 0.3);
  drawingContext.globalAlpha = 0.8;
  
  fill(255, 120);
  for (let s of stars) { s.y += s.speed * currentTravelSpeed * 5; if (s.y > H) { s.y = 0; s.x = random(W); } ellipse(s.x, s.y, s.s); }
  
  if (gameState === "PLAYING" && random() < 0.08) shootingStars.push({ x: random(W), y: random(-50, H / 2), vx: random(10, 25), vy: random(10, 25), life: 255, len: random(20, 100) });
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i]; stroke(255, s.life); strokeWeight(1.5); line(s.x, s.y, s.x - s.vx * (s.len / 20), s.y - s.vy * (s.len / 20)); s.x += s.vx; s.y += s.vy; s.life -= 10; if (s.life <= 0) shootingStars.splice(i, 1); noStroke();
  }
  
  if (gameState === "PLAYING" && random() < 0.06) { let fL = random() < 0.5; ambientComets.push({ x: fL ? -50 : W + 50, y: random(-100, H / 2), vx: fL ? random(2, 5) : random(-5, -2), vy: random(2, 4), s: random(4, 8), life: 255, col: color(random(150, 255), random(200, 255), 255) }); }
  for (let i = ambientComets.length - 1; i >= 0; i--) {
    let c = ambientComets[i]; c.x += c.vx * currentTravelSpeed; c.y += c.vy * currentTravelSpeed; c.life -= 1.5; noStroke();
    for(let t = 1; t <= 8; t++) { fill(red(c.col), green(c.col), blue(c.col), map(t, 1, 8, 150, 0)); ellipse(c.x - c.vx * t * 2, c.y - c.vy * t * 2, c.s * map(t, 1, 8, 1.5, 0.2)); }
    fill(255); ellipse(c.x, c.y, c.s); if (c.y > H + 50 || c.x < -50 || c.x > W + 50 || c.life <= 0) ambientComets.splice(i, 1);
  }
  
  for (let i = 0; i < spaceDebris.length; i++) {
    for (let j = i + 1; j < spaceDebris.length; j++) {
      let d1 = spaceDebris[i], d2 = spaceDebris[j];
      let dx = d1.x - d2.x; let dy = d1.y - d2.y;
      let ds = dx * dx + dy * dy, md = (d1.size + d2.size) / 2;
      if (ds < md * md) { let tVx = d1.vx; d1.vx = d2.vx; d2.vx = tVx; let tVy = d1.vy; d1.vy = d2.vy; d2.vy = tVy; d1.x += d1.vx * 2; d1.y += d1.vy * 2; createExplosion(d1.x, d1.y, color(255, 200, 100)); if (audioStarted) playExplosionSound(); }
    }
  }
  
  for (let i = spaceDebris.length - 1; i >= 0; i--) {
    let d = spaceDebris[i]; push(); translate(d.x, d.y); d.x += d.vx * currentTravelSpeed; d.y += d.vy * currentTravelSpeed; d.rot += d.rotSpeed * currentTravelSpeed; rotate(d.rot);
    if (d.type === "LEGEND") drawLegendShape(d); 
    else if (d.type === "CRUISER") { fill(90); rect(-d.size, -d.size/4, d.size*2, d.size/2, 3); fill(60); rect(-d.size/2, -d.size/2, d.size, d.size/4); fill(50, 200, 255, 200); ellipse(-d.size, 0, d.size/3, d.size/2); } 
    else if (d.type === "FIGHTER") { fill(120); triangle(d.size/2, 0, -d.size/2, -d.size/2, -d.size/2, d.size/2); fill(255, 100, 50, 200); ellipse(-d.size/2, 0, d.size/3); } 
    else if (d.type === "CROSS_FIGHTER") { fill(160); rect(-d.size, -d.size*0.1, d.size*2, d.size*0.2); stroke(180); strokeWeight(d.size*0.08); line(-d.size*0.2, 0, -d.size*0.7, d.size*0.7); line(-d.size*0.2, 0, -d.size*0.7, -d.size*0.7); noStroke(); fill(255, 100, 50, 200); ellipse(-d.size*0.7, d.size*0.7, d.size*0.2); ellipse(-d.size*0.7, -d.size*0.7, d.size*0.2); fill(50, 150, 255, 200); ellipse(d.size*0.2, 0, d.size*0.4, d.size*0.15); } 
    else if (d.type === "TWIN_ION") { fill(120); ellipse(0, 0, d.size*0.6); stroke(100); strokeWeight(d.size*0.15); line(-d.size*0.5, -d.size*0.8, -d.size*0.5, d.size*0.8); line(d.size*0.5, -d.size*0.8, d.size*0.5, d.size*0.8); strokeWeight(d.size*0.08); stroke(80); line(-d.size*0.5, 0, d.size*0.5, 0); noStroke(); fill(50, 255, 50, 150); ellipse(0, 0, d.size*0.3); } 
    else if (d.type === "EXPLORER_SHIP") { fill(220); ellipse(d.size*0.6, 0, d.size*1.2, d.size*0.5); rect(-d.size*0.3, -d.size*0.1, d.size*0.8, d.size*0.2, 5); stroke(180); strokeWeight(d.size*0.1); line(-d.size*0.1, 0, -d.size*0.7, d.size*0.4); line(-d.size*0.1, 0, -d.size*0.7, -d.size*0.4); noStroke(); fill(100, 200, 255, 200); rect(-d.size*0.9, d.size*0.3, d.size*0.6, d.size*0.2, 3); rect(-d.size*0.9, -d.size*0.5, d.size*0.6, d.size*0.2, 3); fill(255, 50, 50, 200); ellipse(-d.size*0.3, d.size*0.4, d.size*0.15); ellipse(-d.size*0.3, -d.size*0.4, d.size*0.15); } 
    else if (d.type === "UFO") { d.x += sin(frameCount * d.wobble) * 2; fill(0, 255, 100, 150); rect(-d.size / 2, -d.size / 6, d.size, d.size / 3, 2); ellipse(0, -d.size / 6, d.size / 2, d.size / 2); } 
    else if (d.type === "SATELLITE") { stroke(200, 200, 255, 120); strokeWeight(1); noFill(); rect(-d.size / 4, -d.size / 4, d.size / 2, d.size / 2); line(-d.size, 0, d.size, 0); rect(-d.size, -d.size / 6, d.size / 2, d.size / 3); rect(d.size / 2, -d.size / 6, d.size / 2, d.size / 3); } 
    else { fill(80, 150); noStroke(); rect(-d.size / 2, -d.size / 2, d.size, d.size, 3); }
    pop();
    if (d.y > H + 150 || d.y < -150 || d.x > W + 150 || d.x < -150) { 
      if (d.isRare) spaceDebris.splice(i, 1); 
      else { 
        if (random() < 0.5) { d.x = random() < 0.5 ? -100 : W + 100; d.y = random(H); } 
        else { d.y = random() < 0.5 ? -100 : H + 100; d.x = random(W); } 
      } 
    }
  }
  pop();
}

function drawGravityDust() {
  let r = map(currentGravity, 0.01, 5.0, 100, 255), g = map(currentGravity, 0.01, 5.0, 200, 100), b = map(currentGravity, 0.01, 5.0, 255, 50);
  fill(r, g, b, 150); noStroke(); let dustSpeed = currentGravity * 3 * currentTravelSpeed;
  for (let d of dust) { d.y += dustSpeed; if (d.y > H) { d.y = 0; d.x = random(W); } rect(d.x, d.y, d.s, d.s); }
}

function triggerMeteorShower() {
  if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_MET, 2); shakeAmount = 15;
  meteorWarningTimer = 180; 
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      let side = floor(random(3)), mx, my, mvx, mvy;
      if (side === 0) { mx = random(W); my = -50; mvx = random(-4, 4); mvy = random(15, 35); } 
      else if (side === 1) { mx = -50; my = random(H/2); mvx = random(15, 35); mvy = random(5, 15); } 
      else { mx = W + 50; my = random(H/2); mvx = random(-35, -15); mvy = random(5, 15); }
      backgroundMeteors.push({ x: mx, y: my, vx: mvx, vy: mvy, size: random(8, 25), c: color(255, random(100, 200), 0), trail: [] });
      if (audioStarted && millis() - lastExpSnd > 100) { try { fxSynth.play(random(100, 200), 0.05, 0, 0.1); } catch(e){} lastExpSnd = millis(); }
    }, i * 150 + 2500); 
  }
}

function handleBackgroundMeteors() {
  noStroke();
  for (let i = backgroundMeteors.length - 1; i >= 0; i--) {
    let m = backgroundMeteors[i]; m.trail.push({ x: m.x, y: m.y }); if (m.trail.length > 10) m.trail.shift();
    for (let t = 0; t < m.trail.length; t++) { fill(red(m.c), green(m.c), blue(m.c), map(t, 0, m.trail.length, 0, 255)); ellipse(m.trail[t].x, m.trail[t].y, m.size * (t / m.trail.length)); }
    fill(255); ellipse(m.x, m.y, m.size); m.x += m.vx; m.y += m.vy;
    
    let hit = false;
    for (let j = 0; j < balls.length; j++) {
      let b = balls[j];
      let dx = m.x - b.body.position.x;
      let dy = m.y - b.body.position.y;
      if (dx * dx + dy * dy < (m.size + b.size) * (m.size + b.size)) {
        hit = true;
        Matter.Body.applyForce(b.body, b.body.position, { x: -dx * 0.005, y: -dy * 0.005 });
        createExplosion(m.x, m.y, m.c);
        if (audioStarted) playExplosionSound();
        shakeAmount = max(shakeAmount, 5);
        break;
      }
    }
    if (hit) {
      backgroundMeteors.splice(i, 1);
      continue;
    }

    if (m.y > H + 100 || m.x < -100 || m.x > W + 100) backgroundMeteors.splice(i, 1);
  }
}

function initGame() {
  engine = Matter.Engine.create({ enableSleeping: true }); world = engine.world; let opts = { isStatic: true, restitution: 2.2, friction: 0 };
  Matter.World.add(world, [ Matter.Bodies.rectangle(-25, H / 2, 50, H * 2, opts), Matter.Bodies.rectangle(W + 25, H / 2, 50, H * 2, opts), Matter.Bodies.rectangle(W / 2, H + 48, W, 100, { isStatic: true, friction: 1 }) ]);
  
  const p = ["SPIRAL", "WAVES", "HOURGLASS", "GALAXY", "DIAMOND", "HYPERCUBE", "DNA_HELIX", "SATURN_RINGS", "HEXAGON_GRID", "PYRAMID", "FRACTAL_TREE", "SHAPE_HEART", "SHAPE_APPLE", "SHAPE_ALIEN"];
  const mode = random(p); let nP = floor(random(300, 450)), pR = map(currentBounce, 1, 255, 0.1, 2.0);
  
  let blocker = Matter.Bodies.circle(W / 2, 130, 4, { isStatic: true, restitution: pR }); pegs.push(blocker); Matter.World.add(world, blocker);
  if (random() < 0.2) portals = [{ x: random(100, W - 100), y: random(200, H / 2 - 100) }, { x: random(100, W - 100), y: random(H / 2 + 100, H - 250) }];
  
  if (mode.startsWith("SHAPE_")) {
    let sh = SHAPES[mode.split("_")[1]] || SHAPES["HEART"], rws = sh.length, cls = sh[0].length, sp = 38, sx = (W - (cls * sp)) / 2, sy = 250;
    for (let i = 0; i < 20; i++) {
      pegs.push(Matter.Bodies.circle(map(i, 0, 19, 40, sx - 40), map(i, 0, 19, 150, 800), 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } })); Matter.World.add(world, pegs[pegs.length - 1]);
      pegs.push(Matter.Bodies.circle(map(i, 0, 19, W - 40, sx + (cls * sp) + 40), map(i, 0, 19, 150, 800), 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } })); Matter.World.add(world, pegs[pegs.length - 1]);
    }
    for (let r = 0; r < rws; r++) {
      for (let c = 0; c < cls; c++) {
        if (sh[r][c] === '*') {
          let pg = Matter.Bodies.circle(sx + c * sp + random(-1, 1), sy + r * sp + random(-1, 1), 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } });
          pg.isExplosive = random() < 0.04; pg.isRepulsor = !pg.isExplosive && random() < 0.04; pegs.push(pg); Matter.World.add(world, pg);
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
            let dx = px - ot.position.x;
            let dy = py - ot.position.y;
            if (dx * dx + dy * dy < 1225) { tc = true; break; } 
          }
          if (!tc) v = true;
        } else if (a > 45) break;
      }
      if (v) { let pg = Matter.Bodies.circle(px, py, 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } }); pg.isExplosive = random() < 0.04; pg.isRepulsor = !pg.isExplosive && random() < 0.04; pegs.push(pg); Matter.World.add(world, pg); }
    }
  }
  
  for (let i = 0; i < 150; i++) {
    let px = random(60, W - 60), py = random(180, H - 200), v = true;
    for (let ot of pegs) { 
      let dx = px - ot.position.x;
      let dy = py - ot.position.y;
      if (dx * dx + dy * dy < 1225) { v = false; break; } 
    }
    if (v) { let pg = Matter.Bodies.circle(px, py, 4, { isStatic: true, restitution: pR, collisionFilter: { category: 2 } }); pg.isExplosive = random() < 0.04; pg.isRepulsor = !pg.isExplosive && random() < 0.04; pegs.push(pg); Matter.World.add(world, pg); }
  }
  
  let sV = [5000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000], cX = 0; zones = [];
  for (let i = 0; i < 21; i++) {
    let zW = (map(abs(i - 10), 0, 10, 2.5, 1.0) / 36.1) * W, val = sV[i];
    zones.push({ x: cX, w: zW, score: val, flash: 0, flashColor: color(255), baseColor: val >= 5000 ? color(50, 45, 15, 180) : color(10, 10, 40, 180), capacity: Math.max(2, Math.floor((zW * ZONE_H) / 400)) });
    if (i > 0) { let wl = Matter.Bodies.rectangle(cX, H - (ZONE_H / 2), 6, ZONE_H, { isStatic: true, friction: 0.5 }); walls.push(wl); Matter.World.add(world, wl); }
    cX += zW;
  }
  
  initialPegCount = pegs.length;
}

function resetGame() {
  leaderboard = {}; totalBallsFired = 0; roundTotalBalls = 0; roundCount++; gameState = "PLAYING"; resultsTimer = 10; eventOccurredThisRound = false; currentDestination = generatePlanetName(); timer = floor(random(60, 301)); currentTheme = random(UI_THEMES);
  
  rimmerModeActive = false;
  rimmerModePlanned = (random() < 0.08);
  rimmerModeTriggerTime = rimmerModePlanned ? floor(random(15, timer - 15)) : -1;
  spamBuffer = {};
  
  bonusTime = 0.0;
  roundStartTimeReal = millis();
  nextAnomalyTime = 60;
  anomalyState = 0;
  
  devourer = null;
  devourerSpawnedThisRound = false;
  starbugObj = null;
  
  if (isAutoMode) autoRandomSettings();
  if (world) Matter.World.clear(world, false);
  pegs = []; walls = []; balls = []; blackHole = null; cosmicEvent = null; shootingStars = []; ambientComets = []; portals = []; floatingTexts = []; shockwaves = []; boss = null; backgroundMeteors = []; followEvents = [];
  
  initGame(); generateDeepSpaceElements(); prepareSingularityEvents(); planSpaceshipForRound(); planBossForRound(); nextMeteorShowerTime = millis() + 66000; nextJokeTime = millis() + random(10000, 20000);
  
  let delay = 0; while (spawnQueue.length > 0) { let u = spawnQueue.shift(); setTimeout(() => spawnBall(u), delay * 100); delay++; }
  if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_SEC_W + currentDestination, 1);
}

function mouseClicked() { 
  if (!audioStarted) startSpaceAudio(); 
  if (mouseY <= 75) { if (mouseX < 100) triggerFollowEvent(random(TEST_BOTS)); else { spawnBall(random(TEST_BOTS)); shakeAmount = 2; } return; } 
  if (mouseX > W - 280 && mouseX < W && mouseY > 85 && mouseY < 405) { leaderboard = {}; shakeAmount = 4; return; } 
  if (mouseX > 10 && mouseX < 280 && mouseY > 85 && mouseY < 450) { allTimeRecords = []; localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords)); shakeAmount = 5; return; } 
}
