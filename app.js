import { mount, refresh, v } from "https://cdn.jsdelivr.net/gh/villeray/framework@master/src/villeray.js";

let terms = [];
let hue = 0;

const newTerm = document.querySelector("#new-term");
const input = document.querySelector("#input");

newTerm.onchange = (e) => {
  const term = e.target.value.toLowerCase();
  if (term === "") {
    return;
  }

  const color = `hsl(${hue}, 100%, 70%)`;
  hue += 41;

  terms.push({ term, color });
  newTerm.value = "";
  refresh();
};

input.oninput = (e) => {
  refresh();
};

function colorStyle(color) {
  return { style: { backgroundColor: color } };
}

function showTerm({ term, color }) {
  return v("div", {}, v("span", colorStyle(color), term));
}

function showTerms() {
  return terms.map(showTerm);
}

function* showResults() {
  const text = input.value;
  const lowered = text.toLowerCase();
  let index = 0;

  while (index < lowered.length) {
    let matched = false;

    for (const { term, color } of terms) {
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
