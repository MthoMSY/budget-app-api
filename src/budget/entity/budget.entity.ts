import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { User } from '../../auth/user.entity';
import {
  DecimalToString,
  DecimalTransformer,
} from '../dto/decimal-transformer';
import Decimal from 'decimal.js';
import { Transform } from 'class-transformer';

@Entity()
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: false,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  @Transform(({ value }) => DecimalToString(value), { toPlainOnly: true })
  limit: Decimal;

  @OneToMany(() => Item, (item) => item.budget)
  items: Item[];

  @ManyToOne(() => User, (user) => user.budgets, { cascade: true })
  @JoinColumn()
  user: User;
}
