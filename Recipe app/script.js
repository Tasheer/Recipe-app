



const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals")
const searchBtn = document.getElementById("search")
const searchText = document.getElementById("search-text")
const mealPopup = document.getElementById("meal-popup")
const closePopupBtn = document.getElementById("close-popup")
const mealInfoEl = document.getElementById("meal-info")











getRandomMeal();
fetchFavMeals();
async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')

    const respData = await resp.json()
    const randomMeal = respData.meals[0]
    addMeal(randomMeal, true);
}












async function getMealById(id) {
    const resp = await fetch('https://themealdb.com/api/json/v1/1/lookup.php?i=' + id)

    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;
}







async function getMealsBySearch(term) {
    const resp = await fetch('https://themealdb.com/api/json/v1/1/search.php?s='+ term)

    const respData = await resp.json();
    const meals = respData.meals;
    return meals
}











// to add random recipe in the featured recipe section

function addMeal(mealData, random = false) {
    console.log(mealData)
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML =

        ` <div class="meal-header">
        ${random ? `
        <span class="random">Featured Recipe
        </span>` : ''}
        <img src="${mealData.strMealThumb}" 
        alt="${mealData.strMeal}" /> 
    </div>
    <div class="meal-body">
        <h4> "${mealData.strMeal}"</h4>
        <button class="heart">
            <i class="fas fa-heart"></i>
        </button>
    </div>`

    // to make the favourite button funtional
    const btn = meal.querySelector(".meal-body .heart");
    btn.addEventListener("click", () => {
        if (btn.classList.contains('active')) {
            removeMealLS(mealData.idMeal)
            btn.classList.toggle("active");
            btn.classList.remove("active");
        }
        else {
            addMealLS(mealData.idMeal)
            btn.classList.add("active");
        }

        fetchFavMeals();
    });
    meal.addEventListener('click', () => {
        showMealInfo(mealData)
    })
    mealsEl.appendChild(meal);
}


// 02:24:03










function addMealLS(mealId) {
    const mealIds = getMealsLS();
    console.log(mealIds)
    localStorage.setItem(
        "mealIds",
        JSON.stringify([...mealIds, mealId])
    )
}


function removeMealLS(mealId) {
    const mealIds = getMealsLS();
    localStorage.setItem(
        "mealIds",
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    )
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));
    return mealIds === null ? [] : mealIds;
}


async function fetchFavMeals() {

    // clean the container
    favoriteContainer.innerHTML = "";


    const mealIds = getMealsLS();
    const meals = []
    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        addMealFav(meal)
    }
    console.log(meals)
}


function addMealFav(mealData) {
    const favMeal = document.createElement('li');
    favMeal.innerHTML = `
        <img src="${mealData.strMealThumb}" 
        alt= "${mealData.strMeal}"
        />
        <span>
        ${mealData.strMeal}
        </span>
        <button class="clear"> 
        <i class="fas fa-window-close">
        </i> 
        </button>
        `

    const btn = favMeal.querySelector(".clear");

    btn.addEventListener('click', () => {
        removeMealLS(mealData.idMeal);
        fetchFavMeals();
    });
favMeal.addEventListener('click', () => {
    showMealInfo(mealData)
})
    favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
    // clean it up
    mealInfoEl.innerHTML = '';
    // update meal info
    const mealEl = document.createElement("div")

    // get ingredients and measures
    const ingredients = []
    for(let i=1; i<=20; i++) {
        if(mealData['strIngredient'+i]) {
            ingredients.push(`${mealData 
                ['strIngredient'+i]}
                : ${mealData 
                    ['strMeasure'+i]}
                `)
        }
        else{
            break;
        }
    }
    mealEl.innerHTML = `
                <h1>${mealData.strMeal}</h1>
                <img src="${mealData.strMealThumb}" 
                    alt="${mealData.strMeal}" />
                    <h3>
                    Ingredients
                    </h3>
                    <ul>
                    ${ingredients.map((ing) =>`
                    <li>
                    ${ing}
                    </li>
                    `)
                    .join('')}
                    </ul>
                    <p>
                        ${mealData.strInstructions}
                    </p>
    `
    mealInfoEl.appendChild(mealEl)


    // show the popup
    mealPopup.classList.remove('hidden')
}


searchBtn.addEventListener('click', async () => {
    meals.innerHTML = '';
    const search = searchText.value;

    const mealsEl = await getMealsBySearch(search)

    if(meals){
    mealsEl.forEach((meal) => {
        addMeal(meal)
        })
    }
})


closePopupBtn.addEventListener('click', () => {
    mealPopup.classList.add('hidden');   
})


























