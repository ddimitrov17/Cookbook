import { catalogRender, detailsRender } from './catalog.js';
import { page } from '../lib.js';
import { showRegister } from './register.js';
import { updateNav } from '../util.js';

updateNav();
page('/', catalogRender);
page('/register',showRegister);
page.start();