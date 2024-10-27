const input = "172851-675869";

const [min, max] = input.split("-").map((x) => parseInt(x));

// --- PART 1 ---

let pwCount = 0;

outer: for (let i = min; i <= max; i++) {
  const pw = i.toString();
  let hasDouble = false;

  for (let j = 0; j < pw.length - 1; j++) {
    if (pw[j] > pw[j + 1]) continue outer;

    if (pw[j] === pw[j + 1]) hasDouble = true;
  }

  if (hasDouble) pwCount++;
}

console.log(pwCount);

// --- PART 2 ---

pwCount = 0;

outer: for (let i = min; i <= max; i++) {
  const pw = i.toString();
  let hasDouble = false;

  for (let j = 0; j < pw.length - 1; j++) {
    if (pw[j] > pw[j + 1]) continue outer;

    if (
      pw[j] === pw[j + 1] &&
      (j === 0 || pw[j - 1] !== pw[j]) &&
      (j + 2 === pw.length || pw[j + 2] !== pw[j])
    )
      hasDouble = true;
  }

  if (hasDouble) pwCount++;
}

console.log(pwCount);
