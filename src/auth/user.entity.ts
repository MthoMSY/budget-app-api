import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as encrypt from 'bcrypt';
import { Budget } from '../budget/entity/budget.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await encrypt.hash(password, this.salt);

    return hash === this.password;
  }

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];
}
