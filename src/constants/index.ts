import { FormatTypes, Interface } from 'ethers/lib/utils';
import 'dotenv/config';

export const ERC721_INTERFACE_ID = '0x80ac58cd';
export const ERC1155_INTERFACE_ID = '0xd9b67a26';
export const SMART_CHAIN_TEST_NET_RPC_URL =
  'https://data-seed-prebsc-1-s1.binance.org:8545/';
export const ETH_MAIN_NET_RPC_URL = 'https://rpc.ankr.com/eth';
export const FOUR_BYTES_ETH_RPC_URL = 'http://erigon.4bytes.io';
export const CLOUD_FLARE_GATEWAY_ETH_RPC_URL =
  'https://cf.4bytes.io/v1/mainnet';
export const isProduction = +process.env.PRODUCTION === 1;
export const DATABASE_HOST: string = isProduction
  ? process.env.DATABASE_HOST
  : process.env.LOCAL_DATABASE_HOST;
export const DATABASE_PORT: number = isProduction
  ? +process.env.DATABASE_PORT
  : +process.env.LOCAL_DATABASE_PORT;
export const DATABASE_USERNAME: string = isProduction
  ? process.env.DATABASE_USERNAME
  : process.env.LOCAL_DATABASE_USERNAME;
export const DATABASE_PASSWORD: string = isProduction
  ? process.env.DATABASE_PASSWORD
  : process.env.LOCAL_DATABASE_PASSWORD;
export const DATABASE_NAME: string = isProduction
  ? process.env.DATABASE_NAME
  : process.env.LOCAL_DATABASE_NAME;
export const DATABASE_SCHEMA: string = isProduction
  ? process.env.DATABASE_SCHEMA
  : process.env.LOCAL_DATABASE_SCHEMA;
export const RABBITMQ_URL: string = isProduction
  ? process.env.RABBITMQ_URL
  : process.env.LOCAL_RABBITMQ_URL;

export const ERC20_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
export const INTERFACE_ERC155_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
export const ERC20_INTERFACE = new Interface(ERC20_ABI);
export const ERC20_HUMAN_READABLE_ABI = ERC20_INTERFACE.format(
  FormatTypes.full,
);
export const RABBITMQ_QUEUE_NAME = 'evm-indexer';

export const LIST_AVAILABLE_WORKERS = {
  SaveDataWorker: 'SaveData',
  PushEventWorker: 'PushEvent',
  FilterEventWorker: 'FilterEvent',
  ClearDatabase: 'ClearData',
  SaveLogWorker: 'SaveLog',
  SaveTransactionWorker: 'SaveTransaction',
  SaveTransferEventWorker: 'SaveTransfer',
  PushDeletePageWorker: 'PushDeletePage',
  DeleteDuplicateWorker: 'DeleteDuplicate',
  CrawlTokenHolderWorker: 'CrawlTokenHolder',
  PushTokenForCrawlerWorker: 'PushTokenForCrawler',
  PushTransferIDWorker: 'PushTransferID',
  TokenBalanceWorker: 'TokenBalance',
  UpdateTotalSupplyWorker: 'UpdateTotalSupply',
};

export const EVENT_TRANSFER_QUEUE_NAME = 'evm-indexer-event-transfer';
export const SAVE_LOG_QUEUE_NAME = 'evm-indexer-save-log';
export const SAVE_DATA_QUEUE_NAME = 'evm-indexer-save-data';
export const SAVE_TRANSFER_EVENT_QUEUE_NAME = 'evm-indexer-save-transfer_event';
export const PUSH_EVENT_ERROR_QUEUE_NAME = 'evm-indexer-push-event-error';
export const BLOCK_NUMBER_QUEUE_NAME = 'evm-indexer-block-number';
export const SAVE_LOG_ERROR_QUEUE_NAME = 'evm-indexer-save-log-error';
export const SAVE_TRANSACTION_QUEUE_NAME= 'evm-indexer-save-transaction';
export const DELETE_DUPLICATE_QUEUE_NAME = 'evm-indexer-delete-duplicate';
export const CRAWL_TOKEN_HOLDER_QUEUE_NAME = 'evm-indexer-crawl-token-holder';
export const TOKEN_BALANCE_QUEUE_NAME = 'evm-indexer-token-balance';
export const lastReadBlockRedisKey = 'evm-push-event-worker-last-read-block';
