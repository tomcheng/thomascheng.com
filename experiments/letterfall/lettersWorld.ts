import RAPIER, { type RigidBody, type World } from "@dimforge/rapier2d-compat";
import {
  FONT_FAMILY,
  REFERENCE_FONT,
  REFERENCE_SIZE,
  clearGlyphShapes,
  getGlyphShape,
  inkSampler,
  type Point
} from "./glyphShapes";

const BACKGROUND = "#fcfcfa";
const INK = "#0a0a0a";
const CHARACTERS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&".split("");

// The world is simulated in CSS pixels; this tells the solver how many of
// them make up its notional metre, which sets its tolerances to match.
const PIXELS_PER_METRE = 100;
const GRAVITY = 1400;
// Two physics steps per 60Hz frame: hairline serifs are only a few pixels
// thick, and halving how far anything moves per step is what keeps them from
// slipping through one another.
const STEP_MS = 1000 / 120;
const MAX_STEPS_PER_FRAME = 6;

const MIN_SIZE = 46;
const MAX_SIZE = 156;
const SPAWN_INTERVAL_MS = 1000 / 14;
// A letter is only ever placed in clear space: dropped across a neighbour,
// two hairline strokes end up crossed and can never be pushed apart again.
// Each entry is one attempt, as [extra distance from the thumb, size factor];
// the later ones are what let letters erupt from the top of a pile that has
// buried the thumb.
const SPAWN_ATTEMPTS: [number, number][] = [
  [0, 1],
  [0, 1],
  [10, 1],
  [25, 0.8],
  [50, 0.8],
  [90, 0.65],
  [140, 0.65],
  [210, 0.5],
  [300, 0.5]
];
// Nothing is placed closer than this to the top of the screen, which is what
// finally stops the fountain once the pile has filled it.
const SPAWN_CEILING = 24;
// Purely visual: the glyph swells into its (already full-size) body.
const POP_IN_MS = 110;

// How hard the thumb chases the finger: closing speed per pixel of lag, in
// px/s, and the cap on it.
const THUMB_CHASE_RATE = 30;
const MAX_THUMB_SPEED = 3000;
const MAX_THUMB_SPEED_CHANGE_PER_STEP = 60;

// A finger is blunter than a cursor, so it reaches a little past itself, both
// for the touch that decides between popping and pouring and for the saw.
const REACH_TOUCH = 14;
const REACH_MOUSE = 5;
// A swipe is sawn along its whole length, sampled this often, so a fast one
// cannot hop over a letter between steps.
const SAW_SAMPLE_SPACING = 8;
const MAX_POPS_PER_STEP = 3;
// The fountain only starts in the open: with no letter this close beyond the
// edge of the finger, and no more than a few loose periods.
const FOUNTAIN_CLEARANCE = 14;
const MAX_STRAY_DOTS = 3;

// When the last period has drained from a page with nothing else left on it,
// the page lets out a quiet sigh: it fades in, stays a while, and fades out.
// Anything new turning up cuts it short.
const SIGH_TEXT = "Aah...";
const SIGH_FONT = `22px ${FONT_FAMILY}`;
const SIGH_OPACITY = 0.5;
const SIGH_HEIGHT = 0.36;
const SIGH_FADE_IN_MS = 900;
const SIGH_HOLD_MS = 3000;
const SIGH_FADE_OUT_MS = 1200;

// Every period is the same size whatever letter it came from. They are packed
// a hair closer than touching, so the honeycomb starts out very slightly
// compressed and springs apart by itself when it lets go.
const DOT_RADIUS = 3.1;
const DOT_PITCH = DOT_RADIUS * 2 - 0.3;
// How long a popped letter stands as dots before they let go.
const DOT_HOLD_MS = 50;
// Past this the oldest go first; those are the ones deepest in the funnel,
// so it reads as the drain keeping up.
const MAX_DOTS = 1000;

// Collision groups, as (membership << 16) | filter. Dots are a group of their
// own so that the clear-space test for a new letter can look straight past
// them (a letter landing on a dot just nudges it aside, and a thumb ringed by
// dots must not be choked off), and so that the thumb itself can ignore them.
const DOT_GROUPS = (0x0002 << 16) | 0xffff;
const IGNORING_DOTS = (0xffff << 16) | 0xfffd;

// The funnel: two dark slopes running down to a neck at the bottom centre.
// The neck has to be several periods wide or they arch across it and jam. It
// is an honest hole: a letter slim enough to fit goes down it too, and a
// bigger one wedges in its mouth until it is popped.
const FUNNEL_SLOPE = Math.tan((17 * Math.PI) / 180);
// Near frictionless, and it is the funnel's figure that counts rather than
// an average with whatever is on it: the slope is shallow, and everything
// should still slide or roll down it to the middle.
const FUNNEL_FRICTION = 0.02;
const MAX_FUNNEL_FRACTION = 0.4;
const NECK_WIDTH = 38;
const NECK_LENGTH = 30;
const WALL_THICKNESS = 400;
const WALL_MARGIN = 7;

type Letter = {
  body: RigidBody;
  char: string;
  /** Font size as a multiple of REFERENCE_SIZE. */
  scale: number;
  age: number;
  /** Collision polygons in reference px, relative to `centre`. */
  polygons: Point[][];
  centre: Point;
};

/** One of the periods a popped letter bursts into. */
type Dot = {
  body: RigidBody;
  /** How much longer it holds its place in the letter before bursting. */
  holdMs: number;
  burstX: number;
  burstY: number;
};

type Thumb = {
  body: RigidBody;
  radius: number;
  x: number;
  y: number;
} & (
  | { mode: "fountain"; sinceSpawn: number }
  // Where the saw has already cut up to.
  | { mode: "saw"; reach: number; sawnX: number; sawnY: number }
);

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const createLettersWorld = (
  canvas: HTMLCanvasElement,
  { debug = false } = {}
) => {
  const ctx = canvas.getContext("2d")!;
  let world: World | null = null;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let letterCap = 0;
  // Where the slopes leave the side walls, and where they reach the neck.
  let funnelTop = 0;
  let neckTop = 0;
  let boundaries: RigidBody[] = [];

  let letters: Letter[] = [];
  let dots: Dot[] = [];
  const lettersByHandle = new Map<number, Letter>();
  const thumbs = new Map<number, Thumb>();

  let frame = 0;
  let lastFrameTime = 0;
  let accumulator = 0;
  let destroyed = false;
  let stepCost = 0;
  // Milliseconds into the sigh, or null when the page is not sighing.
  let sighAge: number | null = null;

  // --- World geometry -------------------------------------------------------

  const measure = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    neckTop = height - NECK_LENGTH;
    const drop = Math.min(
      ((width - NECK_WIDTH) / 2) * FUNNEL_SLOPE,
      height * MAX_FUNNEL_FRACTION
    );
    funnelTop = neckTop - drop;
    letterCap = Math.round(clamp((width * height) / 2600, 80, 300));
  };

  /** The visible outline of one side of the funnel, as [x, y] corners. */
  const funnelSide = (side: -1 | 1) => {
    const wallX = side < 0 ? 0 : width;
    const neckX = width / 2 + (side * NECK_WIDTH) / 2;
    return [
      [wallX, funnelTop],
      [neckX, neckTop],
      [neckX, height],
      [wallX, height]
    ];
  };

  const layout = () => {
    measure();
    if (!world) return;
    const physics = world;
    for (const body of boundaries) physics.removeRigidBody(body);

    const fixed = (x = 0, y = 0) =>
      physics.createRigidBody(
        RAPIER.RigidBodyDesc.fixed().setTranslation(x, y)
      );

    const wallHeight = height * 6;
    const wall = (x: number) => {
      const body = fixed(x, height + 400 - wallHeight / 2);
      physics.createCollider(
        RAPIER.ColliderDesc.cuboid(WALL_THICKNESS / 2, wallHeight / 2)
          .setFriction(0.2)
          .setRestitution(0.05),
        body
      );
      return body;
    };

    // Each side of the funnel is one convex block: the drawn shape, carried
    // on well past the wall and the bottom of the screen so that nothing can
    // be squeezed out through it. Slippery, so that letters slide down to the
    // middle like a pinball outlane, and periods never settle on the slope.
    const funnel = (side: -1 | 1) => {
      const [top, shoulder] = funnelSide(side);
      const outer = top[0] + side * WALL_THICKNESS;
      const below = height + WALL_THICKNESS;
      const body = fixed();
      const block = RAPIER.ColliderDesc.convexHull(
        new Float32Array([
          outer,
          top[1],
          ...top,
          ...shoulder,
          shoulder[0],
          below,
          outer,
          below
        ])
      );
      if (block) {
        physics.createCollider(
          block
            .setFriction(FUNNEL_FRICTION)
            .setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min)
            .setRestitution(0.1),
          body
        );
      }
      return body;
    };

    boundaries = [
      wall(-WALL_THICKNESS / 2),
      wall(width + WALL_THICKNESS / 2),
      funnel(-1),
      funnel(1)
    ];

    // Keep letters on-screen if the viewport narrowed under them.
    for (const { body } of letters) {
      const at = body.translation();
      const x = clamp(at.x, 8, width - 8);
      if (x !== at.x) body.setTranslation({ x, y: at.y }, true);
    }
    wakeAll();
  };

  const wakeAll = () => {
    for (const { body } of letters) body.wakeUp();
    for (const { body } of dots) body.wakeUp();
  };

  // --- Letters --------------------------------------------------------------

  const toPoints = (polygon: Point[], scale: number) => {
    const points = new Float32Array(polygon.length * 2);
    polygon.forEach((p, i) => {
      points[i * 2] = p.x * scale;
      points[i * 2 + 1] = p.y * scale;
    });
    return points;
  };

  const spawnLetter = (physics: World, thumb: Thumb) => {
    if (letters.length >= letterCap) return;
    const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    const shape = getGlyphShape(char);
    const { centre } = shape;
    const hull = shape.hull.map(p => ({
      x: p.x - centre.x,
      y: p.y - centre.y
    }));
    const hullRadius = Math.max(...hull.map(p => Math.hypot(p.x, p.y)));
    // Skewed small, so the big letters stay an event.
    const wanted = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * Math.random() ** 2.2;
    const angle = randomBetween(-0.7, 0.7);

    for (const [extraReach, sizeFactor] of SPAWN_ATTEMPTS) {
      const size = Math.max(MIN_SIZE, wanted * sizeFactor);
      const scale = size / REFERENCE_SIZE;
      // An upward fan, narrowing towards straight up the further out it goes.
      const spread = extraReach > 60 ? 0.5 : Math.PI / 2 - 0.3;
      const direction = -Math.PI / 2 + randomBetween(-spread, spread);
      const reach = thumb.radius + hullRadius * scale * 0.75 + 2 + extraReach;
      const at = {
        x: clamp(thumb.x + Math.cos(direction) * reach, 4, width - 4),
        y: thumb.y + Math.sin(direction) * reach
      };
      if (at.y < SPAWN_CEILING) continue;

      let blocked = false;
      physics.intersectionsWithShape(
        at,
        angle,
        new RAPIER.ConvexPolygon(toPoints(hull, scale), false),
        () => {
          blocked = true;
          return false;
        },
        undefined,
        IGNORING_DOTS
      );
      if (blocked) continue;

      const speed = randomBetween(300, 640);
      const thumbVelocity = thumb.body.linvel();
      const body = physics.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(at.x, at.y)
          .setRotation(angle)
          .setLinvel(
            Math.cos(direction) * speed + thumbVelocity.x * 0.4,
            Math.sin(direction) * speed + thumbVelocity.y * 0.4
          )
          .setAngvel(randomBetween(-5, 5))
          .setLinearDamping(0.05)
          .setAngularDamping(0.8)
          // Serif hairlines are a few pixels thick; without continuous
          // detection a fast letter passes clean through one between steps.
          .setCcdEnabled(true)
          .setSoftCcdPrediction(12)
      );
      const polygons = shape.parts.map(polygon =>
        polygon.map(p => ({ x: p.x - centre.x, y: p.y - centre.y }))
      );
      for (const polygon of polygons) {
        const collider = RAPIER.ColliderDesc.convexHull(
          toPoints(polygon, scale)
        );
        if (!collider) continue;
        physics.createCollider(
          collider
            .setFriction(0.55)
            .setRestitution(0.05)
            // Mass by area would make the largest letter a dozen times the
            // smallest, and a solver cannot keep a featherweight from being
            // crushed into whatever it is lying on. Thinning big letters out
            // keeps the whole pile within a factor of a few.
            .setDensity(MIN_SIZE / size),
          body
        );
      }
      if (!body.numColliders()) {
        physics.removeRigidBody(body);
        return;
      }
      const letter = { body, char, scale, age: 0, polygons, centre };
      letters.push(letter);
      lettersByHandle.set(body.handle, letter);
      return;
    }
  };

  const removeLetter = (physics: World, letter: Letter) => {
    lettersByHandle.delete(letter.body.handle);
    physics.removeRigidBody(letter.body);
  };

  /** Every letter within `reach` of a point. */
  const lettersNear = (physics: World, x: number, y: number, reach: number) => {
    const found = new Set<Letter>();
    physics.intersectionsWithShape(
      { x, y },
      0,
      new RAPIER.Ball(reach),
      collider => {
        const parent = collider.parent();
        const letter = parent && lettersByHandle.get(parent.handle);
        if (letter) found.add(letter);
        return true;
      },
      undefined,
      IGNORING_DOTS
    );
    return found;
  };

  /** Whether there is a letter, or more than the odd stray period, nearby. */
  const isCrowded = (physics: World, x: number, y: number, within: number) => {
    let crowded = false;
    let strays = 0;
    physics.intersectionsWithShape(
      { x, y },
      0,
      new RAPIER.Ball(within),
      collider => {
        const parent = collider.parent();
        if (parent && lettersByHandle.has(parent.handle)) crowded = true;
        else if (collider.collisionGroups() === DOT_GROUPS) {
          crowded = ++strays > MAX_STRAY_DOTS;
        }
        return !crowded;
      }
    );
    return crowded;
  };

  /**
   * Turn a letter into the same letter set in periods: a honeycomb of dots
   * wherever there was ink. They hold the shape for a beat, then burst.
   */
  const popLetter = (physics: World, letter: Letter) => {
    // It may already be gone, and its handle reused, since it was found.
    if (lettersByHandle.get(letter.body.handle) !== letter) return;
    const { body, char, scale, centre } = letter;
    const hasInk = inkSampler(char);
    const origin = body.translation();
    const drift = body.linvel();
    const cos = Math.cos(body.rotation());
    const sin = Math.sin(body.rotation());

    // The honeycomb is laid out in the glyph's own reference units, so that it
    // turns with the letter. A dot may sit slightly proud of the outline:
    // that is what lets a hairline thinner than a dot still be traced.
    const pitch = DOT_PITCH / scale;
    const rowPitch = (pitch * Math.sqrt(3)) / 2;
    const proud = (DOT_RADIUS * 0.45) / scale;
    const { hull } = getGlyphShape(char);
    const minX = Math.min(...hull.map(p => p.x)) - centre.x;
    const maxX = Math.max(...hull.map(p => p.x)) - centre.x;
    const minY = Math.min(...hull.map(p => p.y)) - centre.y;
    const maxY = Math.max(...hull.map(p => p.y)) - centre.y;
    const phaseX = Math.random() * pitch;
    const phaseY = Math.random() * rowPitch;

    let row = 0;
    for (let y = minY - phaseY; y <= maxY + rowPitch; y += rowPitch, row++) {
      const stagger = row % 2 ? pitch / 2 : 0;
      for (let x = minX - phaseX + stagger; x <= maxX + pitch; x += pitch) {
        // x and y are measured from the glyph's middle; ink from its origin.
        const inkX = x + centre.x;
        const inkY = y + centre.y;
        const onInk =
          hasInk(inkX, inkY) ||
          hasInk(inkX - proud, inkY) ||
          hasInk(inkX + proud, inkY) ||
          hasInk(inkX, inkY - proud) ||
          hasInk(inkX, inkY + proud);
        if (!onInk) continue;

        const offsetX = (x * cos - y * sin) * scale;
        const offsetY = (x * sin + y * cos) * scale;
        const dot = physics.createRigidBody(
          RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(origin.x + offsetX, origin.y + offsetY)
            .setLinvel(drift.x, drift.y)
            // Weightless while it is still part of the letter.
            .setGravityScale(0)
            .setLinearDamping(0.1)
        );
        physics.createCollider(
          RAPIER.ColliderDesc.ball(DOT_RADIUS)
            // Slippery, so they pour rather than heap, and do not arch
            // across the neck.
            .setFriction(0.05)
            .setRestitution(0.2)
            // Dense for their size, for the same reason big letters are thin:
            // a speck with no mass gets pressed into whatever it lands on.
            .setDensity(4)
            .setCollisionGroups(DOT_GROUPS),
          dot
        );

        // Outwards from the middle of the letter, with a little lift: a pop,
        // not a blast.
        const away = Math.atan2(offsetY, offsetX) + randomBetween(-0.6, 0.6);
        const speed = randomBetween(70, 240);
        dots.push({
          body: dot,
          holdMs: DOT_HOLD_MS + randomBetween(0, 16),
          burstX: drift.x * 0.5 + Math.cos(away) * speed,
          burstY: drift.y * 0.5 + Math.sin(away) * speed - 110
        });
      }
    }

    removeLetter(physics, letter);
    letters = letters.filter(other => other !== letter);
    while (dots.length > MAX_DOTS) physics.removeRigidBody(dots.shift()!.body);
    // Whatever was resting on the letter has just lost its footing.
    wakeAll();
    navigator.vibrate?.(8);
  };

  // --- Simulation -----------------------------------------------------------

  const chase = (thumb: Thumb) => {
    // Chase the finger by velocity rather than teleporting to it, so a fast
    // swipe shoves things aside instead of skipping over them. The thumb is a
    // heavy dynamic body, not a kinematic one: kinematic bodies cannot be
    // stopped, and would crush a letter straight through a wall.
    const at = thumb.body.translation();
    const targetX = clamp(thumb.x, thumb.radius, width - thumb.radius);
    const targetY = clamp(thumb.y, thumb.radius, height - thumb.radius);
    let vx = (targetX - at.x) * THUMB_CHASE_RATE;
    let vy = (targetY - at.y) * THUMB_CHASE_RATE;
    const speed = Math.hypot(vx, vy);
    if (speed > MAX_THUMB_SPEED) {
      vx *= MAX_THUMB_SPEED / speed;
      vy *= MAX_THUMB_SPEED / speed;
    }
    // Steer towards that velocity with a bounded push instead of imposing
    // it, so whatever is wedged between the thumb and a wall can push back.
    const current = thumb.body.linvel();
    let ix = vx - current.x;
    let iy = vy - current.y;
    const change = Math.hypot(ix, iy);
    if (change > MAX_THUMB_SPEED_CHANGE_PER_STEP) {
      ix *= MAX_THUMB_SPEED_CHANGE_PER_STEP / change;
      iy *= MAX_THUMB_SPEED_CHANGE_PER_STEP / change;
    }
    const mass = thumb.body.mass();
    thumb.body.applyImpulse({ x: ix * mass, y: iy * mass }, true);
  };

  /** Pop what the saw reaches, working along the finger's path to catch up. */
  const saw = (
    physics: World,
    thumb: Extract<Thumb, { mode: "saw" }>,
    budget: number
  ) => {
    let pops = 0;
    while (pops < budget) {
      const dx = thumb.x - thumb.sawnX;
      const dy = thumb.y - thumb.sawnY;
      const distance = Math.hypot(dx, dy);
      const stride = Math.min(1, SAW_SAMPLE_SPACING / (distance || 1));
      const x = thumb.sawnX + dx * stride;
      const y = thumb.sawnY + dy * stride;

      const reached = lettersNear(physics, x, y, thumb.reach);
      let left = reached.size;
      for (const letter of reached) {
        if (pops >= budget) break;
        popLetter(physics, letter);
        pops++;
        left--;
      }
      // Only move on once this spot is clear, so that running out of budget
      // mid-swipe delays a pop rather than dropping it.
      if (left) break;
      thumb.sawnX = x;
      thumb.sawnY = y;
      if (distance <= SAW_SAMPLE_SPACING) break;
    }
    return pops;
  };

  const step = (physics: World) => {
    let popBudget = MAX_POPS_PER_STEP;
    for (const thumb of thumbs.values()) {
      chase(thumb);
      if (thumb.mode === "saw") {
        popBudget -= saw(physics, thumb, popBudget);
        continue;
      }
      thumb.sinceSpawn += STEP_MS;
      while (thumb.sinceSpawn >= SPAWN_INTERVAL_MS) {
        thumb.sinceSpawn -= SPAWN_INTERVAL_MS;
        spawnLetter(physics, thumb);
      }
    }

    physics.step();

    const drained = height + 40;
    const gone = letters.filter(l => l.body.translation().y > drained + 120);
    if (gone.length) {
      for (const letter of gone) removeLetter(physics, letter);
      letters = letters.filter(letter => !gone.includes(letter));
    }

    for (const letter of letters) {
      const { body } = letter;
      letter.age += STEP_MS;
      // Backstop: a hard enough shove can still wedge a small letter into a
      // wall, where the pile then holds it. No letter is narrow enough for
      // its middle to belong this close to the edge, so ease it back in.
      const { x, y } = body.translation();
      const inside = clamp(x, WALL_MARGIN, width - WALL_MARGIN);
      if (inside !== x) {
        body.setTranslation({ x: x + (inside - x) * 0.2, y }, true);
      }
    }

    let anyDrained = false;
    for (const dot of dots) {
      if (dot.body.translation().y > drained) anyDrained = true;
      if (dot.holdMs <= 0) continue;
      dot.holdMs -= STEP_MS;
      if (dot.holdMs > 0) continue;
      dot.body.setGravityScale(1, true);
      dot.body.setLinvel({ x: dot.burstX, y: dot.burstY }, true);
    }
    if (anyDrained) {
      dots = dots.filter(dot => {
        const gone = dot.body.translation().y > drained;
        if (gone) physics.removeRigidBody(dot.body);
        return !gone;
      });
      if (dots.length === 0 && letters.length === 0) sighAge = 0;
    }
  };

  const sighOpacity = (age: number) => {
    if (age < SIGH_FADE_IN_MS) return age / SIGH_FADE_IN_MS;
    const leaving = age - SIGH_FADE_IN_MS - SIGH_HOLD_MS;
    return leaving < 0 ? 1 : Math.max(0, 1 - leaving / SIGH_FADE_OUT_MS);
  };

  const sigh = (elapsed: number) => {
    if (sighAge === null) return;
    const fadeOutAt = SIGH_FADE_IN_MS + SIGH_HOLD_MS;
    if (sighAge < fadeOutAt && letters.length + dots.length > 0) {
      // Interrupted: leave from however far it had got, not from full.
      sighAge = fadeOutAt + (1 - sighOpacity(sighAge)) * SIGH_FADE_OUT_MS;
    }
    sighAge += elapsed;
    if (sighAge >= fadeOutAt + SIGH_FADE_OUT_MS) sighAge = null;
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = INK;
    ctx.beginPath();
    for (const side of [-1, 1] as const) {
      funnelSide(side).forEach(([x, y], i) =>
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      );
      ctx.closePath();
    }
    ctx.fill();

    ctx.beginPath();
    for (const { body } of dots) {
      const at = body.translation();
      ctx.moveTo(at.x + DOT_RADIUS, at.y);
      ctx.arc(at.x, at.y, DOT_RADIUS, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.font = REFERENCE_FONT;
    ctx.textBaseline = "alphabetic";
    for (const { body, char, scale, age, centre } of letters) {
      const at = body.translation();
      const angle = body.rotation();
      const pop = age < POP_IN_MS ? 0.35 + 0.65 * (age / POP_IN_MS) : 1;
      const cos = Math.cos(angle) * scale * pop * dpr;
      const sin = Math.sin(angle) * scale * pop * dpr;
      ctx.setTransform(cos, sin, -sin, cos, at.x * dpr, at.y * dpr);
      ctx.fillText(char, -centre.x, -centre.y);
    }

    if (sighAge !== null) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = SIGH_OPACITY * sighOpacity(sighAge);
      ctx.font = SIGH_FONT;
      ctx.textAlign = "center";
      ctx.fillText(SIGH_TEXT, width / 2, height * SIGH_HEIGHT);
      ctx.textAlign = "start";
      ctx.globalAlpha = 1;
    }

    if (debug) drawDebug();
  };

  const drawDebug = () => {
    ctx.strokeStyle = "rgba(230, 40, 40, 0.9)";
    for (const { body, scale, polygons } of letters) {
      const at = body.translation();
      const angle = body.rotation();
      const cos = Math.cos(angle) * scale * dpr;
      const sin = Math.sin(angle) * scale * dpr;
      ctx.setTransform(cos, sin, -sin, cos, at.x * dpr, at.y * dpr);
      ctx.lineWidth = 1 / scale;
      ctx.beginPath();
      for (const polygon of polygons) {
        polygon.forEach((p, i) =>
          i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
        );
        ctx.closePath();
      }
      ctx.stroke();
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const { body, radius } of thumbs.values()) {
      const at = body.translation();
      ctx.moveTo(at.x + radius, at.y);
      ctx.arc(at.x, at.y, radius, 0, Math.PI * 2);
    }
    ctx.stroke();

    ctx.fillStyle = "rgba(40, 90, 230, 0.9)";
    ctx.font = "12px monospace";
    ctx.fillText(
      `${letters.length}/${letterCap} +${dots.length} ${stepCost.toFixed(1)}ms`,
      8,
      16
    );
  };

  const tick = (time: number) => {
    if (destroyed || !world) return;
    frame = requestAnimationFrame(tick);
    accumulator += Math.min(
      time - lastFrameTime,
      STEP_MS * MAX_STEPS_PER_FRAME
    );
    sigh(Math.min(time - lastFrameTime, 100));
    lastFrameTime = time;
    const started = performance.now();
    while (accumulator >= STEP_MS) {
      accumulator -= STEP_MS;
      step(world);
    }
    stepCost += (performance.now() - started - stepCost) * 0.05;
    draw();
  };

  // --- Input ----------------------------------------------------------------

  const toLocal = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!world) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = toLocal(event);
    const isMouse = event.pointerType === "mouse";
    const reach = isMouse ? REACH_MOUSE : REACH_TOUCH;

    // Where the touch lands decides what the finger is until it lifts. Out in
    // the open it pours letters, and pushes them about. Anywhere else -- on a
    // letter, in among letters, or in a bed of periods -- it is the saw, and
    // pops whatever letters it touches.
    const pouringRadius = isMouse ? 16 : clamp(event.width / 2, 24, 38);
    const sawing = isCrowded(world, x, y, pouringRadius + FOUNTAIN_CLEARANCE);
    const radius = sawing ? reach : pouringRadius;

    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x, y)
        .setGravityScale(0)
        .lockRotations()
        .setCanSleep(false)
        .setCcdEnabled(true)
    );
    world.createCollider(
      RAPIER.ColliderDesc.ball(radius)
        .setFriction(0.2)
        .setDensity(0.4)
        // The finger moves letters, not periods: a disc this size landing in
        // a bed of them blasts a clean circle out of it, which reads as a
        // force field rather than a touch.
        .setCollisionGroups(IGNORING_DOTS),
      body
    );
    thumbs.set(
      event.pointerId,
      sawing
        ? { mode: "saw", body, radius, x, y, reach, sawnX: x, sawnY: y }
        : {
            mode: "fountain",
            body,
            radius,
            x,
            y,
            // First letter comes out with the touch, not a beat after it.
            sinceSpawn: SPAWN_INTERVAL_MS
          }
    );
  };

  const onPointerMove = (event: PointerEvent) => {
    const thumb = thumbs.get(event.pointerId);
    if (!thumb) return;
    const { x, y } = toLocal(event);
    thumb.x = x;
    thumb.y = y;
  };

  const onPointerEnd = (event: PointerEvent) => {
    const thumb = thumbs.get(event.pointerId);
    if (!thumb) return;
    thumbs.delete(event.pointerId);
    world?.removeRigidBody(thumb.body);
    // Anything that dozed off leaning on the thumb has lost its support.
    wakeAll();
  };

  const prevent = (event: Event) => event.preventDefault();

  // Debug only: "p" pops every letter at once.
  const onDebugKey = (event: KeyboardEvent) => {
    if (!world || event.key !== "p") return;
    for (const letter of [...letters]) popLetter(world, letter);
  };

  // --- Lifecycle ------------------------------------------------------------

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerEnd);
  canvas.addEventListener("pointercancel", onPointerEnd);
  canvas.addEventListener("contextmenu", prevent);
  // touch-action covers this in current browsers; this is the backstop that
  // stops a drag from rubber-banding or pulling to refresh in older ones.
  canvas.addEventListener("touchmove", prevent, { passive: false });

  if (debug) window.addEventListener("keydown", onDebugKey);

  const resizeObserver = new ResizeObserver(layout);
  resizeObserver.observe(canvas);
  measure();
  draw();

  // Shapes traced before the webfont arrives would be of the fallback face.
  document.fonts.addEventListener("loadingdone", clearGlyphShapes);
  const fontReady = Promise.race([
    document.fonts.load(REFERENCE_FONT, "A&g"),
    new Promise(resolve => setTimeout(resolve, 2500))
  ]).catch(() => undefined);

  Promise.all([RAPIER.init(), fontReady]).then(() => {
    if (destroyed) return;
    clearGlyphShapes();
    world = new RAPIER.World({ x: 0, y: GRAVITY });
    world.lengthUnit = PIXELS_PER_METRE;
    world.timestep = STEP_MS / 1000;
    world.numSolverIterations = 12;
    // Stiffer contacts than the default, so a small letter under a heavy pile
    // is not pressed into the stroke it is resting on.
    world.integrationParameters.contact_natural_frequency = 60;
    layout();
    lastFrameTime = performance.now();
    frame = requestAnimationFrame(tick);
  });

  return {
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("keydown", onDebugKey);
      document.fonts.removeEventListener("loadingdone", clearGlyphShapes);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerEnd);
      canvas.removeEventListener("pointercancel", onPointerEnd);
      canvas.removeEventListener("contextmenu", prevent);
      canvas.removeEventListener("touchmove", prevent);
      world?.free();
      world = null;
    }
  };
};
