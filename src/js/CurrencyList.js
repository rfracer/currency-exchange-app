export class CurrencyList {
  symbols = ['USD', 'EUR', 'CHF'];
  data = [];

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

  addSymbolsToData() {
    this.symbols.forEach((currency) => {
      const obj = { [currency]: [] };
      this.data.push(obj);
    });
  }

  transformData(data) {
    this.addSymbolsToData();
    for (let day in data) {
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
    this.transformData(data);
    this.generateTable(this.data);
    console.log(this.data);
  }

  generateTable(data) {
    console.log(data);
    const table = document.getElementById('currency-table');
    const tableBody = table.querySelector('tbody');
    data.forEach((element, index) => {
      // creates a table row
      const row = document.createElement('tr');
      row.classList.add('currency-table__row');
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('td');
        cell.classList.add('currency-table__value');
        const currency = Object.keys(element)[0];
        const average = '';
        const values = [currency, element[currency][6], 'sr', ''];

        const cellText = document.createTextNode(values[j]);
        //first row with flag
        if (j === 0) {
          const img = document.createElement('img');
          img.classList.add('currency-table__flag-icon');
          img.src = `./img/${currency}-flag.png`;
          cell.appendChild(img);
        }
        //last row with button
        if (j === 3) {
          const btn = document.createElement('button');
          btn.classList.add('btn-show-more');
          const img = document.createElement('img');
          img.src = './img/arrow-down.svg';
          btn.appendChild(img);
          cell.appendChild(btn);
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

      // add the row to the end of the table body
      tableBody.appendChild(row);
    });
  }
}
