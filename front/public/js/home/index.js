import init from './main.js';
import searchEvent from './search.js';
import drawSearch from './draw_page/drawSearch.js';
import drawNotFound from './draw_page/drawNotFound.js';
import drawCategory from './draw_page/drawCategory.js';

init();
searchEvent();

const routes = {
  main: init,
  search: drawSearch,
  notFound: drawNotFound,
  category: drawCategory,
};

function router() {
  const hashValue = window.location.hash.replace('#', '').split('/')[0];

  (routes[hashValue] || routes.notFound)();
}

window.addEventListener('hashchange', router);
