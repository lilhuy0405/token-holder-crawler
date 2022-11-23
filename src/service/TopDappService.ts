import {Repository} from "typeorm";
import TopDapp from "../entity/TopDapp";
import {AppDataSource} from "../data-source";

export default class TopDappService {
  private readonly topDappRepository: Repository<TopDapp>;

  constructor() {
    this.topDappRepository = AppDataSource.getRepository(TopDapp);
  }

  public async saveOrUpdate(topDapp: TopDapp): Promise<TopDapp> {
    return this.topDappRepository.save(topDapp);
  }

  public async getAllSortedByRank(): Promise<TopDapp[]> {
    return this.topDappRepository.find({
      order: {
        rank: "ASC",
      },
    });
  }
}