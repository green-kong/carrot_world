export default async function clictCategory() {
  const categoryList = document.querySelectorAll('.listname');

  async function changeCategory(e) {
    const { way } = e.target.parentNode.dataset;
    const { code } = e.target.dataset;

    const url = 'http://localhost:4000/api/home/list';
    const body = { way, code };

    const response = axios.post(url, body);
  }

  categoryList.forEach((v) => {
    v.addEventListener('click', changeCategory);
  });
}