// The phone's own motion, as the pull its contents would feel. The page is
// treated as a box with the letters loose inside it, and what is loose in a
// box feels exactly what the box's accelerometer reports, the other way
// round: tip it and down moves, turn it over and down is the roof, shake it
// and everything is thrown against the walls. So the reading is used as it
// comes, one to one, with nothing exaggerated and nothing held back. A phone
// leaning back has weaker gravity in the plane of its screen, and one lying
// flat has none.

// Just enough smoothing to take the grain off the sensor, well short of
// anything that could be felt as lag.
const SMOOTHING_MS = 25;
// A sane limit on a jolt, in g: a phone rapped on a table reads far more than
// the pile could be asked to survive.
const MAX_PULL = 4;
// A reading older than this is stale (the page was hidden, say): a jolt
// caught in it is not left ringing, and the phone's slower lean is used.
const MAX_GAP_MS = 250;
const LEAN_SETTLE_MS = 500;

type Pull = { x: number; y: number };

type MotionPermission = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

// iOS reports acceleration with the opposite sign to everything else.
const IS_IOS =
  /iP(hone|ad|od)/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/**
 * Watch the phone's motion. `pull()` is what gravity should be just now, as a
 * multiple of its usual strength, in screen axes (x right, y down): { 0, 1 }
 * for a phone held upright and still, or one with no sensor at all.
 */
export const watchMotion = (target: HTMLElement) => {
  // The reading, and the slow lean underneath it; both in g, in screen axes.
  let felt: Pull | null = null;
  let lean: Pull = { x: 0, y: 1 };
  let lastReading = 0;

  const onMotion = (event: DeviceMotionEvent) => {
    const reading = event.accelerationIncludingGravity;
    if (reading?.x == null || reading.y == null) return;

    // What the contents feel, in the phone's own axes (x right, y up): the
    // opposite of what the sensor reports (which at rest is the push of the
    // hand holding it up).
    const sign = IS_IOS ? 1 : -1;
    const feltX = (sign * reading.x) / 9.81;
    const feltY = (sign * reading.y) / 9.81;
    // Into the screen's axes, whichever way up the page is being shown.
    const turned = ((screen.orientation?.angle ?? 0) * Math.PI) / 180;
    const x = feltX * Math.cos(turned) - feltY * Math.sin(turned);
    const y = -feltX * Math.sin(turned) - feltY * Math.cos(turned);

    const elapsed = event.timeStamp - lastReading;
    lastReading = event.timeStamp;
    if (!felt || elapsed > MAX_GAP_MS) {
      felt = { x, y };
      lean = { x, y };
      return;
    }
    const follow = 1 - Math.exp(-elapsed / SMOOTHING_MS);
    felt.x += (x - felt.x) * follow;
    felt.y += (y - felt.y) * follow;
    const settle = 1 - Math.exp(-elapsed / LEAN_SETTLE_MS);
    lean.x += (x - lean.x) * settle;
    lean.y += (y - lean.y) * settle;
  };

  // iOS only hands over the sensor if asked from inside a tap. The first one
  // anywhere on the page will do; if that turns out not to count as a tap,
  // the next one is tried.
  const gestures = ["pointerup", "touchend", "click"] as const;
  let asking = false;
  const ask = async () => {
    const { requestPermission } = DeviceMotionEvent as MotionPermission;
    if (!requestPermission || asking) return;
    asking = true;
    try {
      await requestPermission.call(DeviceMotionEvent);
      for (const type of gestures) target.removeEventListener(type, ask);
    } catch {
      // Not a gesture it accepts.
    }
    asking = false;
  };

  const supported = typeof DeviceMotionEvent !== "undefined";
  if (supported) {
    window.addEventListener("devicemotion", onMotion);
    for (const type of gestures) target.addEventListener(type, ask);
  }

  return {
    pull: (): Pull => {
      if (!felt) return { x: 0, y: 1 };
      const live = performance.now() - lastReading < MAX_GAP_MS;
      const { x, y } = live ? felt : lean;
      const limit = Math.min(1, MAX_PULL / (Math.hypot(x, y) || 1));
      return { x: x * limit, y: y * limit };
    },
    destroy: () => {
      if (!supported) return;
      window.removeEventListener("devicemotion", onMotion);
      for (const type of gestures) target.removeEventListener(type, ask);
    }
  };
};
