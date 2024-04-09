import { catalogRender, detailsRender } from './catalog.js';
import { page } from './lib.js';

page('/', catalogRender);
page('/details/:id', detailsRender);
page.start();