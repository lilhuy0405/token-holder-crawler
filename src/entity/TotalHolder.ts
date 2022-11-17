import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
class TotalHolder {
  @PrimaryColumn()
  tokenAddress: string;

  @Column()
  totalHolder: number;
}

export default TotalHolder;