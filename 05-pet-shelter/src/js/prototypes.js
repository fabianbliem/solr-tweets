/**
* A prototype to create Weekday objects
*/
export class Weekday {
  constructor(name, traffic) {
   this.name = name;
   this.traffic = traffic;
  }
}


/**
* A prototype to create Animal objects
*/
export class Animal {
  constructor(name, type, breed)  {
   this.name = name;
   this.type = type;
   this.breed = breed;
   this.foodPerWeekInKg = type === 'cat' ? 1.6 : 3.8;
  }
}


/**
* A prototype to create Animal objects
*/
export class PetShelter {
  constructor()  {
   this.animals = [];
  }

  addAnimal(animal) {
    this.animals.push(animal);
  }
}





