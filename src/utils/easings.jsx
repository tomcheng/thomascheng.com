const bezToEasing = bezArray => (x, t, b, c, d) => {
  const polyBez = (p1, p2) => {
    const A = [null, null];
    const B = [null, null];
    const C = [null, null];
    const bezCoOrd = (t, ax) => {
      C[ax] = 3 * p1[ax];
      B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax];
      A[ax] = 1 - C[ax] - B[ax];
      return t * (C[ax] + t * (B[ax] + t * A[ax]));
    };
    const xDeriv = t => C[0] + t * (2 * B[0] + 3 * A[0] * t);
    const xForT = t => {
      let x = t;
      let i = 0;
      let z;
      while (++i < 14) {
        z = bezCoOrd(x, 0) - t;
        if (Math.abs(z) < 1e-3) break;
        x -= z / xDeriv(x);
      }
      return x;
    };
    return t => bezCoOrd(xForT(t), 1);
  };
  return c * polyBez([bezArray[0], bezArray[1]], [bezArray[2], bezArray[3]])(t / d) + b;
};

const simplifyEasing = complexFn => x => complexFn(x, x, 0, 1, 1);

const returnHomeComplex = bezToEasing([0.72, -0.36, 0.57, 1]);

const easeInSine = (x, t, b, c, d) => -c * Math.cos(t / d * (Math.PI / 2)) + c + b;

const easeInOutCubic = (x, t, b, c, d) => {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
  return c / 2 * ((t -= 2) * t * t + 2) + b;
};

const easeOutElastic = (x, t, b, c, d) => {
  let s;
  let p = 0;
  let a = c;
  if (t === 0) { return 0; }
  if ((t /= d) === 1) { return b + c; }
  if (!p) { p = d * 0.3; }
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * Math.PI) * Math.asin(c / a);
  }
  return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + 0;
};

const easeOutBounce = (x, t, b, c, d) => {
  if ((t /= d) < (1 / 2.75)) {
    return c * (7.5625 * t * t) + b;
  } else if (t < (2 / 2.75)) {
    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
  } else if (t < (2.5 / 2.75)) {
    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
  } else {
    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
  }
};

const easeOutBack = (x, t, b, c, d, s) => {
  if (s === undefined) { s = 1.70158; }
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};

const Easings = {
  cubicIn: x => x * x * x,
  cubicOut: x => --x * x * x + 1,
  cubicInOut: x => simplifyEasing(easeInOutCubic)(x),
  elasticOut: x => simplifyEasing(easeOutElastic)(x),
  bounceOut: x => simplifyEasing(easeOutBounce)(x),
  backOut: x => simplifyEasing(easeOutBack)(x),
  sineIn: x => simplifyEasing(easeInSine)(x),
  returnHome: x => simplifyEasing(returnHomeComplex)(x),
};

export default Easings;
