import { FintArbeidstakerInformasjonsmodellPage } from './app.po';

describe('fint-arbeidstaker-informasjonsmodell App', function() {
  let page: FintArbeidstakerInformasjonsmodellPage;

  beforeEach(() => {
    page = new FintArbeidstakerInformasjonsmodellPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('fint works!');
  });
});
