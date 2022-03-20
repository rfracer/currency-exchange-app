import Chart from 'chart.js/auto';

/*  CurrencyChart class is used to set basic config data and generate
 *  external Chart object.
 */
export class CurrencyChart {
  constructor(data, currency, labels) {
    this.data = data;
    this.currency = currency;
    this.labels = labels;
    this.configChart();
  }

  setData() {
    const chartDetails = {
      labels: this.labels,
      datasets: [
        {
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: this.data,
        },
      ],
    };
    return chartDetails;
  }

  configChart() {
    this.config = {
      type: 'line',
      data: this.setData(),
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
  }

  generateChart() {
    new Chart(document.getElementById(`chart-${this.currency}`), this.config);
  }
}
