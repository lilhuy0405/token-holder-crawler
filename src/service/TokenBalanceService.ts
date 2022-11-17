import {Repository} from "typeorm";
import TokenBalance from "../entity/TokenBalance";
import {AppDataSource} from "../data-source";

class TokenBalanceService {
  private readonly tokenBalanceRepository: Repository<TokenBalance>;

  constructor() {
    this.tokenBalanceRepository = AppDataSource.getRepository(TokenBalance);
  }

  async save(tokenBalance: TokenBalance): Promise<TokenBalance> {
    return this.tokenBalanceRepository.save(tokenBalance);
  }

  async findAllByToken(token: string): Promise<TokenBalance[]> {
    return this.tokenBalanceRepository.find({
      where: {token},
    });
  }





}

export default TokenBalanceService;