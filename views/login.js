import {html,render} from '../lib.js';

const loginTemplate=() => html`
        <article>
            <h2>Login</h2>
            <form>
                <label>E-mail: <input type="text" name="email"></label>
                <label>Password: <input type="password" name="password"></label>
                <input type="submit" value="Login">
            </form>
        </article>`;

export function showLogin() {
    render(loginTemplate());
}