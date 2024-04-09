import { catalogRender, detailsRender } from './catalog.js';
import { page } from '../lib.js';
import { showRegister } from './register.js';

page('/', catalogRender);
page('/register',showRegister);
page.start();