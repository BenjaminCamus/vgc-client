import { VgcPage } from './app.po';

describe('vgc App', function() {
  let page: VgcPage;

  beforeEach(() => {
    page = new VgcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
