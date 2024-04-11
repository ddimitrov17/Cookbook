import {render,html,page} from '../lib.js';
import { get } from '../request.js';

const homeTemplate=() => html`
        <div class="hero">
                <h2>Welcome to My Cookbook</h2>
            </div>
            <header class="section-title">Recently added recipes</header>
            <div class="recent-recipes"></div>
            <footer class="section-title">
                <p>Browse all recipes in the <a href="/catalog">Catalog</a></p>
            </footer>
        </section>`;

const recentCatalog = (recentRecipiesArray) => html`
${recentRecipiesArray.map(recipeTemplate)}
`

const recipeTemplate = (recipe) => html`
        <article class="preview">
            <div class="title">
                <h2>${recipe.name}</h2>
            </div>
            <div class="small">
                <img src="${recipe.img}">
            </div>
        </article>`

export async function showHome() {
    const root=document.querySelector('main');
    render(homeTemplate(),root);
    const recentRecipies=await get('/data/recipes?select=_id%2Cname%2Cimg&sortBy=_createdOn%20desc&pageSize=3');
    let recentRecipiesArray = Object.values(recentRecipies);
    const div=document.querySelector('div[class="recent-recipes"]');
    render(recentCatalog(recentRecipiesArray),div);
}