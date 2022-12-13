import CrawlTokenHolder from "./crawler/CrawlTokenHolder";
import {ETH_MAIN_NET_RPC_URL} from "./constants";
import {ethers} from "ethers";
import "reflect-metadata"
// es6 syntax
import * as cors from 'cors';
import {Express, Request} from "express";
import {AppDataSource} from "./data-source";
import TopDappService from "./service/TopDappService";
import TransactionService from "./service/TransactionService";

AppDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })

const express = require('express')
const app: Express = express()
//enable cors
app.use(cors());
const port = 3000
const provider = new ethers.providers.JsonRpcProvider(ETH_MAIN_NET_RPC_URL);
const crawler = new CrawlTokenHolder(provider)
const topDappService = new TopDappService()
const transactionService = new TransactionService()
app.get('/token-holder/:address', async (req, res) => {
  console.log(`Crawling token holder for ${req.params.address}`)
  const {address} = req.params
  let {limit} = req.query
  if (limit && limit > 500) {
    limit = 500
  }
  if (!address) {
    res.status(400).send('Token address is required')
    return
  }
  if (!ethers.utils.isAddress(address)) {
    res.status(400).json({
      message: 'Invalid address'
    })
    return
  }
  const balance = await crawler.getTokenHolders(address)
  if (!balance) {
    res.status(400).json({
      message: 'Cannot get token holder'
    })
    return
  }
  const sorted = await crawler.sortTokenHolders(balance, limit)
  if (!sorted) {
    res.status(400).json({
      message: 'Cannot sort token holder'
    })
    return
  }
  res.json(sorted)
})

app.get('/dapps', async (req, res) => {
  try {
    const list = await topDappService.getAllSortedByRank();
    res.json(list)
  } catch (err) {
    res.status(500).json({
      message: 'Cannot get dapps'
    })
  }
})

app.get('/transaction', async (req, res) => {
  const testAddr = "0xcE721d65e593f4F0E251321d2928ecc397f02Aeb";
  let {address, page, size, start, end} = req.query
  if (!address) {
    res.status(400).json({
      message: 'Address is required'
    })
    return
  }
  if (!page) page = 1;
  if (!size) size = 10;
  const tx = await transactionService.getUserTransaction(address, page, size, start, end);
  const txDTO = tx.map((t) => {
    return {
      ...t,
      block_number: t.block_number ? t.block_number.toString() : "",
      nonce: t.nonce ? t.nonce.toString() : "",
    }
  });
  return res.json(txDTO);
})

app.get("/native_balance", async (req, res) => {
  try {
    const {address} = req.query;
    if (!address) {
      return res.status(400).json({
        message: "Address is required"
      })
    }
    const provider = new ethers.providers.JsonRpcProvider(ETH_MAIN_NET_RPC_URL);
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(balance);
    return res.json({
      balance: balanceInEth,
      message: "ok"
    })
  } catch (err) {
    res.status(500).json({
      message: 'Cannot get native balance'
    })
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)

})
