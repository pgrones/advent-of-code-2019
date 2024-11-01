import { input } from "./input.js";

const map = input.split("\n").map((x) => x.split(""));

const asteroids = [];

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (map[y][x] === ".") continue;

    asteroids.push({ x, y });
  }
}

const calculateLineOfSight = (source, target) => {
  const lineOfSight = [];

  const tx = target.x - source.x;
  const ty = target.y - source.y;
  let k = ty / tx;

  if (!isFinite(k)) {
    if (source.x === target.x) {
      const minY = Math.min(source.y, target.y) + 1;
      const maxY = Math.max(source.y, target.y);

      return new Array(maxY - minY)
        .fill({ x: source.x })
        .map((x, i) => ({ ...x, y: minY + i }));
    }

    const minX = Math.min(source.x, target.x) + 1;
    const maxX = Math.max(source.x, target.x);

    return new Array(maxX - minX)
      .fill({ y: source.y })
      .map((x, i) => ({ ...x, x: minX + i }));
  }

  for (let x = Math.min(0, tx); x < Math.max(0, tx); x++) {
    const y = k * x;

    if (
      (y === 0 && x === 0) ||
      (y === ty && x === tx) ||
      !Number.isInteger(+y.toPrecision(6))
    )
      continue;

    lineOfSight.push({ x: x + source.x, y: y + source.y });
  }

  return lineOfSight;
};

// --- PART 1 ---

let station;
let maxAsteroids = -Infinity;

for (const source of asteroids) {
  let count = 0;

  for (const target of asteroids.filter((x) => x !== source)) {
    const intCoords = calculateLineOfSight(source, target).filter((x) =>
      asteroids.some((y) => x.x === y.x && x.y === y.y)
    );

    if (intCoords.length === 0) {
      count++;
    }
  }

  if (maxAsteroids < count) {
    maxAsteroids = count;
    station = source;
  }
}

console.log(maxAsteroids);

// --- PART 2 ---

const allAsteroidsInLineOfSight = new Map();

for (const target of asteroids.filter((x) => x !== station)) {
  allAsteroidsInLineOfSight.set(
    target.x.toString() + "," + target.y.toString(),
    { ...target }
  );

  const asteroidsInLineOfSight = calculateLineOfSight(station, target).filter(
    (x) => asteroids.some((y) => x.x === y.x && x.y === y.y)
  );

  for (const asteroid of asteroidsInLineOfSight) {
    allAsteroidsInLineOfSight.set(
      asteroid.x.toString() + "," + asteroid.y.toString(),
      { ...asteroid }
    );
  }
}

const coordsToDegrees = (y, x) => {
  const rad = Math.atan2(y, x) + Math.PI / 2;
  return (((rad > 0 ? rad : 2 * Math.PI + rad) * 360) / (2 * Math.PI)) % 360;
};

const asteroidsInOrder = [...allAsteroidsInLineOfSight.values()]
  .map((x) => ({
    ...x,
    angle: +coordsToDegrees(x.y - station.y, x.x - station.x).toPrecision(5),
    distance: Math.sqrt((x.x - station.x) ** 2 + (x.y - station.y) ** 2),
  }))
  .toSorted((a, b) => {
    if (a.angle === b.angle) return a.distance - b.distance;
    return a.angle - b.angle;
  });

let i = 0;
let count = 0;
while (true) {
  const [asteroid] = asteroidsInOrder.splice(i, 1);

  const nextIndex = asteroidsInOrder
    .slice(i)
    .findIndex((x) => x.angle !== asteroid.angle);

  if (nextIndex === -1) i = 0;
  else i = nextIndex + i;

  count++;

  if (count === 200) {
    console.log(asteroid.x * 100 + asteroid.y);
    break;
  }
}
