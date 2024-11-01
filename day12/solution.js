import { input } from "./input.js";

const initialMoons = input.split("\n").map((line) =>
  [...line.matchAll(/-*\d+/g)]
    .map((x) => parseInt(x[0]))
    .reduce(
      (acc, curr, i) => ({
        ...acc,
        pos: { ...acc.pos, [i === 0 ? "x" : i === 1 ? "y" : "z"]: curr },
      }),
      { pos: {}, vel: { x: 0, y: 0, z: 0 } }
    )
);

// --- PART 1 ---

const moons = structuredClone(initialMoons);

const applyGravity = () => {
  for (let i = 0; i < moons.length - 1; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      for (const axis of ["x", "y", "z"]) {
        if (moons[i].pos[axis] === moons[j].pos[axis]) continue;

        const change = moons[i].pos[axis] > moons[j].pos[axis] ? -1 : 1;

        moons[i].vel[axis] += change;
        moons[j].vel[axis] += change * -1;
      }
    }
  }
};

const applyVelocity = () => {
  for (const moon of moons) {
    for (const axis of ["x", "y", "z"]) {
      moon.pos[axis] += moon.vel[axis];
    }
  }
};

for (let i = 0; i < 1000; i++) {
  applyGravity();
  applyVelocity();
}

console.log(
  moons.reduce(
    (acc, curr) =>
      acc +
      (Math.abs(curr.pos.x) + Math.abs(curr.pos.y) + Math.abs(curr.pos.z)) *
        (Math.abs(curr.vel.x) + Math.abs(curr.vel.y) + Math.abs(curr.vel.z)),
    0
  )
);
