import { html, render,page} from '../lib.js';
import { del } from '../request.js';
import { getUserData } from '../util.js';

const root=document.querySelector('main');
const catalog = (recipiesArray) => html`
${recipiesArray.map(recipeTemplate)}
`

const recipeTemplate = (recipe) => html`
        <article class="preview" @click=${() => detailsRender(recipe._id)}>
            <div class="title">
                <h2>${recipe.name}</h2>
            </div>
            <div class="small">
                <img src="${recipe.img}">
            </div>
        </article>`

const detailsTemplate=(recipeDetails,owner,onDelete) => html`
        <article>
            <h2>${recipeDetails.name}</h2>
            <div class="band">
                <div class="thumb">
                    <img src="${recipeDetails.img}">
                </div>
                <div class="ingredients">
                    <h3>Ingredients:</h3>
                    <ul>
                        ${recipeDetails.ingredients.map(ingredient => html`<li>${ingredient}</li>`)}
                        <!-- <li>${recipeDetails.ingredients[0]}</li>
                        <li>${recipeDetails.ingredients[1]}</li>
                        <li>${recipeDetails.ingredients[2]}</li>
                        <li>${recipeDetails.ingredients[3]}</li> -->
                    </ul>
                </div>
            </div>
            <div class="description">
                <h3>Preparation:</h3>
                ${recipeDetails.steps.map(step => html`<p>${step}</p>`)}
                <!-- <p>${recipeDetails.steps[0]}</p>
                <p>${recipeDetails.steps[1]}</p>
                <p>${recipeDetails.steps[2]}</p> -->
            </div>
            ${owner ? html`<div class="controls">
            <button>
            <a href="/edit/${recipeDetails._id}">
            \u270E Edit
            </a>
            </button>
            <button @click=${onDelete}>\u2716 Delete</button>
            </div>` : ''}
        </article>`

export async function catalogRender() {
    const response = await fetch('http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg');
    const recipies = await response.json();
    let recipiesArray = Object.values(recipies);
    render(catalog(recipiesArray),root);
}

export async function detailsRender(id) {
    const response=await fetch(`http://localhost:3030/data/recipes/${id}`);
    let recipeDetails=await response.json();
    const user=getUserData();
    const isUserLogged=!!user;
    const owner=isUserLogged && recipeDetails._ownerId==user._id;
    render(detailsTemplate(recipeDetails,owner,onDelete),root);


const deleteTemplate=() => html`
    <article>
    <h2>Recipe deleted</h2>
    </article>`

    async function onDelete() {
        const choice=confirm('Are you sure you want to delete the recipe?');
        if (choice) {
            await del(`/data/recipes/${id}`);
            render(deleteTemplate(),root);
        }
    }
} 
//http://localhost:3030/data/recipes/8f414b4f-ab39-4d36-bedb-2ad69da9c830
// TODO : FIX INGREDIENTS - MAP