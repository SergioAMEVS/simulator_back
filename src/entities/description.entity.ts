import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Respondant } from './respondant.entity';
import { FilterValue } from './filtervalue.entity';

@Entity()
export class Description {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Respondant)
  respondant: Respondant;

  @ManyToOne(() => FilterValue)
  value: FilterValue;

  @Column({ nullable: true })
  additionalInfo: string;
}
