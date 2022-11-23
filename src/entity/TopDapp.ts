import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export default class TopDapp {

  @PrimaryColumn()
  name: string;

  @Column()
  url: string;

  @Column()
  rank: number;

  @Column()
  icon: string;

  @Column()
  category: string;

  @Column()
  balance: string;

  @Column()
  uaw: string;

  @Column()
  volume: string;

  @Column()
  chart: string;
}