/**
 * Primitive script for detecting JS main thread blocking.
 */

let prev = Date.now();
const checkInterval = 30;
const allowedDrift = 40;

setInterval(() => {
  const now = Date.now();
  const diff = now - prev;
  prev = now;

  if (diff > allowedDrift) {
    console.log(`Main thread was blocked for ${diff}ms (${Math.round(diff/checkInterval)} ticks)`);
  }

}, checkInterval);