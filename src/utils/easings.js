const bezToEasing = bezArray => x => {
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
  return polyBez([bezArray[0], bezArray[1]], [bezArray[2], bezArray[3]])(x);
};

export const bounceOut = x => {
  if (x < (1 / 2.75)) {
    return 7.5625 * x * x;
  } else if (x < (2 / 2.75)) {
    return 7.5625 * (x -= (1.5 / 2.75)) * x + 0.75;
  } else if (x < (2.5 / 2.75)) {
    return 7.5625 * (x -= (2.25 / 2.75)) * x + 0.9375;
  } else {
    return 7.5625 * (x -= (2.625 / 2.75)) * x + 0.984375;
  }
};

export const cubicInOut = x => {
  // eslint-disable-next-line no-cond-assign
  if ((x *= 2) < 1) { return 1 / 2 * x * x * x; }
  return 1 / 2 * ((x -= 2) * x * x + 2);
};

export const cubicOut = x => --x * x * x + 1;

export const elasticOut = x => {
  if (x === 0) { return 0; }
  if (x === 1) { return 1; }
  const s = 0.3 / (2 * Math.PI) * Math.asin(1);
  return Math.pow(2, -10 * x) * Math.sin((x - s) * (2 * Math.PI) / 0.3) + 1;
};

export const returnHome = bezToEasing([0.72, -0.36, 0.57, 1]);

export const sineIn = x => -Math.cos(x / 1 * (Math.PI / 2)) + 1;
