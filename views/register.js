import {html,render} from '../lib.js';
import { updateNav } from '../util.js';

const registerTemplate=() => html`
        <article>
            <h2>Register</h2>
            <form>
                <label>E-mail: <input type="text" name="email"></label>
                <label>Password: <input type="password" name="password"></label>
                <label>Repeat: <input type="password" name="rePass"></label>
                <input type="submit" value="Register">
            </form>
        </article>`;

export function showRegister() {
    render(registerTemplate());
}