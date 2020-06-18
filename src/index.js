/* eslint-disable no-restricted-syntax */
import 'regenerator-runtime/runtime.js';
import Solr, { TEXT_FIELD, USERNAME_FIELD, TIME_FIELD } from './js/solr';
import './style/main.scss';

const solr = new Solr();

const suchen = async (line, filter, checkbox) => {
  const results = await solr.search(line.trim(), 0, 100, filter, checkbox);
  return results;
};

const vorschlagen = async (line) => {
  const results = await solr.recom(line.trim());
  return results.suggestions[1].suggestion;
};

const getFilter = (from, to) => {
  const fromFilter = 1478649600000 + from[0] * 3600000 + from[1] * 60000 + from[2] * 1000;
  const toFilter = 1478649600000 + to[0] * 3600000 + to[1] * 60000 + to[2] * 1000;
  return `timestamp_ms:[${fromFilter} TO ${toFilter}]`;
};

function boldString(str, find) {
  const reg = new RegExp(`(${find})`, 'gi');
  return str.replace(reg, '<b>$1</b>');
}

// highlight als Ersatz für Snippets, da max die maximale Textlänge von alten Tweets stark beschränkt ist
// solr bietet zwar auch eine Operation (hl), die ist aber bei so großen Datenmengen sehr teuer
const highlight = (text, search) => {
  let returnText = text;
  for (const word of search.split(' ')) {
    returnText = boldString(returnText, word);
  }
  return returnText;
};

function initSearch() {
  const dayButton = document.querySelector('.btn-day');


  dayButton.addEventListener('click', async () => {
    const input = document.getElementById('text');
    let filterInputFrom = document.getElementById('from_date').value;
    let filterInputTo = document.getElementById('to_date').value;
    filterInputTo = filterInputTo.split(':');
    filterInputFrom = filterInputFrom.split(':');

    const filter = getFilter(filterInputFrom, filterInputTo);

    const checkbox = document.getElementById('sortby');
    let results;
    let suchwort = input.value;
    results = await suchen(suchwort, filter, checkbox.checked);

    document.getElementById('resultsheading').innerHTML = `Results:\t${results.numFound}`;

    const outDiv = document.getElementById('output');

    outDiv.innerHTML = '';

    output(outDiv, suchwort, results);

    if (results.numFound <= 3) {
      const recomResults = await vorschlagen(suchwort);
      outDiv.innerHTML += `<h3>Meintest du: ${recomResults[0].word} </h3>`;
      results = await suchen(recomResults[0].word, filter, checkbox.checked);
      suchwort = recomResults[0].word;
    }

    output(outDiv, suchwort, results);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initSearch();
  }
});

function output(outDiv, suchwort, results) {
  for (const result of results.docs.slice(0, 10)) {
    outDiv.innerHTML
    += `<div class="card tweet">
    <p class="upp">&#128579;</p>
    <span class="cardhead">
      <p class="uname marked">${result[USERNAME_FIELD]}</p> <p class="tweetdate light">${result[TIME_FIELD][0].substring(0, 19)}</p>
    </span>
    <p class="tweet">${result[TEXT_FIELD]}</p>
    </div>`;
  }
  outDiv.innerHTML = highlight(outDiv.innerHTML, suchwort);
}
