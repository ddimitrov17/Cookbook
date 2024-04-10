import {html,render,page} from '../lib.js';
import { login } from '../users.js';
import { createSubmitHandler, updateNav } from '../util.js';

const loginTemplate=(onLogin) => html`
        <article>
            <h2>Login</h2>
            <form @submit=${onLogin}>
                <label>E-mail: <input type="text" name="email"></label>
                <label>Password: <input type="password" name="password"></label>
                <input type="submit" value="Login">
            </form>
        </article>`;

export function showLogin() {
    render(loginTemplate(createSubmitHandler(onLogin)));
}

async function onLogin(data) {
    if (!data['email'] || !data['password']) {
        return alert('All fields are required!');
    }
    await login(data['email'],data['password']);
    updateNav();
    page.redirect('/');
}