export default async function drawView() {
  const [, table, idx] = window.location.hash.replace('#', '').split('/');

  const url = 'http://localhost:4000/api/home/view';
  const body = { table, idx };

  const response = await axios.post(url, body);
  if (response.status === 200) {
    const { imgList, itemResult, tagList } = response.data;

    const contentFrame = document.querySelector('#content_frame');

    const viewTemp = document.querySelector('#view_template').innerHTML;
    const viewImgTemp = document.querySelector('#view_img_template').innerHTML;
    const viewTagTemp = document.querySelector('#view_tag_template').innerHTML;

    const imgResult = imgList.reduce((acc, cur) => {
      return acc + viewImgTemp.replace('{img}', cur.img);
    }, '');

    const tagResult = tagList.reduce((acc, cur) => {
      return acc + viewTagTemp.replace('{tag}', cur.tag);
    }, '');

    const result = viewTemp
      .replace('{imgList}', imgResult)
      .replace('{subject}', itemResult.subject)
      .replace('{price}', itemResult.price)
      .replace('{like}', itemResult.like)
      .replace('{date}', itemResult.date)
      .replace('{how}', itemResult.how)
      .replace('{location}', itemResult.location)
      .replace('{tagList}', tagResult)
      .replace('{content}', itemResult.content);

    console.log(result);

    contentFrame.innerHTML = result;
  }
}
