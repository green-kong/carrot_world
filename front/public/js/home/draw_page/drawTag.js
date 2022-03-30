export default async function drawTag() {
  const [, table, tmp] = window.location.hash.replace('#', '').split('/');
  const tag = decodeURIComponent(tmp);
  const tagTable = table === 'auction' ? 'au_tag' : 's_tag';

  const url = 'http://localhost:4000/api/home/tag';
  const body = { table, tag, tagTable };

  const response = await axios.post(url, body);
}
