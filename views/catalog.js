import { html, render} from '../lib.js';

const catalog = (recipiesArray) => html`
${recipiesArray.map(recipeTemplate)}
`

const recipeTemplate = (recipe) => html`
        <article class="preview" id="${recipe._id}" @click=${() => detailsRender(recipe._id)}>
            <div class="title">
                <h2>${recipe.name}</h2>
            </div>
            <div class="small">
                <img src="${recipe.img}">
            </div>
        </article>`

const detailsTemplate=(recipeDetails) => html`
        <article>
            <h2>${recipeDetails.name}</h2>
            <div class="band">
                <div class="thumb">
                    <img src="${recipeDetails.img}">
                </div>
                <div class="ingredients">
                    <h3>Ingredients:</h3>
                    <ul>
                        <li>${recipeDetails.ingredients[0]}</li>
                        <li>${recipeDetails.ingredients[1]}</li>
                        <li>${recipeDetails.ingredients[2]}</li>
                        <li>${recipeDetails.ingredients[3]}</li>
                    </ul>
                </div>
            </div>
            <div class="description">
                <h3>Preparation:</h3>
                <p>${recipeDetails.steps[0]}</p>
                <p>${recipeDetails.steps[1]}</p>
                <p>${recipeDetails.steps[2]}</p>
            </div>
            <button>\u270E Edit</button>
            <button>\u2716 Delete</button>
        </article>`

export async function catalogRender() {
    const response = await fetch('http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg');
    const recipies = await response.json();
    let recipiesArray = Object.values(recipies);
    render(catalog(recipiesArray));
}

export async function detailsRender(id) {
    const response=await fetch(`http://localhost:3030/data/recipes/${id}`);
    let recipeDetails=await response.json();
    render(detailsTemplate(recipeDetails));
} 
//http://localhost:3030/data/recipes/8f414b4f-ab39-4d36-bedb-2ad69da9c830
// TODO : FIX INGREDIENTS - MAP