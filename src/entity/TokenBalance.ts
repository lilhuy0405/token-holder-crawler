import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
class TokenBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  owner: string;

  @Column()
  balance: string;
}

export default TokenBalance;