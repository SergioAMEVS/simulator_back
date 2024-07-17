import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Description } from './description.entity';
import { Answer } from './answer.entity';

@Entity()
export class Respondant {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Description, description => description.respondant)
  description: Description[];

  @OneToMany(() => Answer, answer => answer.respondant)
  answers: Answer[];

  respondants: Array<Respondant>;
}