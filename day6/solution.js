import { input } from "./input.js";

const maps = input.split("\n").map((x) => x.split(")"));
const orbits = [];

for (const [parentName, childName] of maps) {
  let parent = orbits.find((x) => x.name === parentName);
  let child = orbits.find((x) => x.name === childName);

  if (!parent) {
    parent = { name: parentName, children: [] };
    orbits.push(parent);
  }

  if (!child) {
    child = { name: childName, children: [] };
    orbits.push(child);
  }

  parent.children.push(child);
  child.parent = parent;
}

// --- PART 1 ---

let orbitCount = 0;

for (const orbit of orbits) {
  let currOrbit = orbit;

  while (currOrbit.parent) {
    orbitCount++;
    currOrbit = currOrbit.parent;
  }
}

console.log(orbitCount);

// --- PART 2 ---

const start = orbits.find((x) => x.name === "YOU").parent;
let minLength = Infinity;

const traverse = (orbit, lastOrbit = {}, pathLength = 0) => {
  if (orbit.children.some((x) => x.name === "SAN")) {
    minLength = Math.min(pathLength, minLength);
  }

  const nextOrbits = [orbit.parent, ...orbit.children].filter(
    (x) => x && x.name !== lastOrbit.name
  );

  for (const nextOrbit of nextOrbits) {
    traverse(nextOrbit, orbit, pathLength + 1);
  }
};

traverse(start);

console.log(minLength);
