import { html, render } from './lib.js';

const catalog = (recipiesArray) => html`
${recipiesArray.map(recipeTemplate)}
`;

const recipeTemplate = (recipe) => html`
        <article class="preview">
            <div class="title">
                <h2>${recipe.name}</h2>
            </div>
            <div class="small">
                <img src="${recipe.img}">;
            </div>
        </article>`

export async function catalogRender() {
    const response = await fetch('http://localhost:3030/jsonstore/cookbook/recipes');
    const recipies = await response.json();
    let recipiesArray = Object.values(recipies);
    render(catalog(recipiesArray));
}