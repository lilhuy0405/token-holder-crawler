import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
class Transaction {
  @PrimaryColumn()
  tx_hash: string;
  @Column({nullable: true})
  block_number: number;
  @Column({
    name: 'gas_price',
  })
  gasPrice: string;

  @Column({nullable: true})
  nonce: string;
  @Column()
  to: string;
  @Column({
    nullable: true,
  })
  from: string;
  @Column()
  value: string;
  @Column('text')
  data: string;
  @Column('text')
  signature: string;
}

export default Transaction;
