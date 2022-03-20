import { CurrencyChart } from './CurrencyChart';

/* CurrencyList class represents table of currencies with info about:
 * today value, average 7 days value, data to chart for each currency.
 * Based on external API Data.
 */
export class CurrencyList {
  data = [];
  labels = [];

  constructor(symbols) {
    this.symbols = symbols;
    this.table = document.getElementById('currency-table');
  }

  fetchAndDisplay() {
    this.fetchData().then((data) => {
      this.displayData(data);
    });
  }

  fetchData() {
    const todayDate = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    return fetch(
      `https://api.exchangerate.host/timeseries?start_date=${sevenDaysAgo}&end_date=${todayDate}&base=PLN&symbols=${this.symbols}&places=3`
    )
      .then((res) => {
        if (res.status === 404) {
          throw new Error('API Error - could not get a rate');
        }
        return res.json();
      })
      .then((data) => {
        return data.rates;
      })
      .catch((err) => alert(err));
  }

  /* addSymbolstoData() => Create object with Currency symbols as keys
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
  transformData() => Transform data from API to create format:
  [
    currencyName: [values],
    currencyName: [values],
  ]
  */

  transformData(data) {
    for (let day in data) {
      this.addChartLabel(day);
      if (data.hasOwnProperty(day)) {
        const allCurrencyDayRates = data[day];
        for (let currency in allCurrencyDayRates) {
          this.addCurrencyValueToDayArray(allCurrencyDayRates, currency);
        }
      }
    }
  }

  addCurrencyValueToDayArray(allCurrencyDayRates, currency) {
    if (allCurrencyDayRates.hasOwnProperty(currency)) {
      this.data.forEach((specificCurrencyObject) => {
        const key = Object.keys(specificCurrencyObject)[0];
        if (key === currency) {
          specificCurrencyObject[key].push(
            (1 / allCurrencyDayRates[currency]).toFixed(2)
          );
        }
      });
    }
  }

  addChartLabel(label) {
    this.labels.push(label);
  }

  displayData(data) {
    this.addSymbolsToData();
    this.transformData(data);
    this.generateTable(this.data);
  }

  generateTable(data) {
    const tableBody = this.table.querySelector('tbody');

    data.forEach((currencyObject) => {
      const row = document.createElement('tr');
      row.classList.add('currency-table__row');

      const currency = Object.keys(currencyObject)[0];
      const average = this.getAverageValue(currencyObject[currency]);

      const tableRowValues = [
        currency,
        currencyObject[currency][6],
        average,
        '',
      ];

      for (let column = 0; column < tableRowValues.length; column++) {
        const cell = this.generateCell(currency);
        const cellText = document.createTextNode(tableRowValues[column]);

        if (column === 0) {
          const img = document.createElement('img');
          img.classList.add('currency-table__flag-icon');
          img.src = `./img/flags/${currency}-flag.png`;
          cell.appendChild(img);
        }

        if (column === tableRowValues.length - 1) {
          const btn = this.createShowMoreButton(currency);
          cell.appendChild(btn);

          this.connectMoreInfoButton(btn);
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

      tableBody.appendChild(row);
    });
  }

  createShowMoreButton(currency) {
    const btn = document.createElement('button');
    btn.classList.add('btn-show-more');
    btn.dataset.currency = currency;
    btn.setAttribute('aria-expanded', 'false');
    const img = document.createElement('img');
    img.src = './img/arrow-down.svg';
    btn.appendChild(img);
    return btn;
  }

  generateCell(currency) {
    const cell = document.createElement('td');
    cell.classList.add('currency-table__value');
    cell.dataset.currency = currency;
    return cell;
  }

  connectMoreInfoButton(btn) {
    btn.addEventListener('click', this.showMoreInfoHandler.bind(this, btn));
  }

  showMoreInfoHandler(btn) {
    const currency = btn.dataset.currency;

    if (!btn.classList.contains('generated-chart')) {
      const selectedCurrencyRow = document.querySelector(
        `[data-currency="${currency}"]`
      ).parentElement;
      const newRow = this.generateRowForChart(currency);
      selectedCurrencyRow.after(newRow);

      this.connectChart(this.data, currency, this.labels);
      btn.classList.add('generated-chart', 'open');
      newRow.classList.add('chart');
    } else {
      const chartRow = document.querySelector(`[data-chart="${currency}"]`);
      chartRow.classList.toggle('hide');
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.toggle('open');
    }
  }

  generateRowForChart(currency) {
    const newRow = document.createElement('tr');
    newRow.dataset.chart = currency;
    const cell = document.createElement('td');
    cell.setAttribute('colspan', '4');
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${currency}`;
    canvas.setAttribute('width', '100%');
    cell.appendChild(canvas);
    newRow.appendChild(cell);

    return newRow;
  }

  connectChart(inputData, currency, labels) {
    const data = inputData.filter((element) => {
      if (Object.keys(element)[0] === currency) {
        return element[currency];
      }
    });

    const currencyLastDaysData = data[0][currency];
    const chartLabels = this.convertDateToMonthDayFormat(labels);
    const chart = new CurrencyChart(
      currencyLastDaysData,
      currency,
      chartLabels
    );
    chart.generateChart();
  }

  convertDateToMonthDayFormat(dates) {
    const convertedDates = dates.map((date) => {
      return date.slice(5, 11);
    });
    return convertedDates;
  }

  getAverageValue(array) {
    const average = array.reduce((p, c) => +p + +c, 0) / array.length;
    return average.toFixed(2);
  }
}
