import { Centipede } from "./centipede";
import { type Creature, type Env, type Point, clamp, rand } from "./creature";
import { FONT_LOADS, INK, PAPER, clearMetrics, drawGlyphs } from "./glyphs";
import type { Splat } from "./gore";
import { Scarab } from "./scarab";

const MAX_FRAME_SECONDS = 1 / 20;
const AREA_PER_BUG = 70000;
const MIN_BUGS = 3;
const MAX_BUGS = 10;
const CENTIPEDE_SHARE = 0.4;
const RESPAWN_SECONDS: [number, number] = [1.2, 2.6];

const REACH_TOUCH = 20;
const REACH_MOUSE = 7;
/** A dragged thumb presses down this often along its path. */
const DRAG_SPACING = 8;
const STARTLE_REACH = 230;
const NEAR_MISS_REACH = 95;
const FONT_TIMEOUT_MS = 2500;

export function createBugWorld(
  canvas: HTMLCanvasElement,
  { debug = false, zoo = false } = {}
) {
  const ctx = canvas.getContext("2d")!;
  let pixelRatio = 1;
  let creatures: Creature[] = [];
  let splats: Splat[] = [];
  let untilSpawn = 0;
  let last = 0;
  let frame = 0;
  let running = true;
  let frameCost = 0;
  const thumbs = new Map<number, Point & { reach: number }>();

  const env: Env = {
    width: 0,
    height: 0,
    addSplat: splat => splats.push(splat)
  };

  function resize() {
    pixelRatio = Math.min(3, window.devicePixelRatio || 1);
    env.width = canvas.clientWidth;
    env.height = canvas.clientHeight;
    canvas.width = Math.round(env.width * pixelRatio);
    canvas.height = Math.round(env.height * pixelRatio);
  }

  // Bugs are a little bigger on a bigger page, but not in proportion.
  const pageScale = () => clamp(Math.min(env.width, env.height) / 390, 1, 1.5);

  function hatch(x: number, y: number, heading: number, size = 1): Creature {
    const k = pageScale() * size;
    return Math.random() < CENTIPEDE_SHARE
      ? Centipede.spawn(x, y, heading, rand(1.3, 1.8) * k)
      : new Scarab(x, y, heading, rand(62, 112) * k);
  }

  /** Just off a random edge, pointed at somewhere in the middle. */
  function walkIn() {
    const margin = 70 * pageScale();
    const edge = Math.floor(rand(0, 4));
    const along = rand(0.1, 0.9);
    const x =
      edge === 0
        ? -margin
        : edge === 1
          ? env.width + margin
          : env.width * along;
    const y =
      edge === 2
        ? -margin
        : edge === 3
          ? env.height + margin
          : env.height * along;
    const aimX = env.width * rand(0.3, 0.7);
    const aimY = env.height * rand(0.3, 0.7);
    return hatch(x, y, Math.atan2(aimY - y, aimX - x));
  }

  function populate() {
    if (zoo) {
      const columns = Math.max(1, Math.floor(env.width / 260));
      const k = 1.8;
      for (let i = 0; i < columns; i++) {
        const x = (env.width * (i + 0.5)) / columns;
        creatures.push(new Scarab(x, 190, -Math.PI / 2, 110 * k));
        creatures.push(Centipede.spawn(x, 420, -Math.PI / 2, k));
      }
      return;
    }
    // Open with some already out in the middle, so the page is never blank.
    const target = population();
    for (let i = 0; i < Math.ceil(target / 2); i++) {
      creatures.push(
        hatch(
          env.width * rand(0.2, 0.8),
          env.height * rand(0.2, 0.8),
          rand(0, Math.PI * 2)
        )
      );
    }
  }

  const population = () =>
    clamp(
      Math.round((env.width * env.height) / AREA_PER_BUG),
      MIN_BUGS,
      MAX_BUGS
    );

  function press(at: Point, reach: number, fresh: boolean) {
    let hit = false;
    for (const creature of [...creatures]) {
      if (creature.dead) continue;
      const pieces = creature.squish(at, reach, env);
      if (!pieces) continue;
      hit = true;
      creatures.push(...pieces);
    }
    if (hit) navigator.vibrate?.(10);
    if (hit || fresh) {
      const range = hit ? STARTLE_REACH : NEAR_MISS_REACH;
      for (const creature of creatures) creature.startle(at, range);
    }
  }

  function update(dt: number) {
    for (const creature of creatures) creature.update(dt, env);
    creatures = creatures.filter(c => !c.dead);
    for (const splat of splats) splat.update(dt);
    splats = splats.filter(s => !s.done);

    if (zoo) return;
    // The emptier the page, the sooner the next one turns up.
    const missing = population() - creatures.filter(c => c.counts).length;
    if (missing > 0) {
      untilSpawn -= dt * missing;
      if (untilSpawn <= 0) {
        creatures.push(walkIn());
        untilSpawn = rand(...RESPAWN_SECONDS);
      }
    }
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const splat of splats) splat.draw(ctx, pixelRatio);
    let glyphs = 0;
    for (const creature of creatures) {
      const pose = creature.pose();
      glyphs += pose.length;
      drawGlyphs(ctx, pose, pixelRatio);
    }
    if (debug) {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillStyle = INK;
      ctx.fillText(
        `${creatures.length} bugs  ${glyphs} glyphs  ${splats.length} splats  ${frameCost.toFixed(1)}ms`,
        10,
        18
      );
    }
  }

  function tick(now: number) {
    if (!running) return;
    const dt = Math.min(MAX_FRAME_SECONDS, (now - last) / 1000 || 0);
    last = now;
    const started = performance.now();
    update(dt);
    draw();
    frameCost += (performance.now() - started - frameCost) * 0.1;
    frame = requestAnimationFrame(tick);
  }

  const locate = (event: PointerEvent): Point => {
    const box = canvas.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };

  function onPointerDown(event: PointerEvent) {
    event.preventDefault();
    canvas.setPointerCapture?.(event.pointerId);
    const reach = event.pointerType === "mouse" ? REACH_MOUSE : REACH_TOUCH;
    const at = locate(event);
    thumbs.set(event.pointerId, { ...at, reach });
    press(at, reach, true);
  }

  function onPointerMove(event: PointerEvent) {
    const thumb = thumbs.get(event.pointerId);
    if (!thumb) return;
    const to = locate(event);
    const distance = Math.hypot(to.x - thumb.x, to.y - thumb.y);
    if (distance < DRAG_SPACING) return;
    const steps = Math.floor(distance / DRAG_SPACING);
    const from = { x: thumb.x, y: thumb.y };
    for (let i = 1; i <= steps; i++) {
      const t = (i * DRAG_SPACING) / distance;
      thumb.x = from.x + (to.x - from.x) * t;
      thumb.y = from.y + (to.y - from.y) * t;
      press(thumb, thumb.reach, false);
    }
  }

  function onPointerUp(event: PointerEvent) {
    thumbs.delete(event.pointerId);
  }

  const preventDefault = (event: Event) => event.preventDefault();

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("contextmenu", preventDefault);
  window.addEventListener("resize", resize);
  if (debug) {
    // For scripted tests: somewhere to aim at on each live creature.
    Object.assign(window, {
      letterbug: () =>
        creatures.map(c => {
          const pose = c.pose();
          const middle = pose[Math.floor(pose.length / 2)];
          return {
            counts: c.counts,
            glyphs: pose.length,
            x: middle.x,
            y: middle.y
          };
        })
    });
  }

  // Bugs are proportioned from glyph measurements, so wait for the real font
  // (but not for ever).
  const fonts = Promise.all(FONT_LOADS.map(font => document.fonts.load(font)));
  const timeout = new Promise(resolve => setTimeout(resolve, FONT_TIMEOUT_MS));
  void Promise.race([fonts, timeout]).then(() => {
    if (!running) return;
    clearMetrics();
    resize();
    populate();
    frame = requestAnimationFrame(tick);
  });
  // If the font turns up after the timeout, re-measure with it.
  void fonts.then(clearMetrics);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("contextmenu", preventDefault);
      window.removeEventListener("resize", resize);
    }
  };
}
