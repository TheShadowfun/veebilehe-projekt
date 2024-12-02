async function getSpoonacularRecipes({
    query = "",
    enableIntolerance = false,
    intolerances = "", //["Dairy", "Egg", "Gluten"]
    includeIngredients = "", //["tomatoes", "potatos"]
    addRecipeInformation = true,
    addRecipeInstructions = true,
    fillIngredients = true,
    maxReadyTime = 90,
    minServings = 1,
    maxServings = 10,
    number = 1,
    sort = "popularity",
    type = "main course",//["main course", "dessert", "snack"]
    enableDiet = false,
    dietOptions = []//["vegetarian", "vegan"]
}) {
    //avalikustame oma API võtme teadlikult, kuna sellega on seotud vaid free tier konto, millel on limiidid peal
    const API_KEY = "183842a845664e8aafef17967e2d4a85"; //other key 05180aa61f224db1856a2fd65a90313a;
    const url = new URL('https://api.spoonacular.com/recipes/complexSearch');
    
    const params = {
        apiKey: API_KEY,
        query: query,
        includeIngredients: includeIngredients,
        addRecipeInformation: addRecipeInformation,
        addRecipeInstructions: addRecipeInstructions,
        fillIngredients: fillIngredients,
        type: type,
        maxReadyTime: maxReadyTime,
        minServings: minServings,
        maxServings: maxServings,
        number: number,
        sort: sort
    };

    if (enableIntolerance) {
        params.intolerances = intolerances;
    }
    if (enableDiet) {
        params.diet = dietOptions;
    }

    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });

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
        const titleElement = document.querySelector('.main-content-heading')
        titleElement.style.color = 'red';
        titleElement.textContent = "Vastavat retsepti ei leitud"
        console.error('API did not return recipe data');
        return;
    }

    const recipe = data.results[0];

    const [firstList, secondList] = document.querySelectorAll('.main-content-list ul'); //gets both lists
    firstList.innerHTML = '';
    secondList.innerHTML = '';

    const ingredients = recipe.extendedIngredients;
    const midpoint = Math.ceil(ingredients.length / 2);

    const updateIngredientList = (slice, list) => {
        slice.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.measures.metric.amount} ${ingredient.measures.metric.unitLong} of ${ingredient.originalName}`;
        list.appendChild(li);
        });
    };  
    updateIngredientList(ingredients.slice(0, midpoint), firstList); //left side
    updateIngredientList(ingredients.slice(midpoint), secondList); //right side

    const titleElement = document.querySelector('.main-content-heading');
    if (titleElement) titleElement.textContent = recipe.title; titleElement.style.color = 'black';

    const timeElement = document.querySelector('.main-content-time');
    if (timeElement) timeElement.textContent = `Cooking time: ${recipe.readyInMinutes} minutes`;

    const thumbnailElement = document.querySelector('.main-content-thumbnail');
    if (thumbnailElement) thumbnailElement.src = recipe.image;

    document.querySelectorAll('.main-content-pic').forEach(img => {
        img.src = recipe.image;
    });

    const processList = document.querySelector('.main-content-process');
    console.log(processList)
    if (processList && recipe.analyzedInstructions[0]) {
        processList.innerHTML = '';
        recipe.analyzedInstructions[0].steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step.step;
            processList.appendChild(li);
        });
    }
}

customFields = {}

function handleFoodTextInput(event){
    customFields[event.target.id] = (event.target.value);
    console.log(customFields)
}

function handleFoodIntoleranceInput(event){
    if (event.target.value !== ''){
    customFields.enableIntolerances = true;
    }
    else {
        customFields.enableIntolerances = false;
    }
    customFields.intolerances = (event.target.value);
    console.log(customFields)
}

function handleFoodDietInput(event){
    if (event.target.value !== ''){
        customFields.enableIntolerances = true;
        }
        else {
            customFields.enableIntolerances = false;
        }
    customFields.dietOptions = (event.target.value);
    console.log(customFields)
}

function generateRecipe(source) {
    customFields.type = source
    console.log(customFields)
    getSpoonacularRecipes(customFields)
        .then(data => {
            console.log(data);
            updateUIWithRecipeData(data);
        })
        .catch(error => console.error(error));
}