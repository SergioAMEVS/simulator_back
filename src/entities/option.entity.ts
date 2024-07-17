import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question)
  question: Question;

  @Column()
  Text: string;

  @Column({ nullable: true })
  value: string;

  @OneToMany(() => Answer, answer => answer.option)
  answers: Answer[];
}
