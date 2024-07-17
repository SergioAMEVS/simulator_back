import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ChartConfig } from './chartconfig.entity';

@Entity()
export class Chart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({nullable: true})
  text: string;

  @OneToMany(() => ChartConfig, chartConfig => chartConfig.chart)
  config: ChartConfig;

}