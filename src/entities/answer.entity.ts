import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Respondant } from './respondant.entity';
import { Option } from './option.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Respondant)
  respondant: Respondant;

  @ManyToOne(() => Option)
  option: Option;

  @Column({ nullable: true })
  value: string;
}