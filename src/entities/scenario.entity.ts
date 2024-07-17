import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Scenario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  creation_date: string;

  @Column()
  last_modified: string;

  @ManyToOne(() => User, (user) => user.scenarios)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column()
  state: string;
}
