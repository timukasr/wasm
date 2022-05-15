/**
 * JavaScript spinner loader, used to demonstrate main thread blocking
 */

const loader = document.querySelector(".loader");
let start;

const rotationSpeed = 1000;
function animate(timestamp) {
  requestAnimationFrame(animate);

  if (start === undefined) {
    start = timestamp;
  }

  const elapsed = timestamp - start;
  const rotation = (elapsed / rotationSpeed * 360) % 360;

  loader.style = `transform: rotate(${rotation}deg);`;
}
animate();