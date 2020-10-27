const searchField = document.getElementById('searchField');

let arr = [];
let resultLength = null;
let flag=0;
let currPage = 1;
let pageList = [];

//================== Search Button Start ==================

searchButton.onclick = async function(event) {

    event.preventDefault();

    resultSearch = await searchRecipes(searchField.value);

    let resultLength = resultSearch.recipes.length
    let totalPages = Math.round(resultLength/10)

    createRecipeList(resultSearch,currPage,totalPages,pageList);
    let newDiv = document.getElementById('resultsList');
    newDiv.appendChild(pageList[1]);
    
    if(resultLength>10){
        createPageNumber(currPage,totalPages,pageList);
        console.log(currPage)
    }
}

//================== Search Button End ==================

//================== API Functions Start ==================

async function searchRecipes(searchField) {

    let result = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${searchField}`)
    
    return result.json()
}

async function getRecipes(searchRecipe) {

    let result = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${searchRecipe}`)    
    
    return result.json();
}

//================== API Functions End ==================

//================== Creating Elements for Recipe List Start ==================

async function createRecipeList(resultSearch,currPage,totalPages,pageList) {

    let ul = document.getElementById('resultsList');

    for(i=0;currPage<=totalPages;currPage++){
        pageList[currPage] = document.createElement('ul');
        for(;i<currPage*10; i++){
            let newLi = document.createElement('li');
            let newA = document.createElement('a');
            let newFigure = document.createElement('figure');
            let newImg = document.createElement('img');
            let newDiv = document.createElement('div');
            let newH4 = document.createElement('h4');
            let newP = document.createElement('p');

            pageList[currPage].appendChild(newLi);
            newLi.appendChild(newA);
            newA.appendChild(newFigure);
            newA.appendChild(newDiv);
            newFigure.appendChild(newImg);
            newDiv.appendChild(newH4);
            newDiv.appendChild(newP);

            newLi.id = "recipe"+[i];
            newA.className = "results__link";
            newA.href = "#"+resultSearch.recipes[i].recipe_id;
            newFigure.className = "results__fig";
            newDiv.className = "results__data";
            newH4.className = "results__name";
            newP.className = "results__author";
            pageList[currPage].id = "pageList";

            newImg.src = resultSearch.recipes[i].image_url
            newH4.innerHTML = resultSearch.recipes[i].title
            newP.innerHTML = resultSearch.recipes[i].publisher
        }
    }
}

//================== Creating Elements for Recipe List End ==================

//================== Creating Elements for Page Number Start ==================

async function createPageNumber(currPage,totalPages,pageList) {

    div = document.getElementById('resultPages');
        
    let newButtonPrev = document.createElement('button');
    let newSvgPrev = document.createElement('svg');
    let newSpanPrev = document.createElement('span');
    let newButtonNext = document.createElement('button');
    let newSvgNext = document.createElement('svg');
    let newSpanNext = document.createElement('span');
    let newUsePrev = document.createElement('use');
    let newUseNext = document.createElement('use');

    newButtonPrev.className = "btn-inline results__btn--prev";
    newButtonNext.className = "btn-inline results__btn--next";
    newButtonPrev.id = "newButtonPrev";
    newButtonNext.id = "newButtonNext"
    newSpanNext.id = "newSpanNext";
    newSpanPrev.id = "newSpanPrev";
    newSvgPrev.className = "search__icon";
    newSvgNext.className = "search__icon";
    newUseNext.href = "img/icons.svg#icon-triangle-right";
    newUsePrev.href = "img/icons.svg#icon-triangle-left";

    div.appendChild(newButtonNext);
    newButtonPrev.appendChild(newSvgPrev);
    newSvgPrev.appendChild(newUsePrev);
    newButtonPrev.appendChild(newSpanPrev);
    newButtonNext.appendChild(newSpanNext);
    newSvgNext.appendChild(newUseNext);
    newButtonNext.appendChild(newSvgNext);

    newSpanNext.innerHTML = `Page ${currPage + 1}`;
    
    newButtonNext.onclick = async function(event) {
        const newDiv = document.getElementById('resultsList');
        event.preventDefault();

        newDiv.removeChild(pageList[currPage]);
        currPage++;
        newDiv.appendChild(pageList[currPage]);

        if(currPage<totalPages) {
            div.appendChild(newButtonNext);
            newSpanNext.innerHTML = `Page ${currPage + 1}`;
        } if(currPage===totalPages){
            div.removeChild(newButtonNext);
        }
    
        if(currPage>1) {
            div.appendChild(newButtonPrev);
            newSpanPrev.innerHTML = `Page ${currPage - 1}`;
        } else if(currPage===1){
            div.removeChild(newButtonPrev);
        }
    }
    
    newButtonPrev.onclick = async function(event) {
        const newDiv = document.getElementById('resultsList');
        event.preventDefault();
        
        newDiv.removeChild(pageList[currPage]);
        currPage--;
        newDiv.appendChild(pageList[currPage]);

        if(currPage<totalPages) {
            div.appendChild(newButtonNext);
            newSpanNext.innerHTML = `Page ${currPage + 1}`;
        } else if(currPage===totalPages){
            div.removeChild(newButtonNext);
        }
    
        if(currPage>1) {
            div.appendChild(newButtonPrev);
            newSpanPrev.innerHTML = `Page ${currPage - 1}`;
        } else if(currPage===1){
            div.removeChild(newButtonPrev);
        }
    }

//================== Creating Elements for Recipe List End ==================

//================== Creating Elements for Picking a Recipe Start ==================

    const chosenItem = document.getElementById('pageList');
    const divRecipe = document.getElementById('recipe');
    const newDivRecipe = document.createElement('div');
    const newDivIngredients = document.createElement('div');
    const newUlIngredients = document.createElement('ul');
    const newFooterNote = document.createElement('div');
    const newButtonShoppingList = document.createElement('button')

    newDivIngredients.appendChild(newUlIngredients);
    newButtonShoppingList.className = "btn-small recipe__btn";
    newButtonShoppingList.id = "newButtonShoppingList";

    chosenItem.addEventListener('click',async e => {
        if (e.target.matches('a')){
            const key = e.target;

            let id = key.href
            let refId = id.split('#');
            resultRecipe = await getRecipes(refId[1]);
            console.log(resultRecipe)
            
            newDivRecipe.innerHTML = `<figure class="recipe__fig">
                                            <img src=${resultRecipe.recipe.image_url} alt=${resultRecipe.recipe.title} class="recipe__img">
                                            <h1 class="recipe__title">
                                                <span>${resultRecipe.recipe.title}</span>
                                            </h1>
                                        </figure>
                                        <div class="recipe__details">
                                            <div class="recipe__info">
                                                <svg class="recipe__info-icon">
                                                    <use href=${resultRecipe.recipe.recipe_id}></use>
                                                </svg>
                                                <span class="recipe__info-data recipe__info-data--minutes">45</span>
                                                <span class="recipe__info-text"> minutes</span>
                                            </div>
                                            <div class="recipe__info">
                                                <svg class="recipe__info-icon">
                                                    <use href="img/icons.svg#icon-man"></use>
                                                </svg>
                                                <span class="recipe__info-data recipe__info-data--people">4</span>
                                                <span class="recipe__info-text"> servings</span>

                                                <div class="recipe__info-buttons">
                                                    <button class="btn-tiny">
                                                        <svg>
                                                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                                                        </svg>
                                                    </button>
                                                    <button class="btn-tiny">
                                                        <svg>
                                                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                                                        </svg>
                                                    </button>
                                                </div>

                                            </div>
                                            <button class="recipe__love">
                                                <svg class="header__likes">
                                                    <use href="img/icons.svg#icon-heart-outlined"></use>
                                                </svg>
                                            </button>
                                        </div>`
            divRecipe.appendChild(newDivRecipe);

            newUlIngredients.innerHTML = ' ';
            for(i=0;i<resultRecipe.recipe.ingredients.length;i++){
                newUlIngredients.innerHTML += `<li class="recipe__item" id="recipeItem">
                                                <svg class="recipe__icon">
                                                    <use href="img/icons.svg#icon-check"></use>
                                                </svg>
                                                <div class="recipe__count">${resultRecipe.recipe.ingredients[i]}</div>
                                                <div class="recipe__ingredient">
                                                    <span class="recipe__unit"></span>

                                                </div>
                                            </li>`
            }
            divRecipe.appendChild(newDivIngredients);

            newButtonShoppingList.innerHTML = ' ';
            newButtonShoppingList.innerHTML = `<svg class="search__icon">
                                                    <use href="img/icons.svg#icon-shopping-cart"></use>
                                                </svg>
                                                <span>Add to shopping list</span>`
                                                
            newUlIngredients.appendChild(newButtonShoppingList);
            
            newFooterNote.innerHTML = `<div class="recipe__directions">
                                            <h2 class="heading-2">How to cook it</h2>
                                            <p class="recipe__directions-text">
                                                This recipe was carefully designed and tested by
                                                <span class="recipe__by">${resultRecipe.recipe.publisher}</span>. Please check out directions at their website.
                                            </p>
                                            <a class="btn-small recipe__btn" href=${resultRecipe.recipe.publisher_url} target="_blank">
                                                <span>Directions</span>
                                                <svg class="search__icon">
                                                    <use href="img/icons.svg#icon-triangle-right"></use>
                                                </svg>
                                            </a>
                                        </div>`
            divRecipe.appendChild(newFooterNote);

//================== Creating Elements for Picking a Recipe Start ==================

//================== Creating Elements for Shopping List Start ==================

            newButtonShoppingList.onclick = async function(event) {
                event.preventDefault();
                const newShoppingList = document.getElementById('shoppingList');
                console.log(newShoppingList)
                for(i=0;i<resultRecipe.recipe.ingredients.length;i++){
                    newShoppingList.innerHTML += `<li class="shopping__item">
                                                    <div class="shopping__count">
                                                        <input type="number" value=" " step="100">
                                                        <p></p>
                                                    </div>
                                                    <p class="shopping__description">${resultRecipe.recipe.ingredients[i]}</p>
                                                    <button class="shopping__delete btn-tiny">
                                                        <svg>
                                                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                                                        </svg>
                                                    </button>
                                                </li>`
                    
                }
            }
        }
    })
}

//================== Creating Elements for Shopping List End ==================