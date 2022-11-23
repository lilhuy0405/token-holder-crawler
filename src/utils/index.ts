import {BigNumber, ethers} from 'ethers';
import * as queryString from "querystring";
import {RequestInfo, RequestInit} from "node-fetch";

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({default: fetch}) => fetch(url, init));


export const deletePadZero = (hexNumber: string) => {
  if (!hexNumber) return '';
  return hexNumber.replace(/^(0x)0+((\w{4})+)$/, '$1$2');
};
export const getContract = (
  address: string,
  abi: any,
  provider: ethers.providers.JsonRpcProvider,
) => {
  return new ethers.Contract(address, abi, provider);
};

export const getWebsiteContent = async (url: string, useProxy = false): Promise<string> => {
  const userAgentsList = [
    'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
  ]
  try {
    const headers = {
      'User-Agent': userAgentsList[Math.floor(Math.random() * userAgentsList.length)],
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Cache-Control": "max-age=0"
    }
    const apiKey = "4993f61d-be0f-4231-a39c-136416afba91"
    const params = queryString.stringify({
      api_key: apiKey,
      url: url,
    });
    const proxyUrl = "https://proxy.scrapeops.io/v1/"
    // Simple HTTP call
    console.log("Proxy url: ", `${proxyUrl}?${params}`)
    const fetchUrl = useProxy ? `${proxyUrl}?${params}` : url
    const response = await fetch(`${fetchUrl}`, {
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