export default async function drawView() {
  const [, table, idx] = window.location.hash.replace('#', '').split('/');

  const url = 'http://localhost:4000/api/home/view';
  const body = { table, idx };

  const response = axios.post(url, body);
}
