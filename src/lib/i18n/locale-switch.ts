const SCRAMBLE_KEY = "pun-locale-scramble";
const SCROLL_KEY = "pun-scroll-y";

/** Call right before navigating to another locale. */
export function markLocaleSwitch() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SCRAMBLE_KEY, "1");
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  // Keep flag long enough for every ScrambleText on the next page to read it
  window.setTimeout(() => {
    sessionStorage.removeItem(SCRAMBLE_KEY);
  }, 900);
}

export function shouldLocaleScramble() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SCRAMBLE_KEY) === "1";
}

export function restoreLocaleScroll() {
  if (typeof window === "undefined") return;
  const raw = sessionStorage.getItem(SCROLL_KEY);
  if (raw == null) return;
  sessionStorage.removeItem(SCROLL_KEY);
  const y = Number(raw);
  if (!Number.isFinite(y)) return;

  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  const apply = () => {
    window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
  };

  apply();
  requestAnimationFrame(apply);
  window.setTimeout(apply, 0);
  window.setTimeout(apply, 50);
  window.setTimeout(apply, 120);
  window.setTimeout(() => {
    apply();
    html.style.scrollBehavior = previous;
  }, 200);
}
