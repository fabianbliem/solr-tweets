import "regenerator-runtime/runtime.js";
import Solr, { TEXT_FIELD, USERNAME_FIELD } from "./js/solr";
import './style/main.scss';

const solr = new Solr();

const suchen = async (line, filter) => {
  const results = await solr.search(line.trim(),0,10,filter);
  return results;
}

const vorschlagen = async (line) => {
  const results = await solr.recom(line.trim());
  return results.suggestions[1].suggestion;
}

const getFilter = (from,to) =>{
  const fromFilter= 1478649600000 + from[0]*3600000 + from[1]*60000 + from[2]*1000;
  const toFilter= 1478649600000 + to[0]*3600000 + to[1]*60000 + to[2]*1000;
  return "timestamp_ms:["+fromFilter+" TO "+toFilter+"]";
}

function boldString(str, find) {
  var reg = new RegExp('('+find+')', 'gi');
  return str.replace(reg, '<b>$1</b>');
}

// highlight als Ersatz für Snippets, da max die maximale Textlänge von alten Tweets stark beschränkt ist
const highlight = (text, search) =>{
  let returnText= text
  for(const word of search.split(" ")){
    returnText= boldString(returnText,word);
  }
  return returnText;
}

function initSearch() {

  const dayButton= document.querySelector('.btn-day');

  dayButton.addEventListener('click', async () => {

    const input = document.getElementById('text');
    let filterInputFrom = document.getElementById('from_date').value;
    let filterInputTo = document.getElementById('to_date').value;
    filterInputTo = filterInputTo.split(':');
    filterInputFrom = filterInputFrom.split(':');

    const filter = getFilter(filterInputFrom, filterInputTo);

    let results;
    let suchwort = input.value;
    results = await suchen(suchwort,filter);

    let outDiv = document.getElementById('output');

    outDiv.innerHTML = ""

    output(outDiv, suchwort, results);

    if(results.numFound <= 3){
      const recomResults = await vorschlagen(suchwort);
      outDiv.innerHTML += `<h3>Meintest du: ${recomResults[0].word} </h3>`;
      results = await suchen(recomResults[0].word,filter);
      suchwort = recomResults[0].word;
    }

    output(outDiv, suchwort, results);
  });
}

document.addEventListener("DOMContentLoaded", () =>  {
  if(document.readyState === "interactive" || document.readyState === "complete") {
    initSearch();
  }
});

function output(outDiv, suchwort, results){
  outDiv.innerHTML += '<ul>';
  for (const result of results.docs.slice(0, 10)) {
    outDiv.innerHTML += `<li>${result[TEXT_FIELD]}: ${result[USERNAME_FIELD]}</li>`;
  }
  outDiv.innerHTML += '</ul>';

  outDiv.innerHTML = highlight(outDiv.innerHTML,suchwort);
}