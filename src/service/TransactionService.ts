import {Between, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository} from "typeorm";
import Transaction from "../entity/Transaction";
import {AppDataSource} from "../data-source";
import {ethers} from "ethers";

class TransactionService {
  private readonly transactionRepository: Repository<Transaction>;
  private readonly etherscanAPIKey = 'ABWQX1WVYGQ59Z1KA6897YRMIJ283KRY4R'

  constructor() {
    this.transactionRepository = AppDataSource.getRepository(Transaction);
  }

  private async save(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

  private async getTransactionBetweenBlockNumber(address: string, from: number, to: number, page = 1, size = 30): Promise<Transaction[]> {
    console.log(from, to);
    return this.transactionRepository.find({
      where: {
        from: address,
        block_number: Between(from, to)
      },
      skip: (page - 1) * size,
      take: size
    });
  }

  private async getTransactionGreaterThanBlockNumber(address: string, blockNumber: number, page = 1, size = 30): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        from: address,
        block_number: MoreThan(blockNumber)
      },
      skip: (page - 1) * size,
      take: size
    });
  }

  private async getTransactionLessThanBlockNumber(adress: string, blockNumber: number, page = 1, size = 30): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        from: adress,
        block_number: LessThan(blockNumber)
      },
      skip: (page - 1) * size,
      take: size
    });
  }

  private async getTransactionByFromAddress(from: string, page: number, size: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        from
      },
      skip: (page - 1) * size,
      take: size
    });
  }

  private async getUserTransactionFromEtherscan(address: string, startBlock?: string | undefined, endBlock?: string | undefined): Promise<any> {
    try {
      const scan = new ethers.providers.EtherscanProvider("homestead", this.etherscanAPIKey);
      const txns = await scan.getHistory(address, startBlock, endBlock);
      return txns;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async getUserTransaction(address: string, page: number, size: number, startBlock?: string | undefined, endBlock?: string | undefined): Promise<any> {
    try {
      let inDbTx = [];
      if (startBlock && endBlock) {
        console.log("startBlock && endBlock");
        inDbTx = await this.getTransactionBetweenBlockNumber(address, +startBlock, +endBlock, page, size);
      } else if (startBlock && !endBlock) {
        console.log("startBlock && !endBlock");
        inDbTx = await this.getTransactionGreaterThanBlockNumber(address, +startBlock, page, size);
      } else if (!startBlock && endBlock) {
        console.log("!startBlock && endBlock");
        inDbTx = await this.getTransactionLessThanBlockNumber(address, +endBlock, page, size);
      } else {
        console.log("else");
        inDbTx = await this.getTransactionByFromAddress(address, page, size);
      }
      if (inDbTx.length > 0) {
        return inDbTx;
      }
      let onChainTx = await this.getUserTransactionFromEtherscan(address, startBlock, endBlock);
      if (!onChainTx) {
        return [];
      }
      //save to db
      console.log("need to save to db")
      const savePromises = onChainTx.map(async (transaction: any) => {
        try {
          const toSaveTransaction = new Transaction();
          toSaveTransaction.tx_hash = transaction.hash;
          toSaveTransaction.block_number = Number(transaction.blockNumber);
          toSaveTransaction.gasPrice = transaction.gasPrice.toString();
          toSaveTransaction.nonce = transaction.nonce.toString();
          // console.log(transaction.nonce);
          toSaveTransaction.to = transaction.to;
          toSaveTransaction.value = transaction.value.toString();
          toSaveTransaction.data = transaction.data;
          toSaveTransaction.from = transaction.from;
          toSaveTransaction.signature = transaction.data;
          // console.log(transaction)
          const res = await this.save(toSaveTransaction);

          return res;
          // return null;

        } catch (e) {
          console.log(e);
          return null;
        }
      });
      const res = await Promise.all(savePromises);
      const validTx = res.filter((tx: any) => tx !== null);
      //paginate
      const start = +(page - 1) * +size;
      const end = +start + +size;
      console.log(start, end);
      return validTx.slice(start, end);
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}


export default TransactionService;
