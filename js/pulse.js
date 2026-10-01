import { BASE_BURN } from "./data.js";

export const PULSE_CAP = 12;

export function nextPulse(current) {
  return current >= PULSE_CAP ? current : current + 1;
}

let extra = 0;
const listeners = new Set();

function emit() {
  const value = BASE_BURN + extra;
  listeners.forEach((fn) => fn(value, extra));
}

const timer = setInterval(() => {
  const next = nextPulse(extra);
  if (next === extra) {
    clearInterval(timer);
    return;
  }
  extra = next;
  emit();
}, 8000);

export function onBurn(fn) {
  listeners.add(fn);
  fn(BASE_BURN + extra, extra);
  return () => listeners.delete(fn);
}
