/* Calculate class represents form to converts one currency to another
 * based on external API Data and amount from DOM Input
 */
export class Calculate {
  isActive = false;

  constructor() {
    const form = document.getElementById('calc-form');

    form.addEventListener('submit', this.calculateHandler.bind(this));
  }

  calculateHandler(e) {
    e.preventDefault();
    const value = document.getElementById('from-value').value;
    const baseCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    this.calcAmount(baseCurrency, toCurrency, value);
  }

  calcAmount(baseCurrency, toCurrency, value) {
    fetch(
      `https://api.exchangerate.host/latest?base=${toCurrency}&symbols=${baseCurrency}&amount=${value}&places=2`
    )
      .then((res) => {
        if (res.status === 404) {
          throw new Error('API Error - could not get a rate');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        this.generateResult(data.rates[baseCurrency], baseCurrency);
      })
      .catch((err) => alert(err));
  }

  generateResult(value, baseCurrency) {
    const result = document.getElementById('calc-result');
    const resultWrapper = document.querySelector('.exchange-form__result');
    result.textContent = value + ' ' + baseCurrency;

    if (!this.isActive) {
      resultWrapper.classList.remove('hide');
      this.isActive = true;
    }
  }
}
