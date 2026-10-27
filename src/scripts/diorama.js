// The home page's live diorama: Hoplow's meadow | Inchway's highway | Brick Tanks' maze, drawn
// at 1 game pixel per canvas pixel and scaled up by whole numbers (CSS). Sprites: public/img/sprites
// (tools/sync_assets.py copies them from the games).
const NAMES = ["grass", "flowers0", "flowers1", "carrot", "shadow", "sparkle0", "sparkle", "heart", "bfly0", "bfly1",
  "tree0", "tree1", "tree2", "tree3", "asphalt", "player", "car0", "car1", "car2", "car3", "brick", "bush", "tank",
  ...["side", "left", "down"].flatMap(d => ["idle0", "idle1", "hop", "blink"].map(f => `bunny_${d}_${f}`)),
  "friend_side_idle0", "friend_side_hop", "friend_left_idle0", "friend_left_hop",
  ...["idle0", "idle1", "blink", "wave0", "wave1"].map(f => `friend_down_${f}`)];
const IMG = {};
for (const k of NAMES) { IMG[k] = new Image(); IMG[k].src = `/img/sprites/${k}.png`; }
const cv = document.getElementById("scene");
const cx = cv.getContext("2d");
const H = 92;
let W = 200, SC = 3, world = null, last = 0;
const rnd = (a, b) => a + Math.random() * (b - a);
function layout() {
  const w = cv.parentElement.clientWidth;
  SC = w >= 1000 ? 4 : w >= 560 ? 3 : 2;
  W = Math.ceil(w / SC);
  cv.width = W; cv.height = H;
  cv.style.height = (H * SC) + "px";
  cx.imageSmoothingEnabled = false;
  build();
}
function build() {
  const roadX = Math.round(W * (W < 260 ? 0.38 : 0.42)), roadW = 66;
  const mazeX = roadX + roadW + 8;
  const grass = [];
  for (let y = 0; y < Math.ceil(H / 16); y++) for (let x = 0; x < Math.ceil(W / 16); x++) grass.push((x * 7 + y * 13 + x * y) % 4);
  const deco = [];
  for (let i = 0; i < W / 9; i++) deco.push({x: Math.floor(rnd(0, roadX - 12)), y: Math.floor(rnd(4, H - 10)), k: i % 2 ? "flowers0" : "flowers1"});
  const trees = [];
  for (let x = -10; x < roadX - 20; x += Math.floor(rnd(18, 28))) { trees.push({x, y: Math.floor(rnd(-14, -6)), v: Math.floor(rnd(0, 4))}); }
  for (let x = -6; x < roadX - 20; x += Math.floor(rnd(22, 34))) { trees.push({x, y: H - 22 + Math.floor(rnd(0, 6)), v: Math.floor(rnd(0, 4))}); }
  // brick maze: a few walls of 12 px bricks and bushes
  const bricks = [], bushes = [];
  const cols = Math.max(2, Math.floor((W - mazeX) / 12));
  for (let c = 0; c < cols; c++) {
    if (c % 3 !== 1) { bricks.push({x: mazeX + c * 12, y: 8, alive: true, t: 0}); bricks.push({x: mazeX + c * 12, y: 20, alive: true, t: 0}); }
    if (c % 4 === 2) bushes.push({x: mazeX + c * 12, y: H - 22});
    if (c % 4 === 0) { bricks.push({x: mazeX + c * 12, y: H - 22, alive: true, t: 0}); bricks.push({x: mazeX + c * 12, y: H - 10, alive: true, t: 0}); }
  }
  world = {
    roadX, roadW, mazeX, grass, deco, trees, bricks, bushes, scroll: 0,
    cars: [{lane: 0, y: 4, k: "car1"}, {lane: 1, y: -60, k: "car2"}],
    player: {lane: 1, x: 0, tx: 0, y: H - 34, glint: 0}, spawn: 1.2,
    bunny: {x: Math.floor(roadX * 0.35), y: Math.floor(H * 0.55), face: "side", hop: 0, wait: 1, tx: 0, ty: 0},
    carrot: null, fx: [],
    tank: {x: mazeX + 4, y: 38, dir: 1, f: 0, t: 0, shell: null, cool: 2},
    fly: {x: rnd(10, roadX - 10), y: rnd(20, 60), t: 0},
    friend: {state: "away", t: 3, x: -16, y: 40, spot: 0},
  };
  newCarrot();
}
function newCarrot() {
  const w = world;
  w.carrot = {x: Math.floor(rnd(14, w.roadX - 26)), y: Math.floor(rnd(26, H - 42))};   // clear of the tree rows
}
function step(dt) {
  const w = world;
  w.scroll = (w.scroll + dt * 30) % 33;
  // the gold car overtakes: traffic drifts down the screen at one pace (so nobody rear-ends anybody),
  // a new car comes in at the top only where both lanes stay passable, the gold car moves over in time
  const TRAFFIC = 26, GAP = 46;
  for (const c of w.cars) c.y += TRAFFIC * dt;
  w.cars = w.cars.filter(c => c.y < H + 4);
  w.spawn -= dt;
  if (w.spawn <= 0) {
    const lane = Math.random() < 0.5 ? 0 : 1;
    const own = w.cars.some(c => c.lane === lane && c.y < GAP - 30);
    const other = w.cars.some(c => c.lane !== lane && c.y < 62);    // close in the other lane would wall the road
    if (!own && !other) { w.cars.push({lane, y: -30, k: "car" + Math.floor(rnd(0, 4))}); w.spawn = rnd(0.9, 2.0); }
    else w.spawn = 0.25;
  }
  const p = w.player;
  const ahead = l => w.cars.some(c => c.lane === l && c.y + 28 > p.y - 30 && c.y < p.y + 28);
  const moving = Math.abs(p.x - p.tx) > 1;
  if (!moving && ahead(p.lane) && !ahead(1 - p.lane)) p.lane = 1 - p.lane;
  p.tx = w.roadX + 8 + p.lane * 33;
  p.x = p.x ? p.x + (p.tx - p.x) * Math.min(1, dt * 4) : p.tx;
  if ((p.glint -= dt) <= 0) {                       // the gold paint twinkles
    p.glint = rnd(0.25, 0.6);
    w.fx.push({k: Math.random() < 0.5 ? "sparkle0" : "sparkle", x: p.x + rnd(1, 13), y: p.y + rnd(2, 24), vx: 0, vy: 0, t: 0.15});
  }
  // the bunny hops to the carrot
  const b = w.bunny;
  if (b.hop > 0) {
    b.hop -= dt;
    const k = Math.min(1, dt / 0.25);
    b.x += (b.tx - b.x) * k * 2.2; b.y += (b.ty - b.y) * k * 2.2;
    if (b.hop <= 0) { b.x = b.tx; b.y = b.ty; b.wait = rnd(0.15, 0.6); }
  } else if ((b.wait -= dt) <= 0 && w.carrot) {
    const dx = w.carrot.x - b.x, dy = w.carrot.y - b.y, d = Math.hypot(dx, dy);
    if (d < 6) {
      for (let i = 0; i < 5; i++) w.fx.push({k: "sparkle", x: w.carrot.x + 2, y: w.carrot.y, vx: rnd(-20, 20), vy: rnd(-40, -15), t: 0});
      w.fx.push({k: "heart", x: b.x + 6, y: b.y - 20, vx: 0, vy: -14, t: 0});
      w.carrot = null; setTimeout(newCarrot, 900); b.wait = 1;
    } else {
      const s = Math.min(9, d);
      b.tx = b.x + dx / d * s; b.ty = b.y + dy / d * s; b.hop = 0.25;
      b.face = Math.abs(dx) > 2 ? (dx > 0 ? "side" : "left") : b.face;
    }
  }
  // the tank patrols the gap and shoots a brick now and then
  const tk = w.tank;
  tk.t += dt; tk.f = Math.floor(tk.t * 8) % 2;
  const minX = w.mazeX, maxX = Math.max(w.mazeX + 4, W - 16);
  tk.x += (tk.dir === 1 ? 1 : -1) * 16 * dt;
  if (tk.x > maxX) { tk.x = maxX; tk.dir = 3; }
  if (tk.x < minX) { tk.x = minX; tk.dir = 1; }
  tk.cool -= dt;
  if (tk.cool <= 0 && !tk.shell) {
    const target = w.bricks.filter(br => br.alive && br.y < 30 && Math.abs(br.x + 6 - (tk.x + 6)) < 8)[0];
    if (target) { tk.shell = {x: tk.x + 5, y: tk.y - 2, target}; tk.cool = rnd(1.4, 3); tk.aim = 0.35; }
    else tk.cool = 0.3;
  }
  if (tk.aim > 0) tk.aim -= dt;
  if (tk.shell) {
    tk.shell.y -= 90 * dt;
    if (tk.shell.y < tk.shell.target.y + 10) {
      tk.shell.target.alive = false; tk.shell.target.t = 4;
      for (let i = 0; i < 6; i++) w.fx.push({k: "bit", x: tk.shell.x, y: tk.shell.target.y + 8, vx: rnd(-30, 30), vy: rnd(-30, 10), t: 0, c: i % 2 ? "#b5583a" : "#e0a080"});
      tk.shell = null;
    }
  }
  for (const br of w.bricks) if (!br.alive && (br.t -= dt) <= 0) br.alive = true;
  // a young bunny hops in from the left, waves at us (a heart), hops back
  const fr = w.friend;
  fr.t -= dt;
  if (fr.state === "away" && fr.t <= 0) { fr.state = "in"; fr.x = -16; fr.y = Math.floor(rnd(30, H - 40)); fr.spot = Math.floor(rnd(12, Math.max(14, w.roadX * 0.3))); }
  else if (fr.state === "in") { fr.x += 30 * dt; if (fr.x >= fr.spot) { fr.x = fr.spot; fr.state = "wave"; fr.t = 2.4; w.fx.push({k: "heart", x: fr.x + 4, y: fr.y - 18, vx: 0, vy: -12, t: 0}); } }
  else if (fr.state === "wave" && fr.t <= 0) fr.state = "out";
  else if (fr.state === "out") { fr.x -= 30 * dt; if (fr.x < -18) { fr.state = "away"; fr.t = rnd(7, 13); } }
  w.fly.t += dt; w.fly.x += Math.sin(w.fly.t * 0.7) * 12 * dt; w.fly.y += Math.cos(w.fly.t * 1.1) * 8 * dt;
  for (const f of w.fx) { f.t += dt; f.x += f.vx * dt; f.y += f.vy * dt; if (f.k === "bit") f.vy += 90 * dt; }
  w.fx = w.fx.filter(f => f.t < (f.k === "heart" ? 0.9 : 0.5));
  // a car that would still touch the gold car (it could not move over) waits a moment above it
  for (const c of w.cars) if (c.lane === p.lane && Math.abs(p.x - p.tx) < 2 && c.y + 28 > p.y - 2 && c.y < p.y) c.y = p.y - 30;
}
function img(k, x, y) { const i = IMG[k]; if (i && i.complete) cx.drawImage(i, Math.floor(x), Math.floor(y)); }
function draw(time) {
  const w = world;
  for (let y = 0, n = 0; y < Math.ceil(H / 16); y++) for (let x = 0; x < Math.ceil(W / 16); x++, n++)
    if (IMG.grass.complete) cx.drawImage(IMG.grass, w.grass[n] * 16, 0, 16, 16, x * 16, y * 16, 16, 16);
  for (const d of w.deco) img(d.k, d.x, d.y);
  // the maze's dark floor
  cx.fillStyle = "#2b2f3a"; cx.fillRect(w.mazeX - 4, 0, W - w.mazeX + 4, H);
  cx.fillStyle = "#232631"; for (let y = 0; y < H; y += 12) for (let x = w.mazeX - 4; x < W; x += 12) if ((x + y) % 24 === 0) cx.fillRect(x, y, 12, 12);
  // the road
  for (let y = -33; y < H + 33; y += 33) for (let i = 0; i < 2; i++) img("asphalt", w.roadX + i * 33, y + w.scroll);
  cx.fillStyle = "#e8e8e8"; cx.fillRect(w.roadX, 0, 1, H); cx.fillRect(w.roadX + w.roadW - 1, 0, 1, H);
  for (let y = -12 + (w.scroll * 1.2) % 12; y < H; y += 12) cx.fillRect(w.roadX + 33, Math.floor(y), 1, 6);
  cx.fillStyle = "#6d6253"; cx.fillRect(w.roadX - 3, 0, 3, H); cx.fillRect(w.roadX + w.roadW, 0, 3, H);
  for (const c of w.cars) img(c.k, w.roadX + 8 + c.lane * 33, c.y);
  img("player", w.player.x, w.player.y);
  // bricks, bushes, tank
  for (const br of w.bricks) if (br.alive) img("brick", br.x, br.y);
  if (w.tank.shell) { cx.fillStyle = "#ffe36b"; cx.fillRect(Math.floor(w.tank.shell.x), Math.floor(w.tank.shell.y), 2, 3); }
  const tk = w.tank, dir = w.tank.aim > 0 ? 0 : tk.dir;
  if (IMG.tank.complete) cx.drawImage(IMG.tank, tk.f * 12, dir * 12, 12, 12, Math.floor(tk.x), tk.y, 12, 12);
  for (const bu of w.bushes) img("bush", bu.x, bu.y);
  // carrot, bunny
  if (w.carrot) { img("shadow", w.carrot.x, w.carrot.y + 10); img("carrot", w.carrot.x, w.carrot.y + Math.round(Math.sin(time / 300))); }
  const b = w.bunny;
  const lift = b.hop > 0 ? Math.sin((1 - b.hop / 0.25) * Math.PI) * 4 : 0;
  const fr = b.hop > 0 ? "hop" : (Math.floor(time / 450) % 2 ? "idle1" : "idle0");
  img("shadow", b.x + 4, b.y + 15);
  img(`bunny_${b.face}_${(time % 3100) < 120 && b.hop <= 0 ? "blink" : fr}`, b.x, b.y - lift);
  const fd = w.friend;
  if (fd.state !== "away") {
    const hopping = fd.state === "in" || fd.state === "out";
    const up = hopping ? Math.abs(Math.sin(time / 170 * Math.PI)) * 3 : 0;
    const k = fd.state === "in" ? (up > 1 ? "friend_side_hop" : "friend_side_idle0")
      : fd.state === "out" ? (up > 1 ? "friend_left_hop" : "friend_left_idle0")
      : Math.floor(time / 90) % 2 ? "friend_down_wave0" : "friend_down_wave1";
    img("shadow", fd.x, fd.y + 9);
    img(k, fd.x, fd.y - up);
  }
  for (const tr of w.trees.filter(tr => tr.y < 0)) img("tree" + tr.v, tr.x, tr.y);
  for (const tr of w.trees.filter(tr => tr.y >= 0)) img("tree" + tr.v, tr.x, tr.y);
  img(Math.floor(time / 110) % 2 ? "bfly0" : "bfly1", w.fly.x, w.fly.y);
  for (const f of w.fx) {
    if (f.k === "bit") { cx.fillStyle = f.c; cx.fillRect(Math.floor(f.x), Math.floor(f.y), 1, 1); }
    else img(f.k, f.x, f.y);
  }
}
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
  if (!reduce) step(dt);
  draw(now);
  if (!reduce) requestAnimationFrame(loop);
}
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
window.addEventListener("resize", layout);
layout();
Promise.all(Object.values(IMG).map(i => i.decode().catch(() => {}))).then(() => requestAnimationFrame(loop));
