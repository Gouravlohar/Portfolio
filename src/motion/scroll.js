let controller = null;
let isLocked = false;

export function setScrollController(value) {
  controller = value;
  if (isLocked) controller?.stop();
}

export function lockScroll(locked) {
  isLocked = locked;
  if (locked) controller?.stop();
  else controller?.start();
}

export function scrollToTarget(target, { immediate = false } = {}) {
  const element =
    typeof target === "string"
      ? document.getElementById(target.replace(/^#/, ""))
      : target;
  if (element == null) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = typeof element === "number" ? 0 : -88;
  // Use one numeric destination in both paths. Lenis also applies CSS scroll
  // margins/padding to element targets, which would double the navbar offset.
  const top =
    typeof element === "number"
      ? element
      : element.getBoundingClientRect().top + window.scrollY + offset;
  if (controller) {
    // A route change can replace a short filtered journal with the full home
    // page before Lenis's resize observer runs. Refresh its scroll limit first.
    controller.resize();
    controller.scrollTo(top, { immediate: immediate || reduced });
  } else {
    window.scrollTo({
      top,
      behavior: immediate || reduced ? "instant" : "smooth",
    });
  }
}
