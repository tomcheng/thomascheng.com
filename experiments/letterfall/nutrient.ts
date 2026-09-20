// The running count, at the right-hand lip of the neck, of everything that
// has gone down the funnel: letters and periods alike. It is kept between visits; a tap on it
// starts it again from nothing.

const STORE = "letterfall-nutrient";
const SAVE_EVERY_MS = 1000;

export const showNutrient = () => {
  let count = 0;
  try {
    count = Number(localStorage.getItem(STORE)) || 0;
  } catch {
    // No storage (private browsing, say): the count just starts from nothing.
  }

  const label = document.createElement("button");
  label.type = "button";
  label.className = "nutrient";
  const show = () => {
    label.textContent = `Nutrients: ${count.toLocaleString("en")}`;
  };

  // A popped letter drains as hundreds of periods within a second or two, so
  // the count is written down now and then rather than on every one of them.
  let saving = 0;
  const save = () => {
    saving = 0;
    try {
      localStorage.setItem(STORE, String(count));
    } catch {
      // As above.
    }
  };

  label.addEventListener("click", () => {
    count = 0;
    show();
    save();
  });
  window.addEventListener("pagehide", save);
  show();
  document.body.append(label);

  return {
    add: (drained: number) => {
      count += drained;
      show();
      saving ||= window.setTimeout(save, SAVE_EVERY_MS);
    }
  };
};
