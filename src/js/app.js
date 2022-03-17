import { Calculate } from './Calculate';
import { CurrencyList } from './CurrencyList';
class App {
  static init() {
    //new Calculate();
    const list = new CurrencyList();
    list.fetchData();
  }
}

App.init();
