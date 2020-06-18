import "regenerator-runtime/runtime.js";
import Solr, { TEXT_FIELD, USERNAME_FIELD } from "./js/solr";
import './style/main.scss';

const solr = new Solr();
const suchen = async (line, filter) => {
  const results = await solr.search(line.trim(),0,10,filter);
  console.log(`Found ${results.numFound} results, showing top 5\n`);

   for (const result of results.docs.slice(0, 5)) {
        console.log(`${result[TEXT_FIELD]}: ${result[USERNAME_FIELD]}`);
   }
   return results;
}

const getFilter = (from,to) =>{
  const fromFilter= 1478649600000 + from[0]*3600000 + from[1]*60000 + from[2]*1000;
  const toFilter= 1478649600000 + to[0]*3600000 + to[1]*60000 + to[2]*1000;
  console.log(fromFilter);
  console.log(toFilter);
  return "timestamp_ms:["+fromFilter+" TO "+toFilter+"]";
}

function initSearch() {

  const dayButton= document.querySelector('.btn-day');
  dayButton.addEventListener('click', async ()=>{
    const input = document.getElementById('text');
    let filterInputFrom = document.getElementById('from_date').value;
    let filterInputTo = document.getElementById('to_date').value;
    filterInputTo = filterInputTo.split(':');
    filterInputFrom = filterInputFrom.split(':');
    const filter = getFilter(filterInputFrom, filterInputTo);
    console.log(filter)
    const results = await suchen(input.value,filter);
    
    let outDiv = document.getElementById('output');
    outDiv.innerHTML = '<ul>';

    for (const result of results.docs.slice(0, 10)) {
      outDiv.innerHTML += `<li>${result[TEXT_FIELD]}: ${result[USERNAME_FIELD]}</li>`;
 }
 outDiv.innerHTML += '</ul>';
  });
}

document.addEventListener("DOMContentLoaded", () =>  {
  if(document.readyState === "interactive" || document.readyState === "complete") {
    initSearch();
  }
});
