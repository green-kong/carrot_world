export default function clictCategory() {
  const categoryList = document.querySelectorAll('.category_list');

  categoryList.forEach((v) => {
    v.addEventListener('click', changeCategory);
  });
}

async function changeCategory(e) {
  const { way } = e.target.parentNode.dataset;
  const { code } = e.target.dataset;
  const category = e.target.innerHTML;

  window.location.hash = `category/${way}/${code}/${category}`;
}
