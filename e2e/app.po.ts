import { browser, element, by } from 'protractor';

export class FintInformasjonsmodellPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('fint-root h1')).getText();
  }
}
