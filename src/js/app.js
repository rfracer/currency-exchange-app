import { Calculate } from './Calculate';
import { CurrencyList } from './CurrencyList';
class App {
  listSymbols = ['USD', 'EUR', 'GBP', 'CHF', 'AUD'];

  init() {
    new Calculate();
    const list = new CurrencyList(this.listSymbols);
    list.fetchAndDisplay();
  }
}

const app = new App();
app.init();
