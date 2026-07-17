(() => {
  "use strict";

  const controller = document.querySelector("#controllerVisual");
  if (!controller || !("ontouchstart" in window || navigator.maxTouchPoints > 0)) return;

  const KEY_MAP = {
    up: { key: "ArrowUp", code: "ArrowUp" },
    down: { key: "ArrowDown", code: "ArrowDown" },
    left: { key: "ArrowLeft", code: "ArrowLeft" },
    right: { key: "ArrowRight", code: "ArrowRight" },
    light: { key: "j", code: "KeyJ" },
    medium: { key: "k", code: "KeyK" },
    heavy: { key: "l", code: "KeyL" },
    special: { key: "u", code: "KeyU" },
    assist: { key: "i", code: "KeyI" },
    drive: { key: "o", code: "KeyO" }
  };

  const touchInputs = new Map();
  const heldCounts = new Map();
  let lastTouchAt = 0;

  controller.style.touchAction = "none";
  controller.style.webkitUserSelect = "none";
  controller.style.userSelect = "none";
  controller.style.webkitTouchCallout = "none";

  controller.querySelectorAll("[data-input]").forEach((button) => {
    button.style.touchAction = "none";
    button.style.webkitUserSelect = "none";
    button.style.userSelect = "none";
    button.style.webkitTouchCallout = "none";
  });

  function inputAt(touch) {
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const button = target?.closest?.("[data-input]");
    return button && controller.contains(button) ? button.dataset.input : null;
  }

  function dispatchKey(type, input) {
    const mapping = KEY_MAP[input];
    if (!mapping) return;

    const event = new KeyboardEvent(type, {
      key: mapping.key,
      code: mapping.code,
      bubbles: true,
      cancelable: true,
      repeat: false
    });
    document.dispatchEvent(event);
  }

  function press(input) {
    if (!input) return;
    const count = heldCounts.get(input) ?? 0;
    heldCounts.set(input, count + 1);
    if (count === 0) dispatchKey("keydown", input);
  }

  function release(input) {
    if (!input) return;
    const count = heldCounts.get(input) ?? 0;
    if (count <= 1) {
      heldCounts.delete(input);
      dispatchKey("keyup", input);
    } else {
      heldCounts.set(input, count - 1);
    }
  }

  function assignTouch(touch, input) {
    const previous = touchInputs.get(touch.identifier) ?? null;
    if (previous === input) return;
    if (previous) release(previous);
    if (input) press(input);
    if (input) touchInputs.set(touch.identifier, input);
    else touchInputs.delete(touch.identifier);
  }

  function onTouchStart(event) {
    lastTouchAt = performance.now();
    event.preventDefault();
    event.stopImmediatePropagation();
    for (const touch of event.changedTouches) assignTouch(touch, inputAt(touch));
  }

  function onTouchMove(event) {
    lastTouchAt = performance.now();
    event.preventDefault();
    event.stopImmediatePropagation();
    for (const touch of event.changedTouches) assignTouch(touch, inputAt(touch));
  }

  function onTouchEnd(event) {
    lastTouchAt = performance.now();
    event.preventDefault();
    event.stopImmediatePropagation();
    for (const touch of event.changedTouches) {
      const input = touchInputs.get(touch.identifier);
      release(input);
      touchInputs.delete(touch.identifier);
    }
  }

  function releaseAll() {
    for (const input of touchInputs.values()) release(input);
    touchInputs.clear();
    heldCounts.clear();
  }

  controller.addEventListener("touchstart", onTouchStart, { capture: true, passive: false });
  controller.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
  controller.addEventListener("touchend", onTouchEnd, { capture: true, passive: false });
  controller.addEventListener("touchcancel", onTouchEnd, { capture: true, passive: false });

  // iOS creates a delayed click after touch. Suppress it so one press is not counted twice.
  controller.addEventListener("click", (event) => {
    if (performance.now() - lastTouchAt < 800) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  controller.addEventListener("contextmenu", (event) => event.preventDefault());
  controller.addEventListener("gesturestart", (event) => event.preventDefault(), { passive: false });
  window.addEventListener("blur", releaseAll);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) releaseAll();
  });
})();
