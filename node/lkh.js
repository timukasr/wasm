const lkh = require("../lkh/lkh.js");

module.exports = async function (circles) {
  const instance = await lkh({
    arguments: ["input.txt"],
    preRun(instance) {
      instance.FS.writeFile(
        "input.txt",
        `PROBLEM_FILE = problem.txt
RUNS=100
TOUR_FILE=tour.txt
`,
      );
      instance.FS.writeFile(
        "problem.txt",
        `NAME: TEST
TYPE: TSP
DIMENSION: ${circles.length}
EDGE_WEIGHT_TYPE: EUC_2D
EDGE_WEIGHT_FORMAT: FUNCTION
NODE_COORD_TYPE: TWOD_COORDS
NODE_COORD_SECTION
${circles.map((circle, index) => `${index + 1} ${circle.x} ${circle.y}`).join("\n")}
EOF
      `,
      );
    },
    print(text) {
      // console.log(text);
    },
  });

  const output = instance.FS.readFile("tour.txt", { encoding: "utf8" });

  return output
    .split("\n")
    .slice(6, -3)
    .map(x => parseInt(x, 10) - 1);
};
