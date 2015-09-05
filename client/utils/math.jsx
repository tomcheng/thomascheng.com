export default {
  constrain: (value, min, max) => Math.min(Math.max(value, min), max)
};
