import searchEvent from './search.js';

import init from './main.js';
import drawSearch from './draw_page/drawSearch.js';
import drawNotFound from './draw_page/drawNotFound.js';
import drawCategory from './draw_page/drawCategory.js';
import drawView from './draw_page/drawView.js';

init();
searchEvent();

const routes = {
  main: init,
  search: drawSearch,
  notFound: drawNotFound,
  category: drawCategory,
  view: drawView,
};

function router() {
  const hashValue = window.location.hash.replace('#', '').split('/')[0];
  if (hashValue === '') {
    init();
    return;
  }
  (routes[hashValue] || routes.notFound)();
}

window.addEventListener('hashchange', router);
