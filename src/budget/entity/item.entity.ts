import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Budget } from './budget.entity';
import {
  DecimalToString,
  DecimalTransformer,
} from '../dto/decimal-transformer';
import Decimal from 'decimal.js';
import { Transform } from 'class-transformer';
import { Category } from './category.enum';

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  budgetId: string;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  @Transform(({ value }) => DecimalToString(value), { toPlainOnly: true })
  cost: Decimal;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: Category, default: Category.Miscellaneous })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Budget, (budget) => budget.items, { cascade: true })
  @JoinColumn()
  budget: Budget;
}
