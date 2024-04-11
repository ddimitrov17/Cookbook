import {html,render,page} from '../lib.js';
import { get, put } from '../request.js';
import { createSubmitHandler } from '../util.js';

const editTemplate=(currentRecipe,onEdit) => html`
            <article>
                <h2>Edit Recipe</h2>
                <form @submit=${onEdit}>
                    <label>Name: <input type="text" name="name" placeholder="Recipe name" .value=${currentRecipe.name}></label>
                    <label>Image: <input type="text" name="img" placeholder="Image URL" .value=${currentRecipe.img}></label>
                    <label class="ml">Ingredients: <textarea name="ingredients"
                            placeholder="Enter ingredients on separate lines" .value=${currentRecipe.ingredients.join('\n')}></textarea></label>
                    <label class="ml">Preparation: <textarea name="steps"
                            placeholder="Enter preparation steps on separate lines" .value=${currentRecipe.steps.join('\n')}></textarea></label>
                    <input type="submit" value="Update Recipe">
                </form>
            </article>`;

export async function showEdit(ctx) {
    const id=ctx.params.id;
    const currentRecipe=await get('/data/recipes/' + id);
    render(editTemplate(currentRecipe,createSubmitHandler(onEdit)));

    async function onEdit(data) {
        const name=data['name'];
        const img=data['img'];
        const ingredients=data.ingredients.split('\n');
        const steps=data.steps.split('\n');
        if (!name || !img || !ingredients || !steps) {
            return alert('All fields are required!');
        }
        await put(`/data/recipes/${id}`,{
            name: name,
            img: img,
            ingredients: ingredients,
            steps: steps
        });
        page.redirect('/');
    }
}
