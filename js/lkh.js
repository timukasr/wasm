const worker = new Worker("../lkh/worker.js", { type: "module" });

let nextId = 0;

const promises = new Map();

worker.addEventListener("message", e => {
  if (e.data.type === "path") {
    const id = e.data.id;
    const resolve = promises.get(id);

    if (resolve) {
      resolve(e.data.path);
      promises.delete(id);
    }
  }
});

function getPath(circles) {
  const id = nextId++;

  return new Promise(resolve => {
    promises.set(id, resolve);

    worker.postMessage({
      type: "getPath",
      id,
      circles,
    });
  });
}
