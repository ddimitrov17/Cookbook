import { html, render, page } from '../lib.js';
import { del, get } from '../request.js';
import { getUserData } from '../util.js';

const root = document.querySelector('main');
let totalRecipies = await get('/data/recipes?count');
let totalPages = Math.ceil(totalRecipies / 5);
let currentPage = 0;
const catalog = (recipiesArray) => html`
${recipiesArray.map(recipeTemplate)}
`

const headerTemplate = (currentPage, totalPages) => html`
        <header class="section-title">
            ${currentPage > 1 ? html`<a href="" class="pager" @click=${catalogRender}>< Prev</a>` : ''}
            <a class="pager">Page ${currentPage} of ${totalPages}</a>
            ${currentPage == totalPages ? '' : html`<a href="" class="pager" @click=${catalogRender}>> Next</a>`}
        </header>`;

const footerTemplate = (currentPage, totalPages) => html`
        <footer class="section-title">
            ${currentPage > 1 ? html`<a href="" class="pager" @click=${catalogRender}>< Prev</a>` : ''}
            <a class="pager">Page ${currentPage} of ${totalPages}</a>
            ${currentPage == totalPages ? '' : html`<a href="" class="pager" @click=${catalogRender}>> Next</a>`}
        </footer>`;


const recipeTemplate = (recipe) => html`
        <article class="preview" @click=${() => detailsRender(recipe._id)}>
            <div class="title">
                <h2>${recipe.name}</h2>
            </div>
            <div class="small">
                <img src="${recipe.img}">
            </div>
        </article>`

const detailsTemplate = (recipeDetails, owner, onDelete) => html`
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

export async function catalogRender(event) {
    let anchorClicked = event.target;
    if (anchorClicked != undefined) {
        anchorClicked = anchorClicked.textContent;
        if (anchorClicked.includes('Next')) {
            currentPage++;
        } else {
            currentPage--;
        }
    }
    const recipies = await get(`/data/recipes?select=_id%2Cname%2Cimg&offset=${currentPage * 5}&pageSize=5`);
    let recipiesArray = Object.values(recipies);
    const combinedTemplate = html`
    ${headerTemplate(currentPage + 1, totalPages)}
    ${catalog(recipiesArray)}
    ${footerTemplate(currentPage + 1, totalPages)}`;
    render(combinedTemplate, root);
}

export async function detailsRender(id) {
    const recipeDetails = await get(`/data/recipes/${id}`);
    const user = getUserData();
    const isUserLogged = !!user;
    const owner = isUserLogged && recipeDetails._ownerId == user._id;
    render(detailsTemplate(recipeDetails, owner, onDelete), root);


    const deleteTemplate = () => html`
    <article>
    <h2>Recipe deleted</h2>
    </article>`

    async function onDelete() {
        const choice = confirm('Are you sure you want to delete the recipe?');
        if (choice) {
            await del(`/data/recipes/${id}`);
            render(deleteTemplate(), root);
        }
    }
}

