import { CurrencyChart } from './CurrencyChart';
export class CurrencyList {
  symbols = ['USD', 'EUR', 'CHF', 'AUD'];
  data = [];
  labels = [];

  constructor() {}

  fetchData() {
    const todayDate = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    fetch(
      `https://api.exchangerate.host/timeseries?start_date=${sevenDaysAgo}&end_date=${todayDate}&base=PLN&symbols=${this.symbols}&places=3`
    )
      .then((res) => {
        if (res.status === 404) {
          throw new Error('API Error - could not get a rate');
        }
        return res.json();
      })
      .then((data) => {
        this.displayData(data.rates);
      })
      .catch((err) => alert(err));
  }

  /* Create object with Currency symbols as keys
  
  [
    currencyName: [],
    currencyName: []
  ]
  
  */

  addSymbolsToData() {
    this.symbols.forEach((currency) => {
      const obj = { [currency]: [] };
      this.data.push(obj);
    });
  }

  /*
  Transform data from API to create format:
  [
    currencyName: [values],
    currencyName: [values],
  ]

  */
  transformData(data) {
    for (let day in data) {
      this.labels.push(day);
      if (data.hasOwnProperty(day)) {
        const dayCurrencyRates = data[day];
        for (let currency in dayCurrencyRates) {
          if (dayCurrencyRates.hasOwnProperty(currency)) {
            this.data.forEach((element) => {
              for (let key in element) {
                if (key === currency) {
                  element[key].push(
                    (1 / dayCurrencyRates[currency]).toFixed(2)
                  );
                }
              }
            });
          }
        }
      }
    }
  }

  displayData(data) {
    this.addSymbolsToData();
    this.transformData(data);
    this.generateTable(this.data);
  }

  generateTable(data) {
    const table = document.getElementById('currency-table');
    const tableBody = table.querySelector('tbody');
    data.forEach((element, index) => {
      // creates a table row
      const row = document.createElement('tr');
      row.classList.add('currency-table__row');

      for (let i = 0; i < 4; i++) {
        const cell = document.createElement('td');
        cell.classList.add('currency-table__value');
        const currency = Object.keys(element)[0];
        cell.dataset.currency = currency; //??
        const average = this.getAverageValue(element[currency]);

        const rowValues = [currency, element[currency][6], average, ''];

        const cellText = document.createTextNode(rowValues[i]);
        //first row with flag
        if (i === 0) {
          const img = document.createElement('img');
          img.classList.add('currency-table__flag-icon');
          img.src = `./img/${currency}-flag.png`;
          cell.appendChild(img);
        }
        //last row with button
        if (i === 3) {
          const btn = document.createElement('button');
          btn.classList.add('btn-show-more');
          btn.dataset.currency = currency;
          btn.setAttribute('aria-expanded', 'false');
          const img = document.createElement('img');
          img.src = './img/arrow-down.svg';
          btn.appendChild(img);
          cell.appendChild(btn);

          this.connectMoreInfoButton(btn);
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

      // add the row to the end of the table body
      tableBody.appendChild(row);
    });
  }

  connectMoreInfoButton(btn) {
    btn.addEventListener('click', this.showMoreInfoHandler.bind(this, btn));
  }

  // connectChart() {
  //   const chart = new Chart([1, 2, 3], 'USD');
  //   chart.generateChart();
  // }

  // CONNECT HANDLER TO BUTTON CLICK
  showMoreInfoHandler(btn) {
    const currency = btn.dataset.currency;

    if (!btn.classList.contains('generated-chart')) {
      const row = document.querySelector(
        `[data-currency="${currency}"]`
      ).parentElement;

      const newRow = document.createElement('tr');
      newRow.dataset.chart = currency;
      const cell = document.createElement('td');
      cell.setAttribute('colspan', '4');

      const canvas = document.createElement('canvas');
      canvas.id = `chart-${currency}`;
      canvas.setAttribute('width', '100%');
      cell.appendChild(canvas);

      newRow.appendChild(cell);

      row.after(newRow);

      this.connectChart(this.data, currency, this.labels);

      btn.classList.add('generated-chart', 'open');
      newRow.classList.add('chart');
    } else {
      const row = document.querySelector(`[data-chart="${currency}"]`);
      row.classList.toggle('hide');
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.toggle('open');
    }
  }

  // getCurrencyData(data, currency) {
  //   data.forEach((element) => {
  //     if (Object.keys(element)[0] == currency) {
  //       return element[currency];
  //     }
  //   });
  // }

  getAverageValue(arr) {
    const average = arr.reduce((p, c) => +p + +c, 0) / arr.length;
    return average.toFixed(2);
  }

  connectChart(inputData, currency, labels) {
    const data = inputData.filter((element) => {
      if (Object.keys(element)[0] == currency) {
        return element[currency];
      }
    });
    const currencyLastDaysData = data[0][currency];
    const chartLabels = this.convertDataToMonthDay(labels);
    const chart = new CurrencyChart(
      currencyLastDaysData,
      currency,
      chartLabels
    );
    chart.generateChart();
  }

  convertDataToMonthDay(dates) {
    const convertedDates = dates.map((date) => {
      return date.slice(5, 11);
    });
    return convertedDates;
  }
}
