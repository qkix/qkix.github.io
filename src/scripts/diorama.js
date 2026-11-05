// The home page's live diorama: a strip of panels, one game in each (Hoplow's meadow, Inchway's highway,
// Brick Tanks' battlefield, Gloomdeep's mine, Crosswoven's table). Two or three panels fit; every
// ROTATE seconds one panel blows up in a pixel blast and the next game takes its place, so all five
// come round. Drawn at 1 game pixel per canvas pixel and scaled up by whole numbers (CSS).
// Sprites: public/img/sprites (tools/sync_assets.py copies them from the games).
const NAMES = ["grass", "flowers0", "flowers1", "carrot", "shadow", "sparkle0", "sparkle", "heart", "bfly0", "bfly1",
  "tree0", "tree1", "tree2", "tree3", "road", "player", "car0", "car1", "car2", "car3", "brick", "bush", "tank", "earth", "brickfront",
  ...["side", "left", "down"].flatMap(d => ["idle0", "idle1", "hop", "blink"].map(f => `bunny_${d}_${f}`)),
  "friend_side_idle0", "friend_side_hop", "friend_left_idle0", "friend_left_hop",
  ...["idle0", "idle1", "blink", "wave0", "wave1"].map(f => `friend_down_${f}`),
  "mfloor", "mwall", "torch0", "torch1", "torch2", "glow", "gem0", "gem1", "gem2", "rock", "rockshadow", "dshadow", "crystals",
  ...["side", "left", "up", "down"].flatMap(d => [0, 1, 2, 3].map(f => `dwarf_${d}_run${f}`)), ...[0, 1, 2, 3].map(f => `dwarf_down_idle${f}`),
  "table", "cat0", "cat1", "spool", "yarn", "thimble"];
const cv = document.getElementById("scene");
const tag = cv.parentElement.querySelector(".tag");
const IMG = {};
for (const k of NAMES) { IMG[k] = new Image(); IMG[k].src = `/img/sprites/${k}.png?v=${cv.dataset.v || ""}`; }
const cx = cv.getContext("2d");
const H = 92;
const ROTATE = [15, 20];          // s a panel stays before the next game blows it away
const BLAST = 1.0;                // s of the blast; the new game shows from its half
const SEAM = "#12141f";           // the line between panels (the band's own bottom border)
const BOOM = ["#ffffff", "#ffec96", "#faaa3c", "#dc5028", "#5a3c32"];
const TITLES = {meadow: "Hoplow", highway: "Inchway", maze: "Brick Tanks", mine: "Gloomdeep", table: "Crosswoven"};
let W = 200, SC = 3, last = 0, panels = [], queue = [], next = 0, turn = 0;
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
function img(k, x, y) { const i = IMG[k]; if (i && i.complete) cx.drawImage(i, Math.floor(x), Math.floor(y)); }
function tile(k, x0, x1, ox = 0, oy = 0) {    // a texture repeated over the panel's columns x0..x1, the whole height
  const i = IMG[k]; if (!i || !i.complete) return;
  for (let y = -oy; y < H; y += i.height) for (let x = x0 - ox; x < x1; x += i.width) cx.drawImage(i, x, y);
}

// ---- Hoplow: a bunny hops to carrots, a friend waves, trees top and bottom
function meadow(x0, w) {
  const x1 = x0 + w, grass = [], deco = [], trees = [];
  for (let y = 0; y < Math.ceil(H / 16); y++) for (let x = 0; x < Math.ceil(w / 16) + 1; x++) grass.push((x * 7 + y * 13 + x * y) % 4);
  for (let i = 0; i < w / 9; i++) deco.push({x: x0 + Math.floor(rnd(0, w - 12)), y: Math.floor(rnd(4, H - 10)), k: i % 2 ? "flowers0" : "flowers1"});
  for (let x = x0 - 10; x < x1 - 8; x += Math.floor(rnd(18, 28))) trees.push({x, y: Math.floor(rnd(-14, -6)), v: Math.floor(rnd(0, 4))});
  for (let x = x0 - 6; x < x1 - 8; x += Math.floor(rnd(22, 34))) trees.push({x, y: H - 22 + Math.floor(rnd(0, 6)), v: Math.floor(rnd(0, 4))});
  const s = {carrot: null, fx: [], wait: 0,
    bunny: {x: x0 + Math.floor(w * 0.35), y: Math.floor(H * 0.55), face: "side", hop: 0, wait: 1, tx: 0, ty: 0},
    fly: {x: x0 + rnd(10, w - 10), y: rnd(20, 60), t: 0},
    friend: {state: "away", t: 3, x: x0 - 16, y: 40, spot: 0}};
  const newCarrot = () => { s.carrot = {x: x0 + Math.floor(rnd(14, w - 26)), y: Math.floor(rnd(26, H - 42))}; };
  newCarrot();
  return {
    step(dt) {
      const b = s.bunny;
      if (!s.carrot && (s.wait -= dt) <= 0) newCarrot();
      if (b.hop > 0) {
        b.hop -= dt;
        const k = Math.min(1, dt / 0.25);
        b.x += (b.tx - b.x) * k * 2.2; b.y += (b.ty - b.y) * k * 2.2;
        if (b.hop <= 0) { b.x = b.tx; b.y = b.ty; b.wait = rnd(0.15, 0.6); }
      } else if ((b.wait -= dt) <= 0 && s.carrot) {
        const dx = s.carrot.x - b.x, dy = s.carrot.y - b.y, d = Math.hypot(dx, dy);
        if (d < 6) {
          for (let i = 0; i < 5; i++) s.fx.push({k: "sparkle", x: s.carrot.x + 2, y: s.carrot.y, vx: rnd(-20, 20), vy: rnd(-40, -15), t: 0});
          s.fx.push({k: "heart", x: b.x + 6, y: b.y - 20, vx: 0, vy: -14, t: 0});
          s.carrot = null; s.wait = 0.9; b.wait = 1;
        } else {
          const st = Math.min(9, d);
          b.tx = b.x + dx / d * st; b.ty = b.y + dy / d * st; b.hop = 0.25;
          b.face = Math.abs(dx) > 2 ? (dx > 0 ? "side" : "left") : b.face;
        }
      }
      const fr = s.friend;                    // a young bunny hops in from the left, waves (a heart), hops back
      fr.t -= dt;
      if (fr.state === "away" && fr.t <= 0) { fr.state = "in"; fr.x = x0 - 16; fr.y = Math.floor(rnd(30, H - 40)); fr.spot = x0 + Math.floor(rnd(12, Math.max(14, w * 0.3))); }
      else if (fr.state === "in") { fr.x += 30 * dt; if (fr.x >= fr.spot) { fr.x = fr.spot; fr.state = "wave"; fr.t = 2.4; s.fx.push({k: "heart", x: fr.x + 4, y: fr.y - 18, vx: 0, vy: -12, t: 0}); } }
      else if (fr.state === "wave" && fr.t <= 0) fr.state = "out";
      else if (fr.state === "out") { fr.x -= 30 * dt; if (fr.x < x0 - 18) { fr.state = "away"; fr.t = rnd(7, 13); } }
      const f = s.fly;
      f.t += dt; f.x += Math.sin(f.t * 0.7) * 12 * dt; f.y += Math.cos(f.t * 1.1) * 8 * dt;
      f.x = Math.min(x1 - 12, Math.max(x0 + 2, f.x));
      for (const p of s.fx) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      s.fx = s.fx.filter(p => p.t < (p.k === "heart" ? 0.9 : 0.5));
    },
    draw(time) {
      const cols = Math.ceil(w / 16) + 1;
      if (IMG.grass.complete) for (let y = 0, n = 0; y < Math.ceil(H / 16); y++) for (let x = 0; x < cols; x++, n++)
        cx.drawImage(IMG.grass, grass[n] * 16, 0, 16, 16, x0 + x * 16, y * 16, 16, 16);
      for (const d of deco) img(d.k, d.x, d.y);
      if (s.carrot) { img("shadow", s.carrot.x, s.carrot.y + 10); img("carrot", s.carrot.x, s.carrot.y + Math.round(Math.sin(time / 300))); }
      const b = s.bunny;
      const lift = b.hop > 0 ? Math.sin((1 - b.hop / 0.25) * Math.PI) * 4 : 0;
      const fr = b.hop > 0 ? "hop" : (Math.floor(time / 450) % 2 ? "idle1" : "idle0");
      img("shadow", b.x + 4, b.y + 15);
      img(`bunny_${b.face}_${(time % 3100) < 120 && b.hop <= 0 ? "blink" : fr}`, b.x, b.y - lift);
      const fd = s.friend;
      if (fd.state !== "away") {
        const hopping = fd.state === "in" || fd.state === "out";
        const up = hopping ? Math.abs(Math.sin(time / 170 * Math.PI)) * 3 : 0;
        const k = fd.state === "in" ? (up > 1 ? "friend_side_hop" : "friend_side_idle0")
          : fd.state === "out" ? (up > 1 ? "friend_left_hop" : "friend_left_idle0")
          : Math.floor(time / 90) % 2 ? "friend_down_wave0" : "friend_down_wave1";
        img("shadow", fd.x, fd.y + 9);
        img(k, fd.x, fd.y - up);
      }
      for (const tr of trees.filter(tr => tr.y < 0)) img("tree" + tr.v, tr.x, tr.y);
      for (const tr of trees.filter(tr => tr.y >= 0)) img("tree" + tr.v, tr.x, tr.y);
      img(Math.floor(time / 110) % 2 ? "bfly0" : "bfly1", s.fly.x, s.fly.y);
      for (const p of s.fx) img(p.k, p.x, p.y);
    },
  };
}

// ---- Inchway: the gold car overtakes on a two-lane road through the meadow; the verges scroll with the road
function highway(x0, w) {
  const roadX = x0 + Math.floor((w - 70) / 2), grass = [], trees = [], ROWS = Math.ceil(H / 16) + 1, SPEED = 30;
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < Math.ceil(w / 16) + 1; x++) grass.push((x * 5 + y * 11 + x * y) % 4);
  for (const side of [x0 - 8, roadX + 70 - 4]) if (roadX - x0 > 6)
    for (let y = -40; y < H; y += Math.floor(rnd(26, 36))) trees.push({x: side + Math.floor(rnd(0, 4)), y, v: Math.floor(rnd(0, 4))});
  const s = {scroll: 0, off: 0, cars: [{lane: 0, y: 4, k: "car1"}, {lane: 1, y: -60, k: "car2"}], spawn: 1.2, fx: [],
    player: {lane: 1, x: 0, tx: 0, y: H - 34, glint: 0}};
  return {
    step(dt) {
      s.scroll = (s.scroll + dt * SPEED) % 32;
      s.off += dt * SPEED;
      for (const tr of trees) if ((tr.y += dt * SPEED) > H) tr.y -= H + 40;     // a tree gone at the bottom comes back at the top
      // traffic drifts down the screen at one pace (so nobody rear-ends anybody), a new car comes in at
      // the top only where both lanes stay passable, the gold car moves over in time
      const TRAFFIC = 26, GAP = 46;
      for (const c of s.cars) c.y += TRAFFIC * dt;
      s.cars = s.cars.filter(c => c.y < H + 4);
      if ((s.spawn -= dt) <= 0) {
        const lane = Math.random() < 0.5 ? 0 : 1;
        const own = s.cars.some(c => c.lane === lane && c.y < GAP - 30);
        const other = s.cars.some(c => c.lane !== lane && c.y < 62);    // close in the other lane would wall the road
        if (!own && !other) { s.cars.push({lane, y: -30, k: "car" + Math.floor(rnd(0, 4))}); s.spawn = rnd(0.9, 2.0); }
        else s.spawn = 0.25;
      }
      const p = s.player;
      const ahead = l => s.cars.some(c => c.lane === l && c.y + 28 > p.y - 30 && c.y < p.y + 28);
      if (Math.abs(p.x - p.tx) <= 1 && ahead(p.lane) && !ahead(1 - p.lane)) p.lane = 1 - p.lane;
      p.tx = roadX + 13 + p.lane * 28;
      p.x = p.x ? p.x + (p.tx - p.x) * Math.min(1, dt * 4) : p.tx;
      if ((p.glint -= dt) <= 0) {                       // the gold paint twinkles
        p.glint = rnd(0.25, 0.6);
        s.fx.push({k: Math.random() < 0.5 ? "sparkle0" : "sparkle", x: p.x + rnd(1, 13), y: p.y + rnd(2, 24), t: 0});
      }
      for (const f of s.fx) f.t += dt;
      s.fx = s.fx.filter(f => f.t < 0.15);
      // a car that would still touch the gold car (it could not move over) waits a moment above it
      for (const c of s.cars) if (c.lane === p.lane && Math.abs(p.x - p.tx) < 2 && c.y + 28 > p.y - 2 && c.y < p.y) c.y = p.y - 30;
    },
    draw() {
      const cols = Math.ceil(w / 16) + 1, shift = Math.floor(s.off) % 16, top = Math.floor(s.off / 16);
      if (IMG.grass.complete) for (let r = 0; r < ROWS; r++) {
        const row = ((r - top) % ROWS + ROWS) % ROWS;
        for (let x = 0; x < cols; x++) cx.drawImage(IMG.grass, grass[row * cols + x] * 16, 0, 16, 16, x0 + x * 16, (r - 1) * 16 + shift, 16, 16);
      }
      for (let y = -32; y < H + 32; y += 32) img("road", roadX, y + Math.floor(s.scroll) % 32);   // Inchway's own road, two lanes
      for (const c of s.cars) img(c.k, roadX + 13 + c.lane * 28, c.y);
      img("player", s.player.x, s.player.y);
      for (const f of s.fx) img(f.k, f.x, f.y);
      for (const tr of trees) img("tree" + tr.v, tr.x, tr.y);
    },
  };
}

// ---- Brick Tanks: a tank patrols under a brick wall and knocks out its nearest bricks
function maze(x0, w) {
  const bricks = [], bushes = [];
  const left = x0 + 4, cols = Math.max(2, Math.floor((w - 8) / 12));
  for (let c = 0; c < cols; c++) {
    const x = left + c * 12;
    if (c % 3 !== 1) { bricks.push({x, y: 8, alive: true, t: 0}); bricks.push({x, y: 20, alive: true, t: 0}); }
    if (c % 4 === 2) bushes.push({x, y: H - 22});
    if (c % 4 === 0) { bricks.push({x, y: H - 22, alive: true, t: 0}); bricks.push({x, y: H - 10, alive: true, t: 0}); }
  }
  const s = {fx: [], tank: {x: left, y: 38, dir: 1, f: 0, t: 0, shell: null, cool: 2, aim: 0}};
  const wall = (x, y) => bricks.some(o => o.alive && o.x === x && o.y === y);
  return {
    step(dt) {
      const tk = s.tank;
      tk.t += dt; tk.f = Math.floor(tk.t * 8) % 2;
      const maxX = Math.max(left + 4, left + (cols - 1) * 12);
      tk.x += (tk.dir === 1 ? 1 : -1) * 16 * dt;
      if (tk.x > maxX) { tk.x = maxX; tk.dir = 3; }
      if (tk.x < left) { tk.x = left; tk.dir = 1; }
      tk.cool -= dt;
      if (tk.cool <= 0 && !tk.shell) {
        // the wall above: the shell meets the lowest brick still standing in the column, the front row first
        const col = bricks.filter(br => br.alive && br.y < 30 && Math.abs(br.x + 6 - (tk.x + 6)) < 8);
        const target = col.sort((a, b) => b.y - a.y)[0];
        if (target) { tk.shell = {x: tk.x + 5, y: tk.y - 2, target}; tk.cool = rnd(1.4, 3); tk.aim = 0.35; }
        else tk.cool = 0.3;
      }
      if (tk.aim > 0) tk.aim -= dt;
      if (tk.shell) {
        tk.shell.y -= 90 * dt;
        const t = tk.shell.target;
        if (tk.shell.y < t.y + 12) {             // the brick's bottom edge (its front face ends there)
          t.alive = false; t.t = 4;
          for (let i = 0; i < 6; i++) s.fx.push({x: tk.shell.x, y: t.y + 10, vx: rnd(-30, 30), vy: rnd(-30, 10), t: 0, c: i % 2 ? "#b5583a" : "#e0a080"});
          tk.shell = null;
        }
      }
      for (const br of bricks) if (!br.alive && (br.t -= dt) <= 0) br.alive = true;
      for (const f of s.fx) { f.t += dt; f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 90 * dt; }
      s.fx = s.fx.filter(f => f.t < 0.5);
    },
    draw() {
      tile("earth", x0, x0 + w);
      // walls with height, as in the game: a shadow to the south east, the face under the lowest brick
      cx.fillStyle = "rgba(13,8,5,0.32)";
      for (const br of bricks) if (br.alive && !wall(br.x, br.y + 12)) cx.fillRect(br.x + 2, br.y + 12, 12, 3);
      for (const br of bricks) if (br.alive) {
        img("brick", br.x, br.y);
        if (!wall(br.x, br.y + 12)) img("brickfront", br.x, br.y + 9);
      }
      const tk = s.tank, dir = tk.aim > 0 ? 0 : tk.dir;
      if (tk.shell) { cx.fillStyle = "#ffe36b"; cx.fillRect(Math.floor(tk.shell.x), Math.floor(tk.shell.y), 2, 3); }
      cx.fillStyle = "rgba(13,8,5,0.32)"; cx.fillRect(Math.floor(tk.x) + 2, tk.y + 3, 10, 10);   // stands on the ground
      if (IMG.tank.complete) cx.drawImage(IMG.tank, tk.f * 14, dir * 14, 14, 14, Math.floor(tk.x) - 1, tk.y - 1, 14, 14);   // 14 px frames
      for (const bu of bushes) img("bush", bu.x, bu.y);
      for (const f of s.fx) { cx.fillStyle = f.c; cx.fillRect(Math.floor(f.x), Math.floor(f.y), 1, 1); }
    },
  };
}

// ---- Gloomdeep: the dwarf runs for gems about a torch-lit gallery, along and then across, as on the game's tiles
function mine(x0, w) {
  const x1 = x0 + w, TOP = 50, BOTTOM = H - 4;     // where the dwarf's feet can go
  const torches = [];
  for (let x = x0 + 14; x < x1 - 8; x += 44) torches.push(x + Math.floor(rnd(-3, 3)));
  const rocks = w > 110 ? [{x: x0 + Math.floor(w * 0.5) - 12, y: H - 26}] : [];
  const s = {fx: [], gem: null, wait: 0,
    dwarf: {x: x0 + Math.floor(w / 2) - 12, y: 56, face: "side", run: 0, idle: 1},
    crystals: {x: x1 - 30, y: H - 22}};
  const newGem = () => { s.gem = {x: x0 + 6 + Math.floor(rnd(0, w - 22)), y: Math.floor(rnd(TOP, BOTTOM)) - 12, t: 0}; };
  newGem();
  return {
    step(dt) {
      const d = s.dwarf;
      if (!s.gem && (s.wait -= dt) <= 0) newGem();
      if (s.gem) {
        s.gem.t += dt;
        const dx = s.gem.x - 6 - d.x, dy = s.gem.y + 12 - d.y, v = 40 * dt;
        if (d.idle > 0) d.idle -= dt;
        else if (Math.abs(dx) > 1) { d.face = dx > 0 ? "side" : "left"; d.x += Math.sign(dx) * Math.min(Math.abs(dx), v); d.run += dt; }
        else if (Math.abs(dy) > 1) { d.face = dy > 0 ? "down" : "up"; d.y += Math.sign(dy) * Math.min(Math.abs(dy), v); d.run += dt; }
        else {
          for (let i = 0; i < 6; i++) s.fx.push({k: "sparkle", x: s.gem.x + 3, y: s.gem.y, vx: rnd(-24, 24), vy: rnd(-40, -10), t: 0});
          s.gem = null; s.wait = rnd(0.6, 1.2); d.idle = s.wait;
        }
      }
      for (const p of s.fx) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      s.fx = s.fx.filter(p => p.t < 0.5);
    },
    draw(time) {
      tile("mfloor", x0, x1, 8, 8);
      tile("mwall", x0, x1);                         // the gallery's back wall, then the floor goes on under it
      if (IMG.mfloor.complete) for (let x = x0 - 8; x < x1; x += 128) cx.drawImage(IMG.mfloor, 0, 0, 128, H - 24, x, 24, 128, H - 24);
      cx.fillStyle = "rgba(14,9,6,0.38)"; cx.fillRect(x0, 0, w, H);    // the mine's dark...
      cx.save(); cx.globalCompositeOperation = "lighter";             // ...lit by its torches
      for (const tx of torches) img("glow", tx + 3 - 14, 12 - 14 + Math.round(Math.sin(time / 180 + tx)));
      cx.restore();
      for (const tx of torches) img("torch" + Math.floor(time / 140 + tx) % 3, tx, 4);
      if (s.gem) img("gem" + Math.floor(s.gem.t * 6) % 3, s.gem.x, s.gem.y + Math.round(Math.sin(s.gem.t * 4)));
      const d = s.dwarf, things = [];                // back to front by where they stand
      for (const r of rocks) things.push({foot: r.y + 18, draw: () => { img("rockshadow", r.x + 4, r.y + 4); img("rock", r.x, r.y); }});
      things.push({foot: s.crystals.y + 18, draw: () => img("crystals", s.crystals.x, s.crystals.y)});
      things.push({foot: d.y, draw: () => {
        img("dshadow", d.x + 6, d.y - 2);
        const k = d.idle > 0 || !s.gem ? `dwarf_down_idle${Math.floor(time / 200) % 4}` : `dwarf_${d.face}_run${Math.floor(d.run * 10) % 4}`;
        img(k, d.x, Math.floor(d.y) - 30);
      }});
      for (const t of things.sort((a, b) => a.foot - b.foot)) t.draw();
      for (const p of s.fx) img(p.k, p.x, p.y);
    },
  };
}

// ---- Crosswoven: a patch on the table stitches itself, row by row, while the cat sleeps
const PATTERNS = [
  [".XX..XX.", "XXXXXXXX", "XXXXXXXX", ".XXXXXX.", "..XXXX..", "...XX..."],     // a heart
  ["...XX...", "..XXXX..", ".XXXXXX.", "XXXXXXXX", ".XX..XX.", ".XX..XX."],     // a house
  ["..XXXX..", ".XXXXXX.", "XX.XX.XX", "XXXXXXXX", "..X..X..", ".X....X."],     // a little ghost
];
function table(x0, w) {
  const x1 = x0 + w, C = 9, rows = 6, cols = Math.min(8, Math.floor((w - 12) / C));
  const gx = x0 + Math.floor((w - cols * C) / 2), gy = 7;
  const s = {pat: pick(PATTERNS), n: 0, t: 0.6, done: 0, fx: [], cat: 0};
  const cell = (r, c) => s.pat[r][c + Math.floor((8 - cols) / 2)] === "X";
  return {
    step(dt) {
      s.cat += dt;
      if (s.done > 0) {
        if ((s.done -= dt) <= 0) { s.pat = pick(PATTERNS.filter(p => p !== s.pat)); s.n = 0; s.t = 0.6; }
      } else if ((s.t -= dt) <= 0) {
        s.n++; s.t = 0.16;
        if (s.n >= rows * cols) {
          s.done = 2.6;
          for (let i = 0; i < 8; i++) s.fx.push({k: i % 3 ? "sparkle" : "heart", x: gx + rnd(0, cols * C), y: gy + rnd(0, rows * C), vx: rnd(-16, 16), vy: rnd(-30, -10), t: 0});
        }
      }
      for (const p of s.fx) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      s.fx = s.fx.filter(p => p.t < 0.9);
    },
    draw() {
      tile("table", x0, x1, 20, 30);
      img("yarn", x0 + 3, H - 20);
      if (w > 104) img("spool", x1 - 22, 4);
      const pw = cols * C, ph = rows * C;
      cx.fillStyle = "rgba(20,10,8,0.45)"; cx.fillRect(gx - 1, gy, pw + 6, ph + 5);       // the frame's shadow on the table
      cx.fillStyle = "#54331f"; cx.fillRect(gx - 3, gy - 3, pw + 6, ph + 6);              // a thin wooden frame
      cx.fillStyle = "#9e6b40"; cx.fillRect(gx - 2, gy - 2, pw + 4, ph + 4);
      cx.fillStyle = "#c28c57"; cx.fillRect(gx - 2, gy - 2, pw + 4, 1);
      cx.fillStyle = "#ede3cf"; cx.fillRect(gx, gy, pw, ph);                              // linen
      cx.fillStyle = "#c7b89e";
      for (let c = 1; c < cols; c++) cx.fillRect(gx + c * C, gy, 1, ph);
      for (let r = 1; r < rows; r++) cx.fillRect(gx, gy + r * C, pw, 1);
      for (let i = 0; i < Math.min(s.n, rows * cols); i++) {
        const r = Math.floor(i / cols), c = i % cols, x = gx + c * C, y = gy + r * C;
        if (cell(r, c)) { cx.fillStyle = "#333854"; cx.fillRect(x + 1, y + 1, C - 1, C - 1); }
        else {                                                                           // an X: nothing goes here
          cx.fillStyle = "#b3a58f";
          for (let k = 0; k < 5; k++) { cx.fillRect(x + 2 + k, y + 2 + k, 1, 1); cx.fillRect(x + 6 - k, y + 2 + k, 1, 1); }
        }
      }
      if (!s.done && s.n < rows * cols) {                                               // the needle's cell
        const r = Math.floor(s.n / cols), c = s.n % cols;
        cx.strokeStyle = "#f59e33"; cx.lineWidth = 1; cx.strokeRect(gx + c * C + 0.5, gy + r * C + 0.5, C, C);
      }
      cx.fillStyle = "#c73842";                                                         // the picture's red edge
      cx.fillRect(gx, gy, pw, 1); cx.fillRect(gx, gy + ph - 1, pw, 1); cx.fillRect(gx, gy, 1, ph); cx.fillRect(gx + pw - 1, gy, 1, ph);
      
      img(Math.floor(s.cat / 0.9) % 2 ? "cat1" : "cat0", x1 - 50, H - 26);   // asleep at the table's edge
      for (const p of s.fx) img(p.k, p.x, p.y);
    },
  };
}

const ZONES = {meadow, highway, maze, mine, table};

// ---- the strip: panels, the blast that swaps one, the caption naming what is on
function blastAt(p, k) {                // k 0..1: a fireball fills the panel by the half, then breaks into smoke
  const far = Math.hypot(p.w / 2, H / 2) + 6, r = far * Math.pow(Math.min(1, k / 0.5), 0.7);
  const cxm = p.x + p.w / 2, cym = H / 2;
  for (const b of p.jit) {
    const x = p.x + b.x, y = b.y;
    const dist = Math.hypot(x + 2 - cxm, y + 2 - cym) + b.j * 8;
    if (dist > r) continue;
    let c, a = 1;
    if (k <= 0.5) c = BOOM[Math.min(4, Math.floor(dist / Math.max(r, 1) * 5))];
    else {
      const fade = (k - 0.5) / 0.5;
      if (b.j < fade * 1.15) continue;
      c = b.j > 0.6 ? BOOM[4] : b.j > 0.4 ? BOOM[3] : BOOM[2];
      a = 1 - fade * 0.6;
    }
    cx.globalAlpha = a; cx.fillStyle = c; cx.fillRect(x, y, 4, 4);
  }
  cx.globalAlpha = 1;
  if (k > 0.42 && k < 0.6) { cx.fillStyle = `rgba(255,255,255,${1 - Math.abs(k - 0.5) / 0.1})`; cx.fillRect(p.x, 0, p.w, H); }
}
function panel(game, x, w) {
  const jit = [];
  for (let by = 0; by < H; by += 4) for (let bx = 0; bx < w; bx += 4) jit.push({x: bx, y: by, j: Math.random()});
  return {game, x, w, z: ZONES[game](x, w), jit, blast: -1, swapTo: null};
}
function caption() {
  const names = panels.map(p => TITLES[p.game]).join(" · ");     // a phone has room for the names only
  if (tag) tag.textContent = panels.length > 2 ? `${tag.dataset.live || "Live:"} ${names}` : names;
}
function layout() {
  const cw = cv.parentElement.clientWidth;
  SC = cw >= 1000 ? 4 : cw >= 560 ? 3 : 2;
  W = Math.ceil(cw / SC);
  cv.width = W; cv.height = H;
  cv.style.height = (H * SC) + "px";
  cx.imageSmoothingEnabled = false;
  const n = W >= 280 ? 3 : 2;
  if (!queue.length) { queue = Object.keys(ZONES).sort(() => Math.random() - 0.5); next = 0; }
  const games = panels.map(p => p.game).slice(0, n);
  while (games.length < n) { const g = queue[next++ % queue.length]; if (!games.includes(g)) games.push(g); }
  const base = Math.floor(W / n);
  panels = games.map((g, i) => panel(g, i * base, i === n - 1 ? W - i * base : base));
  turn = rnd(...ROTATE);
  caption();
}
function rotate() {                     // the panel shown longest blows up; the next game nobody sees takes it
  const shown = panels.map(p => p.game);
  let g = null;
  for (let i = 0; i < queue.length && !g; i++) { const c = queue[next++ % queue.length]; if (!shown.includes(c)) g = c; }
  const p = panels[rot++ % panels.length];
  p.swapTo = g; p.blast = 0;
}
let rot = Math.floor(Math.random() * 3);
function step(dt) {
  if ((turn -= dt) <= 0) { rotate(); turn = rnd(...ROTATE); }
  for (const [i, p] of panels.entries()) {
    p.z.step(dt);
    if (p.blast < 0) continue;
    const was = p.blast;
    p.blast += dt / BLAST;
    if (was < 0.5 && p.blast >= 0.5 && p.swapTo) {
      const np = panel(p.swapTo, p.x, p.w);
      np.blast = p.blast; panels[i] = np;
      caption();
    } else if (p.blast >= 1) p.blast = -1;
  }
}
function draw(time) {
  for (const p of panels) {
    cx.save();
    cx.beginPath(); cx.rect(p.x, 0, p.w, H); cx.clip();
    p.z.draw(time);
    if (p.blast >= 0) blastAt(p, p.blast);
    cx.restore();
  }
  cx.fillStyle = SEAM;
  for (const p of panels.slice(1)) cx.fillRect(p.x - 1, 0, 2, H);
}
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
  if (!reduce) step(dt);
  draw(now);
  if (!reduce) requestAnimationFrame(loop);
}
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
window.addEventListener("resize", () => { layout(); if (reduce) draw(0); });
layout();
Promise.all(Object.values(IMG).map(i => i.decode().catch(() => {}))).then(() => requestAnimationFrame(loop));
