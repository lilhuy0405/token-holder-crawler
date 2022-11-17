import {Repository} from "typeorm";
import TokenBalance from "../entity/TokenBalance";
import {AppDataSource} from "../data-source";
import TotalHolder from "../entity/TotalHolder";

class TotalHolderService {
  private readonly totalHolderRepository: Repository<TotalHolder>;


  constructor() {
    this.totalHolderRepository = AppDataSource.getRepository(TotalHolder);
  }

  async save(totalHolder: TotalHolder): Promise<TotalHolder> {
    return this.totalHolderRepository.save(totalHolder);
  }

  async findByToken(token: string): Promise<TotalHolder> {
    return this.totalHolderRepository.findOne({
      where: {tokenAddress: token},
    });
  }
}

export default TotalHolderService;