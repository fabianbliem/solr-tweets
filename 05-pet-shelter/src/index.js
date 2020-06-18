import "regenerator-runtime/runtime.js";
import Solr, { TEXT_FIELD, USERNAME_FIELD } from "./js/solr";
import './style/main.scss';

const solr = new Solr();
const suchen = async (line) => {
  const results = await solr.search(line.trim());
  console.log(`Found ${results.numFound} results, showing top 5\n`);

   for (const result of results.docs.slice(0, 5)) {
        console.log(`${result[TEXT_FIELD]}: ${result[USERNAME_FIELD]}`);
   }
   return results;
}

function initSearch() {

  const dayButton= document.querySelector('.btn-day');
  dayButton.addEventListener('click', async ()=>{
    const input = document.getElementById('text');
    const results = await suchen(input.value);
    
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
