import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Scenario } from './scenario.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameID: string;

  @Column()
  creation_date: string;

  @OneToMany(() => Scenario, (scenario) => scenario.user)
  scenarios: Scenario[];
}
