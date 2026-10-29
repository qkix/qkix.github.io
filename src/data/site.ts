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
  test?: { group: string; optIn: string; store: string };
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
  games_eyebrow: "Games", games_h2: "Three games, one arcade",
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
  t1: "Join the testers group", t1p: "Sign in with the Google account your Play Store uses and tap Join group.", t1b: "Join the group",
  t2: "Become a tester", t2p: "On Google Play's test page tap Become a tester - with the same account.", t2b: "Become a tester",
  t3: "Install the game", t3p: "Get it from the Play Store - the link is on the page from step 2, or here.", t3b: "Google Play",
  t_warn: "<b>Please stay in the test for 14 days</b> - Google needs that before the game can launch for everyone. Play whenever you like and send feedback to contact@qkix.eu.",
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
  games_eyebrow: "Gry", games_h2: "Trzy gry, jeden salon",
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
  t1: "Dołącz do grupy testerów", t1p: "Zaloguj się kontem Google, którego używasz w Sklepie Play, i kliknij „Dołącz do grupy”.", t1b: "Dołącz do grupy",
  t2: "Zostań testerem", t2p: "Na stronie testów Google Play kliknij „Zostań testerem” - tym samym kontem.", t2b: "Zostań testerem",
  t3: "Zainstaluj grę", t3p: "Pobierz ją ze Sklepu Play - link jest na stronie z kroku 2 albo tutaj.", t3b: "Google Play",
  t_warn: "<b>Nie wypisuj się przez 14 dni</b> - tyle Google wymaga, zanim gra trafi do wszystkich. Graj, kiedy chcesz, a uwagi wysyłaj na contact@qkix.eu.",
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
