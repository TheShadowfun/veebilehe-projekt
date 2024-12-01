async function getSpoonacularRecipes({
    query = "",
    enableIntolerance = false,
    intolerances = ["Dairy", "Egg", "Gluten"],
    includeIngredients = ["tomatoes", "potatos"],
    addRecipeInformation = true,
    addRecipeInstructions = true,
    fillIngredients = true,
    maxReadyTime = 60,
    minServings = 2,
    maxServings = 8,
    maxCalories = 800,
    minCalories = 50,
    number = 1,
    sort = "popularity",
    typeOptions = ["main course", "dessert", "snack"],
    enableDiet = false,
    dietOptions = ["vegetarian", "vegan"]
} = {}) {
    const API_KEY = "183842a845664e8aafef17967e2d4a85";
    const flatten = arr => arr.join(',');
    const url = new URL('https://api.spoonacular.com/recipes/complexSearch');
    
    const params = {
        apiKey: API_KEY,
        query: query,
        includeIngredients: flatten(includeIngredients),
        addRecipeInformation: addRecipeInformation,
        addRecipeInstructions: addRecipeInstructions,
        fillIngredients: fillIngredients,
        typeOptions: typeOptions[1],
        maxReadyTime: maxReadyTime,
        minServings: minServings,
        maxServings: maxServings,
        maxCalories: maxCalories,
        minCalories: minCalories,
        number: number,
        sort: sort
    };

    if (enableIntolerance) {
        params.intolerances = intolerances[0];
    }
    if (enableDiet) {
        params.diet = dietOptions[0];
    }

    Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key])
    );

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
}

function updateUIWithRecipeData(data) {
    if (!data.results || !data.results[0]) {
        console.error('No recipe data available');
        return;
    }

    const recipe = data.results[0];
    
    // Get both ul elements
    const [firstList, secondList] = document.querySelectorAll('.main-content-list ul');
    if (!firstList || !secondList) {
        console.error('Lists not found');
        return;
    }

    // Clear existing items
    firstList.innerHTML = '';
    secondList.innerHTML = '';

    const ingredients = recipe.extendedIngredients;
    const midpoint = Math.ceil(ingredients.length / 2);

    // Populate both lists
    ingredients.slice(0, midpoint).forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.measures.metric.amount} ${ingredient.measures.metric.unitLong} of ${ingredient.originalName}`;
        firstList.appendChild(li);
    });

    ingredients.slice(midpoint).forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.measures.metric.amount} ${ingredient.measures.metric.unitLong} of ${ingredient.originalName}`;
        secondList.appendChild(li);
    });

    // Update title, time, image, and cooking steps
    const titleElement = document.querySelector('.main-content-heading');
    if (titleElement) titleElement.textContent = recipe.title;

    const timeElement = document.querySelector('.main-content-time');
    if (timeElement) timeElement.textContent = `Cooking time: ${recipe.readyInMinutes} minutes`;

    const thumbnailElement = document.querySelector('.main-content-thumbnail');
    if (thumbnailElement) thumbnailElement.src = recipe.image;

    const processList = document.querySelector('.main-content-process');
    if (processList && recipe.analyzedInstructions[0]) {
        processList.innerHTML = '';
        recipe.analyzedInstructions[0].steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step.step;
            processList.appendChild(li);
        });
    }
}

function generateRecipe() {
    getSpoonacularRecipes({
        query: "pasta",
        enableIntolerance: true,
        includeIngredients: ["tomatoes", "garlic"]
    })
        .then(data => {
            console.log(data);
            updateUIWithRecipeData(data);
        })
        .catch(error => console.error(error));
}