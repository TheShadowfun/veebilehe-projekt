async function getSpoonacularRecipes({
    query = "", // general keyword for recipe search
    enableIntolerance = false,
    intolerances = ["Dairy", "Egg", "Gluten"],
    includeIngredients = ["tomatoes", "potatos"],
    addRecipeInformation = true,
    addRecipeInstructions = true,
    maxReadyTime = 60,
    minServings = 2,
    maxServings = 8,
    maxCalories = 800,
    minCalories = 50,
    number = 1, // number of recipes per request
    sort = "popularity",
    typeOptions = ["main course", "dessert", "snack"],
    enableDiet = false,
    dietOptions = ["vegetarian", "vegan"]
} = {}) {
    const API_KEY = "05180aa61f224db1856a2fd65a90313a";
    
    // Helper function to flatten array to comma-separated string
    const flatten = arr => arr.join(',');

    const url = new URL('https://api.spoonacular.com/recipes/complexSearch');
    
    // Add query parameters
    const params = {
        apiKey: API_KEY,
        query: query,
        includeIngredients: flatten(includeIngredients),
        addRecipeInformation: addRecipeInformation,
        addRecipeInstructions: addRecipeInstructions,
        maxReadyTime: maxReadyTime,
        minServings: minServings,
        maxServings: maxServings,
        maxCalories: maxCalories,
        minCalories: minCalories,
        number: number,
        sort: sort
    };

    // Add conditional parameters
    if (enableIntolerance) {
        params.intolerances = intolerances[0];
    }
    if (enableDiet) {
        params.diet = dietOptions[0];
    }

    // Add all params to URL
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

// Example usage:
getSpoonacularRecipes({
    query: "pasta",
    enableIntolerance: true,
    includeIngredients: ["tomatoes", "garlic"]
})
    .then(data => console.log(data))
    .catch(error => console.error(error));