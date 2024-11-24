// Random Recipe Functionality using Spoonacular API
const apiKey = '05180aa61f224db1856a2fd65a90313a'; // Asenda oma tegeliku API võtmega

document.getElementById('randomRecipeBtn').addEventListener('click', fetchRandomRecipe);

function fetchRandomRecipe() {
  const apiURL = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=dessert&addRecipeInformation=true`;

  // Logi API URL konsooli
  console.log('Random Recipe API URL:', apiURL);

  // Kuvame laadimise sõnumi
  const recipeContainer = document.getElementById('recipeContainer');
  /*recipeContainer.innerHTML = '<p>Laadimine...</p>';*/

  // Teeme API päringu
  fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          const errorMessage = errorData.message ? errorData.message : 'Viga API päringus.';
          throw new Error(`Viga: ${errorMessage}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Random Recipe API Vastus:', data);
      if (!data.recipes || data.recipes.length === 0) {
        recipeContainer.innerHTML = '<p>Retsepti ei leitud.</p>';
        return;
      }
      const recipe = data.recipes[0];
      displayRecipe(recipe);
    })
    .catch(error => {
      console.error('API päringu viga:', error);
      recipeContainer.innerHTML = `<p>Tekkis viga API päringus: ${error.message}</p>`;
    });
}

function displayRecipe(recipe) {
  const mainThumbnail = document.querySelector('.main-content-thumbnail');
    if (mainThumbnail) {
        mainThumbnail.src = recipe.image;
        mainThumbnail.alt = `Pilt ${recipe.title}`; 
    }
  const recipeContainer = document.getElementById('recipeContainer');
  const dessertTitle = document.getElementById('dessertTitle');
  if (dessertTitle) {
    dessertTitle.innerText = recipe.title;
  }
  // Extract ingredients and measures
  let ingredients = [];
  recipe.extendedIngredients.forEach(ingredient => {
    if (ingredient.original && ingredient.original.trim() !== '') {
      ingredients.push(ingredient.original);
    }
  });

  // Create HTML content for recipe details
  const htmlContent = `
    <h1>${recipe.title} class= "main-content-heading" </h1>
    <img src="${recipe.image}" alt="Pilt ${recipe.title}" class="main-content-thumbnail">
    <h3>Koostisosad:</h3>
    <ul>
      ${ingredients.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <h3>Juhised:</h3>
    <p>${recipe.instructions ? recipe.instructions : 'Juhised puuduvad.'}</p>
  `;

  // Populate the recipe container with the recipe details
  /*recipeContainer.innerHTML = htmlContent;*/

  // Lisame koostisosad olemasolevasse loendisse
  const koostisosadList = document.getElementById('koostisosadList');
  
  // Kustuta olemasolevad koostisosad
  koostisosadList.innerHTML = '';

  // Lisa uued koostisosad loendisse
  ingredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient;
    koostisosadList.appendChild(li);
  });
}

// Search Recipe Functionality using Spoonacular API
document.getElementById('fetchApiContentBtn').addEventListener('click', fetchApiContent);

function fetchApiContent() {
  const apiKey = '05180aa61f224db1856a2fd65a90313a'; // Asenda oma tegeliku API võtmega
  const searchInput = document.getElementById('searchQuery');
  const query = searchInput.value.trim();

  if (query === '') {
    alert('Palun sisesta magustoidu nimi.');
    return;
  }

  // Kasuta 'dishType=dessert', et filtreerida ainult magustoidud
  const apiURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${encodeURIComponent(query)}&dishType=dessert&addRecipeInformation=true`;

  // Logi API URL konsooli
  console.log('Search Recipe API URL:', apiURL);

  // Kuvame laadimise sõnumi
  const apiContentContainer = document.getElementById('apiContentContainer');
  const loadingIndicator = document.getElementById('loading');
  loadingIndicator.style.display = 'block';
  apiContentContainer.innerHTML = '';

  // Teeme API päringu
  fetch(apiURL)
    .then(response => {
      loadingIndicator.style.display = 'none';
      if (!response.ok) {
        return response.json().then(errorData => {
          const errorMessage = errorData.message ? errorData.message : 'Viga API päringus.';
          throw new Error(`Viga: ${errorMessage}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Search Recipe API Vastus:', data);
      // Näita API vastust kasutajasõbralikul kujul
      const recipes = data.results; // Spoonacular API vastuse struktuur
      if (!recipes || recipes.length === 0) {
        apiContentContainer.innerHTML = '<p>Magustoidu retsepte ei leitud.</p>';
        return;
      }

      let recipesHTML = '<h2>Leitud Magustoidud:</h2><ul>';
      recipes.forEach(recipe => {
        recipesHTML += `
          <li>
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="Pilt ${recipe.title}" class="thumbnail">
          </li>
        `;
      });
      recipesHTML += '</ul>';

      apiContentContainer.innerHTML = recipesHTML;
    })
    .catch(error => {
      loadingIndicator.style.display = 'none';
      console.error('API päringu viga:', error);
      apiContentContainer.innerHTML = `<p>Tekkis viga API päringus: ${error.message}</p>`;
    });
}