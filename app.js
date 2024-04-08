import { catalogRender } from './catalog.js';
import {page} from './lib.js';

page('/',catalogRender);
page.start();