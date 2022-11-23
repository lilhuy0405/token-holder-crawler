import {AppDataSource} from "./data-source";
import CrawlTopDapp from "./crawler/CrawlTopDapp";

const main = async () => {
  const crawlTopDapp = new CrawlTopDapp();
  for (let i = 0; i < 4; i++) {
    await crawlTopDapp.run(i + 1);
  }
}

AppDataSource
  .initialize()
  .then(async () => {
    console.log("Data Source has been initialized!")
    await main()
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })