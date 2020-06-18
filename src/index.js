/* eslint-disable no-restricted-syntax */
import 'regenerator-runtime/runtime.js';
import Solr, { TEXT_FIELD, USERNAME_FIELD } from './js/solr';
import './style/main.scss';

const solr = new Solr();
const suchen = async (line, filter) => {
  const results = await solr.search(line.trim(), 0, 10, filter);
  console.log(`Found ${results.numFound} results, showing top 5\n`);

  for (const result of results.docs.slice(0, 5)) {
    console.log(`${result[TEXT_FIELD]}: ${result[USERNAME_FIELD]}`);
  }
  return results;
};

const getFilter = (from, to) => {
  const fromFilter = 1478649600000 + from[0] * 3600000 + from[1] * 60000 + from[2] * 1000;
  const toFilter = 1478649600000 + to[0] * 3600000 + to[1] * 60000 + to[2] * 1000;
  console.log(fromFilter);
  console.log(toFilter);
  return `timestamp_ms:[${fromFilter} TO ${toFilter}]`;
};

function boldString(str, find) {
  const reg = new RegExp(`(${find})`, 'gi');
  return str.replace(reg, '<b>$1</b>');
}
// highlight als Ersatz für Snippets, da max die maximale Textlänge von alten Tweets stark beschränkt ist
const highlight = (text, search) => {
  let returnText = text;
  for (const word of search.split(' ')) {
    returnText = boldString(returnText, word);
  }
  console.log(returnText);
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
    console.log(filter);
    const results = await suchen(input.value, filter);

    const outDiv = document.getElementById('output');
    outDiv.innerHTML = '<ul>';
    removeOld(true)
    for (const result of results.docs.slice(0, 10)) {
      outDiv.innerHTML += `<li>${result[TEXT_FIELD]}: ${result[USERNAME_FIELD]}</li>`;
      createTweetCard(result[USERNAME_FIELD], result[TEXT_FIELD])
    }
  outDiv.innerHTML += '</ul>';
  outDiv.innerHTML = highlight(outDiv.innerHTML,input.value);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initSearch();
  }
});
function removeOld(noFilter){
  if (noFilter){
    const oldTweets = document.querySelectorAll('.tweetcard')
    console.log(oldTweets)
    oldTweets.forEach(tweet => {
      tweet.remove()
    });
  }
}
function createTweetCard(name, text){
  const tweet = document.createElement("div")
  tweet.classList.add("tweetcard")
  tweet.innerHTML = `
  <p class="upp">&#128579;</p>
  <span class="cardhead">
    <p class="uname marked">${name}</p> <p class="tweetdate light">9.11.2016</p>
  </span>
  <p class="tweet">${text}</p>
  `
  document.getElementById("main").appendChild(tweet)
}