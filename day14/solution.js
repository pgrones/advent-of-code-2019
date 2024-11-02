import { input } from "./input.js";
import * as util from "util";

const instructions = input.split("\n");

const reactions = [];
let root;

for (const instruction of instructions) {
  const recipe = [...instruction.matchAll(/\d+\s\w+/g)].map((x) =>
    x[0].split(" ")
  );

  const [amount, name] = recipe.pop();

  let element = reactions.find((x) => x.name === name);
  if (!element) {
    element = { name, amount: parseInt(amount), requires: [] };
    reactions.push(element);
  } else {
    element.amount = parseInt(amount);
  }

  if (name === "FUEL") root = element;

  for (const [amount, name] of recipe) {
    const oreName = name === "ORE" ? name + element.name : name;
    let requiredElement = reactions.find((x) => x.name === oreName);

    if (!requiredElement) {
      requiredElement = {
        name: oreName,
        amount: parseInt(amount),
        requires: [],
      };
      reactions.push(requiredElement);
    }

    element.requires.push({
      amount: parseInt(amount),
      element: requiredElement,
    });
  }
}

console.log(reactions);

// --- PART 1 ---

const traverse = (node, needs = 1) => {
  if (!node.requires.length) {
    return [{ name: node.name, amount: node.amount, needs }];
  }

  let result = [];
  for (const requiredElement of node.requires) {
    let needsFurther = Math.ceil(
      (requiredElement.amount * needs) / node.amount
    );

    // if (needsFurther % requiredElement.amount !== 0)
    //   needsFurther +=
    //     requiredElement.amount - (needsFurther % requiredElement.amount);

    console.log(node.name, "=>", requiredElement.element.name, needsFurther);

    result.push(...traverse(requiredElement.element, needsFurther));
  }

  return result;
};

const totals = traverse(root);

const totalsByOre = Object.groupBy(totals, (x) => x.name);

console.log(totalsByOre);

let total = 0;
for (const value of Object.values(totalsByOre)) {
  const ore = value[0].amount;
  const subTotal = value.reduce((acc, curr) => acc + curr.needs, 0);
  let oreTotal = Math.ceil(subTotal / ore) * ore;
  if (oreTotal % ore !== 0) oreTotal += ore - (oreTotal % ore);
  total += oreTotal;
}

console.log(total);
