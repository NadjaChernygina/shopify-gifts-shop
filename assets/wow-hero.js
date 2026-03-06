document.addEventListener("DOMContentLoaded", function () {
  const banner = document.querySelector(".banner[data-wow]");
  if (!banner) return;

  const heading = banner.querySelector(".banner__heading");
  if (!heading) return;

  // знайдемо header (у Dawn найчастіше так)
  const header =
    document.querySelector(".header-wrapper") ||
    document.querySelector("#shopify-section-header") ||
    document.querySelector("header");

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function readSizes() {
    const styles = window.getComputedStyle(heading);
    const start = parseFloat(styles.getPropertyValue("--wow-start")) || 200;
    const end = parseFloat(styles.getPropertyValue("--wow-end")) || 100;
    return { start, end };
  }

  function getHeaderBottom() {
    if (!header) return 0;
    return header.getBoundingClientRect().bottom;
  }

  let startDistance = null; // зафіксуємо “дистанцію до хедера” на старті
  let ticking = false;

  function update() {
    ticking = false;

    const headerBottom = getHeaderBottom();
    const wordRect = heading.getBoundingClientRect();

    // точка, до якої слово не повинно заходити (низ хедера + невеликий зазор)
    const targetY = headerBottom + 8;

    // скільки px лишилось до зіткнення (поки >0 — слово нижче хедера)
    const distance = wordRect.top - targetY;

    // ініціалізуємо стартову дистанцію (перша відмальовка)
    if (startDistance === null) {
      startDistance = Math.max(distance, 1);
    }

    // прогрес 0..1: 0 на старті, 1 коли слово дійшло до хедера
    const raw = 1 - clamp(distance / startDistance, 0, 1);
    const eased = easeOutCubic(raw);

    const { start, end } = readSizes();
    const sizePx = start + (end - start) * eased;

    heading.style.setProperty("--wow-size", String(sizePx));
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  function onResize() {
    // на ресайзі перераховуємо, бо header висота/позиція можуть мінятись
    startDistance = null;
    update();
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
});