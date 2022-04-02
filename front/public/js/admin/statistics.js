(async function () {
  const context = document.getElementById('myChart').getContext('2d');

  const url = 'http://localhost:4000/api/statistics/graph';

  const response = await axios.post(url);

  const labels = ['January', 'February', 'March', 'April', 'May', 'June'];

  const data = {
    labels,
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ],
  };

  const config = {
    type: 'bar',
    data,
    options: {},
  };

  const myChart = new Chart(context, config);
})();
