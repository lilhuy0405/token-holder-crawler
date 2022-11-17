// ✅ Do this if using TYPESCRIPT
import {RequestInfo, RequestInit} from 'node-fetch';

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({default: fetch}) => fetch(url, init));
import {JSDOM} from 'jsdom';
import {BigNumber, ethers} from "ethers";
import {formatUnits, parseUnits} from "ethers/lib/utils";
import {getContract} from "../utils";
import {ERC20_ABI} from "../constants";
import TokenBalanceService from "./TokenBalanceService";
import TokenBalance from "../entity/TokenBalance";
import TotalHolder from "../entity/TotalHolder";
import TotalHolderService from "./TotalHolderService";


export default class CrawlTokenHolder {
  private readonly _provider: ethers.providers.JsonRpcProvider;
  private readonly _tokenBalanceService: TokenBalanceService;
  private readonly _totalHolderService: TotalHolderService;


  constructor(provider: ethers.providers.JsonRpcProvider) {
    this._provider = provider;
    this._tokenBalanceService = new TokenBalanceService();
    this._totalHolderService = new TotalHolderService();

  }

  //implement retries logic
  private async getWebsiteContent(url: string, retries = 3): Promise<string> {
    try {
      const headers = {
        "user-agent": " Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
      }
      // Simple HTTP call
      const response = await fetch(url, {
        headers
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (err) {
      console.log(err)
      return null;
    }
  };


  public async crawlTokenHolder(tokenAddress: string) {
    try {
      const url = `https://etherscan.io/token/tokenholderchart/${tokenAddress}?range=500`
      const websiteHtml = await this.getWebsiteContent(url);
      console.log(`Crawled website ${url}`);
      if (!websiteHtml) {
        throw new Error('Empty website content');
      }

      const dom: JSDOM = new JSDOM(websiteHtml);
      const doc: Document = dom.window.document;
      const totalHolderElements = doc.querySelectorAll('span.text-nowrap')[1];
      const totalHoldersStr = totalHolderElements.textContent.replace('Token Holders:', '').replace(/,/g, '').trim();
      const totalHolders = parseInt(totalHoldersStr);

      const tokenHolderTable = doc.querySelector("table.table.table-hover");
      if (!tokenHolderTable) {
        throw new Error('Cannot find token holder table');
      }
      //get token decimal
      const erc20Contract = getContract(
        tokenAddress,
        ERC20_ABI,
        this._provider,
      );
      const decimalsNumber: number = await erc20Contract.decimals();
      const holders: any[] = [];
      tokenHolderTable.querySelectorAll("tr").forEach((tr, index) => {
        if (index === 0) {
          return
        }
        const td = tr.querySelectorAll("td")
        const address = td[1].querySelector("a").href.split("?a=").pop()
        const balance = parseFloat(td[2].textContent.replace(/,/g, ''))

        const balanceBigNumber = parseUnits(balance.toString(), decimalsNumber)
        //Save to database
        holders.push({
          token: tokenAddress,
          balance: balanceBigNumber.toString(),
          owner: address
        })
      })
      return {
        holders,
        totalHolders
      }
    } catch (err) {
      console.log(`Crawl token holder failed for token: ${tokenAddress} : ${err}`);
      return null;
    }
  }

  public async getTokenHolders(tokenAddress: string, limit=50) {
    try {
      const inDbHolders = await this._tokenBalanceService.findAllByToken(tokenAddress);
      const inDbTotalHolders = await this._totalHolderService.findByToken(tokenAddress);
      if (inDbHolders.length > 0 && inDbTotalHolders) {
        console.log(`Found ${inDbHolders.length} holders in database for token ${tokenAddress}`);
        return {
          holders: inDbHolders,
          totalHolders: inDbTotalHolders.totalHolder
        };
      }
      const holders: any = await this.crawlTokenHolder(tokenAddress);
      if (!holders) {
        return null;
      }
      const listSaved = await Promise.all(holders.holders.map(async (holder: any) => {
        const tokenBalance = new TokenBalance();
        tokenBalance.token = holder.token;
        tokenBalance.balance = holder.balance;
        tokenBalance.owner = holder.owner;
        return await this._tokenBalanceService.save(tokenBalance);
      }));
      const totalHolders = holders.totalHolders;
      const totalHolder = new TotalHolder();
      totalHolder.tokenAddress = tokenAddress;
      totalHolder.totalHolder = totalHolders;
      const savedTotalHolder = await this._totalHolderService.save(totalHolder);
      console.log(`Saved ${savedTotalHolder.totalHolder} total holders for token ${tokenAddress}`);
      console.log(`Saved ${listSaved.length} holders to database for token ${tokenAddress}`);
      return {
        holders: listSaved,
        totalHolders: savedTotalHolder.totalHolder
      };
    } catch (err) {
      console.log(`Get token holders failed for token: ${tokenAddress} : ${err}`);
      return null;
    }
  }

  public async sortTokenHolders(listHolders: {holders: TokenBalance[], totalHolders: number}, limit=50) {
    console.log("limit inservice", limit)
    try {
      const holders = listHolders.holders;
      const totalHolders = listHolders.totalHolders;
      //convert balance to number
      const tokenAddress = holders[0].token;
      //get token decimal
      const erc20Contract = getContract(
        tokenAddress,
        ERC20_ABI,
        this._provider,
      );
      const decimalsNumber: number = await erc20Contract.decimals();
      const holdersWithBalanceNumber = holders.map((holder: TokenBalance) => {
        const balanceBigNumber = BigNumber.from(holder.balance);
        const balanceNumber = parseFloat(formatUnits(balanceBigNumber, decimalsNumber));
        return {
          ...holder,
          balanceNumber
        }
      });
      //sort by balance
      const sortedHolders = holdersWithBalanceNumber.sort((a, b) => {
        return b.balanceNumber - a.balanceNumber;
      });
      //get top limit holders
      const topHolders = sortedHolders.slice(0, limit);
      //remove balanceNumber property
      const topHoldersWithoutBalanceNumber = topHolders.map((holder: any) => {
        const {balanceNumber, ...rest} = holder;
        return rest;
      });
      return {
        holders: topHoldersWithoutBalanceNumber,
        totalHolders
      }
    } catch (err) {
      console.log(`Sort token holders failed for token: ${listHolders.holders[0].token} : ${err}`);
      return null;
    }
  }
}
