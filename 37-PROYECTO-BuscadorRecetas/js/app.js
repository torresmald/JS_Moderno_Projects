const selectCategory = document.querySelector('#categorias')
const results = document.querySelector('#resultado')
const favoritos = document.querySelector('.favoritos')

let recipesFav = []


const getCategories = () => {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'
    fetch(url)
        .then(response => response.json())
        .then(response => mostrarCategories(response.categories))
}

const mostrarCategories = categories => {
    categories.forEach(categorie => {
        const option = document.createElement('option')
        option.value = categorie.strCategory
        option.textContent = categorie.strCategory
        selectCategory?.appendChild(option)
    });
}

const showRecipes = event => {
    const filter = event.target.value
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${filter}`
    fetch(url)
        .then(response => response.json())
        .then(response => paintRecipes(response.meals))

}

const paintRecipes = recipes => {
    console.log(recipesFav);
        

    limpiarHtml(results)
    recipes.forEach(recipe => {
        const { strMealThumb, strMeal } = recipe
        const divContainer = document.createElement('div')
        divContainer.style.maxWidth = "30%"
        divContainer.style.margin = "10px"
        const divDescription = document.createElement('div')
        divDescription.style.padding = '10px'
        divDescription.style.border = '1px solid grey'

        const image = document.createElement('img')
        image.src = strMealThumb
        image.style.maxWidth = "100%"

        const title = document.createElement('p')
        title.textContent = strMeal
        title.style.fontWeight = 'bold'

        const button = document.createElement('button')
        button.textContent = 'Ver Receta'
        button.classList.add('btn', 'btn-danger', 'py-1', 'px-5', 'm-auto', 'd-block')
        button.dataset.bsTarget = "#modal"
        button.dataset.bsToggle = "modal"
        button.onclick = () => {
            showRecipeDetail(recipe)
        }

        divDescription.appendChild(title)
        divDescription.appendChild(button)

        divContainer.appendChild(image)
        divContainer.appendChild(divDescription)

        results.appendChild(divContainer)

    })
}

const showRecipeDetail = recipe => {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`
    fetch(url)
        .then(response => response.json())
        .then(response => paintRecipeDetail(response.meals[0]))
}


const paintRecipeDetail = recipe => {
    const { idMeal, strInstructions, strMeal, strMealThumb } = recipe

    const h1 = document.querySelector('.modal-title')
    h1.textContent = strMeal

    const modalBody = document.querySelector('.modal-body')
    modalBody.innerHTML = `
        <img src="${strMealThumb}" class="img-fluid" > 
        <h3 class="my-3">Instructions</h3>
        <p>${strInstructions}</p>
        <h3 class="my-3">Ingredients and Measures</h3>
        `

    const ul = document.createElement('ul')
    ul.classList.add('list-group')

    for (let index = 1; index <= 20; index++) {
        if (recipe[`strIngredient${index}`]) {
            const ingredient = recipe[`strIngredient${index}`]
            const measure = recipe[`strMeasure${index}`]

            const li = document.createElement('li')
            li.classList.add('list-group-item')
            li.textContent = `${ingredient} - ${measure}`

            ul.appendChild(li)
        }
    }

    modalBody.appendChild(ul)

    const modalFooter = document.querySelector('.modal-footer')
    limpiarHtml(modalFooter)

    const btnFavorito = document.createElement('button')
    btnFavorito.classList.add('btn', 'btn-danger', 'col')
    btnFavorito.textContent = 'Agregar Favorito'
    btnFavorito.onclick = () => {
        saveFavorites(recipe)
    }


    const btnCerrar = document.createElement('button')
    btnCerrar.classList.add('btn', 'btn-secondary', 'col')
    btnCerrar.textContent = 'Cerrar'
    btnCerrar.setAttribute('data-bs-dismiss', 'modal')


    modalFooter.appendChild(btnFavorito)
    modalFooter.appendChild(btnCerrar)



}
const saveFavorites = (recipe) => {
    const recipesLS = getFavorites() || [];  // Si getFavorites devuelve null, se inicializa como un array vacío
    const findedRecipe = recipesLS.find(recipeLs => recipe.idMeal === recipeLs.idMeal);
    if (!findedRecipe) {
        recipesFav = [...recipesFav, recipe]; // Usamos recipesLS en lugar de recipes, para evitar problemas con variables globales
        localStorage.setItem('recipes', JSON.stringify(recipesFav));
    }
}

const getFavorites = () => {
    recipesFav = JSON.parse(localStorage.getItem('recipes')) || []
    return recipesFav
}




const limpiarHtml = (selector) => {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild)
    }
}

selectCategory?.addEventListener('change', showRecipes)
window.addEventListener('load', getCategories)
window.addEventListener('load', getFavorites)

if(favoritos){
    favoritos?.addEventListener('load', paintRecipes(recipesFav))
}
