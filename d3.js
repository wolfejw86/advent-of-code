const fs = require("fs");

function parseClaim(claim) {
  const [idHash, rest] = claim.split(" @ ");
  const id = parseInt(idHash.replace("#", ""));
  const [pos, dim] = rest.split(": ");
  const [left, top] = pos.split(",").map(n => parseInt(n));
  const [width, height] = dim.split("x").map(n => parseInt(n));
  return { id, left, top, width, height };
}

function createBaseGrid(width, height) {
  const grid = [];
  for (let i = 0; i < height; i++) {
    grid.push([]);
    for (let j = 0; j < width; j++) {
      grid[i].push(".");
    }
  }
  return grid;
}

function drawFabricFromClaim(grid, { top, left, id, width, height }) {
  for (let i = top; i < top + height; i++) {
    for (let j = left; j < left + width; j++) {
      grid[i][j] = grid[i][j] === "." ? id : "X";
    }
  }

  return grid;
}

function createDrawnGrid(grid, claims) {
  for (let i = 0; i < claims.length; i++) {
    grid = drawFabricFromClaim(grid, claims[i]);
  }

  return grid;
}

function sumGridOverlaps(grid) {
  let overLapSum = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "X") {
        overLapSum++;
      }
    }
  }

  return overLapSum;
}

function isOveralapped(gridWithClaims, { top, left, width, height, id }) {
  let isWholeClaim = true;
  for (let i = top; i < top + height; i++) {
    for (let j = left; j < left + width; j++) {
      if (gridWithClaims[i][j] !== id) {
        isWholeClaim = false;
        break;
      }
    }

    if (!isWholeClaim) {
      break;
    }
  }

  return isWholeClaim;
}

function findUntouchedClaim(gridWithClaims, claims) {
  let untouchedId;
  for (const claim of claims) {
    if (isOveralapped(gridWithClaims, claim)) {
      untouchedId = claim.id;
      break;
    }
  }

  return untouchedId;
}

const claims = fs
  .readFileSync("./d3.txt", "utf8")
  .split("\n")
  .map(parseClaim);

const widest = Math.max.apply(null, claims.map(c => c.left + c.width));
const tallest = Math.max.apply(null, claims.map(c => c.top + c.height));
const grid = createDrawnGrid(createBaseGrid(widest, tallest), claims);

const overlapSum = sumGridOverlaps(grid);
console.log({ overlapSum });

const untouchedId = findUntouchedClaim(grid, claims);
console.log({ untouchedId });
