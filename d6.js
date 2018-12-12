const fs = require("fs");

const makeCoord = str => {
  const int = n => parseInt(n, 10);
  const [x, y] = str.split(", ").map(int);
  return { x, y };
};

function createCoordinates() {
  const coordinates = fs
    .readFileSync("./d6.txt", "utf8")
    .split("\n")
    .map(makeCoord);

  return coordinates;
}

function createIdsForCoords(coords = createCoordinates()) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let i = 0;
  let duplicator = 1;
  for (const c of coords) {
    c.id = "";
    for (let j = 0; j < duplicator; j++) {
      c.id += letters[i];
    }

    i++;
    if (i === letters.length) {
      i = 0;
      duplicator++;
    }
  }

  return coords;
}

function drawGrid(grid) {
  let gridStr = "";
  for (let i = 0; i < grid.length; i++) {
    gridStr += grid[i].join("");
    gridStr += "\n";
  }
  return gridStr;
}

function getHighsAndLows(coords) {
  const lowestX = Math.min(...coords.map(c => c.x));
  const lowestY = Math.min(...coords.map(c => c.y));
  const highestX = Math.max(...coords.map(c => c.x));
  const highestY = Math.max(...coords.map(c => c.y));
  return { lowestX, lowestY, highestX, highestY };
}

function createGridFromCoordinates(coords) {
  const { highestX, highestY, lowestX, lowestY } = getHighsAndLows(coords);

  const grid = [];
  for (let i = 0; i <= highestY; i++) {
    const row = [];
    for (let j = 0; j <= highestX; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  return grid;
}

function plotPoints(points, grid) {
  for (let i = 0; i < points.length; i++) {
    const { x, y, id } = points[i];
    grid[y][x] = id;
  }
  return grid;
}

const allCoordinates = createIdsForCoords();

let grid = createGridFromCoordinates(allCoordinates);

grid = plotPoints(allCoordinates, grid);

for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    const mDistance = {};
    for (const { x, y, id } of allCoordinates) {
      mDistance[id] = Math.abs(j - x) + Math.abs(i - y);
    }
    const smallest = Math.min(...Object.values(mDistance));
    const ids = [];
    const matchingIds = Object.keys(mDistance).filter(key => {
      if (mDistance[key] === smallest) {
        ids.push(key);
      }
      return mDistance[key] === smallest;
    });
    if (matchingIds.length > 1) {
      grid[i][j] = ".";
    } else {
      grid[i][j] = ids[0];
    }
  }
}
// console.log(p);
// fs.writeFileSync("grid.txt", JSON.stringify(allCoordinates, null, 2), "utf8");
fs.writeFileSync("grid.txt", drawGrid(grid), "utf8");
