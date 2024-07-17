import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Filter } from './filter.entity';;
import { Description } from './description.entity';
import { Question } from './question.entity';

@Entity()
export class FilterValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  label: string;

  @Column({ nullable: true })
  group: string;

  @Column()
  value: string;

  @ManyToOne(() => Filter)
  filter: Filter;

  @Column()
  order: number;

  @OneToMany(() => Description, description => description.value)
  description: FilterValue[];

  @OneToMany(() => Question, question => question.filter)
  question: FilterValue[];
}