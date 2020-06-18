import "regenerator-runtime/runtime.js";
import { Weekday, Animal, PetShelter } from './js/prototypes';
import Solr, { TEXT_FIELD, USERNAME_FIELD } from "./js/solr";
import './style/main.scss'



/**
 * This function should calculate the total amount of pet food that should be
 * ordered for the upcoming week.
 * @param numAnimals the number of animals in the store
 * @param avgFood the average amount of food (in kilograms) eaten by the animals
 * 				each week. Each Animal has a foodPerWeekInKg property
 * @return the total amount of pet food that should be ordered for the upcoming
 * 				 week, or -1 if the numAnimals or avgFood are less than 0 or non-numeric
 */
const solr = new Solr();
const suchen = async (line) => {
  const results = await solr.search(line.trim());
  console.log(`Found ${results.numFound} results, showing top 5\n`);

   for (const result of results.docs.slice(0, 5)) {
        console.log(`${result[TEXT_FIELD]}: ${result[USERNAME_FIELD]}`);
   }
   return results;
}

function calculateFoodOrder(numAnimals, avgFood) {
  if(numAnimals<=0 || avgFood<=0 || isNaN(numAnimals) || isNaN(avgFood)){
    return -1;
  }
  else{
    return avgFood*numAnimals;
  }
}

/**
* Determines which day of the week had the most number of people visiting the
* pet store. If more than one day of the week has the same, highest amount of
* traffic, an array containing the days (in any order) should be returned.
* (ex. ["Wednesday", "Thursday"]). If the input is null or an empty array, the function
* should return null.
* @param week an array of Weekday objects
* @return a string containing the name of the most popular day of the week if there is only one most popular day, and an array of the strings containing the names of the most popular days if there are more than one that are most popular
*/
function mostPopularDays(week) {
  let multipleDays = 0;
  let check=false;
  if(week==null || week==[]) return null;
  week.sort((a,b) => (a.traffic<b.traffic) ? 1 :(b.traffic<a.traffic) ? -1 : 0 );
  for(let i=1;i<week.length;i++){
    if(week[i-1].traffic==week[i].traffic) multipleDays++;
    else i=week.length;
  }

  if(multipleDays==0){
    return week[0].name
  }
  else{
    multipleDays++;
    let newArray = [];
    for(let i=0;i<multipleDays;i++){
      newArray[i]=week[i].name;
    }
    return newArray;
  }
  
  

}


/**
* The main function that sets up the PetStore. First the visitors for each weekday are set. 
*/
function initPetShelter() {
  let monday = new Weekday('monday', 42);
  let tuesday = new Weekday('tuesday', 25);
  let wednesday = new Weekday('wednesday', 42);
  let thursday = new Weekday('thursday', 5);
  let friday = new Weekday('friday', 17);
  let saturday = new Weekday('saturday', 15);
  let sunday = new Weekday('sunday', 40);

  let week = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
  let petShelter = new PetShelter();
  const demoCat=new Animal("demo","cat","cat");
  const demoDog=new Animal("demo","dog","dog");
  console.log("My Shelter: ", petShelter);

  // TODO: Go through all <li> elements and create a new Animal() according to it's data-type and data-breed property. Set the counter for each animal to 1. Use the Animal class imported at the top. Add each Animal to the petShelter with it's addAnimal() method;
  
  const animals = document.querySelectorAll('li');
  animals.forEach(animal => {
      let animalImg=animal.querySelector('img');
      let nAnimal = new Animal(animalImg.alt,animalImg.getAttribute("data-type"),animalImg.getAttribute("data-breed"));
      petShelter.addAnimal(nAnimal);
      
      animal.querySelector('.counter').innerHTML=1;
    });
    console.log(petShelter);
  // TODO: Add Event Listeners on the images, whenever an image is clicked, it's counter should increase, e.g. a new pet is created and added to the pet shelter.
  
  const images= document.querySelectorAll('img');
  images.forEach(image => {
    image.addEventListener('click', function(){
      petShelter.addAnimal(new Animal(image.alt, image.getAttribute("data-type"),image.getAttribute("data-breed")));
      image.nextElementSibling.innerHTML=parseInt(image.nextElementSibling.innerHTML)+1;
    })
  })
  // TODO: Add Event Listener on the calculate food order button, which calls  the calculateFoodOrder() for all the animals in your shelter. Then add the return to the food-order
  
  const orderButton= document.querySelector('.btn-calculate');
  orderButton.addEventListener('click', () => document.querySelector(".food-order").innerHTML= "Food to order this week: " 
  + parseFloat(calculateFoodOrder(petShelter.animals.filter(animal => animal.type=='cat').length,demoCat.foodPerWeekInKg) 
  + calculateFoodOrder(petShelter.animals.filter(animal => animal.type=='dog').length,demoDog.foodPerWeekInKg)).toFixed(2));

  // TODO: Add Event Listener on the most popular day Button. It should call the mostPopularDays() function. Then add the return to the .popular-day element
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
    initPetShelter();
  }
});
