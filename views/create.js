import {html,render,page} from '../lib.js';
import { post } from '../request.js';
import { createSubmitHandler } from '../util.js';

const root=document.querySelector('main');
const createTemplate=(onCreate) => html`
        <article>
            <h2>New Recipe</h2>
            <form @submit=${onCreate}>
                <label>Name: <input type="text" name="name" placeholder="Recipe name"></label>
                <label>Image: <input type="text" name="img" placeholder="Image URL"></label>
                <label class="ml">Ingredients: <textarea name="ingredients" placeholder="Enter ingredients on separate lines"></textarea></label>
                <label class="ml">Preparation: <textarea name="steps" placeholder="Enter preparation steps on separate lines"></textarea></label>
                <input type="submit" value="Create Recipe">
            </form>
        </article>`;

export async function showCreate() {
    render(createTemplate(createSubmitHandler(onCreate)),root);
}

async function onCreate(data) {
    const name=data['name'];
    const img=data['img'];
    const ingredients=data.ingredients.split('\n');
    const steps=data.steps.split('\n');
    if (!name || !img || !ingredients || !steps) {
        return alert('All fields are required!');
    }
    await post('/data/recipes',{
        name: name,
        img: img,
        ingredients: ingredients,
        steps: steps
    });
    page.redirect('/');
}