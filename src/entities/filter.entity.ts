import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { FilterValue } from './filtervalue.entity';

@Entity()
export class Filter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Name: string;

  @Column()
  order: number;

  @Column()
  icon: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  active: boolean;

  @Column({ nullable: true })
  selection: string;

  @OneToMany(() => FilterValue, filterValue => filterValue.filter)
  filterValues: FilterValue[];
}