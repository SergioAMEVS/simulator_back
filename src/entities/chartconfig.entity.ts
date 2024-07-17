import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Chart } from './chart.entity';
import { Question } from './question.entity';

@Entity()
export class ChartConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  condition: string;

  @ManyToMany(() => Question)
  @JoinTable()
  question: Question;

  @ManyToOne(() => Chart)
  chart: Chart;

}