// Everything the pages say, EN + PL, and the games' facts. The policies' legal text is in
// src/content/privacy (English, copied from the games by tools/sync_assets.py).

export type Lang = "en" | "pl";
export const LANGS: Lang[] = ["en", "pl"];
export type Status = "test" | "soon" | "dev";

export interface Game {
  id: string;
  name: string;
  accent: string;
  status: Status;
  shots: string[];          // public/<id>/shots/<lang>/<name>.png
  shotLangs: Lang[];        // languages with their own screenshots (else en)
  videoLangs: Lang[];       // public/video/<id>_<lang>.mp4
  tag: Record<Lang, string>;
  lead: Record<Lang, string>;
  feats: Record<Lang, string[]>;
  test?: { group: string; optIn: string; store: string; ios?: string };   // ios: the TestFlight public link
}

export const GAMES: Game[] = [
  {
    id: "hoplow", name: "Hoplow", accent: "#FF9E40", status: "test",
    shots: ["2_run", "3_fox", "8_wardrobe", "6_tunnel", "5_win"], shotLangs: ["en", "pl"], videoLangs: ["en", "pl"],
    tag: { en: "Swipe the bunny home! Cozy sliding puzzles, carrots, foxes and hats to collect.",
           pl: "Przesuń królika do nory! Przytulne łamigłówki, marchewki, lisy i czapeczki." },
    lead: { en: "Swipe and the bunny runs until something stops it – a rock, a bush, the edge of the field. Pick up every carrot, then dive into the burrow.",
            pl: "Przesuń palcem, a królik biegnie, aż coś go zatrzyma – kamień, krzak, skraj łąki. Zbierz wszystkie marchewki i wskocz do nory." },
    feats: { en: ["120 puzzles in 6 worlds and a new daily puzzle for two years", "Mud, a fox that follows you, moles, arrow stones and tunnels", "Stars for the fewest moves; undo as often as you like", "Dress the bunny up: hats, glasses, scarves and six furs", "Mushrooms grow, birds fly over, bunny friends come to wave"],
             pl: ["120 łamigłówek w 6 światach i nowa zagadka dnia przez dwa lata", "Błoto, lis, który idzie za tobą, krety, kamienie ze strzałką i tunele", "Gwiazdki za najmniej ruchów; cofaj, ile chcesz", "Przebierz królika: czapki, okulary, szaliki i sześć futerek", "Rosną grzyby, przelatują ptaki, przybiegają pomachać inne króliki"] },
    test: { group: "https://groups.google.com/g/qkix-testers",
            optIn: "https://play.google.com/apps/testing/eu.qkix.hoplow",
            ios: "https://testflight.apple.com/join/VVYUtheM",
            store: "https://play.google.com/store/apps/details?id=eu.qkix.hoplow" },
  },
  {
    id: "inchway", name: "Inchway", accent: "#F5D46B", status: "test",
    shots: ["13_race_ghost", "3_warning", "7_winter", "9_city", "10_garage"], shotLangs: ["en", "pl"], videoLangs: ["en"],
    tag: { en: "Dodge traffic, read the road, don't crash – a pixel-art lane runner.",
           pl: "Omijaj auta, czytaj drogę, nie rozbij się – pixelowa jazda po pasach." },
    lead: { en: "Steer with a slider and weave through traffic on a five-lane highway. Cars signal before they change lanes, so the road tells you what comes next – if you read it.",
            pl: "Prowadzisz auto suwakiem i omijasz ruch na pięciopasmowej autostradzie. Auta włączają kierunkowskaz przed zmianą pasa – droga mówi, co się stanie, jeśli umiesz ją czytać." },
    feats: { en: ["Race a friend's ghost: share a code, they get the same road and race your car", "Breakdowns and road works are announced by a sign", "Ambulances, police and fire engines come from behind – make way", "Near-miss combos, coins and top-10 records", "Rain, snow, fog, night, tunnels and forks in four worlds", "Tune the car in the workshop, paint it in the garage"],
             pl: ["Wyścig z duchem kumpla: wyślij kod, on dostaje tę samą trasę i ściga się z twoim autem", "Awarie i roboty drogowe zapowiada znak", "Karetka, policja i straż nadjeżdżają z tyłu – zjedź im z drogi", "Combo za mijanie o włos, monety i top 10 rekordów", "Deszcz, śnieg, mgła, noc, tunele i rozjazdy w czterech światach", "Tuning w warsztacie, lakiery w garażu"] },
    test: { group: "https://groups.google.com/g/qkix-testers",
            optIn: "https://play.google.com/apps/testing/eu.qkix.inchway",
            ios: "https://testflight.apple.com/join/W53bVrXp",
            store: "https://play.google.com/store/apps/details?id=eu.qkix.inchway" },
  },
  {
    id: "brick-tanks", name: "Brick Tanks", accent: "#E0664C", status: "soon",
    shots: ["2_battle", "6_boss", "4_winter", "5_night", "8_hangar"], shotLangs: ["en"], videoLangs: ["en", "pl"],
    tag: { en: "Guard your flag in a brick maze – a one-thumb pixel tank battle.",
           pl: "Broń flagi w ceglanym labiryncie – pixelowa bitwa czołgów na jeden kciuk." },
    lead: { en: "Drive with the stick under the map – your tank fires by itself. Enemy tanks pour in from the top: blast through brick walls, hide in the trees and never let them reach the flag.",
            pl: "Jedziesz joystickiem pod mapą – czołg strzela sam. Wrogie czołgi nadciągają z góry: rozbijaj ceglane mury, chowaj się w krzakach i nie pozwól im dotrzeć do flagi." },
    feats: { en: ["A new maze every stage – no two runs are the same", "Light, fast, heavy, sniper and mine-laying tanks – and a boss every 5th stage", "Desert, winter ice and night battles lit by your headlights", "Daily missions and a daily map that is the same for everyone", "Upgrade the tank in the workshop, paint it in the hangar"],
             pl: ["Nowy labirynt w każdym etapie – żadna gra nie jest taka sama", "Lekkie, szybkie, ciężkie czołgi, snajperzy i minowce – a co 5 etapów boss", "Pustynia, zimowy lód i nocne bitwy w świetle reflektorów", "Misje dzienne i mapa dnia – ta sama dla wszystkich", "Ulepszenia w warsztacie, malowanie w hangarze"] },
  },
  {
    id: "gloomdeep", name: "Gloomdeep", accent: "#E8A54A", status: "dev",
    shots: ["2_dig", "3_ledges", "4_hint", "1_menu"], shotLangs: ["en", "pl"], videoLangs: [],
    tag: { en: "A dwarf, a pickaxe and a mine full of gems – a torchlit sliding puzzle.",
           pl: "Krasnolud, kilof i kopalnia pełna klejnotów – przesuwana łamigłówka w blasku pochodni." },
    lead: { en: "Swipe and the dwarf slides until something stops him – a pit prop, a stone column, the mine's wall. Gather every gem, then climb down the shaft. Harder than it looks: every level has one best route.",
            pl: "Przesuń palcem, a krasnolud sunie, aż coś go zatrzyma – stempel, kamienna kolumna, ściana kopalni. Zbierz wszystkie klejnoty i zejdź szybem w dół. Trudniejsze, niż wygląda: każdy poziom ma jedną najlepszą drogę." },
    feats: { en: ["Break cracked rock with your pickaxe", "Rotten boards hold you only once", "Mine carts, lava with steam vents and a creature that copies your moves", "Torchlit mine: shadows, drips, bats and a cart rattling by", "Dress your dwarf at the forge: beards, helmets, tunics and pickaxes"],
             pl: ["Rozbijaj popękane skały kilofem", "Spróchniałe deski utrzymają cię tylko raz", "Wagoniki, lawa z kominami pary i stwór, który powtarza twoje ruchy", "Kopalnia w blasku pochodni: cienie, kapiąca woda, nietoperze i przejeżdżający wagonik", "Ubierz krasnoluda w kuźni: brody, hełmy, kurtki i kilofy"] },
  },
  {
    id: "crosswoven", name: "Crosswoven", accent: "#D9545E", status: "test",
    shots: ["2_board", "4_solved", "5_sampler", "1_menu", "6_big"], shotLangs: ["en", "pl"], videoLangs: [],
    tag: { en: "Picture logic as cross-stitch – solve the grid, then watch it stitched thread by thread.",
           pl: "Obrazki logiczne jako haft krzyżykowy – rozwiąż siatkę i patrz, jak wyszywa się nitka po nitce." },
    lead: { en: "Fill the grid from the numbers beside each row and column. Every solved patch turns into a cross-stitched picture on linen and is sewn into your patchwork sampler. Calm and roomy: big squares, zoom for large patterns, hints that teach the logic.",
            pl: "Wypełnij siatkę według liczb przy wierszach i kolumnach. Każda rozwiązana łatka zamienia się w wyhaftowany krzyżykami obrazek na lnie i trafia do twojego wzornika z łatek. Spokojnie i przestronnie: duże kratki, powiększanie dużych wzorów, podpowiedzi, które uczą logiki." },
    feats: { en: ["Every solved patch is stitched in colour, thread by thread", "A patchwork sampler that fills up with your pictures and stars", "Tap a square or drag along a line; one switch for stitch and X", "Zoom and pan big 20×20 patterns", "Three to five hearts, stars for a clean solve, your best times"],
             pl: ["Każda rozwiązana łatka wyszywa się w kolorze, nitka po nitce", "Wzornik z łatek, który zapełnia się twoimi obrazkami i gwiazdkami", "Stuknij kratkę albo przeciągnij po linii; jeden przełącznik: krzyżyk albo X", "Powiększanie i przesuwanie dużych wzorów 20×20", "Od trzech do pięciu serc, gwiazdki za czyste rozwiązanie, najlepsze czasy"] },
    test: { group: "https://groups.google.com/g/qkix-testers",
            optIn: "https://play.google.com/apps/testing/eu.qkix.crosswoven",
            ios: "https://testflight.apple.com/join/7TTRqjYG",
            store: "https://play.google.com/store/apps/details?id=eu.qkix.crosswoven" },
  },
];
export const VIDEO_ORDER = ["inchway", "hoplow", "brick-tanks"];

export const SOCIALS = [
  { id: "youtube", name: "YouTube", handle: "@qkixgames", url: "https://www.youtube.com/@qkixgames", c: "#ff3b3b" },
  { id: "tiktok", name: "TikTok", handle: "@qkix.games", url: "https://www.tiktok.com/@qkix.games", c: "#2ff0e8" },
  { id: "instagram", name: "Instagram", handle: "@qkix.games", url: "https://www.instagram.com/qkix.games/", c: "#ff7ab6" },
  { id: "x", name: "X", handle: "@qkixgames", url: "https://x.com/qkixgames", c: "#ffffff" },
];
export const MAIL = "contact@qkix.eu";

const en = {
  title: "qkix – tiny pixel games for one thumb",
  description: "qkix makes small, cozy pixel-art games for Android: Hoplow, Inchway and Brick Tanks.",
  nav_games: "Games", nav_videos: "Videos", nav_about: "About", nav_contact: "Contact",
  scene_label: "A pixel meadow with a bunny, a highway with cars and a brick maze with a tank",
  scene_tag: "Live: all three games in one meadow",
  hero_h1: "Tiny pixel games <em>for one thumb.</em>",
  hero_p: "qkix makes small, cozy pixel-art games for Android: quick to pick up, hard to put down. No timers, no energy bars, play offline.",
  hero_cta: "See the games", hero_cta2: "Watch trailers",
  test_eyebrow: "Closed test", test_h2: "Play before the launch", test_p: "Three games are in Google Play's closed test. Join our testers group once, then tap Become a tester for each game - free, on any Android phone.", test_p_ios: "Three games are in testing - free, before anyone else. On Android: join our testers group once, then tap Become a tester for each game. On iPhone: one tap opens the game in Apple's TestFlight app.", test_btn_ios: "{name} on iPhone", ios_small: "Test on", info_platform_ios: "Android, iPhone (TestFlight)", test_btn: "Test {name}",
  games_eyebrow: "Games", games_h2: "Five games, one arcade",
  videos_eyebrow: "Videos", videos_h2: "See them move",
  about_eyebrow: "About", about_h2: "A one-person studio",
  about_p1: "qkix is one developer in Poland making games you can play for a minute on the bus and still want to open a month later.",
  about_p2: "Every game is made to be picked up in seconds: one thumb, short rounds, clear rules - and a little world you want to come back to, with new levels, worlds and outfits along the way.",
  about_p3: "The games are free. Ads are one small banner and videos you choose to watch; you can buy cosmetics, never progress.",
  fact_games: "games", fact_langs: "languages in every game", fact_puzzles: "puzzles in Hoplow", fact_energy: "energy bars or timers",
  contact_eyebrow: "Contact", contact_h2: "Say hi", copy: "Copy", copied: "Copied",
  status_test: "Closed test", status_soon: "Coming soon", status_dev: "In development",
  play_small: "Get it on", play_soon: "Soon on", tester: "Become a tester", trailer: "Trailer",
  back: "All games", privacy: "Privacy policy", features: "What's inside", shots: "Screenshots",
  info_platform: "Platform", info_platform_v: "Android (iOS later)", info_price: "Price", info_price_v: "Free, cosmetic in-app purchases",
  info_langs: "Languages", info_langs_v: "EN PL ES PT DE FR IT RU TR ID",
  foot_privacy: "Privacy:",
  pp_title: "Privacy Policy", pp_updated: "Last updated", pp_toc: "On this page", pp_short: "In short",
  pp_short_items: ["No account and no name or e-mail - your progress stays on your phone (and in your own Google account if you use backup or Play Games).",
    "Anonymous gameplay statistics only if you say YES - and you can switch them off in OPTIONS.",
    "Ads come from Google AdMob; in the EEA, UK and Switzerland you choose your consent first. Purchases go through Google Play."],
  pp_note: "", pp_back: "Back to the game",
  t_title: "Become a tester", t_lead: "Help us launch {name} on Google Play: play it before anyone else - free, on an Android phone.",
  t_lead_ios: "Help us launch {name}: play it before anyone else - free, on an Android phone or an iPhone.",
  t_android: "On Android", t_iphone: "On iPhone",
  ti_p: "Install Apple's TestFlight app from the App Store, then open the invite on the iPhone - that's it, no group to join.",
  ti_b: "Join on TestFlight", ti_store: "Get TestFlight",
  t1: "Join the testers group", t1p: "Sign in with the Google account your Play Store uses and tap Join group.", t1b: "Join the group",
  t2: "Become a tester", t2p: "On Google Play's test page tap Become a tester - with the same account.", t2b: "Become a tester",
  t3: "Install the game", t3p: "Get it from the Play Store - the link is on the page from step 2, or here.", t3b: "Google Play",
  t_warn: "Play whenever you like and send feedback to contact@qkix.eu - every note helps before the launch.",
  t_tip: "Several Google accounts on the phone? Check that the Play Store (your avatar, top right) uses the account that joined the group. If the store says the item wasn't found, wait a few minutes or restart the phone.",
  close: "Close", prev: "Previous", next: "Next", lang_label: "Language", nav_label: "Main",
  nf_title: "Lost in the maze", nf_p: "This page isn't here (any more). The games are just one hop away.", nf_cta: "Back home",
};
const pl: typeof en = {
  title: "qkix – małe pixelowe gry na jeden kciuk",
  description: "qkix robi małe, przytulne gry pixel art na Androida: Hoplow, Inchway i Brick Tanks.",
  nav_games: "Gry", nav_videos: "Filmy", nav_about: "O nas", nav_contact: "Kontakt",
  scene_label: "Pixelowa łąka z królikiem, autostrada z autami i ceglany labirynt z czołgiem",
  scene_tag: "Na żywo: trzy gry na jednej łące",
  hero_h1: "Małe pixelowe gry <em>na jeden kciuk.</em>",
  hero_p: "qkix robi małe, przytulne gry pixel art na Androida: łatwo zacząć, trudno odłożyć. Bez limitów czasu i energii, gra offline.",
  hero_cta: "Zobacz gry", hero_cta2: "Obejrzyj trailery",
  test_eyebrow: "Zamknięte testy", test_h2: "Zagraj przed premierą", test_p: "Trzy gry są w zamkniętych testach Google Play. Dołączasz raz do grupy testerów, a potem przy każdej grze klikasz „Zostań testerem” - za darmo, na każdym telefonie z Androidem.", test_p_ios: "Trzy gry są w testach - za darmo, przed wszystkimi. Na Androidzie: dołączasz raz do grupy testerów, a potem przy każdej grze klikasz „Zostań testerem”. Na iPhonie: jedno kliknięcie otwiera grę w aplikacji TestFlight od Apple.", test_btn_ios: "{name} na iPhonie", ios_small: "Testuj w", info_platform_ios: "Android, iPhone (TestFlight)", test_btn: "Testuj {name}",
  games_eyebrow: "Gry", games_h2: "Pięć gier, jeden salon",
  videos_eyebrow: "Filmy", videos_h2: "Zobacz je w ruchu",
  about_eyebrow: "O nas", about_h2: "Jednoosobowe studio",
  about_p1: "qkix to jeden twórca z Polski, który robi gry na minutę w autobusie, do których chce się wracać miesiąc później.",
  about_p2: "Każda gra ma dać się złapać w kilka sekund: jeden kciuk, krótkie rundy, jasne zasady - i mały świat, do którego chce się wracać, z nowymi poziomami, światami i strojami po drodze.",
  about_p3: "Gry są darmowe. Reklama to jeden mały baner i filmiki, które sam wybierasz; kupić można wygląd, nigdy postęp.",
  fact_games: "gry", fact_langs: "języków w każdej grze", fact_puzzles: "łamigłówek w Hoplow", fact_energy: "pasków energii i limitów",
  contact_eyebrow: "Kontakt", contact_h2: "Napisz do nas", copy: "Kopiuj", copied: "Skopiowano",
  status_test: "Zamknięte testy", status_soon: "Wkrótce", status_dev: "W produkcji",
  play_small: "Pobierz z", play_soon: "Wkrótce w", tester: "Zostań testerem", trailer: "Trailer",
  back: "Wszystkie gry", privacy: "Polityka prywatności", features: "Co w środku", shots: "Zrzuty ekranu",
  info_platform: "Platforma", info_platform_v: "Android (później iOS)", info_price: "Cena", info_price_v: "Za darmo, zakupy wyglądu w grze",
  info_langs: "Języki", info_langs_v: "EN PL ES PT DE FR IT RU TR ID",
  foot_privacy: "Prywatność:",
  pp_title: "Polityka prywatności", pp_updated: "Ostatnia zmiana", pp_toc: "Na tej stronie", pp_short: "W skrócie",
  pp_short_items: ["Bez konta, imienia i e-maila - postęp zostaje w telefonie (i na twoim koncie Google, jeśli używasz kopii zapasowej lub Gier Play).",
    "Anonimowe statystyki gry tylko, jeśli zgodzisz się na TAK - wyłączysz je w OPCJACH.",
    "Reklamy z Google AdMob; w EOG, Wielkiej Brytanii i Szwajcarii najpierw wybierasz zgodę. Zakupy obsługuje Google Play."],
  pp_note: "Pełna treść polityki jest po angielsku - to wersja wiążąca.", pp_back: "Wróć do gry",
  t_title: "Zostań testerem", t_lead: "Pomóż nam wydać {name} w Google Play: zagraj przed premierą - za darmo, na telefonie z Androidem.",
  t_lead_ios: "Pomóż nam wydać {name}: zagraj przed premierą - za darmo, na telefonie z Androidem albo na iPhonie.",
  t_android: "Na Androidzie", t_iphone: "Na iPhonie",
  ti_p: "Zainstaluj aplikację TestFlight od Apple z App Store, a potem otwórz zaproszenie na iPhonie - i gotowe, bez zapisywania do grupy.",
  ti_b: "Dołącz w TestFlight", ti_store: "Pobierz TestFlight",
  t1: "Dołącz do grupy testerów", t1p: "Zaloguj się kontem Google, którego używasz w Sklepie Play, i kliknij „Dołącz do grupy”.", t1b: "Dołącz do grupy",
  t2: "Zostań testerem", t2p: "Na stronie testów Google Play kliknij „Zostań testerem” - tym samym kontem.", t2b: "Zostań testerem",
  t3: "Zainstaluj grę", t3p: "Pobierz ją ze Sklepu Play - link jest na stronie z kroku 2 albo tutaj.", t3b: "Google Play",
  t_warn: "Graj, kiedy chcesz, a uwagi wysyłaj na contact@qkix.eu - każda pomaga przed premierą.",
  t_tip: "Masz w telefonie kilka kont Google? Sprawdź, czy Sklep Play (awatar w prawym górnym rogu) używa konta, którym dołączyłeś do grupy. Jeśli Sklep pisze „nie znaleziono elementu”, odczekaj kilka minut albo uruchom telefon ponownie.",
  close: "Zamknij", prev: "Poprzedni", next: "Następny", lang_label: "Język", nav_label: "Menu",
  nf_title: "Zgubiony w labiryncie", nf_p: "Tej strony tu nie ma (już). Gry są o jeden skok stąd.", nf_cta: "Strona główna",
};
export const T = { en, pl };
export type Strings = typeof en;

/** "/" + path in a language: en has no prefix, pl lives under /pl/. */
export function href(lang: Lang, path = ""): string {
  const p = path.replace(/^\/+/, "");
  return (lang === "en" ? "/" : "/pl/") + p;
}
