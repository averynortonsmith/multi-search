import { mount, refresh, v } from "https://cdn.jsdelivr.net/gh/villeray/framework@master/src/villeray.js";

const terms = {};
const oldColors = [];
let hue = 0;

function newColor() {
  if (oldColors.length > 0) {
    return oldColors.pop();
  }

  const color = `hsl(${hue}, 100%, 70%)`;
  hue += 41;

  return color;
}

const newTerm = document.querySelector("#new-term");
const input = document.querySelector("#input");

newTerm.onchange = (e) => {
  const term = e.target.value.toLowerCase();
  if (term === "") {
    return;
  }

  if (term in terms) {
    return;
  }

  terms[term] = newColor();
  newTerm.value = "";
  refresh();
};

function removeTerm(term, color) {
  delete terms[term];
  oldColors.push(color);
  refresh();
}

input.oninput = (e) => {
  refresh();
};

function colorStyle(color) {
  return { style: { backgroundColor: color } };
}

function showTerm(term, color) {
  return v(
    "div",
    { class: "term" },
    v("span", colorStyle(color), term),
    v(
      "button",
      {
        onclick: () => removeTerm(term, color),
      },
      "x"
    )
  );
}

function showTerms() {
  return Object.entries(terms).map(([term, color]) => showTerm(term, color));
}

function* showResults() {
  const text = input.value;
  const lowered = text.toLowerCase();
  let index = 0;

  while (index < lowered.length) {
    let matched = false;

    for (const [term, color] of Object.entries(terms)) {
      if (lowered.startsWith(term, index)) {
        const nextIndex = index + term.length;
        const match = text.slice(index, nextIndex);
        yield v("span", colorStyle(color), match);
        index = nextIndex;
        matched = true;
        break;
      }
    }

    if (!matched) {
      yield text[index];
      index++;
    }
  }
}

mount(document.querySelector("#terms"), showTerms);
mount(document.querySelector("#results"), showResults);
