
The functions that you will implement in this assignment are all related to the operation of a pet store.

In `index.js`, implement these functions as follows:

Implement the functions `calculateFoodOrder()` and `mostPopularDays()` as stated in the documentation above the function.

Then implement the following functionality:

1. Go through all `<li class="animal">` elements and create a `new Animal()` according to it's data-type and data-breed property on the `<img>`. Set the counter element `span class="counter">` for each animal to 1. Use the Animal class imported at the top. Add each Animal to the petShelter with it's `addAnimal()` method;

2. Add Event Listeners on the images, whenever an image is clicked, it's counter should increase and a new pet is created and added to the `petShelter`.

3. Add Event Listener on the calculate food order button, which calls  the `calculateFoodOrder()` for all the animals in your shelter. Then add the return to the `.food-order` element below the button.

3. Add Event Listener on the most popular day button. It should call the ?`mostPopularDays()` function. Then add the return to the `.popular-day` element below with the value of visitors and the name of the day.