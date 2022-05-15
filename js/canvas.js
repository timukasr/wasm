// Based on https://jsfiddle.net/m1erickson/ytUhL/

const canvas = document.getElementById("canvas");
const distanceElem = document.getElementById("path");
const ctx = canvas.getContext("2d");
const offsetX = canvas.offsetLeft;
const offsetY = canvas.offsetTop;
const cw = canvas.width;
const ch = canvas.height;

let lastX;
let lastY;

const PI2 = Math.PI * 2;

let circles = [];
let prevQueryCircles = circles;
let path = [];

let stdRadius = 10;
let draggingCircleIndex = -1;

function drawAll() {
  ctx.clearRect(0, 0, cw, ch);

  drawPathBetweenCircles();

  for (const circle of circles) {
    drawCircle(circle);
  }
}

function drawCircle(circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, stdRadius, 0, PI2);
  ctx.closePath();
  ctx.fillStyle = "blue";
  ctx.fill();
}

function isCircleHit(circle) {
  let dx = lastX - circle.x;
  let dy = lastY - circle.y;

  return dx * dx + dy * dy < stdRadius * stdRadius;
}

function handleMouseDown(e) {
  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // save the mouse position
  // in case this becomes a drag operation
  lastX = e.clientX - offsetX;
  lastY = e.clientY - offsetY;

  // hit test all existing circles
  const hit = circles.findIndex(isCircleHit);

  // if no hits then add a circle
  // if hit then set the isDown flag to start a drag
  if (hit === -1) {
    circles = [
      ...circles,
      {
        x: lastX,
        y: lastY,
      },
    ];
    drawAll();
  } else {
    draggingCircleIndex = hit;
  }
}

function handleDoubleClick(e) {
  // // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // save the mouse position
  // in case this becomes a drag operation
  lastX = e.clientX - offsetX;
  lastY = e.clientY - offsetY;

  // hit test all existing circles
  const hit = circles.find(isCircleHit);

  if (hit) {
    // remove the circle
    circles = circles.filter(c => c !== hit);
    drawAll();
    updatePath();
  }
}

function handleMouseUp(e) {
  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // stop the drag
  draggingCircleIndex = -1;

  updatePath();
}

function handleMouseMove(e) {
  // if we're not dragging, just exit
  if (draggingCircleIndex === -1) {
    return;
  }

  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // get the current mouse position
  const mouseX = e.clientX - offsetX;
  const mouseY = e.clientY - offsetY;

  // calculate how far the mouse has moved
  // since the last mousemove event was processed
  const dx = mouseX - lastX;
  const dy = mouseY - lastY;

  // reset the lastX/Y to the current mouse position
  lastX = mouseX;
  lastY = mouseY;

  // change the target circles position by the
  // distance the mouse has moved since the last
  // mousemove event

  const draggingCircle = circles[draggingCircleIndex];
  circles = [
    ...circles.slice(0, draggingCircleIndex),
    {
      ...draggingCircle,
      x: draggingCircle.x + dx,
      y: draggingCircle.y + dy,
    },
    ...circles.slice(draggingCircleIndex + 1),
  ];

  // redraw all the circles
  drawAll();
}

function drawRandomCircles(count) {
  circles = [];
  for (let i = 0; i < count; i++) {
    circles.push({
      x: stdRadius + Math.random() * (cw - 2 * stdRadius),
      y: stdRadius + Math.random() * (ch - 2 * stdRadius),
    });
  }

  drawAll();

  updatePath();
}

function drawPathBetweenCircles() {
  if (path.length === 0 || prevQueryCircles !== circles) {
    return;
  }

  let prev = circles[path[path.length - 1]];
  let distance = 0;
  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y);

  for (const index of path) {
    const circle = circles[index];

    ctx.lineTo(circle.x, circle.y);
    distance += Math.sqrt(Math.pow(circle.x - prev.x, 2) + Math.pow(circle.y - prev.y, 2));
    prev = circle;
  }

  ctx.stroke();
  distanceElem.innerHTML = `Distance: ${Math.round(distance)}px`;
}

function updatePath() {
  if (prevQueryCircles === circles || circles.length < 3) {
    return;
  }

  const cachedCircles = circles;
  const start = performance.now();

  getPath(circles)
    .then(newPath => {
      const duration = performance.now() - start;
      const isObsolete = cachedCircles !== circles;

      console.log(`Path for ${circles.length} nodes found in ${duration}ms${isObsolete ? " (obsolete)" : ""}`);

      if (!isObsolete) {
        path = newPath;
        prevQueryCircles = circles;
        drawAll();
      }
    })
    .catch(e => {
      console.error(e);
    });
}

drawRandomCircles(50);

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mouseout", handleMouseUp);
canvas.addEventListener("dblclick", handleDoubleClick);

document.getElementById("reset").addEventListener("click", () => {
  circles = [];
  path = [];
  prevQueryCircles = circles;
  drawAll();
});
