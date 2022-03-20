# Currency Exchange App

Vanilla ES6 Currency Exchange App. Calcuate exchange and shows most important rates. It takes data from external API.

Live link: [SEE HERE](https://rfracer.github.io/currency-exchange-app/).

![image](https://user-images.githubusercontent.com/22677833/159164437-0bf2077f-7349-4c72-be55-c952a09f10fc.png)

## How It Works - App description

1. App allows you to convert one currency to another based on input value and selected 'from' and 'to' currencies. It return amount of money and symbol to DOM below calculate form.
2. Below calculate you can see table of currencies and values. You can see:

- Today value
- Average 7 days value
- Show More Button

3. Clicking on Show more 'down arrow' shows chart with last 7 days data of specific currency.
4. To extend list of currencies you just have to modify App Class and add currency symbol to array. You also have to provide flag image if you want to nice looking style table.

## Technologies

Project is created with:

- HTML5
- SCSS + BEM
- JavaScript - ES6
- Chart.js - external library
- External API - exchangerate.host
- ES6 Modules
- Webpack
