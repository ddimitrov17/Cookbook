import {html,render,page} from '../lib.js';
import { register } from '../users.js';
import { createSubmitHandler, updateNav } from '../util.js';

const registerTemplate=(onRegister) => html`
        <article>
            <h2>Register</h2>
            <form @submit=${onRegister}>
                <label>E-mail: <input type="text" name="email"></label>
                <label>Password: <input type="password" name="password"></label>
                <label>Repeat: <input type="password" name="rePass"></label>
                <input type="submit" value="Register">
            </form>
        </article>`;

export function showRegister() {
    render(registerTemplate(createSubmitHandler(onRegister)));
}

async function onRegister(data) {
    if (!data['email'] || !data['password'] || !data['rePass']) {
        return alert('All fields are required!');
    }
    if (data['password']!==data['rePass']) {
        return alert('Passwords do not match!');
    }
    await register(data['email'],data['password']);
    updateNav();
    page.redirect('/');
}