export default async function drawView() {
  const [, table, idx] = window.location.hash.replace('#', '').split('/');

  const url = 'http://localhost:4000/api/home/view';
  const body = { table, idx };

  const response = await axios.post(url, body);
  if (response.status === 200) {
    const { imgList, itemResult, tagList, recList } = response.data;

    const contentFrame = document.querySelector('#content_frame');

    const viewTemp = document.querySelector('#view_template').innerHTML;
    const viewImgTemp = document.querySelector('#view_img_template').innerHTML;
    const viewTagTemp = document.querySelector('#view_tag_template').innerHTML;
    const viewRecTemp = document.querySelector(
      '#view_recommend_template'
    ).innerHTML;
    const auviewRecTemp = document.querySelector(
      '#au_view_recommend_template'
    ).innerHTML;

    const imgResult = imgList.reduce((acc, cur) => {
      return acc + viewImgTemp.replace('{img}', cur.img);
    }, '');

    const tagResult = tagList.reduce((acc, cur) => {
      return acc + viewTagTemp.replace('{tag}', cur.tag);
    }, '');

    let recResult = '연관된 물품이 없습니다.';
    let result;
    if (table === 'sell_board') {
      if (recList !== undefined) {
        recResult = recList.reduce((acc, cur) => {
          return (
            acc +
            viewRecTemp
              .replace('{table}', table)
              .replace('{s_id}', cur.s_id)
              .replace('{img}', cur.img)
              .replace('{subject}', cur.subject)
              .replace('{price}', cur.price)
          );
        }, '');
      }

      result = viewTemp
        .replace('{imgList}', imgResult)
        .replace('{subject}', itemResult.subject)
        .replace('{price}', itemResult.price)
        .replace('{like}', itemResult.likes)
        .replace('{date}', itemResult.date)
        .replace('{how}', itemResult.how)
        .replace('{location}', itemResult.location)
        .replace('{tagList}', tagResult)
        .replace('{content}', itemResult.content)
        .replace('{c_name}', itemResult.c_name)
        .replace('{recommendList}', recResult);
    } else {
      if (recList !== undefined) {
        recResult = recList.reduce((acc, cur) => {
          return (
            acc +
            auviewRecTemp
              .replace('{table}', table)
              .replace('{au_id}', cur.au_id)
              .replace('{img}', cur.img)
              .replace('{subject}', cur.subject)
              .replace('{price}', cur.price)
          );
        }, '');
      }

      result = viewTemp
        .replace('{imgList}', imgResult)
        .replace('{subject}', itemResult.subject)
        .replace('{price}', itemResult.price)
        .replace('{like}', itemResult.likes)
        .replace('{date}', itemResult.date)
        .replace('{how}', itemResult.how)
        .replace('{location}', itemResult.location)
        .replace('{tagList}', tagResult)
        .replace('{content}', itemResult.content)
        .replace('{c_name}', itemResult.c_name)
        .replace('{recommendList}', recResult);
    }
    contentFrame.innerHTML = result;
  }
}
