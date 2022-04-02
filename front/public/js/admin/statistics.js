(async function () {
  const START_COLOR = 90;
  const END_COLOR = 20;

  const colorList = [];

  const context = document.getElementById('myChart').getContext('2d');

  const url = 'http://localhost:4000/api/statistics/graph';

  const response = await axios.post(url);

  const labels = response.data.map((v) => v[0]);

  const colors = labels.map((v, i, t) => {
    const avg = (START_COLOR - END_COLOR) / (t.length - 1);
    return `hsl(269, 89%, ${START_COLOR - avg * i}%)`;
  });
  // 269/89
  console.log(colors);
  const data = {
    labels,
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: colors,
        borderColor: 'rgb(255, 99, 132)',
        data: response.data.map((v) => v[1]),
      },
    ],
  };

  const config = {
    type: 'bar',
    data,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  const myChart = new Chart(context, config);
})();
