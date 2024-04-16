import { html, render, page } from '../lib.js';
import { del, get, post } from '../request.js';
import { getUserData } from '../util.js';

const root = document.querySelector('main');
let totalRecipies = await get('/data/recipes?count');
let totalPages = Math.ceil(totalRecipies / 5);
let currentPage = 0;
const catalog = (recipiesArray) => html`
${recipiesArray.map(recipeTemplate)}
`
//value=${search || ''}
const searchBarTemplate=(onSearch) => html`
    <div class="section-title">
        <form id="searchForm" @submit=${onSearch}>
            <input type="text" name="search">
            <input type="submit" value="Search">
        </form>
    </div>`;

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
    ${searchBarTemplate(onSearch)}
    ${headerTemplate(currentPage + 1, totalPages)}
    ${catalog(recipiesArray)}
    ${footerTemplate(currentPage + 1, totalPages)}`;
    render(combinedTemplate, root);
}

const commentsTemplate=(isUserLogged,addComment,commentsContentArray,recipeName) => html`
    ${isUserLogged ? html`  
    <article class="comment">
        <h2>New comment</h2>
            <form id="commentForm" @submit=${addComment}>
                <textarea class="new-comment" placeholder="Type comment"></textarea>
                <input type="submit" value="Add comment">
            </form>
    </article>
    <header class="comment">Comments for ${recipeName}</header>
    ${commentsContentArray.map(([comment,user]) => eachCommentTemplate(comment,user))}` : html`<header class="comment">Comments for ${recipeName}</header>
    ${commentsContentArray.map(([comment,user]) => eachCommentTemplate(comment,user))}`}`

const eachCommentTemplate=(comment,userName) => html`
    <li class="comments">
        <header>${userName}</header>
        <p class="comment">${comment}</p>
    </li>`

export async function detailsRender(id) {
    const recipeDetails = await get(`/data/recipes/${id}`);
    const recipeName=recipeDetails.name;
    const user = getUserData();
    const isUserLogged = !!user;
    const owner = isUserLogged && recipeDetails._ownerId == user._id;
    async function addComment() {
        let commentContent=document.querySelector('textarea[class="new-comment"]').value;
        await post('/data/comments',{
            recipeId: id,
            content: commentContent,
            postedBy: user.email
        });
    }
    const comments=await get(`/data/comments?where=recipeId%3D%22${id}%22`);
    let commentsContentArray=comments.map(commentObjectProperty => commentObjectProperty=[commentObjectProperty.content,commentObjectProperty.postedBy]);
    const detailsCombinedTemplate=html`
        ${detailsTemplate(recipeDetails, owner, onDelete)}
        ${commentsTemplate(isUserLogged,addComment,commentsContentArray,recipeName)}
    `
    render(detailsCombinedTemplate, root);


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

async function onSearch(e) {
    e.preventDefault();
    const searchValue=document.querySelector('input[name="search"]').value;
    const searchResult=await get(`/data/recipes?where=name%20LIKE%20%22${searchValue}%22`);
    render(catalog(searchResult),root);
}

