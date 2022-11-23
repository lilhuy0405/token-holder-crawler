import * as puppeteer from 'puppeteer'
import TopDapp from "../entity/TopDapp";
import TopDappService from "../service/TopDappService";

class CrawlTopDapp {
  private readonly _topDappService: TopDappService;

  constructor() {
    this._topDappService = new TopDappService();
  }

  public async run(currentPage = 1) {
    const listDapp: TopDapp[] = [];
    try {
      console.log('Start crawling top dapp')
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setViewport({
        width: 1200,
        height: 1000
      });
      await page.goto('https://dappradar.com/rankings/protocol/ethereum'.concat(`/${currentPage}`), {
        timeout: 0
      });
      await this.scrollToBottom(page);
      console.log('Scrolled to bottom')
      console.log('Start crawling')
      const trs = await page.$$('tr.sc-eJDSGI.gKTXmp');
      for (let i = 0; i < trs.length; i++) {
        const tr = trs[i];
        const tds = await tr.$$('td');
        const rankTd = tds[0];
        const rank = await rankTd.$eval('div', (span) => span.textContent);
        const rankNumber = parseInt(rank);
        if (isNaN(rankNumber)) {
          continue;
        }
        const iconTd = tds[1];
        const icon = await iconTd.$eval('img', (img) => img.src);

        const nameTd = tds[2];
        const name = await nameTd.$eval('a', (a) => a.textContent);
        const url = await nameTd.$eval('a', (a) => a.href);

        const categoryTd = tds[3];
        const category = await categoryTd.evaluate(td => td.textContent);


        const balanceTd = tds[4];
        const balance = await balanceTd.evaluate(td => td.textContent);

        const uawTd = tds[5];
        const uaw = await uawTd.evaluate(td => td.textContent);

        const volumeTd = tds[6];
        const volume = await volumeTd.evaluate(td => td.textContent);

        console.log(balance, uaw, volume);

        const chartTd = tds[7];
        const chart = await chartTd.$eval('img', (img) => img.src);

        const dapp = new TopDapp();
        dapp.rank = rankNumber;
        dapp.name = name;
        dapp.url = url;
        dapp.icon = icon;
        dapp.category = category;
        dapp.balance = balance;
        dapp.uaw = uaw;
        dapp.volume = volume;
        dapp.chart = chart;
        listDapp.push(dapp);
      }
      console.log('Crawled top dapp successfully got: ', listDapp.length)
      //save db
      await browser.close();
      const listSaved = await Promise.all(listDapp.map(async (dapp) => {
        await this._topDappService.saveOrUpdate(dapp);
      }))
      console.log('Saved top dapp successfully: ' + listSaved.length)
      return listDapp;
    } catch (e) {
      console.error(e);
    }
  }

  async scrollToBottom(page) {
    const distance = 100; // should be less than or equal to window.innerHeight
    const delay = 100;
    while (await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
      await page.evaluate((y) => {
        document.scrollingElement.scrollBy(0, y);
      }, distance);
      await page.waitForTimeout(delay);
    }
  }
}

export default CrawlTopDapp