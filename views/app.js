import { catalogRender } from './catalog.js';
import { page } from '../lib.js';
import { showRegister } from './register.js';
import { updateNav } from '../util.js';
import { showLogin } from './login.js';
import { logout } from '../users.js';
import { showCreate } from './create.js';

updateNav();
page('/', catalogRender);
page('/register',showRegister);
page('/login',showLogin);
page('/create',showCreate);
page.start();

document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
    updateNav();
    page.redirect('/');
})