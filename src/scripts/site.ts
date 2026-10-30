// Small things every page shares: the language pick, the screenshot lightbox, pixel glyphs,
// "copy e-mail" and trailers that only load and play while on screen.

// the language switch remembers the pick (Base.astro's redirect then leaves the visitor alone)
document.querySelectorAll<HTMLAnchorElement>(".lang a").forEach((a) =>
  a.addEventListener("click", () => { try { localStorage.setItem("qkix-lang", a.dataset.lang ?? "en"); } catch (e) {} }));

// lightbox: any [data-shots] gallery's images open big, arrows / Esc / clicks to move and close
const box = document.getElementById("box") as HTMLDivElement;
const boxImg = document.getElementById("box-img") as HTMLImageElement;
let shots: string[] = [];
let at = 0;
let opener: HTMLElement | null = null;
const show = () => { boxImg.src = shots[at]; };
const close = () => { box.hidden = true; opener?.focus(); };
const stepBox = (d: number) => { at = (at + d + shots.length) % shots.length; show(); };
document.querySelectorAll<HTMLElement>("[data-shots]").forEach((g) => {
  const imgs = [...g.querySelectorAll<HTMLImageElement>("img")];
  imgs.forEach((im, i) => {
    im.tabIndex = 0;
    const open = () => { shots = imgs.map((x) => x.currentSrc || x.src); at = i; opener = im; show(); box.hidden = false;
      (document.getElementById("box-close") as HTMLButtonElement).focus(); };
    im.addEventListener("click", open);
    im.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
});
document.getElementById("box-close")?.addEventListener("click", close);
boxImg.addEventListener("click", close);
box.addEventListener("click", (e) => { if (e.target === box) close(); });
document.getElementById("box-prev")?.addEventListener("click", () => stepBox(-1));
document.getElementById("box-next")?.addEventListener("click", () => stepBox(1));
document.addEventListener("keydown", (e) => {
  if (box.hidden) return;
  if (e.key === "Escape") close(); else if (e.key === "ArrowLeft") stepBox(-1); else if (e.key === "ArrowRight") stepBox(1);
});

// 8x8 pixel marks of the socials (our own drawings, not the brands' logos)
const GLYPHS: Record<string, string[]> = {
  youtube: ["........", ".######.", "##.#####", "##..####", "##...###", "##..####", "##.#####", ".######."],
  tiktok: ["....##..", "....###.", "....#.##", "....#...", ".####...", "##..#...", "##..#...", ".###...."],
  instagram: [".######.", "#......#", "#..##.##", "#.#..#.#", "#.#..#.#", "#..##..#", "#......#", ".######."],
  x: ["##....##", ".##..##.", "..####..", "...##...", "..####..", ".##..##.", "##....##", "#......#"],
};
document.querySelectorAll<HTMLCanvasElement>("canvas[data-glyph]").forEach((c) => {
  const g = c.getContext("2d")!;
  g.fillStyle = c.dataset.c ?? "#fff";
  (GLYPHS[c.dataset.glyph ?? ""] ?? []).forEach((row, y) => [...row].forEach((ch, x) => { if (ch === "#") g.fillRect(x, y, 1, 1); }));
});

// a pixel "play" triangle in four colours (drawn here, not the store's official badge)
document.querySelectorAll<HTMLCanvasElement>("canvas[data-playicon]").forEach((c) => {
  const g = c.getContext("2d")!;
  const cols = ["#00d26a", "#ffcf00", "#ff3d4d", "#3ba3ff"];
  for (let y = 0; y < 14; y++) for (let x = 0; x < 13; x++) {
    const h = 7 - Math.abs(y - 6.5);
    if (x < h * 1.7) {
      g.fillStyle = x > 6 ? cols[1] : y < 4 ? cols[3] : y < 7 ? cols[0] : y < 10 ? cols[1] : cols[2];
      g.fillRect(x, y, 1, 1);
    }
  }
});

// a pixel apple for the iPhone / TestFlight button (drawn here, like the play triangle - not Apple's badge)
const APPLE = ["......##.....", ".....##......", ".....#.......", "..###..####..", ".###########.",
  "##########...", "#########....", "#########....", "##########...", ".###########.", ".###########.",
  "..#########..", "...###.###...", "............."];
document.querySelectorAll<HTMLCanvasElement>("canvas[data-appleicon]").forEach((c) => {
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  APPLE.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === "#") g.fillRect(x, y, 1, 1); }));
});

// copy the e-mail address (selects it where the clipboard is not allowed)
document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => btn.addEventListener("click", () => {
  const text = btn.dataset.copy ?? "";
  navigator.clipboard.writeText(text).then(() => {
    const was = btn.textContent;
    btn.textContent = btn.dataset.done ?? "OK";
    setTimeout(() => { btn.textContent = was; }, 1500);
  }).catch(() => {
    const el = document.getElementById(btn.dataset.target ?? "");
    if (!el) return;
    const r = document.createRange(); r.selectNodeContents(el);
    getSelection()?.removeAllRanges(); getSelection()?.addRange(r);
  });
}));

// trailers: muted loops that load and play only while visible (and never with reduced motion)
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  const v = e.target as HTMLVideoElement;
  if (e.isIntersecting) {
    if (!v.src) v.src = v.dataset.src ?? "";
    if (!still) v.play().catch(() => {});
  } else if (!v.paused) v.pause();
}), { rootMargin: "200px" });
document.querySelectorAll<HTMLVideoElement>("video[data-src]").forEach((v) => io.observe(v));
