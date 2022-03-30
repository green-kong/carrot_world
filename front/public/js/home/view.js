const moveView = (e) => {
  const target = e.target.closest('.ranking_list');

  const table = target.querySelector('.table').value;
  const idx = target.querySelector('.idx').value;

  window.location.hash = `view/${table}/${idx}`;
};

export default function itemClicEvent() {
  const itemListCon = document.querySelectorAll('.item_list_contaier');

  itemListCon.forEach((v) => {
    v.addEventListener('click', moveView);
  });
}
