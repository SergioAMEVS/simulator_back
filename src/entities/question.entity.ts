import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { ChartConfig } from './chartconfig.entity';
import { FilterValue } from './filtervalue.entity';
import { Option } from './option.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Text: string;

  @Column()
  Type: string;

  @ManyToMany(() => ChartConfig)
  chart: ChartConfig;

  @ManyToOne(() => FilterValue)
  filter: FilterValue;

  @OneToMany(() => Option, option => option.question)
  options: Option[];
}
