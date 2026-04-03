const GAME_TITLE = "GALAXINKO";
const GAME_VERSION = "v14.9.17"; // majestátnější planety, lepší kontrast plochy a aktivní anti-ban kosmický prach

// change log:
// v14.9.11 - více prachu (500 místo 300), častější komety (0.12 místo 0.06), přidán měsíc s 5 planetkami
// v14.9.10 - oprava p5.js chyb: odstraněno 'l', definice boxW/boxH v drawCallToAction, random(TEST_BOTS) -> pole[index]
let currentLang = "CZ";

const T = {
  EN: {
    GRAV: "Gravity:", BOUNCE: "Bounce:", SPAWN: "Spawn Limit:", CHANCE: "Anomaly%:",
    SFX: "SFX Vol:", TTS_VOL: "Voice Vol:", RATE: "Drop Rate:", LIVE: "🔴 LIVE ",
    SYS_ON: "SYSTEM: ONLINE", SYNC: "TELEMETRY: GREEN | DATA: SYNCED",
    GFORCE: "G-FORCE:", BOUNCEX: "BOUNCE-X:", REC: "ALL TIME RECORDS",
    WARP_CORE: "MISSION TIME:", ACT_UNITS: "DROPPED UNITS:", TOT_UNITS: "TOTAL UNITS:",
    COOL: "COOLING DOWN...", TOP: "TOP ASTRONAUTS", WARN: "WARNING: RE-ENTRY",
    RET: "REMAINING UNITS BURNING IN ATMOSPHERE...", COMPL: "MISSION COMPLETE",
    SECTOR: "ORBIT:", NEXT: "NEXT LAUNCH IN:", LEVI: "ASTEROID HP",
    SLAY: " ASTEROID MINER", NEW_C: "🔥 NEW ASTRONAUT! 🔥", L_PL: "LIVE_PLAYER",
    MARQ: "🚀 ORBIT: {0} --- ACTIVE UNITS: {1} --- SEND LIKES TO BOOST THRUSTERS! --- ",
    TTS_INC: "Incoming payload from ", TTS_POW: "Thruster boost from ", TTS_MET: "Warning! Meteor shower approaching!",
    TTS_BH: "Warning! Gravitational anomaly detected!", TTS_WH: "Warning! Stabilizing energy field deployed!", TTS_COS: "Warning! Cosmic anomaly detected.",
    TTS_FLARE: "Warning! Massive solar flare detected!",
    TTS_B_ENT: "ROGUE ASTEROID DETECTED. BRACE FOR IMPACT.", TTS_B_DEF: "Asteroid mined successfully! Massive bonus awarded!",
    TTS_DEF: "Defense satellite deployed.", TTS_10S: "T-minus 10 seconds.",
    TTS_SEC_C: "Orbit operations complete.", TTS_SEC_W: "Welcome to orbit ",
    TTS_R_O: "Mission over! The ultimate astronaut is ", TTS_WELC: "Welcome aboard ",
    TTS_RIMMER_ON: "Warning! G-Force Overload! Stabilizers offline!", TTS_RIMMER_OFF: "G-Force normalized.", RIM_MODE: "G-FORCE OVERLOAD",
    ANOMALY: "ORBITAL SHIFT", PHYS_ALT: "Gravity altered!",
    TTS_DEV_ENT: "WARNING! KESSLER DEBRIS CLOUD DETECTED!", TTS_DEV_DEF: "DEBRIS CLEARED! TIME SAVED!",
    TTS_DEV_FAIL: "IMPACT IMMINENT! MISSION TIME LOST!", DEVOURER: "KESSLER DEBRIS",
    TTS_STARBUG_ENT: "Mars Rover inbound to repair modules!",
    TTS_RD_ENT: "Warning! Apollo Saturn V passing through the sector.", 
    TTS_A51_ENT: "Activating illegal Area 51 shields!", A51_MODE: "AREA 51 SHIELD",
    TTS_ORBITAL_ENT: "Warning, deorbiting old Soviet satellites!", ORBITAL_MODE: "ORBITAL BOMBARDMENT",
    TTS_GAZPACHO: "Cooling systems breached! Cryogenic freeze initiated!", GAZ_MODE: "CRYO FREEZE"
  },
  CZ: {
    GRAV: "Gravitace:", BOUNCE: "Odraz:", SPAWN: "Limit spawnu:", CHANCE: "Anomálie%:",
    SFX: "Hlasitost SFX:", TTS_VOL: "Hlasitost rádia:", RATE: "Frekvence:", LIVE: "🔴 ŽIVĚ ",
    SYS_ON: "SYSTÉM: ONLINE", SYNC: "TELEMETRIE: OK | DATA: SYNCHRO",
    GFORCE: "G-SÍLA:", BOUNCEX: "ODRAZ-X:", REC: "ALL TIME REKORDY",
    WARP_CORE: "ČAS MISE:", ACT_UNITS: "SPADLÉ KULIČKY:", TOT_UNITS: "CELKEM JEDNOTEK:",
    COOL: "CHLAZENÍ...", TOP: "NEJLEPŠÍ ASTRONAUTI", WARN: "VAROVÁNÍ: NÁVRAT",
    RET: "ZBYLÉ JEDNOTKY HOŘÍ V ATMOSFÉŘE...", COMPL: "MISE DOKONČENA",
    SECTOR: "ORBITA:", NEXT: "DALŠÍ START ZA:", LEVI: "ZDRAVÍ ASTEROIDU",
    SLAY: " TĚŽAŘ ASTEROIDŮ", NEW_C: "🔥 NOVÝ ASTRONAUT! 🔥", L_PL: "ŽIVÝ_HRÁČ",
    MARQ: "🚀 ORBITA: {0} --- AKTIVNÍ JEDNOTKY: {1} --- POŠLI LIKY PRO BOOST MOTORŮ! --- ",
    TTS_INC: "Přilétá náklad od ", TTS_POW: "Zážeh motorů od ", TTS_MET: "Varování! Blíží se meteorický roj!",
    TTS_BH: "Varování! Detekována gravitační anomálie!", TTS_WH: "Varování! Nasazeno stabilizační pole!", TTS_COS: "Varování! Vesmírná událost.",
    TTS_FLARE: "Varování! Blíží se sluneční erupce!",
    TTS_B_ENT: "DETEKOVÁN BLOUDNÝ ASTEROID. PŘIPRAVTE SE NA NÁRAZ.", TTS_B_DEF: "Asteroid úspěšně vytěžen! Udělen obrovský bonus!",
    TTS_DEF: "Obranný satelit nasazen.", TTS_10S: "Odpočet: 10 sekund.",
    TTS_SEC_C: "Operace na orbitě dokončeny.", TTS_SEC_W: "Vítejte na orbitě ",
    TTS_R_O: "Mise skončila! Nejlepším astronautem je ", TTS_WELC: "Vítej na palubě ",
    TTS_RIMMER_ON: "Varování! Přetížení G-síly! Stabilizátory selhaly!", TTS_RIMMER_OFF: "G-síla stabilizována.", RIM_MODE: "PŘETÍŽENÍ",
    ANOMALY: "ZBYTKOVÁ GRAVITACE", PHYS_ALT: "Gravitace změněna!",
    TTS_DEV_ENT: "VAROVÁNÍ! DETEKOVÁNO KESSLEROVO SMETÍ!", TTS_DEV_DEF: "SMETÍ ODKLIZENO! ČAS ZACHRÁNĚN!",
    TTS_DEV_FAIL: "NÁRAZ SMETÍ! ČAS MISE ZTRACEN!", DEVOURER: "KOSMICKÉ SMETÍ",
    TTS_STARBUG_ENT: "Mars Rover přilétá opravit moduly!",
    TTS_RD_ENT: "Varování! Sektorem prolétá Apollo Saturn V.", 
    TTS_A51_ENT: "Aktivuji nelegální štíty z Oblasti 51!", A51_MODE: "ŠTÍT Z OBLASTI 51",
    TTS_ORBITAL_ENT: "Pozor, deorbitujeme staré sovětské satelity!", ORBITAL_MODE: "ORBITÁLNÍ BOMBARDROVÁNÍ",
    TTS_GAZPACHO: "Selhání chlazení! Inicializováno kryogenní zmražení!", GAZ_MODE: "KRYO ZMRAŽENÍ"
  }
};

// TTS variace pro oslovení vítěze na konci
const CHATBOT_REPLIES = {
  CZ: [
    "Sputnik hlásí: Teď právě čtu vaše depeše, piloté!",
    "KOMUNIKACE: Vesmírný kanál otevřen, {player}.",
    "Hijack: {player}, někdo právě křičí v kosmu a já to slyším!",
    "ROBOT: Pozor plukovníku, tohle vypadá jako planety trolling.",
    "Vesmírné AI zaznamenalo váš vzkaz, {player}. Odpověď: NEURO-NEBOJTE SE!",
    "Čau {player}, Sputnik oponuje: víc statik, méně gravitace.",
    "Příkaz přijat. Odesílám zpět emisi “LOL”.",
    "Tato zpráva byla přetížena (load 4/5). Zpracování se chystá..."
  ],
  EN: [
    "Sputnik says: I see your chat signal, commander!",
    "ROBOT: Received your transmission, {player}. Stay cosmic.",
    "Attention to all units: light-speed meme detected.",
    "AI NOTE: Too much banter, engaging anti-gravity shields.",
    "Greetings {player}, your text has been archived in asteroid logs.",
    "Sputnik reporting: your message is 42% funnier than last one.",
    "The chat channel has been encrypted with space chives.",
    "Alert: cosmic popcorn loading from {player}."
  ]
};

const TTS_WINNER_VARIATIONS = {
  EN: [
    "Mission over! The ultimate astronaut is ",
    "We have a champion! The victorious space explorer is ",
    "Incredible performance! The top pilot of the cosmos is ",
    "Congratulations to our space hero, ",
    "The galaxy's finest has spoken! Meet ",
    "Outstanding mission! Your commander is ",
    "The cosmos bows to, "
  ],
  CZ: [
    "Mise skončila! Nejlepším astronautem je ",
    "Máme šampiona! Vítězný vesmírný průzkumník je ",
    "Neuvěřitelný výkon! Nejlepší vesmírný pilot je ",
    "Gratulujeme naši vesmírné hvězdě, ",
    "Galaxie se skláním před ",
    "Skvělá mise! Váš velitel je ",
    "Ty jsi legenda vesmíru, "
  ]
};

// Komentáře k výkonům hráčů - Interactive hype system
const SCORE_COMMENTARY = {
  CZ: [
    "{player} dosáhl takového skóre, že to v naší galaxii nemá obdoby!",
    "Jak si to {player} vláknout dovoluješ? Ty jsi zázrak fyziky!",
    "{player} právě přeskočil všechny naše kalkulace! Legenda!",
    "Vědecký tým vzývá slitování - {player} je příliš mocný!",
    "{player}, příště se určitě dostaneš na první místo - věřím v tebe!",
    "Toto skóre {player} není normální! Jsi z budoucnosti?",
    "Systémy hlásí anomálii - její jméno je {player}!",
    "{player}, takový výkon si zaslouží místo v síňi slávy!",
    "Všichni se budete snažit - {player} právě nastavil novou laťku!",
    "{player} hraje jako hvězda! Příště určitě zvítězíš!",
    "Vzdáváme se - {player} je mnohem chytřejší než naše AI!",
    "Takový výkon by měl být zakázaný! Dobré práce, {player}!",
    "{player}, ty jsi absolutní základ pro tým! Pokračuj tak dál!",
    "Skóre {player} je až kosmické! Jsi mistrem galaxie!",
    "Při takovém výkonu {player} by mohl pilotovat hvězdný ostřelovač!",
    "{player}, příště si určitě vezmeš trůn a budeš být první!",
    "Toto není lidský výkon - {player} je mimo naše pojetí!",
    "Galaxie si připravuje triumfální vítězství pro {player}!",
    "{player} hraje jako bůh - příště budeš vítězem!",
    "Všem ostatním hráčům: Naučte se od {player} a vítězství bude vaše!"
  ],
  EN: [
    "{player} achieved a score that has no match in our galaxy!",
    "How dare you, {player}! You're a miracle of physics!",
    "{player} just broke all our calculations! Legend!",
    "The science team is begging for mercy - {player} is too powerful!",
    "{player}, next time you'll definitely take first place - I believe in you!",
    "This score from {player} isn't normal! Are you from the future?",
    "Systems report an anomaly - its name is {player}!",
    "{player}, such performance deserves a place in the hall of fame!",
    "Everyone will need to work harder - {player} just raised the bar!",
    "{player} plays like a star! Victory is yours next time!",
    "We surrender - {player} is way smarter than our AI!",
    "Such a performance should be illegal! Great work, {player}!",
    "{player}, you are absolute foundation for the team! Keep it up!",
    "{player}'s score is cosmic! You are the galaxy's master!",
    "With such performance, {player} could pilot a starfighter!",
    "{player}, next time you'll definitely take the throne and be first!",
    "This isn't human performance - {player} is beyond our comprehension!",
    "The galaxy is preparing a triumphal victory for {player}!",
    "{player} plays like a god - you'll be the victor next time!",
    "All other players: Learn from {player} and victory will be yours!"
  ]
};

const W = 900, H = 1000, ZONE_H = 80;

let allTimeRecords = [];

const SPAM_MSGS = {
  CZ: [
    "{0} přetěžuje systémy!",
    "Houston, máme tu problém, {0} to tam sází jako o život!",
    "Astronaut {0} hlásí maximální tah!",
    "{0} žhaví motory na maximum!",
    "Zastavte někdo {0}, nebo nám praskne trup!",
    "{0} likuje víc než Hubbleův teleskop vidí hvězd!",
    "Pozor, {0} přetěžuje reaktor jadernou energií!",
    "NASA si právě poznamenala jméno {0} do rekordu!",
    "{0} generuje více tahu než Saturn 5!",
    "Zajistěte si dýchací přístroj, {0} nám sežere kyslík!",
    "Sluneční erupce zaznamenána u hráče {0}!",
    "{0} se chystá proletět asteroid porádně!",
    "Mise skončí dřív, {0} nás vyletí z oběžné dráhy!",
    "Nastavuji štíty na maximum, {0} útočí!",
    "{0} je jako černá díra - všechno do ní padá!",
    "Gravitační anomálie detekována - to je {0}!",
    "{0} likuje jako robot, který nese smrtelný virus!",
    "Všechny čidla hlásí: {0} je v CRANKED modu!",
    "Vesmírná dopravní policejka signalizuje {0}!",
    "{0} tady, {0} se chystá k vesmírné expedici!",
    "Marťané si zavolali zásilku, {0} ji pošle letěním!",
    "{0} právě překonal rekord Juri Gagarina!",
    "Telemetrie hlásí: {0} je poprv bez zábran!",
    "Vědecký tým hlásí: {0} se chystá do volného vesmíru!",
    "{0} si hraje se všemi kybernetickými systémy!",
    "Kosmický rad jednohlasně hlasuje pro {0}!",
    "{0} je jako kosmická smrt v kostýmu!",
    "Objekty jsou bezpečnější od {0}, když je liká!",
    "Vypískal jsem alarm - {0} likuje jako blázen!",
    "{0} je horší než sluneční bouře!",
    "Pojistka vzala za vděk - {0} to tu pálí!",
    "{0} se právě liká cestou na Mars!",
    "Přední pozice obsazena - to je {0}!",
    "Vesmírné zákoníky porušuje {0} ze sekundy!",
    "{0} transformuje místo v krupobití kuliček!",
    "Senzory ukazují: {0} je mega turbocharged!",
    "{0} jede na plný plyn bez brzdy!",
    "Kryogenní systémy selhaly, {0} je příliš horký!",
    "Navigujeme mimo dráhu - {0} nás vytlačuje!",
    "{0} je jako pulsar - neustále bliká liky!",
    "Nástroj pro měření ukazuje: {0} off the scale!",
    "Radiační pás se zvýšil - viníkem je {0}!",
    "{0} jede jako supernova!",
    "Žádej vyšší sílu - {0} je příliš mocný!",
    "Vesmírný samit - hlava v hlavě s {0}!",
    "{0} je absolutní zázrak fyziky!"
  ],
  EN: [
    "{0} is overloading the systems!",
    "Watch out, {0} is tapping like crazy!",
    "Astronaut {0} reports maximum thrust!",
    "{0} is heating up the engines to the max!",
    "Someone stop {0} before the hull breaches!",
    "{0} is liking more than Hubble can see stars!",
    "Alert: {0} is overloading the reactor!",
    "NASA just recorded {0} in the books of legends!",
    "{0} generates more thrust than Saturn 5!",
    "Grab a oxygen mask, {0} is eating all our air!",
    "Solar flare detected courtesy of {0}!",
    "{0} is about to send that asteroid flying!",
    "Mission ending early, {0} will eject us from orbit!",
    "Raising shields to maximum, {0} is attacking!",
    "{0} is like a black hole - everything falls in!",
    "Gravitational anomaly detected - it's {0}!",
    "{0} is tapping like a killer robot!",
    "All sensors report: {0} is in BEAST MODE!",
    "Space traffic control flagging {0}!",
    "{0} here, ready for a space expedition!",
    "Martians ordered a delivery, {0} will fly it there!",
    "{0} just broke Yuri Gagarin's record!",
    "Telemetry shows: {0} is unleashed!",
    "Science team announces: {0} is going EVA!",
    "{0} is playing with all cybernetic systems!",
    "Cosmic council unanimously votes for {0}!",
    "{0} is like death in a spacesuit!",
    "Things are safer away from {0}'s likes!",
    "Alarm triggered - {0} is mashing those buttons!",
    "{0} is worse than a solar storm!",
    "Circuit breaker gave up - {0} is burning it down!",
    "{0} is liking their way to Mars!",
    "Top position secured - that's {0}!",
    "Space regulations being violated by {0} every second!",
    "{0} transforms this place into a hailstorm of balls!",
    "Sensors show: {0} is mega turbocharged!",
    "{0} is pedal to the metal, no brakes!",
    "Cryogenic systems failed, {0} is too hot!",
    "Drifting off course - {0} is pushing us out!",
    "{0} is like a pulsar - constantly blinking likes!",
    "Measurement tools show: {0} off the scale!",
    "Radiation belt increased - the culprit is {0}!",
    "{0} is running like a supernova!",
    "Call higher authority - {0} is too powerful!",
    "Space summit - head to head with {0}!",
    "{0} is an absolute physics miracle!"
  ]
};

const JOKES = {
  CZ: [
    "Houstone, máme problém.",
    "Je to malý krok pro člověka, ale obrovský skok pro kuličku.",
    "Nezapomněl někdo nabít Mars Rover?",
    "Vstupujeme na oběžnou dráhu. Zabezpečte si svačiny.",
    "Telemetrie vypadá dobře. Počkat, ne, to je jen šmouha na monitoru.",
    "SpaceX právě přistálo s dalším boosterem. Frajeři.",
    "Myslím, že jsme právě minuli sondu Voyager 1.",
    "Je Pluto planeta? Debata v sektoru 4 stále pokračuje.",
    "Kdo nechal otevřený poklop? Ztrácíme kyslík!",
    "Blížíme se ke Kármánově hranici.",
    "Varování: Nemačkejte to velké červené tlačítko.",
    "Naše trajektorie je mírně odchýlená. Přepočítávám...",
    "Zahajuji manévr litobrzdění... počkat, to znamená náraz.",
    "Kde je nejbližší vesmírná stanice s drive-thru?",
    "Ztráta signálu za 3... 2... 1...",
    "Senzory detekují zvýšenou úroveň prokrastinace u posádky.",
    "Tlak v kabině klesá. Zhluboka dýchejte.",
    "Zasekl se mi skafandr. Bude to muset počkat do pátku.",
    "Proč mimozemšťani neodpovídají? Asi si přečetli naše recenze.",
    "Navigační systém hlásí: Jste v cíli. Všude je tma.",
    "Ztratil jsem spojení. Zkuste to vypojit ze zásuvky a zapojit zpět.",
    "Proč je ve stavu beztíže tak těžké najít čisté ponožky?",
    "Můj rover má najeto víc než moje staré auto.",
    "Našli jsme vodu na Marsu. Kdy se bude vařit káva?",
    "Houston hlásí, že dneska pizzu nedoručí.",
    "Měsíční chůze je fajn, ale zkuste si tu zatančit Macarenu.",
    "Už 300 dní jsem nepotkal nikoho živého. Ideální dovolená.",
    "Varování: Hladina kofeinu v krvi astronauta kriticky klesla!",
    "Naše solární panely chytají lepší Wi-Fi než sluneční svit.",
    "Komu z posádky zase uletěl kartáček na zuby?",
    "Může mi někdo poslat návod, jak paralelně zaparkovat raketoplán?",
    "Hvězdokupa vypadá dobře, ale chybí tam RGB podsvícení.",
    "Můj skafandr má update softwaru. Prosím, nedýchejte.",
    "Třetí den na ISS: Pořád hledám, kde se splachuje.",
    "Kdo do palubního rozhlasu pustil výtahovou hudbu?",
    "Astronauti, nezapomeňte dneska vynést vesmírné smetí.",
    "Dám za království a raketu jednu normální sprchu.",
    "Mimozemské formy života měly prezenční listinu, my jsme se nepodepsali.",
    "Oběžná dráha dosažena. Můžu si už rozepnout pás?",
    "Tahle raketa má víc tlačítek než můj herní ovladač.",
    "Povedlo se! Přistáli jsme. Může mě teď někdo vyzvednout?",
    "Koukám na Zemi a přemýšlím, jestli jsem zamkl dveře.",
    "Vesmírný závod nevyhrajeme, došla nám izolepa.",
    "Našli jsme mimozemskou základnu. Heslo na Wi-Fi mají 123456.",
    "Kdo mi na helmu nalepil lístek 'Zkouška mikrofonu'?",
    "Teleskop zachytil podivný úkaz. Byla to moucha na čočce.",
    "Zapomněli jsme na Zemi padák. Snad bude dole měkko.",
    "Houston, prosím, potvrďte: Máme tu gravitaci zapnout, nebo vypnout?",
    "Na ISS dnes vaříme z dehydrovaných slz.",
    "Náš laser na asteroidy momentálně slouží jako ukazovátko při prezentaci.",
    "Časová dilatace je super, aspoň nestárnu tak rychle jako vy dole.",
    "Odpočet zrušen. Někdo zakopl o prodlužovačku.",
    "Nahlášen únik helia. Všichni tu teď mluvíme jako Šmoulové.",
    "Potvrzujeme kontakt s mimozemšťany. Chtějí nám prodat prodlouženou záruku na loď.",
    "Můj stav beztíže byl sponzorován dnešní porcí fazolí.",
    "Výstup do volného vesmíru odložen, nemám co na sebe.",
    "Je normální, že z hlavního motoru kape olej?",
    "Houstone, ten manuál k raketě je v Ikeištině.",
    "Posílám na Zemi fotku černý díry. Má to 0 megapixelů.",
    "Kdybych měl za každý meteorit dolar, mohl bych si koupit víc paliva.",
    "Kdo zaparkoval satelit na mém místě vyhrazeném pro velitele?",
    "Gravitace je pro slabochy. My tu poletujeme.",
    "Omlouvám se za zpoždění signálu, vesmírný lag je šílený.",
    "Na Měsíci je nuda. Ani jedna hospoda v okolí 300 000 kilometrů.",
    "Vesmírné jídlo chutná jako prach, ale aspoň se po něm netloustne.",
    "Odstraňuji vesmírný odpad stěrači.",
    "Právě mi kolem hlavy proletěl sendvič z minulé mise.",
    "Detekuji silné gama záření... nebo mi jen pípá mobil.",
    "Ztrácíme výšku! Ne, počkat, jen někdo otočil mapu vzhůru nohama.",
    "Pokud nás neslyšíte, jsme na odvrácené straně... nebo u kávovaru."
  ],
  EN: [
    "Houston, we have a problem.",
    "That's one small step for a man, one giant leap for a ball.",
    "Did someone forget to charge the Mars Rover?",
    "Entering orbit. Please secure your snacks.",
    "Telemetry looks good. Wait, no, that's just a smudge on the screen.",
    "SpaceX just landed another booster. Show-offs.",
    "I think we just passed Voyager 1.",
    "Is Pluto a planet? The debate continues in sector 4.",
    "Who left the hatch open? We're venting atmosphere!",
    "Approaching the Karman line.",
    "Warning: Do not press the big red button.",
    "Our trajectory is slightly off. Recalculating...",
    "Initiating lithobraking maneuver... wait, that means crashing.",
    "Where is the nearest space station with a drive-thru?",
    "Loss of signal in 3... 2... 1...",
    "Sensors detect elevated levels of crew procrastination.",
    "Cabin pressure dropping. Breathe deeply.",
    "My spacesuit zipper is stuck. It'll have to wait until Friday.",
    "Why aren't the aliens answering? They probably read our reviews.",
    "Nav system reports: You have arrived. It's completely dark.",
    "Lost connection. Try unplugging the universe and plugging it back in.",
    "Why is it so hard to find clean socks in zero gravity?",
    "My rover has more mileage than my old car.",
    "Found water on Mars. When are we brewing coffee?",
    "Houston reports that pizza delivery is canceled for today.",
    "Moonwalking is cool, but try doing the Macarena here.",
    "Haven't seen a living soul for 300 days. Perfect vacation.",
    "Warning: Astronaut's blood caffeine level is critically low!",
    "Our solar panels catch better Wi-Fi than sunlight.",
    "Which crew member let their toothbrush float away again?",
    "Can someone send a tutorial on how to parallel park a space shuttle?",
    "The star cluster looks good, but it needs more RGB lighting.",
    "My spacesuit is updating its software. Please hold your breath.",
    "Day 3 on ISS: Still looking for the flush button.",
    "Who put elevator music on the ship's intercom?",
    "Astronauts, don't forget to take out the space trash today.",
    "My kingdom and a rocket for one normal shower.",
    "Alien life forms had an attendance sheet, we forgot to sign.",
    "Orbit achieved. Can I unbuckle my seatbelt now?",
    "This rocket has more buttons than my gaming controller.",
    "We did it! We landed. Can someone pick me up now?",
    "Looking at Earth and wondering if I locked the front door.",
    "We won't win the space race, we ran out of duct tape.",
    "Found an alien base. Their Wi-Fi password is 123456.",
    "Who put a 'Mic test' sticky note on my helmet?",
    "Telescope captured a strange anomaly. It was a fly on the lens.",
    "We forgot the parachute on Earth. Hope the ground is soft.",
    "Houston, please confirm: Do we turn gravity on or off here?",
    "Today on the ISS, we are cooking with dehydrated tears.",
    "Our asteroid laser is currently being used as a presentation pointer.",
    "Time dilation is great, at least I'm not aging as fast as you down there.",
    "Countdown canceled. Someone tripped over the extension cord.",
    "Helium leak reported. We all sound like Smurfs now.",
    "Alien contact confirmed. They want to sell us extended ship warranty.",
    "My zero gravity was sponsored by today's portion of beans.",
    "Spacewalk delayed, I have nothing to wear.",
    "Is it normal for the main engine to leak oil?",
    "Houston, the rocket manual is written in IKEA-ish.",
    "Sending Earth a photo of a black hole. It has 0 megapixels.",
    "If I had a dollar for every meteorite, I could buy more fuel.",
    "Who parked a satellite in my Commander-reserved spot?",
    "Gravity is for the weak. We float up here.",
    "Sorry for the signal delay, the space lag is insane.",
    "The Moon is boring. Not a single pub within a 200,000-mile radius.",
    "Space food tastes like dust, but at least it's low calorie.",
    "Clearing space debris with the windshield wipers.",
    "A sandwich from the previous mission just floated past my head.",
    "Detecting strong gamma rays... or my phone is just ringing.",
    "We are losing altitude! No wait, someone just held the map upside down.",
    "If you can't hear us, we are on the dark side... or by the coffee machine."
  ]
};

let engine, world;
let balls = [], pegs = [], zones = [], walls = [], explosions = [], leaderboard = {}, playerSpawnCount = {};
let timer = 40, resultsTimer = 10, lastTick = 0, waitStartTime = 0, totalBallsFired = 0, roundTotalBalls = 0, roundCount = 1;
let gameState = "PLAYING", libraryLoaded = false, winnerColor, flashEffect = 0, shakeAmount = 0;
let currentDestination = "", currentGravity = 0.6, currentBounce = 80, spawnPerEvent = 1, currentShipChance = 30;
let spawnQueue = [], portals = [], floatingTexts = [], shockwaves = [], joinPopupQueue = [], activeJoinPopup = null;
let lastPlayerSpawnTimes = {}, lastTeamComboTime = 0;
let avatarRibbon = []; // Běhající páska s avatary hráčů (1 like = 1 hodina zobrazení)
let lastCommentaryTime = 0; // Poslední čas když jsme komentovali skóre
let lastChatResponseTime = 0; // Poslední čas, kdy robot odpověděl na chat
let scoredPlayers = {}; // Tracking hráčů co právě skotovali - {playerName: timestamp}
let ambientBackgroundObjects = [];
let lastAmbientSpawnCheck = 0;
const UI_THEMES = [[0, 255, 255], [255, 50, 255], [50, 255, 50], [255, 200, 0], [255, 100, 50], [150, 100, 255]];
let currentTheme = UI_THEMES[0];

let starship = null, shipPlanned = false, shipSpawnAt = -1, viewerSpaceObjects = [];
let cosmicEvent = null, eventOccurredThisRound = false, followEvents = [], availableVoices = [], lastSpokeTime = 0;
let nextMeteorShowerTime = 0, nextJokeTime = 0, meteorWarningTimer = 0, backgroundMeteors = [];
let boss = null, bossPlanned = false, bossSpawnAt = -1, userAvatars = {}; 

let blackHoleConsumed = {pegs: 0, planets: 0, debris: 0};

let rimmerModeActive = false, rimmerModeTimer = 0, rimmerModePlanned = false, rimmerModeTriggerTime = -1, originalGravity = 0.6, originalBounce = 80;

let orbitalDropActive = false, orbitalDropPlanned = false, orbitalDropTriggerTime = -1, orbitalProjectiles = [];

let alienSporesActive = false, alienSporesPlanned = false, alienSporesTriggerTime = -1;
let sporeSource = null; // Matter.js body for the toxic spot
let sporeParticles = []; // For visual effect of the toxic spot

let spamBuffer = {};

let fakeChat = [];
const FAKE_CHAT_NAMES = ["Astro", "Nova", "Cosmo", "Luna", "Orion", "Stella", "Comet", "Nebula", "user88", "gamer_boy", "pepa_z_depa", "alien99"];
const FAKE_CHAT_MSGS = {
  CZ: [
    "Pojďme!", "Klikejte lidi!", "Nenecháme to spadnout!", "Wow, ten top 1 jede!", "Tlačte to tam!", 
    "Musíme překonat rekord!", "Štíty na max!", "Sázejte to tam!", "Kdo bude dneska první?", 
    "Tohle kolo musíme dát!", "To je masakr!", "Jedeeeem!", "Woooow!", "Obrovská síla!",
    "{top} jede neskutečně!", "Zastavte někdo {top}!", "Dneska vyhraje {top}!",
    "Pro Galaxy!",
    "Dalších 100 akcí!",
    "Nespusťte motory!",
    "Plná síla dopředu!",
    "Kosmická mise za nás!",
    "Všichni do toho!",
    "Raketa letí!",
    "Průpastné hvězdy čekají!",
    "Poslední push!",
    "Motory na maximum!",
    "Vesmír volá!",
    "Mezihvězdná cesta!",
    "Další hvězda!",
    "Asteroid čeká!",
    "Orbit dosažen!",
    "Telemetrie zelená!",
    "Palivo na max!",
    "Oběhnutí Měsíce!",
    "Mars je blízko!",
    "Vesmírný rekord!",
    "Silné pole energie!",
    "Více tahů!",
    "Superkombináce nyní!",
    "Gravitace na nulu!",
    "Nejvyšší orbit!",
    "Bez frází - do akce!",
    "Pozemská hranice za námi!",
    "Atmosféra překročena!"
  ],
  EN: [
    "Let's go!", "Keep tapping guys!", "Don't let it drop!", "Wow, top 1 is crazy!", "Push it!", 
    "We have to beat the record!", "Shields maxed!", "Spam it!", "Who will be first today?", 
    "We gotta win this round!", "This is insane!", "Gooooo!", "Woooow!", "Massive power!",
    "{top} is crushing it!", "Someone stop {top}!", "{top} is winning today!",
    "For the Galaxy!",
    "Hundred more actions!",
    "Fire up those engines!",
    "Full throttle ahead!",
    "Cosmic mission on!",
    "Everyone attack!",
    "Rockets launching!",
    "Stars are calling!",
    "Intergalactic journey!",
    "Next star awaits!",
    "Asteroid incoming!",
    "Orbit secured!",
    "Telemetry green!",
    "Fuel at maximum!",
    "Circling the Moon!",
    "Mars is close!",
    "Space record time!",
    "Energy field strong!",
    "More thrust needed!",
    "Combo streak now!",
    "Gravity at zero!",
    "Peak altitude reached!",
    "Let's make it count!",
    "Earth line crossed!",
    "Atmosphere breached!"
  ]
};

// Premenné pre mechaniku pridávania času a anomálie
let bonusTime = 0.0;
let roundStartTimeReal = 0;
let nextAnomalyTime = Math.random() * 30 + 30; // random čas pro první anomálii 
let anomalyState = 0; 
let anomalyTimer = 0;
let anomG = 0, anomB = 0, anomM = 0, dispG = 0, dispB = 0, anomalyAngle = 0;
let lastLikeTime = 0;
let lastPlayerActionTime = 0;

// Novy Boss - Pozirac Casu
let devourer = null;
let devourerSpawnedThisRound = false;
let starbugObj = null;
let starbugSpawnedThisRound = false;
let initialPegCount = 0;

// Red Dwarf mechanic
let redDwarf = null;
let rdPlanned = false;
let rdSpawnAt = -1;

// Solar Flare mechanic
let solarFlare = null;
let solarFlarePlanned = false;
let solarFlareTriggerTime = -1;

let game = { events: [] };

let planetSize = 0, currentTravelSpeed = 1.0, blackHole = null, bhSpawnTimes = [], whiteHole = null, whSpawnTimes = [], fxSynth, audioStarted = false;
let blackHoleLastPosition = { x: W / 2, y: H / 2 };
let blackHoleReplenishQueue = [];
let blackHoleDynamicObjects = [];

const badWordsRegex = /(n[i1l]gg[e3]r|n[i1l]gg[a4]|f[u4]ck|sh[i1]t|b[i1]tch|c[u4]nt|wh[o0]re|sl[u4]t|f[a4]g|d[i1]ck|c[o0]ck|p[u4]ssy|r[e3]t[a4]rd|r[a4]p[e3]|s[u4]ck|k[i1]ll|n[a4]z[i1]|j[e3]w|h[i1]tl[e3]r)/gi;

let camOffset = { x: 0, y: 0, z: 1.0 }, targetFPS = 60, socket;
const TEST_BOTS = ["NEIL", "BUZZ", "ELON", "GIGACHAD", "HOUSTON", "APOLLO", "FALCON", "ROVER"];
const TIKFINITY_URL = "ws://localhost:21213/";

let isAutoMode = true, isMothershipMode = true;
let gravitySlider, bounceSlider, spawnPerEventSlider, shipChanceSlider, volumeSlider, ttsSlider, mothershipSlider;
let autoButton = null, langButton = null;
let lblGrav, lblBounce, lblSpawn, lblBoss, lblVol, lblTTS, lblMother;

let stars = [], dust = [], massivePlanets = [], spaceDebris = [], nebulas = [], shootingStars = [], ambientComets = [], moon = null;
let lastSpawnSnd = 0, lastExpSnd = 0, lastSpawnTime = 0, doorOpen = 0;

const RARE_POOL = [
  { id: "STARMAN", name: "ELON'S TESLA", col: [200, 0, 0], size: 28 },
  { id: "HAWKING", name: "S. HAWKING", col: [50, 50, 255], size: 22 },
  { id: "LAIKA", name: "LAIKA DOG", col: [200, 180, 150], size: 18 },
  { id: "ET", name: "E.T.", col: [150, 120, 80], size: 24 },
  { id: "NYAN", name: "NYAN CAT", col: [255, 100, 200], size: 25 },
  { id: "STARBUG", name: "KOSMIK", col: [50, 200, 50], size: 30 },
  { id: "RED_DWARF", name: "CERVENY TRPASLIK", col: [220, 50, 50], size: 45 }
];

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

  let randG = random() < 0.7 ? random(30, 100) : random(10, 200);
  currentGravity = map(randG, 1, 255, 0.01, 5.0);
  currentBounce = floor(random() < 0.7 ? random(20, 80) : random(80, 150));

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
  let initialMothership = floor(random() < 0.7 ? random(0, 3) : random(3, 21));
  mothershipSlider = createSlider(0, 30, initialMothership, 1); mothershipSlider.parent(adminBar);

  let cvs = createCanvas(W, H);
  cvs.style('display', 'block');

  smooth();
  textFont('Press Start 2P');
  winnerColor = color(0, 0, 128);
  fxSynth = new p5.PolySynth();
  
  for (let i = 0; i < 100; i++) stars.push({ x: random(W), y: random(H), s: random(1, 2.5), speed: random(0.1, 0.4) });
  for (let i = 0; i < 500; i++) dust.push({ x: random(W), y: random(H), s: random(0.5, 1.5) });
  
  timer = floor(random(50, 181));
  currentDestination = generatePlanetName();
  currentTheme = random(UI_THEMES);
  
  solarFlarePlanned = (random() < 0.35);
  solarFlareTriggerTime = solarFlarePlanned ? floor(random(15, timer - 15)) : -1;

  roundStartTimeReal = millis(); 
  lastPlayerActionTime = millis();
  
  generateDeepSpaceElements();
  prepareSingularityEvents();
  planSpaceshipForRound();
  planBossForRound();
  planRedDwarfForRound();
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
          handleChatBotResponse(u, d?.data?.comment || "");
        } else if (evt !== "like") {
          for (let j = 0; j < spawnPerEvent; j++) spawnBall(u);
        }
        
        if (evt === "like") {
          lastLikeTime = millis();
          let c = d.data?.likeCount || 1;
          updateUserLikes(u, c);
          
          if (!spamBuffer[u]) {
              spamBuffer[u] = { total: 0, buffered: 0, lastUpdate: millis(), state: 'CHARGING', fade: 255, announced: false };
              // Přidej uživatele do pásky avatarů když poprvé dá like
              if (userAvatars[u]) {
                let existing = avatarRibbon.find(a => a.name === u);
                if (existing) existing.displayUntil = millis() + 3600000;
                else avatarRibbon.push({ name: u, color: leaderboard[u] ? leaderboard[u].color : color(255, 100, 100), addedTime: millis(), displayUntil: millis() + 3600000 });
              }
          }
          let sp = spamBuffer[u];
          sp.lastUpdate = millis();
          sp.state = 'CHARGING';
          sp.fade = 255;
          
          // Prvních 1-10 liků: okamžitě padne random počet kuliček (2-9)
          if (sp.total < 10) {
              let randomBalls = floor(random(2, 10));
              for (let i = 0; i < randomBalls; i++) {
                  setTimeout(() => { spawnBall(u); }, i * 80);
              }
          }

          sp.total += c;
          
          // Od 11. liku dál: všechno se buffěřuje
          if (sp.total >= 10) {
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

          if (sp.total < 5 && millis() - lastSpokeTime > 9000) {
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
  let randG = random() < 0.7 ? random(30, 100) : random(10, 200);
  currentGravity = Math.round(map(randG, 1, 255, 0.01, 5.0) * 100) / 100;
  currentBounce = floor(random() < 0.7 ? random(20, 80) : random(80, 150));
  spawnPerEvent = floor(random(1, 4)); currentShipChance = floor(random(0, 101));
  gravitySlider.value(currentGravity); bounceSlider.value(currentBounce);
  spawnPerEventSlider.value(spawnPerEvent); shipChanceSlider.value(currentShipChance);
  if (mothershipSlider) mothershipSlider.value(floor(random() < 0.7 ? random(0, 3) : random(3, 21)));
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

function drawCallToAction() {
  if (gameState !== "PLAYING") return;
  let inactiveTime = millis() - lastPlayerActionTime;
  if (inactiveTime < 15000) return;
  
  let alpha = 255;
  if (inactiveTime < 20000) {
    alpha = map(inactiveTime, 15000, 20000, 0, 255);
  }
  
  let texts = currentLang === "CZ" ? ["KLIKEJ NA DISPLEJ!", "TAP TAP = TVOJE KULIČKA!", "NAPIŠ COKOLIV = HRAJEŠ!"] : ["TAP THE SCREEN TO PLAY!"];
  let textIndex = floor(millis() / 4000) % texts.length;
  let displayText = texts[textIndex];
  
  let pulse = sin(frameCount * 0.1) * 0.25 + 1; // ještě menší efekt
  let textSizeVal = 32 + pulse * 8; // zmenšeno pro vyšší text
  
  // duhová barva pro větší pozornost
  let hue = (millis() * 0.002) % 360;
  colorMode(HSB, 360, 100, 100, 255);
  let textColor = color(hue, 80, 100, alpha);
  colorMode(RGB, 255);
  
  let cX = W / 2;
  let cY = H / 2 - 300; // posunuto vysoko nad nové hráče

  let boxW = max(textWidth(displayText) + 120, 550);
  let boxH = textSizeVal + 50;
  let cornerRadius = 30;

  push();
  textAlign(CENTER, CENTER);
  textSize(textSizeVal);
  textStyle(NORMAL);
  textFont('Arial, sans-serif'); // normální font pro lepší čitelnost
  noStroke();

  // pozadí - barevné s vysokým kontrastem pro větší pozornost
  colorMode(HSB, 360, 100, 100, 255);
  fill(hue, 60, 30, min(240, alpha * 0.9)); // tmavší barevné pozadí
  colorMode(RGB, 255);
  rectMode(CENTER);
  rect(cX, cY, boxW, boxH, cornerRadius);

  // text bez obrysu pro lepší čitelnost
  fill(textColor);
  text(displayText, cX, cY);

  // další vrstva pro extra viditelnost
  noStroke();
  fill(255, 255, 255, alpha * 0.3);
  text(displayText, cX + 1, cY + 1);

  pop();
}

function draw() {
  if (!libraryLoaded) return;
  if (!engine) initGame();
  
  let diff = (!rimmerModeActive && (abs(gravitySlider.value() - currentGravity) > 0.015)) || 
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
  camOffset.x = (noise(frameCount * 0.005) - 0.5) * 10;
  camOffset.y = (noise(frameCount * 0.005 + 100) - 0.5) * 10;
  camOffset.z = 1.0 + (noise(frameCount * 0.002) - 0.5) * 0.02;
  
  translate(W / 2, H / 2); scale(camOffset.z); translate(-W / 2 + camOffset.x, -H / 2 + camOffset.y);
  
  if (shakeAmount > 0) {
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
    shakeAmount *= 0.85;
  }
  
  translate(sin(frameCount * 0.013) * 1.0, cos(frameCount * 0.017) * 1.0);

  updateWinnerColor(); updateTravelSpeed();
  
  let bgTime = frameCount * 0.002;
  let bgR = 5 + sin(bgTime) * 10, bgG = 5 + cos(bgTime * 1.3) * 10, bgB = 15 + sin(bgTime * 0.8) * 15;
  if (rimmerModeActive) {
    bgR = 60 + sin(frameCount * 0.2) * 40;
    bgG = 10;
    bgB = 10;
  }
  background(bgR, bgG, bgB);
  
  handleAmbientBackground();
  drawGalacticBackground(); 
  handleRedDwarf(); 
  drawViewerObjects(); 
  handleBackgroundMeteors();

  // Temnější stín s lehkým modrým nádechem pro perfektní kontrast hrací plochy a neonů
  let dimAlpha = map(min(balls.length, 800), 0, 800, 80, 170); 
  fill(0, 5, 15, dimAlpha);
  noStroke();
  rect(-W, -H, W * 3, H * 3);

  try { Matter.Engine.update(engine, 1000 / 60); } catch (e) {}
  
  // NOTE: Order determines what is drawn on top.
  handleBlackHole();
  processBlackHoleReplenish();
  handleBlackHoleDynamicObjects();
  handleWhiteHole();
  handleCosmicEvent();
  handleBoss();
  handleDevourer(); 
  handleStarbugObj();
  handleSolarFlare();
  handleSpaceship();
  handleOrbitalProjectiles();

  if (gameState === "PLAYING") {
    if (millis() > nextMeteorShowerTime) {
      triggerMeteorShower(); nextMeteorShowerTime = millis() + 66000;
    }
    
    if (!rimmerModeActive && millis() > nextJokeTime) {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        nextJokeTime = millis() + 4000; // Pokud zrovna mluví, zkus vtip znovu za 4 vteřiny
      } else {
        speakAnnouncer(random(JOKES[currentLang]), 0);
        nextJokeTime = millis() + random(12000, 22000);
      }
    }
    
    if (random() < 0.045) {
      let side = floor(random(3)); let mx, my, mvx, mvy;
      if (side === 0) { mx = random(W); my = -50; mvx = random(-4, 4); mvy = random(15, 25); } 
      else if (side === 1) { mx = -50; my = random(H/2); mvx = random(15, 25); mvy = random(5, 15); } 
      else { mx = W + 50; my = random(H/2); mvx = random(-25, -15); mvy = random(5, 15); }
      backgroundMeteors.push({ x: mx, y: my, vx: mvx, vy: mvy, size: random(4, 12), c: color(255, random(100, 200), 0), trail: [] });
    }
    
    let msRate = mothershipSlider ? mothershipSlider.value() : 0;
    let isSpamming = Object.keys(spamBuffer).some(u => spamBuffer[u].state === 'CHARGING' || spamBuffer[u].state === 'RELEASING');
    let isLikingRecently = (millis() - lastLikeTime < 4000);
    
    if (isMothershipMode && msRate > 0 && balls.length < 3000 && !isSpamming && !isLikingRecently) {
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
          if (solarFlarePlanned && !solarFlare && timer === solarFlareTriggerTime) triggerSolarFlare();
          if (rdPlanned && !redDwarf && timer === rdSpawnAt) spawnRedDwarf();
          
          if (orbitalDropPlanned && !orbitalDropActive && timer === orbitalDropTriggerTime) spawnOrbitalDrop();

          if (!devourerSpawnedThisRound && !boss && timer === 60) {
              spawnDevourer();
              devourerSpawnedThisRound = true;
          }

          if (!starbugSpawnedThisRound && timer <= 40) {
              spawnStarbugObj();
              starbugSpawnedThisRound = true;
          }
          
          let elapsedSec = (millis() - roundStartTimeReal) / 1000;
          if (elapsedSec > nextAnomalyTime) {
              triggerAnomaly();
          }

          if (!eventOccurredThisRound && timer < (timer * 0.7) && random() < 0.08) triggerCosmicEvent();
          if (random() < 0.06) spawnRareLegend();
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
      if (s.length > 0) { 
        let winnerPhrase = TTS_WINNER_VARIATIONS[currentLang][floor(Math.random() * TTS_WINNER_VARIATIONS[currentLang].length)];
        speakAnnouncer(winnerPhrase, 2); 
        speakName(s[0][0]); 
      }
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

  if (orbitalDropActive && orbitalProjectiles.length > 0) {
    let f = (frameCount % 10 < 5) ? 255 : 150;
    drawTxt(typeof T !== 'undefined' ? `${T[currentLang].ORBITAL_MODE}` : `ORBITAL DROP`, 0, 200, color(255, 100, 0, f), 35, CENTER);
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
  drawAvatarRibbon();
  drawProceduralHUD(); drawAntiBotOverlay();
  
  if (anomalyState === 1) {
      drawAnomalyRoulette();
      anomalyTimer--;
      if (anomalyTimer <= 0) {
          applyAnomaly();
          anomalyState = 0;
      }
  }

  while (balls.length > 350) {
      let idx = balls.findIndex(b => b.scored);
      removeBall(balls[idx !== -1 ? idx : 0]);
  }
  
  if (flashEffect > 0) {
    noStroke(); fill(20, 40, 100, map(flashEffect, 0, 60, 0, 100)); rect(-W, -H, W*3, H*3);
    flashEffect--;
  }
  drawCallToAction();
  pop();
}

function handleFakeChat() {
  if (random() < 0.05) {
    let msgTemplate = random(FAKE_CHAT_MSGS[currentLang]);
    let topPlayer = "Commander";
    let sortedKeys = Object.keys(leaderboard).sort((a, b) => leaderboard[b].score - leaderboard[a].score);
    if (sortedKeys.length > 0) {
      topPlayer = sortedKeys[0];
    }
    let finalMsg = msgTemplate.replace("{top}", topPlayer);
    
    fakeChat.push({ name: random(FAKE_CHAT_NAMES), msg: finalMsg, life: 255 });
    if (fakeChat.length > 5) fakeChat.shift();
  }
  
  push();
  textAlign(LEFT, BOTTOM);
  textSize(11);
  
  let rCol = UI_THEMES[(roundCount - 1) % UI_THEMES.length];
  
  for(let i = 0; i < fakeChat.length; i++) {
    let c = fakeChat[i];
    fill(rCol[0], rCol[1], rCol[2], c.life);
    text(c.name + ": ", 15, H - 35 - ((fakeChat.length - 1 - i) * 16));
    fill(255, c.life);
    text(c.msg, 15 + textWidth(c.name + ": "), H - 35 - ((fakeChat.length - 1 - i) * 16));
    c.life -= 1.5;
  }
  pop();
}

function drawAvatarRibbon() {
  // Vyčisti staré avatary
  avatarRibbon = avatarRibbon.filter(a => millis() < a.displayUntil);
  if (avatarRibbon.length === 0) return;
  
  // Běhující páska s avatary - kreslí se dole
  push();
  let ribbonY = H - 20; // Posunuto níž pod text chlívečků
  let avatarSize = 24;  // Zmenšeno, aby nezakrývalo text
  let spacing = 45;
  let scrollSpeed = 0.5; // pixelů za frame
  
  let totalWidth = max(1, avatarRibbon.length) * spacing;
  let scrollOffset = (frameCount * scrollSpeed) % max(totalWidth, W); 
  
  // Pozadí pásky
  fill(0, 0, 20, 160);
  noStroke();
  rect(0, ribbonY - 15, W, 30);
  
  noStroke();
  // Dvojitý cyklus zajišťuje plynulý wrap-around efekt na konci plátna
  for (let loop = 0; loop < 2; loop++) {
    for (let i = 0; i < avatarRibbon.length; i++) {
      let avatar = avatarRibbon[i];
      let x = (i * spacing) - scrollOffset + (loop * max(totalWidth, W));
      
      // Vykreslí se i mimo obrazovku pro plynulý scroll
      if (x < W + avatarSize && x > -avatarSize) {
        let alpha = 255;
        
        // Fade-out efekt na okrajích
        if (x < 40) alpha = map(x, 0, 40, 0, 255);
        if (x > W - 40) alpha = map(x, W - 40, W, 255, 0);
        
        push();
        translate(x + avatarSize / 2, ribbonY);
        
        // Halo efekt
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = color(red(avatar.color), green(avatar.color), blue(avatar.color), alpha * 0.8);
        
        // Avatar obrázek
        if (userAvatars[avatar.name]) {
          drawingContext.save();
          drawingContext.beginPath();
          drawingContext.arc(0, 0, avatarSize / 2, 0, TWO_PI);
          drawingContext.clip();
          tint(255, alpha);
          imageMode(CENTER);
          image(userAvatars[avatar.name], 0, 0, avatarSize, avatarSize);
          drawingContext.restore();
          
          // Kruh kolem avataru
          stroke(avatar.color);
          strokeWeight(1.5);
          noFill();
          ellipse(0, 0, avatarSize, avatarSize);
        } else {
          // Fallback - barevný kruh
          fill(red(avatar.color), green(avatar.color), blue(avatar.color), alpha * 0.5);
          ellipse(0, 0, avatarSize, avatarSize);
        }
        
        drawingContext.shadowBlur = 0;
        pop();
      }
    }
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
    
    if (sp.state === 'CHARGING' && millis() - sp.lastUpdate > 2000) {
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
      if (sp.fade <= 0) {
        // Přidej avatar do pásku když hráč opustí spam buffer
        if (sp.total > 0 && userAvatars[u]) {
          let existing = avatarRibbon.find(a => a.name === u);
          if (existing) existing.displayUntil = millis() + 3600000;
          else avatarRibbon.push({ name: u, color: leaderboard[u] ? leaderboard[u].color : color(255, 100, 100), addedTime: millis(), displayUntil: millis() + 3600000 });
        }
        delete spamBuffer[u];
      }
    }
  }
}

function spawnBall(userName, mult = 1, startX = null, startY = null, velX = null, velY = null) {
  if (!libraryLoaded) return;
  if (gameState !== "PLAYING") { if (spawnQueue.length < 500) spawnQueue.push(userName); return; }
  if (balls.length > 700) return;
  
  // Team Combo detection - kontrola zda se hráč spawnguje zároveň s další
  if (userName !== "MOTHERSHIP") {
    let now = millis();
    let recentPlayers = Object.keys(lastPlayerSpawnTimes).filter(p => now - lastPlayerSpawnTimes[p] < 2000 && p !== userName);
    
    if (recentPlayers.length > 0 && random() < 0.05 && now - lastTeamComboTime > 5000) {
      // 5% šance na Team Combo hlášku
      let teamComboMsgs = {
        CZ: [
          "Vesmírná aliance! Týmová síla!",
          "Společný útok! Kosmické spojení!",
          "Tábor vítězů! Spojené síly!",
          "Galaxie se sjednocuje!",
          "Superhvězdy v akci!",
          "Vesmírná spolupráce!",
          "Společný zážeh motorů!"
        ],
        EN: [
          "Cosmic alliance! Team power!",
          "Combined strike! Space connection!",
          "Camp of victors! United forces!",
          "Galaxy unites!",
          "Superstars in action!",
          "Space cooperation!",
          "Synchronized engine ignition!"
        ]
      };
      speakAnnouncer(random(teamComboMsgs[currentLang]), 1);
      lastTeamComboTime = now;
    }
    lastPlayerSpawnTimes[userName] = now;
  }
  
  if (userName !== "MOTHERSHIP") { 
    totalBallsFired++; 
    roundTotalBalls++; 
    playerSpawnCount[userName] = (playerSpawnCount[userName] || 0) + 1;
    lastPlayerActionTime = millis();
  }
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
    if (!b.body || isNaN(b.body.position.x) || isNaN(b.body.position.y)) { removeBall(b); }
    
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
      
      if (playerSpawnCount[b.name] && playerSpawnCount[b.name] > 500) {
        noStroke(); fill(255, 220); ellipse(0, 0, b.size * 0.4, b.size * 0.4);
      }
      
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
          let distSq = dx * dx + dy * dy;
          let colDistSq = p.isBonus ? 400 : 324;
          
          if (distSq < colDistSq) {
            p.glow = 255; b.lastHitTime = millis();
            
            // Normální pegs
            b.combo += 1;
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
      b.rainbowExplodeTime = null; removeBall(b);
    }
    
    if (b.scored && b.scoreTime && b.name === "MOTHERSHIP" && millis() - b.scoreTime > 5000) { removeBall(b); }
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
  
  // Občasný komentář k výkonům - Interactive hype system
  handleScoreCommentary();
}

function handleScoreCommentary() {
  if (gameState !== "PLAYING") return;
  if (millis() - lastCommentaryTime < 55000) return; // 55 sekund cooldown (méně často, více prostoru pro vtipy)
  
  // Vyber náhodně hráče z TOP 5 leaderboardu
  let sorted = Object.entries(leaderboard).sort((a, b) => b[1].score - a[1].score).slice(0, 5);
  if (sorted.length === 0) return;
  
  let randomPlayer = sorted[floor(random(sorted.length))];
  let playerName = randomPlayer[0];
  let playerScore = randomPlayer[1].score;
  
  // Vyber něco jiného podle pozice
  let commentary = "";
  if (playerScore > 50000) {
    // Ultra vysoké skóre
    commentary = random(SCORE_COMMENTARY[currentLang]);
  } else if (playerScore > 20000) {
    // Vysoké skóre
    commentary = random(SCORE_COMMENTARY[currentLang]);
  } else {
    // Normální skóre
    commentary = random(SCORE_COMMENTARY[currentLang]);
  }
  
  // Nahraď {player} skutečným jménem
  commentary = commentary.replace("{player}", playerName);
  
  // Zavolej TTS
  speakAnnouncer(commentary, 1);
  lastCommentaryTime = millis();
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

function planRedDwarfForRound() {
  rdPlanned = (random(100) < 25); 
  rdSpawnAt = rdPlanned ? floor(random(15, timer - 15)) : -1;
}

function spawnRedDwarf() {
  if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_RD_ENT, 2);
  redDwarf = { x: -400, y: 150, speed: 2, activeFrames: 0 };
  shakeAmount = 15;
}

function handleRedDwarf() {
  if (!redDwarf) return;
  redDwarf.x += redDwarf.speed;
  redDwarf.activeFrames++;

  push();
  translate(redDwarf.x, redDwarf.y);
  
  fill(160, 30, 30);
  rect(-150, -40, 300, 80, 10);
  fill(120, 20, 20);
  rect(-100, -25, 200, 50);
  
  fill(80);
  rect(150, -30, 60, 60, 5); 
  fill(200, 255, 255);
  rect(180, -10, 15, 15); 
  
  fill(50);
  rect(-170, -30, 20, 20);
  rect(-170, 10, 20, 20);
  
  fill(255, 100, 0, 150 + sin(frameCount * 0.5) * 100);
  ellipse(-180, -20, 20, 30);
  ellipse(-180, 20, 20, 30);
  
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("JMC", -20, 0);
  pop();

  let laserX = redDwarf.x + 100;
  if (laserX > 0 && laserX < W) {
      if (redDwarf.activeFrames % 15 === 0 && audioStarted) {
          try { fxSynth.play(150, 0.05, 0, 0.1); } catch(e){}
      }
      
      push();
      strokeWeight(15 + sin(frameCount) * 5);
      stroke(255, 50, 50, 200);
      line(laserX, redDwarf.y + 40, laserX, H - ZONE_H);
      strokeWeight(5);
      stroke(255);
      line(laserX, redDwarf.y + 40, laserX, H - ZONE_H);
      
      fill(255, 100, 100);
      noStroke();
      ellipse(laserX, H - ZONE_H, 40 + random(20), 20 + random(10));
      pop();
      
      for (let z of zones) {
          if (laserX >= z.x && laserX <= z.x + z.w) {
              if (!z.upgradedByRD) {
                  z.upgradedByRD = true;
                  z.score *= 2;
                  z.baseColor = color(150, 20, 20, 200);
                  z.flash = 255;
                  z.flashColor = color(255, 100, 100);
                  createExplosion(z.x + z.w/2, H - ZONE_H, color(255, 50, 50));
              }
          }
      }
  }

  if (redDwarf.x > W + 200) {
      redDwarf = null;
  }
}

function planBossForRound() {
  bossPlanned = (random(100) < currentShipChance); bossSpawnAt = bossPlanned ? floor(random(15, timer - 15)) : -1;
}

function spawnBoss() {
  if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_B_ENT, 2);
  let w = 240, h = 80, startY = -150;
  let b = Matter.Bodies.rectangle(W/2, startY, w, h, { isStatic: true, restitution: 1.2, friction: 0 });
  Matter.World.add(world, b);
  
  let bossHp = 150000 + (roundTotalBalls * 200);
  boss = { body: b, w: w, h: h, x: W/2, y: startY, targetX: W/2, targetY: 200, maxHp: bossHp, hp: bossHp, state: "ENTERING", activeFrames: 0, hitFlash: 0 };
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
  
  let barW = 200, barH = 15, barX = boss.x - barW/2, barY = boss.y - boss.h/2 - 25;
  push(); fill(0, 150); noStroke(); rect(barX, barY, barW, barH, 3);
  fill(255, 50, 50); rect(barX, barY, barW * (max(0, boss.hp) / boss.maxHp), barH, 3);
  drawTxt(typeof T !== 'undefined' ? T[currentLang].LEVI : "BOSS HP", boss.x, barY + 7, color(255), 8, CENTER);
  pop();
}

function handleChatBotResponse(player, msg) {
    if (millis() - lastChatResponseTime < 5000) return;
    if (random() > 0.35) return; // občasná reakce

    let base = random(CHATBOT_REPLIES[currentLang]);
    base = base.replace("{player}", player);
    let text = `${base}`;

    lastChatResponseTime = millis();
    if (typeof T !== 'undefined') speakAnnouncer(text, 0);
    addFloatingText("SPUTNIK: " + text, W/2, H - ZONE_H - 150, color(255, 120, 220), true);
}

function spawnAmbientObject() {
    let fromLeft = random() < 0.5;
    let size = random(300, 600);
    let speed = random(0.2, 0.5);
    let y = random(80, H / 2);
    let colorChoice = random([color(180, 90, 255, random(20, 50)), color(40, 80, 220, random(20, 50)), color(255, 130, 240, random(20, 50))]);
    let type = random() < 0.5 ? "Nebula" : "GasGiant";

    ambientBackgroundObjects.push({
        x: fromLeft ? -size - random(50, 150) : W + size + random(50, 150),
        y: y,
        size: size,
        speed: speed * (fromLeft ? 1 : -1),
        alpha: random(20, 50),
        color: colorChoice,
        type: type,
        life: 0
    });
}

function handleAmbientBackground() {
    // spawn cca jednou za 2 minuty s 12% šancí
    if (millis() - lastAmbientSpawnCheck > 120000) {
        lastAmbientSpawnCheck = millis();
        if (random() < 0.12) {
            spawnAmbientObject();
        }
    }

    for (let i = ambientBackgroundObjects.length - 1; i >= 0; i--) {
        let o = ambientBackgroundObjects[i];
        o.x += o.speed;
        o.life++;

        let c = o.color;
        if (o.type === "Nebula") {
            drawingContext.shadowBlur = 40;
            drawingContext.shadowColor = color(red(c), green(c), blue(c), o.alpha);
            for (let j = 0; j < 6; j++) {
                let offsetX = random(-o.size * 0.2, o.size * 0.2);
                let offsetY = random(-o.size * 0.2, o.size * 0.2);
                let s = o.size * random(0.35, 0.7);
                noStroke(); fill(red(c), green(c), blue(c), o.alpha * random(0.5, 1));
                ellipse(o.x + offsetX, o.y + offsetY, s, s * random(0.45, 0.8));
            }
            drawingContext.shadowBlur = 0;
        } else {
            drawingContext.shadowBlur = 50;
            drawingContext.shadowColor = color(red(c), green(c), blue(c), o.alpha);
            noStroke();
            for (let r = 0; r < 5; r++) {
                let t = map(r, 0, 4, 1, 0.2);
                fill(red(c), green(c), blue(c), o.alpha * t);
                ellipse(o.x, o.y, o.size * (1 - r * 0.15), o.size * (1 - r * 0.15));
            }
            drawingContext.shadowBlur = 0;
        }

        // remove když je mimo obrazovku
        if (o.x < -o.size * 2 || o.x > W + o.size * 2) {
            ambientBackgroundObjects.splice(i, 1);
        }
    }
}

function spawnDevourer() {
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_DEV_ENT, 2);
    let w = 300, h = 100, y = H - ZONE_H - 350;
    let b = Matter.Bodies.rectangle(W/2, y, w, h, { isStatic: true, restitution: 0.2, friction: 0.5 });
    Matter.World.add(world, b);
    
    let bossHp = 250000 + (roundTotalBalls * 300);
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
        
        Matter.Body.setPosition(devourer.body, { x: W/2 + sin(frameCount * 0.03) * 100, y: (H - ZONE_H - 350) + sin(frameCount * 0.07) * 50 });
        
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
    
    let barW = 200, barH = 12, barX = devourer.x - barW/2, barY = devourer.y - devourer.h/2 - 20;
    push(); fill(0, 150); noStroke(); rect(barX, barY, barW, barH, 3);
    fill(150, 0, 255); rect(barX, barY, barW * (max(0, devourer.hp) / devourer.maxHp), barH, 3);
    drawTxt(typeof T !== 'undefined' ? T[currentLang].DEVOURER : "DEVOURER HP", devourer.x, barY + 6, color(255), 8, CENTER);
    pop();
    // Drivetime UI hidden, timer still counts internally:
    // drawTxt(typeof T !== 'undefined' ? T[currentLang].DEVOURER : "TIME DEVOURER", W/2, barY - 10, color(255), 10, CENTER);
    // drawTxt(Math.ceil(devourer.timer / targetFPS) + "s", W/2, barY + 7, color(255), 10, CENTER);
    pop();
}

function triggerSolarFlare() {
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_FLARE, 2);
    solarFlare = { y: H + 100, speed: 12, activeFrames: 0 };
    shakeAmount = 20;
    flashEffect = 30;
    if (audioStarted) {
        try { fxSynth.play(150, 0.5, 0, 2.0); } catch(e){}
    }
}

function handleSolarFlare() {
    if (!solarFlare) return;
    solarFlare.y -= solarFlare.speed;
    solarFlare.activeFrames++;

    push();
    let alpha = min(255, (H + 100 - solarFlare.y));
    drawingContext.shadowBlur = 50;
    drawingContext.shadowColor = color(255, 100, 0, alpha);
    fill(255, 150, 0, alpha * 0.7);
    noStroke();
    beginShape();
    vertex(-100, solarFlare.y + 200);
    for(let x = 0; x <= W; x += 100) {
        vertex(x, solarFlare.y + sin(frameCount * 0.2 + x) * 50);
    }
    vertex(W + 100, solarFlare.y + 200);
    vertex(W + 100, H + 200);
    vertex(-100, H + 200);
    endShape(CLOSE);
    
    stroke(255, 255, 150, alpha);
    strokeWeight(10);
    noFill();
    beginShape();
    for(let x = -50; x <= W + 50; x += 50) {
        vertex(x, solarFlare.y + sin(frameCount * 0.2 + x) * 50);
    }
    endShape();
    pop();

    for (let b of balls) {
        if (b.body.position.y > solarFlare.y - 60 && b.body.position.y < solarFlare.y + 150 && b.body.position.y < H - ZONE_H - 10) {
            Matter.Body.setVelocity(b.body, { 
                x: b.body.velocity.x + random(-2, 2), 
                y: random(-25, -35) 
            });
            b.scored = false;
            b.zoneIndex = -1;
            if (random() < 0.2) createExplosion(b.body.position.x, b.body.position.y, color(255, 200, 0));
        }
    }
    
    for (let d of spaceDebris) {
        if (d.y > solarFlare.y - 60 && d.y < solarFlare.y + 150) {
            d.vy = random(-10, -20);
        }
    }

    if (solarFlare.y < -400) {
        solarFlare = null;
    } else {
        shakeAmount = max(shakeAmount, 6);
    }
}

function triggerAlienAbduction() {
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_UFO, 2);
    ufoEvent = { x: W/2, y: -100, targetY: 100, activeFrames: 0, state: "ENTERING" };
    shakeAmount = 15; flashEffect = 30;
    if (audioStarted) {
        try { fxSynth.play(300, 0.5, 0, 2.0); } catch(e){}
    }
    
    // Vybrat všechny zapadlé kuličky
    for (let b of balls) {
        if (b.body.position.y > H - 300 && (b.body.isSleeping || b.body.velocity.y < 0.5) && !b.scored && !b.isBeingAbducted) {
            b.isBeingAbducted = true;
            b.scored = true; // Zamezit běžnému zónovému skórování
            b.zoneIndex = -1;
            b.body.collisionFilter.mask = 0; // Vypne kolize se zdmi/pegy, aby kuličky mohly hladce stoupat
            Matter.Body.setSleeping(b.body, false);
        }
    }
}

function handleAlienAbduction() {
    if (!ufoEvent) return;
    ufoEvent.activeFrames++;
    
    if (ufoEvent.state === "ENTERING") {
        ufoEvent.y = lerp(ufoEvent.y, ufoEvent.targetY, 0.05);
        if (abs(ufoEvent.y - ufoEvent.targetY) < 2) ufoEvent.state = "ABDUCTING";
    } else if (ufoEvent.state === "ABDUCTING") {
        ufoEvent.x = W/2 + sin(frameCount * 0.05) * 150;
        let stillAbducting = false;
        
        // Trakční paprsek (světelný pás)
        push();
        noStroke();
        fill(100, 255, 100, 80 + sin(frameCount * 0.2) * 40);
        beginShape();
        vertex(ufoEvent.x - 40, ufoEvent.y + 20);
        vertex(ufoEvent.x + 40, ufoEvent.y + 20);
        vertex(ufoEvent.x + 200, H);
        vertex(ufoEvent.x - 200, H);
        endShape(CLOSE);
        pop();

        for (let i = balls.length - 1; i >= 0; i--) {
            let b = balls[i];
            if (b.isBeingAbducted) {
                stillAbducting = true;
                let dx = ufoEvent.x - b.body.position.x;
                // Aplikace obrácené gravitace
                Matter.Body.setVelocity(b.body, { x: dx * 0.05, y: -12 });
                
                // Odstranění z plochy a "Výzkumný bonus"
                if (b.body.position.y < ufoEvent.y + 50) {
                    let pts = 1000 * b.multiplier;
                    if (b.name !== "MOTHERSHIP") {
                        updateScore(b.name, pts, b.color);
                        addFloatingText("+" + pts + (typeof T !== 'undefined' ? T[currentLang].UFO_BONUS : ""), ufoEvent.x, ufoEvent.y, color(100, 255, 100), true);
                    }
                    createExplosion(ufoEvent.x, ufoEvent.y, color(100, 255, 100));
                    if (audioStarted && random() < 0.3) playSpawnSound();
                    removeBall(b);
                }
            }
        }
        
        if (!stillAbducting && ufoEvent.activeFrames > 180) {
            ufoEvent.state = "LEAVING";
        }
    } else if (ufoEvent.state === "LEAVING") {
        ufoEvent.y -= 5;
        for (let i = balls.length - 1; i >= 0; i--) {
            let b = balls[i];
            if (b.isBeingAbducted) removeBall(b);
        }
        if (ufoEvent.y < -200) ufoEvent = null;
        return;
    }

    // Vykreslení UFO
    push();
    translate(ufoEvent.x, ufoEvent.y);
    noStroke();
    fill(100, 255, 100, 150); ellipse(0, 20, 80, 30);
    fill(60); ellipse(0, 0, 160, 60);
    fill(40); ellipse(0, 5, 120, 40);
    fill(150, 200, 255, 200); arc(0, -5, 80, 80, PI, 0);
    
    for (let l = 0; l < 7; l++) {
        let lx = map(l, 0, 6, -60, 60);
        let ly = sin(acos(lx/80)) * 20; 
        if ((frameCount + l * 10) % 30 < 15) fill(255, 50, 50); else fill(50, 255, 50);
        ellipse(lx, ly, 8, 8);
    }
    pop();
}

function triggerAlienSpores() {
    alienSporesActive = true;
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_SPORES_ENT, 2);
    sporeSource = { x: random(200, W - 200), y: random(150, H/2), r: 70, activeFrames: 0 };
    shakeAmount = 15; flashEffect = 30;
    if (audioStarted) { try { fxSynth.play(150, 0.5, 0, 2.0); } catch(e){} }
}

function handleAlienSpores() {
    if (!alienSporesActive) return;
    if (sporeSource) {
        sporeSource.activeFrames++;
        push(); translate(sporeSource.x, sporeSource.y); noStroke();
        let pulse = sin(frameCount * 0.1) * 20;
        fill(50, 255, 50, 80 + pulse); ellipse(0, 0, sporeSource.r * 2.5);
        fill(20, 200, 20, 150); ellipse(0, 0, sporeSource.r * 1.5 + pulse);
        fill(100, 255, 100);
        for(let i=0; i<5; i++) ellipse(random(-sporeSource.r/2, sporeSource.r/2), random(-sporeSource.r/2, sporeSource.r/2), random(3, 8));
        pop();
        for (let b of balls) {
            if (!b.infected && b.body.position.y > sporeSource.y - sporeSource.r && b.body.position.y < sporeSource.y + sporeSource.r) {
                let dx = b.body.position.x - sporeSource.x; let dy = b.body.position.y - sporeSource.y;
                if (dx * dx + dy * dy < sporeSource.r * sporeSource.r) {
                    b.infected = true;
                    if (audioStarted && random() < 0.3) { try { fxSynth.play(900, 0.05, 0, 0.1); } catch(e){} }
                }
            }
        }
    }
    if (frameCount % 4 === 0) { // Optimalizované šíření dotykem
        let infectedBalls = balls.filter(b => b.infected);
        let uninfectedBalls = balls.filter(b => !b.infected);
        for (let ib of infectedBalls) {
            for (let ub of uninfectedBalls) {
                if (abs(ib.body.position.y - ub.body.position.y) > 30) continue; // Optimalizace vzdálenosti
                let dx = ib.body.position.x - ub.body.position.x; let dy = ib.body.position.y - ub.body.position.y;
                let minDist = (ib.size + ub.size) / 2 + 5;
                if (dx * dx + dy * dy < minDist * minDist) ub.infected = true;
            }
        }
    }
}

function decontaminateSpores() {
    if (!alienSporesActive) return;
    alienSporesActive = false; sporeSource = null;
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_SPORES_CLR, 2);
    shakeAmount = 25; flashEffect = 50;
    for (let b of balls) {
        if (b.infected) {
            createExplosion(b.body.position.x, b.body.position.y, color(50, 255, 50));
            if (audioStarted && random() < 0.1) playExplosionSound();
            for (let j = pegs.length - 1; j >= 0; j--) {
                let pg = pegs[j];
                let dx = b.body.position.x - pg.position.x; let dy = b.body.position.y - pg.position.y;
                if (dx * dx + dy * dy < 10000) { // Radius 100 okolo nakažené kuličky
                    createExplosion(pg.position.x, pg.position.y, color(50, 255, 50));
                    Matter.World.remove(world, pg); pegs.splice(j, 1);
                    if (b.name !== "MOTHERSHIP") updateScore(b.name, 150 * b.multiplier, color(50, 255, 50));
                }
            }
            if (b.name !== "MOTHERSHIP") {
                updateScore(b.name, 2000 * b.multiplier, color(50, 255, 50));
                addFloatingText("+2000", b.body.position.x, b.body.position.y, color(50, 255, 50), true);
            }
            b.infected = false; // Reset nákazy po dekontaminaci
        }
    }
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
    let targetAngleM = map(anomM, 0, 30, 0, TWO_PI);

    let spinsG = 15; 
    let spinsB = 22; 
    let spinsM = 18;

    let currentAngleG = (targetAngleG - spinsG * TWO_PI) + (spinsG * TWO_PI) * easeOut;
    let currentAngleB = (targetAngleB - spinsB * TWO_PI) + (spinsB * TWO_PI) * easeOut;
    let currentAngleM = (targetAngleM - spinsM * TWO_PI) + (spinsM * TWO_PI) * easeOut;

    let normG = currentAngleG % TWO_PI;
    if (normG < 0) normG += TWO_PI;
    let currentValG = constrain(round(map(normG, 0, TWO_PI, 1, 255)), 1, 255);

    let normB = currentAngleB % TWO_PI;
    if (normB < 0) normB += TWO_PI;
    let currentValB = constrain(round(map(normB, 0, TWO_PI, 1, 255)), 1, 255);

    let normM = currentAngleM % TWO_PI;
    if (normM < 0) normM += TWO_PI;
    let currentValM = constrain(round(map(normM, 0, TWO_PI, 0, 30)), 0, 30);

    if (t <= 60) {
        currentAngleG = targetAngleG;
        currentAngleB = targetAngleB;
        currentAngleM = targetAngleM;
        currentValG = anomG;
        currentValB = anomB;
        currentValM = anomM;
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
                textSize(12); // zvětšeno z 10 pro lepší čitelnost
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
    strokeWeight(4); // zvětšeno z 3
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 50, 50);
    line(0, 0, 135, 0);
    fill(255, 50, 50);
    noStroke();
    triangle(135, -8, 135, 8, 155, 0); // zvětšeno z -6,6,150
    pop();

    push();
    rotate(currentAngleB);
    stroke(50, 255, 50);
    strokeWeight(4); // zvětšeno z 3
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(50, 255, 50);
    line(0, 0, 115, 0);
    fill(50, 255, 50);
    noStroke();
    triangle(115, -8, 115, 8, 135, 0); // zvětšeno z -6,6,130
    pop();

    push();
    rotate(currentAngleM);
    stroke(255, 100, 255);
    strokeWeight(4); // zvětšeno z 3
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 100, 255);
    line(0, 0, 95, 0);
    fill(255, 100, 255);
    noStroke();
    triangle(95, -8, 95, 8, 115, 0); // zvětšeno z -6,6,110
    pop();
    
    pop(); 

    fill(10, 10, 30, 230);
    stroke(0, 255, 255, 100);
    strokeWeight(2);
    ellipse(0, 0, 140, 140);
    
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    
    textSize(9);
    fill(255, 100, 100);
    text(typeof T !== 'undefined' ? T[currentLang].GRAV : "GRAVITY", 0, -42);
    textSize(t <= 60 ? 22 : 18); // zvětšeno na konci pro zvýraznění
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(255, 50, 50);
    text(currentValG, 0, -26);
    
    textSize(9);
    fill(100, 255, 100);
    drawingContext.shadowBlur = 0;
    text(typeof T !== 'undefined' ? T[currentLang].BOUNCE : "BOUNCE", 0, -2);
    textSize(t <= 60 ? 22 : 18); // zvětšeno na konci
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(50, 255, 50);
    text(currentValB, 0, 14);

    textSize(9);
    fill(255, 100, 255);
    drawingContext.shadowBlur = 0;
    text("MOTHERSHIP", 0, 38);
    textSize(t <= 60 ? 22 : 18); // zvětšeno na konci
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(255, 100, 255);
    text(currentValM, 0, 54);
    
    drawingContext.shadowBlur = 0;
    
    textSize(26);
    fill(255, 200, 0, 150 + sin(frameCount * 0.2) * 100);
    text(typeof T !== 'undefined' ? T[currentLang].ANOMALY : "ANOMALY", 0, -230);
    pop();
}

function triggerAnomaly() {
    anomalyState = 1;
    anomalyTimer = 300;
    let elapsedSec = (millis() - roundStartTimeReal) / 1000;
    nextAnomalyTime = elapsedSec + Math.random() * 30 + 30; // random čas pro další anomálii
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].ANOMALY, 2);
    anomG = floor(random() < 0.7 ? random(30, 100) : random(10, 200));
    anomB = floor(random() < 0.7 ? random(20, 80) : random(80, 150));
    anomM = floor(random() < 0.7 ? random(0, 3) : random(3, 21));
    anomalyAngle = 0;
    if (audioStarted) {
        try {
            fxSynth.play('C4', 0.1, 0, 0.5);
            setTimeout(() => { try { fxSynth.play('G4', 0.1, 0, 0.5); } catch(e){} }, 100);
            setTimeout(() => { try { fxSynth.play('C5', 0.1, 0, 0.5); } catch(e){} }, 200);
        } catch(e) {}
    }
}

function applyAnomaly() {
    currentGravity = map(anomG, 1, 255, 0.01, 5.0);
    currentBounce = anomB;
    gravitySlider.value(currentGravity);
    bounceSlider.value(currentBounce);
    if (mothershipSlider) mothershipSlider.value(anomM);
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

    if (starbugObj.activeFrames % 10 === 0 && random() < 0.9 && starbugObj.x > 100 && starbugObj.x < W - 100) {
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

function handleWhiteHole() {
  if (!whiteHole) return;
  let d = whiteHole.targetX > whiteHole.x ? 1 : -1;
  whiteHole.x += whiteHole.speed * d;
  let n = noise(frameCount * whiteHole.noiseSpeed + whiteHole.noiseOffset);
  whiteHole.y = whiteHole.startY + (n - 0.5) * whiteHole.wobbleAmp * 2;
  let jS = whiteHole.size * (1 + (n - 0.5) * 0.15);

  push();
  translate(whiteHole.x, whiteHole.y);
  noStroke();
  
  push();
  rotate(-frameCount * 0.1);
  for (let i = 0; i < 6; i++) {
    fill(200, 240, 255, 20);
    ellipse(0, 0, jS * 3.5 + i * 20, jS * 1.2 + i * 8);
  }
  pop();
  
  for (let i = 8; i > 0; i--) {
    fill(200 + i * 5, 230 + i * 3, 255, 30);
    ellipse(0, 0, jS + i * (whiteHole.size * 0.3) + (n * 10));
  }
  
  fill(255);
  ellipse(0, 0, jS);
  
  stroke(200, 255, 255, 150);
  strokeWeight(2);
  for(let i=0; i<5; i++) {
    let ang = random(TWO_PI);
    let distR = random(jS*0.5, jS*2.2);
    line(cos(ang)*(distR-15), sin(ang)*(distR-15), cos(ang)*distR, sin(ang)*distR);
  }
  pop();

  let jS_sq_effect = (jS * 4) * (jS * 4);

  if (frameCount % 8 === 0) {
    for (let i = 0; i < pegs.length; i++) {
      let p = pegs[i];
      if (p.isBonus || p.isExplosive || p.isRepulsor) continue;
      
      let dx = whiteHole.x - p.position.x;
      let dy = whiteHole.y - p.position.y;
      if (dx * dx + dy * dy < jS_sq_effect && random() < 0.15) {
         if (random() < 0.7) {
             p.isBonus = true;
             p.tempBonusTimer = 600; 
         } else {
             p.isExplosive = true;
             p.tempExplosiveTimer = 600; 
         }
         p.glow = 255;
         
         push();
         stroke(200, 255, 255, 200);
         strokeWeight(3);
         line(whiteHole.x, whiteHole.y, p.position.x, p.position.y);
         pop();
         
         createExplosion(p.position.x, p.position.y, color(200, 255, 255));
         if (audioStarted) { try { fxSynth.play(1200, 0.05, 0, 0.1); } catch(e){} }
      }
    }
  }

  if ((d === 1 && whiteHole.x > whiteHole.targetX) || (d === -1 && whiteHole.x < whiteHole.targetX)) {
    whiteHole = null;
  }
}

function spawnSinglePlanet(startY = null) {
  let typeRnd = random(), pType = 'PLANET', pSize = random(40, 100), pCol = color(random(30, 200), random(30, 200), random(30, 200), 220), hasR = random() < 0.3, numMoons = floor(random(0, 3));
  if (typeRnd < 0.1) { pType = 'SUN'; pSize = random(100, 200); pCol = color(255, 230, 150); hasR = false; numMoons = 0; } 
  else if (typeRnd < 0.2) { pType = 'JUPITER'; pSize = random(250, 400); pCol = color(180, 140, 100, 230); hasR = false; numMoons = floor(random(4, 8)); } 
  else if (typeRnd < 0.3) { pType = 'SATURN'; pSize = random(200, 350); pCol = color(220, 200, 150, 230); hasR = true; numMoons = floor(random(3, 7)); } 
  else if (typeRnd < 0.5) { pType = 'MARS'; pSize = random(80, 180); pCol = color(200, 60, 40, 220); hasR = false; numMoons = floor(random(1, 3)); } 
  else if (typeRnd < 0.7) { pType = 'ICE_GIANT'; pSize = random(150, 300); pCol = color(60, 180, 255, 220); hasR = true; numMoons = floor(random(2, 5)); } 
  else if (typeRnd < 0.8) { pType = 'DEATH_STAR'; pSize = random(120, 250); pCol = color(120); hasR = false; numMoons = 0; }
  
  let moons = []; for (let m = 0; m < numMoons; m++) moons.push({ dist: random(pSize * 0.6, pSize * 2.5), size: random(4, 15), speed: random(0.005, 0.03) * random([-1, 1]), phase: random(TWO_PI), col: color(random(150, 255)) });
  massivePlanets.push({ x: random(W), y: startY !== null ? startY : -pSize * 3, size: pSize, color: pCol, type: pType, hasRing: hasR, ringColor: color(random(150, 255), random(150, 255), random(150, 255), 180), vy: random(0.1, 0.5), vx: random(-0.1, 0.1), rot: random(TWO_PI), rotSpeed: random(-0.005, 0.005), moons: moons });
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

function spawnOrbitalDrop() {
  if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_ORBITAL_ENT, 2);
  let count = floor(random(3, 7));
  for(let i=0; i<count; i++) {
    let sx = random(100, W - 100);
    let sy = -200 - (i * 150);
    let size = random(35, 55);
    let b = Matter.Bodies.rectangle(sx, sy, size, size, { density: 0.8, frictionAir: 0.005, restitution: 0.1 });
    Matter.World.add(world, b);
    orbitalProjectiles.push({ body: b, size: size, trail: [] });
  }
  orbitalDropActive = true;
  shakeAmount = 25;
}

function handleOrbitalProjectiles() {
  for (let i = orbitalProjectiles.length - 1; i >= 0; i--) {
    let op = orbitalProjectiles[i];
    let pos = op.body.position;
    op.trail.push({ x: pos.x, y: pos.y });
    if (op.trail.length > 20) op.trail.shift();
    
    push();
    for (let t = 0; t < op.trail.length; t++) {
      let alpha = map(t, 0, op.trail.length, 0, 180);
      fill(255, 100 + random(50), 0, alpha);
      noStroke();
      ellipse(op.trail[t].x + random(-5,5), op.trail[t].y + random(-5,5), op.size * (t/op.trail.length) * 1.5);
    }
    
    translate(pos.x, pos.y);
    rotate(op.body.angle + frameCount * 0.1);
    fill(100, 90, 80); stroke(50); strokeWeight(2);
    rect(-op.size/2, -op.size/2, op.size, op.size, 5);
    fill(200, 50, 50); ellipse(0, 0, op.size * 0.4); // Red Star / Emblem
    fill(255, 150, 0, 200); ellipse(0, 0, op.size * 1.3, op.size * 0.7); // Fire glow
    pop();
    
    // Destruction logic for pegs
    for (let j = pegs.length - 1; j >= 0; j--) {
      let pg = pegs[j];
      let dx = pos.x - pg.position.x;
      let dy = pos.y - pg.position.y;
      if (dx*dx + dy*dy < (op.size * 0.8) * (op.size * 0.8)) {
        createExplosion(pg.position.x, pg.position.y, color(255, 150, 0));
        Matter.World.remove(world, pg);
        pegs.splice(j, 1);
        if (audioStarted) playExplosionSound();
        shakeAmount = 4;
      }
    }
    
    if (pos.y > H + 300) { Matter.World.remove(world, op.body); orbitalProjectiles.splice(i, 1); }
  }
  if (orbitalDropActive && orbitalProjectiles.length === 0) orbitalDropActive = false;
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
    if (p.tempBonusTimer > 0) {
        p.tempBonusTimer--;
        if (p.tempBonusTimer <= 0) p.isBonus = false;
    }
    if (p.tempExplosiveTimer > 0) {
        p.tempExplosiveTimer--;
        if (p.tempExplosiveTimer <= 0) p.isExplosive = false;
    }

    p.glow = p.glow || 0;
    if (p.glow > 0) { fill(pR, pG + 50, pB + 50, p.glow); rect(p.position.x - 6, p.position.y - 6, 12, 12); p.glow -= 20; }
    if (p.isExplosive) { fill(255, 100, 0); rect(p.position.x - 4, p.position.y - 4, 8, 8); } 
    else if (p.isRepulsor) { fill(255, 50, 200); ellipse(p.position.x, p.position.y, 12 + sin(frameCount * 0.2) * 3); } 
    else if (p.isBonus) { fill(50, 255, 50); ellipse(p.position.x, p.position.y, 12 + sin(frameCount * 0.3) * 4); }
    else { fill(pC); rect(p.position.x - 4, p.position.y - 4, 8, 8); }
  }
}

function prepareSingularityEvents() { 
  bhSpawnTimes = []; if (random() < 0.4) bhSpawnTimes.push(floor(random(5, timer * 0.8))); 
  whSpawnTimes = []; if (random() < 0.35) whSpawnTimes.push(floor(random(5, timer * 0.8))); 
}

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

  if (whSpawnTimes.includes(timer) && !whiteHole) {
    let fL = random() < 0.5;
    whiteHole = { 
        x: fL ? -200 : W + 200, 
        y: random(200, H - 450), 
        startY: 0, 
        targetX: fL ? W + 300 : -300, 
        speed: random(0.5, 1.2), 
        size: random(50, 90), 
        noiseOffset: random(1000), 
        noiseSpeed: random(0.01, 0.02), 
        wobbleAmp: random(30, 80) 
    };
    whiteHole.startY = whiteHole.y; 
    whSpawnTimes = whSpawnTimes.filter(t => t !== timer); 
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_WH, 1);
  }
}

function handleWhiteHole() {
  if (!whiteHole) return;
  let d = whiteHole.targetX > whiteHole.x ? 1 : -1;
  whiteHole.x += whiteHole.speed * d;
  let n = noise(frameCount * whiteHole.noiseSpeed + whiteHole.noiseOffset);
  whiteHole.y = whiteHole.startY + (n - 0.5) * whiteHole.wobbleAmp * 2;
  let jS = whiteHole.size * (1 + (n - 0.5) * 0.15);

  push();
  translate(whiteHole.x, whiteHole.y);
  noStroke();
  
  push();
  rotate(-frameCount * 0.1);
  for (let i = 0; i < 6; i++) {
    fill(200, 240, 255, 20);
    ellipse(0, 0, jS * 3.5 + i * 20, jS * 1.2 + i * 8);
  }
  pop();
  
  for (let i = 8; i > 0; i--) {
    fill(200 + i * 5, 230 + i * 3, 255, 30);
    ellipse(0, 0, jS + i * (whiteHole.size * 0.3) + (n * 10));
  }
  
  fill(255);
  ellipse(0, 0, jS);
  
  stroke(200, 255, 255, 150);
  strokeWeight(2);
  for(let i=0; i<5; i++) {
    let ang = random(TWO_PI);
    let distR = random(jS*0.5, jS*2.2);
    line(cos(ang)*(distR-15), sin(ang)*(distR-15), cos(ang)*distR, sin(ang)*distR);
  }
  pop();

  let jS_sq_effect = (jS * 4) * (jS * 4);

  if (frameCount % 8 === 0) {
    for (let i = 0; i < pegs.length; i++) {
      let p = pegs[i];
      if (p.isBonus || p.isExplosive || p.isRepulsor) continue;
      
      let dx = whiteHole.x - p.position.x;
      let dy = whiteHole.y - p.position.y;
      if (dx * dx + dy * dy < jS_sq_effect && random() < 0.15) {
         if (random() < 0.7) {
             p.isBonus = true;
             p.tempBonusTimer = 600; 
         } else {
             p.isExplosive = true;
             p.tempExplosiveTimer = 600; 
         }
         p.glow = 255;
         
         push();
         stroke(200, 255, 255, 200);
         strokeWeight(3);
         line(whiteHole.x, whiteHole.y, p.position.x, p.position.y);
         pop();
         
         createExplosion(p.position.x, p.position.y, color(200, 255, 255));
         if (audioStarted) { try { fxSynth.play(1200, 0.05, 0, 0.1); } catch(e){} }
      }
    }
  }

  if ((d === 1 && whiteHole.x > whiteHole.targetX) || (d === -1 && whiteHole.x < whiteHole.targetX)) {
    whiteHole = null;
  }
}

function spawnSinglePlanet(startY = null) {
  let typeRnd = random(), pType = 'PLANET', pSize = random(40, 100), pCol = color(random(30, 200), random(30, 200), random(30, 200), 220), hasR = random() < 0.3, numMoons = floor(random(0, 3));
  if (typeRnd < 0.1) { pType = 'SUN'; pSize = random(100, 200); pCol = color(255, 230, 150); hasR = false; numMoons = 0; } 
  else if (typeRnd < 0.2) { pType = 'JUPITER'; pSize = random(250, 400); pCol = color(180, 140, 100, 230); hasR = false; numMoons = floor(random(4, 8)); } 
  else if (typeRnd < 0.3) { pType = 'SATURN'; pSize = random(200, 350); pCol = color(220, 200, 150, 230); hasR = true; numMoons = floor(random(3, 7)); } 
  else if (typeRnd < 0.5) { pType = 'MARS'; pSize = random(80, 180); pCol = color(200, 60, 40, 220); hasR = false; numMoons = floor(random(1, 3)); } 
  else if (typeRnd < 0.7) { pType = 'ICE_GIANT'; pSize = random(150, 300); pCol = color(60, 180, 255, 220); hasR = true; numMoons = floor(random(2, 5)); } 
  else if (typeRnd < 0.8) { pType = 'DEATH_STAR'; pSize = random(120, 250); pCol = color(120); hasR = false; numMoons = 0; }
  
  let moons = []; for (let m = 0; m < numMoons; m++) moons.push({ dist: random(pSize * 0.6, pSize * 2.5), size: random(4, 15), speed: random(0.005, 0.03) * random([-1, 1]), phase: random(TWO_PI), col: color(random(150, 255)) });
  massivePlanets.push({ x: random(W), y: startY !== null ? startY : -pSize * 3, size: pSize, color: pCol, type: pType, hasRing: hasR, ringColor: color(random(150, 255), random(150, 255), random(150, 255), 180), speed: random(0.001, 0.008), rot: random(TWO_PI), rotSpeed: random(-0.005, 0.005), moons: moons });
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
    if (p.tempBonusTimer > 0) {
        p.tempBonusTimer--;
        if (p.tempBonusTimer <= 0) p.isBonus = false;
    }
    if (p.tempExplosiveTimer > 0) {
        p.tempExplosiveTimer--;
        if (p.tempExplosiveTimer <= 0) p.isExplosive = false;
    }

    p.glow = p.glow || 0;
    if (p.glow > 0) { fill(pR, pG + 50, pB + 50, p.glow); rect(p.position.x - 6, p.position.y - 6, 12, 12); p.glow -= 20; }
    if (p.isExplosive) { fill(255, 100, 0); rect(p.position.x - 4, p.position.y - 4, 8, 8); } 
    else if (p.isRepulsor) { fill(255, 50, 200); ellipse(p.position.x, p.position.y, 12 + sin(frameCount * 0.2) * 3); } 
    else if (p.isBonus) { fill(50, 255, 50); ellipse(p.position.x, p.position.y, 12 + sin(frameCount * 0.3) * 4); }
    else { fill(pC); rect(p.position.x - 4, p.position.y - 4, 8, 8); }
  }
}

function prepareSingularityEvents() { 
  bhSpawnTimes = []; if (random() < 0.4) bhSpawnTimes.push(floor(random(5, timer * 0.8))); 
  whSpawnTimes = []; if (random() < 0.35) whSpawnTimes.push(floor(random(5, timer * 0.8))); 
}

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

  if (whSpawnTimes.includes(timer) && !whiteHole) {
    let fL = random() < 0.5;
    whiteHole = { 
        x: fL ? -200 : W + 200, 
        y: random(200, H - 450), 
        startY: 0, 
        targetX: fL ? W + 300 : -300, 
        speed: random(0.5, 1.2), 
        size: random(50, 90), 
        noiseOffset: random(1000), 
        noiseSpeed: random(0.01, 0.02), 
        wobbleAmp: random(30, 80) 
    };
    whiteHole.startY = whiteHole.y; 
    whSpawnTimes = whSpawnTimes.filter(t => t !== timer); 
    if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_WH, 1);
  }
}

function handleWhiteHole() {
  if (!whiteHole) return;
  let d = whiteHole.targetX > whiteHole.x ? 1 : -1;
  whiteHole.x += whiteHole.speed * d;
  let n = noise(frameCount * whiteHole.noiseSpeed + whiteHole.noiseOffset);
  whiteHole.y = whiteHole.startY + (n - 0.5) * whiteHole.wobbleAmp * 2;
  let jS = whiteHole.size * (1 + (n - 0.5) * 0.15);

  push();
  translate(whiteHole.x, whiteHole.y);
  noStroke();
  
  push();
  rotate(-frameCount * 0.1);
  for (let i = 0; i < 6; i++) {
    fill(200, 240, 255, 20);
    ellipse(0, 0, jS * 3.5 + i * 20, jS * 1.2 + i * 8);
  }
  pop();
  
  for (let i = 8; i > 0; i--) {
    fill(200 + i * 5, 230 + i * 3, 255, 30);
    ellipse(0, 0, jS + i * (whiteHole.size * 0.3) + (n * 10));
  }
  
  fill(255);
  ellipse(0, 0, jS);
  
  stroke(200, 255, 255, 150);
  strokeWeight(2);
  for(let i=0; i<5; i++) {
    let ang = random(TWO_PI);
    let distR = random(jS*0.5, jS*2.2);
    line(cos(ang)*(distR-15), sin(ang)*(distR-15), cos(ang)*distR, sin(ang)*distR);
  }
  pop();

  let jS_sq_effect = (jS * 4) * (jS * 4);

  if (frameCount % 8 === 0) {
    for (let i = 0; i < pegs.length; i++) {
      let p = pegs[i];
      if (p.isBonus || p.isExplosive || p.isRepulsor) continue;
      
      let dx = whiteHole.x - p.position.x;
      let dy = whiteHole.y - p.position.y;
      if (dx * dx + dy * dy < jS_sq_effect && random() < 0.15) {
         if (random() < 0.7) {
             p.isBonus = true;
             p.tempBonusTimer = 600; 
         } else {
             p.isExplosive = true;
             p.tempExplosiveTimer = 600; 
         }
         p.glow = 255;
         
         push();
         stroke(200, 255, 255, 200);
         strokeWeight(3);
         line(whiteHole.x, whiteHole.y, p.position.x, p.position.y);
         pop();
         
         createExplosion(p.position.x, p.position.y, color(200, 255, 255));
         if (audioStarted) { try { fxSynth.play(1200, 0.05, 0, 0.1); } catch(e){} }
      }
    }
  }

  if ((d === 1 && whiteHole.x > whiteHole.targetX) || (d === -1 && whiteHole.x < whiteHole.targetX)) {
    whiteHole = null;
  }
}

function handleBlackHole() {
  if (!blackHole) return;
  // aktualizace poslední pozice černé díry, aby objekty létaly kolem ní když se uzavře
  blackHoleLastPosition.x = blackHole.x;
  blackHoleLastPosition.y = blackHole.y;

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

  let suckedPegs = false;
  for (let i = pegs.length - 1; i >= 0; i--) {
    let p = pegs[i];
    let dx = blackHole.x - p.position.x;
    let dy = blackHole.y - p.position.y;
    if (dx * dx + dy * dy < jS_sq25 && random() < 0.02) {
       suckedPegs = true;
       blackHoleConsumed.pegs++;
       Matter.Composite.remove(world, p);
       createExplosion(p.position.x, p.position.y, color(150, 50, 255));
       pegs.splice(i, 1);
    }
  }
  if (suckedPegs && !starbugObj) {
    // Automaticky přivolat kouska (STARBUG/KOSMIK), aby přinesl nové pegy po žrání
    spawnStarbugObj();
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
        blackHoleConsumed.planets++;
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
        blackHoleConsumed.debris++;
        spaceDebris.splice(i, 1);
      }
    }
  }

  if ((d === 1 && blackHole.x > blackHole.targetX) || (d === -1 && blackHole.x < blackHole.targetX)) {
    blackHole = null;
    if (blackHoleConsumed.pegs + blackHoleConsumed.planets + blackHoleConsumed.debris > 0) {
      enqueueBlackHoleReplenish(blackHoleLastPosition.x, blackHoleLastPosition.y);
    }
    blackHoleConsumed = {pegs: 0, planets: 0, debris: 0};
  } else {
    shakeAmount = max(shakeAmount, jS * 0.02);
  }
}

function enqueueBlackHoleReplenish(originX, originY) {
  let total = blackHoleConsumed.pegs + blackHoleConsumed.planets + blackHoleConsumed.debris;
  total = min(total, 25);
  for (let i = 0; i < total; i++) {
    blackHoleReplenishQueue.push({ type: random(['DEBRIS','PLANET','PEG']), priority: i, originX: originX, originY: originY });
  }
}

function processBlackHoleReplenish() {
  if (blackHoleReplenishQueue.length === 0) return;
  if (frameCount % 12 !== 0) return;
  let item = blackHoleReplenishQueue.shift();

  let originX = item.originX || random(100, W - 100);
  let originY = item.originY || random(100, H - 250);

  let baseAngle = random(TWO_PI);
  let curveSize = random(100, 160);

  let obj = {
    type: item.type,
    originX: originX,
    originY: originY,
    angle: baseAngle,
    pathRadius: curveSize,
    speed: random(0.01, 0.035),
    rotDir: random() < 0.5 ? -1 : 1,
    size: item.type === 'PLANET' ? random(32, 60) : item.type === 'DEBRIS' ? random(12, 24) : 10,
    color: item.type === 'PEG' ? color(200, 255, 100) : item.type === 'PLANET' ? color(random(120, 255), random(120, 255), random(120, 255)) : color(180, 180, 220),
    age: 0,
    bonusTriggered: false,
    bonusReady: false,
    x: originX + cos(baseAngle) * curveSize,
    y: originY + sin(baseAngle) * curveSize,
  };

  blackHoleDynamicObjects.push(obj);
}

function handleBlackHoleDynamicObjects() {
  if (blackHoleDynamicObjects.length === 0) return;

  for (let i = blackHoleDynamicObjects.length - 1; i >= 0; i--) {
    let o = blackHoleDynamicObjects[i];
    o.age++;
    o.angle += o.speed * o.rotDir;

    // Křivka kolem místa černé díry
    let wobble = sin(o.age * 0.04) * 22;
    o.x = o.originX + cos(o.angle) * o.pathRadius + wobble;
    o.y = o.originY + sin(o.angle) * o.pathRadius + sin(o.age * 0.03) * 18;

    // mírný přesun k centru aby se neuzavíralo přímo kolem hrany
    o.originX = lerp(o.originX, W / 2, 0.001);
    o.originY = lerp(o.originY, H / 2 - 120, 0.001);

    // po určitém čase se aktivuje bonusní režim "minigame"
    if (o.age > 180 && !o.bonusReady) {
      o.bonusReady = true;
      o.bonusTimer = 210;
      if (audioStarted) try { fxSynth.play(1000, 0.2, 0, 0.1); } catch(e) {}
    }

    // pokud bonus je aktivní, vygeneruj body pro již existující hráče každých 60 frameů
    if (o.bonusReady && o.bonusTimer > 0) {
      o.bonusTimer--;
      if (o.bonusTimer % 60 === 0) {
        let best = Object.keys(leaderboard).sort((a, b) => (leaderboard[b].score || 0) - (leaderboard[a].score || 0))[0];
        if (best) {
          updateScore(best, 150 * (o.type === 'PLANET' ? 2 : 1), color(255, 255, 100));
          addFloatingText(`BONUS ${o.type}`, o.x, o.y, color(255, 255, 100), true);
        }
      }
      if (o.bonusTimer <= 0) {
        o.bonusTriggered = true;
      }
    }

    // výkres
    push();
    noStroke();
    if (o.type === 'PLANET') {
      fill(o.color.levels ? o.color : color(150, 150, 255), 230);
      ellipse(o.x, o.y, o.size * 1.1 + sin(frameCount * 0.1) * 3);
      fill(255, 255, 255, 180); ellipse(o.x + 12, o.y - 8, o.size * 0.2, o.size * 0.2);
    } else if (o.type === 'DEBRIS') {
      fill(o.color.levels ? o.color : color(220), 210);
      rect(o.x, o.y, o.size, o.size * 0.4, 3);
      fill(255, 255, 180, 190); ellipse(o.x + sin(frameCount * 0.12) * 4, o.y - 2, 4, 4);
    } else {
      fill(255, 230, 100, 220);
      ellipse(o.x, o.y, 14 + sin(frameCount * 0.25) * 2);
      fill(255, 255, 255, 200); ellipse(o.x + 3, o.y - 2, 5, 5);
    }

    if (o.bonusReady) {
      noFill();
      stroke(255, 220, 20, 150 + sin(frameCount * 0.3) * 80);
      strokeWeight(2);
      ellipse(o.x, o.y, o.size + 18);
      fill(255, 255, 255, 220);
      noStroke();
      textAlign(CENTER, CENTER); textSize(10);
      text(`#${o.bonusTimer}`, o.x, o.y - o.size - 12);
    }
    pop();

    if (o.bonusTriggered || o.age > 900) {
      blackHoleDynamicObjects.splice(i, 1);
    }
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
    massivePlanets.push({ x: random(W), y: random(H), size: pSize, color: pCol, type: pType, hasRing: hasR, ringColor: color(random(150, 255), random(150, 255), random(150, 255), 180), vy: random(0.1, 0.5), vx: random(-0.1, 0.1), rot: random(TWO_PI), rotSpeed: random(-0.005, 0.005), moons: moons });
  }
  
  spaceDebris = [];
  for (let i = 0; i < 30; i++) spaceDebris.push({ x: random(W), y: random(H), type: random(["UFO", "SATELLITE", "ASTEROID", "CRUISER", "FIGHTER", "CROSS_FIGHTER", "TWIN_ION", "EXPLORER_SHIP", "ASTRONAUT", "CARGO_POD", "ALIEN_PROBE", "SPACE_WHALE"]), size: random(15, 50), vy: random(-2, 2), vx: random(-2, 2), wobble: random(0.01, 0.05), rot: random(TWO_PI), rotSpeed: random(-0.03, 0.03) });
}

function drawGalacticBackground() {
  push();
  translate(-camOffset.x * 0.6, -camOffset.y * 0.6);
  
  // Mlhoviny jsou úplně nejdál, proto mají pevnou a velmi nízkou průhlednost
  drawingContext.globalAlpha = 0.15;
  noStroke();
  for (let n of nebulas) {
    n.y += 0.2 * currentTravelSpeed; 
    n.x += sin(frameCount * 0.001 + n.s) * 0.15; // lehký drift do stran
    if (n.y > H + n.s) { n.y = -n.s; n.x = random(W); }
    if (n.type === 'MILKY_WAY') { fill(n.col); ellipse(n.x, n.y, n.s * 2, n.s * 0.5); fill(50, 100, 255, 10); ellipse(n.x, n.y, n.s * 1.5, n.s * 0.3); continue; }
    fill(n.col);
    if (n.type === 'SPIRAL_GALAXY') { push(); translate(n.x, n.y); rotate(frameCount * 0.001 * n.rotDir); for (let i = 0; i < 5; i++) { rotate(TWO_PI / 5); ellipse(n.s * 0.3, 0, n.s * 0.8, n.s * 0.2); } pop(); } 
    else { ellipse(n.x, n.y, n.s, n.s * 0.6); }
  }
  
  // Planety seřadíme podle velikosti (menší = dál = kreslí se první)
  massivePlanets.sort((a, b) => a.size - b.size);
  for (let p of massivePlanets) {
    push(); 
    // Parallax efekt: Pomalejší a majestátnější pohyb pro zachování uvěřitelnosti masivních objektů
    let parallax = map(p.size, 40, 400, 0.2, 1.2);
    p.y += p.vy * currentTravelSpeed * parallax; 
    p.x += p.vx * currentTravelSpeed * parallax;
    p.rot += p.rotSpeed * currentTravelSpeed;
    
    // Ztmavení do dálky pro lepší splynutí s pozadím
    drawingContext.globalAlpha = map(p.size, 40, 400, 0.1, 0.6);
    
    translate(p.x, p.y); 
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
    pop(); 
    if (p.y > H + p.size * 3) { p.y = -p.size * 3; p.x = random(W); p.vx = random(-0.1, 0.1); p.vy = random(0.1, 0.5); }
    if (p.x < -p.size * 3) p.x = W + p.size * 3;
    if (p.x > W + p.size * 3) p.x = -p.size * 3;
  }
  
  if (massivePlanets.length < 8 && !blackHole && !whiteHole && random() < 0.005) {
      spawnSinglePlanet();
  }
  
  // Měsíc s planetkami
  if (!moon) {
    moon = { x: W / 2 + 200, y: H / 2 - 150, size: 80, rot: 0, moons: [] };
    for (let i = 0; i < 5; i++) {
      moon.moons.push({ dist: random(120, 180), speed: random(0.01, 0.03), phase: random(TWO_PI), size: random(5, 15), col: color(random(100, 200), random(100, 200), random(100, 200)) });
    }
  }
  push();
  drawingContext.globalAlpha = 0.4;
  moon.x += sin(frameCount * 0.002) * 0.15; // pozvolný plovoucí pohyb
  moon.y += cos(frameCount * 0.0015) * 0.15;
  translate(moon.x, moon.y);
  moon.rot += 0.005;
  rotate(moon.rot);
  fill(200, 200, 220);
  ellipse(0, 0, moon.size);
  fill(150, 150, 170, 150);
  ellipse(-moon.size * 0.2, moon.size * 0.1, moon.size * 0.3);
  ellipse(moon.size * 0.1, -moon.size * 0.2, moon.size * 0.2);
  rotate(-moon.rot);
  for (let m of moon.moons) {
    let mx = cos(frameCount * m.speed + m.phase) * m.dist;
    let my = sin(frameCount * m.speed + m.phase) * m.dist * 0.4;
    fill(m.col);
    noStroke();
    ellipse(mx, my, m.size);
    fill(0, 100);
    arc(mx, my, m.size, m.size, HALF_PI, -HALF_PI);
  }
  pop();
  
  pop();

  push();
  translate(-camOffset.x * 0.3, -camOffset.y * 0.3);
  
  drawingContext.globalAlpha = 0.4; // Hvězdy více do pozadí
  fill(255, 120);
  for (let s of stars) { s.y += s.speed * currentTravelSpeed * 5; if (s.y > H) { s.y = 0; s.x = random(W); } ellipse(s.x, s.y, s.s); }
  
  // Anti-Ban vrstva: "Vesmírný prach". Zajišťuje neustálý organický pohyb na celé obrazovce proti detekci botem.
  drawingContext.globalAlpha = 0.6;
  for (let d of dust) {
    d.x += (noise(d.x * 0.01, frameCount * 0.002) - 0.5) * 1.5;
    d.y += d.s * 0.5 + (noise(d.y * 0.01, frameCount * 0.002) - 0.5) * 1.5;
    if (d.y > H + 50) { d.y = -50; d.x = random(W); }
    if (d.x > W + 50) d.x = -50; else if (d.x < -50) d.x = W + 50;
    fill(150, 200, 255, 50 + sin(frameCount * 0.05 + d.x) * 50);
    ellipse(d.x, d.y, d.s * 1.5);
  }

  drawingContext.globalAlpha = 0.8;
  if (gameState === "PLAYING" && random() < 0.08) shootingStars.push({ x: random(W), y: random(-50, H / 2), vx: random(10, 25), vy: random(10, 25), life: 255, len: random(20, 100) });
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i]; stroke(255, s.life); strokeWeight(1.5); line(s.x, s.y, s.x - s.vx * (s.len / 20), s.y - s.vy * (s.len / 20)); s.x += s.vx; s.y += s.vy; s.life -= 10; if (s.life <= 0) shootingStars.splice(i, 1); noStroke();
  }
  
  if (gameState === "PLAYING" && random() < 0.12) { let fL = random() < 0.5; ambientComets.push({ x: fL ? -50 : W + 50, y: random(-100, H / 2), vx: fL ? random(2, 5) : random(-5, -2), vy: random(2, 4), s: random(4, 8), life: 255, col: color(random(150, 255), random(200, 255), 255) }); }
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
  
  // Seřadit kosnmické smetí (největší nejdřív, takže při zpětném loopu se kreslí nejmenší jako první)
  spaceDebris.sort((a, b) => b.size - a.size);
  for (let i = spaceDebris.length - 1; i >= 0; i--) {
    let d = spaceDebris[i]; 
    push(); 
    
    // Ztmavení a parallax u kosmického smetí
    drawingContext.globalAlpha = map(d.size, 15, 50, 0.15, 0.95); 
    let zSpeed = map(d.size, 15, 50, 0.5, 1.5);
    d.x += d.vx * currentTravelSpeed * zSpeed; 
    d.y += d.vy * currentTravelSpeed * zSpeed; 
    
    translate(d.x, d.y); 
    d.rot += d.rotSpeed * currentTravelSpeed; rotate(d.rot);
    
    if (d.type === "LEGEND") drawLegendShape(d); 
    else if (d.type === "CRUISER") { fill(90); rect(-d.size, -d.size/4, d.size*2, d.size/2, 3); fill(60); rect(-d.size/2, -d.size/2, d.size, d.size/4); fill(50, 200, 255, 200); ellipse(-d.size, 0, d.size/3, d.size/2); } 
    else if (d.type === "FIGHTER") { fill(120); triangle(d.size/2, 0, -d.size/2, -d.size/2, -d.size/2, d.size/2); fill(255, 100, 50, 200); ellipse(-d.size/2, 0, d.size/3); } 
    else if (d.type === "CROSS_FIGHTER") { fill(160); rect(-d.size, -d.size*0.1, d.size*2, d.size*0.2); stroke(180); strokeWeight(d.size*0.08); line(-d.size*0.2, 0, -d.size*0.7, d.size*0.7); line(-d.size*0.2, 0, -d.size*0.7, -d.size*0.7); noStroke(); fill(255, 100, 50, 200); ellipse(-d.size*0.7, d.size*0.7, d.size*0.2); ellipse(-d.size*0.7, -d.size*0.7, d.size*0.2); fill(50, 150, 255, 200); ellipse(d.size*0.2, 0, d.size*0.4, d.size*0.15); } 
    else if (d.type === "TWIN_ION") { fill(120); ellipse(0, 0, d.size*0.6); stroke(100); strokeWeight(d.size*0.15); line(-d.size*0.5, -d.size*0.8, -d.size*0.5, d.size*0.8); line(d.size*0.5, -d.size*0.8, d.size*0.5, d.size*0.8); strokeWeight(d.size*0.08); stroke(80); line(-d.size*0.5, 0, d.size*0.5, 0); noStroke(); fill(50, 255, 50, 150); ellipse(0, 0, d.size*0.3); } 
    else if (d.type === "EXPLORER_SHIP") { fill(220); ellipse(d.size*0.6, 0, d.size*1.2, d.size*0.5); rect(-d.size*0.3, -d.size*0.1, d.size*0.8, d.size*0.2, 5); stroke(180); strokeWeight(d.size*0.1); line(-d.size*0.1, 0, -d.size*0.7, d.size*0.4); line(-d.size*0.1, 0, -d.size*0.7, -d.size*0.4); noStroke(); fill(100, 200, 255, 200); rect(-d.size*0.9, d.size*0.3, d.size*0.6, d.size*0.2, 3); rect(-d.size*0.9, -d.size*0.5, d.size*0.6, d.size*0.2, 3); fill(255, 50, 50, 200); ellipse(-d.size*0.3, d.size*0.4, d.size*0.15); ellipse(-d.size*0.3, -d.size*0.4, d.size*0.15); } 
    else if (d.type === "UFO") { d.x += sin(frameCount * d.wobble) * 2; fill(0, 255, 100, 150); rect(-d.size / 2, -d.size / 6, d.size, d.size / 3, 2); ellipse(0, -d.size / 6, d.size / 2, d.size / 2); } 
    else if (d.type === "SATELLITE") { stroke(200, 200, 255, 120); strokeWeight(1); noFill(); rect(-d.size / 4, -d.size / 4, d.size / 2, d.size / 2); line(-d.size, 0, d.size, 0); rect(-d.size, -d.size / 6, d.size / 2, d.size / 3); rect(d.size / 2, -d.size / 6, d.size / 2, d.size / 3); } 
    else if (d.type === "ASTRONAUT") { fill(240); rect(-d.size/4, -d.size/2, d.size/2, d.size, 5); fill(200); rect(-d.size/2, -d.size/3, d.size/4, d.size*0.6, 2); fill(255, 200, 0); ellipse(0, -d.size/4, d.size*0.4, d.size*0.3); }
    else if (d.type === "CARGO_POD") { fill(120); rect(-d.size/2, -d.size/2, d.size, d.size, 2); fill(255, 150, 0); rect(-d.size/2, -d.size/6, d.size, d.size/3); fill(40); rect(-d.size/4, -d.size/4, d.size/2, d.size/2); }
    else if (d.type === "ALIEN_PROBE") { fill(30, 10, 50); triangle(0, -d.size/2, -d.size/2, d.size/2, d.size/2, d.size/2); fill(0, 255, 255, 150 + sin(frameCount * 0.1) * 100); ellipse(0, d.size/6, d.size/3); }
    else if (d.type === "SPACE_WHALE") { fill(50, 150, 255, 200); beginShape(); vertex(d.size/2, 0); quadraticVertex(0, -d.size/3, -d.size/2, -d.size/6); quadraticVertex(-d.size, 0, -d.size/2, d.size/6); quadraticVertex(0, d.size/3, d.size/2, 0); endShape(CLOSE); fill(0, 255, 255, 200); ellipse(d.size/3, -d.size/8, d.size/10); }
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
  playerSpawnCount = {};
  
  bonusTime = 0.0;
  roundStartTimeReal = millis();
  nextAnomalyTime = 60;
  anomalyState = 0;
  
  devourer = null;
  devourerSpawnedThisRound = false;
  starbugObj = null;
  lastLikeTime = 0;
  lastPlayerActionTime = millis();
  
  solarFlare = null;
  solarFlarePlanned = (random() < 0.35);
  solarFlareTriggerTime = solarFlarePlanned ? floor(random(15, timer - 15)) : -1;

  game.events.forEach(e => e.onEnd()); // Obnovit bezpečnostní stav před zahájením nového kola
  game.events = [];
  cryoPlanned = (random() < 0.15);
  cryoTriggerTime = cryoPlanned ? floor(random(15, timer - 15)) : -1;

  orbitalDropActive = false;
  orbitalProjectiles = [];
  orbitalDropPlanned = (random() < 0.12);
  orbitalDropTriggerTime = orbitalDropPlanned ? floor(random(10, timer - 10)) : -1;

  if (isAutoMode) autoRandomSettings();
  
  if (mothershipSlider) {
    let newRate = random() < 0.7 ? floor(random(0, 3)) : floor(random(3, 21));
    mothershipSlider.value(newRate);
  }

  if (world) Matter.World.clear(world, false);
  pegs = []; walls = []; balls = []; blackHole = null; whiteHole = null; cosmicEvent = null; shootingStars = []; ambientComets = []; portals = []; floatingTexts = []; shockwaves = []; boss = null; backgroundMeteors = []; followEvents = [];
  
  initGame(); generateDeepSpaceElements(); prepareSingularityEvents(); planSpaceshipForRound(); planBossForRound(); nextMeteorShowerTime = millis() + 66000; nextJokeTime = millis() + random(10000, 20000);
  
  let delay = 0; while (spawnQueue.length > 0) { let u = spawnQueue.shift(); setTimeout(() => spawnBall(u), delay * 100); delay++; }
  if (typeof T !== 'undefined') speakAnnouncer(T[currentLang].TTS_SEC_W + currentDestination, 1);
}

function mouseClicked() { 
  if (!audioStarted) startSpaceAudio(); 
  if (mouseY <= 75) { if (mouseX < 100) triggerFollowEvent(TEST_BOTS[floor(Math.random() * TEST_BOTS.length)]); else { spawnBall(TEST_BOTS[floor(Math.random() * TEST_BOTS.length)]); shakeAmount = 2; } return; } 
  if (mouseX > W - 280 && mouseX < W && mouseY > 85 && mouseY < 405) { leaderboard = {}; shakeAmount = 4; return; } 
  if (mouseX > 10 && mouseX < 280 && mouseY > 85 && mouseY < 450) { allTimeRecords = []; localStorage.setItem('galaxinko_records', JSON.stringify(allTimeRecords)); shakeAmount = 5; return; } 
}
